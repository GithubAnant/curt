import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Nav */}
            <nav className="px-8 py-6 flex items-center justify-between border-b border-neutral-800">
                <Link href="/" className="font-logo text-xl tracking-tight text-[#E07A5F]">curt</Link>
            </nav>

            <main className="max-w-3xl mx-auto px-8 py-12">
                <h1 className="text-3xl mb-8">Privacy Policy</h1>
                <p className="text-neutral-400 text-sm mb-8">Last updated: January 16, 2026</p>

                <div className="space-y-8 text-neutral-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl text-white mb-4">The Short Version</h2>
                        <p className="text-lg">
                            <strong className="text-[#E07A5F]">We don't collect any data. Period.</strong>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Overview</h2>
                        <p>
                            Curt ("Can U Read This") is a speed reading application that runs entirely in your browser. We do not collect, store, or transmit any user data whatsoever.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">What We Don't Collect</h2>
                        <ul className="list-disc list-inside space-y-2 text-neutral-400">
                            <li>No personal information</li>
                            <li>No usage analytics</li>
                            <li>No cookies</li>
                            <li>No tracking</li>
                            <li>No account data</li>
                            <li>Nothing.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">How It Works</h2>
                        <p className="mb-4">
                            Everything happens locally in your browser:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-neutral-400">
                            <li><strong className="text-neutral-300">Text you paste:</strong> Processed entirely in your browser. Never sent anywhere.</li>
                            <li><strong className="text-neutral-300">Reading settings:</strong> Stored in your browser's session storage. Cleared when you close your browser.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Open Source</h2>
                        <p>
                            Curt is open source. You can verify everything yourself by reading our code on GitHub.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Contact</h2>
                        <p>
                            Questions? Open an issue on our GitHub repository.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-800">
                    <Link href="/" className="text-[#E07A5F] hover:underline">← Back to Home</Link>
                </div>
            </main>
        </div>
    );
}
