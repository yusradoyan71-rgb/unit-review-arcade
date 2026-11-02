import type { MultipleChoiceQuestion } from '../../../types/schema';

export const GAME_5_QUESTIONS: MultipleChoiceQuestion[] = [
  {
    id: 'g8u2-g5-t01',
    prompt: 'You arrive at the airport departure gate, but the doors are closed and the plane has already pushed back. What happened?',
    options: [
      'You missed your flight.',
      'Your flight took off early.',
      'You lost your passport.',
      'The airline upgraded your seat.'
    ],
    correctOptionIndex: 0,
    explanation: 'Arriving after the departure gate has closed means you missed your scheduled flight.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t02',
    prompt: 'You are driving along a quiet country road when you hear a loud pop and the car pulls strongly to one side. What happened?',
    options: [
      'You ran out of petrol.',
      'You got a flat tyre.',
      'The car was stolen.',
      'You missed the motorway exit.'
    ],
    correctOptionIndex: 1,
    explanation: 'A sudden loud pop and steering pull indicates a punctured or flat tyre.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t03',
    prompt: 'You stand at the airport luggage carousel for an hour, but the belt stops and your suitcase is nowhere to be seen. What happened?',
    options: [
      'The airline lost your luggage.',
      'You checked in too early.',
      'Your flight landed at the wrong airport.',
      'Your luggage was upgraded.'
    ],
    correctOptionIndex: 0,
    explanation: 'When your bags fail to appear at baggage reclaim, your luggage has been delayed or lost by the airline.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t04',
    prompt: 'You want to buy lunch at a small village market, but they only accept cash and your wallet has no banknotes left. What happened?',
    options: [
      'You ran out of money.',
      'The food market was closed.',
      'You missed your train.',
      'Your passport expired.'
    ],
    correctOptionIndex: 0,
    explanation: '"Run out of money" means having spent all your cash so that none remains.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t05',
    prompt: 'The highway is completely blocked with hundreds of motionless vehicles as far as the eye can see. What happened?',
    options: [
      'You arrived at your destination.',
      'You got stuck in a traffic jam.',
      'You found a shortcut.',
      'The road was turned into a pedestrian path.'
    ],
    correctOptionIndex: 1,
    explanation: 'A gridlock of stopped cars on a road is called a traffic jam or traffic congestion.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t06',
    prompt: 'You walk down winding streets in an ancient old town, but none of the street signs match your map. What happened?',
    options: [
      'You got lost.',
      'You booked a hotel room.',
      'You caught the express bus.',
      'You avoided the crowd.'
    ],
    correctOptionIndex: 0,
    explanation: 'Not knowing where you are or how to return to your hotel means you got lost.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t07',
    prompt: 'The airport departure screen shows your 14:00 flight with a bright notice reading "Estimated Departure: 18:30". What happened?',
    options: [
      'Your flight was cancelled.',
      'Your flight was delayed.',
      'Your flight arrived early.',
      'Your luggage was checked in.'
    ],
    correctOptionIndex: 1,
    explanation: 'A later departure time indicates that your flight has suffered a schedule delay.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t08',
    prompt: 'White smoke begins pouring from under the bonnet of the rental car and the engine suddenly stops running. What happened?',
    options: [
      'The car broke down.',
      'The car ran out of air.',
      'The car was parked safely.',
      'The car took off.'
    ],
    correctOptionIndex: 0,
    explanation: 'When a mechanical failure stops a vehicle from moving, it has broken down.',
    difficulty: 'easy',
  },
  {
    id: 'g8u2-g5-t09',
    prompt: 'You arrive at the platform at 08:35, but the morning train departed at 08:30. What should you do next?',
    options: [
      'Jump onto the railway tracks.',
      'Go to the customer desk and check the time of the next train.',
      'Walk along the railway line to catch the train.',
      'Forget about your journey and go back to sleep.'
    ],
    correctOptionIndex: 1,
    explanation: 'The sensible response is to speak to railway staff and find out when the next service leaves.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t10',
    prompt: 'After arriving at the airport for an international flight, you realize your passport is still in the hotel safe. What is the primary problem?',
    options: [
      'You cannot pass through international passport control without it.',
      'Your hotel will charge you extra money.',
      'The flight pilot cannot take off.',
      'Your luggage will become too light.'
    ],
    correctOptionIndex: 0,
    explanation: 'International travel strictly requires valid travel identification at border control checkpoints.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t11',
    prompt: 'You arrive at your hotel at midnight, but the manager says all rooms are full despite your booking confirmation. What happened?',
    options: [
      'The hotel was overbooked.',
      'The hotel was closed for renovations.',
      'The hotel gave you a discount.',
      'You booked a flight ticket instead.'
    ],
    correctOptionIndex: 0,
    explanation: '"Overbooked" means the hotel accepted more reservations than the number of available rooms.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t12',
    prompt: 'A violent snowstorm blocks every mountain road and suspends all rail services. What is your situation?',
    options: [
      'You are enjoying sunny sightseeing.',
      'You are stranded because of severe weather conditions.',
      'You have arrived at your destination on foot.',
      'You missed your flight due to oversleeping.'
    ],
    correctOptionIndex: 1,
    explanation: 'Being "stranded" means unable to leave or travel onwards due to circumstances beyond your control.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t13',
    prompt: 'You reach the summit of a steep hiking trail at sunset with no torch and 1% mobile battery. What was the mistake?',
    options: [
      'You planned your hike with proper safety equipment.',
      'You failed to plan your timing and pack essential safety gear.',
      'You bought a map from the visitor centre.',
      'You wore hiking boots.'
    ],
    correctOptionIndex: 1,
    explanation: 'Poor planning and lack of essential safety equipment leads to dangerous wilderness situations.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t14',
    prompt: 'You eat uncovered street food left out in the hot sun and spend the next day in bed with stomach cramps. What happened?',
    options: [
      'You caught food poisoning.',
      'You got seasickness.',
      'You had an exciting cultural adventure.',
      'You got stuck in traffic.'
    ],
    correctOptionIndex: 0,
    explanation: 'Eating contaminated or spoiled food causes food poisoning and illness.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t15',
    prompt: 'You are travelling abroad and need to buy a bus ticket, but nobody speaks your native language. What is the most effective approach?',
    options: [
      'Shout loudly in your language until someone obeys.',
      'Use a translation app, polite body language, or simple English.',
      'Leave the station and walk 50 miles.',
      'Start crying and refuse to move.'
    ],
    correctOptionIndex: 1,
    explanation: 'Digital translation tools and polite, clear communication help bridge language barriers effectively.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t16',
    prompt: 'Your airline cancels your flight due to technical issues, leaving you stuck overnight. What should the airline provide?',
    options: [
      'A free rental car and petrol.',
      'Complimentary hotel accommodation, meals, or a ticket refund.',
      'Nothing, because travel is always risky.',
      'A permanent job at the airport.'
    ],
    correctOptionIndex: 1,
    explanation: 'Aviation consumer rights require airlines to provide care (hotel, food, alternative flight) during long cancellations.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t17',
    prompt: 'You rush onto a train without checking the destination board, and notice it is heading north instead of south. What happened?',
    options: [
      'You boarded the wrong train.',
      'The train changed direction mid-journey.',
      'Your train arrived early.',
      'You booked an express ticket.'
    ],
    correctOptionIndex: 0,
    explanation: 'Getting on a train that goes to an unintended destination means you boarded the wrong train.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t18',
    prompt: 'While walking through a crowded tourist market, someone stealthily steals your purse from your open backpack. What happened?',
    options: [
      'You were pickpocketed.',
      'You booked a guided tour.',
      'You bought a souvenir.',
      'You got a flat tyre.'
    ],
    correctOptionIndex: 0,
    explanation: 'A "pickpocket" steals money and valuables from pockets or bags in busy public places without being noticed.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t19',
    prompt: 'A coastal weather alert warns of a dangerous sea storm with gale-force winds. What is the responsible decision for your boat trip?',
    options: [
      'Set sail immediately to test the storm.',
      'Cancel or postpone the boat trip and remain safely ashore.',
      'Turn off the boat radio and sail faster.',
      'Ignore the maritime authorities.'
    ],
    correctOptionIndex: 1,
    explanation: 'Safety always comes first in extreme maritime weather conditions.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t20',
    prompt: 'You packed a large 250ml bottle of liquid shampoo in your airport cabin bag. What will airport security do?',
    options: [
      'Allow you to drink it on the plane.',
      'Confiscate it because liquids in hand luggage must not exceed 100ml.',
      'Give you an award for carrying clean luggage.',
      'Put it in the aircraft cockpit.'
    ],
    correctOptionIndex: 1,
    explanation: 'Aviation security rules limit carry-on liquids to containers of 100ml or less.',
    difficulty: 'medium',
  },
  {
    id: 'g8u2-g5-t21',
    prompt: 'The chain on your rented bicycle snaps while riding up a steep hill far from town. What should you do?',
    options: [
      'Throw the bicycle into the nearest river.',
      'Contact the bike rental company and walk safely to the nearest repair station.',
      'Sit on the grass and wait for nightfall.',
      'Ride the bicycle without a chain.'
    ],
    correctOptionIndex: 1,
    explanation: 'Contacting the rental provider or finding a repair shop is the practical and responsible solution.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u2-g5-t22',
    prompt: 'You arrive at a historic art gallery on Monday, but the entrance is locked with a sign: "Closed on Mondays". What went wrong?',
    options: [
      'The gallery was permanently demolished.',
      'You forgot to verify the gallery opening days and hours in advance.',
      'You were banned from the city.',
      'You missed your flight.'
    ],
    correctOptionIndex: 1,
    explanation: 'Checking opening schedules beforehand prevents disappointment when visiting tourist attractions.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u2-g5-t23',
    prompt: 'A sudden rockfall blocks the railway line between two cities. How will the railway company transport passengers?',
    options: [
      'They will provide replacement bus services to complete the journey.',
      'They will ask passengers to walk 100 kilometres.',
      'They will cancel all future trains forever.',
      'They will sell the passengers\' luggage.'
    ],
    correctOptionIndex: 0,
    explanation: 'Rail replacement buses are standard contingency transport when tracks are obstructed.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u2-g5-t24',
    prompt: 'During a rough six-hour ferry crossing over turbulent sea waves, you feel intensely nauseous and dizzy. What are you experiencing?',
    options: [
      'Seasickness',
      'Sunburn',
      'Food poisoning',
      'Jet lag'
    ],
    correctOptionIndex: 0,
    explanation: 'Motion sickness caused by the rocking movement of a boat or ship on water is called seasickness.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u2-g5-t25',
    prompt: 'A security guard stops you at the entrance of a sacred historic temple because you are wearing swimwear. Why?',
    options: [
      'Tourists must respect cultural and religious dress codes in sacred places.',
      'Only local citizens are allowed to enter temples.',
      'The temple is actually a swimming pool.',
      'You need a passport to enter every room.'
    ],
    correctOptionIndex: 0,
    explanation: 'Responsible tourists respect local traditions, customs, and modest dress requirements at cultural and religious sites.',
    difficulty: 'challenging',
  },
];
