import express from "express";
import {fetchUserStats, updateUserStats, fetchAllUserStats } from "../utils/sessionHelper.js";
const router = express.Router();
/**
 * @swagger
 * /users/user_stats/update/{user_id}:
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
 * /users/user_stats/{user_id}:
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
/**
 * @swagger
 * /users/user_stats_all:
 *   get:
 *     summary: Get cumulative stats for all users
 *     tags: [UserStats]
 *     responses:
 *       200:
 *         description: List of all user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                   total_sessions:
 *                     type: integer
 *                   total_time_minutes:
 *                     type: integer
 *                   average_temperature:
 *                     type: number
 *                   user_exp:
 *                     type: integer
 *                   last_session_date:
 *                     type: string
 *                     format: date-time
 *             example:
 *               - id: "c2f7e8d5-0a0b-45e0-bf33-8a1a8d9c3eaa"
 *                 user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2"
 *                 total_sessions: 5
 *                 total_time_minutes: 150
 *                 average_temperature: 72.3
 *                 user_exp: 30
 *                 last_session_date: "2025-11-15T19:04:47.744Z"
 *               - id: "9f2a1e7c-02c1-49e6-9a1d-1234abcd5678"
 *                 user_id: "7d8c0dff-36bb-4220-b1cd-e693b2fd0b11"
 *                 total_sessions: 2
 *                 total_time_minutes: 60
 *                 average_temperature: 68.0
 *                 user_exp: 12
 *                 last_session_date: "2025-11-14T18:04:47.744Z"
 *       404:
 *         description: No user stats found
 *       500:
 *         description: Internal server error
 */

router.get("/user_stats_all", async (req, res) => {
    try {
        const stats = await fetchAllUserStats();
        if (!stats) return res.status(404).json({ error: "No stats found for this user" });
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;