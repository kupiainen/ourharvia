/** @format */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { v4 as uuid } from "uuid";

const elevenlabs = new ElevenLabsClient({
  apiKey: "sk_18ef801de9d1e81b0d40cb3cee01506e05c43a1b26c9d8e5",
});

export async function getSpeechToken(): Promise<string> {
  const response = await fetch("https://api.elevenlabs.io/v1/single-use-token/realtime_scribe", {
    method: "POST",
    headers: {
      "xi-api-key": "sk_18ef801de9d1e81b0d40cb3cee01506e05c43a1b26c9d8e5",
    },
  });

  const data = await response.json();
  return data.token;
}

// Convert browser ReadableStream → Blob → Audio URL
export async function createAudioUrlFromText(text: string): Promise<string> {
  const stream = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
    modelId: "eleven_multilingual_v2",
    text,
    outputFormat: "mp3_44100_128",
    voiceSettings: {
      stability: 0,
      similarityBoost: 0,
      useSpeakerBoost: true,
      speed: 1.0,
    },
  });

  const reader = stream.getReader();
  const chunks: BlobPart[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) {
      // Push the Uint8Array directly; it's already a valid BlobPart
      chunks.push(value as BlobPart);
    }
  }

  const blob = new Blob(chunks, { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}

export const parseTemperatureCommand = (text: string) => {
  const normalizedText = text.toLowerCase().trim();

  // Regex to capture: increase/decrease + number (in words or digits) + degrees
  const match = normalizedText.match(/(increase|decrease)\s+(?:the\s+)?temperature\s+by\s+(\w+)\s+degrees?/i);

  if (!match) return null;

  const action = match[1]; // "increase" or "decrease"
  const numberWord = match[2]; // "twenty", "10", etc.

  // Convert word to number
  const numberMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
  };

  // Check if it's already a digit
  const value = isNaN(Number(numberWord)) ? numberMap[numberWord.toLowerCase()] : Number(numberWord);

  if (!value) return null;

  return {
    action,
    value: action === "increase" ? value : -value,
  };
};
