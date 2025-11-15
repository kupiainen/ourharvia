import multer from "multer";
import { supabase } from "../config/supabase.js";
import { randomUUID } from "crypto";

export const upload = multer({ storage: multer.memoryStorage() });

export async function uploadToBucket(file) {
  if (!file) return null;

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("profile-pictures")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(fileName);

  return publicUrl;
}
