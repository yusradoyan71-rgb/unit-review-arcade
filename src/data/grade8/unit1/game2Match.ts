import type { MatchRound } from '../../../types/schema';

export const GAME_2_ROUNDS: MatchRound[] = [
  // Round 1: Genres and Definitions
  {
    roundNumber: 1,
    title: 'Round 1: Musical Genres & Definitions',
    pairs: [
      { id: 'r1-p1', left: 'Classical', right: 'Orchestral music written by European composers like Mozart & Bach' },
      { id: 'r1-p2', left: 'Jazz', right: 'Genre born in New Orleans famous for brass & improvisation' },
      { id: 'r1-p3', left: 'Reggae', right: 'Jamaican style with rhythmic off-beat guitar and basslines' },
      { id: 'r1-p4', left: 'Hip-hop', right: 'Rhythmic music style featuring rhyming verses and sampled beats' },
      { id: 'r1-p5', left: 'Opera', right: 'Dramatic stage production where the entire story is sung' },
    ],
  },

  // Round 2: Instruments and Descriptions
  {
    roundNumber: 2,
    title: 'Round 2: Instruments & Descriptions',
    pairs: [
      { id: 'r2-p1', left: 'Violin', right: 'Small string instrument played tucked under the chin with a bow' },
      { id: 'r2-p2', left: 'Saxophone', right: 'Curved brass instrument with a reed mouthpiece common in jazz' },
      { id: 'r2-p3', left: 'Flute', right: 'Slender woodwind tube held sideways across the lips' },
      { id: 'r2-p4', left: 'Cello', right: 'Large string instrument rested on the floor between the knees' },
      { id: 'r2-p5', left: 'Drums', right: 'Percussion kit beaten with wooden sticks to create rhythm' },
    ],
  },

  // Round 3: Musicians and Their Roles
  {
    roundNumber: 3,
    title: 'Round 3: People in Music & Roles',
    pairs: [
      { id: 'r3-p1', left: 'Composer', right: 'The creative artist who writes original musical scores' },
      { id: 'r3-p2', left: 'Conductor', right: 'The director who guides the orchestra with a baton' },
      { id: 'r3-p3', left: 'Vocalist / Singer', right: 'The performer who delivers the song lyrics with their voice' },
      { id: 'r3-p4', left: 'Audience', right: 'The group of spectators listening and applauding the show' },
      { id: 'r3-p5', left: 'Drummer', right: 'The musician who maintains the tempo and rhythmic groove' },
    ],
  },

  // Round 4: Music Adjectives and Meanings
  {
    roundNumber: 4,
    title: 'Round 4: Describing Music & Meanings',
    pairs: [
      { id: 'r4-p1', left: 'Catchy', right: 'Memorable and easily stuck in your head' },
      { id: 'r4-p2', left: 'Upbeat', right: 'Fast-paced, cheerful, and full of positive vibes' },
      { id: 'r4-p3', left: 'Relaxing', right: 'Calm, soothing, and helping reduce stress' },
      { id: 'r4-p4', left: 'Repetitive', right: 'Repeating the same chords or words over and over' },
      { id: 'r4-p5', left: 'Meaningful', right: 'Having deep significance and thoughtful lyrics' },
    ],
  },

  // Round 5: Music Expressions and Definitions
  {
    roundNumber: 5,
    title: 'Round 5: Preference & Opinion Expressions',
    pairs: [
      { id: 'r5-p1', left: "I'm really into...", right: 'I am deeply enthusiastic and interested in...' },
      { id: 'r5-p2', left: "I can't stand...", right: 'I strongly dislike and cannot tolerate...' },
      { id: 'r5-p3', left: 'I would rather...', right: 'I give preference to one choice over another' },
      { id: 'r5-p4', left: 'In my opinion...', right: 'From my personal viewpoint or judgment...' },
      { id: 'r5-p5', left: "I'm not keen on...", right: "I don't particularly enjoy or find interest in..." },
    ],
  },

  // Round 6: Music-Related Collocations
  {
    roundNumber: 6,
    title: 'Round 6: Common Music Collocations',
    pairs: [
      { id: 'r6-p1', left: 'Give a...', right: 'live performance on stage' },
      { id: 'r6-p2', left: 'Sing the...', right: 'chorus together with the crowd' },
      { id: 'r6-p3', left: 'Release a...', right: 'new hit album globally' },
      { id: 'r6-p4', left: 'Play an...', right: 'acoustic or electric instrument' },
      { id: 'r6-p5', left: 'Read the...', right: 'lyrics printed in the album booklet' },
    ],
  },
];
