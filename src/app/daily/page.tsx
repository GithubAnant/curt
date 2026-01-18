import { getDailyText } from "@/app/actions/game";
import { RSVPReader } from "@/components/rsvp/RSVPReader";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
    const dailyText = await getDailyText();

    if (!dailyText) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: 'Georgia, serif' }}>
                <div className="text-center max-w-md px-6">
                    <Link href="/" className="font-logo text-xl text-[#E07A5F] mb-6 block">curt</Link>
                    <p className="text-neutral-500 mb-8">No text available today. Check back later!</p>
                    <Link
                        href="/app"
                        className="inline-block px-6 py-3 bg-[#E07A5F] text-black text-sm font-medium hover:bg-[#d66b50] transition-colors"
                    >
                        Practice with your own text
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(dailyText.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <nav className="px-8 py-6 flex justify-between items-center border-b border-neutral-800">
                <Link href="/" className="font-logo text-lg text-[#E07A5F]">curt</Link>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/app" className="text-neutral-500 hover:text-white transition-colors">Text Editor</Link>
                    <Link href="/archive" className="text-neutral-500 hover:text-white transition-colors">View Archives</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-2">
                    <div className="inline-block px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs text-neutral-400 font-mono tracking-wider uppercase mb-4">
                        {formattedDate}
                    </div>
                </div>
                <RSVPReader
                    initialContent={dailyText.content}
                    showExamples={false}
                    title="Today's Challenge"
                    subtitle="Focus on the text. Don't move your eyes."
                    returnUrl="/daily"
                    showHeader={false}
                />
            </main>
        </div>
    );
}
