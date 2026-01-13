"use client";

import { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { AIChatSidebar } from "@/components/features/ai/ai-chat-sidebar";
import { motion, AnimatePresence } from "framer-motion";

interface LessonClientProps {
    courseId: number;
    children: React.ReactNode;
}

export function LessonClient({ courseId, children }: LessonClientProps) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="relative min-h-screen">
            {children}

            {/* Floating AI Toggle */}
            <AnimatePresence>
                {!isChatOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsChatOpen(true)}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center group z-[90] hover:scale-110 active:scale-95 transition-transform"
                    >
                        <Bot className="w-6 h-6" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 px-3 py-1 bg-card border border-border rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            Ask AI Tutor
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AIChatSidebar
                courseId={courseId}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </div>
    );
}
