
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { narrate } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const wordSets = [
    ["their", "there", "they're"],
    ["your", "you're"],
    ["its", "it's"],
    ["to", "too", "two"],
    ["weather", "whether"],
    ["principal", "principle"],
    ["bare", "bear"],
    ["wear", "where"],
    ["passed", "past"],
    ["affect", "effect"],
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function SoundMatch() {
    const [correctWord, setCorrectWord] = useState<string>('');
    const [options, setOptions] = useState<string[]>([]);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const { toast } = useToast();

    const setupNewWord = useCallback(async () => {
        setIsLoading(true);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setAudioDataUri(null);

        try {
            const wordSet = wordSets[Math.floor(Math.random() * wordSets.length)];
            const newCorrectWord = wordSet[Math.floor(Math.random() * wordSet.length)];
            const otherOptions = wordSet.filter(w => w !== newCorrectWord);
            
            // Create 3 or 4 options total
            const numOptions = Math.min(wordSet.length, 4);
            const currentOptions = [newCorrectWord, ...shuffleArray(otherOptions).slice(0, numOptions - 1)];

            setCorrectWord(newCorrectWord);
            setOptions(shuffleArray(currentOptions));

            const result = await narrate(newCorrectWord);
            if (result.error) throw new Error(result.error);
            setAudioDataUri(result.audioDataUri!);

        } catch (error) {
            toast({ title: "Failed to set up new word", description: (error as Error).message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        setupNewWord();
    }, [setupNewWord]);

    const playSound = () => {
        if (audioDataUri) {
            const audio = new Audio(audioDataUri);
            audio.play();
        }
    };
    
    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer) return; 

        setSelectedAnswer(answer);
        setIsCorrect(answer === correctWord);
    };

    const getButtonState = (option: string) => {
        if (selectedAnswer === null) return "secondary";
        if (option === correctWord) return "success";
        if (option === selectedAnswer && option !== correctWord) return "destructive";
        return "secondary";
    }

    return (
        <div className="max-w-2xl mx-auto grid gap-6 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Sound Match</CardTitle>
                    <CardDescription>Listen to the word, then choose the correct spelling.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    <Button 
                        onClick={playSound} 
                        disabled={isLoading || !audioDataUri} 
                        size="lg"
                        className="flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Volume2 className="h-6 w-6" />}
                        {isLoading ? "Generating Sound..." : "Play Sound"}
                    </Button>

                    <div className="w-full grid grid-cols-2 gap-3">
                        {options.map((option, index) => (
                             <Button
                                key={index}
                                onClick={() => handleAnswerClick(option)}
                                disabled={selectedAnswer !== null || isLoading}
                                className={cn(
                                    "w-full h-14 text-xl justify-center transition-all duration-300",
                                    selectedAnswer === null && "hover:bg-primary/10",
                                    getButtonState(option) === 'success' && 'bg-green-500 hover:bg-green-500 text-white',
                                    getButtonState(option) === 'destructive' && 'bg-red-500 hover:bg-red-500 text-white animate-in shake',
                                    getButtonState(option) === 'secondary' && 'bg-secondary text-secondary-foreground'
                                )}
                                style={{animation: getButtonState(option) === 'destructive' ? 'shake 0.5s' : 'none'}}
                             >
                                 {option}
                             </Button>
                        ))}
                    </div>

                     {isCorrect !== null && (
                         <Alert className={cn(isCorrect ? "bg-green-100 dark:bg-green-900/30 border-green-400" : "bg-red-100 dark:bg-red-900/30 border-red-400")}>
                            <AlertTitle>{isCorrect ? "Correct!" : "Not Quite!"}</AlertTitle>
                            <AlertDescription>
                                {isCorrect ? "That's the right one!" : `The correct spelling is "${correctWord}".`}
                            </AlertDescription>
                        </Alert>
                    )}

                </CardContent>
            </Card>
             <div className="flex items-center justify-center gap-4">
                <Button onClick={setupNewWord} disabled={isLoading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Word
                </Button>
            </div>
             <style jsx>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>
        </div>
    )
}
