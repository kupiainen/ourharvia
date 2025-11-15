import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { upload, uploadToBucket } from "../utils/upload.js";
import { signUpSchema, loginSchema } from "../validators/auth.js";

const router = express.Router();

/* ---------------- SIGN UP ---------------- */
router.post("/sign_up", upload.single("avatar"), async (req, res) => {
  try {
    const { error: validateError } = signUpSchema.validate(req.body);
    if (validateError) return res.status(400).json({ error: validateError.message });

    const { email, password, full_name } = req.body;

    // Upload avatar (optional)
    let avatar_url = null;
    if (req.file) avatar_url = await uploadToBucket(req.file);

    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("profiles")
      .insert([{ email, password: hashed, full_name, avatar_url }])
      .select()
      .single();

    if (error) throw error;

    return res.json({ message: "User created", user: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { error: validateError } = loginSchema.validate(req.body);
    if (validateError) return res.status(400).json({ error: validateError.message });

    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
