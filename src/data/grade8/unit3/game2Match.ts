import type { MatchRound } from '../../../types/schema';

export const GAME_2_ROUNDS: MatchRound[] = [
  // Round 1: Places and Definitions
  {
    roundNumber: 1,
    title: 'Round 1: Places in a Town & Definitions',
    pairs: [
      { id: 'u3-r1-p1', left: 'Museum', right: 'Exhibits of historic objects' },
      { id: 'u3-r1-p2', left: 'Art gallery', right: 'Exhibiting paintings and art' },
      { id: 'u3-r1-p3', left: 'Square', right: 'Open public city plaza' },
      { id: 'u3-r1-p4', left: 'Bridge', right: 'Crossing over a river' },
      { id: 'u3-r1-p5', left: 'Street market', right: 'Outdoor stalls selling goods' },
    ],
  },

  // Round 2: London Places and Descriptions
  {
    roundNumber: 2,
    title: 'Round 2: London Landmarks & Descriptions',
    pairs: [
      { id: 'u3-r2-p1', left: 'The Tube', right: 'London underground railway' },
      { id: 'u3-r2-p2', left: 'Big Ben', right: 'Iconic London clock tower' },
      { id: 'u3-r2-p3', left: 'Hyde Park', right: 'Large royal park with a lake' },
      { id: 'u3-r2-p4', left: 'Oxford Street', right: 'Busy shopping street' },
      { id: 'u3-r2-p5', left: 'River Thames', right: 'River flowing through London' },
    ],
  },

  // Round 3: City Adjectives and Meanings
  {
    roundNumber: 3,
    title: 'Round 3: City Adjectives & Meanings',
    pairs: [
      { id: 'u3-r3-p1', left: 'Crowded', right: 'Full of many people' },
      { id: 'u3-r3-p2', left: 'Historic', right: 'Important from the past' },
      { id: 'u3-r3-p3', left: 'Peaceful', right: 'Calm and quiet' },
      { id: 'u3-r3-p4', left: 'Expensive', right: 'Costing a lot of money' },
      { id: 'u3-r3-p5', left: 'Modern', right: 'New and up-to-date' },
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
      { id: 'u3-r5-p1', left: 'Single ticket', right: 'One-way journey ticket' },
      { id: 'u3-r5-p2', left: 'Return ticket', right: 'Ticket going and returning' },
      { id: 'u3-r5-p3', left: 'Platform', right: 'Where passengers board trains' },
      { id: 'u3-r5-p4', left: 'Fare', right: 'Price of train or bus' },
      { id: 'u3-r5-p5', left: 'Timetable', right: 'Schedule of departure times' },
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
