import { fetchClient } from "./api";

export const aiService = {
    chat: async (courseId: number, message: string, history: any[] = []) => {
        return fetchClient('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
                course_id: courseId,
                message,
                history
            })
        });
    },

    generateQuiz: async (lessonId: number) => {
        return fetchClient('/ai/generate-quiz', {
            method: 'POST',
            body: JSON.stringify({
                lesson_id: lessonId
            })
        });
    },

    explainCode: async (code: string, language: string = "python") => {
        return fetchClient('/ai/explain-code', {
            method: 'POST',
            body: JSON.stringify({
                code,
                language
            })
        });
    }
};
