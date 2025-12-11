
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Loader2, RefreshCw, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFeedback } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const practiceSentences = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "The sun always shines brightest after the rain.",
    "She sells seashells by the seashore.",
    "To be or not to be, that is the question."
];

// SpeechRecognition might not be available in all browsers or on the server
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

export default function ReadingPracticePage() {
    const [currentSentence, setCurrentSentence] = useState('');
    const [userTranscript, setUserTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const { toast } = useToast();

    const selectNewSentence = useCallback(() => {
        // Stop any active recognition
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        setIsLoading(false);
        
        let newSentence = currentSentence;
        // Ensure we get a new sentence
        while(newSentence === currentSentence) {
            const randomIndex = Math.floor(Math.random() * practiceSentences.length);
            newSentence = practiceSentences[randomIndex];
        }
        setCurrentSentence(newSentence);
        setUserTranscript('');
        setFeedback(null);
    }, [isListening, currentSentence]);

    useEffect(() => {
        selectNewSentence();
    }, []); // Only run once on mount

    const setupRecognition = useCallback(() => {
        if (!SpeechRecognition) {
            toast({
                title: 'Speech Recognition Not Supported',
                description: 'Your browser does not support voice-to-text.',
                variant: 'destructive',
            });
            return;
        }
        if(recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setUserTranscript(transcript.trim());
            handleGetFeedback(currentSentence, transcript.trim());
        };

        recognition.onerror = (event) => {
            toast({
                title: "Speech Recognition Error",
                description: event.error,
                variant: "destructive"
            });
            setIsListening(false);
            setIsLoading(false);
        }
        
        recognition.onend = () => {
            setIsListening(false);
        }

        recognitionRef.current = recognition;
    }, [toast, currentSentence]); // Rerun setup if sentence changes


    useEffect(() => {
        setupRecognition();
    }, [setupRecognition]);
    
    const handleStartListening = () => {
        const recognition = recognitionRef.current;
        if (!recognition || isListening || isLoading) return;

        setUserTranscript('');
        setFeedback(null);
        setIsListening(true);
        recognition.start();
    };

    const handleGetFeedback = async (original: string, userAttempt: string) => {
        if (!userAttempt) {
            setIsListening(false);
            return;
        }
        setIsLoading(true);
        try {
            const result = await getFeedback(original, userAttempt);
            if (result.error) throw new Error(result.error);
            setFeedback(result.feedback!);
        } catch (error) {
            toast({ title: 'Error getting feedback', description: (error as Error).message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline tracking-tight">Reading Practice</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Read the sentences aloud and get friendly feedback from your AI coach.
                </p>
            </header>
            
            <div className="max-w-2xl mx-auto grid gap-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            Your Sentence to Read
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold text-center p-8 bg-muted/40 rounded-lg">
                            "{currentSentence}"
                        </p>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-4">
                    <Button 
                        size="lg" 
                        onClick={handleStartListening} 
                        disabled={!SpeechRecognition || isListening || isLoading}
                        className="rounded-full w-24 h-24"
                        aria-label={isListening ? "Stop listening" : "Start listening"}
                    >
                        {isListening ? (
                            <MicOff className="h-10 w-10" />
                        ) : (
                            <Mic className="h-10 w-10" />
                        )}
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={selectNewSentence}
                        disabled={isListening || isLoading}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Next Sentence
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center -mt-4">
                    {isListening ? "Listening..." : (feedback || isLoading ? "" : "Tap the mic to start reading")}
                </p>
                
                {isLoading && (
                     <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-md">Analyzing your reading...</p>
                    </div>
                )}


                {feedback && !isLoading && (
                    <Alert>
                        <Star className="h-4 w-4" />
                        <AlertTitle>Feedback from your coach</AlertTitle>
                        <AlertDescription>
                            {userTranscript && (
                                <p className="mb-2 text-muted-foreground italic">You said: "{userTranscript}"</p>
                            )}
                           <p className="font-semibold">{feedback}</p>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

        </div>
    )
}
