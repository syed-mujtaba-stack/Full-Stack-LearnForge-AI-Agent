import { courseService } from "@/services/course-service";
import { progressService } from "@/services/progress-service";
import { VideoPlayer } from "@/components/features/lessons/video-player";
import { ArticleViewer } from "@/components/features/lessons/article-viewer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function LessonPage({ params }: { params: { id: string, lessonId: string } }) {
    const courseId = parseInt(params.id);
    const lessonId = parseInt(params.lessonId);

    const course = await courseService.getById(courseId);
    const lesson = course.modules
        .flatMap(m => m.lessons)
        .find(l => l.id === lessonId);

    if (!lesson) {
        return <div>Lesson not found</div>;
    }

    // Fetch student progress for this lesson
    let progress = { video_progress: 0 };
    try {
        progress = await progressService.get(lessonId);
    } catch (e) {
        console.warn("Could not fetch progress", e);
    }

    return (
        <div className="container max-w-5xl py-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link href={`/courses/${courseId}`} className="hover:text-foreground">
                    {course.title}
                </Link>
                <span>/</span>
                <span className="text-foreground">{lesson.title}</span>
            </div>

            <div className="space-y-8">
                {lesson.video_url ? (
                    <VideoPlayer
                        lessonId={lessonId}
                        videoUrl={lesson.video_url}
                        initialProgress={progress.video_progress}
                    />
                ) : null}

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{lesson.title}</h1>
                    {lesson.content && <ArticleViewer content={lesson.content} />}
                </div>
            </div>

            <div className="flex justify-between items-center mt-12 pt-8 border-t">
                <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Previous Lesson
                </button>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                    Next Lesson <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
