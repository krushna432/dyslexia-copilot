"use client";

import { useSettings } from "@/hooks/use-settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Personalize Your Experience</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Adjust the settings to make reading as comfortable as possible for you.
        </p>
      </header>

      <div className="grid gap-6 max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Tabs
                value={settings.theme}
                onValueChange={(value) => setSettings({ theme: value as any })}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="light">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </TabsTrigger>
                  <TabsTrigger value="dark">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </TabsTrigger>
                  <TabsTrigger value="system">
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="font-size">Font Size</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground">
                  {settings.fontSize}px
                </span>
              </div>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[settings.fontSize]}
                onValueChange={(value) => setSettings({ fontSize: value[0] })}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Font size"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="line-height">Line Height</Label>
                <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground">
                  {settings.lineHeight.toFixed(2)}
                </span>
              </div>
              <Slider
                id="line-height"
                min={1.2}
                max={2.0}
                step={0.1}
                value={[settings.lineHeight]}
                onValueChange={(value) => setSettings({ lineHeight: value[0] })}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Line height"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
