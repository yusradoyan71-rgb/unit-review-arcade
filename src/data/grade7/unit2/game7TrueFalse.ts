import type { TrueFalseQuestion } from '../../../types/schema';

export const GAME_7_STATEMENTS: TrueFalseQuestion[] = [
  // 1. Natural Disasters: Tsunamis
  {
    id: 'g7-u2-tf01',
    prompt: 'A tsunami is a giant oceanic wave usually triggered by an underwater earthquake or volcanic eruption.',
    isTrue: true,
    explanation: 'True. Undersea tectonic shifts displace massive columns of water, creating dangerous tsunami waves.',
    difficulty: 'easy',
  },

  // 2. Natural Disasters: Tornadoes vs Avalanches
  {
    id: 'g7-u2-tf02',
    prompt: 'An avalanche is a rotating column of wind that touches down on dry desert plains.',
    isTrue: false,
    explanation: 'False. That describes a tornado or dust devil. An avalanche is a rapid slide of snow and ice down a mountain.',
    difficulty: 'easy',
  },

  // 3. Wildlife: Sun Bears
  {
    id: 'g7-u2-tf03',
    prompt: 'Sun bears are the largest bear species on Earth, growing heavier than polar bears.',
    isTrue: false,
    explanation: 'False. Sun bears are actually the smallest bear species in the world, weighing only 25 to 65 kg.',
    difficulty: 'easy',
  },

  // 4. Wildlife: Pangolins
  {
    id: 'g7-u2-tf04',
    prompt: 'Pangolins are covered in large, protective scales made of keratin, the same substance as human fingernails.',
    isTrue: true,
    explanation: 'True. Pangolin scales are made of keratin and protect them from predators in the wild.',
    difficulty: 'medium',
  },

  // 5. Grammar: Past Simple vs Continuous
  {
    id: 'g7-u2-tf05',
    prompt: 'In the sentence "While we were sleeping, the earthquake struck", "were sleeping" describes the background action in progress.',
    isTrue: true,
    explanation: 'True. The continuous past action ("were sleeping") was interrupted by the sudden earthquake strike.',
    difficulty: 'easy',
  },

  // 6. Grammar: Past Perfect Function
  {
    id: 'g7-u2-tf06',
    prompt: 'The Past Perfect tense ("had + past participle") describes an action that happened AFTER another past action.',
    isTrue: false,
    explanation: 'False. Past Perfect describes an action that was completed BEFORE another action in the past.',
    difficulty: 'medium',
  },

  // 7. Grammar: Used to vs Would for States
  {
    id: 'g7-u2-tf07',
    prompt: 'In English, we can use "would" to describe past states such as "When I was young, I would live near the forest".',
    isTrue: false,
    explanation: 'False. "Would" is only used for repeated past actions, not past states. We must say "I used to live...".',
    difficulty: 'challenging',
  },

  // 8. Grammar: Be Used To
  {
    id: 'g7-u2-tf08',
    prompt: 'The structure "be used to + verb-ing" means you are accustomed to or familiar with something.',
    isTrue: true,
    explanation: 'True. For example: "She is used to working in high temperatures" means it is normal for her.',
    difficulty: 'medium',
  },

  // 9. Conservation: Deforestation
  {
    id: 'g7-u2-tf09',
    prompt: 'Deforestation helps increase wild tiger populations by providing more open space for farming.',
    isTrue: false,
    explanation: 'False. Deforestation destroys tiger habitats and wipes out the prey animals they need to survive.',
    difficulty: 'easy',
  },

  // 10. Conservation: Poaching
  {
    id: 'g7-u2-tf10',
    prompt: 'Poaching refers to the legal, licensed observation of birds in nature sanctuaries.',
    isTrue: false,
    explanation: 'False. Poaching is the illegal hunting, trapping, or killing of protected wildlife.',
    difficulty: 'easy',
  },

  // 11. Safety: Earthquake Procedure
  {
    id: 'g7-u2-tf11',
    prompt: 'During an indoor earthquake, running into an elevator is the safest way to exit the building quickly.',
    isTrue: false,
    explanation: 'False. Never use elevators during an earthquake; power failures can trap you between floors.',
    difficulty: 'easy',
  },

  // 12. Safety: Floodwater Driving
  {
    id: 'g7-u2-tf12',
    prompt: 'Driving a motor vehicle across a flooded bridge is dangerous because even shallow moving water can sweep cars away.',
    isTrue: true,
    explanation: 'True. Just 30–60 cm of fast-moving floodwater can float and wash away most automobiles.',
    difficulty: 'easy',
  },

  // 13. Emergency Calls: Number in Turkey
  {
    id: 'g7-u2-tf13',
    prompt: 'In Turkey, dialling 112 connects callers to police, medical ambulance, and fire rescue services.',
    isTrue: true,
    explanation: 'True. 112 is Turkey\'s unified national emergency telephone dispatch number.',
    difficulty: 'easy',
  },

  // 14. Irregular Verbs: Shake
  {
    id: 'g7-u2-tf14',
    prompt: 'The past simple form of the irregular verb "shake" is "shaked".',
    isTrue: false,
    explanation: 'False. The past simple of "shake" is "shook" (shake – shook – shaken).',
    difficulty: 'easy',
  },

  // 15. Irregular Verbs: Strike
  {
    id: 'g7-u2-tf15',
    prompt: 'The past simple form of the verb "strike" is "struck".',
    isTrue: true,
    explanation: 'True. The verb conjugates: strike – struck – struck (e.g., "The lightning struck the tree").',
    difficulty: 'easy',
  },

  // 16. Extreme Weather: Lightning
  {
    id: 'g7-u2-tf16',
    prompt: 'Standing directly beneath a solitary tall tree in an open meadow during a thunderstorm increases your risk of a lightning strike.',
    isTrue: true,
    explanation: 'True. Lightning strikes the tallest objects in an area; tall trees are frequent strike targets.',
    difficulty: 'easy',
  },

  // 17. Vocabulary: Extinction
  {
    id: 'g7-u2-tf17',
    prompt: 'An extinct species can easily be recreated in a pet store within a few months.',
    isTrue: false,
    explanation: 'False. Extinction is permanent and irreversible.',
    difficulty: 'easy',
  },

  // 18. Conservation: CITES
  {
    id: 'g7-u2-tf18',
    prompt: 'International trade agreements like CITES make it illegal to buy and sell endangered rhino horns across national borders.',
    isTrue: true,
    explanation: 'True. CITES strictly prohibits commercial international trade in critically endangered rhino horns.',
    difficulty: 'medium',
  },

  // 19. Animals and Disasters: Sixth Sense
  {
    id: 'g7-u2-tf19',
    prompt: 'Scientists have proved with 100% certainty that all wild animals can accurately predict earthquakes weeks in advance.',
    isTrue: false,
    explanation: 'False. While unusual behaviors have been observed, science has not established that animals can reliably predict earthquakes.',
    difficulty: 'medium',
  },

  // 20. Adverbs of Place: Inland
  {
    id: 'g7-u2-tf20',
    prompt: '"Inland" means travelling further out into the deep ocean waters on a ship.',
    isTrue: false,
    explanation: 'False. "Inland" means towards the interior of the land, away from the coast or sea.',
    difficulty: 'easy',
  },

  // 21. Synonyms: Crucial
  {
    id: 'g7-u2-tf21',
    prompt: 'The words "crucial" and "essential" have very similar meanings related to things that are extremely important.',
    isTrue: true,
    explanation: 'True. Both "crucial" and "essential" mean vital or of supreme importance.',
    difficulty: 'easy',
  },

  // 22. Extreme Weather: Heatwave
  {
    id: 'g7-u2-tf22',
    prompt: 'During a severe heatwave, health experts recommend drinking plenty of water and avoiding strenuous outdoor exercise in midday sun.',
    isTrue: true,
    explanation: 'True. Hydration and shade prevent heat exhaustion and heatstroke.',
    difficulty: 'easy',
  },

  // 23. Disaster Verbs: Evacuate
  {
    id: 'g7-u2-tf23',
    prompt: '"To evacuate" means to invite tourists into a danger zone to take photographs.',
    isTrue: false,
    explanation: 'False. "To evacuate" means moving people away from a hazardous area to safety.',
    difficulty: 'easy',
  },

  // 24. Wildlife: Habitat
  {
    id: 'g7-u2-tf24',
    prompt: 'A natural habitat provides an animal with food, water, shelter, and suitable conditions to reproduce.',
    isTrue: true,
    explanation: 'True. A habitat meets all essential ecological needs for a species to thrive in the wild.',
    difficulty: 'easy',
  },

  // 25. Grammar: Used to Negative
  {
    id: 'g7-u2-tf25',
    prompt: 'The grammatically standard negative form of "used to" is "did not use to" + base verb.',
    isTrue: true,
    explanation: 'True. In standard English: "He did not use to live in the city".',
    difficulty: 'medium',
  },
];
