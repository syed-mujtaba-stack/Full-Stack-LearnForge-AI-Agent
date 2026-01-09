import { fetchClient } from "./api";
import { Course } from "./course-service";

export interface Enrollment {
    id: number;
    course_id: number;
    user_id: string;
    enrolled_at: string;
    is_active: boolean;
}

export interface CourseWithProgress extends Course {
    progress: number;
}

export const enrollmentService = {
    enroll: async (courseId: number): Promise<Enrollment> => {
        return fetchClient(`/enrollments/${courseId}/enroll`, {
            method: "POST",
        });
    },

    getMyCourses: async (): Promise<CourseWithProgress[]> => {
        return fetchClient("/enrollments/my-courses");
    },

    checkEnrollment: async (courseId: number): Promise<boolean> => {
        try {
            const courses = await enrollmentService.getMyCourses();
            return courses.some((c) => c.id === courseId);
        } catch {
            return false;
        }
    },
};
