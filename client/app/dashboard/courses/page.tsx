import { courseService } from "@/services/course-service";
import { CourseCard } from "@/components/course-card";
import Link from "next/link";

export default async function DashboardCoursesPage() {
    const courses = await courseService.getAll();
    // Ideally fetch only my courses: courseService.getMyCourses(instructorId)
    // For now, listing all for demo or assuming backend filters if I pass auth token (which server component might not have easily without cookies)
    // TODO: Add auth token passing for Server Components or use Client Component with `useQuery`.

    return (
        <div className="flex flex-col gap-8 p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
                    <p className="text-muted-foreground">
                        Manage your courses and content.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/courses/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Create Course
                    </Link>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
