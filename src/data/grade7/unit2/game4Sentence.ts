import type { SentenceBuilderQuestion } from '../../../types/schema';

export const GAME_4_SENTENCES: SentenceBuilderQuestion[] = [
  // 1. Past Simple Narrative Event
  {
    id: 'g7-u2-s01',
    prompt: 'Describing an emergency rescue yesterday:',
    correctSentence: 'The firefighters rescued the family from the burning house.',
    scrambledWords: ['The', 'firefighters', 'rescued', 'the', 'family', 'from', 'the', 'burning', 'house'],
    acceptedAnswers: [
      'The firefighters rescued the family from the burning house.',
      'From the burning house the firefighters rescued the family.',
    ],
    explanation: 'Standard narrative sentence: Subject (The firefighters) + verb (rescued) + object (the family) + prepositional phrase.',
    difficulty: 'easy',
  },

  // 2. Interrupted Past Action with When
  {
    id: 'g7-u2-s02',
    prompt: 'Describing an interrupted action during an earthquake:',
    correctSentence: 'We were eating dinner when the earthquake struck.',
    scrambledWords: ['We', 'were', 'eating', 'dinner', 'when', 'the', 'earthquake', 'struck'],
    acceptedAnswers: [
      'We were eating dinner when the earthquake struck.',
      'When the earthquake struck we were eating dinner.',
    ],
    explanation: 'A time clause beginning with "when" can appear at the start or end of the sentence.',
    difficulty: 'easy',
  },

  // 3. Past Continuous with While
  {
    id: 'g7-u2-s03',
    prompt: 'Describing what happened while someone was hiking:',
    correctSentence: 'While they were hiking in the mountains it began to snow.',
    scrambledWords: ['While', 'they', 'were', 'hiking', 'in', 'the', 'mountains', 'it', 'began', 'to', 'snow'],
    acceptedAnswers: [
      'While they were hiking in the mountains it began to snow.',
      'It began to snow while they were hiking in the mountains.',
    ],
    explanation: 'A subordinate clause introduced by "while" can comfortably begin or end the sentence.',
    difficulty: 'easy',
  },

  // 4. Past Perfect with Before
  {
    id: 'g7-u2-s04',
    prompt: 'Describing an animal escape before a storm:',
    correctSentence: 'The animals had escaped before the storm arrived.',
    scrambledWords: ['The', 'animals', 'had', 'escaped', 'before', 'the', 'storm', 'arrived'],
    acceptedAnswers: [
      'The animals had escaped before the storm arrived.',
      'Before the storm arrived the animals had escaped.',
    ],
    explanation: 'Past Perfect ("had escaped") marks the earlier action; the "before" clause can lead or follow.',
    difficulty: 'medium',
  },

  // 5. Past Perfect with By the time
  {
    id: 'g7-u2-s05',
    prompt: 'Describing a village evacuation:',
    correctSentence: 'By the time rescuers arrived the villagers had already left.',
    scrambledWords: ['By', 'the', 'time', 'rescuers', 'arrived', 'the', 'villagers', 'had', 'already', 'left'],
    acceptedAnswers: [
      'By the time rescuers arrived the villagers had already left.',
      'The villagers had already left by the time rescuers arrived.',
    ],
    explanation: '"By the time" introduces the reference point in the past, with the earlier action in Past Perfect.',
    difficulty: 'medium',
  },

  // 6. Used to for Past Habit
  {
    id: 'g7-u2-s06',
    prompt: 'Describing an explorer’s past routine:',
    correctSentence: 'He used to live near the deep rainforest.',
    scrambledWords: ['He', 'used', 'to', 'live', 'near', 'the', 'deep', 'rainforest'],
    acceptedAnswers: [
      'He used to live near the deep rainforest.',
      'Near the deep rainforest he used to live.',
    ],
    explanation: '"Used to + base verb" expresses a past state or habit that is no longer true.',
    difficulty: 'easy',
  },

  // 7. Would for Repeated Past Action
  {
    id: 'g7-u2-s07',
    prompt: 'Describing repeated actions in youth:',
    correctSentence: 'When he was young he would explore the forest.',
    scrambledWords: ['When', 'he', 'was', 'young', 'he', 'would', 'explore', 'the', 'forest'],
    acceptedAnswers: [
      'When he was young he would explore the forest.',
      'He would explore the forest when he was young.',
    ],
    explanation: '"Would + base verb" describes repeated past actions or routines in narrative contexts.',
    difficulty: 'medium',
  },

  // 8. Be Used to + Verb-ing
  {
    id: 'g7-u2-s08',
    prompt: 'Describing someone accustomed to tough work:',
    correctSentence: 'She is used to working with dangerous wild animals.',
    scrambledWords: ['She', 'is', 'used', 'to', 'working', 'with', 'dangerous', 'wild', 'animals'],
    acceptedAnswers: [
      'She is used to working with dangerous wild animals.',
      'With dangerous wild animals she is used to working.',
    ],
    explanation: '"Be used to + -ing" means being familiar with or accustomed to something.',
    difficulty: 'medium',
  },

  // 9. Negative Be Used to in the Past
  {
    id: 'g7-u2-s09',
    prompt: 'Expressing lack of familiarity in the past:',
    correctSentence: 'He was not used to getting up early for patrol.',
    scrambledWords: ['He', 'was', 'not', 'used', 'to', 'getting', 'up', 'early', 'for', 'patrol'],
    acceptedAnswers: [
      'He was not used to getting up early for patrol.',
      'For patrol he was not used to getting up early.',
    ],
    explanation: '"Was not used to + -ing" expresses past unfamiliarity.',
    difficulty: 'medium',
  },

  // 10. Tsunami Warning Action
  {
    id: 'g7-u2-s10',
    prompt: 'Describing an immediate evacuation after a tsunami warning:',
    correctSentence: 'The coastal residents evacuated uphill as soon as the siren sounded.',
    scrambledWords: ['The', 'coastal', 'residents', 'evacuated', 'uphill', 'as', 'soon', 'as', 'the', 'siren', 'sounded'],
    acceptedAnswers: [
      'The coastal residents evacuated uphill as soon as the siren sounded.',
      'As soon as the siren sounded the coastal residents evacuated uphill.',
    ],
    explanation: '"As soon as..." introduces an immediate sequential time clause.',
    difficulty: 'medium',
  },

  // 11. Forest Fire Spread
  {
    id: 'g7-u2-s11',
    prompt: 'Describing how wind spread a forest fire:',
    correctSentence: 'Strong dry winds spread the forest fire across the dry valley.',
    scrambledWords: ['Strong', 'dry', 'winds', 'spread', 'the', 'forest', 'fire', 'across', 'the', 'dry', 'valley'],
    acceptedAnswers: [
      'Strong dry winds spread the forest fire across the dry valley.',
      'Across the dry valley strong dry winds spread the forest fire.',
    ],
    explanation: '"Spread" is the past simple form (spread – spread – spread).',
    difficulty: 'medium',
  },

  // 12. Wildlife Conservation Center
  {
    id: 'g7-u2-s12',
    prompt: 'Explaining the mission of a conservation centre:',
    correctSentence: 'The conservation centre rescues injured sun bears from illegal cages.',
    scrambledWords: ['The', 'conservation', 'centre', 'rescues', 'injured', 'sun', 'bears', 'from', 'illegal', 'cages'],
    acceptedAnswers: [
      'The conservation centre rescues injured sun bears from illegal cages.',
      'From illegal cages the conservation centre rescues injured sun bears.',
    ],
    explanation: 'Present simple describing the institutional role of the rescue sanctuary.',
    difficulty: 'easy',
  },

  // 13. Time Connective: Suddenly
  {
    id: 'g7-u2-s13',
    prompt: 'Describing an unexpected lightning strike:',
    correctSentence: 'Suddenly a bolt of bright lightning struck the tall pine tree.',
    scrambledWords: ['Suddenly', 'a', 'bolt', 'of', 'bright', 'lightning', 'struck', 'the', 'tall', 'pine', 'tree'],
    acceptedAnswers: [
      'Suddenly a bolt of bright lightning struck the tall pine tree.',
      'A bolt of bright lightning suddenly struck the tall pine tree.',
      'A bolt of bright lightning struck the tall pine tree suddenly.',
    ],
    explanation: '"Suddenly" can lead the sentence or modify the verb directly.',
    difficulty: 'easy',
  },

  // 14. Time Connective: Eventually
  {
    id: 'g7-u2-s14',
    prompt: 'Describing a successful rescue conclusion:',
    correctSentence: 'Eventually the helicopter team found the missing hikers on the ridge.',
    scrambledWords: ['Eventually', 'the', 'helicopter', 'team', 'found', 'the', 'missing', 'hikers', 'on', 'the', 'ridge'],
    acceptedAnswers: [
      'Eventually the helicopter team found the missing hikers on the ridge.',
      'The helicopter team eventually found the missing hikers on the ridge.',
      'The helicopter team found the missing hikers on the ridge eventually.',
    ],
    explanation: '"Eventually" marks the culmination of an extended effort.',
    difficulty: 'medium',
  },

  // 15. Deforestation and Habitat Loss
  {
    id: 'g7-u2-s15',
    prompt: 'Explaining why pangolins are endangered:',
    correctSentence: 'Deforestation destroys the natural habitat of many endangered species.',
    scrambledWords: ['Deforestation', 'destroys', 'the', 'natural', 'habitat', 'of', 'many', 'endangered', 'species'],
    acceptedAnswers: [
      'Deforestation destroys the natural habitat of many endangered species.',
      'The natural habitat of many endangered species deforestation destroys.',
    ],
    explanation: '"Deforestation" is the subject noun causing habitat destruction.',
    difficulty: 'easy',
  },

  // 16. Past Continuous Simultaneous Actions
  {
    id: 'g7-u2-s16',
    prompt: 'Describing two actions happening at the same time in a storm:',
    correctSentence: 'While rain was pouring down the wind was blowing violently.',
    scrambledWords: ['While', 'rain', 'was', 'pouring', 'down', 'the', 'wind', 'was', 'blowing', 'violently'],
    acceptedAnswers: [
      'While rain was pouring down the wind was blowing violently.',
      'The wind was blowing violently while rain was pouring down.',
      'While the wind was blowing violently rain was pouring down.',
    ],
    explanation: 'Simultaneous past continuous actions linked by "while". Both clause orderings are valid.',
    difficulty: 'challenging',
  },

  // 17. Past Perfect with After
  {
    id: 'g7-u2-s17',
    prompt: 'Describing the return of villagers after a flood:',
    correctSentence: 'After the floodwaters had receded the villagers returned to their homes.',
    scrambledWords: ['After', 'the', 'floodwaters', 'had', 'receded', 'the', 'villagers', 'returned', 'to', 'their', 'homes'],
    acceptedAnswers: [
      'After the floodwaters had receded the villagers returned to their homes.',
      'The villagers returned to their homes after the floodwaters had receded.',
    ],
    explanation: '"After" introduces the prior event in Past Perfect ("had receded").',
    difficulty: 'medium',
  },

  // 18. Emergency Call Request
  {
    id: 'g7-u2-s18',
    prompt: 'Making an urgent emergency report:',
    correctSentence: 'Please send an ambulance because someone is badly injured.',
    scrambledWords: ['Please', 'send', 'an', 'ambulance', 'because', 'someone', 'is', 'badly', 'injured'],
    acceptedAnswers: [
      'Please send an ambulance because someone is badly injured.',
      'Because someone is badly injured please send an ambulance.',
    ],
    explanation: 'Imperative request supported by a causal "because" clause.',
    difficulty: 'easy',
  },

  // 19. Animals Sensing Danger
  {
    id: 'g7-u2-s19',
    prompt: 'Describing unusual animal behavior before an earthquake:',
    correctSentence: 'The dogs began barking loudly minutes before the earthquake began.',
    scrambledWords: ['The', 'dogs', 'began', 'barking', 'loudly', 'minutes', 'before', 'the', 'earthquake', 'began'],
    acceptedAnswers: [
      'The dogs began barking loudly minutes before the earthquake began.',
      'Minutes before the earthquake began the dogs began barking loudly.',
    ],
    explanation: 'Time phrase "minutes before..." can precede or follow the main clause.',
    difficulty: 'medium',
  },

  // 20. Negative Form of Used to
  {
    id: 'g7-u2-s20',
    prompt: 'Expressing a habit that did not exist in the past:',
    correctSentence: 'People did not use to care about wildlife conservation.',
    scrambledWords: ['People', 'did', 'not', 'use', 'to', 'care', 'about', 'wildlife', 'conservation'],
    acceptedAnswers: [
      'People did not use to care about wildlife conservation.',
      'About wildlife conservation people did not use to care.',
    ],
    explanation: 'Negative form: "did not use to + base verb".',
    difficulty: 'medium',
  },

  // 21. Question with Used to
  {
    id: 'g7-u2-s21',
    prompt: 'Asking about past wildlife presence in a region:',
    correctSentence: 'Did tigers use to live in this mountain forest?',
    scrambledWords: ['Did', 'tigers', 'use', 'to', 'live', 'in', 'this', 'mountain', 'forest'],
    acceptedAnswers: [
      'Did tigers use to live in this mountain forest?',
      'In this mountain forest did tigers use to live?',
    ],
    explanation: 'Question form: "Did + subject + use to + base verb".',
    difficulty: 'easy',
  },

  // 22. Adverbs of Place: Inland
  {
    id: 'g7-u2-s22',
    prompt: 'Describing movement away from a tsunami:',
    correctSentence: 'The coastal population moved inland to escape the giant waves.',
    scrambledWords: ['The', 'coastal', 'population', 'moved', 'inland', 'to', 'escape', 'the', 'giant', 'waves'],
    acceptedAnswers: [
      'The coastal population moved inland to escape the giant waves.',
      'To escape the giant waves the coastal population moved inland.',
    ],
    explanation: '"Inland" is an adverb of place indicating direction away from the coast.',
    difficulty: 'medium',
  },

  // 23. Adverbs of Place: Outdoors
  {
    id: 'g7-u2-s23',
    prompt: 'Safety advice during an earthquake:',
    correctSentence: 'If you are outdoors stay away from tall glass buildings.',
    scrambledWords: ['If', 'you', 'are', 'outdoors', 'stay', 'away', 'from', 'tall', 'glass', 'buildings'],
    acceptedAnswers: [
      'If you are outdoors stay away from tall glass buildings.',
      'Stay away from tall glass buildings if you are outdoors.',
    ],
    explanation: 'Conditional clause with adverb of place "outdoors".',
    difficulty: 'medium',
  },

  // 24. Past Perfect Sequence with Already
  {
    id: 'g7-u2-s24',
    prompt: 'Describing a bridge collapse before an evacuation bus arrived:',
    correctSentence: 'The wooden bridge had already collapsed before the bus arrived.',
    scrambledWords: ['The', 'wooden', 'bridge', 'had', 'already', 'collapsed', 'before', 'the', 'bus', 'arrived'],
    acceptedAnswers: [
      'The wooden bridge had already collapsed before the bus arrived.',
      'Before the bus arrived the wooden bridge had already collapsed.',
    ],
    explanation: 'Past Perfect with "already" emphasizes the prior occurrence of the collapse.',
    difficulty: 'medium',
  },

  // 25. Time Connective: For several days
  {
    id: 'g7-u2-s25',
    prompt: 'Describing the duration of search operations:',
    correctSentence: 'The rescue teams searched the mountain for several days.',
    scrambledWords: ['The', 'rescue', 'teams', 'searched', 'the', 'mountain', 'for', 'several', 'days'],
    acceptedAnswers: [
      'The rescue teams searched the mountain for several days.',
      'For several days the rescue teams searched the mountain.',
    ],
    explanation: 'Duration phrase "for several days" can initiate or conclude the sentence.',
    difficulty: 'easy',
  },

  // 26. Illegal Wildlife Trade Ban
  {
    id: 'g7-u2-s26',
    prompt: 'Stating a legal conservation rule:',
    correctSentence: 'International treaties ban the illegal trade in pangolin scales.',
    scrambledWords: ['International', 'treaties', 'ban', 'the', 'illegal', 'trade', 'in', 'pangolin', 'scales'],
    acceptedAnswers: [
      'International treaties ban the illegal trade in pangolin scales.',
      'The illegal trade in pangolin scales international treaties ban.',
    ],
    explanation: '"Ban" takes a direct object noun phrase: "the illegal trade in...".',
    difficulty: 'medium',
  },

  // 27. Volcano Lava Flow
  {
    id: 'g7-u2-s27',
    prompt: 'Describing lava advancing down a slope:',
    correctSentence: 'Glowing molten lava flowed downhill towards the abandoned village.',
    scrambledWords: ['Glowing', 'molten', 'lava', 'flowed', 'downhill', 'towards', 'the', 'abandoned', 'village'],
    acceptedAnswers: [
      'Glowing molten lava flowed downhill towards the abandoned village.',
      'Towards the abandoned village glowing molten lava flowed downhill.',
    ],
    explanation: '"Downhill" functions as an adverb of place describing direction of motion.',
    difficulty: 'medium',
  },

  // 28. Time Connective: Finally
  {
    id: 'g7-u2-s28',
    prompt: 'Describing when the storm finally stopped:',
    correctSentence: 'Finally the dark thunderstorm clouds drifted away to the east.',
    scrambledWords: ['Finally', 'the', 'dark', 'thunderstorm', 'clouds', 'drifted', 'away', 'to', 'the', 'east'],
    acceptedAnswers: [
      'Finally the dark thunderstorm clouds drifted away to the east.',
      'The dark thunderstorm clouds finally drifted away to the east.',
      'The dark thunderstorm clouds drifted away to the east finally.',
    ],
    explanation: '"Finally" indicates the resolution of a prolonged situation.',
    difficulty: 'easy',
  },

  // 29. Sun Bear Habitat
  {
    id: 'g7-u2-s29',
    prompt: 'Describing how sun bears live in the wild:',
    correctSentence: 'Sun bears build sleeping nests high up in tropical trees.',
    scrambledWords: ['Sun', 'bears', 'build', 'sleeping', 'nests', 'high', 'up', 'in', 'tropical', 'trees'],
    acceptedAnswers: [
      'Sun bears build sleeping nests high up in tropical trees.',
      'High up in tropical trees sun bears build sleeping nests.',
    ],
    explanation: 'Locative phrase "high up in tropical trees" can precede or follow.',
    difficulty: 'medium',
  },

  // 30. Rescuer Dedication
  {
    id: 'g7-u2-s30',
    prompt: 'Praising emergency volunteers after a disaster:',
    correctSentence: 'Brave emergency volunteers worked around the clock to save lives.',
    scrambledWords: ['Brave', 'emergency', 'volunteers', 'worked', 'around', 'the', 'clock', 'to', 'save', 'lives'],
    acceptedAnswers: [
      'Brave emergency volunteers worked around the clock to save lives.',
      'To save lives brave emergency volunteers worked around the clock.',
    ],
    explanation: 'Infinitive of purpose "to save lives" expresses the goal of the rescue effort.',
    difficulty: 'easy',
  },
];
