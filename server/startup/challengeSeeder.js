import { supabase } from "../config/supabase.js";
import challengeList from "./presetChallenges.js";

export const BADGE_BUCKET = "badges";
// fallback badge (ensure this one exists in the bucket)
const FALLBACK_BADGE_NAME = "power_hour";

async function getBadgeUrl(badgeName) {
  const filePath = `${badgeName}.png`;

  // check if file exists in bucket
  const { data, error } = await supabase.storage
    .from(BADGE_BUCKET)
    .list("", { search: filePath });

    console.log("Badge lookup:", filePath, data);
//   if (error || !data || data.length === 0) {
//     console.warn(`⚠ Badge not found: ${filePath}, using fallback.`);
//     console.log(error);
//     return supabase.storage
//       .from(BADGE_BUCKET)
//       .getPublicUrl(`${FALLBACK_BADGE_NAME}.png`).data.publicUrl;
//   }

  // return public URL
  return supabase.storage
    .from(BADGE_BUCKET)
    .getPublicUrl(filePath).data.publicUrl;
}

export async function seedChallenges() {
  const { count } = await supabase
    .from("challenges")
    .select("*", { count: "exact", head: true });

  if (count > 0) {
    console.log("Challenges already exist → skipping seed.");
    return;
  }

  console.log("🌱 Seeding challenges...");

  for (const challenge of challengeList) {
    const iconUrl = await getBadgeUrl(challenge.badge_name);

    const dataToInsert = {
      ...challenge,
      badge_icon_url: iconUrl,
      start_date: new Date(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    console.log("Inserting challenge:", dataToInsert);
    const { error } = await supabase.from("challenges").insert(dataToInsert);

    if (error) console.error("Insert error:", error);
    else console.log(`Inserted challenge: ${challenge.title}`);
  }

  console.log("🌱 Challenge seed complete.");
}