import ReactMarkdown from "react-markdown";

interface ArticleViewerProps {
    content: string;
}

export const ArticleViewer = ({ content }: ArticleViewerProps) => {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-black prose-headings:tracking-tight
      prose-a:text-primary prose-strong:text-foreground
      bg-card border border-border p-8 rounded-2xl shadow-sm
    ">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
};
