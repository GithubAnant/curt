import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { dailyTexts, readings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default async function ArchivePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect("/auth/login");

    const allTexts = await db.select().from(dailyTexts).orderBy(desc(dailyTexts.date));
    const userReadings = await db.select().from(readings).where(eq(readings.userId, session.user.id));

    const readingsMap = new Map(userReadings.map(r => [r.textId, r]));

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <header className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Archive</h1>
                <Link href="/daily" className="text-neutral-400 hover:text-white transition-colors">Back to Daily</Link>
            </header>

            <div className="max-w-4xl mx-auto grid gap-4">
                {allTexts.map(text => {
                    const reading = readingsMap.get(text.id);
                    const isRead = !!reading;

                    return (
                        <div key={text.id} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 flex justify-between items-center group hover:bg-neutral-900 transition-colors">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-neutral-500 font-mono text-xs">{text.date}</span>
                                    {isRead && <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-500">COMPLETED</span>}
                                </div>
                                <h3 className="font-medium text-lg mb-1 group-hover:text-[#E07A5F] transition-colors">{text.title || "Daily Knowledge"}</h3>
                                <p className="text-neutral-500 text-sm line-clamp-1 max-w-lg">{text.content}</p>
                            </div>

                            <div className="text-right">
                                {isRead ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-bold">{reading.wpmAchieved}</span>
                                        <span className="text-xs text-neutral-500">WPM</span>
                                    </div>
                                ) : (
                                    <span className="text-neutral-600 text-sm">--</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
