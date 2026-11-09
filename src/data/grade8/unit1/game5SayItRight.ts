import type { MultipleChoiceQuestion } from '../../../types/schema';

export const GAME_5_DIALOGUES: MultipleChoiceQuestion[] = [
  {
    id: 'g8u1-g5-d01',
    prompt: `Liam: "Would you like to come to the rock festival with us this Friday?"\nEmma: "I wish I could, but ________. The loud electric guitars give me an awful headache."`,
    options: [
      "I am really into heavy metal",
      "I can't stand loud rock concerts",
      "my favourite genre is rock",
      "I love loud electric guitars"
    ],
    correctOptionIndex: 1,
    explanation: 'Emma gives a polite refusal explained by her strong dislike of loud rock ("I can\'t stand...").',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d02',
    prompt: `Lucas: "What do you think of Beethoven's Ninth Symphony?"\nSophie: "________, it is one of the most powerful and emotional pieces ever composed."`,
    options: [
      "I don't think so",
      "I'm not sure about that",
      "From my point of view",
      "I can't stand it"
    ],
    correctOptionIndex: 2,
    explanation: '"From my point of view" introduces Sophie\'s opinion on Beethoven\'s masterpiece.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d03',
    prompt: `Noah: "Classical music is way too slow and boring for teenagers."\nMaya: "________! When I study for big exams, classical piano music helps me concentrate and feel peaceful."`,
    options: [
      "I completely agree",
      "That is true",
      "You are right",
      "I disagree"
    ],
    correctOptionIndex: 3,
    explanation: 'Maya disputes Noah\'s statement by explaining how classical piano helps her study.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d04',
    prompt: `Oliver: "Do you prefer listening to music on headphones or on room speakers?"\nAva: "________ headphones because the sound quality feels much clearer and more immersive."`,
    options: [
      "I prefer",
      "I would rather than",
      "I am hate",
      "I not keen on"
    ],
    correctOptionIndex: 0,
    explanation: '"I prefer [noun] because..." states a clear preference with a supporting reason.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d05',
    prompt: `Teacher: "Why do you think music has existed in every human culture throughout history?"\nDaniel: "I believe it is because music ________."`,
    options: [
      "is only for professional musicians",
      "has the power to bring people together emotionally",
      "costs too much money to produce",
      "is always written with electric instruments"
    ],
    correctOptionIndex: 1,
    explanation: 'Daniel highlights the universal emotional and connective role of music across civilizations.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d06',
    prompt: `Chloe: "The new pop single is at the top of the charts everywhere!"\nJack: "________. Everyone in my class is humming that catchy chorus today."`,
    options: [
      "I disagree with you",
      "I don't think so",
      "You're definitely right",
      "I'm afraid you are wrong"
    ],
    correctOptionIndex: 2,
    explanation: 'Jack affirms Chloe\'s observation with evidence ("Everyone is humming it").',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d07',
    prompt: `Leo: "________ to the outdoor concert tonight?"\nGrace: "I would love to, but I have to finish my science project first."`,
    options: [
      "Would you rather going",
      "Why you don't go",
      "Do you liking to go",
      "How about going"
    ],
    correctOptionIndex: 3,
    explanation: '"How about going...?" is a natural suggestion pattern followed by a gerund.',
    difficulty: 'easy',
  },
  {
    id: 'g8u1-g5-d08',
    prompt: `Ethan: "I think traditional folk music is uninteresting and old-fashioned."\nZoe: "________. Traditional songs preserve valuable cultural stories that would otherwise be forgotten."`,
    options: [
      "I see what you mean, but I feel differently",
      "You are completely right",
      "I agree with every word",
      "That is exactly what I think"
    ],
    correctOptionIndex: 0,
    explanation: 'Zoe uses respectful disagreement: "I see what you mean, but I feel differently."',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d09',
    prompt: `Mason: "Would you rather learn to play the drums or the piano?"\nElla: "I would rather ________ because I love creating rhythmic beats."`,
    options: [
      "to learn the drums",
      "learn the drums",
      "learning the drums",
      "learned the drums"
    ],
    correctOptionIndex: 1,
    explanation: '"Would rather" must be followed by a bare infinitive ("learn").',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d10',
    prompt: `Interviewer: "How do you feel when you step onto the stage in front of thousands of fans?"\nRock Singer: "________ exciting! My heart races and the energy of the crowd is incredible."`,
    options: [
      "It makes me feeling",
      "I am bored and",
      "It is exceptionally",
      "It repetitive and"
    ],
    correctOptionIndex: 2,
    explanation: '"It is exceptionally exciting" naturally conveys the thrill of stage performance.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d11',
    prompt: `Sam: "I didn't quite catch what the music teacher said about tomorrow's rehearsal. ________?"\nAlex: "Sure! She said woodwinds practice at two and brass at three."`,
    options: [
      "What is your favourite genre",
      "Why are you listening",
      "Do you agree with her",
      "Could you please repeat that"
    ],
    correctOptionIndex: 3,
    explanation: '"Could you please repeat that?" is the correct functional phrase for asking for clarification.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d12',
    prompt: `Hannah: "Which musical instrument do you find the most challenging to master?"\nBenjamin: "In my opinion, ________ because controlling the bow smoothly takes years of practice."`,
    options: [
      "the violin is the most demanding",
      "the violin is easier than guitar",
      "violins are less difficult",
      "playing violin is very boring"
    ],
    correctOptionIndex: 0,
    explanation: '"The violin is the most demanding" gives a reasoned opinion about instrument difficulty.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d13',
    prompt: `Ruby: "Musical theatre is just people randomly singing during a play."\nOscar: "________, however the songs actually express the deepest thoughts and motives of the characters."`,
    options: [
      "I completely disagree with that point",
      "That's a good point",
      "You are so wrong",
      "I hate musicals"
    ],
    correctOptionIndex: 1,
    explanation: '"That\'s a good point, however..." partially acknowledges the remark before adding a deeper insight.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d14',
    prompt: `Lucy: "I love listening to jazz when I am cooking dinner."\nMax: "Me too! ________. The saxophone melodies are so smooth and relaxing."`,
    options: [
      "Jazz is too repetitive for me",
      "I can't stand jazz music",
      "I'm a big fan of jazz as well",
      "I would rather listen to heavy metal"
    ],
    correctOptionIndex: 2,
    explanation: 'Max agrees enthusiastically ("Me too! I\'m a big fan of jazz as well").',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d15',
    prompt: `David: "Why do so many people listen to upbeat electronic music at the gym?"\nSarah: "Because it makes them ________."`,
    options: [
      "feel tired and sleepy",
      "forget their musical preferences",
      "hate exercising",
      "feel energetic and motivated"
    ],
    correctOptionIndex: 3,
    explanation: 'Upbeat music stimulates adrenaline, making people feel energetic and motivated.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d16',
    prompt: `Jacob: "The ticket prices for the stadium tour are over a hundred dollars!"\nIsabella: "________! That's far too expensive for middle school students."`,
    options: [
      "That's unbelievable",
      "I don't think so",
      "I am keen on it",
      "Tickets are so cheap"
    ],
    correctOptionIndex: 0,
    explanation: '"That\'s unbelievable!" expresses surprise and shared disbelief at exorbitant prices.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d17',
    prompt: `Tyler: "What is your main reason for joining the school choir?"\nLily: "Well, ________ singing in harmony with others gives me tremendous joy."`,
    options: [
      "because I hate music,",
      "as far as I'm concerned,",
      "although I dislike singing,",
      "I would rather not sing,"
    ],
    correctOptionIndex: 1,
    explanation: '"As far as I\'m concerned" introduces Lily\'s personal, heartfelt reason.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d18',
    prompt: `Reporter: "How has music streaming technology changed the way you discover new artists?"\nStudent: "________, streaming algorithms introduce me to international musicians I would never hear on the radio."`,
    options: [
      "I cannot stand technology",
      "I disagree with you",
      "To be completely honest",
      "Radio is much better"
    ],
    correctOptionIndex: 2,
    explanation: '"To be completely honest" is a natural conversational discourse marker.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d19',
    prompt: `Arthur: "Do you think learning an instrument makes you smarter in math and science?"\nFreya: "________. Many scientific studies show that learning to read music improves spatial reasoning."`,
    options: [
      "I would rather disagree",
      "I don't think that is true",
      "That makes no sense",
      "I strongly believe so"
    ],
    correctOptionIndex: 3,
    explanation: 'Freya supports her agreement ("I strongly believe so") with scientific research.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d20',
    prompt: `Reporter: "What is the secret behind your band's tight live performance?"\nDrummer: "We practice our rhythm every single day, ________ timing is the foundation of our music."`,
    options: [
      "because",
      "although",
      "but",
      "instead of"
    ],
    correctOptionIndex: 0,
    explanation: '"Because" links the daily practice habit with its fundamental reason.',
    difficulty: 'medium',
  },
  {
    id: 'g8u1-g5-d21',
    prompt: `Henry: "I didn't enjoy the movie at all. The plot was weak."\nCharlotte: "True, but ________ the film was its breathtaking orchestral soundtrack."`,
    options: [
      "the worst part of",
      "the best thing about",
      "I couldn't stand",
      "there was no music in"
    ],
    correctOptionIndex: 1,
    explanation: '"The best thing about [X] was..." highlights the standout redeeming feature.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g5-d22',
    prompt: `George: "Should we book front-row tickets for the opera?"\nAmelia: "________, front-row seats are too close to hear the acoustic balance properly. The middle tier is much better."`,
    options: [
      "I agree completely",
      "I am keen on front row",
      "If you ask me",
      "You're definitely right"
    ],
    correctOptionIndex: 2,
    explanation: '"If you ask me" offers thoughtful personal advice before explaining acoustic acoustics.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g5-d23',
    prompt: `Reporter: "How did the benefit concert help the charity foundation?"\nOrganizer: "Not only did it raise funds, ________ it also united people from all over the world in a message of peace."`,
    options: [
      "however",
      "although",
      "because",
      "but"
    ],
    correctOptionIndex: 3,
    explanation: 'Correlative conjunction structure: "Not only ... but (also) ...".',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g5-d24',
    prompt: `Theo: "Rap music doesn't require any real talent compared to classical music."\nZara: "________. Great lyricists have extraordinary vocabulary, rhythm, and poetic timing."`,
    options: [
      "I'm afraid I have to disagree",
      "I couldn't agree with you more",
      "That is entirely correct",
      "You took the words right out of my mouth"
    ],
    correctOptionIndex: 0,
    explanation: '"I\'m afraid I have to disagree" is polite but firm disagreement supported by evidence.',
    difficulty: 'challenging',
  },
  {
    id: 'g8u1-g5-d25',
    prompt: `Interviewer: "What advice would you give young students learning the electric guitar?"\nGuitarist: "________ you make mistakes, never give up. Passion and patience make all the difference."`,
    options: [
      "Because of",
      "Even if",
      "Instead of",
      "Despite of"
    ],
    correctOptionIndex: 1,
    explanation: '"Even if" introduces a condition that will not prevent the outcome ("never give up").',
    difficulty: 'challenging',
  },
];
