import ReactMarkdown from "react-markdown";
import { CodeHelper } from "@/components/features/ai/code-helper";

interface ArticleViewerProps {
    content: string;
}

export const ArticleViewer = ({ content }: ArticleViewerProps) => {
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-black prose-headings:tracking-tight
      prose-a:text-primary prose-strong:text-foreground
      bg-card border border-border p-8 rounded-3xl shadow-sm
    ">
            <ReactMarkdown
                components={{
                    code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";
                        const isInline = !match;

                        if (isInline) {
                            return (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-bold" {...props}>
                                    {children}
                                </code>
                            );
                        }

                        const codeString = String(children).replace(/\n$/, "");

                        return (
                            <div className="relative my-6 group/markdown-code">
                                <CodeHelper code={codeString} language={language || "code"} />
                                <pre className="!bg-muted/50 !p-6 !rounded-2xl !border !border-border overflow-x-auto">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
