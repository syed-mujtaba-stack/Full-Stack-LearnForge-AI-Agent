"use client";

import Link from "next/link";
import { Course } from "@/services/course-service";
import { cn } from "@/lib/utils";

interface CourseCardProps {
    course: Course;
    className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
    return (
        <div className={cn("group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md", className)}>
            <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="font-semibold tracking-tight text-lg">
                    <Link href={`/courses/${course.id}`} className="absolute inset-0">
                        <span className="sr-only">View Course</span>
                    </Link>
                    {course.title}
                </h3>
                {course.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                    </p>
                )}
            </div>
            <div className="flex items-center justify-between p-4 pt-0 text-xs text-muted-foreground">
                <div>{course.modules?.length || 0} Modules</div>
                <div>{new Date(course.created_at).toLocaleDateString()}</div>
            </div>
        </div>
    );
}
