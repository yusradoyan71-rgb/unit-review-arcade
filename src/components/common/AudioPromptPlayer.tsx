/**
 * UNIT REVIEW ARCADE — AUDIO PROMPT PLAYER COMPONENT (PHASE 4)
 * Version: 4.0.0
 * 
 * Secure audio player for listening and dictation activities.
 * 
 * Safeguards:
 * 1. Primary: Tries hosted audio URL.
 * 2. Fallback: Browser Web Speech API (speechSynthesis) with en-US natural rate.
 * 3. Never displays spoken transcript before student submits answer (isAnswered).
 * 4. Disables activity and warns if audio playback is entirely unavailable.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export interface AudioPromptPlayerProps {
  audioUrl?: string;
  speechText?: string;
  correctTranscript?: string;
  isAnswered?: boolean;
  onPlaybackAvailabilityChange?: (isAvailable: boolean) => void;
  className?: string;
}

export const AudioPromptPlayer: React.FC<AudioPromptPlayerProps> = ({
  audioUrl,
  speechText,
  correctTranscript,
  isAnswered = false,
  onPlaybackAvailabilityChange,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [activeEngine, setActiveEngine] = useState<'audio' | 'tts' | 'none'>('audio');
  const [showTranscriptAfterSubmit, setShowTranscriptAfterSubmit] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check audio availability on mount
  useEffect(() => {
    const hasAudioApi = typeof Audio !== 'undefined';
    const hasTtsApi = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const available = hasAudioApi || hasTtsApi;

    setIsSupported(available);
    if (onPlaybackAvailabilityChange) {
      onPlaybackAvailabilityChange(available);
    }
  }, [onPlaybackAvailabilityChange]);

  // Clean up on unmount or question change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, speechText]);

  // Fallback TTS playback
  const playTTS = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      setIsSupported(false);
      if (onPlaybackAvailabilityChange) onPlaybackAvailabilityChange(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const textToSpeak = speechText || correctTranscript || '';
      if (!textToSpeak) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Clear, pedagogical speaking pace

      utterance.onstart = () => {
        setIsPlaying(true);
        setActiveEngine('tts');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setPlayCount((prev) => prev + 1);
      };

      utterance.onerror = (e) => {
        console.warn('[AudioPromptPlayer] SpeechSynthesis error:', e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[AudioPromptPlayer] TTS invocation failed:', err);
      setIsPlaying(false);
      setIsSupported(false);
      if (onPlaybackAvailabilityChange) onPlaybackAvailabilityChange(false);
    }
  }, [speechText, correctTranscript, onPlaybackAvailabilityChange]);

  // Main playback trigger
  const handlePlayAudio = () => {
    if (isPlaying) {
      // Pause / Stop
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // Determine whether to use audioUrl or fallback to TTS
    // Note: synthetic placeholder domains fallback directly to Web Speech API
    const isSyntheticPlaceholder = audioUrl && audioUrl.includes('assets.unitreviewarcade.org');

    if (!audioUrl || isSyntheticPlaceholder) {
      playTTS();
      return;
    }

    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      }
      audioRef.current.currentTime = 0;

      audioRef.current.onplay = () => {
        setIsPlaying(true);
        setActiveEngine('audio');
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayCount((prev) => prev + 1);
      };

      audioRef.current.onerror = () => {
        console.warn('[AudioPromptPlayer] Audio URL failed to load, switching to TTS fallback');
        playTTS();
      };

      audioRef.current.play().catch(() => {
        // Autoplay or network failure: fallback to TTS
        playTTS();
      });
    } catch {
      playTTS();
    }
  };

  // If audio playback is completely unavailable
  if (!isSupported) {
    return (
      <div className={`p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 ${className}`}>
        <div className="flex items-center gap-2.5 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Audio Playback Unavailable</span>
        </div>
        <p className="text-xs text-amber-800 mt-1">
          This listening activity requires browser audio or Web Speech API support. Please enable audio on your device or try another browser.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-purple-50 border-2 border-sky-200 shadow-sm ${className}`}>
      
      {/* Player Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayAudio}
            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 ring-2 ring-rose-400'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-sky-600/20'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4 animate-pulse" />
                <span>Stop Playing</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{playCount > 0 ? 'Replay Audio' : 'Play Audio'}</span>
              </>
            )}
          </button>

          {/* Status Indicators */}
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            {isPlaying && (
              <span className="flex items-center gap-1.5 text-sky-700 font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                Listening...
              </span>
            )}
            {playCount > 0 && !isPlaying && (
              <span className="text-slate-500 flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Played {playCount} {playCount === 1 ? 'time' : 'times'}
              </span>
            )}
          </div>
        </div>

        {/* Engine Badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/80 text-sky-800 border border-sky-200">
            {activeEngine === 'tts' ? 'TTS Voice' : 'Audio Track'}
          </span>
        </div>

      </div>

      {/* Requirement 9: Strictly NEVER display transcript before student submits answer */}
      {isAnswered && (speechText || correctTranscript) && (
        <div className="mt-3 pt-3 border-t border-sky-200/60">
          <button
            type="button"
            onClick={() => setShowTranscriptAfterSubmit((prev) => !prev)}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showTranscriptAfterSubmit ? 'Hide Spoken Transcript' : 'Review Spoken Transcript'}</span>
          </button>

          {showTranscriptAfterSubmit && (
            <div className="mt-2 p-3 rounded-xl bg-white border border-indigo-200 text-xs text-slate-800 font-mono leading-relaxed flex items-start gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-indigo-900 font-sans font-bold mb-0.5">Spoken Transcript:</strong>
                <span>"{correctTranscript || speechText}"</span>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

