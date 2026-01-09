import ReactMarkdown from "react-markdown";

interface ArticleViewerProps {
    content: string;
}

export function ArticleViewer({ content }: ArticleViewerProps) {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none py-8">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
