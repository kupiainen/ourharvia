import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { supabase } from "./config/supabase.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => res.send("API is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
