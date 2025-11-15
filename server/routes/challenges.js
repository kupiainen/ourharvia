import express from "express";
import { queryHarviaTelemetry } from "../utils/telemetry.js"
import { supabase } from "../config/supabase.js";
import { activateChallengeBodySchema, activateChallengeParamsSchema } from "../validators/challenges.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { type = "all" } = req.query;

    let query = supabase.from("challenges").select("*");

    if (type !== "all") {
      query = query.eq("challenge_type", type);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching challenges:", error);
      return res.status(500).json({ message: "Failed to fetch challenges" });
    }

    return res.status(200).json({
      type,
      count: data?.length || 0,
      challenges: data,
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
})

router.post("/:challengeId/activate", async (req, res) => {
  // Validate params

    const { error: paramErr } = activateChallengeParamsSchema.validate(req.params);
  if (paramErr) {
    return res.status(400).json({
      error: "INVALID_PARAMS",
      message: paramErr.details[0].message,
    });

  }

  /* -------------------------
     Validate body
  -------------------------- */
  const { error: bodyErr } = activateChallengeBodySchema.validate(req.body);
  if (bodyErr) {
    return res.status(400).json({
      error: "INVALID_BODY",
      message: bodyErr.details[0].message,
    });
  }

  const { challengeId } = req.params;
  const userId = "4169d4ca-ca75-4122-8d9e-cd88de0721d2"; // not assume middleware already adds authenticated user

  try {
    /* -------------------------
       1. Fetch challenge
    -------------------------- */
    const { data: challenge, error: challengeErr } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", challengeId)
      .single();

    if (challengeErr || !challenge) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Challenge does not exist.",
      });
    }

    /* -------------------------
       2. Handle challenge types
          - personal: free
          - community: free
          - group: must be in a group
    -------------------------- */
    let groupId = null;

    if (challenge.type === "group") {
      const { data: membership, error: membershipErr } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", userId)
        .single();

      if (!membership || membershipErr) {
        return res.status(400).json({
          error: "GROUP_REQUIRED",
          message: "You need to be in a group to activate this challenge.",
        });
      }

      groupId = membership.group_id;
    }

    /* -------------------------
       3. Upsert into challenge_progress
    -------------------------- */
    const { data: progress, error: progressErr } = await supabase
      .from("challenge_progress")
      .upsert(
        {
          user_id: userId,
          challenge_id: challengeId,
          is_activated: true,
          group_id: groupId,
          joined_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,challenge_id" }
      )
      .select()
      .single();

    if (progressErr) {
      return res.status(500).json({
        error: "DB_ERROR",
        message: progressErr.message,
      });
    }

    /* -------------------------
       Response
    -------------------------- */
    return res.json({
      success: true,
      challengeId,
      activated: true,
      group_id: groupId,
      progress,
    });

  } catch (err) {
    return res.status(500).json({
      error: "UNEXPECTED",
      message: err.message,
    });
  }
});



export default router;