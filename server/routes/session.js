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