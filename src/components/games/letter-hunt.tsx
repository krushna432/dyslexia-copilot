
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";


const letterPairs = [
    ['b', 'd'],
    ['p', 'q'],
    ['i', 'l'],
    ['m', 'n'],
    ['u', 'v'],
];

const GRID_SIZE = 25;

const generateGrid = (target: string, distractor: string) => {
    const grid = new Array(GRID_SIZE).fill('');
    const targetCount = Math.floor(Math.random() * 5) + 5; // 5 to 9 targets
    
    let currentTargetCount = 0;
    while(currentTargetCount < targetCount) {
        const randomIndex = Math.floor(Math.random() * GRID_SIZE);
        if (grid[randomIndex] === '') {
            grid[randomIndex] = target;
            currentTargetCount++;
        }
    }

    return grid.map(cell => cell === '' ? distractor : target);
}


export function LetterHunt() {
    const [targetLetter, setTargetLetter] = useState('b');
    const [distractorLetter, setDistractorLetter] = useState('d');
    const [grid, setGrid] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    const totalTargets = useMemo(() => grid.filter(letter => letter === targetLetter).length, [grid, targetLetter]);
    const correctSelections = useMemo(() => selectedIndices.filter(i => grid[i] === targetLetter).length, [selectedIndices, grid, targetLetter]);

    const setupNewGame = () => {
        const [newTarget, newDistractor] = letterPairs[Math.floor(Math.random() * letterPairs.length)];
        // Randomly swap target and distractor
        if (Math.random() > 0.5) {
            setTargetLetter(newDistractor);
            setDistractorLetter(newTarget);
            setGrid(generateGrid(newDistractor, newTarget));
        } else {
            setTargetLetter(newTarget);
            setDistractorLetter(newDistractor);
            setGrid(generateGrid(newTarget, newDistractor));
        }
        setSelectedIndices([]);
        setIsFinished(false);
    };

    useEffect(() => {
        setupNewGame();
    }, []);

    useEffect(() => {
        if (totalTargets > 0 && correctSelections === totalTargets) {
            setIsFinished(true);
        }
    }, [correctSelections, totalTargets]);


    const handleLetterClick = (index: number) => {
        if (isFinished || selectedIndices.includes(index)) return;
        setSelectedIndices([...selectedIndices, index]);
    };

    const getLetterState = (index: number): 'correct' | 'incorrect' | 'neutral' => {
        if (!selectedIndices.includes(index)) return 'neutral';
        return grid[index] === targetLetter ? 'correct' : 'incorrect';
    }


    return (
        <div className="max-w-2xl mx-auto grid gap-6 mt-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Letter Hunt</CardTitle>
                    <CardDescription>Click on all the letters that match the target letter.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                    <div className="text-center">
                        <p className="text-lg">Find all the letters:</p>
                        <p className="text-6xl font-bold text-primary">{targetLetter}</p>
                    </div>

                    <div className="grid grid-cols-5 gap-2 md:gap-4 p-4 bg-muted/40 rounded-lg">
                        {grid.map((letter, index) => (
                            <button
                                key={index}
                                onClick={() => handleLetterClick(index)}
                                disabled={isFinished}
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-3xl font-bold rounded-md transition-colors",
                                    "bg-background hover:bg-accent/50",
                                    getLetterState(index) === 'correct' && 'bg-green-500 text-white',
                                    getLetterState(index) === 'incorrect' && 'bg-red-500 text-white animate-in shake'
                                )}
                                style={{animation: getLetterState(index) === 'incorrect' ? 'shake 0.5s' : 'none'}}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                     <div className="w-full space-y-2">
                        <p className="text-sm text-center font-medium">Progress: {correctSelections} / {totalTargets}</p>
                        <Progress value={(correctSelections / totalTargets) * 100} />
                    </div>

                    {isFinished && (
                        <Alert className="bg-green-100 dark:bg-green-900/30 border-green-400">
                            <AlertTitle>Level Complete!</AlertTitle>
                            <AlertDescription>
                                Great job! You found all the letters.
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
    )
}
