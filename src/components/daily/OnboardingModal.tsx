import React, { useState } from 'react';

interface OnboardingModalProps {
    onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const steps = [
        {
            title: "Welcome to curt",
            text: "A daily speed reading game. Train your brain to read faster."
        },
        {
            title: "How it works",
            text: "Words appear one at a time. The red letter is your focus point. Don't move your eyes."
        },
        {
            title: "Ready?",
            text: "Complete today's text to see your reading speed. New challenge every day."
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6">
            <div className="w-full max-w-sm border border-neutral-700 bg-neutral-900">

                {/* Progress */}
                <div className="flex">
                    {[1, 2, 3].map(n => (
                        <div
                            key={n}
                            className={`flex-1 h-1 ${n <= step ? 'bg-[#E07A5F]' : 'bg-neutral-700'}`}
                        />
                    ))}
                </div>

                <div className="p-8 text-center">
                    <h2 className="text-xl font-normal mb-4 text-white">{steps[step - 1].title}</h2>
                    <p className="text-neutral-400 mb-8">
                        {steps[step - 1].text}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onComplete}
                            className="flex-1 py-3 text-sm text-neutral-500 hover:text-white transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 py-3 text-sm bg-[#E07A5F] text-black font-medium hover:bg-[#d66b50] transition-colors"
                        >
                            {step === 3 ? "Start" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
