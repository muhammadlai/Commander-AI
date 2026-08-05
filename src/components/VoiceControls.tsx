import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Square, 
  Volume2, 
  VolumeX, 
  Volume1,
  Radio, 
  Zap, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { VoiceStatus } from '../types';

interface VoiceControlsProps {
  onTranscriptReceived?: (text: string) => void;
  className?: string;
  compact?: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  onTranscriptReceived,
  className = '',
  compact = false,
}) => {
  const [status, setStatus] = useState<VoiceStatus>('Ready');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [volume, setVolume] = useState(80);
  const [showVolSlider, setShowVolSlider] = useState(false);

  useEffect(() => {
    setIsMuted(voiceService.getIsMuted());
    setIsSpeakerOn(voiceService.getIsSpeakerEnabled());
    setVolume(voiceService.getVolume());

    const unsubscribe = voiceService.subscribe((newStatus, text) => {
      setStatus(newStatus);
      if (text && onTranscriptReceived && newStatus === 'Listening...') {
        onTranscriptReceived(text);
      }
    });

    return unsubscribe;
  }, [onTranscriptReceived]);

  const handleStartVoice = () => {
    voiceService.startListening((transcript) => {
      if (onTranscriptReceived && transcript) {
        onTranscriptReceived(transcript);
      }
    });
  };

  const handleStopVoice = () => {
    voiceService.stopListening();
    voiceService.stopSpeaking();
  };

  const handleToggleMute = () => {
    const muted = voiceService.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleSpeaker = () => {
    const speaker = voiceService.toggleSpeaker();
    setIsSpeakerOn(speaker);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    voiceService.setVolume(val);
  };

  // Status Colors & Badge
  const getStatusBadge = () => {
    switch (status) {
      case 'Listening...':
        return {
          text: 'Listening...',
          badge: 'bg-emerald-950 text-emerald-400 border-emerald-800 animate-pulse',
          iconColor: 'text-emerald-400',
        };
      case 'Thinking...':
        return {
          text: 'Thinking...',
          badge: 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse',
          iconColor: 'text-amber-400',
        };
      case 'Speaking...':
        return {
          text: 'Speaking...',
          badge: 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse',
          iconColor: 'text-cyan-400',
        };
      case 'Disconnected':
        return {
          text: 'Disconnected',
          badge: 'bg-rose-950 text-rose-400 border-rose-800',
          iconColor: 'text-rose-400',
        };
      case 'Ready':
      default:
        return {
          text: 'Ready',
          badge: 'bg-slate-900 text-slate-400 border-slate-800',
          iconColor: 'text-cyan-400',
        };
    }
  };

  const statusBadge = getStatusBadge();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Status indicator */}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${statusBadge.badge}`}>
          {statusBadge.text}
        </span>

        {/* Start / Stop Voice Button */}
        {status === 'Ready' || status === 'Disconnected' ? (
          <button
            onClick={handleStartVoice}
            id="btn-voice-start"
            className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Start Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleStopVoice}
            id="btn-voice-stop"
            className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
            title="Stop Voice"
          >
            <Square className="w-3.5 h-3.5 fill-rose-400" />
          </button>
        )}

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          id="btn-voice-mute"
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-950 text-rose-400 border-rose-800'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-slate-100'
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-2xl flex flex-wrap items-center justify-between gap-4 ${className}`}>
      
      {/* Status & Microphone Indicator Level */}
      <div className="flex items-center gap-3">
        {/* Microphone Indicator */}
        <div className={`p-2.5 rounded-xl border flex items-center justify-center ${
          status === 'Listening...'
            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            : isMuted
            ? 'bg-rose-950/80 border-rose-800 text-rose-400'
            : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-400'
        }`}>
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">Voice Interface</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${statusBadge.badge}`}>
              {statusBadge.text}
            </span>
          </div>

          {/* Dynamic Audio Waves Indicator */}
          <div className="flex items-center gap-1 mt-1">
            {status === 'Listening...' || status === 'Speaking...' ? (
              <div className="flex items-center gap-1 h-3">
                <span className="w-1 h-2 bg-emerald-400 animate-bounce"></span>
                <span className="w-1 h-3 bg-emerald-400 animate-bounce delay-75"></span>
                <span className="w-1 h-4 bg-emerald-400 animate-bounce delay-150"></span>
                <span className="w-1 h-2.5 bg-emerald-400 animate-bounce delay-100"></span>
                <span className="text-[10px] font-mono text-emerald-400 ml-1">Live Audio Wave</span>
              </div>
            ) : (
              <span className="text-[10px] font-mono text-slate-500">
                {isMuted ? 'Microphone Muted' : 'Modular Web Speech & Audio Synth'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Voice Interface Buttons Bar */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Start Voice Button */}
        {status === 'Ready' || status === 'Disconnected' ? (
          <button
            onClick={handleStartVoice}
            id="btn-voice-start-main"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-semibold text-xs transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
          >
            <Mic className="w-4 h-4" /> Start Voice
          </button>
        ) : (
          /* Stop Voice Button */
          <button
            onClick={handleStopVoice}
            id="btn-voice-stop-main"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-semibold text-xs transition-all shadow-[0_0_12px_rgba(244,63,94,0.2)] cursor-pointer"
          >
            <Square className="w-4 h-4 fill-rose-400" /> Stop Voice
          </button>
        )}

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          id="btn-voice-toggle-mute"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-950 text-rose-300 border-rose-800'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-slate-100 hover:bg-slate-800'
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
          <span>{isMuted ? 'Muted' : 'Mute'}</span>
        </button>

        {/* Speaker Output Toggle */}
        <button
          onClick={handleToggleSpeaker}
          id="btn-voice-toggle-speaker"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            !isSpeakerOn
              ? 'bg-rose-950 text-rose-300 border-rose-800'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-slate-100 hover:bg-slate-800'
          }`}
          title={isSpeakerOn ? "Disable Speaker Output" : "Enable Speaker Output"}
        >
          {isSpeakerOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          <span>{isSpeakerOn ? 'Speaker On' : 'Speaker Off'}</span>
        </button>

        {/* Volume Indicator Slider */}
        <div className="relative flex items-center gap-2 pl-2 border-l border-slate-800">
          <button
            onClick={() => setShowVolSlider(!showVolSlider)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
            title="Volume Control"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          <div className="flex items-center gap-1.5">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400 w-7 text-right">{volume}%</span>
          </div>
        </div>

      </div>

    </div>
  );
};
