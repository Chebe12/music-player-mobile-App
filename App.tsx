
import React, { useState } from 'react';
import { useAudio } from './hooks/useAudio';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useTheme } from './hooks/useTheme';
import { SAMPLE_TRACKS } from './constants';
import { LibraryView } from './components/LibraryView';
import { PlayerView } from './components/PlayerView';
import { AIDJView } from './components/AIDJView';
import { MiniPlayer } from './components/MiniPlayer';
import { ViewState, Track } from './types';
import { Music, Disc, Sparkles, WifiOff, Sun, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavButtonProps { 
  targetView: ViewState; 
  currentView: ViewState;
  isPlayerOpen: boolean;
  icon: LucideIcon; 
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  targetView, 
  currentView,
  isPlayerOpen,
  icon: Icon, 
  label,
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors duration-200 ${
      currentView === targetView && !isPlayerOpen 
        ? 'text-indigo-600 dark:text-indigo-400' 
        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
    }`}
  >
    <Icon size={24} strokeWidth={currentView === targetView && !isPlayerOpen ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default function App() {
  const [libraryTracks, setLibraryTracks] = useState<Track[]>(SAMPLE_TRACKS);
  const { state, controls } = useAudio(libraryTracks);
  const [view, setView] = useState<ViewState>('library');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const isOnline = useNetworkStatus();
  const { isDark, toggleTheme } = useTheme();

  const handlePlayTrack = (track: Track) => {
    controls.play(track);
  };

  const handleImportMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newTracks: Track[] = Array.from(e.target.files).map((file: File) => ({
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: 'Local Track',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', // Generic placeholder
        audioUrl: URL.createObjectURL(file),
        duration: 0, // Duration will be determined by the audio element upon load
        downloaded: true,
        genre: 'Local'
      }));

      // Update Library
      setLibraryTracks(prev => [...prev, ...newTracks]);
      
      // Update Player Queue (Append to current queue)
      controls.reorderQueue([...state.queue, ...newTracks]);
    }
  };

  return (
    <div className="relative h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden font-sans select-none transition-colors duration-300">
      
      {/* Offline Banner */}
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold text-center py-1">
          <div className="flex items-center justify-center gap-2">
            <WifiOff size={12} />
            <span>OFFLINE MODE</span>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-40 p-2 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
        aria-label="Toggle Theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Content Area */}
      <main className={`absolute inset-0 pb-20 ${!isOnline ? 'pt-6' : ''}`}>
        {view === 'library' && (
          <LibraryView 
            tracks={libraryTracks}
            currentTrack={state.currentTrack}
            isPlaying={state.isPlaying}
            onPlay={handlePlayTrack}
            onImportMusic={handleImportMusic}
          />
        )}
        {view === 'ai-dj' && (
          <AIDJView onPlayTrack={handlePlayTrack} />
        )}
      </main>

      {/* Mini Player */}
      {!isPlayerOpen && state.currentTrack && (
        <MiniPlayer 
          playbackState={state} 
          controls={controls} 
          onExpand={() => setIsPlayerOpen(true)}
        />
      )}

      {/* Full Screen Player Modal */}
      {isPlayerOpen && state.currentTrack && (
        <PlayerView 
          playbackState={state}
          controls={controls}
          onMinimize={() => setIsPlayerOpen(false)}
        />
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-white/5 flex justify-around items-center z-50 backdrop-blur-lg pb-safe transition-colors duration-300">
        <NavButton 
          targetView="library" 
          currentView={view} 
          isPlayerOpen={isPlayerOpen} 
          icon={Music} 
          label="Library" 
          onClick={() => { setView('library'); setIsPlayerOpen(false); }}
        />
        <NavButton 
          targetView="ai-dj" 
          currentView={view} 
          isPlayerOpen={isPlayerOpen} 
          icon={Sparkles} 
          label="Vibe AI" 
          onClick={() => { setView('ai-dj'); setIsPlayerOpen(false); }}
        />
        <button
           onClick={() => state.currentTrack ? setIsPlayerOpen(true) : setView('library')}
           className={`flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors duration-200 ${
             isPlayerOpen 
               ? 'text-indigo-600 dark:text-indigo-400' 
               : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
           }`}
        >
          <Disc size={24} className={state.isPlaying ? 'animate-spin-slow' : ''} />
          <span className="text-[10px] font-medium">Now Playing</span>
        </button>
      </nav>
      
      {/* Safe Area Spacer for iPhones */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white dark:bg-slate-900 w-full fixed bottom-0 z-[60] transition-colors duration-300" />
    </div>
  );
}
