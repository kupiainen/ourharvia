import express from "express";
import { getTelemetryStats, insertSaunaSession, updateGroupStats, fetchUserSessions,fetchUserStats,updateUserStats } from "../utils/sessionHelper.js";

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
    if (!from || !to) return res.status(400).json({ error: "'from' and 'to' are required" });

    const startTs = new Date(from);
    const endTs = new Date(to);
    const durationMinutes = Math.round((endTs - startTs) / 60000);
    const expGained = Math.round(durationMinutes / 5);

    const { avgTemp, avgHum, peakTemp } = await getTelemetryStats(from, to);

    const userId = "4169d4ca-ca75-4122-8d9e-cd88de0721d2"; // hardcoded for now

    const session = await insertSaunaSession(userId, group_id, startTs, endTs, durationMinutes, avgTemp, peakTemp, avgHum, expGained);

    if (group_id) await updateGroupStats(group_id, avgTemp, durationMinutes);

    res.json({ session });
  } catch (err) {
    console.error(err);
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

/**
 * @swagger
 * /user_stats/update/{user_id}:
 *   post:
 *     summary: Update cumulative stats for a user after a session
 *     tags: [UserStats]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to update stats for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration_minutes
 *               - average_temperature
 *               - exp_gained
 *             properties:
 *               duration_minutes:
 *                 type: integer
 *                 example: 15
 *               average_temperature:
 *                 type: number
 *                 example: 72.5
 *               exp_gained:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: User stats updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "c2f7e8d5-0a0b-45e0-bf33-8a1a8d9c3eaa"
 *                 user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2"
 *                 total_sessions: 5
 *                 total_time_minutes: 150
 *                 average_temperature: 72.3
 *                 user_exp: 30
 *                 last_session_date: "2025-11-15T19:04:47.744Z"
 *       400:
 *         description: Missing required session data
 *       500:
 *         description: Internal server error while updating stats
 */
router.post("/user_stats/update/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const { duration_minutes, average_temperature, exp_gained } = req.body;
    const updatedStats = await updateUserStats(user_id, { duration_minutes, average_temperature, exp_gained });
    res.json(updatedStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /user_stats/{user_id}:
 *   get:
 *     summary: Get cumulative stats for a user
 *     tags: [UserStats]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to fetch stats for
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "c2f7e8d5-0a0b-45e0-bf33-8a1a8d9c3eaa"
 *                 user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2"
 *                 total_sessions: 5
 *                 total_time_minutes: 150
 *                 average_temperature: 72.3
 *                 user_exp: 30
 *                 last_session_date: "2025-11-15T19:04:47.744Z"
 *       404:
 *         description: No stats found for this user
 *       500:
 *         description: Internal server error
 */
router.get("/user_stats/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const stats = await fetchUserStats(user_id);
    if (!stats) return res.status(404).json({ error: "No stats found for this user" });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
