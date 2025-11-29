import React, { useState } from 'react';
import { useAudio } from './hooks/useAudio';
import { SAMPLE_TRACKS } from './constants';
import { LibraryView } from './components/LibraryView';
import { PlayerView } from './components/PlayerView';
import { AIDJView } from './components/AIDJView';
import { MiniPlayer } from './components/MiniPlayer';
import { ViewState, Track } from './types';
import { Music, Disc, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavButtonProps { 
  targetView: ViewState; 
  currentView: ViewState;
  isPlayerOpen: boolean;
  icon: LucideIcon; 
  label: string;
  onClick: () => void;
}

// Helper component for navigation buttons
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
    className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${
      currentView === targetView && !isPlayerOpen ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
    }`}
  >
    <Icon size={24} strokeWidth={currentView === targetView && !isPlayerOpen ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default function App() {
  const { state, controls } = useAudio(SAMPLE_TRACKS);
  const [view, setView] = useState<ViewState>('library');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handlePlayTrack = (track: Track) => {
    controls.play(track);
    // Don't open full player immediately, just play. Mini player appears.
  };

  return (
    <div className="relative h-screen w-full bg-slate-900 text-white overflow-hidden font-sans select-none">
      
      {/* Main Content Area */}
      <main className="absolute inset-0 pb-20">
        {view === 'library' && (
          <LibraryView 
            tracks={SAMPLE_TRACKS}
            currentTrack={state.currentTrack}
            isPlaying={state.isPlaying}
            onPlay={handlePlayTrack}
          />
        )}
        {view === 'player' && (
           <div className="flex items-center justify-center h-full text-gray-500">
             Switch to Library or AI DJ to find music.
           </div>
        )}
        {view === 'ai-dj' && (
          <AIDJView onPlayTrack={handlePlayTrack} />
        )}
      </main>

      {/* Mini Player - Always visible if track is playing/paused & PlayerView is closed */}
      {!isPlayerOpen && state.currentTrack && (
        <MiniPlayer 
          playbackState={state} 
          controls={controls} 
          onExpand={() => setIsPlayerOpen(true)}
        />
      )}

      {/* Full Screen Player Modal */}
      {isPlayerOpen && (
        <PlayerView 
          playbackState={state}
          controls={controls}
          onMinimize={() => setIsPlayerOpen(false)}
        />
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-white/5 flex justify-around items-center z-50 backdrop-blur-lg bg-opacity-90 pb-safe">
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
        {/* 
          We use a dummy button for 'player' view in navbar that just opens the full player 
          if a song is active, otherwise goes to library.
        */}
        <button
           onClick={() => state.currentTrack ? setIsPlayerOpen(true) : setView('library')}
           className={`flex flex-col items-center justify-center space-y-1 w-full h-full ${
             isPlayerOpen ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
           }`}
        >
          <Disc size={24} className={state.isPlaying ? 'animate-spin-slow' : ''} />
          <span className="text-[10px] font-medium">Now Playing</span>
        </button>
      </nav>
      
      {/* Safe Area Spacer for iPhones */}
      <div className="h-[env(safe-area-inset-bottom)] bg-slate-900 w-full fixed bottom-0 z-[60]" />
    </div>
  );
}