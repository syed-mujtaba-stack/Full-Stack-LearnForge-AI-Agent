"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, ThumbsUp, ThumbsDown, Edit2, RotateCcw, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    feedback?: 'like' | 'dislike';
    isEditing?: boolean;
}

interface AIAssistantProps {
    courseContext?: string;
}

const STORAGE_KEY = 'edugenius_chat_history';

export default function AIAssistant({ courseContext }: AIAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        } else {
            // Welcome message
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: "Hello! I'm your **EduGenius AI Learning Assistant**. How can I help you with your studies today?",
                    timestamp: Date.now(),
                }
            ]);
        }
    }, []);

    // Save history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isLoading]);

    const handleSend = async (content: string = input) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setSuggestions([]);

        try {
            // Simulate AI response for now (would call your FastAPI backend)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I've analyzed your question based on the **${courseContext || 'General'}** context. 

Here is some sample code to help you visualize:

\`\`\`javascript
function learnAgenticAI() {
  console.log("EduGenius is processing your request...");
  return {
    status: "Success",
    poweredBy: "Agents"
  };
}
\`\`\`

Would you like me to explain this in more detail?`,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMessage]);
            setSuggestions([
                "Explain the code above",
                "Give me a practical example",
                "How is this different from LLMs?"
            ]);
        } catch (e) {
            console.error("Chat error", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFeedback = (id: string, type: 'like' | 'dislike') => {
        setMessages(prev => prev.map(m =>
            m.id === id ? { ...m, feedback: m.feedback === type ? undefined : type } : m
        ));
    };

    const startEditing = (message: Message) => {
        setEditingId(message.id);
        setEditingContent(message.content);
    };

    const saveEdit = () => {
        if (!editingId) return;
        setMessages(prev => prev.map(m =>
            m.id === editingId ? { ...m, content: editingContent } : m
        ));
        setEditingId(null);
        setEditingContent('');
    };

    return (
        <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto overflow-hidden bg-background/50 backdrop-blur-xl border-border/50 shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-primary/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Agentic Tutor</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Powered by Google Gemini 2.0
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                }}>
                    <RotateCcw size={18} />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-4">
                <div className="space-y-6">
                    {messages.map((m) => (
                        <div key={m.id} className={cn(
                            "flex gap-4 group",
                            m.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                m.role === 'user' ? "bg-secondary border-border" : "bg-primary/10 border-primary/20 text-primary"
                            )}>
                                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={cn(
                                "flex flex-col gap-2 max-w-[80%]",
                                m.role === 'user' ? "items-end" : "items-start"
                            )}>
                                <div className={cn(
                                    "px-4 py-3 rounded-2xl relative",
                                    m.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted/50 border border-border/50 rounded-tl-none"
                                )}>
                                    {editingId === m.id ? (
                                        <div className="flex flex-col gap-2 min-w-[300px]">
                                            <textarea
                                                className="bg-transparent text-inherit resize-none focus:outline-none w-full"
                                                rows={3}
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                                                <Button size="sm" className="h-7 text-xs bg-white text-primary hover:bg-white/90" onClick={saveEdit}>Save</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    code({ node, inline, className, children, ...props }: any) {
                                                        const match = /language-(\w+)/.exec(className || '');
                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                className="rounded-lg !my-2"
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className={cn("bg-slate-800 px-1.5 py-0.5 rounded text-pink-400", className)} {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    },
                                                    table({ children }) {
                                                        return <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-border border rounded-lg">{children}</table></div>
                                                    },
                                                    th({ children }) { return <th className="px-4 py-2 bg-muted/50 text-left font-bold">{children}</th> },
                                                    td({ children }) { return <td className="px-4 py-2 border-t">{children}</td> }
                                                }}
                                            >
                                                {m.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {/* Message Actions */}
                                    <div className={cn(
                                        "absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded-full bg-background border border-border/50 shadow-sm",
                                        m.role === 'user' ? "right-0" : "left-0"
                                    )}>
                                        {m.role === 'assistant' ? (
                                            <>
                                                <button onClick={() => handleFeedback(m.id, 'like')} className={cn("p-1 hover:text-primary transition-colors", m.feedback === 'like' && "text-primary")}>
                                                    <ThumbsUp size={12} fill={m.feedback === 'like' ? "currentColor" : "none"} />
                                                </button>
                                                <button onClick={() => handleFeedback(m.id, 'dislike')} className={cn("p-1 hover:text-destructive transition-colors", m.feedback === 'dislike' && "text-destructive")}>
                                                    <ThumbsDown size={12} fill={m.feedback === 'dislike' ? "currentColor" : "none"} />
                                                </button>
                                                <div className="w-[1px] h-3 bg-border mx-1" />
                                                <button className="p-1 hover:text-primary transition-colors" onClick={() => navigator.clipboard.writeText(m.content)}>
                                                    <Copy size={12} />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEditing(m)} className="p-1 hover:text-primary transition-colors">
                                                <Edit2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground px-2">
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <Bot size={16} />
                            </div>
                            <div className="bg-muted/50 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Footer / Input */}
            <div className="p-6 border-t border-border/50 bg-background/50">
                {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(s)}
                                className="text-xs px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center gap-1.5 text-primary font-medium"
                            >
                                <Sparkles size={10} />
                                {s}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                        <textarea
                            placeholder="Ask anything about your course..."
                            className="w-full bg-muted/50 border border-border/50 focus:border-primary/50 rounded-2xl px-4 py-3 min-h-[50px] max-h-[150px] resize-none focus:outline-none transition-all pr-12"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">Shift + Enter for new line</span>
                        </div>
                    </div>
                    <Button
                        className="rounded-full w-12 h-12 shrink-0 shadow-lg shadow-primary/20"
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                    >
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
