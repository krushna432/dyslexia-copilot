"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type SpeechState = "idle" | "playing" | "paused" | "ended";

export const useSpeech = (onBoundary: (charIndex: number) => void) => {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSupported(false);
    }

    const handleBeforeUnload = () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const speak = useCallback((text: string, rate: number) => {
      if (!isSupported || !text) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      
      utterance.onstart = () => setSpeechState("playing");
      utterance.onpause = () => setSpeechState("paused");
      utterance.onresume = () => setSpeechState("playing");
      utterance.onend = () => setSpeechState("ended");
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          onBoundary(event.charIndex);
        }
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, onBoundary]
  );

  const pause = useCallback(() => {
    if (speechState === "playing") {
      window.speechSynthesis.pause();
    }
  }, [speechState]);

  const resume = useCallback(() => {
    if (speechState === "paused") {
      window.speechSynthesis.resume();
    }
  }, [speechState]);

  const cancel = useCallback(() => {
    if (speechState !== "idle") {
      window.speechSynthesis.cancel();
      setSpeechState("idle");
    }
  }, [speechState]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.speechSynthesis && !window.speechSynthesis.speaking && speechState === 'playing') {
        setSpeechState('ended');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [speechState]);


  return { speechState, speak, pause, resume, cancel, isSupported };
};
