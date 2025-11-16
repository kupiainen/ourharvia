import express from "express";
import { getTelemetryStats, insertSaunaSession, updateGroupStats, fetchUserSessions, fetchUserStats, updateUserStats } from "../utils/sessionHelper.js";

const router = express.Router();

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
 *     summary: Create a sauna session and update related group stats
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
 *                   description: Inserted session data
 *                   example:
 *                     id: "14a9eb79-8cde-4dc4-9f93-88990d01e241"
 *                     user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2"
 *                     group_id: "b522524a-b36d-4e22-837f-bd02b9405379"
 *                     session_start: "2025-11-12T17:44:57.112Z"
 *                     session_end: "2025-11-12T17:51:03.123Z"
 *                     duration_minutes: 6
 *                     average_temperature: 70.5
 *                     peak_temperature: 78.0
 *                     humidity_percent: 15.2
 *                     exp_gained: 1
 *       400:
 *         description: Missing required fields or environment variables
 *       500:
 *         description: Internal server error while processing or inserting
 */
router.post("/create_session", async (req, res) => {
  try {
    const { from, to, group_id } = req.body;
    const startTs = new Date(from);
    const endTs = new Date(to);
    const durationMinutes = Math.round((endTs - startTs) / 60000);
    const expGained = Math.round(durationMinutes / 5);

    const { avgTemp, avgHum, peakTemp } = await getTelemetryStats(from, to);
    const userId = "4169d4ca-ca75-4122-8d9e-cd88de0721d2"; // example

    const session = await insertSaunaSession(
      userId, group_id, startTs, endTs, durationMinutes, avgTemp, peakTemp, avgHum, expGained
    );

    if (group_id) await updateGroupStats(group_id, avgTemp, durationMinutes);

    // **Update cumulative user stats directly**
    const updatedStats = await updateUserStats(userId, {
      duration_minutes: durationMinutes,
      average_temperature: avgTemp,
      exp_gained: expGained
    });

    res.json({updatedStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /session/get_sessions:
 *   get:
 *     summary: Get all sauna sessions for a user
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
 *                       session_end: "2025-11-12T17:51:03.123Z"
 *                       duration_minutes: 6
 *                       average_temperature: 70.5
 *                       peak_temperature: 78.0
 *                       humidity_percent: 15.2
 *                       exp_gained: 1
 *       500:
 *         description: Failed to fetch sessions
 */
router.get("/get_sessions", async (req, res) => {
  try {
    const userId = "4169d4ca-ca75-4122-8d9e-cd88de0721d2"; // hardcoded
    const sessions = await fetchUserSessions(userId);
    res.json({ sessions, num_sessions: sessions.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

