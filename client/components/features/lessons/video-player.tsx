"use client";

import { useEffect, useRef, useState } from "react";
import { progressService } from "@/services/progress-service";

interface VideoPlayerProps {
    lessonId: number;
    videoUrl: string;
    initialProgress?: number;
}

export function VideoPlayer({ lessonId, videoUrl, initialProgress = 0 }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [lastSaved, setLastSaved] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        if (video && initialProgress > 0) {
            video.currentTime = initialProgress;
        }
    }, [initialProgress]);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;

        // Save progress every 15 seconds
        if (Math.abs(video.currentTime - lastSaved) > 15) {
            saveProgress(video.currentTime);
        }
    };

    const saveProgress = async (currentTime: number) => {
        try {
            await progressService.update(lessonId, {
                video_progress: currentTime,
                is_completed: currentTime / (videoRef.current?.duration || 1) > 0.9,
            });
            setLastSaved(currentTime);
        } catch (error) {
            console.error("Failed to save progress", error);
        }
    };

    return (
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl">
            <video
                ref={videoRef}
                src={videoUrl}
                className="h-full w-full"
                controls
                onTimeUpdate={handleTimeUpdate}
                onPause={(e) => saveProgress(e.currentTarget.currentTime)}
                onEnded={() => saveProgress(videoRef.current?.duration || 0)}
            />
        </div>
    );
}
