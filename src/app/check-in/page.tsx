'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wind, HeartPulse, Lightbulb } from 'lucide-react';
import { getJournalAnalysis, getSuggestionForMood } from '../actions';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🙂', label: 'Okay' },
  { emoji: '😐', label: 'Meh' },
  { emoji: '😕', label: 'Stressed' },
  { emoji: '😥', label: 'Sad' },
];

export default function CheckInPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  const [journalFeedback, setJournalFeedback] = useState<{ feedback: string; sentiment: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [copingSuggestion, setCopingSuggestion] = useState<string | null>(null);
  const [isGettingSuggestion, setIsGettingSuggestion] = useState(false);

  const { toast } = useToast();

  const handleGetFeedback = async () => {
    if (!journalText) {
      toast({ title: 'Please write something in your journal first.', variant: 'destructive' });
      return;
    }
    setIsAnalyzing(true);
    setJournalFeedback(null);
    try {
      const result = await getJournalAnalysis(journalText);
      if (result.error) throw new Error(result.error);
      setJournalFeedback(result as any);
    } catch (error) {
      toast({ title: 'Error analyzing journal', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMoodSelect = async (moodLabel: string) => {
    setSelectedMood(moodLabel);
    setCopingSuggestion(null);
    setIsGettingSuggestion(true);
    try {
      const result = await getSuggestionForMood(moodLabel);
      if (result.error) throw new Error(result.error);
      setCopingSuggestion(result.suggestion!);
    } catch (error) {
       toast({ title: 'Error getting suggestion', description: (error as Error).message, variant: 'destructive' });
    } finally {
        setIsGettingSuggestion(false);
    }
  }

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setTimeout(() => setIsBreathing(false), 24000); // 3 cycles of 8 seconds
  };
  
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-400 bg-green-100 dark:bg-green-900/30';
      case 'neutral': return 'border-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'negative': return 'border-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'border-border';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Mental Health Check-in</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Take a moment to connect with yourself.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>How are you feeling right now?</CardTitle>
              <CardDescription>Select a mood to log how you feel and get a suggestion.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                {moods.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood.label)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-2 rounded-lg transition-transform hover:scale-110',
                      selectedMood === mood.label && 'bg-primary/20 scale-110'
                    )}
                  >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
              {isGettingSuggestion && (
                  <div className="flex items-center justify-center pt-4">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      <p>Getting a suggestion...</p>
                  </div>
              )}
              {copingSuggestion && (
                <Alert className="mt-4 bg-blue-100 dark:bg-blue-900/30 border-blue-400">
                    <Lightbulb className="h-4 w-4"/>
                    <AlertTitle>A quick thought from your co-pilot</AlertTitle>
                    <AlertDescription>{copingSuggestion}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Guided Breathing</CardTitle>
              <CardDescription>Follow the animation to calm your mind.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 text-center">
              <div
                className={cn(
                  'w-40 h-40 bg-primary/20 rounded-full flex items-center justify-center transition-all duration-3000 ease-in-out',
                  isBreathing ? 'animate-breathing-scale' : ''
                )}
                style={{
                  animation: isBreathing ? 'breathing 8s ease-in-out infinite' : 'none'
                }}
              >
                <div className={cn('text-lg font-semibold', isBreathing ? 'animate-breathing-text' : '')}>
                    {isBreathing ? (
                        <p className="breathing-text">Breathe</p>
                    ) : (
                        'Ready?'
                    )}
                </div>
              </div>
              <Button onClick={startBreathingExercise} disabled={isBreathing}>
                <Wind className="mr-2 h-4 w-4" /> Start 30-Second Exercise
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle>Private Journal</CardTitle>
              <CardDescription>Write down your thoughts. They are not saved.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="What's on your mind?..."
                className="flex-1 resize-none text-base"
              />
              <Button onClick={handleGetFeedback} disabled={isAnalyzing || !journalText}>
                {isAnalyzing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get AI Reflection
              </Button>
              {journalFeedback && (
                <Alert className={cn('mt-4', getSentimentColor(journalFeedback.sentiment))}>
                  <HeartPulse className="h-4 w-4" />
                  <AlertTitle>AI Reflection</AlertTitle>
                  <AlertDescription>{journalFeedback.feedback}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-breathing-scale {
            animation: breathing 8s ease-in-out infinite;
        }
        .breathing-text-container {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .breathing-text {
            animation: breathing-text-anim 8s ease-in-out infinite;
            text-align: center;
        }
        @keyframes breathing-text-anim {
          0%, 100% { content: 'Breathe Out'; opacity: 1; }
          45% { opacity: 1; }
          50% { content: 'Breathe In'; opacity: 1; }
          95% { opacity: 1; }
        }
        /* This is a trick to make the content change */
        .breathing-text:before {
            content: 'Breathe In';
            animation: text-switch-in 8s ease-in-out infinite;
        }
        .breathing-text:after {
            content: 'Hold';
            animation: text-switch-hold 8s ease-in-out infinite;
        }
        @keyframes text-switch-in {
            0%, 45% { content: 'Breathe In'; opacity: 1; }
            45.1%, 100% { opacity: 0; }
        }
        @keyframes text-switch-hold {
           0%, 45% { opacity: 0; }
           45.1%, 50% { content: 'Hold'; opacity: 1; }
           50.1%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
