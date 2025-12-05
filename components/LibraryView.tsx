
import React, { useRef } from 'react';
import { Track } from '../types';
import { Play, BarChart2, CheckCircle2, Star, FolderPlus } from 'lucide-react';
import { useRatings } from '../hooks/useRatings';

interface LibraryViewProps {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onImportMusic: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const LibraryView: React.FC<LibraryViewProps> = ({ tracks, currentTrack, isPlaying, onPlay, onImportMusic }) => {
  const { ratings, setRating } = useRatings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full w-full pb-32 overflow-y-auto pt-4 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Library</h1>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onImportMusic} 
            className="hidden" 
            multiple 
            accept="audio/*" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-indigo-100 dark:bg-white/10 text-indigo-700 dark:text-white rounded-full hover:bg-indigo-200 dark:hover:bg-white/20 transition-colors"
            title="Import Local Music"
          >
            <FolderPlus size={24} />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {tracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;
          const rating = ratings[track.id] || 0;

          return (
            <div 
              key={track.id}
              onClick={() => onPlay(track)}
              className={`flex items-center p-3 rounded-xl transition-all cursor-pointer border 
                ${isCurrent 
                  ? 'bg-indigo-50 dark:bg-white/10 border-indigo-200 dark:border-white/10' 
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-md dark:shadow-lg bg-slate-200 dark:bg-slate-800">
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
                <div className="flex items-center space-x-2">
                  <h3 className={`font-semibold truncate text-lg ${isCurrent ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                    {track.title}
                  </h3>
                  {track.downloaded && (
                    <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-500" />
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {track.artist} <span className="mx-1 opacity-60">•</span> {formatDuration(track.duration)}
                </p>
                <div className="flex mt-1" onClick={(e) => e.stopPropagation()}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-0.5 focus:outline-none"
                      onClick={() => setRating(track.id, star)}
                    >
                      <Star 
                        size={12} 
                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="ml-2 flex-shrink-0">
                {isCurrent && isPlaying ? (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-glow">
                     <BarChart2 size={16} fill="white" className="text-white" />
                  </div>
                ) : (
                  <button className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
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
