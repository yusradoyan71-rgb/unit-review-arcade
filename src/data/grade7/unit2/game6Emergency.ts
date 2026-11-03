import type { MultipleChoiceQuestion } from '../../../types/schema';

export const GAME_6_DIALOGUES: MultipleChoiceQuestion[] = [
  // 1. Initial Operator Greeting
  {
    id: 'g7-u2-em01',
    prompt: `Operator: "Emergency operator. ________?"\nCaller: "Ambulance, please! A hiker fell off the mountain trail."`,
    options: [
      'Which service do you require?',
      'Why are you calling me?',
      'How much money do you have?',
      'When did you arrive?',
    ],
    correctOptionIndex: 0,
    explanation: '"Which service do you require?" is the standard question to determine whether police, ambulance, or fire service is needed.',
    difficulty: 'easy',
  },

  // 2. Asking Nature of Emergency
  {
    id: 'g7-u2-em02',
    prompt: `Operator: "Fire and Rescue. ________?"\nCaller: "There is a forest fire spreading rapidly towards the pine forest behind our village!"`,
    options: [
      'What is the nature of your emergency?',
      'Do you like fighting fires?',
      'How old are you?',
      'Can you put out the fire yourself?',
    ],
    correctOptionIndex: 0,
    explanation: '"What is the nature of your emergency?" asks the caller to describe what happened.',
    difficulty: 'easy',
  },

  // 3. Location Inquiry
  {
    id: 'g7-u2-em03',
    prompt: `Operator: "________?"\nCaller: "We are at kilometre 14 on the Mountain Pass road, near the waterfall."`,
    options: [
      'Where are you calling from?',
      'What time does the bus leave?',
      'How is the weather today?',
      'Who is your English teacher?',
    ],
    correctOptionIndex: 0,
    explanation: '"Where are you calling from?" establishes the caller\'s exact geographical location for dispatch.',
    difficulty: 'easy',
  },

  // 4. Calming the Caller
  {
    id: 'g7-u2-em04',
    prompt: `Caller: "Help! Water is entering the ground floor! We don’t know what to do!"\nOperator: "________. Stay on the line with me. Move to the upper floor immediately."`,
    options: [
      'Try to stay calm',
      'You should start screaming',
      'Jump into the river',
      'Hang up the telephone',
    ],
    correctOptionIndex: 0,
    explanation: '"Try to stay calm" helps panic-stricken callers listen to life-saving instructions.',
    difficulty: 'easy',
  },

  // 5. Reporting Injuries
  {
    id: 'g7-u2-em05',
    prompt: `Operator: "Is anyone hurt at the scene?"\nCaller: "Yes, ________. He broke his arm and cannot walk."`,
    options: [
      'someone is injured',
      'everyone is having lunch',
      'the weather is gorgeous',
      'we are watching TV',
    ],
    correctOptionIndex: 0,
    explanation: '"Someone is injured" immediately communicates that medical paramedics are needed.',
    difficulty: 'easy',
  },

  // 6. Choosing the Right Emergency Service: Fire
  {
    id: 'g7-u2-em06',
    prompt: `Caller: "Lightning struck our wooden barn and thick black smoke is pouring from the roof!"\nWhich emergency service should the operator dispatch immediately?`,
    options: [
      'Fire and Rescue service',
      'Coastguard service',
      'Traffic police',
      'Mountain ski patrol',
    ],
    correctOptionIndex: 0,
    explanation: 'A burning barn requires the Fire and Rescue service to extinguish flames and prevent structural collapse.',
    difficulty: 'easy',
  },

  // 7. Choosing the Right Emergency Service: Coastguard
  {
    id: 'g7-u2-em07',
    prompt: `Caller: "A small fishing boat has overturned in rough waves two miles off the rocky coast!"\nWhich specialized service is required?`,
    options: [
      'Coastguard and Maritime Rescue',
      'Forestry department',
      'City ambulance only',
      'Highway patrol',
    ],
    correctOptionIndex: 0,
    explanation: 'Maritime emergencies at sea require the Coastguard and lifeboat rescue teams.',
    difficulty: 'easy',
  },

  // 8. Emergency Number in Turkey
  {
    id: 'g7-u2-em08',
    prompt: `In Turkey and across European unified networks, which single emergency telephone number connects you to all emergency services?`,
    options: ['112', '911', '999', '000'],
    correctOptionIndex: 0,
    explanation: 'In Turkey, 112 is the unified emergency call number connecting police, ambulance, and fire services.',
    difficulty: 'easy',
  },

  // 9. Reporting an Avalanche
  {
    id: 'g7-u2-em09',
    prompt: `Caller: "I am calling to ________. An avalanche swept across the ski trail near the summit!"`,
    options: [
      'report a serious disaster',
      'reserve a ski ticket',
      'order some hot chocolate',
      'ask for the time',
    ],
    correctOptionIndex: 0,
    explanation: '"I am calling to report..." is the standard formal opening when reporting an emergency.',
    difficulty: 'easy',
  },

  // 10. Assuring that Help is Coming
  {
    id: 'g7-u2-em10',
    prompt: `Caller: "How long will the paramedics take? My brother is bleeding."\nOperator: "The ambulance has been dispatched and ________. Keep pressure on the wound."`,
    options: [
      'help is on its way',
      'you should walk home',
      'nobody is available',
      'it is not our problem',
    ],
    correctOptionIndex: 0,
    explanation: '"Help is on its way" reassures the caller while providing first-aid guidance.',
    difficulty: 'easy',
  },

  // 11. Asking if Everyone is Safe
  {
    id: 'g7-u2-em11',
    prompt: `Operator: "The earthquake stopped two minutes ago. ________?"\nCaller: "Yes, our family is outside in the courtyard and nobody is hurt."`,
    options: [
      'Is everybody safe',
      'Did you finish dinner',
      'What colour is your roof',
      'Are you watching the news',
    ],
    correctOptionIndex: 0,
    explanation: '"Is everybody safe?" checks for human casualties after a seismic tremor.',
    difficulty: 'easy',
  },

  // 12. Reporting Downed Power Lines
  {
    id: 'g7-u2-em12',
    prompt: `Caller: "A gale-force wind blew a tree onto high-voltage electrical cables on Elm Street."\nOperator: "Understood. ________! Do not touch the cables because they could be live."`,
    options: [
      'Keep everyone far away from the wires',
      'Cut the wires with scissors',
      'Climb the fallen tree',
      'Pour water over the power lines',
    ],
    correctOptionIndex: 0,
    explanation: 'Downed electrical cables carry deadly voltage; keeping away prevents electrocution.',
    difficulty: 'medium',
  },

  // 13. Reporting Trapped People
  {
    id: 'g7-u2-em13',
    prompt: `Caller: "Part of the ceiling collapsed during the tremor and two workers ________ inside the office."`,
    options: [
      'are trapped',
      'are sleeping peacefully',
      'have escaped already',
      'are on holiday abroad',
    ],
    correctOptionIndex: 0,
    explanation: '"Are trapped" indicates that victims cannot exit on their own and require extrication.',
    difficulty: 'easy',
  },

  // 14. Ordering Dialogue Lines
  {
    id: 'g7-u2-em14',
    prompt: `What is the most logical order for these emergency call phrases?\n(1) "Help is on the way."\n(2) "112, which service do you need?"\n(3) "Ambulance! A car crashed on Green Road."`,
    options: ['(2) → (3) → (1)', '(1) → (3) → (2)', '(3) → (1) → (2)', '(2) → (1) → (3)'],
    correctOptionIndex: 0,
    explanation: 'The operator answers first (2), the caller describes the need (3), and the operator dispatches help (1).',
    difficulty: 'medium',
  },

  // 15. Flooded Road Warning
  {
    id: 'g7-u2-em15',
    prompt: `Caller: "Water is rising fast across the bridge. Can we drive across?"\nOperator: "No, ________! Fast-moving floodwater can easily wash your vehicle away."`,
    options: [
      'do not attempt to drive through floodwater',
      'drive as fast as possible',
      'turn off your headlights and wait',
      'leave your car doors open',
    ],
    correctOptionIndex: 0,
    explanation: 'Driving into floodwater is the leading cause of flood-related fatalities.',
    difficulty: 'easy',
  },

  // 16. Reporting Animal in Distress
  {
    id: 'g7-u2-em16',
    prompt: `Caller: "I am hiking in the nature reserve and I found an injured deer caught in a wire snare."\nWhich authority should the operator contact?`,
    options: [
      'Wildlife protection and forestry rangers',
      'City traffic police',
      'The coastguard station',
      'A local car repair garage',
    ],
    correctOptionIndex: 0,
    explanation: 'Trapped and injured wildlife in reserves are handled by park and wildlife rangers.',
    difficulty: 'easy',
  },

  // 17. Describing Smoke and Gas Leak
  {
    id: 'g7-u2-em17',
    prompt: `Caller: "We smell strong cooking gas in the stairwell after the tremor."\nOperator: "Evacuate the building immediately and ________!"`,
    options: [
      'do not turn on any electrical switches or matches',
      'light a candle to check the meter',
      'lock all the corridor doors',
      'use the electric elevator',
    ],
    correctOptionIndex: 0,
    explanation: 'A spark from an electrical switch can ignite a gas leak, causing an explosion.',
    difficulty: 'medium',
  },

  // 18. Confirming Address
  {
    id: 'g7-u2-em18',
    prompt: `Operator: "Can you confirm the exact street name and building number?"\nWhy does the operator ask this question?`,
    options: [
      'To ensure emergency responders arrive at the right location without delay',
      'To send a postal letter to the caller next week',
      'To charge the caller for the phone call',
      'To see if the caller has paid their taxes',
    ],
    correctOptionIndex: 0,
    explanation: 'Accurate location details are essential for emergency vehicles to navigate directly to the scene.',
    difficulty: 'easy',
  },

  // 19. Providing First Aid Instructions
  {
    id: 'g7-u2-em19',
    prompt: `Caller: "The patient is breathing, but unconscious."\nOperator: "Gently turn them onto their side in the recovery position and ________."`,
    options: [
      'keep their airway clear and open',
      'give them a large glass of hot milk',
      'shake them vigorously by the shoulders',
      'walk away and leave them alone',
    ],
    correctOptionIndex: 0,
    explanation: 'The recovery position keeps an unconscious person\'s airway clear from obstruction.',
    difficulty: 'medium',
  },

  // 20. Reporting a Lost Person
  {
    id: 'g7-u2-em20',
    prompt: `Caller: "Our friend went trail running in the national park at 3 PM and hasn\'t returned. It is now pitch dark."\nOperator: "________. Mountain rescue teams with search dogs are being mobilized."`,
    options: [
      'Stay at the park entrance so our team can find you',
      'Go searching alone into the dark forest',
      'Turn off your mobile phone to save battery',
      'Wait three days before calling again',
    ],
    correctOptionIndex: 0,
    explanation: 'Remaining at a known location enables rescue coordinators to establish contact with the reporting party.',
    difficulty: 'medium',
  },

  // 21. Natural Disaster Alert
  {
    id: 'g7-u2-em21',
    prompt: `Caller: "A tsunami warning was broadcast on the radio. What should we do?"\nOperator: "Move ________ to high ground or to the top floors of a reinforced concrete building."`,
    options: ['immediately', 'next weekend', 'slowly and casually', 'towards the beach'],
    correctOptionIndex: 0,
    explanation: 'Tsunamis move rapidly; immediate vertical or inland evacuation is required.',
    difficulty: 'easy',
  },

  // 22. Checking Details
  {
    id: 'g7-u2-em22',
    prompt: `Operator: "Tell me what happened."\nCaller: "________. Two cars collided at the crossroads and one driver cannot get out."`,
    options: [
      'There has been a serious traffic collision',
      'We are cooking dinner for friends',
      'The sky is very blue today',
      'I want to purchase a new vehicle',
    ],
    correctOptionIndex: 0,
    explanation: 'The caller provides a concise summary of the collision and the trapped driver.',
    difficulty: 'easy',
  },

  // 23. Requesting Description
  {
    id: 'g7-u2-em23',
    prompt: `Operator: "What clothes is the missing hiker wearing?"\nWhy is this information important for search teams?`,
    options: [
      'It helps searchers spot the person visually from helicopters or trails',
      'To check if the hiker follows fashion trends',
      'To decide what price to charge for the rescue',
      'To sell new jackets in the national park shop',
    ],
    correctOptionIndex: 0,
    explanation: 'Clothing color and description are vital identifiers during aerial and ground searches.',
    difficulty: 'easy',
  },

  // 24. Reassurance
  {
    id: 'g7-u2-em24',
    prompt: `Caller: "We can hear the sirens in the distance now!"\nOperator: "Excellent. ________. Responders will take over from here."`,
    options: [
      'Wave your arms so they see you as they arrive',
      'Run into the burning building to get your bag',
      'Hang up and go back to sleep',
      'Turn off all the lights outside',
    ],
    correctOptionIndex: 0,
    explanation: 'Guiding responders with visible signals helps them identify the exact house quickly.',
    difficulty: 'easy',
  },

  // 25. Concluding Call
  {
    id: 'g7-u2-em25',
    prompt: `Operator: "Stay on the line until the paramedics knock on your door."\nWhy should the caller stay on the line?`,
    options: [
      'To give ongoing updates if the patient\'s condition changes',
      'Because operators enjoy having long chats',
      'To listen to recorded music',
      'To test the telephone line quality',
    ],
    correctOptionIndex: 0,
    explanation: 'Maintaining open communication allows the dispatcher to provide real-time first-aid instructions.',
    difficulty: 'medium',
  },
];
