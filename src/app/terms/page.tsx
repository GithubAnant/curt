import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Nav */}
            <nav className="px-8 py-6 flex items-center justify-between border-b border-neutral-800">
                <Link href="/" className="font-logo text-xl tracking-tight text-[#E07A5F]">curt</Link>
            </nav>

            <main className="max-w-3xl mx-auto px-8 py-12">
                <h1 className="text-3xl mb-8">Terms of Service</h1>
                <p className="text-neutral-400 text-sm mb-8">Last updated: January 16, 2026</p>

                <div className="space-y-8 text-neutral-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl text-white mb-4">Acceptance of Terms</h2>
                        <p>
                            By accessing and using Curt ("Can U Read This"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Description of Service</h2>
                        <p>
                            Curt is a free, open source speed reading application that uses RSVP (Rapid Serial Visual Presentation) technology to help users read text faster. The service is provided "as is" without warranties of any kind.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">User Responsibilities</h2>
                        <ul className="list-disc list-inside space-y-2 text-neutral-400">
                            <li>You are responsible for the content you paste into the application</li>
                            <li>You agree not to use the service for any unlawful purpose</li>
                            <li>You agree not to attempt to reverse engineer or compromise the service</li>
                            <li>You acknowledge that the text you paste is processed locally in your browser</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Intellectual Property</h2>
                        <p className="mb-4">
                            Curt is open source software. The source code is available under an open source license, which you can find in our GitHub repository.
                        </p>
                        <p>
                            Content you paste into the application remains your property or the property of its original owner. Curt does not claim any ownership over user-provided content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Disclaimer of Warranties</h2>
                        <p>
                            The service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the service. Use of the service is at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Limitation of Liability</h2>
                        <p>
                            In no event shall Curt or its contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the service after changes are posted constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Open Source License</h2>
                        <p>
                            Curt is open source software. By using this software, you also agree to comply with the terms of the open source license under which it is distributed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl text-white mb-4">Contact</h2>
                        <p>
                            For questions about these Terms of Service, please open an issue on our GitHub repository.
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
