import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "components/ChatMessage";
import { MCPIcon } from "components/MCPIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rocket, Info } from "lucide-react";
import { SendIcon } from "components/SendIcon";
import brain from "brain";
import { MCPRequest } from "types";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { ToolPills } from "components/ToolPills";

type Message = {
  content: string;
  role: "user" | "assistant";
};

const DEFAULT_INSTRUCTIONS = `
You are helpful assistant that will help the user test and iterate on the tools they are building.
If you only have a health check tool and a calculator tool, then you should instruct the user to build more tools by talking to the Databutton agent.
If you have multiple tools, help the user test and iterate on them.
Your job is only to test tools. For all other requests, tell the user to talk to the Databutton agent.
`.trim()


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `
Hello! Lets build some **powerful AI tools for your need.**

You can tell the **Databutton agent** what tools you want to build and it will build tools that I can use.


When you are happy with your tools, **hit deploy to share it.**
`.trim()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const [instructionsValue, setInstructionsValue] = useState(DEFAULT_INSTRUCTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { role: "user" as const, content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Add assistant message placeholder
      setMessages((prev) => [...prev, { role: "assistant" as const, content: "" }]);

      // Make API call
      const request: MCPRequest = {
        // Send all messages except the empty assistant placeholder
        messages: messages.concat(userMessage).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        // Pass the custom instructions from the textarea
        instructions: instructionsValue
      };

      if (useStreaming) {
        // Handle streaming response
        try {
          let receivedText = "";
          
          // Use the brain client's streaming method
          const streamIterator = brain.mcp_query_stream(request);
          
          try {
            for await (const chunk of streamIterator) {
              if (typeof chunk === 'string') {
                receivedText += chunk;
                
                // Update the assistant's message less frequently to prevent flickering
                // Use a stable reference to avoid unnecessary re-renders
                setMessages((prev) => {
                  const newMessages = [...prev];
                  // Only update content, keep other properties identical
                  newMessages[newMessages.length - 1] = {
                    ...newMessages[newMessages.length - 1],
                    content: receivedText
                  };
                  return newMessages;
                });
                
                // Call scrollToBottom after every content update during streaming
                scrollToBottom();
              }
            }
          } catch (streamError) {
            console.error("Error in stream processing:", streamError);
            throw streamError;
          }
        } catch (error) {
          console.error("Error in stream:", error);
          toast.error("Error receiving streaming response");
        }
      } else {
        // Handle non-streaming response
        const response = await brain.mcp_query(request);
        const responseData = await response.json();

        // Update the placeholder with actual response
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = responseData.response;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error calling MCP API:", error);
      // Remove the placeholder message if there was an error
      setMessages((prev) => prev.slice(0, -1));
      toast.error("Failed to get a response from the AI. Please try again.");
    } finally {
      inputRef.current.focus()
      setIsLoading(false);
    }
  };


  
  return (
    <div className="flex flex-1 flex-col gap-4"  >
      <div  className="flex flex-1 flex-col border rounded-lg overflow-hidden bg-background shadow-sm">
        <div className="p-3 border-b bg-background flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <MCPIcon />
            <h2 className="font-semibold text-lg">MCP Playground</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="streaming-mode" className="text-sm font-medium">Streaming</Label>
              <Switch
                id="streaming-mode"
                checked={useStreaming}
                onCheckedChange={setUseStreaming}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex flex-1 p-4 overflow-y-auto">
          <div className="space-y-2" >
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content || "..."}
                role={message.role}
                isLoading={isLoading && index === messages.length - 1 && message.role === "assistant"}
              />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4 bg-background">
          {/* Tool Pills */}
          <ToolPills />
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
            <Input
              ref={inputRef}
              placeholder="Send a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 rounded-full px-4 py-2 border-border/50 focus-visible:ring-primary/30 h-12"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className="rounded-full w-12 h-12 flex items-center justify-center shrink-0 bg-primary text-primary-foreground hover:shadow-md transition-all duration-200"
            >
              {isLoading ? 
                <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-r-transparent animate-spin"/> : 
                <SendIcon className="h-6 w-6" />
              }
            </Button>
          </form>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="flex flex-col border rounded-lg overflow-hidden bg-background shadow-sm min-h-[200px]">
        <div className="p-3 border-b bg-background flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary"/>
            <div>
              <h2 className="font-semibold text-lg">Instructions</h2>
              <p className="text-sm text-muted-foreground">Customize how the AI responds</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <Textarea
            id="instructions"
            value={instructionsValue}
            onChange={(e) => setInstructionsValue(e.target.value)}
            className="focus-visible:ring-primary/30 border-none h-full resize-none font-mono text-sm overflow-auto placeholder:text-muted-foreground"
            placeholder="Enter custom system instructions for the AI..."
          />
        </div>
      </div>
    </div>
  );
}
