import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { neon } from "@neondatabase/serverless";

export const DAILY_CONTENT_MODEL = "gemini-3-flash-preview";
export const OPENROUTER_BACKFILL_MODEL = "google/gemini-3-flash-preview";

export const DAILY_CONTENT_PROMPT = `Generate an engaging, thought-provoking passage for speed reading practice. 

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
  modelName: string = DAILY_CONTENT_MODEL
): Promise<string> {
  const { text } = await generateText({
    model: google(modelName),
    prompt: DAILY_CONTENT_PROMPT,
  });

  if (!text?.trim()) {
    throw new Error("Generated content is empty");
  }

  return text.trim();
}

export async function generateDailyContentViaOpenRouter(
  apiKey: string,
  modelName: string = OPENROUTER_BACKFILL_MODEL
): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: [{ role: "user", content: DAILY_CONTENT_PROMPT }],
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
    maxRetries?: number;
    delayMs?: number;
  } = {}
): Promise<string> {
  const {
    provider = "gemini",
    openRouterApiKey,
    modelName,
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
          modelName ?? OPENROUTER_BACKFILL_MODEL
        );
      }

      return await generateDailyContent(modelName ?? DAILY_CONTENT_MODEL);
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
