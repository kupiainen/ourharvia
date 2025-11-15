import express from "express";
import { queryHarviaTelemetry } from "../utils/telemetry.js"
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.post("/create_session", async (req, res) => {
  try {
    const { from, to, group_id } = req.body;
    if (!from || !to) {
      return res.status(400).json({ error: "'from' and 'to' are required in the body" });
    }

    const devId = process.env.HARVIA_DEVICE_ID;
    const cabId = process.env.HARVIA_CABIN_ID;
    const username = process.env.HARVIA_USERNAME;
    const password = process.env.HARVIA_PASSWORD;

    if (!devId || !cabId || !username || !password) {
      return res.status(400).json({ error: "Missing Harvia environment variables" });
    }

    const data = await queryHarviaTelemetry(
      from,
      to,
      process.env.HARVIA_DEVICE_ID,
      process.env.HARVIA_CABIN_ID,
      {
        username: process.env.HARVIA_USERNAME,
        password: process.env.HARVIA_PASSWORD,
      },
      {
        samplingMode: process.env.HARVIA_SAMPLING_MODE ?? "average",
        sampleAmount: Number(process.env.HARVIA_SAMPLE_AMOUNT ?? 60),
      }
    );
    const measurements = data?.measurements ?? [];

    let tSum = 0, tCount = 0;
    let hSum = 0, hCount = 0;
    let peakTemp = -Infinity;

    for (const m of measurements) {
      const t = m?.data?.temp;
      const h = m?.data?.hum;

      if (typeof t === "number") {
        tSum += t;
        tCount++;
        if (t > peakTemp) peakTemp = t;
      }
      if (typeof h === "number") {
        hSum += h;
        hCount++;
      }
    }

    const avgTemp = tCount ? tSum / tCount : 0;
    const avgHum = hCount ? hSum / hCount : 0;

    // Compute duration
    const startTs = new Date(from);
    const endTs = new Date(to);
    const durationMinutes = Math.round((endTs - startTs) / 60000);
    const exp_gained = Math.round(durationMinutes / 5);
    // Insert into Supabase
    const { data: group, error } = await supabase
      .from("groups")
      .select("*")
      .eq("creator_id", "4169d4ca-ca75-4122-8d9e-cd88de0721d2")
      .single();
    if (group) {
      const { data: groupMembers } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", "b522524a-b36d-4e22-837f-bd02b9405379")
      const number_members = groupMembers.length;
      console.log("NUMBER MEMBERS:", number_members);
      if (group) {
        const { data: inserted_person_sauna, error } = await supabase
          .from("sauna_sessions")
          .insert({
            user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2",
            group_id: group_id ?? null,
            session_start: startTs.toISOString(),
            session_end: endTs.toISOString(),
            duration_minutes: durationMinutes,
            average_temperature: avgTemp,
            peak_temperature: peakTemp,
            humidity_percent: avgHum,
            exp_gained: exp_gained,
          })
          .select()
          .single();
        if (inserted_person_sauna) {
          console.log(group);
          const { data: inserted, error } = await supabase
            .from("group_stats")
            .insert({
              group_id: group.id,
              total_sessions: 1,
              total_members: number_members,
              average_group_temperature: avgTemp,
              total_group_time_minutes: durationMinutes,
            })
            .select()
            .single();
            console.log("INSERTED GROUP STATS:", inserted);
          if (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to create group stats in Supabase" });
          }
          return res.json({ session: inserted });
        }
      }
    }

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to insert into Supabase" });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/get_sessions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sauna_sessions")
      .select("*")
      .eq("user_id", "4169d4ca-ca75-4122-8d9e-cd88de0721d2")
      .order("session_start", { ascending: false });
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch sessions from Supabase" });
    }

    return res.json({ sessions: data, num_sessions: data.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
export default router;

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Sauna session tracking and telemetry processing
 */

/**
 * @swagger
 * /session/create_session:
 *   post:
 *     summary: Create a sauna session and insert related group stats
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *             properties:
 *               from:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-12T17:44:57.112Z"
 *               to:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-12T17:51:03.123Z"
 *               group_id:
 *                 type: string
 *                 nullable: true
 *                 example: "b522524a-b36d-4e22-837f-bd02b9405379"
 *     responses:
 *       200:
 *         description: Session successfully created and stats updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   description: Inserted group stats record
 *                   example:
 *                     id: "14a9eb79-8cde-4dc4-9f93-88990d01e241"
 *                     group_id: "b522524a-b36d-4e22-837f-bd02b9405379"
 *                     total_sessions: 1
 *                     total_members: 5
 *                     average_group_temperature: 76.4
 *                     total_group_time_minutes: 12
 *       400:
 *         description: Missing required fields or env variables
 *       500:
 *         description: Internal server error while processing or inserting
 */

/**
 * @swagger
 * /session/get_sessions:
 *   get:
 *     summary: Get all sauna sessions for the logged-in user
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: List of sessions returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 num_sessions:
 *                   type: integer
 *                   example: 3
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       id: "cc7ac3c8-c4a2-4a2a-bd2b-23f9a9443d2f"
 *                       user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2"
 *                       group_id: "b522524a-b36d-4e22-837f-bd02b9405379"
 *                       session_start: "2025-11-12T17:44:57.112Z"
 *                       session_end: "2025-11-12T17:56:03.123Z"
 *                       duration_minutes: 11
 *                       average_temperature: 63.1
 *                       peak_temperature: 78.3
 *                       humidity_percent: 12.4
 *                       exp_gained: 3
 *       500:
 *         description: Failed to fetch sessions
 */
