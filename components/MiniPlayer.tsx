import React from 'react';
import { PlaybackState, PlaybackControls } from '../types';
import { Play, Pause, SkipForward } from 'lucide-react';

interface MiniPlayerProps {
  playbackState: PlaybackState;
  controls: PlaybackControls;
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ playbackState, controls, onExpand }) => {
  const { currentTrack, isPlaying, currentTime, duration } = playbackState;

  if (!currentTrack) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="fixed bottom-[4.5rem] left-2 right-2 md:left-4 md:right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl p-2 shadow-xl dark:shadow-2xl z-40 cursor-pointer border border-slate-200 dark:border-white/5 transition-transform active:scale-[0.99]"
      onClick={onExpand}
    >
      {/* Progress Line */}
      <div className="absolute top-0 left-2 right-2 h-[2px] bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center pt-1.5 px-1">
        {/* Art */}
        <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 animate-[spin_10s_linear_infinite] shadow-sm ${!isPlaying ? 'paused' : ''}`}>
          <img src={currentTrack.coverUrl} alt="cover" className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">{currentTrack.title}</h4>
          <p className="text-xs text-indigo-600 dark:text-indigo-300 truncate leading-tight">{currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 mr-1">
          <button 
            className="p-2 text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
            onClick={(e) => { e.stopPropagation(); isPlaying ? controls.pause() : controls.play(); }}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button 
            className="p-2 text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
            onClick={(e) => { e.stopPropagation(); controls.next(); }}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};