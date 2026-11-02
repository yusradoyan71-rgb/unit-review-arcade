import type { ReadingPassageQuestion } from '../../../types/schema';

export interface ReadingPassageData {
  id: string;
  title: string;
  wordCount: number;
  text: string;
}

export const READING_PASSAGES: ReadingPassageData[] = [
  // Passage 1: An Unexpected Travel Problem
  {
    id: 'u2-pass-1',
    title: 'An Unexpected Breakdown in the Mountains',
    wordCount: 124,
    text: `Last summer, Oliver and his family set off on a road trip across the green highlands. The weather was sunny, and the winding road offered breathtaking views of deep pine valleys. Suddenly, around midday, thick white smoke poured from beneath the car bonnet. The engine sputtered, made a loud clanking noise, and died completely. Stranded on a quiet mountain pass with no phone reception, Oliver felt frightened. Fortunately, half an hour later, an elderly farmer drove past in a blue pickup truck. He stopped immediately, tied a sturdy yellow rope to their bumper, and towed them to his village workshop. A local mechanic fixed the broken water pipe in two hours. By evening, the family was safely drinking hot soup at a cosy guesthouse.`,
  },

  // Passage 2: A Memorable Journey
  {
    id: 'u2-pass-2',
    title: 'The Midnight Express Across the Highlands',
    wordCount: 125,
    text: `Mia had always dreamed of taking an overnight sleeper train. In October, she boarded the Caledonian Highland Express at London station just before nine o'clock. As the train slipped quietly out of the bustling city, Mia settled into her small private cabin. The rhythmic click-clack of the steel rails was soothing, rocking her gently to sleep. When she pulled open the window blind at sunrise, she gasped with delight. The train was gliding beside a glassy Scottish loch surrounded by golden autumn forests and misty purple mountains. Outside, morning frost sparkled like tiny diamonds on the heather. Mia drank hot chocolate from a paper cup while watching red deer graze peacefully by the tracks. It was the most unforgettable journey of her life.`,
  },

  // Passage 3: Travelling in Mongolia
  {
    id: 'u2-pass-3',
    title: 'Nomadic Hospitality on the Mongolian Steppe',
    wordCount: 128,
    text: `Fourteen-year-old Lucas travelled to Mongolia with his parents to experience nomadic life on the great Asian steppe. After landing at the capital airport, they travelled by four-wheel-drive jeep across endless rolling grasslands with no paved roads or fences. They stayed with a welcoming nomadic family inside a traditional circular felt tent called a ger. Inside, a central iron stove kept the tent warm against chilly evening winds. The family offered Lucas warm salted milk tea and homemade dried curd snacks. The next morning, Lucas learned how to ride a gentle Mongolian horse across the wide open plains, herding sheep alongside young children who rode like champions. Lucas learned that Mongolian nomads deeply respect nature, leaving no waste behind when they move camp.`,
  },

  // Passage 4: An Unusual Adventure
  {
    id: 'u2-pass-4',
    title: 'Under the Desert Stars in Morocco',
    wordCount: 127,
    text: `Sofia’s adventure began at the edge of the Sahara Desert in southern Morocco. Leaving their backpacks in a small mudbrick village, Sofia and her travel group mounted tall dromedary camels. Her camel, named Zahra, swayed rhythmically from side to side as they climbed massive orange sand dunes. Riding for three hours under the late afternoon sun was exhausting, but the sunset was spectacular. The dunes turned from bright gold to glowing crimson as darkness fell. At the desert camp, Berber guides prepared a steaming vegetable tagine over glowing coals and played lively drum rhythms around the campfire. Later that night, Sofia lay on a wool blanket outside her tent, staring in wonder at millions of glittering stars shining brilliantly in the clean, silent sky.`,
  },

  // Passage 5: Responsible Tourism
  {
    id: 'u2-pass-5',
    title: 'How to Travel Like a Green Explorer',
    wordCount: 126,
    text: `Tourism allows millions of people to discover new cultures, but careless travel can harm fragile natural habitats and local communities. Sustainable tourism means exploring the world responsibly while protecting the planet for future generations. Wise travellers choose environmentally friendly transport, taking trains or public buses instead of booking short domestic flights that produce heavy carbon pollution. When packing, they bring reusable water bottles, cloth shopping bags, and solid shampoo bars to reduce single-use plastic waste. Furthermore, responsible tourists respect local traditions, asking politely before taking photographs of residents and dressing modestly at cultural monuments. Finally, by dining in family-run cafes and buying handmade souvenirs from artisan markets, travellers ensure that their money directly supports the local economy rather than multinational corporations.`,
  },
];

