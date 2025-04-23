import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import brain from 'brain';
import { toast } from 'sonner';
import { WrenchIcon, Hammer } from 'lucide-react';

interface Tool {
  name: string;
  description: string;
}

interface ToolPillsProps {
  // No props needed as pills are not clickable
}

export function ToolPills({}: ToolPillsProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch tools when component mounts
    const fetchTools = async () => {
      setIsLoading(true);
      try {
        const response = await brain.mcp_list_tools();
        const data = await response.json();
        setTools(data.tools || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load available tools');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Format description to make it more readable by removing markdown and extra whitespace
  const formatDescription = (description: string) => {
    return description
      .replace(/\n\n/g, ' ') // Replace double newlines with space
      .replace(/\n/g, ' ') // Replace single newlines with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .trim();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 mb-3">
        <p className="text-sm text-muted-foreground">Your tools</p>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <Badge key={i} variant="outline" className="animate-pulse h-6 w-20 py-1 px-3 rounded-[4px]" />
          ))}
        </div>
      </div>
    );
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mb-3">
      <p className="text-sm text-muted-foreground">Your tools</p>
      <div className="flex gap-2 flex-wrap">
        <TooltipProvider delayDuration={100}>
          {tools.map((tool) => (
            <Tooltip key={tool.name}>
              <TooltipTrigger asChild>
                <div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 py-1 px-3 border-primary/40 text-primary hover:border-primary/70 transition-colors rounded-[4px]"
                  >
                    <Hammer className="h-3 w-3" />
                    {tool.name}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="max-w-xs bg-popover border-border text-popover-foreground">
                <p className="text-sm">{formatDescription(tool.description)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
