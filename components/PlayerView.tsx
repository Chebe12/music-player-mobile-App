import React from 'react';
import { PlaybackState, PlaybackControls } from '../types';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, Volume2 } from 'lucide-react';

interface PlayerViewProps {
  playbackState: PlaybackState;
  controls: PlaybackControls;
  onMinimize: () => void;
}

const formatTime = (seconds: number) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerView: React.FC<PlayerViewProps> = ({ playbackState, controls, onMinimize }) => {
  const { currentTrack, isPlaying, currentTime, duration, isShuffle, isRepeat } = playbackState;

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center animate-in slide-in-from-bottom-full duration-300">
      {/* Background Blur */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px)'
        }}
      />
      
      {/* Header */}
      <div className="relative w-full px-6 py-6 flex justify-between items-center z-10">
        <button onClick={onMinimize} className="p-2 rounded-full hover:bg-white/10 text-white">
          <ChevronDown size={28} />
        </button>
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Now Playing</span>
        <button className="p-2 rounded-full hover:bg-white/10 text-white">
          {/* Placeholder for menu */}
          <div className="w-1 h-1 bg-white rounded-full mb-1"></div>
          <div className="w-1 h-1 bg-white rounded-full mb-1"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </button>
      </div>

      {/* Album Art */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center p-8 max-h-[50vh]">
        <div className={`w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl elevation-high transform transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-95'}`}>
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info & Controls */}
      <div className="relative z-10 w-full px-8 pb-12 flex flex-col">
        {/* Title Info */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{currentTrack.title}</h2>
          <p className="text-lg text-gray-300 font-medium">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 group">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => controls.seek(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
          />
          <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={controls.toggleShuffle}
            className={`p-3 rounded-full transition-colors ${isShuffle ? 'text-indigo-400 bg-white/5' : 'text-gray-400'}`}
          >
            <Shuffle size={20} />
          </button>
          
          <button onClick={controls.prev} className="p-4 text-white hover:text-gray-300 transition-transform active:scale-90">
            <SkipBack size={32} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => isPlaying ? controls.pause() : controls.play()}
            className="w-20 h-20 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-400 transition-transform active:scale-95 hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={36} fill="currentColor" />
            ) : (
              <Play size={36} fill="currentColor" className="ml-1" />
            )}
          </button>
          
          <button onClick={controls.next} className="p-4 text-white hover:text-gray-300 transition-transform active:scale-90">
            <SkipForward size={32} fill="currentColor" />
          </button>
          
          <button 
            onClick={controls.toggleRepeat}
            className={`p-3 rounded-full transition-colors ${isRepeat ? 'text-indigo-400 bg-white/5' : 'text-gray-400'}`}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Volume - Optional for mobile but good for responsive web */}
        <div className="flex items-center space-x-4 px-4">
           <Volume2 size={18} className="text-gray-400"/>
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01"
             value={playbackState.volume}
             onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
             className="w-full h-1 bg-white/10 rounded-full accent-gray-400"
           />
        </div>
      </div>
    </div>
  );
};