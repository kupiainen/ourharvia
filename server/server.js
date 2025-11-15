import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import users from "./routes/session.js";
import { supabase } from "./config/supabase.js";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())
// app.use("/auth", authRoutes);
app.use("/users", users);


app.get("/", (req, res) => res.send("API is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
