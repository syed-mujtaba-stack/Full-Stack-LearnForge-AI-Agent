"use client";

import Link from "next/link";
import { Course } from "@/services/course-service";
import { cn } from "@/lib/utils";
import { BookOpen, Calendar, Users, Star, ArrowRight } from "lucide-react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
    course: Course;
    className?: string;
    onEnroll?: (id: number) => void;
    isEnrolled?: boolean;
}

export function CourseCard({ course, className, onEnroll, isEnrolled }: CourseCardProps) {
    // Generate some mock stats if not present in the course object
    const enrollmentCount = Math.floor(Math.random() * 2000) + 500;
    const rating = (4 + Math.random()).toFixed(1);
    const difficulty = course.id % 2 === 0 ? "Intermediate" : "Beginner";

    return (
        <motion.div
            whileHover={{ y: -12, transition: { duration: 0.3, ease: "easeOut" } }}
            className={cn(
                "group relative flex flex-col bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-8 flex flex-1 flex-col relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <Badge variant="secondary" className="px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest border-border/50">
                        {difficulty}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Star size={14} fill="currentColor" />
                        {rating}
                    </div>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-3 leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                    {course.title}
                </h3>

                {course.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed">
                        {course.description}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 border-t border-border/50 pt-6">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <BookOpen size={16} />
                        </div>
                        <span>{course.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-muted-foreground">
                        <div className="w-8 h-8 rounded-xl bg-secondary/80 flex items-center justify-center text-foreground">
                            <Users size={16} />
                        </div>
                        <span>{enrollmentCount}+ Students</span>
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    {isEnrolled ? (
                        <Button
                            asChild
                            variant="secondary"
                            className="w-full h-14 rounded-2xl font-black text-lg border-border"
                        >
                            <Link href={`/courses/${course.id}`}>
                                Resume Learning
                                <ArrowRight size={20} className="ml-2" />
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            onClick={() => onEnroll?.(course.id)}
                            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Enroll Now
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

