import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDailyText, getUserReadingForText } from "@/app/actions/game";
import ClientDailyGame from "./ClientDailyGame"; // We'll make this client component

export default async function DailyPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/auth/login");
    }

    const dailyText = await getDailyText();

    if (!dailyText) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                <p>No text available for today. Check back later!</p>
            </div>
        );
    }

    const previousReading = await getUserReadingForText(dailyText.id);

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="p-6 flex justify-between items-center border-b border-white/10">
                <span className="font-bold tracking-widest">CURT DAILY</span>
                <div className="flex gap-4">
                    <span className="text-neutral-400">Streak: 0</span> {/* Placeholder */}
                    <div className="w-8 h-8 bg-neutral-800 rounded-full overflow-hidden">
                        {session.user.image && <img src={session.user.image} alt="User" />}
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <ClientDailyGame
                    dailyText={dailyText}
                    previousReading={previousReading}
                />
            </main>
        </div>
    );
}
