
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, PenSquare, Ear, Puzzle, Users, Rocket, BrainCircuit, HeartPulse } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Adaptive Text Reader',
    description: 'Tackle any textbook or article. Simplify tricky language, get summaries, and listen along.',
    href: '/reader',
  },
  {
    icon: PenSquare,
    title: 'AI Writing Assistant',
    description: 'Nail your next essay. Get real-time help with spelling, grammar, and rephrasing sentences.',
    href: '/writing-assistant',
  },
  {
    icon: Ear,
    title: 'Reading Practice',
    description: 'Practice reading out loud with a friendly AI coach who cheers you on.',
    href: '/reading-practice',
  },
  {
    icon: Puzzle,
    title: 'Interactive Games',
    description: 'Play fun word puzzles that sharpen your skills without feeling like homework.',
    href: '/word-games',
  },
  {
    icon: BrainCircuit,
    title: 'Quiz Forge',
    description: 'Generate quizzes from your notes to test your knowledge and prepare for exams.',
    href: '/quiz',
  },
  {
    icon: HeartPulse,
    title: 'Mental Health Check-in',
    description: 'Take a moment to check in with your feelings and practice mindfulness.',
    href: '/check-in',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Connect with other students and mentors who get it. You\'re not in this alone.',
    href: '/community',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold font-headline tracking-tighter text-primary">DyslexiaPilot AI</h1>
        <p className="text-muted-foreground mt-4 text-xl max-w-2xl mx-auto">
          The AI-Powered Dyslexia Companion for Students
        </p>
      </header>

      <section className="mb-16">
        <Card className="max-w-3xl mx-auto shadow-xl bg-muted/20">
          <CardHeader className="text-center">
            <Rocket className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-headline">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg text-foreground/80">
              Our mission is to make learning accessible for every student. DyslexiaPilot AI was created to ensure that dyslexia is never a barrier to understanding, expression, or academic success. The platform adapts to each student’s unique learning needs—simplifying reading, guiding writing, supporting study routines, and reducing stress—so students can learn with clarity, confidence, and independence.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8 font-headline">What Can You Do?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, 6).map((feature, index) => (
             <Link href={feature.href} key={index} className="flex">
             <Card className="flex flex-col text-center items-center p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 w-full">
                 <feature.icon className="h-10 w-10 text-accent mb-4" />
                 <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                 <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
             </Card>
           </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