export const GAME_7_READING_QUESTIONS: ReadingPassageQuestion[] = [
  // Passage 1 Questions
  {
    id: 'g8u2-g7-q01',
    passageId: 'u2-pass-1',
    passageTitle: 'An Unexpected Breakdown in the Mountains',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What unexpected problem interrupted the family\'s road trip?',
    options: [
      'They ran out of petrol in a busy city.',
      'Their car broke down due to a broken water pipe.',
      'They lost all their luggage at an airport.',
      'A snowstorm blocked the road completely.'
    ],
    correctOptionIndex: 1,
    explanation: 'The text explains that smoke poured from the bonnet and a local mechanic fixed the broken water pipe.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q02',
    passageId: 'u2-pass-1',
    passageTitle: 'An Unexpected Breakdown in the Mountains',
    passageText: READING_PASSAGES[0].text,
    prompt: 'How did the family reach the village workshop after the breakdown?',
    options: [
      'They walked twenty miles on foot.',
      'A kind farmer towed their car with his pickup truck.',
      'They took an express mountain train.',
      'They called a taxi using their smartphone.'
    ],
    correctOptionIndex: 1,
    explanation: 'A passing farmer tied a sturdy yellow rope to their bumper and towed them to his village.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q03',
    passageId: 'u2-pass-1',
    passageTitle: 'An Unexpected Breakdown in the Mountains',
    passageText: READING_PASSAGES[0].text,
    prompt: 'In the passage, the word "stranded" most nearly means...',
    options: [
      'Comfortably resting on a holiday',
      'Stuck in a place without the ability to leave',
      'Driving at very high speed',
      'Swimming across a cold river'
    ],
    correctOptionIndex: 1,
    explanation: '"Stranded" means unable to move or escape from a difficult location.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q04',
    passageId: 'u2-pass-1',
    passageTitle: 'An Unexpected Breakdown in the Mountains',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What was the sequence of events after the car broke down?',
    options: [
      'A farmer towed them -> the mechanic fixed the car -> they ate soup at a guesthouse.',
      'They ate soup -> the car broke down -> a farmer arrived.',
      'The mechanic arrived first -> then a farmer drove past -> they walked home.',
      'They bought a new car -> then drove to the beach.'
    ],
    correctOptionIndex: 0,
    explanation: 'The text describes the farmer towing them, the mechanic repairing the pipe, and the family enjoying soup in the evening.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q05',
    passageId: 'u2-pass-1',
    passageTitle: 'An Unexpected Breakdown in the Mountains',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What can be inferred about the local community in the mountain village?',
    options: [
      'They dislike tourists and refuse to help them.',
      'They were generous, welcoming, and helpful to travellers in trouble.',
      'They had no tools or mechanical knowledge.',
      'They charged the family millions of dollars.'
    ],
    correctOptionIndex: 1,
    explanation: 'Both the passing farmer and the mechanic immediately assisted the stranded family.',
    difficulty: 'challenging',
  },

  // Passage 2 Questions
  {
    id: 'g8u2-g7-q06',
    passageId: 'u2-pass-2',
    passageTitle: 'The Midnight Express Across the Highlands',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What mode of transportation did Mia use for her Highland journey?',
    options: [
      'An overnight sleeper train',
      'A cross-country bicycle',
      'A commercial airplane',
      'A horse-drawn carriage'
    ],
    correctOptionIndex: 0,
    explanation: 'The text states that Mia boarded the Caledonian Highland Express overnight sleeper train.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q07',
    passageId: 'u2-pass-2',
    passageTitle: 'The Midnight Express Across the Highlands',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What did Mia see when she opened the window blind at sunrise?',
    options: [
      'A polluted factory district',
      'A glassy loch, autumn forests, and misty mountains',
      'A crowded airport terminal',
      'A sandy desert with palm trees'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage describes the train gliding beside a Scottish loch, autumn forests, and misty mountains.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q08',
    passageId: 'u2-pass-2',
    passageTitle: 'The Midnight Express Across the Highlands',
    passageText: READING_PASSAGES[1].text,
    prompt: 'In the text, the word "soothing" means...',
    options: [
      'Loud and terrifying',
      'Calming, relaxing, and gentle',
      'Extremely painful',
      'Freezing cold'
    ],
    correctOptionIndex: 1,
    explanation: '"Soothing" describes something that provides comforting calmness and helps you relax.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q09',
    passageId: 'u2-pass-2',
    passageTitle: 'The Midnight Express Across the Highlands',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What animals did Mia observe grazing beside the railway tracks?',
    options: [
      'Camels',
      'Red deer',
      'Wolves',
      'Penguins'
    ],
    correctOptionIndex: 1,
    explanation: 'The text states: "Mia drank hot chocolate... while watching red deer graze peacefully by the tracks."',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q10',
    passageId: 'u2-pass-2',
    passageTitle: 'The Midnight Express Across the Highlands',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What was Mia\'s overall feeling about the sleeper train experience?',
    options: [
      'She felt it was boring and uncomfortable.',
      'She thought it was the most unforgettable journey of her life.',
      'She regretted not booking an airplane ticket.',
      'She disliked the view outside the window.'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage concludes: "It was the most unforgettable journey of her life."',
    difficulty: 'challenging',
  },

  // Passage 3 Questions
  {
    id: 'g8u2-g7-q11',
    passageId: 'u2-pass-3',
    passageTitle: 'Nomadic Hospitality on the Mongolian Steppe',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What is a "ger" in Mongolian culture according to the passage?',
    options: [
      'A type of high-speed train',
      'A traditional circular felt tent',
      'A wooden boat used on rivers',
      'A metal weapon used in hunting'
    ],
    correctOptionIndex: 1,
    explanation: 'The text describes staying inside "a traditional circular felt tent called a ger."',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q12',
    passageId: 'u2-pass-3',
    passageTitle: 'Nomadic Hospitality on the Mongolian Steppe',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What warm food and drink did the nomadic family offer their guests?',
    options: [
      'Pizza and cold soda',
      'Warm salted milk tea and dried curd snacks',
      'Spicy noodles and iced juice',
      'Chocolate cake and lemonade'
    ],
    correctOptionIndex: 1,
    explanation: 'The text mentions the family offered warm salted milk tea and homemade dried curd snacks.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q13',
    passageId: 'u2-pass-3',
    passageTitle: 'Nomadic Hospitality on the Mongolian Steppe',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What activity did Lucas try on the open plains the next morning?',
    options: [
      'Driving a petrol car',
      'Riding a gentle Mongolian horse',
      'Piloting a helicopter',
      'Surfing on a lake'
    ],
    correctOptionIndex: 1,
    explanation: 'Lucas learned how to ride a gentle Mongolian horse across the wide open plains.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q14',
    passageId: 'u2-pass-3',
    passageTitle: 'Nomadic Hospitality on the Mongolian Steppe',
    passageText: READING_PASSAGES[2].text,
    prompt: 'In the passage, the word "steppe" refers to...',
    options: [
      'A massive underground cave',
      'A vast, flat grassland without trees',
      'A tropical rainforest',
      'A crowded skyscraper city'
    ],
    correctOptionIndex: 1,
    explanation: 'The steppe is a large area of open, unforested grassland in temperate regions.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q15',
    passageId: 'u2-pass-3',
    passageTitle: 'Nomadic Hospitality on the Mongolian Steppe',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What environmental principle did Lucas learn from the nomadic family?',
    options: [
      'Building tall plastic fences everywhere',
      'Deeply respecting nature and leaving no waste behind when moving camp',
      'Cutting down forests for timber',
      'Hunting animals for sport'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage highlights that Mongolian nomads respect nature and leave no waste behind.',
    difficulty: 'challenging',
  },

  // Passage 4 Questions
  {
    id: 'g8u2-g7-q16',
    passageId: 'u2-pass-4',
    passageTitle: 'Under the Desert Stars in Morocco',
    passageText: READING_PASSAGES[3].text,
    prompt: 'What animal did Sofia and her group ride across the sand dunes?',
    options: [
      'Horses',
      'Dromedary camels',
      'Donkeys',
      'Elephants'
    ],
    correctOptionIndex: 1,
    explanation: 'The text states: "Sofia and her travel group mounted tall dromedary camels."',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q17',
    passageId: 'u2-pass-4',
    passageTitle: 'Under the Desert Stars in Morocco',
    passageText: READING_PASSAGES[3].text,
    prompt: 'How did the desert sand dunes change in appearance as the sun set?',
    options: [
      'They turned from bright gold to glowing crimson.',
      'They turned into dark green grass.',
      'They became covered in ice.',
      'They disappeared completely.'
    ],
    correctOptionIndex: 0,
    explanation: 'The text notes: "The dunes turned from bright gold to glowing crimson as darkness fell."',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q18',
    passageId: 'u2-pass-4',
    passageTitle: 'Under the Desert Stars in Morocco',
    passageText: READING_PASSAGES[3].text,
    prompt: 'What meal did the Berber guides prepare over the glowing coals at camp?',
    options: [
      'Fast food burgers and fries',
      'A steaming vegetable tagine',
      'Grilled river fish and salad',
      'Cold sandwiches'
    ],
    correctOptionIndex: 1,
    explanation: 'The text states: "Berber guides prepared a steaming vegetable tagine over glowing coals."',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q19',
    passageId: 'u2-pass-4',
    passageTitle: 'Under the Desert Stars in Morocco',
    passageText: READING_PASSAGES[3].text,
    prompt: 'In the passage, the word "spectacular" means...',
    options: [
      'Remarkably beautiful, impressive, and dramatic',
      'Very ugly and dirty',
      'Quiet and boring',
      'Extremely expensive'
    ],
    correctOptionIndex: 0,
    explanation: '"Spectacular" describes something sensational, dramatic, and striking to look at.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q20',
    passageId: 'u2-pass-4',
    passageTitle: 'Under the Desert Stars in Morocco',
    passageText: READING_PASSAGES[3].text,
    prompt: 'Why were the stars so remarkably clear and brilliant in the desert night sky?',
    options: [
      'The desert atmosphere was clean, dark, and silent with no city lights.',
      'The guides shone spotlights into the sky.',
      'Sofia wore special night-vision glasses.',
      'The camp was located inside a planetarium.'
    ],
    correctOptionIndex: 0,
    explanation: 'The absence of urban light pollution and clean dry air creates stunning night sky clarity in deserts.',
    difficulty: 'challenging',
  },

  // Passage 5 Questions
  {
    id: 'g8u2-g7-q21',
    passageId: 'u2-pass-5',
    passageTitle: 'How to Travel Like a Green Explorer',
    passageText: READING_PASSAGES[4].text,
    prompt: 'What is the central theme of this passage?',
    options: [
      'Travelling cheaply without paying for tickets.',
      'Exploring the world responsibly while protecting nature and local communities.',
      'How to become an airline pilot.',
      'The history of hotel chains.'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage focuses on sustainable tourism practices that protect nature and support locals.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q22',
    passageId: 'u2-pass-5',
    passageTitle: 'How to Travel Like a Green Explorer',
    passageText: READING_PASSAGES[4].text,
    prompt: 'According to the author, why should travellers choose trains instead of short domestic flights?',
    options: [
      'Trains produce less carbon pollution than short flights.',
      'Airplanes are not allowed to fly over cities.',
      'Train stations are always free of charge.',
      'Trains have larger swimming pools.'
    ],
    correctOptionIndex: 0,
    explanation: 'The text notes that short domestic flights produce heavy carbon pollution compared to trains.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g7-q23',
    passageId: 'u2-pass-5',
    passageTitle: 'How to Travel Like a Green Explorer',
    passageText: READING_PASSAGES[4].text,
    prompt: 'What items can eco-conscious travellers pack to reduce single-use plastic waste?',
    options: [
      'Disposable plastic cups and bags',
      'Reusable water bottles, cloth bags, and solid shampoo bars',
      'Plastic straws and paper plates',
      'Packets of plastic cutlery'
    ],
    correctOptionIndex: 1,
    explanation: 'Reusable bottles, cloth bags, and solid shampoo bars prevent plastic trash.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q24',
    passageId: 'u2-pass-5',
    passageTitle: 'How to Travel Like a Green Explorer',
    passageText: READING_PASSAGES[4].text,
    prompt: 'Why is it beneficial to eat at family-run cafes and buy from local artisan markets?',
    options: [
      'Because all international corporations are illegal.',
      'Because your spending directly supports the local community economy.',
      'Because local cafes are always open twenty-four hours a day.',
      'Because local food never contains any spices.'
    ],
    correctOptionIndex: 1,
    explanation: 'Spending money at local independent businesses ensures economic benefits stay in the community.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g7-q25',
    passageId: 'u2-pass-5',
    passageTitle: 'How to Travel Like a Green Explorer',
    passageText: READING_PASSAGES[4].text,
    prompt: 'In the passage, the word "fragile" in "fragile natural habitats" means...',
    options: [
      'Easily harmed or damaged and needing careful protection',
      'Strong, unbreakable, and everlasting',
      'Extremely noisy and crowded',
      'Expensive to purchase'
    ],
    correctOptionIndex: 0,
    explanation: '"Fragile" describes ecosystems that are delicate and easily damaged by human disruption.',
    difficulty: 'challenging',
  },
];
