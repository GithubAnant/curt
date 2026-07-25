import { NextResponse } from "next/server";
import {
  generateDailyContentWithRetries,
  getTomorrowDateUTC,
  saveDailyContent,
} from "@/lib/daily-content";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 500 }
    );
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const content = await generateDailyContentWithRetries();
    const date = getTomorrowDateUTC();
    const result = await saveDailyContent(databaseUrl, content, date);

    return NextResponse.json({
      success: true,
      date,
      result,
      content_preview: content.substring(0, 50),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
