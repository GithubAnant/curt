import { getDailyText } from "@/app/actions/game";
import ClientDailyGame from "./ClientDailyGame";
import Link from "next/link";

export default async function DailyPage() {
    const dailyText = await getDailyText();

    if (!dailyText) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <h1 className="font-logo text-xl mb-6">curt</h1>
                    <p className="text-neutral-500 mb-8">No text available today. Check back later!</p>
                    <Link
                        href="/app"
                        className="inline-block px-6 py-3 bg-black text-white text-sm font-medium"
                    >
                        Practice with your own text
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Header */}
            <nav className="px-8 py-6 flex justify-between items-center border-b border-neutral-200">
                <Link href="/" className="font-logo text-lg">curt</Link>
                <div className="flex items-center gap-6 text-sm">
                    <span className="text-neutral-500">daily challenge</span>
                    <Link href="/archive" className="hover:underline">Archive</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <ClientDailyGame dailyText={dailyText} />
            </main>
        </div>
    );
}
