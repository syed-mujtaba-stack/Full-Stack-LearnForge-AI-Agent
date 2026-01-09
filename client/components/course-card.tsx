"use client";

import Link from "next/link";
import { Course } from "@/services/course-service";
import { cn } from "@/lib/utils";
import { BookOpen, Calendar, Clock } from "lucide-react";

interface CourseCardProps {
    course: Course;
    className?: string;
    onEnroll?: (id: number) => void;
    isEnrolled?: boolean;
}

export function CourseCard({ course, className, onEnroll, isEnrolled }: CourseCardProps) {
    return (
        <div className={cn(
            "group relative flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-blue-500/10",
            className
        )}>
            <div className="p-6 flex flex-1 flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Fundamentals
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {course.title}
                </h3>

                {course.description && (
                    <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                        {course.description}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-blue-400" />
                        <span>{course.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400" />
                        <span>{new Date(course.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {isEnrolled ? (
                        <Link
                            href={`/courses/${course.id}`}
                            className="block w-full text-center py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-750 transition-colors"
                        >
                            View Course
                        </Link>
                    ) : (
                        <button
                            onClick={() => onEnroll?.(course.id)}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Enroll Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
