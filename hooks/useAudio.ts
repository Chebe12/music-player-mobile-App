import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, PlaybackState } from '../types';

export const useAudio = (initialTracks: Track[]) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // State for UI rendering
  const [state, setState] = useState<PlaybackState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isShuffle: false,
    isRepeat: false,
    queue: initialTracks,
  });

  // Refs for internal logic to avoid stale closures in event listeners
  const stateRef = useRef(state);
  
  // Sync ref with state whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Helper to safely play a specific track
  const playTrackInternal = useCallback((track: Track) => {
    if (!audioRef.current) return;

    // If it's a new track, load it
    if (stateRef.current.currentTrack?.id !== track.id) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      setState(prev => ({ ...prev, currentTrack: track, currentTime: 0 }));
    }

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setState(prev => ({ ...prev, isPlaying: true })))
        .catch(error => console.error("Playback error:", error));
    }
  }, []);

  // Next Track Logic
  const next = useCallback(() => {
    const { queue, currentTrack, isShuffle, isRepeat } = stateRef.current;
    
    if (queue.length === 0) return;

    // If we are repeating the ONE track (and not shuffle), just replay it? 
    // Usually 'Repeat' toggles between Repeat All / Repeat One / Off. 
    // For simplicity here: Repeat = Repeat List loop.
    
    let nextIndex = 0;
    
    if (currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      
      if (isShuffle) {
        // Simple random for now
        let randomIndex = Math.floor(Math.random() * queue.length);
        // Try not to pick the exact same song unless it's the only one
        if (queue.length > 1 && randomIndex === currentIndex) {
          randomIndex = (randomIndex + 1) % queue.length;
        }
        nextIndex = randomIndex;
      } else {
        nextIndex = currentIndex + 1;
        // Loop back to start if at end
        if (nextIndex >= queue.length) {
          if (isRepeat) {
            nextIndex = 0;
          } else {
            // End of playlist, stop
            setState(prev => ({ ...prev, isPlaying: false }));
            return;
          }
        }
      }
    }
    
    const nextTrack = queue[nextIndex];
    playTrackInternal(nextTrack);
  }, [playTrackInternal]);

  // Prev Track Logic
  const prev = useCallback(() => {
    const { queue, currentTrack, currentTime } = stateRef.current;
    
    // If playing for more than 3 seconds, restart song
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (queue.length === 0 || !currentTrack) return;

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // Loop to end
    }
    
    playTrackInternal(queue[prevIndex]);
  }, [playTrackInternal]);

  // Initialization
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      // Logic for what happens when song ends
      next();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [next]); // 'next' is stable because it uses refs

  // Public Controls
  const controls = {
    play: (track?: Track) => {
      if (track) {
        playTrackInternal(track);
      } else {
        if (state.currentTrack && audioRef.current) {
          audioRef.current.play()
            .then(() => setState(prev => ({ ...prev, isPlaying: true })))
            .catch(e => console.error("Resume error", e));
        } else if (state.queue.length > 0) {
          playTrackInternal(state.queue[0]);
        }
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    },
    next,
    prev,
    seek: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setState(prev => ({ ...prev, currentTime: time }));
      }
    },
    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        setState(prev => ({ ...prev, volume }));
      }
    },
    toggleShuffle: () => setState(prev => ({ ...prev, isShuffle: !prev.isShuffle })),
    toggleRepeat: () => setState(prev => ({ ...prev, isRepeat: !prev.isRepeat })),
    reorderQueue: (newQueue: Track[]) => setState(prev => ({ ...prev, queue: newQueue })),
  };

  return { state, controls };
};