import express from "express";
import { getTelemetryStats, insertSaunaSession, updateGroupStats, fetchUserSessions, fetchUserStats, updateUserStats } from "../utils/sessionHelper.js";
const router = express.Router();
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


export default router;