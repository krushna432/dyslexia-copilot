"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSettings } from "@/hooks/use-settings";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ReaderControls } from "./reader-controls";
import { AiToolbar } from "./ai-toolbar";
import { useSpeech } from "@/hooks/use-speech";
import { HighlightedText } from "./highlighted-text";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";
import { narrate } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type TextReaderProps = {
  initialText?: string;
}

const defaultText = "Welcome to DyslexiaPilot AI. Paste your text here to get started. You can use the controls below to have the text read aloud, and use the AI tools to simplify, summarize, or generate questions about the text.";

export function TextReader({ initialText }: TextReaderProps) {
  const { settings } = useSettings();
  const [text, setText] = useState(initialText || defaultText);
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      // Reset all derived content when initialText changes
      setSimplifiedText(null);
      setSummary(null);
      setAudioDataUri(null);
      cancel();
    }
  }, [initialText]);


  const handleBoundary = useCallback((charIndex: number) => {
    setActiveCharIndex(charIndex);
  }, []);

  const { speak, pause, resume, cancel, speechState } = useSpeech(handleBoundary);

  const textToRead = useMemo(() => simplifiedText || text, [simplifiedText, text]);

  const handlePlay = () => {
    if (audioDataUri) {
      const audio = new Audio(audioDataUri);
      audio.play();
      return;
    }
    if (speechState === 'paused') {
      resume();
    } else {
      speak(textToRead, readingSpeed);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setSimplifiedText(null);
    setSummary(null);
    setAudioDataUri(null);
    cancel();
  }

  const handleStop = () => {
    cancel();
    setActiveCharIndex(-1);
  }

  const handleNarrate = async () => {
    setIsNarrating(true);
    setAudioDataUri(null);
    try {
      const result = await narrate(textToRead);
      if (result.error) throw new Error(result.error);
      setAudioDataUri(result.audioDataUri!);
      toast({ title: "Audio Generated", description: "You can now play the AI-generated audio." });
    } catch (error) {
      toast({ title: "Audio Generation Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsNarrating(false);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col gap-4 max-h-full">
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-4 md:p-6 flex-1 flex flex-col gap-4">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[calc(100vh-20rem)]">
            <Textarea
              value={text}
              onChange={handleTextChange}
              className="h-full min-h-[200px] lg:min-h-0 resize-none text-base"
              placeholder="Paste or type your text here..."
              style={{
                fontSize: `var(--font-size-base)`,
                lineHeight: `var(--line-height-base)`,
              }}
            />
            <Card className="p-4 bg-muted/30">
              <ScrollArea className="h-full">
                {audioDataUri ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-lg mb-4">Audio is ready to play.</p>
                        <audio controls src={audioDataUri} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ) : (
                    <HighlightedText 
                        text={textToRead} 
                        activeCharIndex={activeCharIndex} 
                        speechState={speechState}
                    />
                )}
              </ScrollArea>
            </Card>
          </div>
          {summary && (
             <Alert>
             <Terminal className="h-4 w-4" />
             <AlertTitle>AI Assistant</AlertTitle>
             <AlertDescription>
                {summary && <p className="mb-2"><strong>Summary:</strong> {summary}</p>}
             </AlertDescription>
           </Alert>
          )}
        </CardContent>
      </Card>
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <ReaderControls
                speechState={speechState}
                onPlay={handlePlay}
                onPause={pause}
                onStop={handleStop}
                readingSpeed={readingSpeed}
                onReadingSpeedChange={setReadingSpeed}
                onNarrate={handleNarrate}
                isNarrating={isNarrating}
            />
            <div className="w-full md:w-px h-px md:h-10 bg-border"></div>
            <AiToolbar 
                text={text} 
                onSimplified={(newText) => { setSimplifiedText(newText); setAudioDataUri(null); }}
                onSummarized={setSummary}
                onScanned={(newText) => { setText(newText); setAudioDataUri(null);}}
            />
        </div>
      </Card>
    </div>
  );
}
