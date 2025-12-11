"use client";

import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Wand2, Loader2, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkWriting, simplify } from '@/app/actions';
import { useSettings } from '@/hooks/use-settings';

// SpeechRecognition might not be available in all browsers or on the server
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

type Correction = {
  original: string;
  corrected: string;
  explanation: string;
};

export function WritingEditor() {
  const { settings } = useSettings();
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRephrasing, setIsRephrasing] = useState(false);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const recognitionRef = useState<SpeechRecognition | null>(null);

  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (corrections.length > 0) {
      setCorrections([]);
    }
  };

  const setupRecognition = useCallback(() => {
    if (!SpeechRecognition) {
      toast({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support voice-to-text.',
        variant: 'destructive',
      });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
       setText(prevText => prevText + finalTranscript);
    };

    recognition.onerror = (event) => {
        toast({
            title: "Speech Recognition Error",
            description: event.error,
            variant: "destructive"
        })
        setIsListening(false);
    }
    
    recognition.onend = () => {
        setIsListening(false);
    }

    recognitionRef[1](recognition);
  }, [toast]);

  useEffect(() => {
    setupRecognition();
  }, [setupRecognition]);
  
  const toggleListening = () => {
    const recognition = recognitionRef[0];
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleCheckWriting = async () => {
    if (!text) return;
    setIsLoading(true);
    setCorrections([]);
    try {
      const result = await checkWriting(text);
      if (result.error) throw new Error(result.error);
      setText(result.correctedText!);
      setCorrections(result.corrections!);
      toast({ title: 'Text Checked', description: 'Corrections have been applied.' });
    } catch (error) {
      toast({ title: 'Error Checking Text', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRephrase = async () => {
    if (!text) return;
    setIsRephrasing(true);
    setCorrections([]);
    try {
      const result = await simplify(text);
      if (result.error) throw new Error(result.error);
      setText(result.simplifiedText!);
      toast({ title: 'Text Rephrased', description: 'Your text has been simplified and rephrased.' });
    } catch (error) {
      toast({ title: 'Error Rephrasing Text', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsRephrasing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
      <div className="md:col-span-2 flex flex-col gap-4">
         <Card className="flex-1">
           <CardContent className="p-0 flex flex-col h-full">
            <Textarea
              value={text}
              onChange={handleTextChange}
              className="h-full flex-1 resize-none border-0 focus-visible:ring-0 text-base"
              placeholder="Start writing here..."
              style={{
                fontSize: `var(--font-size-base)`,
                lineHeight: `var(--line-height-base)`,
              }}
            />
             <div className="flex items-center justify-between p-2 border-t">
               <div className="flex items-center gap-2">
                <Button onClick={handleCheckWriting} disabled={isLoading || isRephrasing || !text}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                    <span className="ml-2">Check Text</span>
                </Button>
                <Button variant="outline" onClick={handleRephrase} disabled={isRephrasing || isLoading || !text}>
                    {isRephrasing ? <Loader2 className="animate-spin" /> : <Pilcrow />}
                    <span className="ml-2">Rephrase</span>
                </Button>
               </div>
               <Button onClick={toggleListening} variant="ghost" size="icon" disabled={!SpeechRecognition}>
                {isListening ? <MicOff className="text-red-500" /> : <Mic />}
              </Button>
            </div>
           </CardContent>
         </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
            <CardDescription>
              Here are some suggestions to improve your writing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {corrections.length > 0 ? (
              <ul className="space-y-4">
                {corrections.map((correction, index) => (
                  <li key={index} className="p-3 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <span className="line-through">{correction.original}</span> → <strong className="text-foreground">{correction.corrected}</strong>
                    </p>
                    <p className="text-sm mt-1">{correction.explanation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Write some text and click "Check Text" for suggestions or "Rephrase" to simplify your sentences.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
