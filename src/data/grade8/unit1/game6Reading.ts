import type { ReadingPassageQuestion } from '../../../types/schema';

export interface ReadingPassageData {
  id: string;
  title: string;
  wordCount: number;
  text: string;
}

export const READING_PASSAGES: ReadingPassageData[] = [
  // Passage 1: Music and Peace
  {
    id: 'pass-1',
    title: 'The Universal Language of Harmony',
    wordCount: 122,
    text: `Music is often called the universal language because it transcends borders, spoken words, and cultural differences. Centuries ago, travelers carried folk songs across mountains and oceans, sharing tales of hope, love, and courage. Today, international youth orchestras bring musicians from countries in conflict together on one stage. When an Israeli cellist and a Palestinian violinist perform Beethoven in complete harmony, the music sends a message louder than political speeches. Audiences often weep with joy as diverse melodies merge into a unified symphony. Science confirms that when people sing or play instruments together, their heartbeats synchronize, creating a profound sense of unity. Music does not merely entertain; it builds bridges of empathy and peace across divided communities worldwide.`,
  },

  // Passage 2: The Magic of Musical Theatre
  {
    id: 'pass-2',
    title: 'Behind the Curtains of Musical Theatre',
    wordCount: 128,
    text: `Stepping into a musical theatre is like entering a vibrant world where dialogue, dance, and melody blend seamlessly. Unlike ordinary plays where actors only speak, a musical reveals characters' innermost emotions through powerful songs. When words are no longer sufficient to convey grief, joy, or ambition, the orchestra swells, and the actors burst into melody. Behind the glittering spotlights, hundreds of professionals work tirelessly. In the orchestra pit below the stage, musicians follow the conductor's baton, carefully timing every note with the actors' choreography above. Stage crew members swiftly maneuver elaborate backdrops in total darkness between scenes. A successful musical leaves audiences breathless, hummed choruses lingering in their minds long after the velvet curtains close and the auditorium empties.`,
  },

  // Passage 3: Technology and Modern Music
  {
    id: 'pass-3',
    title: 'Beats in the Digital Age',
    wordCount: 131,
    text: `Fifty years ago, recording an album required massive recording studios, expensive tape machines, and teams of audio engineers. Today, modern music production has been transformed by digital technology. With a simple laptop, a midi keyboard, and digital audio workstation software, a teenager can produce chart-topping tracks in their bedroom. Digital synthesizers can replicate the rich warmth of a grand piano or generate futuristic electronic beats never heard before. Furthermore, streaming platforms and video apps allow independent musicians to share their songs globally without signing restrictive record deals. However, some traditionalists argue that software-produced music lacks the raw emotional warmth of live acoustic performances. Nonetheless, technology has undeniably democratized musical creativity, giving young storytellers worldwide the tools to find their unique voice.`,
  },

  // Passage 4: Passion of a Young Musician
  {
    id: 'pass-4',
    title: 'The Voice of the Cello',
    wordCount: 126,
    text: `Fourteen-year-old Maya began playing the cello when she was only seven years old. While most of her classmates chose the electric guitar or drums, Maya was immediately captivated by the deep, warm resonance of the cello. "The cello is the closest instrument to the human speaking voice," Maya explains with a smile. Mastering the instrument requires intense discipline and patience. Maya practices two hours every afternoon, gently pressing the steel strings against the ebony fingerboard and drawing the horsehair bow across with delicate precision. Last month, Maya won first prize at the National Youth Soloist Competition. Sitting under the warm auditorium lights, she poured her entire soul into Elgar’s Cello Concerto, earning a standing ovation from the spellbound audience.`,
  },

  // Passage 5: The Live Concert Experience
  {
    id: 'pass-5',
    title: 'Under the Arena Lights',
    wordCount: 125,
    text: `There is an electrifying energy in a stadium before a live concert begins. Thousands of fans gather, clutching glowsticks, wearing band t-shirts, and chatting animatedly in anticipation. Suddenly, the arena lights plunge into total darkness. A roaring cheer erupts from thirty thousand voices. Giant video screens illuminate the stage as the drummer hits a thunderous opening beat, sending shockwaves through the concrete floor. Listening to recorded tracks on headphones cannot compare to the visceral power of live sound vibrating through your chest. When the lead singer holds out the microphone and the entire crowd sings the chorus in unison, strangers become a unified family. Fans leave the stadium exhausted, voice raspy, with memories that will endure for a lifetime.`,
  },
];

