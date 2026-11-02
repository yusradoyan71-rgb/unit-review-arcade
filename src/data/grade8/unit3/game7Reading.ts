import type { ReadingPassageQuestion } from '../../../types/schema';

export interface ReadingPassageData {
  id: string;
  title: string;
  wordCount: number;
  text: string;
}

export const READING_PASSAGES: ReadingPassageData[] = [
  // Passage 1: A Teenager Describing Life in London
  {
    id: 'u3-pass-1',
    title: 'My City Life in North London',
    wordCount: 124,
    text: `My name is Jack, and I have lived in North London all my life. People often ask me if living in such a huge city is overwhelming, but I honestly love it. Every morning, I catch the bright red double-decker bus to school. Sitting on the top deck offers a wonderful view of Victorian townhouses, bustling bakeries, and neighbourhood parks. At weekends, my friends and I take the Tube into central London. The best thing about London is that world-class museums, like the Natural History Museum and the British Museum, are completely free to enter. In the afternoons, we enjoy street performances in Covent Garden or sit by the fountain. London can be noisy and crowded, but it is never boring.`,
  },

  // Passage 2: Planning a Weekend in London
  {
    id: 'u3-pass-2',
    title: 'An Itinerary for Saturday',
    wordCount: 126,
    text: `Emma and her cousin Liam sat at the kitchen table on Friday evening planning their Saturday adventure. "Why don't we start with the British Museum at ten o'clock?" suggested Liam. "Good idea," replied Emma, "then we can walk down to Covent Garden for a quick lunch." For the afternoon, Liam proposed shopping on Oxford Street, but Emma politely disagreed: "I'd rather not. Oxford Street is always too crowded on Saturdays. How about having a relaxing picnic in Regent's Park instead?" Liam agreed enthusiastically. To finish their day out, they booked tickets for an evening musical in the West End. By checking online Tube timetables in advance, they organized a realistic schedule that balanced historic sightseeing, green spaces, and evening theatre entertainment.`,
  },

  // Passage 3: A Visit to Camden Market
  {
    id: 'u3-pass-3',
    title: 'Treasures and Flavours of Camden',
    wordCount: 125,
    text: `On Sunday morning, Maya visited Camden Market beside the historic Regent’s Canal. The market was a whirlwind of sights, sounds, and enticing aromas. Hundreds of independent traders sold vintage denim jackets, handmade silver jewellery, second-hand books, and quirky vinyl records. As Maya walked through the maze of converted brick horse stables, she smelled spices from street food stalls representing countries worldwide, from Mexican tacos to spicy Malaysian noodles. Near the water's edge, acoustic street musicians played lively guitar melodies while canal boats drifted slowly under stone bridges. Maya bought a pair of vintage sunglasses from a local artisan and ate warm churros dusted with sugar. Camden Market felt wonderfully creative, lively, and filled with youthful artistic energy.`,
  },

  // Passage 4: Buying Tickets and Travelling by Train
  {
    id: 'u3-pass-4',
    title: 'Navigating King’s Cross Railway Station',
    wordCount: 125,
    text: `At half past eight on Tuesday morning, Lucas arrived at London King's Cross station to catch an express train to York. The station concourse was bustling with commuters looking up at the giant digital departure screens. Lucas walked to the ticket counter and politely asked: "Good morning. How much is an off-peak return ticket to York, please?" The clerk answered that with a student railcard, the fare was thirty-two pounds. Lucas paid with his debit card and received his orange ticket. The overhead screen announced that his train was ready for boarding at platform eight. Walking down the platform, Lucas found his reserved carriage, placed his backpack on the luggage rack, and settled into a comfortable window seat.`,
  },

  // Passage 5: A Sustainable Day Out in the City
  {
    id: 'u3-pass-5',
    title: 'Exploring London the Green Way',
    wordCount: 126,
    text: `City tourism can produce excessive carbon emissions and plastic waste, but visiting London sustainably is both easy and rewarding. Last Saturday, Sophie and her brother demonstrated how to enjoy an eco-friendly day out. Instead of hailing taxis, they hired public city bicycles from a docking station and pedalled safely along designated cycle superhighways beside the River Thames. For lunch, they visited Borough Market, eating fresh bakery bread and organic fruit produced by local farmers. When buying bottled drinks, they used reusable stainless steel flasks filled at free public drinking fountains. They also made sure all snack wrappers were placed into recycling bins. By choosing pedal power and supporting independent market traders, they had an unforgettable day while protecting the environment.`,
  },
];

