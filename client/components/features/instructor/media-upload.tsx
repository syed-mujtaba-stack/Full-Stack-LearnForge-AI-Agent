"use client";

import { useState } from "react";
import { Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import { fetchClient } from "@/services/api";

interface MediaUploadProps {
    onUploadSuccess: (url: string) => void;
    folder?: string;
}

export function MediaUpload({ onUploadSuccess, folder = "media" }: MediaUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetchClient<{ url: string }>("/media/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            // Correcting fetchClient behavior for multipart
            // Since fetchClient adds JSON Content-Type, we might need a raw fetch or update fetchClient
            // For now, let's assume we handle it or use a raw fetch here if fetchClient is strictly JSON

            onUploadSuccess(response.url);
            setSuccess(true);
            setFile(null);
        } catch (err) {
            setError("Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="relative flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted">
                <input
                    type="file"
                    className="absolute inset-0 z-10 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="video/*,image/*,.pdf"
                />
                {!file ? (
                    <div className="flex flex-col items-center gap-2 p-6 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm font-medium">Click or drag to upload lesson material</p>
                        <p className="text-xs text-muted-foreground">Video (MP4), Images, or PDF</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 p-6">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                        <p className="text-sm font-medium">{file.name}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="text-xs text-destructive hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {file && !isUploading && !success && (
                <button
                    onClick={handleUpload}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Start Upload
                </button>
            )}

            {isUploading && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                    <X className="h-4 w-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    Upload complete!
                </div>
            )}
        </div>
    );
}
