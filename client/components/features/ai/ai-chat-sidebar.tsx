"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AIAssistant from "./ai-assistant";

interface AIChatSidebarProps {
    courseId: number;
    isOpen: boolean;
    onClose: () => void;
}

export function AIChatSidebar({ courseId, isOpen, onClose }: AIChatSidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar Container */}
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-transparent z-[101] flex flex-col p-4 md:p-6"
                    >
                        <div className="relative flex-1 flex flex-col">
                            {/* Close Button Inside Container */}
                            <button
                                onClick={onClose}
                                className="absolute -left-4 top-10 md:-left-12 p-2 bg-background border border-border rounded-full shadow-xl hover:bg-muted transition-colors z-[102]"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* The Powerful AI Assistant */}
                            <div className="flex-1 shadow-2xl rounded-[2.5rem] overflow-hidden">
                                <AIAssistant courseContext={`Course ID: ${courseId}`} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

