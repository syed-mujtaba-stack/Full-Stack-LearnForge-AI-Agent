"use client";

import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
    size?: number;
    animated?: boolean;
}

export const Logo = ({ className = "", size = 40, animated = true }: LogoProps) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <motion.div
                className="relative flex items-center justify-center"
                initial={animated ? { rotate: -10, scale: 0.9, opacity: 0 } : {}}
                animate={animated ? { rotate: 0, scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ width: size, height: size }}
            >
                {/* Background Glow */}
                <motion.div
                    className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                    animate={animated ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                    } : {}}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 w-full h-full"
                >
                    {/* Abstract Brain/G Geometry */}
                    <motion.path
                        d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-primary"
                        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
                        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M50 30L50 15"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="text-primary"
                        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
                        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
                    />
                    <motion.path
                        d="M50 70L50 85"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="text-primary"
                        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
                        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="10"
                        className="fill-primary"
                        initial={animated ? { scale: 0 } : {}}
                        animate={animated ? { scale: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.8, type: "spring", stiffness: 200 }}
                    />
                </svg>
            </motion.div>

            <motion.span
                className="text-2xl font-black tracking-tighter"
                initial={animated ? { x: -10, opacity: 0 } : {}}
                animate={animated ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                EduGenius<span className="text-primary">.</span>
            </motion.span>
        </div>
    );
};
