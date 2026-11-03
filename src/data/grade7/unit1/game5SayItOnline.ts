import type { MultipleChoiceQuestion } from '../../../types/schema';

export const GAME_5_DIALOGUES: MultipleChoiceQuestion[] = [
  // 1. Expressing opinion about screen time
  {
    id: 'g7-u1-d01',
    prompt: `Liam: "Do you think four hours of phone use every day is normal for a teenager?"\nEmma: "________, four hours is far too much. It leaves very little time for homework and physical exercise."`,
    options: [
      'In my opinion',
      'I don’t agree because',
      'At the moment',
      'To sum up',
    ],
    correctOptionIndex: 0,
    explanation: "'In my opinion' introduces Emma’s personal viewpoint on daily screen time.",
    difficulty: 'easy',
  },

  // 2. Agreeing with reasons
  {
    id: 'g7-u1-d02',
    prompt: `Lucas: "Social media helps us stay in touch with cousins who live in other cities."\nSophie: "________! I talk to my cousin in Canada every weekend using video chat."`,
    options: [
      "I agree completely",
      "I don't think so",
      "I'm not sure about that",
      "On the other hand",
    ],
    correctOptionIndex: 0,
    explanation: "Sophie agrees with Lucas and provides supporting evidence from her own life.",
    difficulty: 'easy',
  },

  // 3. Polite disagreement
  {
    id: 'g7-u1-d03',
    prompt: `Noah: "Video games are a complete waste of time and teach young people nothing."\nMaya: "________! Many strategy games improve problem-solving and teamwork skills."`,
    options: [
      "I disagree",
      "That's completely true",
      "You're right",
      "I agree with you",
    ],
    correctOptionIndex: 0,
    explanation: "Maya politely disagrees by highlighting the positive cognitive benefits of video games.",
    difficulty: 'easy',
  },

  // 4. Partial agreement (I see your point, but...)
  {
    id: 'g7-u1-d04',
    prompt: `Oliver: "We should ban all smartphones in secondary schools during the day."\nAva: "________, but some teachers use educational quiz apps during lessons."`,
    options: [
      'I see your point',
      'I am completely disagree',
      'That is impossible',
      'In conclusion',
    ],
    correctOptionIndex: 0,
    explanation: "'I see your point, but...' acknowledges the other person’s argument while presenting a counter-example.",
    difficulty: 'medium',
  },

  // 5. Giving reasons with 'because'
  {
    id: 'g7-u1-d05',
    prompt: `Daniel: "Why did you turn off all notifications on your phone?"\nChloe: "I turned them off ________ they constantly distract me when I try to read."`,
    options: [
      'because',
      'although',
      'however',
      'in conclusion',
    ],
    correctOptionIndex: 0,
    explanation: "'Because' introduces the direct reason for turning off notifications.",
    difficulty: 'easy',
  },

  // 6. Hesitant disagreement (I'm not sure about that)
  {
    id: 'g7-u1-d06',
    prompt: `Ethan: "Everyone on social media looks so happy, so their lives must be perfect."\nZoe: "________. People usually only upload their best moments, not their real daily struggles."`,
    options: [
      "I'm not sure about that",
      "You're definitely right",
      "I completely agree",
      "That is true",
    ],
    correctOptionIndex: 0,
    explanation: "'I’m not sure about that' expresses gentle skepticism about Ethan’s unrealistic assumption.",
    difficulty: 'medium',
  },

  // 7. Expressing belief
  {
    id: 'g7-u1-d07',
    prompt: `Sam: "Do you think social networks will replace real-life conversations?"\nLily: "No, ________ that face-to-face friendships will always remain the most meaningful."`,
    options: [
      'I believe',
      'I am believing',
      'I not agree',
      'from my view point',
    ],
    correctOptionIndex: 0,
    explanation: "'I believe that...' is the natural grammatical expression for stating an opinion.",
    difficulty: 'easy',
  },

  // 8. Contrasting with 'However'
  {
    id: 'g7-u1-d08',
    prompt: `Jack: "Online shopping is super fast and convenient."\nGrace: "That's true. ________, buying clothes online means you cannot try them on first to check the size."`,
    options: [
      'However',
      'Because',
      'For example',
      'In addition',
    ],
    correctOptionIndex: 0,
    explanation: "'However' introduces a contrasting disadvantage to balance the advantage.",
    difficulty: 'medium',
  },

  // 9. Giving an example
  {
    id: 'g7-u1-d09',
    prompt: `Max: "Educational apps can make learning languages much more fun."\nElla: "I agree! ________, Duolingo turns daily grammar practice into an exciting game."`,
    options: [
      'For example',
      'Although',
      'On the other hand',
      'In conclusion',
    ],
    correctOptionIndex: 0,
    explanation: "'For example' introduces a specific app to illustrate Max's point.",
    difficulty: 'easy',
  },

  // 10. Agreeing strongly
  {
    id: 'g7-u1-d10',
    prompt: `Mason: "Checking your smartphone right before sleeping ruins your sleep quality."\nHarper: "________! The blue light from the screen keeps my brain awake for hours."`,
    options: [
      "You're totally right",
      "I don't think so",
      "I disagree",
      "I'm not sure",
    ],
    correctOptionIndex: 0,
    explanation: "'You’re totally right' shows enthusiastic agreement backed up by personal experience.",
    difficulty: 'easy',
  },

  // 11. Point of view
  {
    id: 'g7-u1-d11',
    prompt: `Leo: "Should schools teach digital safety and online etiquette?"\nRuby: "________, digital literacy is just as important as math or science today."`,
    options: [
      'From my point of view',
      'I agree not',
      'To sum up',
      'Although',
    ],
    correctOptionIndex: 0,
    explanation: "'From my point of view' opens a thoughtful personal perspective on the curriculum.",
    difficulty: 'medium',
  },

  // 12. Discussing digital detox
  {
    id: 'g7-u1-d12',
    prompt: `Tom: "Are you taking part in the school's digital detox challenge this Saturday?"\nJessica: "Yes! ________ I was nervous at first, I am looking forward to an afternoon in the park."`,
    options: [
      'Although',
      'Because of',
      'Therefore',
      'In addition',
    ],
    correctOptionIndex: 0,
    explanation: "'Although' introduces a concession (feeling nervous) contrasted with positive anticipation.",
    difficulty: 'medium',
  },

  // 13. Disagreeing with 'I don't think so'
  {
    id: 'g7-u1-d13',
    prompt: `Ben: "Having thousands of online followers means you have thousands of true friends."\nLayla: "________. Most followers are strangers who don't know who you really are."`,
    options: [
      "I don't think so",
      "That's definitely true",
      "I agree with that",
      "You're right",
    ],
    correctOptionIndex: 0,
    explanation: "'I don't think so' politely challenges Ben's misconception about online popularity.",
    difficulty: 'easy',
  },

  // 14. Adding information with 'In addition'
  {
    id: 'g7-u1-d14',
    prompt: `Henry: "Cycling to school is great exercise."\nMia: "Yes! ________, it helps protect the environment from car pollution."`,
    options: [
      'In addition',
      'However',
      'On the contrary',
      'Although',
    ],
    correctOptionIndex: 0,
    explanation: "'In addition' adds another supporting benefit to Henry’s point.",
    difficulty: 'medium',
  },

  // 15. Discussing algorithm recommendations
  {
    id: 'g7-u1-d15',
    prompt: `Alex: "Why does YouTube keep showing me skateboarding videos?"\nRyan: "________ you watched three skating tutorials yesterday, the algorithm thinks you love skating."`,
    options: [
      'Since',
      'Although',
      'However',
      'Nevertheless',
    ],
    correctOptionIndex: 0,
    explanation: "'Since' here means 'because', introducing the causal reason for the algorithm's recommendation.",
    difficulty: 'medium',
  },

  // 16. Discussing privacy settings
  {
    id: 'g7-u1-d16',
    prompt: `Lucy: "Why is your Instagram account set to private?"\nOscar: "________ I want only my close friends and family to see my personal photos."`,
    options: [
      'Because',
      'Although',
      'However',
      'In conclusion',
    ],
    correctOptionIndex: 0,
    explanation: "'Because' clearly introduces Oscar’s explanation for keeping his account private.",
    difficulty: 'easy',
  },

  // 17. Contrasting ideas with 'On the other hand'
  {
    id: 'g7-u1-d17',
    prompt: `Liam: "Streaming movies at home is cheap and comfortable."\nZoe: "True. ________, watching a blockbuster on a giant cinema screen is much more exciting."`,
    options: [
      'On the other hand',
      'Because',
      'For example',
      'In conclusion',
    ],
    correctOptionIndex: 0,
    explanation: "'On the other hand' presents the contrasting advantage of going to the cinema.",
    difficulty: 'medium',
  },

  // 18. Asking for opinion
  {
    id: 'g7-u1-d18',
    prompt: `Teacher: "________ on the new rules about using tablets during break time?"\nStudent: "I think they are very fair because they encourage us to chat with each other."`,
    options: [
      'What is your opinion',
      'How are you agreeing',
      'Do you have a contrast',
      'Why you disagree',
    ],
    correctOptionIndex: 0,
    explanation: "'What is your opinion on...' is the natural standard question for soliciting viewpoints.",
    difficulty: 'easy',
  },

  // 19. Agreeing with 'That is true'
  {
    id: 'g7-u1-d19',
    prompt: `Lucas: "It is dangerous to download attachments from unknown email senders."\nJack: "________. They could contain harmful computer viruses that damage your device."`,
    options: [
      "That's very true",
      "I don't think so",
      "I disagree completely",
      "I'm not sure",
    ],
    correctOptionIndex: 0,
    explanation: "'That's very true' affirms the statement about cybersecurity risk.",
    difficulty: 'easy',
  },

  // 20. Concluding a discussion
  {
    id: 'g7-u1-d20',
    prompt: `Speaker: "________, while technology offers incredible benefits, digital balance is essential for health."`,
    options: [
      'To sum up',
      'For example',
      'Because',
      'Since',
    ],
    correctOptionIndex: 0,
    explanation: "'To sum up' (or 'In conclusion') signals the final summary of a discussion or speech.",
    difficulty: 'medium',
  },

  // 21. Expressing concern politely
  {
    id: 'g7-u1-d21',
    prompt: `Maya: "I stayed up until 2 AM scrolling through TikTok videos."\nElla: "________. You must be exhausted! You need eight hours of sleep to stay healthy."`,
    options: [
      "That doesn't sound very healthy",
      "That is a great idea",
      "You are totally right",
      "I agree with your habit",
    ],
    correctOptionIndex: 0,
    explanation: "Ella expresses friendly concern about Maya’s late-night screen habit.",
    difficulty: 'easy',
  },

  // 22. Discussing cyberbullying and kindness
  {
    id: 'g7-u1-d22',
    prompt: `Noah: "People often post mean comments online that they would never say face-to-face."\nChloe: "________. Being behind a screen makes some users forget that words have real feelings."`,
    options: [
      "I couldn't agree more",
      "I disagree",
      "I don't think so",
      "However",
    ],
    correctOptionIndex: 0,
    explanation: "'I couldn’t agree more' indicates strong, empathetic agreement with Noah's observation.",
    difficulty: 'medium',
  },

  // 23. Discussing productivity tools
  {
    id: 'g7-u1-d23',
    prompt: `Oliver: "How do you remember all your homework deadlines?"\nHarper: "________, I use a digital calendar app that alerts me one day before each assignment is due."`,
    options: [
      'Personally',
      'In conclusion',
      'Although',
      'Whereas',
    ],
    correctOptionIndex: 0,
    explanation: "'Personally' introduces an individual routine or solution in response to a question.",
    difficulty: 'medium',
  },

  // 24. Contrasting using 'While'
  {
    id: 'g7-u1-d24',
    prompt: `Emma: "________ smartphones keep us connected, they can also cause digital addiction."\nLiam: "Exactly! That is why time management is so important."`,
    options: [
      'While',
      'Because',
      'Since',
      'So that',
    ],
    correctOptionIndex: 0,
    explanation: "'While' introduces a concession clause expressing two contrasting realities.",
    difficulty: 'medium',
  },

  // 25. Choosing natural supportive response
  {
    id: 'g7-u1-d25',
    prompt: `Sophie: "I feel so refreshed after spending Sunday afternoon hiking without my phone."\nLucas: "That sounds wonderful! ________ that taking regular digital breaks clears your mind."`,
    options: [
      'It shows',
      'It disagree',
      'It in conclusion',
      'It however',
    ],
    correctOptionIndex: 0,
    explanation: "'It shows that...' is a natural conversational response acknowledging a clear result.",
    difficulty: 'easy',
  },
];
