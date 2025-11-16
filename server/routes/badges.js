import express from "express";
import { queryHarviaTelemetry } from "../utils/telemetry.js"
import { getUserBadgesSchema } from "../validators/badges.js";
import { supabase } from "../config/supabase.js";
const router = express.Router();

/**
 * @swagger
 * /user/{userId}/badges:
 *   get:
 *     summary: Fetch all badges earned by a user (completed challenges only)
 *     tags: [Badges]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the user whose badges you want to fetch
 *     responses:
 *       200:
 *         description: List of earned badges returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 badges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       badge_name:
 *                         type: string
 *                         example: "Heat Master"
 *                       badge_url:
 *                         type: string
 *                         example: "https://example.com/badges/heatmaster.png"
 *       400:
 *         description: Invalid userId provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "userId must be a valid UUID"
 *       500:
 *         description: Database or server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */



router.get("/user/:userId", async (req, res) => {
  // Validate params
  const { error, value } = getUserBadgesSchema.validate(req.params);
  if (error)
    return res.status(400).json({ error: error.details[0].message });

  const { userId } = value;

  // Fetch completed challenge progress + join challenge table
  const { data, error: dbError } = await supabase
    .from("challenge_progress")
    .select(`
      id,
      is_completed,
      completion_percent,
      challenge:challenge_id (
        badge_name,
        badge_icon_url
      )
    `)
    .eq("user_id", userId)
    .eq("is_completed", true);

  if (dbError) {
    return res.status(500).json({ error: dbError.message });
  }

  // Clean output: return only badge_name & badge_url
  const badges = data
    .filter(row => row.challenge) // exclude missing relations
    .map(row => ({
      badge_name: row.challenge.badge_name,
      badge_url: row.challenge.badge_icon_url,
    }));

  return res.json({ badges });
});

export default router;