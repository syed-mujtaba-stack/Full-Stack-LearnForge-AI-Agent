"use client";

import { useEffect, useState } from "react";
import { enrollmentService, CourseWithProgress } from "@/services/enrollment-service";
import { ProgressBar } from "@/components/ui/progress-bar";
import { CourseCard } from "@/components/course-card";
import Link from "next/link";
import { BookOpen, Clock, LayoutDashboard, Search } from "lucide-react";

export default function StudentDashboard() {
    const [courses, setCourses] = useState<CourseWithProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await enrollmentService.getMyCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch enrolled courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center text-slate-200">
                <div className="animate-pulse text-xl">Loading your dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Welcome back!
                        </h1>
                        <p className="text-slate-400 mt-2">Pick up exactly where you left off.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/courses" className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors">
                            <Search size={18} />
                            <span>Explore Courses</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Courses Enrolled</p>
                                <p className="text-2xl font-bold">{courses.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Completions</p>
                                <p className="text-2xl font-bold">
                                    {courses.filter(c => c.progress === 100).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Avg. Progress</p>
                                <p className="text-2xl font-bold">
                                    {courses.length > 0
                                        ? Math.round(courses.reduce((acc, curr) => acc + curr.progress, 0) / courses.length)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course List */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold border-b border-slate-800 pb-4">My Learning Path</h2>

                    {courses.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                            <p className="text-slate-500 italic">You hasn't enrolled in any courses yet.</p>
                            <Link href="/courses" className="text-blue-500 hover:underline mt-4 inline-block">
                                Browse catalog
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <div key={course.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                                            {course.description}
                                        </p>

                                        <div className="space-y-4">
                                            <ProgressBar value={course.progress} showLabel={true} />

                                            <Link
                                                href={`/courses/${course.id}`} // Or Link to first lesson
                                                className="block w-full text-center py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                            >
                                                {course.progress > 0 ? "Continue Learning" : "Start Course"}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
