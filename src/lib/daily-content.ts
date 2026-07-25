import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { neon } from "@neondatabase/serverless";

export const DAILY_CONTENT_MODEL = "gemini-3-flash-preview";
export const OPENROUTER_BACKFILL_MODEL = "google/gemini-2.5-flash-lite";

const DAILY_TOPICS = [
  "a breakthrough in neuroscience or psychology",
  "a counterintuitive idea from behavioral economics",
  "a lesson from sports, music, or craft mastery",
  "a historical invention that changed daily life",
  "a productivity principle backed by research",
  "a design or engineering tradeoff",
  "a habit-building insight",
  "a creativity technique used by artists or writers",
  "a communication skill that improves thinking",
  "a memory or learning technique",
  "a decision-making framework",
  "a story from aviation, medicine, or space exploration",
] as const;

const OPENING_STYLES = [
  "Open with a surprising specific fact or statistic.",
  "Open with a short vivid scene from everyday life.",
  "Open with a direct question that challenges a common assumption.",
  "Open with a bold, concrete claim — not a metaphor.",
  "Open with a brief historical anecdote about a real person or event.",
  "Open with a common mistake people make, then flip it.",
] as const;

function hashDate(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function buildDailyContentPrompt(date: string): string {
  const topic = DAILY_TOPICS[hashDate(date) % DAILY_TOPICS.length];
  const openingStyle =
    OPENING_STYLES[hashDate(`${date}-opening`) % OPENING_STYLES.length];

  return `Write a speed-reading practice passage for ${date}.

Topic focus: ${topic}

Requirements:
- Length: 300-340 words
- Style: Clear, direct, modern prose. Concrete and specific — name real things, studies, places, or examples where natural
- Tone: Smart and energizing, not cheesy or mystical
- No headers, bullet points, or formatting — just clean paragraphs
- ${openingStyle}
- Include at least one surprising fact, example, or perspective
- End with a practical takeaway the reader can act on today

Banned openings and clichés — do NOT use:
- "The universe whispers/hums"
- "Imagine a universe where"
- "Our minds are galaxies"
- Any cosmic, mystical, or pseudo-profound metaphor in the first sentence
- Generic motivational filler like "unlock your potential" or "hidden reservoir of strength"

Write something a curious adult would actually enjoy reading fast — sharp, grounded, and varied.`;
}

export function formatDateUTC(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTomorrowDateUTC(): string {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return formatDateUTC(tomorrow);
}

export function getTodayDateUTC(): string {
  return formatDateUTC(new Date());
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateUTC(date);
}

export async function generateDailyContent(
  modelName: string = DAILY_CONTENT_MODEL,
  date?: string
): Promise<string> {
  const prompt = buildDailyContentPrompt(date ?? getTomorrowDateUTC());
  const { text } = await generateText({
    model: google(modelName),
    prompt,
  });

  if (!text?.trim()) {
    throw new Error("Generated content is empty");
  }

  return text.trim();
}

export async function generateDailyContentViaOpenRouter(
  apiKey: string,
  modelName: string = OPENROUTER_BACKFILL_MODEL,
  date?: string
): Promise<string> {
  const prompt = buildDailyContentPrompt(date ?? getTomorrowDateUTC());
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error?.message === "string"
        ? data.error.message
        : `OpenRouter request failed (${response.status})`;
    throw new Error(message);
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content?.trim()) {
    throw new Error("Generated content is empty");
  }

  return content.trim();
}

function getRetryDelayMs(error: unknown, attempt: number): number {
  if (error && typeof error === "object") {
    const message =
      "message" in error && typeof error.message === "string"
        ? error.message
        : "";

    const retryMatch = message.match(/retry in ([\d.]+)s/i);
    if (retryMatch) {
      return Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000;
    }
  }

  return Math.pow(2, attempt) * 1000;
}

export async function generateDailyContentWithRetries(
  options: {
    provider?: "gemini" | "openrouter";
    openRouterApiKey?: string;
    modelName?: string;
    date?: string;
    maxRetries?: number;
    delayMs?: number;
  } = {}
): Promise<string> {
  const {
    provider = "gemini",
    openRouterApiKey,
    modelName,
    date = getTomorrowDateUTC(),
    maxRetries = 3,
    delayMs = 0,
  } = options;

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (provider === "openrouter") {
        if (!openRouterApiKey) {
          throw new Error("OPENROUTER_API_KEY is required for OpenRouter backfill");
        }
        return await generateDailyContentViaOpenRouter(
          openRouterApiKey,
          modelName ?? OPENROUTER_BACKFILL_MODEL,
          date
        );
      }

      return await generateDailyContent(modelName ?? DAILY_CONTENT_MODEL, date);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const waitMs = getRetryDelayMs(error, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  throw new Error("Failed to generate daily content");
}

export async function saveDailyContent(
  databaseUrl: string,
  content: string,
  date: string
): Promise<"created" | "updated"> {
  const sql = neon(databaseUrl);

  const existing = await sql`
    SELECT id FROM daily_texts WHERE date = ${date}
  `;

  if (existing.length > 0) {
    await sql`
      UPDATE daily_texts
      SET content = ${content}
      WHERE date = ${date}
    `;
    return "updated";
  }

  await sql`
    INSERT INTO daily_texts (content, date, created_at)
    VALUES (${content}, ${date}, NOW())
  `;
  return "created";
}

export async function getLatestDailyDate(
  databaseUrl: string
): Promise<string | null> {
  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT date FROM daily_texts ORDER BY date DESC LIMIT 1
  `;
  return rows[0]?.date ?? null;
}

export function getMissingDates(
  latestDate: string | null,
  throughDate: string
): string[] {
  const startDate = latestDate
    ? addDaysToDateString(latestDate, 1)
    : throughDate;

  const dates: string[] = [];
  let current = startDate;

  while (current <= throughDate) {
    dates.push(current);
    current = addDaysToDateString(current, 1);
  }

  return dates;
}
