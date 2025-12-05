
import React, { useState } from 'react';
import { PlaybackState, PlaybackControls, Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, Volume2, ListMusic, ArrowUp, ArrowDown, Mic2, Star, Trash2 } from 'lucide-react';
import { useRatings } from '../hooks/useRatings';

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

type PlayerViewMode = 'art' | 'queue' | 'lyrics';

export const PlayerView: React.FC<PlayerViewProps> = ({ playbackState, controls, onMinimize }) => {
  const { currentTrack, isPlaying, currentTime, duration, isShuffle, isRepeat, queue } = playbackState;
  const [activeView, setActiveView] = useState<PlayerViewMode>('art');
  const [isEditingQueue, setIsEditingQueue] = useState(false);
  const { ratings, setRating } = useRatings();

  if (!currentTrack) return null;
  
  const currentRating = ratings[currentTrack.id] || 0;

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newQueue = [...queue];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newQueue.length) return;

    // Swap
    [newQueue[index], newQueue[targetIndex]] = [newQueue[targetIndex], newQueue[index]];
    controls.reorderQueue(newQueue);
  };

  const handleRemove = (index: number) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    controls.reorderQueue(newQueue);
    
    // If queue becomes empty, we could optionally handle it, but standard behavior is fine.
  };

  const toggleView = (view: PlayerViewMode) => {
    if (activeView === view) {
      setActiveView('art');
    } else {
      setActiveView(view);
    }
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'queue': return 'Queue';
      case 'lyrics': return 'Lyrics';
      default: return 'Now Playing';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col items-center animate-in slide-in-from-bottom-full duration-300">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-30 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(80px)'
        }}
      />
      
      {/* Header */}
      <div className="relative w-full px-6 py-6 flex justify-between items-center z-10">
        <button onClick={onMinimize} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-colors">
          <ChevronDown size={28} />
        </button>
        
        <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
          {getViewTitle()}
        </span>

        {/* Spacer to balance the layout since buttons are moved to bottom */}
        <div className="w-10"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1 flex flex-col overflow-hidden">
        
        {activeView === 'queue' && (
          // QUEUE VIEW
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 z-20">
               <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                 Next Up ({queue.length})
               </h3>
               {queue.length > 0 && (
                 <button 
                   onClick={() => setIsEditingQueue(!isEditingQueue)}
                   className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hover:text-indigo-700 dark:hover:text-indigo-300"
                 >
                   {isEditingQueue ? 'Done' : 'Edit'}
                 </button>
               )}
            </div>
            
            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <ListMusic size={48} className="mb-2 opacity-20" />
                <p>Queue is empty</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queue.map((track, index) => {
                  const isCurrent = track.id === currentTrack.id;
                  return (
                    <div 
                      key={`${track.id}-${index}`}
                      className={`flex items-center p-3 rounded-xl transition-colors group
                        ${isCurrent ? 'bg-indigo-100 dark:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    >
                      {/* Playing Indicator or Number */}
                      <div className="w-8 flex-shrink-0 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
                        {isCurrent && isPlaying ? (
                          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse mx-auto" />
                        ) : (
                          <span className="opacity-70">{index + 1}</span>
                        )}
                      </div>

                      <div 
                        className="flex-1 min-w-0 mx-3 cursor-pointer"
                        onClick={() => !isEditingQueue && controls.play(track)}
                      >
                        <div className={`font-medium truncate ${isCurrent ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'}`}>
                          {track.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{track.artist}</div>
                      </div>

                      {/* Manage Controls */}
                      {isEditingQueue ? (
                        <div className="flex items-center space-x-2">
                           <div className="flex flex-col space-y-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleReorder(index, 'up'); }}
                              disabled={index === 0}
                              className="p-1 hover:text-indigo-500 disabled:opacity-20 text-slate-400"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleReorder(index, 'down'); }}
                              disabled={index === queue.length - 1}
                              className="p-1 hover:text-indigo-500 disabled:opacity-20 text-slate-400"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="Remove from queue"
                          >
                             <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeView === 'lyrics' && (
          // LYRICS VIEW
          <div className="flex-1 overflow-y-auto px-8 pb-8 text-center mask-image-gradient">
            {currentTrack.lyrics ? (
               <div className="flex flex-col space-y-6 pt-4">
                 {currentTrack.lyrics.split('\n\n').map((stanza, i) => (
                   <p key={i} className="text-2xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-line opacity-90">
                     {stanza}
                   </p>
                 ))}
                 <div className="h-12" /> {/* Spacer at bottom */}
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-60 text-slate-500 dark:text-slate-400">
                <Mic2 size={48} className="mb-4" />
                <p className="text-lg font-medium">No lyrics available</p>
                <p className="text-sm mt-2">Instrumental or missing data</p>
              </div>
            )}
          </div>
        )}

        {activeView === 'art' && (
          // ALBUM ART VIEW
          <div className="flex-1 flex items-center justify-center p-8 max-h-[50vh]">
            <div className={`w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl elevation-high transform transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-95'}`}>
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info & Controls (Always visible at bottom) */}
      <div className="relative z-10 w-full px-6 pb-8 flex flex-col bg-gradient-to-t from-slate-200 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900 dark:to-transparent pt-8 transition-colors duration-300">
        {/* Title Info */}
        <div className={`mb-6 transition-opacity duration-300 ${activeView === 'queue' ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="flex justify-between items-end">
             <div className="flex-1 mr-4">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1 leading-tight line-clamp-1">{currentTrack.title}</h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 font-medium line-clamp-1">{currentTrack.artist}</p>
             </div>
             <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(currentTrack.id, star)}
                    className="focus:outline-none transition-transform active:scale-90"
                  >
                    <Star 
                      size={20} 
                      className={`${star <= currentRating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300 dark:text-slate-600'}`} 
                    />
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 group">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => controls.seek(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-300 dark:bg-white/20 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
          />
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Transport Controls */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button 
            onClick={controls.toggleShuffle}
            className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Shuffle size={20} />
          </button>
          
          <button onClick={controls.prev} className="p-2 text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-slate-300 transition-transform active:scale-90">
            <SkipBack size={32} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => isPlaying ? controls.pause() : controls.play()}
            className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition-transform active:scale-95 hover:scale-105"
          >
            {isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-1" />
            )}
          </button>
          
          <button onClick={controls.next} className="p-2 text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-slate-300 transition-transform active:scale-90">
            <SkipForward size={32} fill="currentColor" />
          </button>
          
          <button 
            onClick={controls.toggleRepeat}
            className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Bottom Tools Row: Volume | Lyrics | Queue */}
        <div className="flex items-center justify-between gap-4 px-2">
            {/* Volume */}
            <div className="flex items-center flex-1 gap-3 bg-slate-200 dark:bg-white/5 rounded-full px-4 py-2">
                <Volume2 size={18} className="text-slate-500 dark:text-slate-400 flex-shrink-0"/>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={playbackState.volume}
                  onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-400 dark:bg-white/20 rounded-full accent-slate-800 dark:accent-white"
                />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleView('lyrics')} 
                className={`p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${activeView === 'lyrics' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-slate-400 dark:text-slate-500'}`}
                title="Lyrics"
              >
                <Mic2 size={20} />
              </button>
              <button 
                onClick={() => toggleView('queue')} 
                className={`p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${activeView === 'queue' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-slate-400 dark:text-slate-500'}`}
                title="Queue"
              >
                <ListMusic size={20} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
