import type { MultipleChoiceQuestion } from '../../../types/schema';

export const GAME_7_ULTIMATE_QUESTIONS: MultipleChoiceQuestion[] = [
  {
    id: 'g8u1-g7-q01',
    prompt: 'Which sentence correctly follows English preference rules?',
    options: [
      'I prefer jazz than rock music.',
      'I prefer jazz to rock music.',
      'I prefer jazz over to rock music.',
      'I prefer jazz more than to rock.'
    ],
    correctOptionIndex: 1,
    explanation: 'We use the pattern "prefer A to B" (not "than").',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q02',
    prompt: 'Which instrument belongs to the brass family and has three finger valves?',
    options: ['Clarinet', 'Trumpet', 'Violin', 'Flute'],
    correctOptionIndex: 1,
    explanation: 'The trumpet is a quintessential brass instrument with three valves.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q03',
    prompt: '"The melody was so ________ that everyone in the café was tapping their fingers to the rhythm."',
    options: ['Catchy', 'Depressing', 'Silent', 'Hostile'],
    correctOptionIndex: 0,
    explanation: '"Catchy" describes a memorable, infectious tune that sticks with the listener.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q04',
    prompt: 'Choose the correct form: "She enjoys ________ the acoustic guitar before going to sleep."',
    options: ['to play', 'playing', 'play', 'played'],
    correctOptionIndex: 1,
    explanation: '"Enjoy" is always followed by a gerund (-ing form).',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q05',
    prompt: 'What do we call the written words of a song?',
    options: ['Melody', 'Tempo', 'Lyrics', 'Score'],
    correctOptionIndex: 2,
    explanation: 'The poetic text or words of a song are called lyrics.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q06',
    prompt: 'In a musical theatre production, what happens when emotions become too intense for spoken words alone?',
    options: [
      'The actors sit down and read a book.',
      'The orchestra swells and the characters express themselves through song.',
      'The lights are turned off and the show ends abruptly.',
      'The director stops the show to give a lecture.'
    ],
    correctOptionIndex: 1,
    explanation: 'Musical theatre uses song and choreography when spoken dialogue is no longer sufficient to convey deep feelings.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q07',
    prompt: 'Which response expresses complete agreement in a discussion?',
    options: [
      "I'm afraid I disagree.",
      "I completely agree with you.",
      "I don't think that's right.",
      "I see what you mean, but..."
    ],
    correctOptionIndex: 1,
    explanation: '"I completely agree with you" signals 100% consensus.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q08',
    prompt: 'Which musical genre originated in African American communities in New Orleans, celebrated for syncopation and brass solos?',
    options: ['Jazz', 'Opera', 'Heavy metal', 'Country'],
    correctOptionIndex: 0,
    explanation: 'Jazz was born in New Orleans in the early 20th century, famous for brass instruments and improvisation.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q09',
    prompt: '"I would rather ________ a live concert than stream it on a smartphone screen."',
    options: ['attending', 'to attend', 'attend', 'attended'],
    correctOptionIndex: 2,
    explanation: '"Would rather" takes a bare infinitive without "to" ("attend").',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q10',
    prompt: 'Who directs the musicians in an orchestra during a symphonic performance?',
    options: ['The composer', 'The conductor', 'The lyricist', 'The producer'],
    correctOptionIndex: 1,
    explanation: 'The conductor guides the orchestra, keeping the tempo and balance.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g7-q11',
    prompt: 'Which linking word fits best? "The concert was outdoors, ________ it rained, the crowd continued dancing."',
    options: ['because', 'although', 'so', 'since'],
    correctOptionIndex: 1,
    explanation: '"Although" introduces a contrast or unexpected circumstance.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q12',
    prompt: 'Which instrument has black and white keys that cause internal hammers to strike tuned steel strings?',
    options: ['Electric bass', 'Piano', 'Cello', 'Clarinet'],
    correctOptionIndex: 1,
    explanation: 'The acoustic piano produces sound via felt hammers striking internal strings.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q13',
    prompt: '"I\'m really into electronic music." What does "really into" mean?',
    options: [
      'Extremely enthusiastic about and interested in it',
      'Confused and frightened by it',
      'Unable to understand its rhythm',
      'Forced to listen to it against my will'
    ],
    correctOptionIndex: 0,
    explanation: 'To be "into" something means to have a strong passion and liking for it.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q14',
    prompt: 'Which genre originated in Jamaica with distinctive offbeat rhythm accents?',
    options: ['Blues', 'Reggae', 'Folk', 'Techno'],
    correctOptionIndex: 1,
    explanation: 'Reggae originated in Jamaica in the late 1960s with iconic rhythms.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q15',
    prompt: 'Which adjective best describes a lively, optimistic rhythm that lifts everyone\'s energy?',
    options: ['Melancholy', 'Upbeat', 'Dull', 'Repetitive'],
    correctOptionIndex: 1,
    explanation: '"Upbeat" signifies cheerful, lively, and encouraging musical tempo.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q16',
    prompt: 'Choose the grammatically correct question:',
    options: [
      'What kind of music do you like to listen?',
      'What kind of music do you like listening to?',
      'Which music you are liking listen?',
      'How do you like to music listen?'
    ],
    correctOptionIndex: 1,
    explanation: '"What kind of music do you like listening to?" correctly includes the required preposition "to".',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q17',
    prompt: 'The cello is larger than the violin and produces notes that are...',
    options: ['much higher and squeaky', 'deeper and lower-pitched', 'completely silent', 'too fast to hear'],
    correctOptionIndex: 1,
    explanation: 'The cello has a larger resonant cavity and thicker strings, giving it rich, low-pitched notes.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q18',
    prompt: 'How can you politely disagree with someone\'s musical opinion?',
    options: [
      "Your opinion is completely stupid.",
      "I see your point, however I have a different opinion.",
      "You don't know anything about music.",
      "Shut up and listen to me."
    ],
    correctOptionIndex: 1,
    explanation: '"I see your point, however I have a different opinion" is the diplomatic and respectful English standard.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q19',
    prompt: 'Which word describes a person who writes original symphonies, operas, or chamber music?',
    options: ['Drummer', 'Composer', 'Conductor', 'Critic'],
    correctOptionIndex: 1,
    explanation: 'A composer writes original musical scores.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q20',
    prompt: 'Which sentence uses a comparative adjective correctly?',
    options: [
      'Heavy metal is more loud than folk music.',
      'Heavy metal is louder than folk music.',
      'Heavy metal is loud than folk music.',
      'Heavy metal is as loud than folk music.'
    ],
    correctOptionIndex: 1,
    explanation: 'One-syllable adjectives like "loud" take "-er" ("louder than").',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q21',
    prompt: 'What is a key difference between acoustic and electric guitars?',
    options: [
      'Acoustic guitars have no strings.',
      'Electric guitars require electronic amplification to produce full-volume sound.',
      'Acoustic guitars can only be played with drumsticks.',
      'Electric guitars do not have any frets or tuning pegs.'
    ],
    correctOptionIndex: 1,
    explanation: 'Electric guitars use electromagnetic pickups and require an external amplifier and speaker.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q22',
    prompt: 'The repeating musical section between verses that contains the title and main hook is the...',
    options: ['Bridge', 'Chorus', 'Intro', 'Outro'],
    correctOptionIndex: 1,
    explanation: 'The chorus contains the core melody and repeating theme.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q23',
    prompt: '"I can\'t stand heavy metal because the distorted noise gives me a headache." What does "can\'t stand" indicate?',
    options: [
      'Intense dislike and intolerance',
      'Great excitement and passion',
      'The inability to stand up physically',
      'A desire to buy concert tickets'
    ],
    correctOptionIndex: 0,
    explanation: '"Can\'t stand" idiomatically expresses deep aversion or intolerance.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q24',
    prompt: 'How has digital audio workstation (DAW) software affected young musicians?',
    options: [
      'It made it illegal to play instruments at home.',
      'It enabled artists to record, produce, and share music from their bedrooms.',
      'It made guitars and pianos completely obsolete.',
      'It caused all record companies to disappear overnight.'
    ],
    correctOptionIndex: 1,
    explanation: 'DAWs empower independent artists to produce professional quality tracks with modest equipment.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q25',
    prompt: 'Which word describes songs that convey profound thoughts about society, love, or life?',
    options: ['Meaningful', 'Repetitive', 'Monotone', 'Senseless'],
    correctOptionIndex: 0,
    explanation: '"Meaningful" lyrics hold deep philosophical or emotional substance.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g7-q26',
    prompt: 'Complete the sentence with the correct parallel structure: "She prefers ________ in the choir to ________ in the school orchestra."',
    options: [
      'sing / playing',
      'singing / playing',
      'to sing / play',
      'singing / to play'
    ],
    correctOptionIndex: 1,
    explanation: '"Prefer [gerund] to [gerund]" requires parallel gerund forms on both sides of "to".',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g7-q27',
    prompt: 'Why do youth orchestras featuring musicians from conflicting nations hold symbolic power for world peace?',
    options: [
      'Because the musicians are required to speak the same language.',
      'Because creating harmonious music together demonstrates that cooperation and empathy transcend political borders.',
      'Because they only perform without an audience.',
      'Because ticket sales pay for military equipment.'
    ],
    correctOptionIndex: 1,
    explanation: 'Music functions as a non-verbal bridge of empathy, proving diverse groups can create harmony together.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g7-q28',
    prompt: 'Which single-reed woodwind instrument has a cylindrical bore and is prominent in both classical concerts and Benny Goodman jazz?',
    options: ['Clarinet', 'Trumpet', 'Cello', 'Triangle'],
    correctOptionIndex: 0,
    explanation: 'The clarinet is a single-reed woodwind instrument with a cylindrical bore and wide dynamic range.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g7-q29',
    prompt: '"The best thing about live concerts is the collective energy of the crowd." What function does this phrase serve?',
    options: [
      'Expressing a strong positive opinion and highlighting a standout feature',
      'Asking for an explanation of ticket prices',
      'Apologizing for being late to the arena',
      'Warning about loud audio volume'
    ],
    correctOptionIndex: 0,
    explanation: '"The best thing about [X] is..." evaluates and spotlights the most compelling aspect of an experience.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g7-q30',
    prompt: 'Identify the grammatically correct sentence using "would rather":',
    options: [
      'I would rather listening to classical music than study in silence.',
      'I would rather listen to classical music than study in silence.',
      'I would rather to listen classical music than to study.',
      'I would rather listen classical music to studying.'
    ],
    correctOptionIndex: 1,
    explanation: '"Would rather [bare verb] ... than [bare verb] ..." is the accurate grammatical formula.',
    difficulty: 'challenging',
  },
];
