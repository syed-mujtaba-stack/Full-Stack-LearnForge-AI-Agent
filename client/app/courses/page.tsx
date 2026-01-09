"use client";

import { useEffect, useState } from "react";
import { courseService, Course } from "@/services/course-service";
import { enrollmentService, CourseWithProgress } from "@/services/enrollment-service";
import { CourseCard } from "@/components/course-card";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allCourses, myCourses] = await Promise.all([
                    courseService.getAll(),
                    enrollmentService.getMyCourses()
                ]);
                setCourses(allCourses);
                setEnrolledIds(myCourses.map(c => c.id));
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnroll = async (courseId: number) => {
        setEnrolling(courseId);
        try {
            await enrollmentService.enroll(courseId);
            setEnrolledIds(prev => [...prev, courseId]);
            // Optional: redirect to course page or dashboard
            router.push(`/dashboard`);
        } catch (error) {
            console.error("Enrollment failed", error);
        } finally {
            setEnrolling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="text-xl animate-pulse">Curating your path to mastery...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-indigo-400 mb-6">
                        Unlock Your Potential
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Join thousands of learners mastering AI, development, and more.
                        Premium content curated for the next generation of engineers.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isEnrolled={enrolledIds.includes(course.id)}
                                onEnroll={handleEnroll}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl text-center">
                            <p className="text-slate-500 italic">No courses have been published yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
