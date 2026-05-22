/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertCircle, Volume2, VolumeX, Eye, BookOpen, Clock, Calendar, Zap, BellRing } from 'lucide-react';
import { StudyBlock, SubjectConfig, EXAM_SUBJECTS, formatTimeDifference } from '../types';

interface FocusModeProps {
  currentBlock: StudyBlock | null;
  onCompleteBlock: (id: string, status: 'completed' | 'skipped') => void;
  onNextBlock: () => void;
  subjects: SubjectConfig[];
}

export default function FocusMode({ currentBlock, onCompleteBlock, onNextBlock, subjects }: FocusModeProps) {
  const [timerType, setTimerType] = useState<'pomodoro' | 'block'>('pomodoro');
  const [timerDuration, setTimerDuration] = useState(25 * 60); // standard 25 mins in seconds
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Synchronize timer with block duration if user selects "block" mode
  useEffect(() => {
    if (timerType === 'block' && currentBlock) {
      const [sh, sm] = currentBlock.startTime.split(':').map(Number);
      const [eh, em] = currentBlock.endTime.split(':').map(Number);
      let diffMins = (eh * 60 + em) - (sh * 60 + sm);
      if (diffMins < 0) diffMins += 24 * 60; // fallback next day
      setTimerDuration(diffMins * 60);
      setTimeRemaining(diffMins * 60);
      setIsRunning(false);
    } else if (timerType === 'pomodoro') {
      setTimerDuration(25 * 60);
      setTimeRemaining(25 * 60);
      setIsRunning(false);
    }
  }, [timerType, currentBlock]);

  // Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      playAlarmAlert();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  // Ambient White Noise / Focus Sound Generation using Web Audio API
  // Ensures pure standard client-side zero-dependency audio generator
  useEffect(() => {
    if (soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        // Create low-frequency bandpass synthesizer for deep study hum (brownian-like hum)
        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brownian filtering coefficients
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // boost volume slightly
        }

        const brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;

        // Low-pass filter to keep it pleasant and ambient
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // keep it extremely soft

        brownNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        brownNoise.start();
        
        // Track refs to dispose properly
        (brownNoise as any).noteTag = "focus-noise";
        gainNodeRef.current = gainNode;
      } catch (e) {
        console.error("Audio Context initialization failed: ", e);
      }
    } else {
      cleanupFocusAudio();
    }

    return () => cleanupFocusAudio();
  }, [soundEnabled]);

  const cleanupFocusAudio = () => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {}
  };

  const playAlarmAlert = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5 note
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(timerDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSubject = currentBlock 
    ? subjects.find((s) => s.id === currentBlock.subjectId) || EXAM_SUBJECTS[EXAM_SUBJECTS.length - 1]
    : null;

  // Percentage complete for radial dial
  const progressPercent = ((timerDuration - timeRemaining) / timerDuration) * 100;

  return (
    <div id="focus-workspace" className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner with Exam Focus */}
      <div className="bg-[#f0f4f9] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-[#0078d4]" />
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">WBCS Preparation Engine</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distraction-free focus environment styled with Microsoft Fluent specifications.</p>
          </div>
        </div>
        <div className="p-1 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-[#0078d4] flex items-center gap-1.5 shadow-xs">
          <Zap className="h-3 w-3 fill-current text-amber-500" />
          <span>Active Streak Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* TIMER DIAL CONTAINER */}
        <div className="md:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-xs flex flex-col items-center justify-center relative">
          
          {/* Preset Buttons */}
          <div className="flex bg-[#f3f4f6] dark:bg-slate-900 p-0.5 rounded-full border border-slate-200 dark:border-slate-800 mb-8 self-center">
            <button 
              id="pomodoro-toggle-btn"
              onClick={() => setTimerType('pomodoro')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                timerType === 'pomodoro' 
                  ? 'bg-white dark:bg-slate-800 text-[#0078d4] shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button 
              id="block-toggle-btn"
              onClick={() => setTimerType('block')}
              disabled={!currentBlock}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 disabled:opacity-50 ${
                timerType === 'block' 
                  ? 'bg-white dark:bg-slate-800 text-[#0078d4] shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Block Slot Timer
            </button>
          </div>

          {/* Microsoft Elegant Circular Progress Circle */}
          <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              {/* Outer Track */}
              <circle
                cx="128"
                cy="128"
                r="112"
                className="stroke-slate-100 dark:stroke-slate-800 fill-transparent"
                strokeWidth="6"
              />
              {/* Active Accent Level */}
              <circle
                cx="128"
                cy="128"
                r="112"
                className="stroke-[#0078d4] fill-transparent transition-all duration-150 ease-linear"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 112}
                strokeDashoffset={2 * Math.PI * 112 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>

            {/* In-circle Typography */}
            <div className="text-center z-10 space-y-1">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                {isRunning ? "Studying Now" : "Paused"}
              </span>
              <div id="digital-timer" className="text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Goal: {formatTime(timerDuration)}
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-4 mb-4">
            <button
              id="ambient-sound-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Background Noise" : "Play Brown Ambient Hum"}
              className={`p-2.5 rounded-full border transition-all ${
                soundEnabled 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-400' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            <button
              id="play-pause-timer-btn"
              onClick={handleToggleTimer}
              className={`px-8 py-3 rounded-md font-semibold text-sm flex items-center gap-2 shadow-xs transition-transform transform active:scale-98 ${
                isRunning 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-[#0078d4] hover:bg-[#106ebe] text-white'
              }`}
            >
              {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              {isRunning ? 'Mute/Pause' : 'Start Focus'}
            </button>

            <button
              id="reset-timer-btn"
              onClick={handleResetTimer}
              title="Reset timer"
              className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-900 dark:border-slate-850 dark:text-slate-400"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {soundEnabled && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 animate-pulse font-mono font-medium">
              Generating active brown-noise ambient sound...
            </span>
          )}
        </div>

        {/* STUDY SUBJECT DISPLAY & QUICK ACTIONS */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Active Block Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Study block</span>
              {currentBlock && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentBlock.priority === 'high' 
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                    : currentBlock.priority === 'medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}>
                  {currentBlock.priority} priority
                </span>
              )}
            </div>

            {currentBlock ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${selectedSubject?.color} ${selectedSubject?.darkColor}`}>
                    {selectedSubject?.name}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight mt-1.5">
                    {currentBlock.topics}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{currentBlock.startTime} - {currentBlock.endTime} ({formatTimeDifference(currentBlock.startTime, currentBlock.endTime)} min block)</span>
                  </div>
                </div>

                {currentBlock.notes && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border-l-2 border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 italic">
                    {currentBlock.notes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-2">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Block Action Controls</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="complete-active-btn"
                      onClick={() => onCompleteBlock(currentBlock.id, 'completed')}
                      className="flex items-center justify-center gap-1.5 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mark Completed
                    </button>
                    <button
                      id="skip-active-btn"
                      onClick={() => onCompleteBlock(currentBlock.id, 'skipped')}
                      className="flex items-center justify-center gap-1.5 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      Skip Block
                    </button>
                  </div>
                  
                  <button
                    id="find-next-block-btn"
                    onClick={onNextBlock}
                    className="w-full text-center mt-2 text-xs text-[#0078d4] hover:underline font-semibold flex items-center justify-center gap-1"
                  >
                    Load Next Routine Block &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full inline-block">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No active study slots remaining</h4>
                  <p className="text-xs text-slate-400 mt-1">Excellent job! Take a well-deserved break or construct additional slots under the Today section.</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick WBCS Prep Pro-tips */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <BellRing className="h-4.5 w-4.5 text-[#0078d4]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">WBCS Executive Tips</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-[#0078d4] font-bold">•</span>
                <span>Study blocks under 2 hours with 15-minute intervals prevent cognitive overload in historical data recall.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0078d4] font-bold">•</span>
                <span>Indian National Movement covers 25 quick prelims marks. Don&apos;t skip the early Bengal revolutionary period.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0078d4] font-bold">•</span>
                <span>The Arithmetic and Reasoning section decides the cut-off qualifiers. Practice at least 30 minutes daily in this block.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
