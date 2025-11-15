import express from "express";
import { supabase } from "../config/supabase.js";


const router = express.Router();



router.post("/create_group", async (req, res) => {
    try {
        const { group_name } = req.body;
        if (!group_name) {
            return res.status(400).json({ error: "'group_name' is required in the body" });
        }
        // Insert group
        const { data: group_inserted, error } = await supabase
            .from("groups")
            .insert({
                creator_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2",
                name: group_name,
            })
            .select()
            .single();
        if (group_inserted) {
            const { data: inserted, error } = await supabase
                .from("group_members")
                .insert({
                    group_id: group_inserted.id,
                    user_id: "4169d4ca-ca75-4122-8d9e-cd88de0721d2",
                    role: "owner"
                })
                .select()
                .single();
            if (error) {
                return res.status(500).json({ error: "Failed to create group member in Supabase" });
            }
            return res.json({ group: group_inserted });
        }   
        if (error) {
            return res.status(500).json({ error: "Failed to create group in Supabase" });
        }

        
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/create_members", async (req, res) => {
    try {

        // Insert into Supabase
        const { data: inserted, error } = await supabase
            .from("group_members")
            .insert({
                group_id: "b522524a-b36d-4e22-837f-bd02b9405379",
                user_id: "a9514cc2-a619-4d46-9c02-0fa0804d8d6e",
                role: "member"
            })
            .select()
            .single();

        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to create group in Supabase" });
        }

        return res.json({ group: inserted });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;