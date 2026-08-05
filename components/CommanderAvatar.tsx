import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Volume2, Mic, Cpu, Activity, Zap } from 'lucide-react';
import { AvatarState } from '../types';

interface CommanderAvatarProps {
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CommanderAvatar: React.FC<CommanderAvatarProps> = ({
  state = 'idle',
  size = 'md',
  showStatusLabel = true,
  className = '',
  onClick,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [headOffset, setHeadOffset] = useState({ x: 0, y: 0 });

  // Natural Eye Blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Subtle natural head movement / floating sway
  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (state === 'speaking') {
        setHeadOffset({
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 4,
        });
      } else if (state === 'thinking') {
        setHeadOffset({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        });
      } else {
        setHeadOffset({
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        });
      }
    }, 1200);

    return () => clearInterval(moveInterval);
  }, [state]);

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  };

  const containerDimensions = sizeClasses[size] || sizeClasses.md;

  // Status Colors & Badges
  const getStateInfo = () => {
    switch (state) {
      case 'listening':
        return {
          label: 'Listening...',
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/50',
          glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
          ring: 'border-emerald-400',
        };
      case 'thinking':
        return {
          label: 'Thinking...',
          color: 'text-amber-400',
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/50',
          glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
          ring: 'border-amber-400',
        };
      case 'speaking':
        return {
          label: 'Speaking...',
          color: 'text-cyan-400',
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-500/50',
          glow: 'shadow-[0_0_30px_rgba(6,182,212,0.45)]',
          ring: 'border-cyan-400',
        };
      case 'idle':
      default:
        return {
          label: 'Commander Ready',
          color: 'text-slate-300',
          bg: 'bg-slate-900/80',
          border: 'border-slate-800',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
          ring: 'border-cyan-500/30',
        };
    }
  };

  const stateInfo = getStateInfo();

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        onClick={onClick}
        className={`relative ${containerDimensions} rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer group ${stateInfo.glow}`}
      >
        {/* Outer Orbital Rotating Rings for Thinking & Speaking */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-dashed ${stateInfo.ring} transition-all duration-700 ${
            state === 'thinking'
              ? 'animate-spin opacity-80'
              : state === 'speaking'
              ? 'animate-pulse opacity-90 scale-105'
              : state === 'listening'
              ? 'animate-ping opacity-30 scale-110'
              : 'opacity-40 hover:opacity-70'
          }`}
          style={{ animationDuration: state === 'thinking' ? '4s' : '2s' }}
        ></div>

        {/* Outer Ripple for Listening */}
        {state === 'listening' && (
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none"></div>
        )}

        {/* Breathing Base Hologram Container */}
        <div
          className={`w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 ${stateInfo.border} overflow-hidden relative flex items-center justify-center transition-transform duration-700 ${
            state === 'idle' ? 'animate-pulse' : ''
          }`}
          style={{
            transform: `translate(${headOffset.x}px, ${headOffset.y}px)`,
          }}
        >
          {/* Subtle Cyber Grid Background overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>

          {/* Futuristic Avatar SVG Character */}
          <div className="relative z-10 w-3/4 h-3/4 flex flex-col items-center justify-center">
            
            {/* Visor / Eyes Container */}
            <div className="relative w-full h-1/2 flex items-center justify-center">
              
              {/* Visor Background */}
              <div className="w-4/5 h-3/5 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-[inner_0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-around px-3 relative overflow-hidden">
                
                {/* Holographic Visor Reflection */}
                <div className="absolute -top-4 -left-4 w-12 h-16 bg-white/10 rotate-45 pointer-events-none"></div>

                {/* Left Eye */}
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    state === 'thinking'
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : state === 'listening'
                      ? 'bg-emerald-400 shadow-[0_0_10px_#10b981] scale-110'
                      : state === 'speaking'
                      ? 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
                      : 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                  } ${isBlinking ? 'scale-y-10 opacity-30' : 'scale-y-100'}`}
                ></div>

                {/* Center Core / Nose bridge glow */}
                <div className="w-1 h-1 rounded-full bg-cyan-300/60 animate-ping"></div>

                {/* Right Eye */}
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    state === 'thinking'
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : state === 'listening'
                      ? 'bg-emerald-400 shadow-[0_0_10px_#10b981] scale-110'
                      : state === 'speaking'
                      ? 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
                      : 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                  } ${isBlinking ? 'scale-y-10 opacity-30' : 'scale-y-100'}`}
                ></div>
              </div>
            </div>

            {/* Speaking Audio Equalizer Bar / Mouth Waveform */}
            <div className="w-1/2 h-4 mt-2 flex items-center justify-center gap-1">
              {state === 'speaking' ? (
                <>
                  <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-5 bg-cyan-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                  <div className="w-1 h-4 bg-cyan-300 rounded-full animate-bounce delay-300"></div>
                  <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                </>
              ) : state === 'listening' ? (
                <div className="w-3/4 h-1 bg-emerald-400/80 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              ) : state === 'thinking' ? (
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
              ) : (
                <div className="w-1/2 h-0.5 bg-cyan-500/50 rounded-full"></div>
              )}
            </div>

          </div>

          {/* Floating Particle Glows */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold tracking-wider text-cyan-400/60 uppercase pointer-events-none">
            COMMANDER
          </div>
        </div>
      </div>

      {/* Optional Status Pill Label */}
      {showStatusLabel && (
        <span
          className={`px-3 py-1 rounded-full border text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all ${stateInfo.bg} ${stateInfo.color} ${stateInfo.border}`}
        >
          <span className={`w-2 h-2 rounded-full ${stateInfo.color} animate-pulse`}></span>
          {stateInfo.label}
        </span>
      )}
    </div>
  );
};
