import React from "react";
import { cn } from "utils/cn";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SparklesIcon } from "components/SparklesIcon";
import { UserIcon } from "components/UserIcon";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
}

export function ChatMessage({ content, role, isLoading }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 mb-6",
      role === "user" ? "justify-end" : "justify-start"
    )}>
      {role === "assistant" && (
        <Avatar className="h-8 w-8 shrink-0 select-none bg-primary text-primary-foreground flex items-center justify-center">
          <SparklesIcon className="h-4 w-4" />
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[85%] px-4 py-3 rounded-2xl shadow-sm",
        role === "user" 
          ? "chat-bubble-user rounded-tr-none" 
          : "chat-bubble-assistant rounded-tl-none prose prose-sm max-w-none dark:prose-invert"
      )}>
        {role === "user" ? content : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="prose prose-sm max-w-none break-words"
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <div className="my-4 rounded-md overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                      <pre className="!m-0 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <code
                    className={`${className} py-0.5 px-1.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>

      {role === "user" && (
        <Avatar className="h-8 w-8 shrink-0 select-none bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 flex items-center justify-center">
          <UserIcon className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
}
