
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const mentors = [
  {
    id: 'mentor1',
    name: 'Alex Johnson',
    title: 'Dyslexia Advocate & Reading Coach',
    bio: 'With over 10 years of experience, Alex specializes in helping young adults build confidence and improve reading skills.',
  },
  {
    id: 'mentor2',
    name: 'Samantha Lee',
    title: 'Educational Psychologist',
    bio: 'Samantha focuses on cognitive strategies and assistive technology to support learners with dyslexia.',
  },
  {
    id: 'mentor3',
    name: 'Michael Chen',
    title: 'Peer Mentor & University Student',
    bio: 'As a student with dyslexia, Michael shares his personal journey and practical tips for navigating academics.',
  },
  {
    id: 'mentor4',
    name: 'Dr. Emily Carter',
    title: 'Neurodiversity Researcher',
    bio: 'Dr. Carter provides insights into the latest research and evidence-based practices for dyslexia support.',
  },
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Community Connection</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Connect with peers and mentors who understand. You're not alone.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mentors.map((mentor) => {
          const placeholder = PlaceHolderImages.find((p) => p.id === mentor.id);
          return (
            <Card key={mentor.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center text-center p-6 bg-muted/30">
                {placeholder && (
                  <Image
                    src={placeholder.imageUrl}
                    alt={`Portrait of ${mentor.name}`}
                    data-ai-hint={placeholder.imageHint}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-background shadow-md"
                  />
                )}
                <div className="mt-4">
                  <CardTitle className="text-xl">{mentor.name}</CardTitle>
                  <CardDescription className="text-primary">{mentor.title}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p className="text-muted-foreground text-sm flex-1">{mentor.bio}</p>
                <Button className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" /> Connect
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
