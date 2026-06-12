// Web VAD via getUserMedia + Web Audio AnalyserNode.
// Same state machine as the native version (idle → listening → speaking → ended),
// but we read mic level from an AnalyserNode RMS instead of expo-av metering.

import { useEffect, useRef, useState, useCallback } from 'react';

export type VadState = 'idle' | 'listening' | 'speaking' | 'ended';

type Options = {
  // RMS threshold in dB (analyser RMS roughly -∞ to 0; speech around -30 to -15)
  speechDb?: number;
  silenceMs?: number;
  maxMs?: number;
};

export function useVAD(opts: Options = {}) {
  const speechDb = opts.speechDb ?? -32;
  const silenceMs = opts.silenceMs ?? 1300;
  const maxMs = opts.maxMs ?? 12_000;

  const [state, setState] = useState<VadState>('idle');
  const [level, setLevel] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef<VadState>('idle');
  const lastSpeechAtRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const stoppedRef = useRef(false);

  const setStateBoth = (s: VadState) => {
    stateRef.current = s;
    setState(s);
  };

  const stop = useCallback(async (finalState: VadState = 'ended') => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (ctxRef.current) {
      try { await ctxRef.current.close(); } catch {}
      ctxRef.current = null;
    }
    analyserRef.current = null;
    setStateBoth(finalState);
    setLevel(0);
  }, []);

  const start = useCallback(async () => {
    if (streamRef.current) return;
    stoppedRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const AnyCtx: typeof AudioContext = (window.AudioContext || (window as any).webkitAudioContext) as any;
      const ctx = new AnyCtx();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buf = new Uint8Array(analyser.fftSize);
      startedAtRef.current = Date.now();
      lastSpeechAtRef.current = 0;
      setStateBoth('listening');

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(buf);
        // RMS → dB
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        const db = rms > 0 ? 20 * Math.log10(rms) : -160;

        // Normalize -60..0 dB → 0..1 for waveform
        const norm = Math.max(0, Math.min(1, (db + 60) / 60));
        setLevel(norm);

        const now = Date.now();
        if (db > speechDb) {
          lastSpeechAtRef.current = now;
          if (stateRef.current === 'listening') setStateBoth('speaking');
        }

        if (now - startedAtRef.current > maxMs) {
          stop('ended');
          return;
        }
        if (
          stateRef.current === 'speaking' &&
          lastSpeechAtRef.current > 0 &&
          now - lastSpeechAtRef.current > silenceMs
        ) {
          stop('ended');
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      console.warn('[VAD] start error', e);
      setStateBoth('idle');
    }
  }, [speechDb, silenceMs, maxMs, stop]);

  const reset = useCallback(() => {
    stoppedRef.current = false;
    setStateBoth('idle');
    setLevel(0);
  }, []);

  useEffect(() => {
    return () => {
      stop('idle');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, level, start, stop, reset };
}
