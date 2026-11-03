import type { SentenceBuilderQuestion } from '../../../types/schema';

export const GAME_4_SENTENCES: SentenceBuilderQuestion[] = [
  // 1. Present Simple Daily Routine
  {
    id: 'g7-u1-s01',
    prompt: 'Describing a daily online habit in the morning:',
    correctSentence: 'She checks her messages every morning before breakfast.',
    scrambledWords: ['She', 'checks', 'her', 'messages', 'every', 'morning', 'before', 'breakfast'],
    acceptedAnswers: [
      'She checks her messages every morning before breakfast.',
      'Every morning before breakfast she checks her messages.',
      'Before breakfast she checks her messages every morning.',
    ],
    alternativeValidSentences: [
      'She checks her messages before breakfast every morning.',
      'Every morning she checks her messages before breakfast.',
    ],
    explanation: 'Time phrases like "every morning" or "before breakfast" can be placed at the beginning or end of the sentence.',
    difficulty: 'easy',
  },

  // 2. Frequency Adverb + Habit
  {
    id: 'g7-u1-s02',
    prompt: 'Describing routine evening screen habits:',
    correctSentence: 'I usually turn off my notifications after eight o’clock.',
    scrambledWords: ['I', 'usually', 'turn', 'off', 'my', 'notifications', 'after', 'eight', 'o’clock'],
    acceptedAnswers: [
      'I usually turn off my notifications after eight o’clock.',
      'Usually I turn off my notifications after eight o’clock.',
      'After eight o’clock I usually turn off my notifications.',
    ],
    alternativeValidSentences: [
      'I turn off my notifications after eight o’clock usually.',
    ],
    explanation: 'Adverbs of frequency like "usually" normally precede the main verb or can introduce the sentence.',
    difficulty: 'easy',
  },

  // 3. Present Continuous Action Now
  {
    id: 'g7-u1-s03',
    prompt: 'Describing what someone is doing at the present moment:',
    correctSentence: 'He is uploading a new video right now.',
    scrambledWords: ['He', 'is', 'uploading', 'a', 'new', 'video', 'right', 'now'],
    acceptedAnswers: [
      'He is uploading a new video right now.',
      'Right now he is uploading a new video.',
    ],
    explanation: '"Right now" indicates an action in progress and can start or end the clause.',
    difficulty: 'easy',
  },

  // 4. Present Continuous Temporary Situation
  {
    id: 'g7-u1-s04',
    prompt: 'Describing a school challenge this week:',
    correctSentence: 'We are doing a digital detox challenge this week.',
    scrambledWords: ['We', 'are', 'doing', 'a', 'digital', 'detox', 'challenge', 'this', 'week'],
    acceptedAnswers: [
      'We are doing a digital detox challenge this week.',
      'This week we are doing a digital detox challenge.',
    ],
    explanation: 'Time adverbials like "this week" are flexible at the start or end of the sentence.',
    difficulty: 'easy',
  },

  // 5. Present Simple Negative
  {
    id: 'g7-u1-s05',
    prompt: 'Describing a rule about phone use at school:',
    correctSentence: 'Students do not check their phones during class.',
    scrambledWords: ['Students', 'do', 'not', 'check', 'their', 'phones', 'during', 'class'],
    acceptedAnswers: [
      'Students do not check their phones during class.',
      'During class students do not check their phones.',
    ],
    explanation: 'Negative Present Simple uses "do not + base verb". The prepositional phrase can go first or last.',
    difficulty: 'easy',
  },

  // 6. Third Person Negative
  {
    id: 'g7-u1-s06',
    prompt: 'Expressing an individual habit:',
    correctSentence: 'Liam does not share personal passwords with anyone.',
    scrambledWords: ['Liam', 'does', 'not', 'share', 'personal', 'passwords', 'with', 'anyone'],
    acceptedAnswers: [
      'Liam does not share personal passwords with anyone.',
      'With anyone Liam does not share personal passwords.',
    ],
    explanation: 'Third-person singular negative uses "does not share".',
    difficulty: 'easy',
  },

  // 7. Present Simple Question
  {
    id: 'g7-u1-s07',
    prompt: 'Asking about someone’s online music habits:',
    correctSentence: 'How often do you stream music on your phone?',
    scrambledWords: ['How', 'often', 'do', 'you', 'stream', 'music', 'on', 'your', 'phone'],
    acceptedAnswers: [
      'How often do you stream music on your phone?',
      'On your phone how often do you stream music?',
    ],
    explanation: 'Standard question format: Question phrase (How often) + auxiliary (do) + subject (you) + base verb (stream).',
    difficulty: 'easy',
  },

  // 8. Present Continuous Question
  {
    id: 'g7-u1-s08',
    prompt: 'Asking what someone is currently doing online:',
    correctSentence: 'What are you watching on your tablet at the moment?',
    scrambledWords: ['What', 'are', 'you', 'watching', 'on', 'your', 'tablet', 'at', 'the', 'moment'],
    acceptedAnswers: [
      'What are you watching on your tablet at the moment?',
      'At the moment what are you watching on your tablet?',
    ],
    explanation: 'Present Continuous question: Question word + are + subject + verb-ing.',
    difficulty: 'easy',
  },

  // 9. Infinitive of Purpose
  {
    id: 'g7-u1-s09',
    prompt: 'Explaining why someone uses a navigation app:',
    correctSentence: 'We use navigation apps to find places easily.',
    scrambledWords: ['We', 'use', 'navigation', 'apps', 'to', 'find', 'places', 'easily'],
    acceptedAnswers: [
      'We use navigation apps to find places easily.',
      'To find places easily we use navigation apps.',
    ],
    alternativeValidSentences: [
      'We use navigation apps to easily find places.',
    ],
    explanation: 'Infinitive of purpose ("to find places") explains the reason for using the app.',
    difficulty: 'medium',
  },

  // 10. Educational App Purpose
  {
    id: 'g7-u1-s10',
    prompt: 'Stating the purpose of an educational application:',
    correctSentence: 'I use educational apps to practise English vocabulary.',
    scrambledWords: ['I', 'use', 'educational', 'apps', 'to', 'practise', 'English', 'vocabulary'],
    acceptedAnswers: [
      'I use educational apps to practise English vocabulary.',
      'To practise English vocabulary I use educational apps.',
    ],
    explanation: '"To practise" expresses the goal or purpose of the action.',
    difficulty: 'easy',
  },

  // 11. Messaging App Function
  {
    id: 'g7-u1-s11',
    prompt: 'Describing how messaging apps help communication:',
    correctSentence: 'Messaging apps help people communicate with their friends.',
    scrambledWords: ['Messaging', 'apps', 'help', 'people', 'communicate', 'with', 'their', 'friends'],
    acceptedAnswers: [
      'Messaging apps help people communicate with their friends.',
      'With their friends messaging apps help people communicate.',
    ],
    explanation: '"Help someone do something" describes the functional benefit of an app.',
    difficulty: 'medium',
  },

  // 12. Stative Verb Preference
  {
    id: 'g7-u1-s12',
    prompt: 'Comparing preferences between digital communication methods:',
    correctSentence: 'I prefer sending text messages to making phone calls.',
    scrambledWords: ['I', 'prefer', 'sending', 'text', 'messages', 'to', 'making', 'phone', 'calls'],
    acceptedAnswers: [
      'I prefer sending text messages to making phone calls.',
      'I prefer making phone calls to sending text messages.',
    ],
    explanation: 'Preference structure: "prefer [gerund] to [gerund]". Both preferences are grammatically valid.',
    difficulty: 'medium',
  },

  // 13. Stative Verb Belief
  {
    id: 'g7-u1-s13',
    prompt: 'Expressing a belief about screen time and sleep:',
    correctSentence: 'Many doctors believe that excessive screen time harms sleep.',
    scrambledWords: ['Many', 'doctors', 'believe', 'that', 'excessive', 'screen', 'time', 'harms', 'sleep'],
    acceptedAnswers: [
      'Many doctors believe that excessive screen time harms sleep.',
      'Doctors believe that excessive screen time harms sleep.',
    ],
    explanation: '"Believe" is a stative verb followed by a that-clause.',
    difficulty: 'medium',
  },

  // 14. Gerund after Enjoy
  {
    id: 'g7-u1-s14',
    prompt: 'Describing a leisure activity online:',
    correctSentence: 'Emma enjoys watching creative art tutorials after school.',
    scrambledWords: ['Emma', 'enjoys', 'watching', 'creative', 'art', 'tutorials', 'after', 'school'],
    acceptedAnswers: [
      'Emma enjoys watching creative art tutorials after school.',
      'After school Emma enjoys watching creative art tutorials.',
    ],
    explanation: 'The verb "enjoy" takes a gerund ("enjoys watching").',
    difficulty: 'easy',
  },

  // 15. Gerund after Avoid
  {
    id: 'g7-u1-s15',
    prompt: 'Giving advice about online privacy:',
    correctSentence: 'Smart users avoid sharing private photos with strangers.',
    scrambledWords: ['Smart', 'users', 'avoid', 'sharing', 'private', 'photos', 'with', 'strangers'],
    acceptedAnswers: [
      'Smart users avoid sharing private photos with strangers.',
      'With strangers smart users avoid sharing private photos.',
    ],
    explanation: '"Avoid" is followed by a gerund ("avoid sharing").',
    difficulty: 'medium',
  },

  // 16. Gerund after Keep
  {
    id: 'g7-u1-s16',
    prompt: 'Describing an addictive screen habit:',
    correctSentence: 'Many teenagers keep scrolling when they feel bored.',
    scrambledWords: ['Many', 'teenagers', 'keep', 'scrolling', 'when', 'they', 'feel', 'bored'],
    acceptedAnswers: [
      'Many teenagers keep scrolling when they feel bored.',
      'When they feel bored many teenagers keep scrolling.',
    ],
    explanation: '"Keep + -ing" means to continue an action repeatedly.',
    difficulty: 'medium',
  },

  // 17. Infinitive after Decide
  {
    id: 'g7-u1-s17',
    prompt: 'Describing an intentional digital break:',
    correctSentence: 'They decided to turn off their phones on Sunday.',
    scrambledWords: ['They', 'decided', 'to', 'turn', 'off', 'their', 'phones', 'on', 'Sunday'],
    acceptedAnswers: [
      'They decided to turn off their phones on Sunday.',
      'On Sunday they decided to turn off their phones.',
    ],
    explanation: '"Decide" takes a to-infinitive ("decided to turn off").',
    difficulty: 'easy',
  },

  // 18. Infinitive after Want
  {
    id: 'g7-u1-s18',
    prompt: 'Describing a future learning goal:',
    correctSentence: 'I want to create my own mobile game this year.',
    scrambledWords: ['I', 'want', 'to', 'create', 'my', 'own', 'mobile', 'game', 'this', 'year'],
    acceptedAnswers: [
      'I want to create my own mobile game this year.',
      'This year I want to create my own mobile game.',
    ],
    explanation: '"Want" is followed by a to-infinitive ("want to create").',
    difficulty: 'easy',
  },

  // 19. Frequency Adverb Position (Never)
  {
    id: 'g7-u1-s19',
    prompt: 'Stating a strict safety rule:',
    correctSentence: 'She never gives her password to other people.',
    scrambledWords: ['She', 'never', 'gives', 'her', 'password', 'to', 'other', 'people'],
    acceptedAnswers: [
      'She never gives her password to other people.',
      'To other people she never gives her password.',
    ],
    explanation: '"Never" stands before the main verb "gives".',
    difficulty: 'easy',
  },

  // 20. Frequency Adverb Position (Rarely)
  {
    id: 'g7-u1-s20',
    prompt: 'Describing infrequent gaming habits:',
    correctSentence: 'My brother rarely plays online games during the week.',
    scrambledWords: ['My', 'brother', 'rarely', 'plays', 'online', 'games', 'during', 'the', 'week'],
    acceptedAnswers: [
      'My brother rarely plays online games during the week.',
      'During the week my brother rarely plays online games.',
    ],
    explanation: '"Rarely" precedes the main verb "plays".',
    difficulty: 'easy',
  },

  // 21. Present Simple vs Continuous Contrast
  {
    id: 'g7-u1-s21',
    prompt: 'Contrasting a general habit with today’s action:',
    correctSentence: 'I usually watch videos but today I am reading a book.',
    scrambledWords: ['I', 'usually', 'watch', 'videos', 'but', 'today', 'I', 'am', 'reading', 'a', 'book'],
    acceptedAnswers: [
      'I usually watch videos but today I am reading a book.',
      'Today I am reading a book but I usually watch videos.',
    ],
    alternativeValidSentences: [
      'I am reading a book today but I usually watch videos.',
      'Usually I watch videos but today I am reading a book.',
    ],
    explanation: 'Coordinated clauses linked with "but" can be ordered either way while maintaining valid grammar.',
    difficulty: 'challenging',
  },

  // 22. Expressing Opinions (In my opinion)
  {
    id: 'g7-u1-s22',
    prompt: 'Expressing a personal view about social media:',
    correctSentence: 'In my opinion social media connects people across the world.',
    scrambledWords: ['In', 'my', 'opinion', 'social', 'media', 'connects', 'people', 'across', 'the', 'world'],
    acceptedAnswers: [
      'In my opinion social media connects people across the world.',
      'Social media connects people across the world in my opinion.',
    ],
    explanation: '"In my opinion" introduces or concludes a personal view.',
    difficulty: 'medium',
  },

  // 23. Expressing Opinions (I believe that)
  {
    id: 'g7-u1-s23',
    prompt: 'Expressing belief about digital limits:',
    correctSentence: 'I believe that screen time limits are very helpful.',
    scrambledWords: ['I', 'believe', 'that', 'screen', 'time', 'limits', 'are', 'very', 'helpful'],
    acceptedAnswers: [
      'I believe that screen time limits are very helpful.',
      'I believe screen time limits are very helpful.',
    ],
    explanation: '"I believe that..." introduces an opinion clause.',
    difficulty: 'medium',
  },

  // 24. Giving Reasons with Because
  {
    id: 'g7-u1-s24',
    prompt: 'Giving a reason for turning off notifications:',
    correctSentence: 'I turned off notifications because they distract my concentration.',
    scrambledWords: ['I', 'turned', 'off', 'notifications', 'because', 'they', 'distract', 'my', 'concentration'],
    acceptedAnswers: [
      'I turned off notifications because they distract my concentration.',
      'Because they distract my concentration I turned off notifications.',
    ],
    explanation: 'A causal clause with "because" can follow the main clause or start the sentence.',
    difficulty: 'medium',
  },

  // 25. Contrasting Ideas with However
  {
    id: 'g7-u1-s25',
    prompt: 'Contrasting benefits and risks of technology:',
    correctSentence: 'Technology is useful however we must protect our privacy.',
    scrambledWords: ['Technology', 'is', 'useful', 'however', 'we', 'must', 'protect', 'our', 'privacy'],
    acceptedAnswers: [
      'Technology is useful however we must protect our privacy.',
      'However technology is useful we must protect our privacy.',
      'We must protect our privacy however technology is useful.',
    ],
    explanation: '"However" indicates contrast between two related ideas.',
    difficulty: 'challenging',
  },

  // 26. Algorithm Definition
  {
    id: 'g7-u1-s26',
    prompt: 'Describing what social media algorithms do:',
    correctSentence: 'Algorithms recommend content based on what users like.',
    scrambledWords: ['Algorithms', 'recommend', 'content', 'based', 'on', 'what', 'users', 'like'],
    acceptedAnswers: [
      'Algorithms recommend content based on what users like.',
      'Based on what users like algorithms recommend content.',
    ],
    explanation: 'Prepositional phrase "based on what users like" can precede or follow the main clause.',
    difficulty: 'challenging',
  },

  // 27. Word Formation in Context (organization)
  {
    id: 'g7-u1-s27',
    prompt: 'Using the noun form of organize in context:',
    correctSentence: 'Good organization helps students complete their homework on time.',
    scrambledWords: ['Good', 'organization', 'helps', 'students', 'complete', 'their', 'homework', 'on', 'time'],
    acceptedAnswers: [
      'Good organization helps students complete their homework on time.',
      'On time good organization helps students complete their homework.',
    ],
    explanation: '"Organization" acts as the noun subject of the sentence.',
    difficulty: 'medium',
  },

  // 28. Word Formation in Context (encouragement)
  {
    id: 'g7-u1-s28',
    prompt: 'Using the noun form of encourage in context:',
    correctSentence: 'Positive comments give young creators great encouragement.',
    scrambledWords: ['Positive', 'comments', 'give', 'young', 'creators', 'great', 'encouragement'],
    acceptedAnswers: [
      'Positive comments give young creators great encouragement.',
      'Great encouragement positive comments give young creators.',
    ],
    explanation: '"Encouragement" functions as the direct object of the verb "give".',
    difficulty: 'medium',
  },

  // 29. Digital Well-being Advice
  {
    id: 'g7-u1-s29',
    prompt: 'Advice for maintaining healthy digital balance:',
    correctSentence: 'You should spend more time exercising in the fresh air.',
    scrambledWords: ['You', 'should', 'spend', 'more', 'time', 'exercising', 'in', 'the', 'fresh', 'air'],
    acceptedAnswers: [
      'You should spend more time exercising in the fresh air.',
      'In the fresh air you should spend more time exercising.',
    ],
    explanation: '"Spend time doing something" takes a gerund ("spend time exercising").',
    difficulty: 'medium',
  },

  // 30. Concluding Remark
  {
    id: 'g7-u1-s30',
    prompt: 'Concluding a classroom presentation on technology:',
    correctSentence: 'In conclusion technology brings many benefits when used wisely.',
    scrambledWords: ['In', 'conclusion', 'technology', 'brings', 'many', 'benefits', 'when', 'used', 'wisely'],
    acceptedAnswers: [
      'In conclusion technology brings many benefits when used wisely.',
      'Technology brings many benefits when used wisely in conclusion.',
      'When used wisely technology brings many benefits in conclusion.',
    ],
    explanation: '"In conclusion" marks the final summary of a discussion or essay.',
    difficulty: 'medium',
  },
];
