
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const wordList = [
    { correct: "separate", incorrect: ["seperate", "seperete"] },
    { correct: "definitely", incorrect: ["definately", "definitly"] },
    { correct: "accommodate", incorrect: ["accomodate", "acommodate"] },
    { correct: "receive", incorrect: ["recieve", "receeve"] },
    { correct: "conscience", incorrect: ["conscence", "consience"] },
    { correct: "weird", incorrect: ["wierd", "weerd"] },
    { correct: "privilege", incorrect: ["priviledge", "privilige"] },
    { correct: "occurrence", incorrect: ["occurrance", "occurence"] },
    { correct: "liaison", incorrect: ["liason", "laison"] },
    { correct: "millennium", incorrect: ["millenium", "milennium"] },
];

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export function SpellCheck() {
    const [currentWord, setCurrentWord] = useState(wordList[0]);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const setupNewWord = () => {
        const newWord = wordList[Math.floor(Math.random() * wordList.length)];
        setCurrentWord(newWord);
        
        // Create 3 options: the correct one and two incorrect ones
        const currentOptions = [newWord.correct, ...newWord.incorrect.slice(0, 2)];
        setOptions(shuffleArray(currentOptions));

        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    useEffect(() => {
        setupNewWord();
    }, []);

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer

        setSelectedAnswer(answer);
        if (answer === currentWord.correct) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };
    
    const getButtonState = (option: string) => {
        if (selectedAnswer === null) return "secondary";
        if (option === currentWord.correct) return "success";
        if (option === selectedAnswer && option !== currentWord.correct) return "destructive";
        return "secondary";
    }

    return (
        <div className="max-w-2xl mx-auto grid gap-6 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Spell Check</CardTitle>
                    <CardDescription>Choose the word that is spelled correctly.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="w-full flex flex-col gap-3">
                        {options.map((option, index) => (
                             <Button
                                key={index}
                                onClick={() => handleAnswerClick(option)}
                                disabled={selectedAnswer !== null}
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
                                {isCorrect ? "Excellent spelling!" : `The correct spelling is "${currentWord.correct}".`}
                            </AlertDescription>
                        </Alert>
                    )}

                </CardContent>
            </Card>
             <div className="flex items-center justify-center gap-4">
                <Button onClick={setupNewWord}>
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
