"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";
import { useEffect, useState } from "react";

export const LoadingScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
                >
                    {/* Animated Background Pulse */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full"
                        />
                    </div>

                    <div className="relative scale-150">
                        <Logo size={80} className="flex-col !gap-6 scale-125" />

                        {/* Loading Bar */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-12 text-muted-foreground font-medium tracking-widest text-xs uppercase"
                    >
                        Initializing Intelligence
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
