"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingExampleProps {
    title: string;
    preview: string;
    onClick: () => void;
    className?: string;
    shape?: string;
    delay?: number;
}

export const FloatingExample = ({ title, preview, onClick, className, delay = 0, shape }: FloatingExampleProps) => {
    // Default organic shape if none provided
    const defaultShape = "30% 70% 70% 30% / 30% 30% 70% 70%";

    return (
        <motion.button
            onClick={onClick}
            initial={{ y: 20, opacity: 1 }} // Start fully visible, just slide up
            animate={{
                y: [0, -8, 0],
                rotate: [0, 1, 0]
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            className={`absolute p-6 backdrop-blur-md bg-neutral-900/40 border border-neutral-800 hover:border-[#E07A5F]/50 hover:bg-neutral-900/60 transition-all text-left w-[240px] cursor-pointer group ${className}`}
            style={{
                borderRadius: shape || defaultShape
            }}
        >
            <div className="font-normal text-sm mb-1 text-white group-hover:text-[#E07A5F] transition-colors">{title}</div>
            <div className="text-xs text-neutral-500 line-clamp-2">
                {preview}
            </div>
        </motion.button>
    );
};
