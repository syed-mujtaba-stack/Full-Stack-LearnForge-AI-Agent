import { fetchClient } from "./api";

export interface UserProgress {
    user_id: string;
    lesson_id: number;
    is_completed: boolean;
    video_progress: number;
    last_accessed: string;
}

export interface UserProgressUpdate {
    is_completed?: boolean;
    video_progress?: number;
}

export const progressService = {
    get: (lessonId: number) =>
        fetchClient<UserProgress>(`/progress/${lessonId}`),

    update: (lessonId: number, data: UserProgressUpdate) =>
        fetchClient<UserProgress>(`/progress/${lessonId}`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
