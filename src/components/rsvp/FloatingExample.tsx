"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingExampleProps {
    title: string;
    preview: string;
    onClick: () => void;
    className?: string;
    delay?: number;
}

export const FloatingExample = ({ title, preview, onClick, className, delay = 0 }: FloatingExampleProps) => {
    return (
        <motion.button
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: [0, -10, 0],
                x: [0, 5, -5, 0],
                rotate: [0, 1, -1, 0]
            }}
            transition={{
                opacity: { duration: 0.5, delay },
                y: {
                    repeat: Infinity,
                    duration: 4 + Math.random() * 2,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                },
                x: {
                    repeat: Infinity,
                    duration: 5 + Math.random() * 2,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                },
                rotate: {
                    repeat: Infinity,
                    duration: 6 + Math.random() * 2,
                    ease: "easeInOut",
                    delay: Math.random() * 2
                }
            }}
            className={`absolute p-4 backdrop-blur-sm bg-neutral-900/50 border border-neutral-800 hover:border-[#E07A5F]/50 transition-colors text-left max-w-[200px] cursor-pointer group ${className}`}
            style={{
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" // Organic cloud/blob shape
            }}
        >
            <div className="font-normal text-sm mb-1 text-white group-hover:text-[#E07A5F] transition-colors">{title}</div>
            <div className="text-xs text-neutral-500 line-clamp-2">
                {preview}
            </div>
        </motion.button>
    );
};
