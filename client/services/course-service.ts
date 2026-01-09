import { fetchClient } from "./api";

export interface Lesson {
    id: number;
    title: string;
    content?: string;
    video_url?: string;
    order: number;
}

export interface Module {
    id: number;
    title: string;
    description?: string;
    order: number;
    lessons: Lesson[];
}

export interface Course {
    id: number;
    title: string;
    description?: string;
    instructor_id: string;
    is_published: boolean;
    created_at: string;
    modules: Module[];
}

export interface CourseCreate {
    title: string;
    description?: string;
    is_published?: boolean;
}

export interface CourseUpdate {
    title?: string;
    description?: string;
    is_published?: boolean;
}

export const courseService = {
    getAll: (skip = 0, limit = 100) =>
        fetchClient<Course[]>(`/courses/?skip=${skip}&limit=${limit}`),

    getById: (id: number) =>
        fetchClient<Course>(`/courses/${id}`),

    create: (data: CourseCreate) =>
        fetchClient<Course>("/courses/", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    update: (id: number, data: CourseUpdate) =>
        fetchClient<Course>(`/courses/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    delete: (id: number) =>
        fetchClient<Course>(`/courses/${id}`, {
            method: "DELETE",
        }),
};