export const GAME_7_READING_QUESTIONS: ReadingPassageQuestion[] = [
  // Passage 1 Questions
  {
    id: 'g8u3-g7-q01',
    passageId: 'u3-pass-1',
    passageTitle: 'My City Life in North London',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What does Jack enjoy doing on his morning bus ride to school?',
    options: [
      'Sitting on the top deck to enjoy views of townhouses and parks',
      'Sleeping on the floor of the bus',
      'Driving the bus through traffic',
      'Doing his homework with loud music'
    ],
    correctOptionIndex: 0,
    explanation: 'Jack states: "Sitting on the top deck offers a wonderful view of Victorian townhouses, bustling bakeries, and neighbourhood parks."',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q02',
    passageId: 'u3-pass-1',
    passageTitle: 'My City Life in North London',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What special advantage about London museums does Jack mention?',
    options: [
      'They are open twenty-four hours every night.',
      'World-class museums are completely free to enter.',
      'Only teenagers are allowed to visit them.',
      'They only display modern plastic art.'
    ],
    correctOptionIndex: 1,
    explanation: 'The text notes that major museums like the Natural History Museum and British Museum are free of charge.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q03',
    passageId: 'u3-pass-1',
    passageTitle: 'My City Life in North London',
    passageText: READING_PASSAGES[0].text,
    prompt: 'In the passage, the word "bustling" describes bakeries that are...',
    options: [
      'Lively, busy, and full of activity',
      'Completely empty and closed',
      'Extremely expensive and unfriendly',
      'Quiet and dark'
    ],
    correctOptionIndex: 0,
    explanation: '"Bustling" means full of energetic, lively activity and people.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q04',
    passageId: 'u3-pass-1',
    passageTitle: 'My City Life in North London',
    passageText: READING_PASSAGES[0].text,
    prompt: 'Where do Jack and his friends like to watch street performers in the afternoon?',
    options: [
      'At King\'s Cross Station',
      'In Covent Garden',
      'Inside the underground Tube',
      'On Oxford Street'
    ],
    correctOptionIndex: 1,
    explanation: 'Jack mentions enjoying street performances in Covent Garden.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q05',
    passageId: 'u3-pass-1',
    passageTitle: 'My City Life in North London',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What is Jack\'s overall opinion about living in London?',
    options: [
      'He hates the city and wants to move immediately.',
      'He finds it noisy at times, but loves that it is exciting and never boring.',
      'He thinks London has no green parks or culture.',
      'He only leaves his house on school days.'
    ],
    correctOptionIndex: 1,
    explanation: 'Jack concludes: "London can be noisy and crowded, but it is never boring."',
    difficulty: 'challenging',
  },

  // Passage 2 Questions
  {
    id: 'g8u3-g7-q06',
    passageId: 'u3-pass-2',
    passageTitle: 'An Itinerary for Saturday',
    passageText: READING_PASSAGES[1].text,
    prompt: 'Where did Emma and Liam decide to start their Saturday morning sightseeing?',
    options: [
      'At the British Museum at ten o\'clock',
      'At a cinema in Leicester Square',
      'At a shopping centre on Oxford Street',
      'On a boat along the River Thames'
    ],
    correctOptionIndex: 0,
    explanation: 'Liam suggested starting at the British Museum at ten o\'clock, and Emma agreed.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q07',
    passageId: 'u3-pass-2',
    passageTitle: 'An Itinerary for Saturday',
    passageText: READING_PASSAGES[1].text,
    prompt: 'Why did Emma disagree with Liam\'s suggestion to go shopping on Oxford Street?',
    options: [
      'Oxford Street was closed for repairs.',
      'It is always too crowded on Saturdays.',
      'She forgot her wallet at home.',
      'There are no shops on Oxford Street.'
    ],
    correctOptionIndex: 1,
    explanation: 'Emma explained: "Oxford Street is always too crowded on Saturdays."',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q08',
    passageId: 'u3-pass-2',
    passageTitle: 'An Itinerary for Saturday',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What alternative afternoon activity did Emma propose instead of shopping?',
    options: [
      'Having a relaxing picnic in Regent\'s Park',
      'Sleeping at the hotel',
      'Taking a taxi to Gatwick Airport',
      'Watching TV inside all day'
    ],
    correctOptionIndex: 0,
    explanation: 'Emma suggested having a relaxing picnic in Regent\'s Park instead of crowded shopping.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q09',
    passageId: 'u3-pass-2',
    passageTitle: 'An Itinerary for Saturday',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What evening entertainment did the cousins choose to conclude their day?',
    options: [
      'A musical in the West End',
      'A football match at Wembley Stadium',
      'An opera in Camden Town',
      'A late-night train journey to Scotland'
    ],
    correctOptionIndex: 0,
    explanation: 'The text notes that they booked tickets for an evening musical in the West End.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q10',
    passageId: 'u3-pass-2',
    passageTitle: 'An Itinerary for Saturday',
    passageText: READING_PASSAGES[1].text,
    prompt: 'In the passage, the word "itinerary" or "schedule" refers to...',
    options: [
      'A planned list of activities, places, and times for a journey',
      'A type of British railway ticket',
      'A musical instrument played in theatres',
      'A ticket machine at the Tube'
    ],
    correctOptionIndex: 0,
    explanation: 'An itinerary or schedule is a timetable of planned events and routes for a trip.',
    difficulty: 'challenging',
  },

  // Passage 3 Questions
  {
    id: 'g8u3-g7-q11',
    passageId: 'u3-pass-3',
    passageTitle: 'Treasures and Flavours of Camden',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What body of water runs right beside Camden Market?',
    options: [
      'Regent\'s Canal',
      'The Pacific Ocean',
      'The English Channel',
      'Loch Ness'
    ],
    correctOptionIndex: 0,
    explanation: 'The passage mentions Maya visited Camden Market beside historic Regent\'s Canal.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q12',
    passageId: 'u3-pass-3',
    passageTitle: 'Treasures and Flavours of Camden',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What unique item did Maya purchase from an independent artisan at the market?',
    options: [
      'A pair of vintage sunglasses',
      'A brand new laptop',
      'A bicycle helmet',
      'A train ticket to York'
    ],
    correctOptionIndex: 0,
    explanation: 'The text states: "Maya bought a pair of vintage sunglasses from a local artisan."',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q13',
    passageId: 'u3-pass-3',
    passageTitle: 'Treasures and Flavours of Camden',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What international street food flavours did Maya notice while walking through the stalls?',
    options: [
      'Mexican tacos and Malaysian noodles',
      'Only plain boiled potatoes',
      'French baguettes and cheese only',
      'Canned beans and crackers'
    ],
    correctOptionIndex: 0,
    explanation: 'The passage explicitly mentions smelling Mexican tacos and spicy Malaysian noodles.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q14',
    passageId: 'u3-pass-3',
    passageTitle: 'Treasures and Flavours of Camden',
    passageText: READING_PASSAGES[2].text,
    prompt: 'In the passage, the word "whirlwind" indicates that the market was...',
    options: [
      'Full of fast-moving, energetic, and exciting sensory impressions',
      'Destroyed by a dangerous tornado',
      'Completely empty and silent',
      'Cold and covered in heavy snow'
    ],
    correctOptionIndex: 0,
    explanation: 'Metaphorically, "a whirlwind of sights and sounds" means dynamic, vibrant, and energetic.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q15',
    passageId: 'u3-pass-3',
    passageTitle: 'Treasures and Flavours of Camden',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What kind of atmosphere did Camden Market offer according to the author?',
    options: [
      'Boring, corporate, and gloomy',
      'Creatively vibrant, lively, and filled with youthful artistic energy',
      'Hostile and dangerous',
      'Strictly academic and quiet'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage concludes that Camden felt "wonderfully creative, lively, and filled with youthful artistic energy."',
    difficulty: 'challenging',
  },

  // Passage 4 Questions
  {
    id: 'g8u3-g7-q16',
    passageId: 'u3-pass-4',
    passageTitle: 'Navigating King’s Cross Railway Station',
    passageText: READING_PASSAGES[3].text,
    prompt: 'Which railway station did Lucas go to for his journey to York?',
    options: [
      'King\'s Cross Station',
      'Victoria Station',
      'Paddington Station',
      'Waterloo Station'
    ],
    correctOptionIndex: 0,
    explanation: 'The text states that Lucas arrived at London King\'s Cross station.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q17',
    passageId: 'u3-pass-4',
    passageTitle: 'Navigating King’s Cross Railway Station',
    passageText: READING_PASSAGES[3].text,
    prompt: 'How did Lucas save money on his train ticket to York?',
    options: [
      'He used a student railcard to get a discounted fare.',
      'He refused to pay the clerk.',
      'He travelled without a ticket.',
      'He traded a vintage book.'
    ],
    correctOptionIndex: 0,
    explanation: 'The clerk noted that with a student railcard, the ticket price was discounted to thirty-two pounds.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q18',
    passageId: 'u3-pass-4',
    passageTitle: 'Navigating King’s Cross Railway Station',
    passageText: READING_PASSAGES[3].text,
    prompt: 'Which platform was announced for Lucas\'s train to York?',
    options: ['Platform 8', 'Platform 2', 'Platform 15', 'Platform 4'],
    correctOptionIndex: 0,
    explanation: 'The overhead screen announced that his train was boarding at platform eight.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q19',
    passageId: 'u3-pass-4',
    passageTitle: 'Navigating King’s Cross Railway Station',
    passageText: READING_PASSAGES[3].text,
    prompt: 'In the passage, the word "concourse" refers to...',
    options: [
      'The large open central area inside a railway station',
      'The wheels beneath an engine',
      'The ticket printed on cardboard',
      'The driver\'s seat in the train'
    ],
    correctOptionIndex: 0,
    explanation: 'A railway concourse is the spacious main hall where passengers gather, read screens, and access platforms.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q20',
    passageId: 'u3-pass-4',
    passageTitle: 'Navigating King’s Cross Railway Station',
    passageText: READING_PASSAGES[3].text,
    prompt: 'What was the sequence of Lucas\'s actions inside the station?',
    options: [
      'Checked screens -> asked clerk at counter -> bought ticket -> boarded at platform 8.',
      'Boarded train -> bought ticket -> arrived at station -> looked at screens.',
      'Lost his backpack -> found platform 8 -> bought lunch -> took a taxi.',
      'Rode the Tube -> slept on platform -> missed train.'
    ],
    correctOptionIndex: 0,
    explanation: 'Lucas entered the concourse, bought his ticket at the counter, saw the platform screen, and boarded.',
    difficulty: 'challenging',
  },

  // Passage 5 Questions
  {
    id: 'g8u3-g7-q21',
    passageId: 'u3-pass-5',
    passageTitle: 'Exploring London the Green Way',
    passageText: READING_PASSAGES[4].text,
    prompt: 'How did Sophie and her brother travel around the city sustainably?',
    options: [
      'They hired public city bicycles and rode along cycle superhighways.',
      'They rented a private limousine.',
      'They took three different helicopters.',
      'They drove two separate cars.'
    ],
    correctOptionIndex: 0,
    explanation: 'The passage explains that they hired public city bicycles from a docking station.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q22',
    passageId: 'u3-pass-5',
    passageTitle: 'Exploring London the Green Way',
    passageText: READING_PASSAGES[4].text,
    prompt: 'Where did the siblings stop to buy fresh bread and organic fruit for lunch?',
    options: [
      'Borough Market',
      'An airport duty-free store',
      'A fast-food drive-through',
      'A souvenir shop on Oxford Street'
    ],
    correctOptionIndex: 0,
    explanation: 'They stopped at Borough Market to buy organic fruit and fresh bakery bread.',
    difficulty: 'easy',
  },
  {
    id: 'g8u3-g7-q23',
    passageId: 'u3-pass-5',
    passageTitle: 'Exploring London the Green Way',
    passageText: READING_PASSAGES[4].text,
    prompt: 'How did they prevent single-use plastic waste during their day out?',
    options: [
      'They brought reusable stainless steel flasks and used public drinking fountains.',
      'They bought twenty plastic bottles and threw them in the river.',
      'They drank no water all day.',
      'They carried disposable plastic cups.'
    ],
    correctOptionIndex: 0,
    explanation: 'They carried reusable flasks and refilled them at free public water fountains.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q24',
    passageId: 'u3-pass-5',
    passageTitle: 'Exploring London the Green Way',
    passageText: READING_PASSAGES[4].text,
    prompt: 'In the text, the phrase "sustainable tourism" means...',
    options: [
      'Exploring places in a way that respects communities and avoids damaging the environment',
      'Spending as much money as possible in luxury hotels',
      'Driving huge gas-guzzling vehicles through pedestrian streets',
      'Travelling without telling your family'
    ],
    correctOptionIndex: 0,
    explanation: 'Sustainable tourism focuses on low ecological impact and cultural respect.',
    difficulty: 'medium',
  },
  {
    id: 'g8u3-g7-q25',
    passageId: 'u3-pass-5',
    passageTitle: 'Exploring London the Green Way',
    passageText: READING_PASSAGES[4].text,
    prompt: 'What is the primary message the author wants readers to learn from Sophie and Liam\'s day?',
    options: [
      'You cannot visit London without spending a fortune on taxis.',
      'City tourism can be exciting, convenient, and environmentally friendly at the same time.',
      'Bicycles are dangerous and should be banned from cities.',
      'Organic food is impossible to find in urban areas.'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage demonstrates that green, low-carbon urban exploration is both easy, rewarding, and fun.',
    difficulty: 'challenging',
  },
];
