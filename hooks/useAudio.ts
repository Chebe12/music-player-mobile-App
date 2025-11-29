import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, PlaybackState, PlaybackControls } from '../types';

export const useAudio = (initialTracks: Track[]) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackList, setTrackList] = useState<Track[]>(initialTracks);
  
  const [state, setState] = useState<PlaybackState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isShuffle: false,
    isRepeat: false,
  });

  // Initialize audio object once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setState(prev => ({ ...prev, currentTime: audioRef.current?.currentTime || 0 }));
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setState(prev => ({ ...prev, duration: audioRef.current?.duration || 0 }));
      }
    };

    const handleEnded = () => {
      // Auto-play next track logic could go here
      next(); 
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const play = useCallback((track?: Track) => {
    if (!audioRef.current) return;

    if (track) {
      if (state.currentTrack?.id !== track.id) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
        setState(prev => ({ ...prev, currentTrack: track }));
      }
      audioRef.current.play()
        .then(() => setState(prev => ({ ...prev, isPlaying: true })))
        .catch(e => console.error("Playback failed", e));
    } else {
      if (audioRef.current.src) {
        audioRef.current.play()
          .then(() => setState(prev => ({ ...prev, isPlaying: true })))
          .catch(e => console.error("Resume failed", e));
      } else if (trackList.length > 0) {
        play(trackList[0]);
      }
    }
  }, [state.currentTrack, trackList]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState(prev => ({ ...prev, volume }));
    }
  }, []);

  const next = useCallback(() => {
    if (!state.currentTrack || trackList.length === 0) return;
    
    let nextIndex: number;
    const currentIndex = trackList.findIndex(t => t.id === state.currentTrack?.id);

    if (state.isShuffle) {
      nextIndex = Math.floor(Math.random() * trackList.length);
    } else {
      nextIndex = (currentIndex + 1) % trackList.length;
    }
    
    play(trackList[nextIndex]);
  }, [state.currentTrack, state.isShuffle, trackList, play]);

  const prev = useCallback(() => {
    if (!state.currentTrack || trackList.length === 0) return;
    
    const currentIndex = trackList.findIndex(t => t.id === state.currentTrack?.id);
    // If we are more than 3 seconds in, just restart current song
    if (state.currentTime > 3) {
      seek(0);
      return;
    }

    let prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    play(trackList[prevIndex]);
  }, [state.currentTrack, state.currentTime, trackList, play, seek]);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, isShuffle: !prev.isShuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({ ...prev, isRepeat: !prev.isRepeat }));
    // Note: implementation of repeat-one logic would handle 'ended' event differently
  }, []);

  return {
    state,
    controls: { play, pause, next, prev, seek, setVolume, toggleShuffle, toggleRepeat }
  };
};