/**
 * Daily Content Generator for Curt
 *
 * This script runs daily via GitHub Actions to generate
 * a new speed reading text using Gemini AI and stores it
 * in the Neon database for the next day.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from "@neondatabase/serverless";

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!GEMINI_API_KEY) {
  throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required");
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(DATABASE_URL);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const PROMPT = `Generate an engaging, thought-provoking passage for speed reading practice. 

Requirements:
- Length: 350-450 words
- Topic: Choose from technology, science, philosophy, psychology, productivity, creativity, or human potential
- Style: Clear, intellectual, flowing prose that builds momentum
- No headers, bullet points, or formatting - just clean paragraphs
- Start with an interesting hook
- Include some surprising facts or perspectives
- End with a thought-provoking conclusion

The text should be enjoyable to read at high speed while still being meaningful and memorable.`;

async function generateContent(): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(PROMPT);
  const response = await result.response;
  const text = response.text();

  if (!text || text.length < 100) {
    throw new Error("Generated content is too short or empty");
  }

  return text.trim();
}

async function getNextDate(): Promise<string> {
  // Generate content for tomorrow (since this runs at 11 PM)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD
}

async function saveToDatabase(content: string, date: string): Promise<void> {
  // Check if content already exists for this date
  const existing = await sql`
    SELECT id FROM daily_texts WHERE date = ${date}
  `;

  if (existing.length > 0) {
    console.log(`Content for ${date} already exists, updating...`);
    await sql`
      UPDATE daily_texts 
      SET content = ${content}, updated_at = NOW()
      WHERE date = ${date}
    `;
  } else {
    console.log(`Creating new content for ${date}...`);
    await sql`
      INSERT INTO daily_texts (content, date, created_at)
      VALUES (${content}, ${date}, NOW())
    `;
  }
}

async function main() {
  console.log("🚀 Starting daily content generation...");

  try {
    const date = await getNextDate();
    console.log(`📅 Generating content for: ${date}`);

    const content = await generateContent();
    console.log(`✅ Generated ${content.split(/\s+/).length} words`);

    await saveToDatabase(content, date);
    console.log(`💾 Saved to database successfully!`);

    console.log("\n--- Preview ---");
    console.log(content.slice(0, 200) + "...");
  } catch (error) {
    console.error("❌ Error generating content:", error);
    process.exit(1);
  }
}

main();
