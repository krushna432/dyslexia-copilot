"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordScramble } from "@/components/games/word-scramble";
import { SoundMatch } from "@/components/games/sound-match";
import { RhymeTime } from "@/components/games/rhyme-time";
import { SpellCheck } from "@/components/games/spell-check";
import { LetterHunt } from "@/components/games/letter-hunt";

import { Volume2, Sparkles, SpellCheck as SpellCheckIcon, Search, Puzzle } from 'lucide-react';


const games = [
  { name: "Word Scramble", component: <WordScramble />, icon: Puzzle },
  { name: "Sound Match", component: <SoundMatch />, icon: Volume2 },
  { name: "Rhyme Time", component: <RhymeTime />, icon: Sparkles },
  { name: "Spell Check", component: <SpellCheck />, icon: SpellCheckIcon },
  { name: "Letter Hunt", component: <LetterHunt />, icon: Search },
];

export default function WordGamesPage() {
  const [activeGame, setActiveGame] = useState(games[0].name);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Interactive Games</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Sharpen your skills with these fun and engaging exercises.
        </p>
      </header>
      <Tabs defaultValue={activeGame} onValueChange={setActiveGame} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            {games.map((game) => (
                <TabsTrigger key={game.name} value={game.name} className="flex flex-col md:flex-row gap-2 h-full py-2">
                    <game.icon className="h-5 w-5"/>
                    {game.name}
                </TabsTrigger>
            ))}
        </TabsList>

        {games.map((game) => (
            <TabsContent key={game.name} value={game.name}>
                {game.component}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
