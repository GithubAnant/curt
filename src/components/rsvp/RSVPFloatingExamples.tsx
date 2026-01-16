import React from 'react';
import { EXAMPLE_TEXTS } from '@/data/exampleTexts';
import { FloatingExample } from './FloatingExample';

interface RSVPFloatingExamplesProps {
    isGenerated: boolean;
    setContent: (content: string) => void;
}

export const RSVPFloatingExamples = ({ isGenerated, setContent }: RSVPFloatingExamplesProps) => {
    if (isGenerated) return null;

    const examples = EXAMPLE_TEXTS.slice(0, 5);

    return (
        <>
            {/* Left Side - 3 items */}
            <div className="hidden lg:block absolute top-[15%] left-[2%] w-[250px] h-[600px] pointer-events-none">
                {examples.slice(0, 3).map((ex, i) => {
                    const positions = [
                        "top-0 left-4",
                        "top-[35%] left-12",
                        "bottom-0 left-0"
                    ];
                    // Fun, asymmetric shapes (not rectangles, not messy blobs)
                    const shapes = [
                        "24px 24px 24px 4px",  // Speech bubble top-left
                        "24px 4px 24px 24px",  // Speech bubble top-right
                        "4px 24px 24px 24px"   // Speech bubble bottom-left
                    ];
                    return (
                        <FloatingExample
                            key={i}
                            title={ex.title}
                            preview={ex.preview}
                            onClick={() => setContent(ex.content)}
                            className={`pointer-events-auto ${positions[i]}`}
                            shape={shapes[i]}
                            delay={i * 0.5}
                        />
                    );
                })}
            </div>

            {/* Right Side - 2 items with larger gap */}
            <div className="hidden lg:block absolute top-[15%] right-[2%] w-[250px] h-[600px] pointer-events-none">
                {examples.slice(3, 5).map((ex, i) => {
                    const positions = [
                        "top-[5%] right-0",
                        "bottom-[10%] right-8"
                    ];
                    const shapes = [
                        "24px 24px 4px 24px",  // Speech bubble bottom-right
                        "32px 16px 32px 16px"  // Alternate smooth
                    ];
                    return (
                        <FloatingExample
                            key={i + 3}
                            title={ex.title}
                            preview={ex.preview}
                            onClick={() => setContent(ex.content)}
                            className={`pointer-events-auto ${positions[i]}`}
                            shape={shapes[i]}
                            delay={(i + 3) * 0.5}
                        />
                    );
                })}
            </div>
        </>
    );
};
