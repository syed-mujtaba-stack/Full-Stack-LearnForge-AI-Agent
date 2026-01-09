"use client";

import { useEffect, useState } from "react";
import { enrollmentService, CourseWithProgress } from "@/services/enrollment-service";
import { ProgressBar } from "@/components/ui/progress-bar";
import Link from "next/link";
import { BookOpen, Clock, LayoutDashboard, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function StudentDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [courses, setCourses] = useState<CourseWithProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/dashboard");
            return;
        }

        const fetchCourses = async () => {
            if (!user) return;
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
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center text-foreground">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Welcome back!
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">Pick up exactly where you left off.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/courses" className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-all font-semibold active:scale-95 border border-border">
                            <Search size={18} />
                            <span>Explore Courses</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Section */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    <motion.div variants={item} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Courses Enrolled</p>
                                <p className="text-2xl font-bold">{courses.length}</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={item} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Completions</p>
                                <p className="text-2xl font-bold">
                                    {courses.filter(c => c.progress === 100).length}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={item} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Avg. Progress</p>
                                <p className="text-2xl font-bold">
                                    {courses.length > 0
                                        ? Math.round(courses.reduce((acc, curr) => acc + curr.progress, 0) / courses.length)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Course List */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold border-b border-border pb-4">My Learning Path</h2>

                    {courses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-muted/30 border border-dashed border-border rounded-3xl"
                        >
                            <p className="text-muted-foreground italic mb-6">You haven't enrolled in any courses yet.</p>
                            <Link href="/courses" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 inline-block">
                                Start Learning Now
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {courses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    variants={item}
                                    whileHover={{ y: -5 }}
                                    className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors tracking-tight">
                                            {course.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 h-10">
                                            {course.description}
                                        </p>

                                        <div className="space-y-4">
                                            <ProgressBar value={course.progress} showLabel={true} />

                                            <Link
                                                href={`/courses/${course.id}`}
                                                className="block w-full text-center py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all active:scale-95"
                                            >
                                                {course.progress > 0 ? "Continue Learning" : "Start Course"}
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
