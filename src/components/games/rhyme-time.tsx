"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const wordPairs = [
    ["cat", "hat"], ["dog", "log"], ["pen", "hen"],
    ["sun", "fun"], ["bee", "tree"], ["car", "star"],
    ["boat", "coat"], ["moon", "spoon"], ["book", "look"],
    ["mouse", "house"], ["blue", "shoe"], ["rain", "train"],
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const PAIRS_PER_GAME = 4;

export function RhymeTime() {
    const [gridWords, setGridWords] = useState<string[]>([]);
    const [originalPairs, setOriginalPairs] = useState<string[][]>([]);
    const [selection, setSelection] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<string[][]>([]);
    const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const setupNewGame = () => {
        const shuffledPairs = shuffleArray([...wordPairs]);
        const gamePairs = shuffledPairs.slice(0, PAIRS_PER_GAME);
        
        setOriginalPairs(gamePairs);
        setGridWords(shuffleArray(gamePairs.flat()));
        setSelection([]);
        setMatchedPairs([]);
        setIsIncorrect(false);
        setIsFinished(false);
    };

    useEffect(() => {
        setupNewGame();
    }, []);

    const isWordInMatchedPair = (word: string) => {
        return matchedPairs.some(pair => pair.includes(word));
    }

    const handleWordClick = (word: string) => {
        if (isIncorrect || selection.length === 2 || isWordInMatchedPair(word) || selection.includes(word)) {
            return;
        }

        const newSelection = [...selection, word];
        setSelection(newSelection);

        if (newSelection.length === 2) {
            const [first, second] = newSelection;
            const isMatch = originalPairs.some(pair =>
                (pair[0] === first && pair[1] === second) || (pair[0] === second && pair[1] === first)
            );

            if (isMatch) {
                const newMatched = [...matchedPairs, newSelection];
                setMatchedPairs(newMatched);
                setSelection([]);
                if (newMatched.length === PAIRS_PER_GAME) {
                    setIsFinished(true);
                }
            } else {
                setIsIncorrect(true);
                setTimeout(() => {
                    setSelection([]);
                    setIsIncorrect(false);
                }, 800);
            }
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto grid gap-6 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Rhyme Time</CardTitle>
                    <CardDescription>Find and click the pairs of words that rhyme.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {gridWords.map((word, index) => {
                             const isSelected = selection.includes(word);
                             const isMatched = isWordInMatchedPair(word);
                             const isWrongAttempt = isIncorrect && isSelected;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleWordClick(word)}
                                    disabled={isMatched}
                                    className={cn(
                                        "flex items-center justify-center h-20 w-24 md:h-24 md:w-28 text-xl font-semibold rounded-lg border-2 transition-all duration-300",
                                        isMatched && "bg-green-500 border-green-600 text-white cursor-not-allowed",
                                        !isMatched && "bg-secondary text-secondary-foreground hover:bg-primary/20",
                                        isSelected && !isMatched && "bg-accent/50 border-accent",
                                        isWrongAttempt && "bg-red-500/80 border-red-600 text-white animate-in shake"
                                    )}
                                     style={{animation: isWrongAttempt ? 'shake 0.5s' : 'none'}}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                    {isFinished && (
                        <Alert className="bg-green-100 dark:bg-green-900/30 border-green-400">
                            <AlertTitle>You found all the rhymes!</AlertTitle>
                            <AlertDescription>
                                Great job matching the words.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
             <div className="flex items-center justify-center gap-4">
                <Button onClick={setupNewGame}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Game
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
    );
}
