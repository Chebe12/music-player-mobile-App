import React, { useState } from 'react';
import { PlaybackState, PlaybackControls, Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ChevronDown, Volume2, ListMusic, ArrowUp, ArrowDown, Mic2 } from 'lucide-react';

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

  if (!currentTrack) return null;

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const newQueue = [...queue];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newQueue.length) return;

    // Swap
    [newQueue[index], newQueue[targetIndex]] = [newQueue[targetIndex], newQueue[index]];
    controls.reorderQueue(newQueue);
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
        
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
          {getViewTitle()}
        </span>

        <div className="flex items-center space-x-1">
          <button 
            onClick={() => toggleView('lyrics')} 
            className={`p-2 rounded-full hover:bg-white/10 ${activeView === 'lyrics' ? 'text-indigo-400' : 'text-white'}`}
            title="Lyrics"
          >
            <Mic2 size={24} />
          </button>
          <button 
            onClick={() => toggleView('queue')} 
            className={`p-2 rounded-full hover:bg-white/10 ${activeView === 'queue' ? 'text-indigo-400' : 'text-white'}`}
            title="Queue"
          >
            <ListMusic size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-1 flex flex-col overflow-hidden">
        
        {activeView === 'queue' && (
          // QUEUE VIEW
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-semibold text-gray-400">Next Up</h3>
               <button 
                 onClick={() => setIsEditingQueue(!isEditingQueue)}
                 className="text-xs font-bold text-indigo-400 uppercase tracking-wider hover:text-indigo-300"
               >
                 {isEditingQueue ? 'Done' : 'Edit'}
               </button>
            </div>
            
            <div className="space-y-2">
              {queue.map((track, index) => {
                const isCurrent = track.id === currentTrack.id;
                return (
                  <div 
                    key={`${track.id}-${index}`}
                    className={`flex items-center p-3 rounded-xl ${isCurrent ? 'bg-white/10' : 'hover:bg-white/5'} transition-colors group`}
                  >
                    {/* Playing Indicator or Number */}
                    <div className="w-8 flex-shrink-0 text-center text-sm font-medium text-gray-400">
                      {isCurrent && isPlaying ? (
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse mx-auto" />
                      ) : (
                        <span className="opacity-50">{index + 1}</span>
                      )}
                    </div>

                    <div 
                      className="flex-1 min-w-0 mx-3 cursor-pointer"
                      onClick={() => !isEditingQueue && controls.play(track)}
                    >
                      <div className={`font-medium truncate ${isCurrent ? 'text-indigo-400' : 'text-white'}`}>
                        {track.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{track.artist}</div>
                    </div>

                    {/* Reorder Controls */}
                    {isEditingQueue ? (
                      <div className="flex flex-col space-y-1">
                        <button 
                          onClick={() => handleReorder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-indigo-400 disabled:opacity-20 text-gray-400"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          onClick={() => handleReorder(index, 'down')}
                          disabled={index === queue.length - 1}
                          className="p-1 hover:text-indigo-400 disabled:opacity-20 text-gray-400"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeView === 'lyrics' && (
          // LYRICS VIEW
          <div className="flex-1 overflow-y-auto px-8 pb-8 text-center mask-image-gradient">
            {currentTrack.lyrics ? (
               <div className="flex flex-col space-y-6 pt-4">
                 {currentTrack.lyrics.split('\n\n').map((stanza, i) => (
                   <p key={i} className="text-2xl font-bold leading-relaxed text-gray-200 whitespace-pre-line opacity-90">
                     {stanza}
                   </p>
                 ))}
                 <div className="h-12" /> {/* Spacer at bottom */}
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-40 text-gray-300">
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
      <div className="relative z-10 w-full px-8 pb-12 flex flex-col bg-gradient-to-t from-slate-900 via-slate-900 to-transparent pt-8">
        {/* Title Info - Only show when showing Art to avoid clutter in other views, or keep minimal? 
            Original code hid it in 'queue'. Let's keep logic but make sure it's consistent.
            We will show it in art and lyrics (since lyrics view pushes text up).
        */}
        {activeView !== 'queue' && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight line-clamp-1">{currentTrack.title}</h2>
            <p className="text-lg text-gray-300 font-medium line-clamp-1">{currentTrack.artist}</p>
          </div>
        )}

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
            className={`p-3 rounded-full transition-colors ${isShuffle ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white'}`}
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
            className={`p-3 rounded-full transition-colors ${isRepeat ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400 hover:text-white'}`}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Volume - Always visible now */}
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