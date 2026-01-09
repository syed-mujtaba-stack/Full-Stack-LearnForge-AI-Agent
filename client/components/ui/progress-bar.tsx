import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    showLabel?: boolean;
}

export const ProgressBar = ({
    value,
    max = 100,
    className,
    showLabel = false,
}: ProgressBarProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div className="flex justify-between mb-1 text-xs font-medium text-slate-400">
                    <span>Progress</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
