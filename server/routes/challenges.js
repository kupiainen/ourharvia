import express from "express";
import { queryHarviaTelemetry } from "../utils/telemetry.js"
import { supabase } from "../config/supabase.js";
import { activateChallengeBodySchema, activateChallengeParamsSchema } from "../validators/challenges.js";
const router = express.Router();

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: Fetch all challenges with optional filtering by type
 *     tags: [Challenges]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, personal, group, community]
 *         description: Filter challenges by type. Defaults to "all".
 *     responses:
 *       200:
 *         description: List of challenges returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: "all"
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 challenges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       id: "7a8e4f1b-6f10-4ee3-8b7c-1df8b1c8b3a1"
 *                       title: "7-Day Sauna Streak"
 *                       description: "Do sauna 7 days in a row"
 *                       challenge_type: "personal"
 *                       target_sessions: 7
 *                       target_duration_minutes: null
 *                       target_temperature: null
 *                       start_date: "2025-01-01T00:00:00Z"
 *                       end_date: "2025-01-08T00:00:00Z"
 *                       reward_points: 100
 *                       difficulty_level: "medium"
 *       500:
 *         description: Server error while fetching challenges
 */


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


/**
 * @swagger
 * /challenges/{challengeId}/activate:
 *   post:
 *     summary: Activate a challenge for the authenticated user
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the challenge to activate
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Currently empty, reserved for future fields
 *             example: {}
 *     responses:
 *       200:
 *         description: Challenge activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 challengeId:
 *                   type: string
 *                   format: uuid
 *                   example: "7a8e4f1b-6f10-4ee3-8b7c-1df8b1c8b3a1"
 *                 activated:
 *                   type: boolean
 *                   example: true
 *                 group_id:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                   example: null
 *                 progress:
 *                   type: object
 *                   example:
 *                     id: "c2f7e8d5-0a0b-45e0-bf33-8a1a8d9c3eaa"
 *                     user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2"
 *                     challenge_id: "7a8e4f1b-6f10-4ee3-8b7c-1df8b1c8b3a1"
 *                     is_activated: true
 *                     group_id: null
 *                     joined_date: "2025-11-16T12:00:00.000Z"
 *                     updated_at: "2025-11-16T12:00:00.000Z"
 *                     sessions_completed: 0
 *                     completion_percent: 0
 *       400:
 *         description: Invalid params or challenge requires user to be in a group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "INVALID_PARAMS"
 *                 message: "\"challengeId\" must be a valid UUID"
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "NOT_FOUND"
 *                 message: "Challenge does not exist."
 *       500:
 *         description: Unexpected server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: "DB_ERROR"
 *                 message: "Database query failed"
 */


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