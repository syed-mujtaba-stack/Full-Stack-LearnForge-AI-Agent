"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, XCircle, ChevronRight, RotateCcw, Loader2, Brain } from "lucide-react";
import { aiService } from "@/services/ai";

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

interface Quiz {
    title: string;
    questions: Question[];
}

interface LessonQuizProps {
    lessonId: number;
}

export function LessonQuiz({ lessonId }: LessonQuizProps) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const startQuiz = async () => {
        setIsLoading(true);
        try {
            const result = await aiService.generateQuiz(lessonId) as Quiz;
            setQuiz(result);
            setCurrentIdx(0);
            setScore(0);
            setIsFinished(false);
            setSelected(null);
            setShowExplanation(false);
        } catch (error) {
            console.error("Failed to generate quiz", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (option: string) => {
        if (showExplanation) return;
        setSelected(option);
        setShowExplanation(true);
        if (option === quiz?.questions[currentIdx].correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIdx < (quiz?.questions.length || 0) - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelected(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 text-center space-y-4 bg-muted/30 rounded-3xl border border-dashed border-border flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="space-y-1">
                    <p className="font-bold">Generating AI Quiz...</p>
                    <p className="text-sm text-muted-foreground">Analyzing lesson content for key concepts.</p>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="p-8 text-center bg-card border border-border rounded-3xl space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold">Ready for a challenge?</h3>
                    <p className="text-sm text-muted-foreground">Test your knowledge with an AI-generated quiz based on this lesson.</p>
                </div>
                <button
                    onClick={startQuiz}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                    <Sparkles className="w-4 h-4" /> Start Knowledge Check
                </button>
            </div>
        );
    }

    if (isFinished) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center bg-card border border-border rounded-3xl space-y-6"
            >
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                    <div className="text-4xl font-black text-primary py-4">
                        {score}/{quiz.questions.length}
                    </div>
                    <p className="text-muted-foreground">
                        {score === quiz.questions.length ? "Mastery achieved! Flawless victory." : "Great effort! Review the materials and try again."}
                    </p>
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={startQuiz}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" /> Retake Quiz
                    </button>
                </div>
            </motion.div>
        );
    }

    const q = quiz.questions[currentIdx];

    return (
        <div className="p-8 bg-card border border-border rounded-3xl space-y-8">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <h3 className="text-xl font-bold">{q.question}</h3>

            {/* Options */}
            <div className="grid gap-3">
                {q.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        disabled={showExplanation}
                        className={`p-4 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between group ${selected === opt
                            ? (opt === q.correct_answer ? "bg-green-500/10 border-green-500 text-green-600" : "bg-red-500/10 border-red-500 text-red-600")
                            : (showExplanation && opt === q.correct_answer ? "bg-green-500/10 border-green-500 text-green-600" : "bg-muted hover:bg-muted/80 border border-transparent")
                            }`}
                    >
                        {opt}
                        {selected === opt && (
                            opt === q.correct_answer ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        {!showExplanation && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-muted/50 rounded-2xl space-y-2 border border-border"
                    >
                        <p className="text-xs font-bold uppercase text-primary">Explanation</p>
                        <p className="text-sm text-muted-foreground">{q.explanation}</p>
                        <button
                            onClick={nextQuestion}
                            className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm"
                        >
                            {currentIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
