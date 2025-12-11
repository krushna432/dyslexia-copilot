"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateQuestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BrainCircuit, Lightbulb } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Question = {
  question: string;
  options?: string[];
  answerIndex?: number;
};

type QuizState = 'idle' | 'generating' | 'taking' | 'finished';

export default function QuizPage() {
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerateQuiz = async () => {
    if (!text) {
      toast({ title: 'Please enter some text', variant: 'destructive' });
      return;
    }
    setQuizState('generating');
    setQuestions([]);
    setUserAnswers([]);
    setScore(null);
    try {
      const result = await generateQuestions(text, 5, 'multiple-choice');
      if (result.error) throw new Error(result.error);
      setQuestions(result.questions!);
      setUserAnswers(new Array(result.questions!.length).fill(null));
      setQuizState('taking');
    } catch (error) {
      toast({ title: 'Failed to generate quiz', description: (error as Error).message, variant: 'destructive' });
      setQuizState('idle');
    }
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };
  
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((q, i) => {
        if(q.answerIndex === userAnswers[i]) {
            correctAnswers++;
        }
    });
    setScore(correctAnswers);
    setQuizState('finished');
    toast({ title: 'Quiz Submitted!', description: `You scored ${correctAnswers} out of ${questions.length}`});
  };

  const handleRestart = () => {
    setQuizState('idle');
    setQuestions([]);
    setUserAnswers([]);
    setScore(null);
    // setText('');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Quiz Forge</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Turn your notes, articles, or any text into a practice quiz instantly.
        </p>
      </header>

      <div className="grid gap-8">
        {quizState === 'idle' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>1. Paste Your Text</CardTitle>
              <CardDescription>Enter the content you want to be quizzed on.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your notes, an article, or any text here..."
                className="h-64 text-base"
              />
              <Button onClick={handleGenerateQuiz} disabled={!text}>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {quizState === 'generating' && (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-xl">Forging your quiz...</p>
          </div>
        )}

        {(quizState === 'taking' || quizState === 'finished') && (
          <div>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>2. Test Your Knowledge</CardTitle>
                    <CardDescription>Answer the questions below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {questions.map((q, qIndex) => (
                    <div key={qIndex} className={cn(
                        "p-4 rounded-lg border",
                        quizState === 'finished' && (userAnswers[qIndex] === q.answerIndex ? 'bg-green-100 dark:bg-green-900/30 border-green-400' : 'bg-red-100 dark:bg-red-900/30 border-red-400')
                    )}>
                        <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                        <RadioGroup 
                            onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}
                            disabled={quizState === 'finished'}
                            value={userAnswers[qIndex]?.toString()}
                        >
                        {q.options?.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                                <Label htmlFor={`q${qIndex}o${oIndex}`}>{option}</Label>
                            </div>
                        ))}
                        </RadioGroup>
                        {quizState === 'finished' && userAnswers[qIndex] !== q.answerIndex && (
                           <p className="text-sm mt-2 text-green-700 dark:text-green-300 font-semibold">Correct answer: {q.options![q.answerIndex!]}</p>
                        )}
                    </div>
                    ))}
                </CardContent>
            </Card>
             <div className="mt-6 flex justify-center gap-4">
                {quizState === 'taking' && (
                    <Button onClick={handleSubmitQuiz} disabled={userAnswers.some(a => a === null)}>
                        Submit Quiz
                    </Button>
                )}
                 {quizState === 'finished' && (
                    <div className='flex flex-col items-center gap-4'>
                        <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>Quiz Complete!</AlertTitle>
                            <AlertDescription>
                                You scored {score} out of {questions.length}.
                            </AlertDescription>
                        </Alert>
                        <Button onClick={handleRestart} variant="outline">
                            Create a New Quiz
                        </Button>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
