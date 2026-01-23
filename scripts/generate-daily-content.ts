import "dotenv/config";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

// 1. Runtime Environment Validation using Zod
const EnvSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "Google API Key is missing"),
  DATABASE_URL: z.string().min(1, "Database URL is missing"),
});

const envParse = EnvSchema.safeParse(process.env);

if (!envParse.success) {
  console.error("❌ Invalid environment variables:");
  console.error(envParse.error.format());
  process.exit(1);
}

const { GOOGLE_GENERATIVE_AI_API_KEY, DATABASE_URL } = envParse.data;

const sql = neon(DATABASE_URL);

const PROMPT = `Generate an engaging, thought-provoking passage for speed reading practice. 

Requirements:
- Length: 300-340 words (keep it punchy and concise)
- Topic: Choose from technology, science, philosophy, psychology, productivity, creativity, or human potential
- Style: Clear, intellectual, flowing prose that builds momentum
- Tone: Subtly motivational and uplifting - leave the reader feeling inspired or energized
- No headers, bullet points, or formatting - just clean paragraphs
- Start with an interesting hook
- Include some surprising facts or perspectives
- End with an empowering, thought-provoking conclusion that encourages action or reflection

The text should be enjoyable to read at high speed while still being meaningful, memorable, and leaving the reader with a spark of motivation.`;

async function generateContent(): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: PROMPT,
  });

  if (!text) {
    throw new Error("Generated content is empty");
  }

  return text.trim();
}

async function getNextDate(): Promise<string> {
  // Generate content for tomorrow (server time agnostic, using UTC)
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(now.getUTCDate() + 1);
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

  const MAX_RETRIES = 3;
  let attempt = 1;

  while (attempt <= MAX_RETRIES) {
    try {
      console.log(`\n🔄 Attempt ${attempt}/${MAX_RETRIES}`);

      const date = await getNextDate();
      console.log(`📅 Generating content for: ${date}`);

      const content = await generateContent();
      console.log(`✅ Generated ${content.split(/\s+/).length} words`);

      await saveToDatabase(content, date);
      console.log(`💾 Saved to database successfully!`);

      console.log("\n--- Preview ---");
      console.log(content.slice(0, 200) + "...");

      // Success - exit normally
      process.exit(0);
    } catch (error) {
      console.error(`❌ Error on attempt ${attempt}:`, error);

      // Basic check for error context (e.g., if it's an object with a message)
      if (error instanceof Error) {
        console.error("   Message:", error.message);
      }

      attempt++;

      if (attempt > MAX_RETRIES) {
        console.error("💀 All retry attempts failed. Exiting.");
        process.exit(1);
      }

      // Exponential backoff: 2s, 4s, 8s...
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${delay / 1000} seconds before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

main();
