import { Track } from './types';

// Using consistent placeholders for demo purposes. 
// In a real app, these would come from a backend or local filesystem.
export const SAMPLE_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'Synthwave Boy',
    coverUrl: 'https://picsum.photos/id/10/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    genre: 'Electronic'
  },
  {
    id: '2',
    title: 'Midnight Rain',
    artist: 'Lofi Chill',
    coverUrl: 'https://picsum.photos/id/11/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    genre: 'Lofi'
  },
  {
    id: '3',
    title: 'Urban Jungle',
    artist: 'The Beats',
    coverUrl: 'https://picsum.photos/id/12/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 350,
    genre: 'Hip Hop'
  },
  {
    id: '4',
    title: 'Acoustic Soul',
    artist: 'Jane Doe',
    coverUrl: 'https://picsum.photos/id/13/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 312,
    genre: 'Acoustic'
  },
  {
    id: '5',
    title: 'Techno Dreams',
    artist: 'Rave Master',
    coverUrl: 'https://picsum.photos/id/14/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 290,
    genre: 'Techno'
  }
];

export const MOCK_GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Lofi', 'Hip Hop'];
