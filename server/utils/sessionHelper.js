import { queryHarviaTelemetry } from "./telemetry.js";
import { supabase } from "../config/supabase.js";

// Fetch telemetry and calculate averages
export async function getTelemetryStats(from, to) {
  const devId = process.env.HARVIA_DEVICE_ID;
  const cabId = process.env.HARVIA_CABIN_ID;
  const username = process.env.HARVIA_USERNAME;
  const password = process.env.HARVIA_PASSWORD;

  if (!devId || !cabId || !username || !password) {
    throw new Error("Missing Harvia environment variables");
  }

  const data = await queryHarviaTelemetry(
    from,
    to,
    devId,
    cabId,
    { username, password },
    { samplingMode: process.env.HARVIA_SAMPLING_MODE ?? "average", sampleAmount: Number(process.env.HARVIA_SAMPLE_AMOUNT ?? 60) }
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

  return {
    avgTemp: tCount ? tSum / tCount : 0,
    avgHum: hCount ? hSum / hCount : 0,
    peakTemp,
  };
}

// Insert sauna session
export async function insertSaunaSession(userId, groupId, startTs, endTs, durationMinutes, avgTemp, peakTemp, avgHum, expGained) {
  const { data, error } = await supabase
    .from("sauna_sessions")
    .insert({
      user_id: userId,
      group_id: groupId ?? null,
      session_start: startTs.toISOString(),
      session_end: endTs.toISOString(),
      duration_minutes: durationMinutes,
      average_temperature: avgTemp,
      peak_temperature: peakTemp,
      humidity_percent: avgHum,
      exp_gained: expGained,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update group stats
export async function updateGroupStats(groupId, avgTemp, durationMinutes) {
  const { data: groupMembers } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId);

  const number_members = groupMembers.length;

  const { data, error } = await supabase
    .from("group_stats")
    .insert({
      group_id: groupId,
      total_sessions: 1,
      total_members: number_members,
      average_group_temperature: avgTemp,
      total_group_time_minutes: durationMinutes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch sessions for a user
export async function fetchUserSessions(userId) {
  const { data, error } = await supabase
    .from("sauna_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("session_start", { ascending: false });

  if (error) throw error;
  return data;
}
