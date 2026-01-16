"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Play, Zap, Brain, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const ONBOARDING_KEY = "hasSeenOnboarding";

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [videoEnded, setVideoEnded] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem(ONBOARDING_KEY);
        if (!hasSeen) {
            setIsOpen(true);
        }
    }, []);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
        setIsOpen(false);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
                <div className="relative h-[450px] flex flex-col">
                    {/* Progress Indicator */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted z-20">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="flex-1 relative p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                        <AnimatePresence mode="wait" custom={step}>
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={step}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full flex flex-col items-center gap-6"
                                >
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border/50 bg-black/50 shadow-inner">
                                        <video
                                            src="/assets/intro.mp4"
                                            className="w-full h-full object-cover"
                                            controls={false}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            onEnded={() => setVideoEnded(true)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                        <div className="absolute bottom-4 left-4 text-white text-left">
                                            <p className="text-sm font-medium">Welcome to WPM Maker</p>
                                            <p className="text-xs text-white/70">Watch how it identifies your ORP.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold tracking-tight">The Future of Reading</h2>
                                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                            Stop scanning. Start absorbing. Stream words directly into your brain.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={step}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full flex flex-col items-center justify-center h-full gap-8"
                                >
                                    <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                                        <FeatureCard icon={Brain} title="Neuroplasticity" desc="Rewire for speed." delay={0.1} />
                                        <FeatureCard icon={Activity} title="Flow State" desc="Pure immersion." delay={0.2} />
                                        <FeatureCard icon={Zap} title="Retention" desc="Absorb more." delay={0.3} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
                                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                            We identify your Optimal Recognition Point (ORP) to minimize eye movement and maximize comprehension.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    custom={step}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="w-full flex flex-col items-center justify-center h-full gap-6"
                                >
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"
                                    >
                                        <Check className="w-12 h-12" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold tracking-tight">You are ready.</h2>
                                        <p className="text-muted-foreground text-sm max-w-[300px] mx-auto">
                                            Experience reading at the speed of thought. Adjust your WPM and start training.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 border-t border-border flex justify-between items-center bg-muted/20">
                        <Button
                            variant="ghost"
                            onClick={() => setIsOpen(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Skip
                        </Button>
                        <Button onClick={handleNext} className="gap-2 group">
                            {step === 3 ? "Let's Go" : "Next"}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors"
        >
            <div className="p-2 rounded-md bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
        </motion.div>
    )
}
