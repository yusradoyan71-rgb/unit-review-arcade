import type { MatchRound } from '../../../types/schema';

export const GAME_2_ROUNDS: MatchRound[] = [
  // Round 1: Places and Definitions
  {
    roundNumber: 1,
    title: 'Round 1: Places in a Town & Definitions',
    pairs: [
      { id: 'u3-r1-p1', left: 'Museum', right: 'A building displaying historic, artistic, or scientific objects' },
      { id: 'u3-r1-p2', left: 'Art gallery', right: 'A room or building where paintings and sculptures are shown' },
      { id: 'u3-r1-p3', left: 'Square', right: 'An open public area in a town surrounded by buildings' },
      { id: 'u3-r1-p4', left: 'Bridge', right: 'A structure over a river or road for people and cars' },
      { id: 'u3-r1-p5', left: 'Street market', right: 'An outdoor area with stalls selling food, clothes, and crafts' },
    ],
  },

  // Round 2: London Places and Descriptions
  {
    roundNumber: 2,
    title: 'Round 2: London Landmarks & Descriptions',
    pairs: [
      { id: 'u3-r2-p1', left: 'The Tube', right: 'The famous London Underground electric railway system' },
      { id: 'u3-r2-p2', left: 'Big Ben', right: 'The iconic clock tower at the Houses of Parliament' },
      { id: 'u3-r2-p3', left: 'Hyde Park', right: 'A huge, green royal park in central London with a lake' },
      { id: 'u3-r2-p4', left: 'Oxford Street', right: 'A busy shopping street with hundreds of fashion stores' },
      { id: 'u3-r2-p5', left: 'River Thames', right: 'The famous river that flows through the heart of London' },
    ],
  },

  // Round 3: City Adjectives and Meanings
  {
    roundNumber: 3,
    title: 'Round 3: City Adjectives & Meanings',
    pairs: [
      { id: 'u3-r3-p1', left: 'Crowded', right: 'Full of a very large number of people' },
      { id: 'u3-r3-p2', left: 'Historic', right: 'Important because it existed or happened in the past' },
      { id: 'u3-r3-p3', left: 'Peaceful', right: 'Calm, quiet, and free from noise or disturbance' },
      { id: 'u3-r3-p4', left: 'Expensive', right: 'Costing a large amount of money' },
      { id: 'u3-r3-p5', left: 'Modern', right: 'Designed with the newest styles, ideas, or technology' },
    ],
  },

  // Round 4: Activities and Locations
  {
    roundNumber: 4,
    title: 'Round 4: City Activities & Locations',
    pairs: [
      { id: 'u3-r4-p1', left: 'Watch a stage play or musical', right: 'At a West End theatre' },
      { id: 'u3-r4-p2', left: 'Have a sunny picnic on the grass', right: 'In a public royal park' },
      { id: 'u3-r4-p3', left: 'Catch an express train to another city', right: 'At a central railway station' },
      { id: 'u3-r4-p4', left: 'Buy vintage clothes and street food', right: 'At an outdoor street market' },
      { id: 'u3-r4-p5', left: 'See famous oil paintings and art', right: 'In a national art gallery' },
    ],
  },

  // Round 5: Train Station Expressions
  {
    roundNumber: 5,
    title: 'Round 5: Train Station Expressions & Meanings',
    pairs: [
      { id: 'u3-r5-p1', left: 'Single ticket', right: 'A ticket for a one-way journey to a destination' },
      { id: 'u3-r5-p2', left: 'Return ticket', right: 'A ticket for travelling to a place and coming back' },
      { id: 'u3-r5-p3', left: 'Platform', right: 'The raised walkway where passengers board trains' },
      { id: 'u3-r5-p4', left: 'Fare', right: 'The price you pay for travelling on a train or bus' },
      { id: 'u3-r5-p5', left: 'Timetable', right: 'A schedule showing train departure and arrival times' },
    ],
  },

  // Round 6: Suggestions and Responses
  {
    roundNumber: 6,
    title: 'Round 6: Suggestions & Natural Responses',
    pairs: [
      { id: 'u3-r6-p1', left: "Let's visit the British Museum.", right: "That's a great idea! I love ancient history." },
      { id: 'u3-r6-p2', left: 'How about going shopping on Oxford Street?', right: "I'd rather not. It's too crowded on Saturdays." },
      { id: 'u3-r6-p3', left: "Why don't we have a picnic in the park?", right: "That sounds wonderful! Let's buy some sandwiches." },
      { id: 'u3-r6-p4', left: 'What about taking an open-top bus tour?', right: "Yes, let's do that! The views will be fantastic." },
      { id: 'u3-r6-p5', left: 'I suggest we take the underground train.', right: "Good idea! It's much faster than walking in the rain." },
    ],
  },
];
