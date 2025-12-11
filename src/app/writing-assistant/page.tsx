import { WritingEditor } from "@/components/writing/writing-editor";

export default function WritingAssistantPage() {
  return (
    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">AI Writing Assistant</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Get real-time help with spelling, grammar, and clarity as you write.
        </p>
      </header>
      <WritingEditor />
    </div>
  );
}
