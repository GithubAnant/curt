"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRSVP, RSVPWord } from '@/hooks/useRSVP';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RSVPDisplay } from './RSVPDisplay';

type SpeedMode = 'linear' | 'block';

interface RSVPReaderProps {
    initialContent?: string;
}

// Highlighter background colors (like real highlighters)
const SPEED_HIGHLIGHTS = {
    300: 'rgba(74, 222, 128, 0.3)',  // Green highlighter
    450: 'rgba(250, 204, 21, 0.3)',  // Yellow highlighter
    600: 'rgba(251, 146, 60, 0.3)',  // Orange highlighter
    900: 'rgba(248, 113, 113, 0.3)', // Red/Pink highlighter
};

const BLOCK_SPEEDS = [300, 450, 600, 900];

// Example texts for users to try (150-300 words each for 30-60 second reads at 300 WPM)
const EXAMPLE_TEXTS = [
    {
        title: "The Art of Focus",
        preview: "In a world of endless distractions...",
        content: "In a world of endless distractions, the ability to focus has become the most valuable skill of our generation. Your brain is designed to process information rapidly, but modern technology has fragmented our attention into tiny pieces scattered across notifications, feeds, and endless digital noise. Speed reading is not just about reading faster. It is fundamentally about training your mind to absorb information more efficiently, to cut through the noise, and to reclaim your cognitive potential. When you practice focused reading, you are building mental muscle. Each session strengthens your ability to concentrate. The words become clearer. The meaning becomes deeper. You are not just reading. You are becoming a more effective thinker. This is the true power of deliberate practice. Start slow. Build momentum. Watch your capabilities expand beyond what you thought possible. The journey of a thousand books begins with a single word."
    },
    {
        title: "Neural Plasticity",
        preview: "The brain rewires itself constantly...",
        content: "The brain rewires itself constantly through a remarkable process called neuroplasticity. Every experience you have, every skill you practice, physically changes the structure of your neural networks. When you practice speed reading, you are literally creating new neural pathways that did not exist before. Each training session strengthens the connections between your visual cortex and language processing centers. The myelin sheaths around frequently used neurons grow thicker, making signal transmission faster and more efficient. Over time, what once felt impossible becomes effortless. This is the beautiful science behind skill acquisition. Your brain is not fixed. It is a dynamic organ that evolves with use. The more you challenge it, the more it grows. Speed reading is not just about consuming information faster. It is about upgrading your mental hardware. Every minute you spend training is an investment in your cognitive future. The brain you have tomorrow depends on the choices you make today."
    },
    {
        title: "Flow State",
        preview: "Peak performance happens when...",
        content: "Peak performance happens when challenge meets skill in perfect balance. Psychologists call this optimal experience the flow state. It is that magical zone where time seems to disappear, where distractions fade into irrelevance, and where you become completely absorbed in what you are doing. Speed reading at the edge of your ability naturally induces this focused mental state. The words come too fast for your inner voice to keep up. You must let go of subvocalization and trust your brain to process visually. This surrender is where the magic happens. You become one with the text. The boundary between reader and content dissolves. This is not just reading. This is cognitive training at its finest. Athletes chase this feeling. Musicians live for it. And now you can access it through deliberate reading practice. Flow is not reserved for the elite. It is available to anyone willing to push their boundaries systematically."
    },
    {
        title: "Information Age",
        preview: "We consume more words daily...",
        content: "We consume more words daily than our ancestors read in a lifetime. The average knowledge worker processes over one hundred thousand words per day across emails, reports, articles, and messages. Yet our fundamental reading speed has remained unchanged for centuries, stuck at around two hundred to three hundred words per minute. This mismatch creates a bottleneck that affects everything from career advancement to personal growth. Speed reading is not a luxury skill. It is a necessity for thriving in the information age. Those who can process information faster have a genuine competitive advantage. They learn more in less time. They spot opportunities others miss. They make better decisions because they have access to more data. The question is not whether you can afford to learn speed reading. The question is whether you can afford not to. Every day you delay is another day spent at a fraction of your potential capacity."
    },
    {
        title: "The Reading Revolution",
        preview: "Traditional reading is inefficient...",
        content: "Traditional reading is remarkably inefficient when you examine the mechanics. Your eyes do not move smoothly across a page. They jump in rapid movements called saccades, often regressing backwards multiple times per line. These micro regressions waste enormous amounts of time and mental energy. RSVP technology eliminates this entirely. Each word appears at a fixed point in space. Your eyes stay perfectly still. Only your brain moves, processing each word as it flashes before you. The result is dramatically faster comprehension with significantly less mental fatigue. You are no longer fighting against the physical limitations of eye movement. You are reading the way your brain was designed to process information. This is not a hack or a trick. It is a fundamental improvement in how humans interact with text. Once you experience true RSVP reading, traditional page scanning feels primitive by comparison. Welcome to the future of reading."
    },
    {
        title: "Deep Work",
        preview: "The ability to perform deep work...",
        content: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. Deep work refers to professional activities performed in a state of distraction free concentration that push your cognitive capabilities to their limit. These efforts create new value, improve your skill, and are hard to replicate. Speed reading is a gateway to deeper work. When you can process information faster, you free up mental bandwidth for synthesis and creativity. You spend less time gathering inputs and more time generating outputs. The shallow work of constant information consumption transforms into the deep work of genuine understanding. Master readers do not just absorb more content. They think more clearly because their minds are not cluttered with the effort of basic comprehension. Reading becomes invisible. Thinking becomes primary. This is the ultimate goal of speed reading training. Not just faster consumption, but deeper cognition."
    },
    {
        title: "Cognitive Load",
        preview: "Your working memory has limits...",
        content: "Your working memory has strict limits that cannot be expanded through willpower alone. Research suggests we can hold only about four chunks of information in active memory at once. This constraint shapes everything about how we learn and think. Slow reading overloads working memory because each word lingers too long, competing for space with previous words. Speed reading actually reduces cognitive load by moving information through working memory more efficiently. Words are processed and integrated into long term understanding before they can create mental congestion. This is counterintuitive but scientifically sound. Faster is sometimes easier than slower. The key is finding your optimal pace, the speed at which comprehension peaks before declining. This sweet spot varies by individual and by material difficulty. Training helps you identify and expand this range. Over time, your optimal reading speed increases naturally as your brain adapts to more efficient processing patterns."
    },
    {
        title: "The Compound Effect",
        preview: "Small consistent actions compound...",
        content: "Small consistent actions compound into extraordinary results over time. This principle applies to finance, fitness, and perhaps most powerfully to learning. If you read just thirty minutes daily at an improved speed, the effects compound dramatically. In one year, you might read forty additional books compared to your baseline. In five years, that becomes two hundred extra books of knowledge and perspective. In a decade, the gap between who you could be and who you would have been becomes almost incomprehensible. Speed reading is not about any single session. It is about the accumulated wisdom of thousands of efficiently processed words. Each training session deposits a small amount into your cognitive bank account. Interest compounds silently in the background. One day you wake up and realize you have become a fundamentally different thinker than you were before. This transformation happens gradually, then suddenly."
    },
    {
        title: "Visual Processing",
        preview: "The human visual system is remarkably fast...",
        content: "The human visual system is remarkably fast and largely underutilized in traditional reading. Your eyes can identify a word in as little as fifty milliseconds. Your brain can begin extracting meaning almost instantly. Yet conventional reading habits force you to process words at a fraction of this potential speed. The bottleneck is not visual processing. It is the habit of subvocalization, silently pronouncing each word in your mind. This internal voice can only speak so fast, typically around one hundred fifty words per minute. RSVP training helps you bypass this limitation by presenting words faster than you can subvocalize them. Initially this feels uncomfortable. Your brain searches for the familiar voice and finds silence. But within that silence, a new kind of understanding emerges. Visual comprehension replaces auditory processing. The words transform directly into meaning without the intermediate step of mental pronunciation. This is how speed readers break through traditional limits."
    },
    {
        title: "Attention Economy",
        preview: "Your attention is the most valuable resource...",
        content: "Your attention is the most valuable resource you possess, and countless companies are competing fiercely to capture it. Every app, every notification, every piece of content is engineered to grab and hold your focus for as long as possible. In this attention economy, the ability to control where your mind goes is genuine power. Speed reading is attention training in disguise. When you practice focused reading at high speeds, you are strengthening your capacity for directed attention. You are building resistance to distraction. You are reclaiming sovereignty over your own mind. The benefits extend far beyond reading itself. People who train their attention become more effective at everything requiring concentration. They are better programmers, better writers, better strategists, better partners. Attention is the foundation upon which all cognitive performance is built. Speed reading training is one of the most efficient ways to strengthen this foundation systematically."
    },
    {
        title: "Memory and Speed",
        preview: "Fast reading improves memory retention...",
        content: "Fast reading improves memory retention, which seems paradoxical until you understand the underlying mechanics. When you read slowly, your mind has time to wander between words. You might read a paragraph while thinking about something entirely different, then realize you have no idea what you just consumed. Speed forces engagement. There is no room for mental drift when words are flashing rapidly before your eyes. Your brain must pay attention or miss the content entirely. This enforced focus leads to better encoding in memory. Additionally, faster reading creates stronger contextual connections. You see more words in a shorter time span, making it easier to understand how ideas relate to each other. The meaning of a sentence is fresh when you reach its conclusion. Speed reading done correctly is not skimming. It is intense, focused processing that leaves deeper impressions than lazy slow reading ever could."
    },
    {
        title: "The Learning Curve",
        preview: "Every expert was once a beginner...",
        content: "Every expert was once a beginner who felt awkward and uncertain. The learning curve for speed reading follows a predictable pattern. Initially, pushing your speed feels uncomfortable and comprehension drops noticeably. This is normal and temporary. Your brain is reorganizing its processing strategies, letting go of old habits while building new ones. After a few weeks of consistent practice, something shifts. The discomfort fades. Words begin to flow more naturally at higher speeds. Comprehension returns, often exceeding your baseline levels. This is when training becomes genuinely enjoyable. You can feel your capabilities expanding. The text that once seemed impossibly fast now feels comfortable. You push higher. The cycle repeats. Each plateau leads to a new breakthrough. There is no ceiling on human reading speed, only a series of obstacles to overcome through patient, persistent practice. Trust the process. The results will come."
    },
];

