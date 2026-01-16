import React from 'react';

export default function LandingFeatures() {
    return (
        <section className="border-t border-neutral-800 py-16">
            <div className="max-w-5xl mx-auto px-8">
                <div className="grid md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="font-normal mb-2 text-white">One word at a time</h3>
                        <p className="text-sm text-neutral-500">RSVP technology eliminates eye movement, letting you focus purely on comprehension.</p>
                    </div>
                    <div>
                        <h3 className="font-normal mb-2 text-white">Progressive speed</h3>
                        <p className="text-sm text-neutral-500">Start slow, finish fast. Your reading speed increases as you go.</p>
                    </div>
                    <div>
                        <h3 className="font-normal mb-2 text-white">Paste anything</h3>
                        <p className="text-sm text-neutral-500">Articles, books, notes. Paste any text and start reading immediately.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
