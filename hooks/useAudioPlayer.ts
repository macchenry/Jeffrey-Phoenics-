import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';
import { decode, decodeAudioData } from '../utils/audioUtils';

// As per Gemini API documentation, the output audio has a sample rate of 24000.
const OUTPUT_SAMPLE_RATE = 24000;

export const useAudioPlayer = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext on first use
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
      } else {
        console.error("AudioContext is not supported in this browser.");
        setError("Your browser does not support audio playback.");
      }
    }
    // Resume context if it was suspended by browser autoplay policies
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const stop = useCallback(() => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      // onended will fire, which will set isSpeaking to false and clear the ref.
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    const audioContext = getAudioContext();
    if (!audioContext) {
      return;
    }
    
    // If something is already playing, stop it before starting the new one.
    if(currentSourceRef.current){
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
    }

    setIsSpeaking(true);
    setError(null);

    try {
      const base64Audio = await generateSpeech(text);
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContext, OUTPUT_SAMPLE_RATE, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
      currentSourceRef.current = source;

      source.onended = () => {
        setIsSpeaking(false);
        currentSourceRef.current = null;
      };
    } catch (err: any) {
      console.error("Playback error:", err);
      setError(err.message || "An unknown error occurred during playback.");
      setIsSpeaking(false);
    }
  }, [getAudioContext]);

  // Cleanup AudioContext on unmount
  useEffect(() => {
    const audioContext = audioContextRef.current;
    return () => {
      audioContext?.close().catch(console.error);
    };
  }, []);

  return { speak, stop, isSpeaking, error };
};