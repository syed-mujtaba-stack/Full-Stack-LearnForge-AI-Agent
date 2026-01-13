import { courseService } from "@/services/course-service";
import { progressService } from "@/services/progress-service";
import { VideoPlayer } from "@/components/features/lessons/video-player";
import { ArticleViewer } from "@/components/features/lessons/article-viewer";
import { LessonClient } from "@/components/features/lessons/lesson-client";
import { LessonQuiz } from "@/components/features/ai/lesson-quiz";
import { ChevronLeft, ChevronRight, Brain } from "lucide-react";
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
        <LessonClient courseId={courseId}>
            <div className="min-h-screen bg-background text-foreground pb-20">
                <div className="container max-w-5xl py-10 px-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-12 bg-muted/30 px-4 py-2 rounded-full w-fit border border-border">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link href={`/courses/${courseId}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[200px]">
                            {course.title}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium line-clamp-1">{lesson.title}</span>
                    </div>

                    <div className="space-y-12">
                        {lesson.video_url ? (
                            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border bg-black aspect-video">
                                <VideoPlayer
                                    lessonId={lessonId}
                                    videoUrl={lesson.video_url}
                                    initialProgress={progress.video_progress}
                                />
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{lesson.title}</h1>
                            {lesson.content && <ArticleViewer content={lesson.content} />}
                        </div>

                        {/* AI Quiz Section */}
                        <div id="quiz" className="mt-20 space-y-8 pt-20 border-t border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Brain className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Knowledge Check</h2>
                            </div>
                            <LessonQuiz lessonId={lessonId} />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-20 pt-10 border-t border-border">
                        {/* Pagination buttons - can be enhanced later to link real lessons */}
                        <button className="flex items-center gap-3 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all active:scale-95 border border-border">
                            <ChevronLeft className="h-5 w-5" /> Previous
                        </button>
                        <button className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                            Next <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </LessonClient>
    );
}
