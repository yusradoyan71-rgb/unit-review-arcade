import type { MatchRound } from '../../../types/schema';

export const GAME_2_ROUNDS: MatchRound[] = [
  // Round 1: Genres and Definitions
  {
    roundNumber: 1,
    title: 'Round 1: Musical Genres & Definitions',
    pairs: [
      { id: 'r1-p1', left: 'Classical', right: 'Music by composers like Mozart' },
      { id: 'r1-p2', left: 'Jazz', right: 'Brass instruments and improvisation' },
      { id: 'r1-p3', left: 'Reggae', right: 'Relaxed Jamaican bouncy beat' },
      { id: 'r1-p4', left: 'Hip-hop', right: 'Fast rhyming words over beats' },
      { id: 'r1-p5', left: 'Opera', right: 'Theatrical story told through singing' },
    ],
  },

  // Round 2: Instruments and Descriptions
  {
    roundNumber: 2,
    title: 'Round 2: Instruments & Descriptions',
    pairs: [
      { id: 'r2-p1', left: 'Guitar', right: 'Six-string instrument to strum' },
      { id: 'r2-p2', left: 'Piano', right: 'Black and white keys to press' },
      { id: 'r2-p3', left: 'Drums', right: 'Sticks to hit a steady beat' },
      { id: 'r2-p4', left: 'Violin', right: 'Played with a bow under chin' },
      { id: 'r2-p5', left: 'Flute', right: 'Silver wind instrument held sideways' },
    ],
  },

  // Round 3: Musicians and Their Roles
  {
    roundNumber: 3,
    title: 'Round 3: People in Music & Roles',
    pairs: [
      { id: 'r3-p1', left: 'Composer', right: 'A person who writes original music' },
      { id: 'r3-p2', left: 'Conductor', right: 'Directs an orchestra with baton' },
      { id: 'r3-p3', left: 'Singer', right: 'Sings songs with voice' },
      { id: 'r3-p4', left: 'Audience', right: 'People watching a live performance' },
      { id: 'r3-p5', left: 'Drummer', right: 'Plays drums and keeps tempo' },
    ],
  },

  // Round 4: Music Adjectives and Meanings
  {
    roundNumber: 4,
    title: 'Round 4: Describing Music & Meanings',
    pairs: [
      { id: 'r4-p1', left: 'Catchy', right: 'Easy to remember' },
      { id: 'r4-p2', left: 'Upbeat', right: 'Fast, cheerful, and full of energy' },
      { id: 'r4-p3', left: 'Relaxing', right: 'Making you feel calm' },
      { id: 'r4-p4', left: 'Repetitive', right: 'Repeating sounds again and again' },
      { id: 'r4-p5', left: 'Meaningful', right: 'Having a deep and thoughtful message' },
    ],
  },

  // Round 5: Music Expressions and Definitions
  {
    roundNumber: 5,
    title: 'Round 5: Preference & Opinion Expressions',
    pairs: [
      { id: 'r5-p1', left: "I'm really into...", right: 'I really enjoy doing this' },
      { id: 'r5-p2', left: "I can't stand...", right: 'I strongly dislike this' },
      { id: 'r5-p3', left: 'I would rather...', right: 'I prefer this choice' },
      { id: 'r5-p4', left: 'In my opinion...', right: 'This is what I personally think' },
      { id: 'r5-p5', left: "I'm not keen on...", right: "I don't really like this" },
    ],
  },

  // Round 6: Music-Related Collocations
  {
    roundNumber: 6,
    title: 'Round 6: Common Music Collocations',
    pairs: [
      { id: 'r6-p1', left: 'Give a...', right: 'live concert on stage' },
      { id: 'r6-p2', left: 'Sing the...', right: 'catchy chorus together with friends' },
      { id: 'r6-p3', left: 'Release a...', right: 'new music album' },
      { id: 'r6-p4', left: 'Play an...', right: 'instrument like the guitar or piano' },
      { id: 'r6-p5', left: 'Listen to the...', right: 'words and lyrics of the song' },
    ],
  },
];
