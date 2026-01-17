"use server";

import { db } from "@/lib/db";
import { dailyTexts, readings } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getDailyText() {
  const today = new Date().toISOString().split("T")[0];

  // Try to find today's text
  let text = await db
    .select()
    .from(dailyTexts)
    .where(eq(dailyTexts.date, today))
    .limit(1);

  // Fallback: Get most recent text if today's doesn't exist (for demo purposes)
  if (text.length === 0) {
    text = await db
      .select()
      .from(dailyTexts)
      .orderBy(desc(dailyTexts.date))
      .limit(1);
  }

  return text[0] || null;
}

export async function getUserReadingForText(textId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const reading = await db
    .select()
    .from(readings)
    .where(
      and(eq(readings.userId, session.user.id), eq(readings.textId, textId))
    )
    .limit(1);

  return reading[0] || null;
}

export async function saveReading(textId: number, wpm: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("Unauthorized");

  // Input validation
  if (!Number.isFinite(wpm) || wpm <= 0 || wpm > 5000) {
    throw new Error("Invalid WPM value. Must be between 1 and 5000.");
  }

  // Check for existing reading to avoid duplicates (Manual upsert pattern since no unique constraint on schema)
  const existingReading = await db
    .select()
    .from(readings)
    .where(
      and(eq(readings.userId, session.user.id), eq(readings.textId, textId))
    )
    .limit(1);

  if (existingReading.length > 0) {
    // Update existing reading
    await db
      .update(readings)
      .set({
        wpmAchieved: wpm,
        completedAt: new Date(),
      })
      .where(eq(readings.id, existingReading[0].id));
  } else {
    // Insert new reading
    await db.insert(readings).values({
      userId: session.user.id,
      textId: textId,
      wpmAchieved: wpm,
      completedAt: new Date(),
    });
  }
}

export async function getAllDailyTexts() {
  const texts = await db
    .select()
    .from(dailyTexts)
    .where(gte(dailyTexts.date, "2026-01-17"))
    .orderBy(desc(dailyTexts.date));

  return texts;
}
