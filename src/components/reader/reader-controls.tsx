"use client";

import { Play, Pause, Square, Rabbit, Turtle, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ReaderControlsProps = {
  speechState: "idle" | "playing" | "paused" | "ended";
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  readingSpeed: number;
  onReadingSpeedChange: (speed: number) => void;
  onNarrate: () => void;
  isNarrating: boolean;
};

export function ReaderControls({
  speechState,
  onPlay,
  onPause,
  onStop,
  readingSpeed,
  onReadingSpeedChange,
  onNarrate,
  isNarrating,
}: ReaderControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={speechState === "playing" ? onPause : onPlay}
              aria-label={speechState === "playing" ? "Pause" : "Play"}
              disabled={isNarrating}
            >
              {speechState === "playing" ? <Pause /> : <Play />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{speechState === "playing" ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={onStop}
              disabled={speechState === "idle" || isNarrating}
              aria-label="Stop"
            >
              <Square />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Stop</p>
          </TooltipContent>
        </Tooltip>
         <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={onNarrate}
              disabled={isNarrating || speechState !== 'idle'}
              aria-label="Narrate"
            >
              {isNarrating ? <Loader2 className="animate-spin" /> : <Volume2 />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate Audio (AI)</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xs md:max-w-[150px]">
        <Turtle className="text-muted-foreground" />
        <Slider
          min={0.5}
          max={2}
          step={0.1}
          value={[readingSpeed]}
          onValueChange={(value) => onReadingSpeedChange(value[0])}
          aria-label="Reading speed"
          disabled={isNarrating}
        />
        <Rabbit className="text-muted-foreground" />
      </div>
    </div>
  );
}
