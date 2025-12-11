"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const words = [
  "apple", "banana", "circle", "window", "journey", "puzzle", "world", "friend", "happy", "school"
];

function scrambleWord(word: string): string {
  let scrambled = word.split('');
  do {
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
  } while (scrambled.join('') === word);
  return scrambled.join('');
}

export function WordScramble() {
  const [originalWord, setOriginalWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const selectNewWord = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setOriginalWord(newWord);
    setScrambledLetters(scrambleWord(newWord).split(''));
    setUserAnswer([]);
    setIsCorrect(null);
    setShowHint(false);
  };

  useEffect(() => {
    selectNewWord();
  }, []);

  const handleLetterClick = (letter: string, index: number, source: 'scrambled' | 'answer') => {
    if (source === 'scrambled') {
      setUserAnswer([...userAnswer, letter]);
      const newScrambled = [...scrambledLetters];
      newScrambled.splice(index, 1);
      setScrambledLetters(newScrambled);
    } else {
      setScrambledLetters([...scrambledLetters, letter]);
      const newAnswer = [...userAnswer];
      newAnswer.splice(index, 1);
      setUserAnswer(newAnswer);
    }
    setIsCorrect(null);
  };

  useEffect(() => {
    if (originalWord && userAnswer.length === originalWord.length) {
      if (userAnswer.join('') === originalWord) {
        setIsCorrect(true);
        toast({ title: "Correct!", description: "Great job unscrambling the word." });
      } else {
        setIsCorrect(false);
      }
    }
  }, [userAnswer, originalWord, toast]);

  return (
      <div className="max-w-2xl mx-auto grid gap-6 mt-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Unscramble the Word</CardTitle>
            <CardDescription>Click the letters to form the correct word.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
            {/* Answer Area */}
            <div className="flex justify-center items-center gap-2 w-full min-h-[56px] bg-muted/40 rounded-lg p-4 border-2 border-dashed">
              {originalWord.split('').map((_, index) => (
                <div
                  key={index}
                  className={cn("flex items-center justify-center w-12 h-12 text-2xl font-bold uppercase rounded-md cursor-pointer",
                    userAnswer[index] ? 'bg-primary text-primary-foreground' : 'bg-background'
                  )}
                  onClick={() => userAnswer[index] && handleLetterClick(userAnswer[index], index, 'answer')}
                >
                  {userAnswer[index]}
                </div>
              ))}
            </div>

            {/* Scrambled Letters */}
            <div className="flex justify-center flex-wrap gap-2">
              {scrambledLetters.map((letter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-12 h-12 text-2xl font-bold uppercase"
                  onClick={() => handleLetterClick(letter, index, 'scrambled')}
                >
                  {letter}
                </Button>
              ))}
            </div>
            
            {isCorrect !== null && (
                <Alert variant={isCorrect ? 'default' : 'destructive'} className="bg-opacity-20">
                    <AlertTitle>{isCorrect ? "Awesome!" : "Not Quite..."}</AlertTitle>
                    <AlertDescription>
                        {isCorrect ? `You correctly unscrambled the word "${originalWord}".` : "Try that again, you're close!"}
                    </AlertDescription>
                </Alert>
            )}

            {showHint && !isCorrect && (
                <Alert variant="default" className="bg-yellow-100 dark:bg-yellow-900 border-yellow-400">
                    <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                    <AlertTitle>Hint</AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-200">
                        The word starts with the letter '{originalWord[0]}'.
                    </AlertDescription>
                </Alert>
            )}

          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Button 
            onClick={selectNewWord}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            New Word
          </Button>
           <Button 
            variant="ghost" 
            onClick={() => setShowHint(true)}
            disabled={showHint || isCorrect === true}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Hint
          </Button>
        </div>
      </div>
  );
}