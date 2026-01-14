import { RSVPReader } from '@/components/rsvp/RSVPReader';

const DEFAULT_TEXT = `The post shares a 2.75-minute RSVP video where words flash sequentially, starting at 300 wpm and ramping to 900 wpm, testing viewers' ability to comprehend a passage on brain adaptation to rapid reading. User replies reveal personal thresholds around 600-900 wpm, with many describing a "flow state" where the brain predicts and autofills words, turning the exercise into an engaging cognitive challenge. Research, including a 2014 Frontiers in Psychology study, shows RSVP training can increase reading speed by 53% on average.`;

export default function Home() {
  return (
    <main className="h-screen w-full bg-black overflow-hidden relative">
      {/* Dynamic Background Mesh (Subtle) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black z-0 pointer-events-none" />

      {/* Branding - Subtle Top Right */}
      <div className="absolute top-8 right-8 z-20 opacity-20 hover:opacity-100 transition-opacity duration-500">
        <h1 className="font-mono text-xs tracking-[0.5em] text-white">CURT.SYSTEM</h1>
      </div>

      <div className="relative z-10 w-full h-full">
        <RSVPReader content={DEFAULT_TEXT} />
      </div>
    </main>
  );
}