export function RSVPReader({ initialContent }: RSVPReaderProps) {
    const [content, setContent] = useState(initialContent || '');
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMode, setSpeedMode] = useState<SpeedMode>('block');
    const [startWPM, setStartWPM] = useState(300);
    const [endWPM, setEndWPM] = useState(900);
    const [processedWords, setProcessedWords] = useState<RSVPWord[]>([]);
    const [showInput, setShowInput] = useState(!initialContent);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const textAreaRef = useRef<HTMLDivElement>(null);

    // Clean word - remove dashes and special characters
    const cleanWord = (word: string): string => {
        return word
            .replace(/[-–—]/g, '') // Remove all types of dashes
            .replace(/[^a-zA-Z0-9''.,!?]/g, '') // Keep only letters, numbers, basic punctuation
            .trim();
    };

    // Process text into words with speed assignments
    const processText = useCallback((text: string) => {
        const rawWords = text.split(/\s+/)
            .map(w => cleanWord(w))
            .filter(w => w.length > 0);
        if (rawWords.length === 0) return [];

        if (speedMode === 'linear') {
            const wpmIncrement = rawWords.length > 1 ? (endWPM - startWPM) / (rawWords.length - 1) : 0;
            return rawWords.map((word, i) => ({
                word,
                wpm: Math.round(startWPM + (wpmIncrement * i))
            }));
        } else {
            const sectionSize = Math.ceil(rawWords.length / 4);
            return rawWords.map((word, i) => {
                const sectionIndex = Math.min(Math.floor(i / sectionSize), 3);
                return {
                    word,
                    wpm: BLOCK_SPEEDS[sectionIndex]
                };
            });
        }
    }, [speedMode, startWPM, endWPM]);

    useEffect(() => {
        if (content) {
            setProcessedWords(processText(content));
        }
    }, [content, processText]);

    const { currentWord, progress, scrub } = useRSVP({
        words: processedWords,
        isPlaying,
        onComplete: () => setIsPlaying(false)
    });

    const currentWPM = currentWord?.wpm || startWPM;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !showInput) {
                e.preventDefault();
                setIsPlaying(p => !p);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showInput]);

    const handleGenerate = () => {
        if (content.trim()) {
            setIsGenerated(true);
        }
    };

    const handleStart = () => {
        if (content.trim()) {
            setShowInput(false);
            scrub(0);
        }
    };

    // Theme toggle - anchor letter concept
    const ThemeToggle = () => (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-6 right-6 z-50 cursor-pointer"
            style={{ fontFamily: 'Georgia, serif' }}
        >
            <span
                className={cn(
                    "text-2xl font-normal transition-colors",
                    isDark ? "text-[#E07A5F]" : "text-[#E07A5F]"
                )}
            >
                {isDark ? 'd' : 'l'}
            </span>
        </button>
    );

    // Render the text with highlighter backgrounds
    const renderHighlightedContent = () => {
        if (!isGenerated || !content) return null;
        const words = processText(content);
        const totalWords = words.length;

        return (
            <div
                className={cn(
                    "w-full min-h-[60vh] p-8 rounded-none text-lg leading-loose",
                    isDark ? "text-white" : "text-black"
                )}
                style={{ fontFamily: 'Georgia, serif' }}
            >
                {words.map((w, i) => {
                    // Calculate position in sequence (0 to 1)
                    const position = totalWords > 1 ? i / (totalWords - 1) : 0;

                    let bgColor: string;
                    if (speedMode === 'linear') {
                        // Smooth gradient from green to yellow to orange to red
                        const hue = 120 - (position * 120); // 120 (green) to 0 (red)
                        bgColor = `hsla(${hue}, 70%, 50%, 0.25)`;
                    } else {
                        // Block mode - use discrete colors
                        bgColor = SPEED_HIGHLIGHTS[w.wpm as keyof typeof SPEED_HIGHLIGHTS];
                    }

                    return (
                        <span
                            key={i}
                            style={{ backgroundColor: bgColor }}
                            className="inline px-0.5 py-0.5 rounded-sm"
                        >
                            {w.word}
                        </span>
                    );
                }).reduce((acc: React.ReactNode[], curr, i) => {
                    if (i === 0) return [curr];
                    return [...acc, ' ', curr];
                }, [])}
            </div>
        );
    };

    if (showInput) {
        // Show first 5 examples on input page
        const inputExamples = EXAMPLE_TEXTS.slice(0, 5);

        return (
            <div className={cn(
                "w-full min-h-screen flex",
                isDark ? "bg-black" : "bg-white"
            )}>
                <ThemeToggle />

                {/* Main Input Area */}
                <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-8 py-24">
                    {/* Minimal Header */}
                    <div className="mb-8">
                        <h1
                            className={cn(
                                "text-2xl font-light mb-2",
                                isDark ? "text-white" : "text-black"
                            )}
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Enter your text
                        </h1>
                        <div className={cn(
                            "flex gap-6 text-sm",
                            isDark ? "text-neutral-500" : "text-neutral-600"
                        )}>
                            <button
                                onClick={() => { setSpeedMode('linear'); setIsGenerated(false); }}
                                className={cn(speedMode === 'linear' && (isDark ? "text-white" : "text-black"))}
                            >
                                Linear
                            </button>
                            <button
                                onClick={() => { setSpeedMode('block'); setIsGenerated(false); }}
                                className={cn(speedMode === 'block' && (isDark ? "text-white" : "text-black"))}
                            >
                                Block
                            </button>
                        </div>
                    </div>

                    {/* Large Minimal Text Area OR Highlighted Preview */}
                    {!isGenerated ? (
                        <textarea
                            ref={textAreaRef as any}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your text here..."
                            className={cn(
                                "w-full flex-1 min-h-[50vh] p-8 rounded-none text-lg leading-loose resize-none focus:outline-none border-b transition-colors",
                                isDark
                                    ? "bg-black text-white placeholder:text-neutral-700 border-neutral-800 focus:border-neutral-600"
                                    : "bg-white text-black placeholder:text-neutral-400 border-neutral-200 focus:border-neutral-400"
                            )}
                            style={{ fontFamily: 'Georgia, serif' }}
                        />
                    ) : (
                        renderHighlightedContent()
                    )}

                    {/* Speed Range for Linear */}
                    {speedMode === 'linear' && !isGenerated && (
                        <div className={cn(
                            "mt-6 p-4 rounded-lg border",
                            isDark ? "border-neutral-800" : "border-neutral-200"
                        )}>
                            <div className={cn(
                                "flex justify-between text-sm mb-3",
                                isDark ? "text-neutral-400" : "text-neutral-600"
                            )}>
                                <span>{startWPM} WPM</span>
                                <span>{endWPM} WPM</span>
                            </div>
                            <div className="flex gap-4">
                                <Slider
                                    value={[startWPM]}
                                    min={100}
                                    max={600}
                                    step={10}
                                    onValueChange={(v) => setStartWPM(v[0])}
                                    className="flex-1"
                                />
                                <Slider
                                    value={[endWPM]}
                                    min={300}
                                    max={1200}
                                    step={10}
                                    onValueChange={(v) => setEndWPM(v[0])}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Legend for Block Mode */}
                    {speedMode === 'block' && isGenerated && (
                        <div className={cn(
                            "mt-4 flex gap-4 text-xs",
                            isDark ? "text-neutral-500" : "text-neutral-600"
                        )}>
                            {BLOCK_SPEEDS.map(s => (
                                <span
                                    key={s}
                                    className="px-2 py-1 rounded"
                                    style={{ backgroundColor: SPEED_HIGHLIGHTS[s as keyof typeof SPEED_HIGHLIGHTS] }}
                                >
                                    {s} WPM
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Speed Range for Linear - Minimal Number Inputs */}
                    {speedMode === 'linear' && !isGenerated && (
                        <div className="mt-6 flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs",
                                    isDark ? "text-neutral-600" : "text-neutral-400"
                                )}>from</span>
                                <input
                                    type="number"
                                    value={startWPM}
                                    onChange={(e) => setStartWPM(Math.max(100, Math.min(600, parseInt(e.target.value) || 100)))}
                                    className={cn(
                                        "w-20 px-3 py-2 text-sm text-center rounded-lg border-0 focus:outline-none focus:ring-1",
                                        isDark
                                            ? "bg-neutral-900 text-white focus:ring-neutral-700"
                                            : "bg-neutral-100 text-black focus:ring-neutral-300"
                                    )}
                                    style={{ fontFamily: 'Georgia, serif' }}
                                />
                            </div>
                            <div className={cn(
                                "text-xs",
                                isDark ? "text-neutral-700" : "text-neutral-300"
                            )}>→</div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs",
                                    isDark ? "text-neutral-600" : "text-neutral-400"
                                )}>to</span>
                                <input
                                    type="number"
                                    value={endWPM}
                                    onChange={(e) => setEndWPM(Math.max(300, Math.min(1200, parseInt(e.target.value) || 300)))}
                                    className={cn(
                                        "w-20 px-3 py-2 text-sm text-center rounded-lg border-0 focus:outline-none focus:ring-1",
                                        isDark
                                            ? "bg-neutral-900 text-white focus:ring-neutral-700"
                                            : "bg-neutral-100 text-black focus:ring-neutral-300"
                                    )}
                                    style={{ fontFamily: 'Georgia, serif' }}
                                />
                                <span className={cn(
                                    "text-xs",
                                    isDark ? "text-neutral-600" : "text-neutral-400"
                                )}>wpm</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons - Minimal Text Style */}
                    <div className="mt-10 flex items-center gap-6">
                        {!isGenerated ? (
                            <button
                                onClick={handleGenerate}
                                disabled={!content.trim()}
                                className={cn(
                                    "text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed group",
                                    isDark ? "text-white" : "text-black"
                                )}
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                <span className="border-b border-transparent group-hover:border-current pb-px">
                                    Generate preview →
                                </span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsGenerated(false)}
                                    className={cn(
                                        "text-sm transition-colors",
                                        isDark ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"
                                    )}
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleStart}
                                    className={cn(
                                        "text-sm transition-colors group",
                                        isDark ? "text-white" : "text-black"
                                    )}
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    <span className="border-b border-transparent group-hover:border-current pb-px">
                                        Start reading →
                                    </span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Examples Sidebar - Minimal Design */}
                    <div className={cn(
                        "hidden lg:flex flex-col w-64 border-l p-8 overflow-y-auto max-h-screen",
                        isDark ? "border-neutral-800/50" : "border-neutral-200/50"
                    )}>
                        <span className={cn(
                            "text-[10px] uppercase tracking-[0.2em] mb-8",
                            isDark ? "text-neutral-600" : "text-neutral-400"
                        )}>
                            Examples
                        </span>

                        <div className="space-y-1">
                            {inputExamples.map((example, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setContent(example.content); setIsGenerated(true); }}
                                    className={cn(
                                        "w-full text-left py-3 px-3 -mx-3 transition-all border-l-2 border-transparent hover:border-[#E07A5F]",
                                        isDark
                                            ? "text-neutral-500 hover:text-white"
                                            : "text-neutral-500 hover:text-black"
                                    )}
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    <span className="text-sm">
                                        {example.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                );
    }

                // RSVP Playback Screen
                return (
                <div className={cn(
                    "w-full h-screen flex flex-col justify-center relative",
                    isDark ? "bg-black" : "bg-white"
                )}>
                    <ThemeToggle />

                    <div className="flex-1 flex items-center justify-center">
                        <RSVPDisplay word={currentWord?.word || null} wpm={currentWPM} isDark={isDark} />
                    </div>

                    {/* Floating Controls */}
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl">
                        <div className={cn(
                            "backdrop-blur-md rounded-2xl border p-6",
                            isDark
                                ? "bg-neutral-900/80 border-neutral-800"
                                : "bg-white/80 border-neutral-200"
                        )}>
                            <div className="flex items-center gap-4 mb-6">
                                <span className={cn(
                                    "text-[10px] font-mono tracking-widest w-12 text-right",
                                    isDark ? "text-neutral-500" : "text-neutral-600"
                                )}>
                                    {Math.round(progress * 100)}%
                                </span>
                                <Slider
                                    value={[progress * 100]}
                                    max={100}
                                    step={0.1}
                                    onValueChange={(val) => {
                                        const newIndex = Math.floor((val[0] / 100) * processedWords.length);
                                        scrub(newIndex);
                                    }}
                                    className="flex-1"
                                />
                                <span className={cn(
                                    "text-[10px] font-mono tracking-widest w-16",
                                    isDark ? "text-neutral-500" : "text-neutral-600"
                                )}>
                                    {currentWPM} WPM
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className={cn(
                                            "w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95",
                                            isDark ? "bg-white text-black" : "bg-black text-white"
                                        )}
                                    >
                                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                    </button>
                                    <button
                                        onClick={() => scrub(0)}
                                        className={cn(
                                            "w-10 h-10 rounded-full border flex items-center justify-center transition-colors",
                                            isDark
                                                ? "border-neutral-700 text-neutral-400 hover:text-white"
                                                : "border-neutral-300 text-neutral-600 hover:text-black"
                                        )}
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                    <button
                                        onClick={() => { setShowInput(true); setIsGenerated(true); }}
                                        className={cn(
                                            "px-4 h-10 rounded-full border flex items-center justify-center text-xs transition-colors",
                                            isDark
                                                ? "border-neutral-700 text-neutral-400 hover:text-white"
                                                : "border-neutral-300 text-neutral-600 hover:text-black"
                                        )}
                                    >
                                        New Text
                                    </button>
                                </div>

                                <button
                                    className={cn(
                                        "px-4 h-10 rounded-full border flex items-center gap-2 text-xs transition-colors",
                                        isDark
                                            ? "border-neutral-700 text-neutral-400 hover:text-white"
                                            : "border-neutral-300 text-neutral-600 hover:text-black"
                                    )}
                                    onClick={() => alert('Video download coming soon!')}
                                >
                                    <Download size={14} />
                                    Download
                                </button>
                            </div>
                        </div>

                        <div className={cn(
                            "text-center mt-4 text-[10px] uppercase tracking-[0.3em]",
                            isDark ? "text-neutral-600" : "text-neutral-400"
                        )}>
                            CURT / {speedMode === 'linear' ? 'Linear' : 'Block'} Mode
                        </div>
                    </div>

                    {/* Floating Examples Panel - Right Side */}
                    <div className={cn(
                        "fixed right-4 top-1/2 -translate-y-1/2 w-56 max-h-[70vh] overflow-y-auto rounded-2xl border p-4 hidden lg:block",
                        isDark
                            ? "bg-neutral-900/90 backdrop-blur-md border-neutral-800"
                            : "bg-white/90 backdrop-blur-md border-neutral-200"
                    )}>
                        <span className={cn(
                            "text-[10px] uppercase tracking-widest block mb-3",
                            isDark ? "text-neutral-500" : "text-neutral-400"
                        )}>
                            Examples
                        </span>

                        <div className="space-y-2">
                            {EXAMPLE_TEXTS.map((example, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setContent(example.content);
                                        setIsGenerated(false);
                                        setShowInput(true);
                                    }}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-all text-xs group",
                                        isDark
                                            ? "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                                            : "hover:bg-neutral-100 text-neutral-600 hover:text-black"
                                    )}
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    <span className="group-hover:text-[#E07A5F] transition-colors">
                                        {example.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                );
}
