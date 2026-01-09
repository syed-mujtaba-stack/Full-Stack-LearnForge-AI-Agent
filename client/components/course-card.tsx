"use client";

import Link from "next/link";
import { Course } from "@/services/course-service";
import { cn } from "@/lib/utils";
import { BookOpen, Calendar } from "lucide-react";

import { motion } from "framer-motion";

interface CourseCardProps {
    course: Course;
    className?: string;
    onEnroll?: (id: number) => void;
    isEnrolled?: boolean;
}

export function CourseCard({ course, className, onEnroll, isEnrolled }: CourseCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={cn(
                "group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all",
                className
            )}
        >
            <div className="p-6 flex flex-1 flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Fundamentals
                    </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                </h3>

                {course.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 h-10">
                        {course.description}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-primary" />
                        <span>{course.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        <span>{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {isEnrolled ? (
                        <Link
                            href={`/courses/${course.id}`}
                            className="block w-full text-center py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all active:scale-95 border border-border"
                        >
                            View Course
                        </Link>
                    ) : (
                        <button
                            onClick={() => onEnroll?.(course.id)}
                            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            Enroll Now
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
