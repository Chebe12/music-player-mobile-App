import React from 'react';
import { Track } from '../types';
import { Play, BarChart2 } from 'lucide-react';

interface LibraryViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ tracks, currentTrack, isPlaying, onPlay }) => {
  return (
    <div className="flex flex-col h-full w-full pb-32 overflow-y-auto pt-4 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-tight">Library</h1>
      
      <div className="space-y-4">
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          return (
            <div 
              key={track.id}
              onClick={() => onPlay(track)}
              className={`flex items-center p-3 rounded-xl transition-all cursor-pointer border border-transparent 
                ${isCurrent ? 'bg-white/10 border-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                <img 
                  src={track.coverUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover"
                />
                {isCurrent && isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <BarChart2 className="w-6 h-6 text-white animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex-1 min-w-0">
                <h3 className={`font-semibold truncate text-lg ${isCurrent ? 'text-indigo-400' : 'text-white'}`}>
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
              </div>

              <div className="ml-2 flex-shrink-0">
                {isCurrent && isPlaying ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-glow">
                     <BarChart2 size={16} fill="white" />
                  </div>
                ) : (
                  <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};