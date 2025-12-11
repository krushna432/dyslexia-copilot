"use client";

import React, { useMemo } from 'react';
import { useSettings } from '@/hooks/use-settings';

type HighlightedTextProps = {
  text: string;
  activeCharIndex: number;
  speechState: string;
};

export const HighlightedText = ({ text, activeCharIndex, speechState }: HighlightedTextProps) => {
  const { settings } = useSettings();

  const words = useMemo(() => {
    const wordRegex = /[\w']+|[^\s\w']/g;
    const matches = text.match(wordRegex);
    if (!matches) return [];

    let charCount = 0;
    return matches.map((word) => {
      const start = charCount;
      charCount += word.length;
      return { word, start, end: charCount };
    });
  }, [text]);

  const showHighlight = speechState === 'playing';

  return (
    <p
      className="text-foreground transition-colors duration-200"
      style={{
        fontSize: `var(--font-size-base)`,
        lineHeight: `var(--line-height-base)`,
      }}
    >
      {words.map((wordInfo, index) => {
        const isActive = showHighlight && activeCharIndex >= wordInfo.start && activeCharIndex < wordInfo.end;
        return (
          <span
            key={index}
            className={isActive ? "bg-accent rounded-sm" : "bg-transparent"}
            style={{ transition: 'background-color 0.1s ease-in-out' }}
          >
            {wordInfo.word}
          </span>
        );
      })}
    </p>
  );
};
