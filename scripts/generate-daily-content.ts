import "dotenv/config";
import { z } from "zod";
import {
  generateDailyContentWithRetries,
  getLatestDailyDate,
  getMissingDates,
  getTomorrowDateUTC,
  getTodayDateUTC,
  saveDailyContent,
} from "../src/lib/daily-content";

const args = process.argv.slice(2);
const backfill = args.includes("--backfill");
const dateArgIndex = args.indexOf("--date");
const targetDate =
  dateArgIndex >= 0 ? args[dateArgIndex + 1] : undefined;

const BaseEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "Database URL is missing"),
});

const GeminiEnvSchema = BaseEnvSchema.extend({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "Google API Key is missing"),
});

const BackfillEnvSchema = BaseEnvSchema.extend({
  OPENROUTER_API_KEY: z.string().min(1, "OpenRouter API Key is missing"),
});

const envParse = (backfill ? BackfillEnvSchema : GeminiEnvSchema).safeParse(
  process.env
);

if (!envParse.success) {
  console.error("Invalid environment variables:");
  console.error(envParse.error.format());
  process.exit(1);
}

const { DATABASE_URL } = envParse.data;
const openRouterApiKey = backfill
  ? (envParse.data as z.infer<typeof BackfillEnvSchema>).OPENROUTER_API_KEY
  : undefined;

function isQuotaExhausted(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String(error.message)
        : String(error);

  return message.includes("429") || message.includes("quota");
}

async function generateForDate(
  date: string,
  options: { backfill?: boolean } = {}
): Promise<void> {
  console.log(`Generating content for ${date}...`);
  const content = await generateDailyContentWithRetries({
    provider: options.backfill ? "openrouter" : "gemini",
    openRouterApiKey,
    delayMs: options.backfill ? 1500 : 0,
  });
  const wordCount = content.split(/\s+/).length;
  console.log(`Generated ${wordCount} words`);

  const result = await saveDailyContent(DATABASE_URL, content, date);
  console.log(`${result === "created" ? "Created" : "Updated"} ${date}`);
  console.log(`Preview: ${content.slice(0, 200)}...`);
}

async function main() {
  console.log("Starting daily content generation...");

  if (backfill) {
    const latestDate = await getLatestDailyDate(DATABASE_URL);
    const today = getTodayDateUTC();
    const missingDates = getMissingDates(latestDate, today);

    if (missingDates.length === 0) {
      console.log(`No missing dates through ${today}.`);
    } else {
      console.log(
        `Backfilling ${missingDates.length} date(s) via OpenRouter: ${missingDates[0]} -> ${missingDates[missingDates.length - 1]}`
      );

      let completed = 0;
      for (const date of missingDates) {
        try {
          await generateForDate(date, { backfill: true });
          completed++;
        } catch (error) {
          if (isQuotaExhausted(error)) {
            console.error(
              `API quota hit after ${completed} date(s). Re-run: npm run backfill:daily`
            );
            process.exit(0);
          }
          throw error;
        }
      }
    }
  } else if (targetDate) {
    await generateForDate(targetDate);
  } else {
    await generateForDate(getTomorrowDateUTC());
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error("Generation failed:", error);
  process.exit(1);
});
