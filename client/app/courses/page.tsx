import { courseService } from "@/services/course-service";
import { CourseCard } from "@/components/course-card";

export default async function CoursesPage() {
    const courses = await courseService.getAll();

    return (
        <div className="container py-10">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
                        Courses
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Explore our wide range of courses and start learning today.
                    </p>
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <p>No courses found.</p>
                )}
            </div>
        </div>
    );
}
