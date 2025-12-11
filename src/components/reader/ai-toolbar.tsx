"use client";

import { useState } from "react";
import { Wand2, ScanText, FileQuestion, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { simplify, summarize } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadDialog } from "./image-upload-dialog";
import { generateQuestions } from "@/app/actions";
import Link from "next/link";


type AiToolbarProps = {
  text: string;
  onSimplified: (simplifiedText: string) => void;
  onSummarized: (summary: string) => void;
  onScanned: (scannedText: string) => void;
};

export function AiToolbar({
  text,
  onSimplified,
  onSummarized,
  onScanned,
}: AiToolbarProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = async (action: 'simplify' | 'summarize') => {
    if (!text) {
      toast({ title: "No text to process", description: "Please enter some text first.", variant: "destructive" });
      return;
    }
    setLoading(action);
    try {
      if (action === 'simplify') {
        const result = await simplify(text);
        if (result.error) throw new Error(result.error);
        onSimplified(result.simplifiedText!);
        toast({ title: "Text Simplified", description: "The text has been simplified for easier reading." });
      } else if (action === 'summarize') {
        const result = await summarize(text);
        if (result.error) throw new Error(result.error);
        onSummarized(result.summary!);
        toast({ title: "Summary Generated", description: "A summary of the text is now available." });
      }
    } catch (error) {
      toast({ title: "An error occurred", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const isLoading = (action: string) => loading === action;

  return (
    <>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => handleAction('simplify')} disabled={!!loading}>
              <Wand2 className={isLoading('simplify') ? 'animate-spin' : ''}/>
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Simplify Text</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => handleAction('summarize')} disabled={!!loading}>
              <BookText className={isLoading('summarize') ? 'animate-spin' : ''}/>
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Summarize</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
             <Button variant="ghost" size="icon" asChild>
                <Link href="/quiz">
                    <FileQuestion/>
                </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Generate Quiz</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)} disabled={!!loading}>
              <ScanText />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Scan from Image</p></TooltipContent>
        </Tooltip>
      </div>
      <ImageUploadDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onScanned={onScanned}
      />
    </>
  );
}
