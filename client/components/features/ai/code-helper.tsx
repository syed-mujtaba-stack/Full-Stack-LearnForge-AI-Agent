"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, X, Terminal } from "lucide-react";
import { aiService } from "@/services/ai";

interface CodeHelperProps {
    code: string;
    language: string;
}

export function CodeHelper({ code, language }: CodeHelperProps) {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleExplain = async () => {
        setShowPopup(true);
        if (explanation) return;

        setIsLoading(true);
        try {
            const result = await aiService.explainCode(code, language) as { explanation: string };
            setExplanation(result.explanation);
        } catch (error) {
            setExplanation("Failed to get explanation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative group/code">
            {/* Explain Button - visible on hover of code block container */}
            <button
                onClick={handleExplain}
                className="absolute top-4 right-4 p-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-lg transition-all flex items-center gap-2 text-xs font-bold border border-primary/20 backdrop-blur-md opacity-0 group-hover/code:opacity-100 z-10"
            >
                <Sparkles className="w-3.5 h-3.5" /> Explain with AI
            </button>

            {/* Explanation Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 lg:inset-auto lg:right-8 lg:bottom-24 lg:w-[400px] lg:h-[500px] bg-card border border-border shadow-2xl z-[100] flex flex-col rounded-3xl overflow-hidden m-4 lg:m-0"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/20 rounded-lg">
                                    <Terminal className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-sm font-bold capitalize">{language} Assistant</h3>
                            </div>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="p-1 hover:bg-muted rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <p className="text-sm font-medium animate-pulse">Analyzing logic...</p>
                                </div>
                            ) : (
                                <div className="prose prose-sm dark:prose-invert">
                                    <div className="p-3 bg-muted rounded-xl mb-4 text-[10px] font-mono text-muted-foreground line-clamp-3">
                                        {code}
                                    </div>
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {explanation}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-card text-center">
                            <p className="text-[10px] text-muted-foreground">
                                Powered by Gemini 2.0 Flash
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