export const GAME_6_READING_QUESTIONS: ReadingPassageQuestion[] = [
  // Passage 1 Questions
  {
    id: 'g8u1-g6-q01',
    passageId: 'pass-1',
    passageTitle: 'The Universal Language of Harmony',
    passageText: READING_PASSAGES[0].text,
    prompt: 'What is the primary message of this passage?',
    options: [
      'Music is an expensive hobby for European travelers.',
      'Music serves as a powerful universal bridge for peace and unity.',
      'Orchestras should only perform modern pop music.',
      'Singing alone is much healthier than singing in a choir.'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage highlights that music transcends cultural and political barriers to build empathy and peace.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q02',
    passageId: 'pass-1',
    passageTitle: 'The Universal Language of Harmony',
    passageText: READING_PASSAGES[0].text,
    prompt: 'According to scientific findings mentioned in the text, what happens when people make music together?',
    options: [
      'They immediately forget how to speak.',
      'Their heartbeats synchronize, creating a sense of unity.',
      'Their hearing becomes permanently damaged.',
      'They compete aggressively for the loudest volume.'
    ],
    correctOptionIndex: 1,
    explanation: 'The text states: "Science confirms that when people sing or play instruments together, their heartbeats synchronize."',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q03',
    passageId: 'pass-1',
    passageTitle: 'The Universal Language of Harmony',
    passageText: READING_PASSAGES[0].text,
    prompt: 'In the passage, the word "transcends" most nearly means...',
    options: [
      'Destroys and eliminates',
      'Rises above and goes beyond',
      'Ignores and forgets',
      'Stops and pauses'
    ],
    correctOptionIndex: 1,
    explanation: '"Transcends" means to rise above or go beyond ordinary physical and cultural limits.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q04',
    passageId: 'pass-1',
    passageTitle: 'The Universal Language of Harmony',
    passageText: READING_PASSAGES[0].text,
    prompt: 'Why does the author mention Israeli and Palestinian musicians performing Beethoven?',
    options: [
      'To demonstrate how music can create harmony despite political conflicts.',
      'To prove that Beethoven was born in the Middle East.',
      'To explain why violins are louder than cellos.',
      'To show that classical music is unpopular today.'
    ],
    correctOptionIndex: 0,
    explanation: 'It serves as a powerful real-world example of music fostering peace between nations in conflict.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q05',
    passageId: 'pass-1',
    passageTitle: 'The Universal Language of Harmony',
    passageText: READING_PASSAGES[0].text,
    prompt: 'Which would be the most suitable alternative headline for this passage?',
    options: [
      'The Science of Noise Pollution',
      'Building Bridges Through Symphony and Song',
      'How to Buy an Orchestra Ticket',
      'The History of Classical Instruments'
    ],
    correctOptionIndex: 1,
    explanation: '"Building Bridges Through Symphony and Song" captures the core thematic essence of the text.',
    difficulty: 'challenging',
  },

  // Passage 2 Questions
  {
    id: 'g8u1-g6-q06',
    passageId: 'pass-2',
    passageTitle: 'Behind the Curtains of Musical Theatre',
    passageText: READING_PASSAGES[1].text,
    prompt: 'How do musicals differ from standard theatrical plays according to the passage?',
    options: [
      'Musicals never have costumes or stage lighting.',
      'Musicals express characters’ deepest feelings through song and dance.',
      'Actors in musicals are not allowed to speak any dialogue.',
      'Musicals are always performed without any musical instruments.'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage explains: "Unlike ordinary plays where actors only speak, a musical reveals characters\' innermost emotions through powerful songs."',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q07',
    passageId: 'pass-2',
    passageTitle: 'Behind the Curtains of Musical Theatre',
    passageText: READING_PASSAGES[1].text,
    prompt: 'Where are the musicians situated during a musical theatre performance?',
    options: [
      'On the outdoor roof of the theatre',
      'In the orchestra pit below the stage',
      'Sitting among the general audience in the back row',
      'Behind the ticket counters in the lobby'
    ],
    correctOptionIndex: 1,
    explanation: 'The text specifies: "In the orchestra pit below the stage, musicians follow the conductor\'s baton."',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q08',
    passageId: 'pass-2',
    passageTitle: 'Behind the Curtains of Musical Theatre',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What role does the conductor play during the show?',
    options: [
      'Selling programs and merchandise to arriving guests',
      'Directing the musicians to synchronize with the actors’ choreography',
      'Dancing on stage as the main villain',
      'Designing the costumes and makeup for the actors'
    ],
    correctOptionIndex: 1,
    explanation: 'The conductor guides the orchestra, ensuring notes match the actors\' choreography perfectly.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q09',
    passageId: 'pass-2',
    passageTitle: 'Behind the Curtains of Musical Theatre',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What does the word "lingering" mean in the final sentence?',
    options: [
      'Remaining or staying in the mind for a long time',
      'Disappearing instantly and completely',
      'Causing sharp physical pain',
      'Making a very loud explosion'
    ],
    correctOptionIndex: 0,
    explanation: '"Lingering" refers to memories or melodies remaining present after the performance ends.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q10',
    passageId: 'pass-2',
    passageTitle: 'Behind the Curtains of Musical Theatre',
    passageText: READING_PASSAGES[1].text,
    prompt: 'What can be inferred about the work of the stage crew?',
    options: [
      'They only work after the audience has gone home.',
      'Their quick, coordinated efforts in the dark are vital to the show\'s success.',
      'They perform the singing solos on stage.',
      'They prefer not to work with musical theatre actors.'
    ],
    correctOptionIndex: 1,
    explanation: 'The crew swiftly maneuvers heavy backdrops in darkness, illustrating crucial backstage teamwork.',
    difficulty: 'challenging',
  },

  // Passage 3 Questions
  {
    id: 'g8u1-g6-q11',
    passageId: 'pass-3',
    passageTitle: 'Beats in the Digital Age',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What major change has occurred in music production over the past fifty years?',
    options: [
      'People no longer listen to music at all.',
      'Musicians can now produce professional music from home with a laptop.',
      'Electric guitars have been banned worldwide.',
      'All music is now recorded exclusively on magnetic tape.'
    ],
    correctOptionIndex: 1,
    explanation: 'Digital tools allow creators to make high-quality tracks in home bedroom studios.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q12',
    passageId: 'pass-3',
    passageTitle: 'Beats in the Digital Age',
    passageText: READING_PASSAGES[2].text,
    prompt: 'How do streaming platforms benefit independent artists according to the passage?',
    options: [
      'They make recording instruments completely illegal.',
      'They enable artists to distribute their music worldwide without big record label contracts.',
      'They force all artists to sing in the same language.',
      'They require artists to purchase expensive tape machines.'
    ],
    correctOptionIndex: 1,
    explanation: 'Streaming allows independent musicians to share their music globally without restrictive deals.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q13',
    passageId: 'pass-3',
    passageTitle: 'Beats in the Digital Age',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What criticism do some traditionalists offer regarding digital music production?',
    options: [
      'It takes too many years to produce a single track.',
      'It lacks the raw emotional warmth of real live acoustic performances.',
      'Digital music cannot be played on speakers or headphones.',
      'Laptops are too heavy to carry into a concert hall.'
    ],
    correctOptionIndex: 1,
    explanation: 'The text notes: "traditionalists argue that software-produced music lacks the raw emotional warmth of live acoustic performances."',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q14',
    passageId: 'pass-3',
    passageTitle: 'Beats in the Digital Age',
    passageText: READING_PASSAGES[2].text,
    prompt: 'In this context, the phrase "democratized musical creativity" means...',
    options: [
      'Made creating music accessible to ordinary people everywhere.',
      'Passed laws forcing everyone to vote on music awards.',
      'Removed all pianos from public schools.',
      'Decreased the number of songs created annually.'
    ],
    correctOptionIndex: 0,
    explanation: '"Democratized" means making tools and opportunities available to everyone, not just wealthy elites.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q15',
    passageId: 'pass-3',
    passageTitle: 'Beats in the Digital Age',
    passageText: READING_PASSAGES[2].text,
    prompt: 'What is the author\'s overall attitude toward modern digital music technology?',
    options: [
      'Completely hostile and dismissive',
      'Balanced and appreciative of the creative empowerment it provides',
      'Uninterested and bored',
      'Secretive and suspicious'
    ],
    correctOptionIndex: 1,
    explanation: 'The author recognizes traditional criticisms while praising the immense creative empowerment technology offers.',
    difficulty: 'challenging',
  },

  // Passage 4 Questions
  {
    id: 'g8u1-g6-q16',
    passageId: 'pass-4',
    passageTitle: 'The Voice of the Cello',
    passageText: READING_PASSAGES[3].text,
    prompt: 'Why was Maya especially drawn to the cello instead of other instruments?',
    options: [
      'It was the cheapest instrument in the music store.',
      'She was captivated by its warm, human-like voice and resonance.',
      'Her friends forced her to play it against her will.',
      'She wanted an instrument that did not require any practice.'
    ],
    correctOptionIndex: 1,
    explanation: 'Maya was captivated by the deep resonance and felt it was the closest to the human speaking voice.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q17',
    passageId: 'pass-4',
    passageTitle: 'The Voice of the Cello',
    passageText: READING_PASSAGES[3].text,
    prompt: 'How often and for how long does Maya practice each day?',
    options: [
      'Two hours every afternoon',
      'Ten minutes once a week',
      'Only before major competitions',
      'Six hours every morning before dawn'
    ],
    correctOptionIndex: 0,
    explanation: 'The text states: "Maya practices two hours every afternoon, gently pressing the steel strings..."',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q18',
    passageId: 'pass-4',
    passageTitle: 'The Voice of the Cello',
    passageText: READING_PASSAGES[3].text,
    prompt: 'What happened at the National Youth Soloist Competition last month?',
    options: [
      'Maya broke her bow and had to withdraw.',
      'Maya won first prize and received a standing ovation.',
      'The judges disqualified Maya for playing too loudly.',
      'Maya arrived too late to participate.'
    ],
    correctOptionIndex: 1,
    explanation: 'Maya won first prize after pouring her soul into Elgar\'s Cello Concerto to a standing ovation.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q19',
    passageId: 'pass-4',
    passageTitle: 'The Voice of the Cello',
    passageText: READING_PASSAGES[3].text,
    prompt: 'In the passage, the word "spellbound" describes an audience that is...',
    options: [
      'Completely fascinated and fascinated by the performance',
      'Extremely angry and demanding a refund',
      'Sleeping soundly in their seats',
      'Confused because they could not hear anything'
    ],
    correctOptionIndex: 0,
    explanation: '"Spellbound" means held by or as if by a spell; captivated and fascinated.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q20',
    passageId: 'pass-4',
    passageTitle: 'The Voice of the Cello',
    passageText: READING_PASSAGES[3].text,
    prompt: 'What personal qualities helped Maya achieve success as a musician?',
    options: [
      'Arrogance and impatience',
      'Discipline, patience, and emotional passion',
      'Luck and avoiding hard work',
      'Playing only electric instruments'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage underscores her intense discipline, daily patience, and heartfelt passion.',
    difficulty: 'challenging',
  },

  // Passage 5 Questions
  {
    id: 'g8u1-g6-q21',
    passageId: 'pass-5',
    passageTitle: 'Under the Arena Lights',
    passageText: READING_PASSAGES[4].text,
    prompt: 'What is the immediate atmosphere like just before the concert begins?',
    options: [
      'Quiet and completely empty',
      'Electrifying and buzzing with anticipation',
      'Tense and hostile',
      'Silent and mournful'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage begins: "There is an electrifying energy in a stadium before a live concert begins."',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q22',
    passageId: 'pass-5',
    passageTitle: 'Under the Arena Lights',
    passageText: READING_PASSAGES[4].text,
    prompt: 'What happens when the arena lights plunge into darkness?',
    options: [
      'The audience quietly leaves the arena.',
      'A roaring cheer erupts from thirty thousand fans.',
      'The concert is postponed until the next morning.',
      'Security guards turn on the emergency lights.'
    ],
    correctOptionIndex: 1,
    explanation: 'The text states: "A roaring cheer erupts from thirty thousand voices."',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g6-q23',
    passageId: 'pass-5',
    passageTitle: 'Under the Arena Lights',
    passageText: READING_PASSAGES[4].text,
    prompt: 'According to the author, how does live stadium sound differ from headphone listening?',
    options: [
      'Headphones have much more physical vibration than a stadium.',
      'Live sound has a visceral, physical power vibrating through your body.',
      'Recorded music on headphones is always louder than stadium speakers.',
      'Live stadium concerts never use microphones or amplifiers.'
    ],
    correctOptionIndex: 1,
    explanation: 'The passage highlights the physical, visceral power of live sound vibrating through the concrete floor and chest.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q24',
    passageId: 'pass-5',
    passageTitle: 'Under the Arena Lights',
    passageText: READING_PASSAGES[4].text,
    prompt: 'In the passage, the word "unison" in "sings the chorus in unison" means...',
    options: [
      'Singing the exact same words and melody together at the same time',
      'Singing in complete silence without opening their mouths',
      'Singing in twenty different languages simultaneously',
      'Arguing over who should sing the next verse'
    ],
    correctOptionIndex: 0,
    explanation: '"In unison" means together at the same time, producing harmonious collective agreement.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g6-q25',
    passageId: 'pass-5',
    passageTitle: 'Under the Arena Lights',
    passageText: READING_PASSAGES[4].text,
    prompt: 'Why does the author state that "strangers become a unified family"?',
    options: [
      'Because they are all related by blood.',
      'Because sharing a powerful musical experience creates an intense emotional bond.',
      'Because they have to share the same hotel room after the concert.',
      'Because the singer gives them legal adoption certificates.'
    ],
    correctOptionIndex: 1,
    explanation: 'The shared communal singing and emotional resonance forge an unforgettable collective bond.',
    difficulty: 'challenging',
  },
];
