import { getAllDailyTexts } from "@/app/actions/game";
import Link from "next/link";
import ClientArchiveList from "@/components/archive/ClientArchiveList";

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
    const texts = await getAllDailyTexts();

    return (
        <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            <nav className="px-8 py-6 flex justify-between items-center border-b border-neutral-800">
                <Link href="/" className="font-logo text-lg text-[#E07A5F]">curt</Link>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/daily" className="text-neutral-500 hover:text-white transition-colors">Daily</Link>
                    <Link href="/app" className="text-neutral-500 hover:text-white transition-colors">Playground</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl font-normal mb-2">Archive</h1>
                        <p className="text-neutral-400 text-sm">
                            Browse and play past daily challenges.
                        </p>
                    </div>
                    <div className="text-xs text-neutral-600 font-mono">
                        Archives available from Jan 17, 2026
                    </div>
                </div>

                <ClientArchiveList texts={texts} />
            </main>
        </div>
    );
}
