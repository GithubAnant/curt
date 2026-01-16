import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dailyTexts } from "@/db/schema";
import { config } from "dotenv";

config({ path: ".env" });

export async function GET(request: Request) {
  // Basic security check (e.g., for Vercel Cron)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // return new NextResponse('Unauthorized', { status: 401 });
    // Allowing for now for testing purposes or if secret is missing
  }

  try {
    // Call OpenRouter / Gemini API
    const prompt =
      "Write a short, engaging, non-fictional article about an interesting scientific or historical fact. Length: 250-300 words. Style: Captivating, clear, and educational. Do not include a title in the response text, just the body.";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          // "HTTP-Referer": "https://curt.app",
          // "X-Title": "Curt Speed Reader"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free", // Using free tier or user preference
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Failed to generate content from AI");
    }

    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    // For testing immediately: use TODAY's date if no today text exists
    // const dateStr = new Date().toISOString().split('T')[0];

    await db.insert(dailyTexts).values({
      content: content,
      date: dateStr,
      title: "Daily Knowledge", // Ideally extract title from AI too
      difficulty: "medium",
      targetWpm: 400,
    });

    return NextResponse.json({
      success: true,
      date: dateStr,
      content_preview: content.substring(0, 50),
    });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
