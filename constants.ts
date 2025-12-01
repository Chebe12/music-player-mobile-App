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
    genre: 'Electronic',
    downloaded: true,
    lyrics: "Driving down the highway, lights are flashing by\nNeon colors painting up the midnight sky\nThe engine hums a melody, a synthetic beat\nChasing down the future on this concrete street\n\n(Chorus)\nNeon Horizon, calling out my name\nIn this digital world, it's never quite the same\nLost in the static, found in the glow\nWhere the data rivers and the currents flow\n\nRetro visor showing where I used to be\nBut the windshield's open to infinity\nSynthwave pulses in my heart and in my soul\nControl is an illusion, gotta let it roll"
  },
  {
    id: '2',
    title: 'Midnight Rain',
    artist: 'Lofi Chill',
    coverUrl: 'https://picsum.photos/id/11/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    genre: 'Lofi',
    downloaded: true,
    lyrics: "Raindrops tapping on the window pane\nCoffee in my mug, washing away the pain\nStudy lights are low, the city's fast asleep\nSecrets of the night are ones we always keep\n\n(Chorus)\nMidnight rain, falling soft and slow\nWhere the time goes, I don't really know\nJust a loop of comfort, a beat to calm the mind\nLeaving all the worries of the day behind\n\nPage after page, the story starts to unfold\nIn this quiet room, away from the cold"
  },
  {
    id: '3',
    title: 'Urban Jungle',
    artist: 'The Beats',
    coverUrl: 'https://picsum.photos/id/12/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 350,
    genre: 'Hip Hop',
    downloaded: true,
    lyrics: "Concrete jungle where dreams are made of\nSteps on the pavement, push comes to shove\nSubway graffiti telling stories of the youth\nSearching for the meaning, searching for the truth\n\nYeah, we rise up, yeah we never fall\nStanding back to back, walking tall\nThe rhythm of the city is the beat inside our chest\nPut us to the challenge, put us to the test"
  },
  {
    id: '4',
    title: 'Acoustic Soul',
    artist: 'Jane Doe',
    coverUrl: 'https://picsum.photos/id/13/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 312,
    genre: 'Acoustic',
    downloaded: true,
    lyrics: "Just an old guitar and a wooden floor\nDon't need nothing else, don't need nothing more\nStrumming chords that echo through the empty hall\nCatching memories before they start to fall\n\n(Chorus)\nSimple things are what make us feel alive\nJust a melody to help us survive\nSing it loud, sing it soft and low\nLet the acoustic river flow"
  },
  {
    id: '5',
    title: 'Techno Dreams',
    artist: 'Rave Master',
    coverUrl: 'https://picsum.photos/id/14/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 290,
    genre: 'Techno',
    downloaded: true,
    lyrics: "[Instrumental Build Up]\n\nBass kick.\n\nSystem online.\n\n(Beat Drop)\n\nCan you feel the energy?\nFlowing through the wires\nElectric desires\nHigher and higher\n\n[Synthesizer Solo]"
  }
];

export const MOCK_GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Lofi', 'Hip Hop'];