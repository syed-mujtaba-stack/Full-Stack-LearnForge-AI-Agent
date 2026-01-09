"use client";

import { useEffect, useState } from "react";
import { courseService, Course } from "@/services/course-service";
import { enrollmentService } from "@/services/enrollment-service";
import { CourseCard } from "@/components/course-card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { useAuth } from "@/components/auth/auth-provider";

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

export default function CoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [enrolling, setEnrolling] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Always fetch all courses
                const allCourses = await courseService.getAll();
                setCourses(allCourses);

                // Only fetch user-specific enrollments if logged in
                if (user) {
                    const myCourses = await enrollmentService.getMyCourses();
                    setEnrolledIds(myCourses.map(c => c.id));
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleEnroll = async (courseId: number) => {
        if (!user) {
            router.push(`/login?redirect=/courses`);
            return;
        }

        setEnrolling(courseId);
        try {
            await enrollmentService.enroll(courseId);
            setEnrolledIds(prev => [...prev, courseId]);
            router.push(`/dashboard`);
        } catch (error) {
            console.error("Enrollment failed", error);
        } finally {
            setEnrolling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-xl animate-pulse font-medium">Curating your path to mastery...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-20 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                        Unlock Your <span className="text-primary italic">Potential</span>
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Join thousands of learners mastering AI, development, and engineering.
                        Premium content curated for the next generation.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <motion.div key={course.id} variants={item}>
                                <CourseCard
                                    course={course}
                                    isEnrolled={enrolledIds.includes(course.id)}
                                    onEnroll={handleEnroll}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-muted/20 border border-dashed border-border rounded-3xl text-center">
                            <p className="text-muted-foreground italic">No courses have been published yet. Check back soon!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
