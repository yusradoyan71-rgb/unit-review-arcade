/**
 * UNIT REVIEW ARCADE — GRAMMAR RUNNER DATA BANK (PHASE 7A & MIXED CURRICULUM EXPANSION)
 * 
 * 480 validated unique questions (80 items per tier) across:
 * - Grade 7: Easy (80), Medium (80), Hard (80)
 * - Grade 8: Easy (80), Medium (80), Hard (80)
 * 
 * Mixed Curriculum: Turkish MEB English Units 1-10 + School English Curriculum.
 */

import type { GrammarRunnerBank } from '../../types/gamesZone';

export const GRAMMAR_RUNNER_BANK: GrammarRunnerBank = {
  "grade-7": {
    "easy": [
      {
        "id": "gr_g7_e_01",
        "sentencePrompt": "She _____ twelve years old and loves music.",
        "laneOptions": [
          "is",
          "are",
          "am"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "To Be (Present)",
        "explanation": "Use 'is' with third-person singular subjects (she/he/it)."
      },
      {
        "id": "gr_g7_e_02",
        "sentencePrompt": "They _____ my best friends from school.",
        "laneOptions": [
          "is",
          "are",
          "am"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "To Be (Present)",
        "explanation": "Use 'are' with plural subjects like 'they'."
      },
      {
        "id": "gr_g7_e_03",
        "sentencePrompt": "I _____ a new bicycle for my birthday.",
        "laneOptions": [
          "has",
          "having",
          "have"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Have / Has",
        "explanation": "Use 'have' with the subject pronoun 'I'."
      },
      {
        "id": "gr_g7_e_04",
        "sentencePrompt": "My brother _____ a pet hamster in his bedroom.",
        "laneOptions": [
          "has",
          "have",
          "are"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Have / Has",
        "explanation": "Use 'has' for third-person singular (he/my brother)."
      },
      {
        "id": "gr_g7_e_05",
        "sentencePrompt": "We _____ Turkish and English in class.",
        "laneOptions": [
          "speaks",
          "speak",
          "speaking"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple",
        "explanation": "The base form 'speak' is used with 'we'."
      },
      {
        "id": "gr_g7_e_06",
        "sentencePrompt": "He _____ football every Saturday morning.",
        "laneOptions": [
          "playing",
          "play",
          "plays"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple 3rd Person",
        "explanation": "Add '-s' to verbs with he/she/it in the Present Simple."
      },
      {
        "id": "gr_g7_e_07",
        "sentencePrompt": "_____ you like pizza with extra cheese?",
        "laneOptions": [
          "Do",
          "Does",
          "Are"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Simple Question",
        "explanation": "Questions with 'you' use the auxiliary verb 'Do'."
      },
      {
        "id": "gr_g7_e_08",
        "sentencePrompt": "_____ she walk to school every day?",
        "laneOptions": [
          "Do",
          "Does",
          "Is"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple Question",
        "explanation": "Questions with 'she' use the auxiliary verb 'Does'."
      },
      {
        "id": "gr_g7_e_09",
        "sentencePrompt": "David _____ not drink coffee because he is too young.",
        "laneOptions": [
          "do",
          "is",
          "does"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Negative",
        "explanation": "Negative sentences with 'David' use 'does not' (doesn't)."
      },
      {
        "id": "gr_g7_e_10",
        "sentencePrompt": "The children _____ very tired after PE lesson.",
        "laneOptions": [
          "are",
          "was",
          "is"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "To Be (Present)",
        "explanation": "'Children' is an irregular plural noun, so it takes 'are'."
      },
      {
        "id": "gr_g7_e_11",
        "sentencePrompt": "Look at those three _____ swimming in the pond.",
        "laneOptions": [
          "fishes",
          "fish",
          "fishs"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Irregular Plurals",
        "explanation": "'Fish' usually stays the same in both singular and plural."
      },
      {
        "id": "gr_g7_e_12",
        "sentencePrompt": "There are four _____ in the kitchen drawer.",
        "laneOptions": [
          "knifes",
          "knifess",
          "knives"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Irregular Plurals",
        "explanation": "Nouns ending in '-fe' like 'knife' become '-ves' ('knives')."
      },
      {
        "id": "gr_g7_e_13",
        "sentencePrompt": "This is _____ apple that I bought at the market.",
        "laneOptions": [
          "an",
          "a",
          "the two"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Articles (A/An)",
        "explanation": "Use 'an' before words starting with a vowel sound."
      },
      {
        "id": "gr_g7_e_14",
        "sentencePrompt": "I need _____ new pencil case for art class.",
        "laneOptions": [
          "an",
          "a",
          "some"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Articles (A/An)",
        "explanation": "Use 'a' before singular countable nouns with a consonant sound."
      },
      {
        "id": "gr_g7_e_15",
        "sentencePrompt": "Is this _____ backpack on the chair?",
        "laneOptions": [
          "you",
          "yours",
          "your"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Possessive Adjectives",
        "explanation": "'Your' is the possessive adjective used before a noun."
      },
      {
        "id": "gr_g7_e_16",
        "sentencePrompt": "Mary called _____ mother on the telephone.",
        "laneOptions": [
          "her",
          "hers",
          "she"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Possessive Adjectives",
        "explanation": "Use 'her' to show possession for a female subject."
      },
      {
        "id": "gr_g7_e_17",
        "sentencePrompt": "The cat licked _____ paws quietly.",
        "laneOptions": [
          "it",
          "its",
          "it's"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Possessive Adjectives",
        "explanation": "'Its' is the possessive form without an apostrophe."
      },
      {
        "id": "gr_g7_e_18",
        "sentencePrompt": "This pencil is mine, and that one is _____.",
        "laneOptions": [
          "you",
          "your",
          "yours"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Possessive Pronouns",
        "explanation": "'Yours' is a possessive pronoun used without a following noun."
      },
      {
        "id": "gr_g7_e_19",
        "sentencePrompt": "Can you help _____ with this maths problem?",
        "laneOptions": [
          "me",
          "I",
          "my"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Object Pronouns",
        "explanation": "Use the object pronoun 'me' after the verb 'help'."
      },
      {
        "id": "gr_g7_e_20",
        "sentencePrompt": "The teacher gave _____ our test scores.",
        "laneOptions": [
          "we",
          "us",
          "our"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Object Pronouns",
        "explanation": "'Us' is the object pronoun for the subject 'we'."
      },
      {
        "id": "gr_g7_e_21",
        "sentencePrompt": "Our first lesson starts _____ 8:30 in the morning.",
        "laneOptions": [
          "in",
          "on",
          "at"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositions of Time",
        "explanation": "Use 'at' with precise clock times."
      },
      {
        "id": "gr_g7_e_22",
        "sentencePrompt": "We celebrate Republic Day _____ October 29th.",
        "laneOptions": [
          "on",
          "at",
          "in"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Prepositions of Time",
        "explanation": "Use 'on' with specific dates and days of the week."
      },
      {
        "id": "gr_g7_e_23",
        "sentencePrompt": "School begins _____ September every autumn.",
        "laneOptions": [
          "on",
          "in",
          "at"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prepositions of Time",
        "explanation": "Use 'in' with months, seasons, and years."
      },
      {
        "id": "gr_g7_e_24",
        "sentencePrompt": "The keys are lying _____ the dining table.",
        "laneOptions": [
          "at",
          "in",
          "on"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositions of Place",
        "explanation": "Use 'on' for surfaces like tables or desks."
      },
      {
        "id": "gr_g7_e_25",
        "sentencePrompt": "My grandfather lives _____ Ankara.",
        "laneOptions": [
          "in",
          "at",
          "on"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Prepositions of Place",
        "explanation": "Use 'in' for cities, towns, and countries."
      },
      {
        "id": "gr_g7_e_26",
        "sentencePrompt": "_____ is your English teacher this semester?",
        "laneOptions": [
          "Where",
          "Who",
          "When"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Question Words",
        "explanation": "Use 'Who' when asking about people."
      },
      {
        "id": "gr_g7_e_27",
        "sentencePrompt": "_____ do you live? — Near the central park.",
        "laneOptions": [
          "What",
          "How",
          "Where"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Question Words",
        "explanation": "Use 'Where' when asking about places or locations."
      },
      {
        "id": "gr_g7_e_28",
        "sentencePrompt": "_____ do you wake up on weekdays? — At 7 AM.",
        "laneOptions": [
          "When",
          "Who",
          "Why"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Question Words",
        "explanation": "Use 'When' to ask about time."
      },
      {
        "id": "gr_g7_e_29",
        "sentencePrompt": "_____ are you carrying an umbrella? — Because it's raining.",
        "laneOptions": [
          "Where",
          "Why",
          "Which"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Question Words",
        "explanation": "Use 'Why' to ask for reasons or explanations."
      },
      {
        "id": "gr_g7_e_30",
        "sentencePrompt": "_____ many pencils do you have in your bag?",
        "laneOptions": [
          "Which",
          "What",
          "How"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Quantifiers",
        "explanation": "'How many' is used to ask about countable quantities."
      },
      {
        "id": "gr_g7_e_31",
        "sentencePrompt": "Dolphins _____ swim very fast in the ocean.",
        "laneOptions": [
          "can",
          "cans",
          "canning"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Modal Can",
        "explanation": "Modal 'can' never changes form or takes '-s'."
      },
      {
        "id": "gr_g7_e_32",
        "sentencePrompt": "Penguins are birds, but they _____ fly.",
        "laneOptions": [
          "can",
          "cannot",
          "must"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Modal Can't",
        "explanation": "'Cannot' or 'can't' indicates lack of ability."
      },
      {
        "id": "gr_g7_e_33",
        "sentencePrompt": "Can you _____ the guitar? — Yes, I can.",
        "laneOptions": [
          "playing",
          "plays",
          "play"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Modal Can",
        "explanation": "Modal verbs are followed by the base form of the verb."
      },
      {
        "id": "gr_g7_e_34",
        "sentencePrompt": "_____ book in my hand is very interesting.",
        "laneOptions": [
          "This",
          "These",
          "Those"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Demonstratives",
        "explanation": "'This' refers to a single object close to the speaker."
      },
      {
        "id": "gr_g7_e_35",
        "sentencePrompt": "_____ birds high in the tree are singing loudly.",
        "laneOptions": [
          "This",
          "Those",
          "That"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Demonstratives",
        "explanation": "'Those' refers to plural objects far from the speaker."
      },
      {
        "id": "gr_g7_e_36",
        "sentencePrompt": "There _____ a big mirror in the bathroom.",
        "laneOptions": [
          "were",
          "are",
          "is"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "There is / There are",
        "explanation": "Use 'There is' before singular nouns."
      },
      {
        "id": "gr_g7_e_37",
        "sentencePrompt": "There _____ twenty students in our English club.",
        "laneOptions": [
          "are",
          "is",
          "be"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "There is / There are",
        "explanation": "Use 'There are' before plural nouns."
      },
      {
        "id": "gr_g7_e_38",
        "sentencePrompt": "I don't have _____ siblings; I am an only child.",
        "laneOptions": [
          "some",
          "any",
          "no"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Some / Any",
        "explanation": "Use 'any' in negative sentences and questions."
      },
      {
        "id": "gr_g7_e_39",
        "sentencePrompt": "Would you like _____ orange juice?",
        "laneOptions": [
          "a few",
          "any",
          "some"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Some / Any",
        "explanation": "Use 'some' in polite offers and requests."
      },
      {
        "id": "gr_g7_e_40",
        "sentencePrompt": "My father is _____ than my mother.",
        "laneOptions": [
          "taller",
          "tall",
          "tallest"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Comparative Adjectives",
        "explanation": "Add '-er' to short adjectives for comparatives with 'than'."
      },
      {
        "id": "gr_g7_e_41",
        "sentencePrompt": "She _____ very outgoing and makes friends quickly.",
        "laneOptions": [
          "is",
          "are",
          "am"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "To Be (Present)",
        "explanation": "Third person singular subject takes 'is'."
      },
      {
        "id": "gr_g7_e_42",
        "sentencePrompt": "My parents _____ born in a small town near the mountains.",
        "laneOptions": [
          "was",
          "were",
          "is"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple (To Be)",
        "explanation": "Plural subject takes 'were'."
      },
      {
        "id": "gr_g7_e_43",
        "sentencePrompt": "He usually _____ football with his classmates after school.",
        "laneOptions": [
          "playing",
          "play",
          "plays"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple",
        "explanation": "Third person singular takes -s in Present Simple."
      },
      {
        "id": "gr_g7_e_44",
        "sentencePrompt": "Look! The children _____ a new sandcastle on the beach.",
        "laneOptions": [
          "are building",
          "build",
          "built"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Continuous",
        "explanation": "'Look!' indicates action happening right now."
      },
      {
        "id": "gr_g7_e_45",
        "sentencePrompt": "Cheetahs are _____ than lions and can run up to 100 km/h.",
        "laneOptions": [
          "fastest",
          "faster",
          "more fast"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Comparative Adjectives",
        "explanation": "One-syllable adjectives take -er in comparatives."
      },
      {
        "id": "gr_g7_e_46",
        "sentencePrompt": "Jupiter is the _____ planet in our solar system.",
        "laneOptions": [
          "more large",
          "larger",
          "largest"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Superlative Adjectives",
        "explanation": "Use 'the largest' for the supreme degree."
      },
      {
        "id": "gr_g7_e_47",
        "sentencePrompt": "You _____ turn off the lights before leaving the classroom.",
        "laneOptions": [
          "must",
          "mustn't",
          "can't"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Modals of Obligation",
        "explanation": "'Must' expresses a necessary rule or duty."
      },
      {
        "id": "gr_g7_e_48",
        "sentencePrompt": "We _____ go to school on Sundays because it's the weekend.",
        "laneOptions": [
          "doesn't",
          "don't",
          "aren't"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple Negative",
        "explanation": "Plural subject 'We' takes 'don't'."
      },
      {
        "id": "gr_g7_e_49",
        "sentencePrompt": "_____ did you watch that exciting wildlife documentary?",
        "laneOptions": [
          "What",
          "Who",
          "When"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Question Words",
        "explanation": "'When' asks about time."
      },
      {
        "id": "gr_g7_e_50",
        "sentencePrompt": "There _____ a new bakery next to the municipal library.",
        "laneOptions": [
          "is",
          "are",
          "were"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "There is / There are",
        "explanation": "Singular noun 'a new bakery' takes 'is'."
      },
      {
        "id": "gr_g7_e_51",
        "sentencePrompt": "My sister has _____ curly hair and green eyes.",
        "laneOptions": [
          "get",
          "got",
          "getting"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Have / Has Got",
        "explanation": "Third person singular takes 'has got'."
      },
      {
        "id": "gr_g7_e_52",
        "sentencePrompt": "They _____ to Ankara last Friday to visit Atatürk's Mausoleum.",
        "laneOptions": [
          "gone",
          "go",
          "went"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Irregular",
        "explanation": "Past tense of 'go' is 'went'."
      },
      {
        "id": "gr_g7_e_53",
        "sentencePrompt": "An elephant is _____ than a gazelle.",
        "laneOptions": [
          "heavier",
          "heaviest",
          "more heavy"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Comparative Adjectives",
        "explanation": "Two-syllable ending in -y changes to -ier: heavier."
      },
      {
        "id": "gr_g7_e_54",
        "sentencePrompt": "We always celebrate Republic Day _____ the 29th of October.",
        "laneOptions": [
          "in",
          "on",
          "at"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prepositions of Time",
        "explanation": "Specific calendar dates take 'on'."
      },
      {
        "id": "gr_g7_e_55",
        "sentencePrompt": "He is interested _____ learning about distant solar planets.",
        "laneOptions": [
          "at",
          "on",
          "in"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositional Phrases",
        "explanation": "'Interested in' is the correct dependent preposition."
      },
      {
        "id": "gr_g7_e_56",
        "sentencePrompt": "You _____ feed wild animals in the nature reserve.",
        "laneOptions": [
          "mustn't",
          "must",
          "can"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Modals of Prohibition",
        "explanation": "'Mustn't' expresses strict prohibition."
      },
      {
        "id": "gr_g7_e_57",
        "sentencePrompt": "How _____ spectators attended the national archery match?",
        "laneOptions": [
          "much",
          "many",
          "any"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Quantifiers",
        "explanation": "Countable plural noun 'spectators' takes 'how many'."
      },
      {
        "id": "gr_g7_e_58",
        "sentencePrompt": "There isn't _____ orange juice left in the kitchen jug.",
        "laneOptions": [
          "many",
          "some",
          "any"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Some / Any",
        "explanation": "Negative sentences take 'any' with uncountables."
      },
      {
        "id": "gr_g7_e_59",
        "sentencePrompt": "He was very tired, _____ he went to bed early.",
        "laneOptions": [
          "so",
          "because",
          "but"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Conjunctions of Result",
        "explanation": "'So' introduces the logical consequence."
      },
      {
        "id": "gr_g7_e_60",
        "sentencePrompt": "She stayed at home _____ she had a bad fever.",
        "laneOptions": [
          "so",
          "because",
          "but"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Conjunctions of Cause",
        "explanation": "'Because' introduces the reason."
      },
      {
        "id": "gr_g7_e_61",
        "sentencePrompt": "My grandfather _____ a famous scientist in the 1980s.",
        "laneOptions": [
          "is",
          "were",
          "was"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple To Be",
        "explanation": "Singular subject takes 'was'."
      },
      {
        "id": "gr_g7_e_62",
        "sentencePrompt": "Did you _____ your homework before going out to play?",
        "laneOptions": [
          "finish",
          "finished",
          "finishing"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Question",
        "explanation": "After 'did', use the base form of the verb."
      },
      {
        "id": "gr_g7_e_63",
        "sentencePrompt": "The blue whale is the _____ animal in the entire ocean.",
        "laneOptions": [
          "bigger",
          "biggest",
          "most big"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Superlative Adjectives",
        "explanation": "Superlative degree uses 'the biggest'."
      },
      {
        "id": "gr_g7_e_64",
        "sentencePrompt": "We _____ our grandparents every single summer holiday.",
        "laneOptions": [
          "visiting",
          "visits",
          "visit"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Habit",
        "explanation": "Plural subject 'We' takes base verb 'visit'."
      },
      {
        "id": "gr_g7_e_65",
        "sentencePrompt": "Listen! Someone _____ at the front door right now.",
        "laneOptions": [
          "is knocking",
          "knocks",
          "knocked"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Continuous",
        "explanation": "Present action happening right now."
      },
      {
        "id": "gr_g7_e_66",
        "sentencePrompt": "He doesn't _____ meat because he is a vegetarian.",
        "laneOptions": [
          "eats",
          "eat",
          "ate"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple Negative",
        "explanation": "After 'doesn't', use base verb 'eat'."
      },
      {
        "id": "gr_g7_e_67",
        "sentencePrompt": "A tortoise moves _____ than a wild cheetah.",
        "laneOptions": [
          "more slow",
          "slowest",
          "slower"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparative Adjectives",
        "explanation": "Comparative of slow is slower."
      },
      {
        "id": "gr_g7_e_68",
        "sentencePrompt": "What time _____ your online English class start?",
        "laneOptions": [
          "does",
          "do",
          "is"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Simple Question",
        "explanation": "Singular subject 'class' takes auxiliary 'does'."
      },
      {
        "id": "gr_g7_e_69",
        "sentencePrompt": "They were playing volleyball _____ the phone rang.",
        "laneOptions": [
          "while",
          "when",
          "during"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Continuous with When",
        "explanation": "'When' introduces a sudden short interrupting action."
      },
      {
        "id": "gr_g7_e_70",
        "sentencePrompt": "_____ you ever seen an endangered sea turtle?",
        "laneOptions": [
          "Did",
          "Has",
          "Have"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Perfect",
        "explanation": "Subject 'you' takes auxiliary 'Have'."
      },
      {
        "id": "gr_g7_e_71",
        "sentencePrompt": "She is _____ generous person I have ever met in school.",
        "laneOptions": [
          "the most",
          "more",
          "most"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Superlative Long Adjectives",
        "explanation": "Long adjectives take 'the most'."
      },
      {
        "id": "gr_g7_e_72",
        "sentencePrompt": "Don't share your private password _____ anyone online.",
        "laneOptions": [
          "to",
          "with",
          "for"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prepositions with Verbs",
        "explanation": "'Share with' is the correct preposition."
      },
      {
        "id": "gr_g7_e_73",
        "sentencePrompt": "The solar system _____ eight major planets orbiting the Sun.",
        "laneOptions": [
          "having",
          "have",
          "has"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Fact",
        "explanation": "Singular subject 'solar system' takes 'has'."
      },
      {
        "id": "gr_g7_e_74",
        "sentencePrompt": "Yesterday afternoon, we _____ around the ancient lake.",
        "laneOptions": [
          "hiked",
          "hike",
          "hiking"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Regular",
        "explanation": "Past tense of regular verb 'hike' is 'hiked'."
      },
      {
        "id": "gr_g7_e_75",
        "sentencePrompt": "You _____ wear a sturdy helmet while riding your bicycle.",
        "laneOptions": [
          "shouldn't",
          "should",
          "can't"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Giving Advice",
        "explanation": "'Should' gives positive safety advice."
      },
      {
        "id": "gr_g7_e_76",
        "sentencePrompt": "How _____ water do wild camels need during desert travel?",
        "laneOptions": [
          "any",
          "many",
          "much"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Quantifiers",
        "explanation": "Uncountable noun 'water' takes 'how much'."
      },
      {
        "id": "gr_g7_e_77",
        "sentencePrompt": "Can you speak English _____ than your older brother?",
        "laneOptions": [
          "better",
          "good",
          "best"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Irregular Comparatives",
        "explanation": "Comparative of 'good/well' is 'better'."
      },
      {
        "id": "gr_g7_e_78",
        "sentencePrompt": "They didn't _____ any wild wolves in the national park.",
        "laneOptions": [
          "saw",
          "see",
          "seen"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Negative",
        "explanation": "After 'didn't', use the base verb 'see'."
      },
      {
        "id": "gr_g7_e_79",
        "sentencePrompt": "The chemist's shop is located _____ the city library.",
        "laneOptions": [
          "among",
          "between",
          "opposite"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositions of Place",
        "explanation": "'Opposite' indicates directly across."
      },
      {
        "id": "gr_g7_e_80",
        "sentencePrompt": "I am going to _____ my science project this weekend.",
        "laneOptions": [
          "complete",
          "completed",
          "completing"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Future with Going To",
        "explanation": "'Be going to' is followed by a base infinitive."
      }
    ],
    "medium": [
      {
        "id": "gr_g7_m_01",
        "sentencePrompt": "Listen! Somebody _____ the piano upstairs.",
        "laneOptions": [
          "is playing",
          "plays",
          "played"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Continuous",
        "explanation": "'Listen!' signals an action happening right now (is playing)."
      },
      {
        "id": "gr_g7_m_02",
        "sentencePrompt": "We _____ dinner at 7:00 PM every evening.",
        "laneOptions": [
          "are eating",
          "eat",
          "eats"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple Habit",
        "explanation": "Habitual daily actions take the Present Simple."
      },
      {
        "id": "gr_g7_m_03",
        "sentencePrompt": "Right now, Sarah _____ her homework at her desk.",
        "laneOptions": [
          "does",
          "did",
          "is doing"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Continuous",
        "explanation": "'Right now' indicates an action in progress."
      },
      {
        "id": "gr_g7_m_04",
        "sentencePrompt": "Water _____ at 100 degrees Celsius.",
        "laneOptions": [
          "boils",
          "boil",
          "is boiling"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Facts & General Truths",
        "explanation": "Scientific facts take the Present Simple."
      },
      {
        "id": "gr_g7_m_05",
        "sentencePrompt": "They _____ TV at the moment; they are outside.",
        "laneOptions": [
          "don't watch",
          "aren't watching",
          "not watching"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Continuous Negative",
        "explanation": "'At the moment' requires 'aren't watching'."
      },
      {
        "id": "gr_g7_m_06",
        "sentencePrompt": "_____ you studying for the science test tonight?",
        "laneOptions": [
          "Do",
          "Will",
          "Are"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Continuous Question",
        "explanation": "Use 'Are + subject + -ing' for continuous actions."
      },
      {
        "id": "gr_g7_m_07",
        "sentencePrompt": "Tom usually _____ by bus, but today he is walking.",
        "laneOptions": [
          "goes",
          "is going",
          "went"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Habit vs Temporary",
        "explanation": "'Usually' signals habitual routine (goes)."
      },
      {
        "id": "gr_g7_m_08",
        "sentencePrompt": "I _____ what you mean, can you explain again?",
        "laneOptions": [
          "am not understanding",
          "don't understand",
          "not understand"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Stative Verbs",
        "explanation": "Verbs of liking like 'prefer' are not used with -ing. Use the present simple.",
        "contentVersion": 2
      },
      {
        "id": "gr_g7_m_09",
        "sentencePrompt": "She _____ three languages fluently.",
        "laneOptions": [
          "speak",
          "is speaking",
          "speaks"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Ability",
        "explanation": "Speaking languages is a permanent skill, requiring Present Simple."
      },
      {
        "id": "gr_g7_m_10",
        "sentencePrompt": "Why _____ you wearing a heavy coat indoors?",
        "laneOptions": [
          "are",
          "do",
          "have"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Continuous",
        "explanation": "Use 'are you wearing' for present action."
      },
      {
        "id": "gr_g7_m_11",
        "sentencePrompt": "Yesterday, we _____ to the city science museum.",
        "laneOptions": [
          "go",
          "went",
          "goed"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Irregular",
        "explanation": "The past tense of 'go' is 'went'."
      },
      {
        "id": "gr_g7_m_12",
        "sentencePrompt": "He _____ his keys on the playground yesterday.",
        "laneOptions": [
          "loosed",
          "losed",
          "lost"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Irregular",
        "explanation": "The past tense of 'lose' is 'lost'."
      },
      {
        "id": "gr_g7_m_13",
        "sentencePrompt": "They _____ a delicious cake for grandma's birthday.",
        "laneOptions": [
          "baked",
          "baket",
          "baking"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Regular",
        "explanation": "Regular verbs ending in '-e' add '-d' ('baked')."
      },
      {
        "id": "gr_g7_m_14",
        "sentencePrompt": "Did you _____ the new film last night?",
        "laneOptions": [
          "saw",
          "see",
          "seen"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Question",
        "explanation": "After 'Did', use the base form of the main verb ('see')."
      },
      {
        "id": "gr_g7_m_15",
        "sentencePrompt": "We _____ not enjoy the noisy party on Saturday.",
        "laneOptions": [
          "were",
          "do",
          "did"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Negative",
        "explanation": "Use 'did not' + base verb in past simple negatives."
      },
      {
        "id": "gr_g7_m_16",
        "sentencePrompt": "Where _____ you born? — In Izmir.",
        "laneOptions": [
          "were",
          "was",
          "are"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple To Be",
        "explanation": "Use 'were' with the subject 'you'."
      },
      {
        "id": "gr_g7_m_17",
        "sentencePrompt": "She _____ at school yesterday because she had the flu.",
        "laneOptions": [
          "weren't",
          "wasn't",
          "isn't"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple To Be",
        "explanation": "Use 'wasn't' with singular subjects (she)."
      },
      {
        "id": "gr_g7_m_18",
        "sentencePrompt": "I _____ my grandparents two weeks ago.",
        "laneOptions": [
          "visit",
          "visiting",
          "visited"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Time Expression",
        "explanation": "'Two weeks ago' signals the past simple ('visited')."
      },
      {
        "id": "gr_g7_m_19",
        "sentencePrompt": "Who _____ you that fantastic story?",
        "laneOptions": [
          "told",
          "telled",
          "tells"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Irregular",
        "explanation": "The past tense of 'tell' is 'told'."
      },
      {
        "id": "gr_g7_m_20",
        "sentencePrompt": "The train _____ at the platform five minutes late.",
        "laneOptions": [
          "arrive",
          "arrived",
          "was arrived"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Active",
        "explanation": "Use the past simple form 'arrived'."
      },
      {
        "id": "gr_g7_m_21",
        "sentencePrompt": "Russia is the _____ country in the entire world.",
        "laneOptions": [
          "larger",
          "most large",
          "largest"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Superlative Adjectives",
        "explanation": "Use 'the largest' for one-syllable superlative adjectives."
      },
      {
        "id": "gr_g7_m_22",
        "sentencePrompt": "Travelling by plane is _____ than travelling by train.",
        "laneOptions": [
          "faster",
          "more fast",
          "fastest"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Comparative Adjectives",
        "explanation": "Short adjectives add '-er' to form the comparative."
      },
      {
        "id": "gr_g7_m_23",
        "sentencePrompt": "This tablet is _____ expensive than that smartphone.",
        "laneOptions": [
          "much",
          "more",
          "most"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Comparative Long Adjectives",
        "explanation": "Long adjectives use 'more + adjective + than'."
      },
      {
        "id": "gr_g7_m_24",
        "sentencePrompt": "Mount Everest is the _____ mountain on Earth.",
        "laneOptions": [
          "higher",
          "most high",
          "highest"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Superlative Adjectives",
        "explanation": "'The highest' is the superlative form of high."
      },
      {
        "id": "gr_g7_m_25",
        "sentencePrompt": "My health is getting _____ day by day.",
        "laneOptions": [
          "better",
          "gooder",
          "best"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Irregular Comparatives",
        "explanation": "'Better' is the comparative form of 'good'."
      },
      {
        "id": "gr_g7_m_26",
        "sentencePrompt": "That was the _____ movie I have ever seen!",
        "laneOptions": [
          "baddest",
          "worst",
          "worse"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Irregular Superlatives",
        "explanation": "'The worst' is the superlative form of 'bad'."
      },
      {
        "id": "gr_g7_m_27",
        "sentencePrompt": "Gold is _____ heavy than aluminum.",
        "laneOptions": [
          "much",
          "most",
          "more"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparatives",
        "explanation": "Use 'more' for comparative comparisons."
      },
      {
        "id": "gr_g7_m_28",
        "sentencePrompt": "Learning Japanese is _____ difficult than learning English.",
        "laneOptions": [
          "more",
          "most",
          "many"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Comparative Long Adjectives",
        "explanation": "Use 'more' before multi-syllable adjectives."
      },
      {
        "id": "gr_g7_m_29",
        "sentencePrompt": "Who is the _____ student in your class?",
        "laneOptions": [
          "older",
          "oldest",
          "most old"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Superlatives",
        "explanation": "'The oldest' is the superlative form of 'old'."
      },
      {
        "id": "gr_g7_m_30",
        "sentencePrompt": "A cheetah runs _____ than a lion.",
        "laneOptions": [
          "more fast",
          "fastest",
          "faster"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparative Adverbs/Adjectives",
        "explanation": "'Faster' is the comparative form of fast."
      },
      {
        "id": "gr_g7_m_31",
        "sentencePrompt": "Students _____ be quiet during the final exam.",
        "laneOptions": [
          "must",
          "can",
          "might"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Modal of Obligation",
        "explanation": "'Must' expresses strong obligation or necessity."
      },
      {
        "id": "gr_g7_m_32",
        "sentencePrompt": "You _____ touch the electrical wires; it's dangerous!",
        "laneOptions": [
          "don't have to",
          "mustn't",
          "might"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Modal of Prohibition",
        "explanation": "'Mustn't' expresses strict prohibition."
      },
      {
        "id": "gr_g7_m_33",
        "sentencePrompt": "You look sick; you _____ see a doctor today.",
        "laneOptions": [
          "would",
          "could",
          "should"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Giving Advice",
        "explanation": "'Should' is used to offer helpful advice."
      },
      {
        "id": "gr_g7_m_34",
        "sentencePrompt": "We have _____ milk left; we must buy some more.",
        "laneOptions": [
          "little",
          "few",
          "many"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Quantifiers Uncountable",
        "explanation": "'Little' is used with uncountable nouns like milk."
      },
      {
        "id": "gr_g7_m_35",
        "sentencePrompt": "Only a _____ people came to the park because of the cold.",
        "laneOptions": [
          "little",
          "few",
          "much"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Quantifiers Countable",
        "explanation": "'A few' is used with plural countable nouns."
      },
      {
        "id": "gr_g7_m_36",
        "sentencePrompt": "How _____ water do you drink every day?",
        "laneOptions": [
          "many",
          "often",
          "much"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "How Much / How Many",
        "explanation": "Use 'How much' with uncountable nouns."
      },
      {
        "id": "gr_g7_m_37",
        "sentencePrompt": "I don't have _____ time to finish this project now.",
        "laneOptions": [
          "much",
          "many",
          "a lot"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Much with Uncountable",
        "explanation": "Use 'much' with uncountable time in negative sentences."
      },
      {
        "id": "gr_g7_m_38",
        "sentencePrompt": "They walked _____ the forest to reach the castle.",
        "laneOptions": [
          "across",
          "through",
          "over"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prepositions of Movement",
        "explanation": "Use 'through' when moving inside a 3D space like a forest."
      },
      {
        "id": "gr_g7_m_39",
        "sentencePrompt": "He jumped _____ the puddle so his shoes wouldn't get wet.",
        "laneOptions": [
          "under",
          "through",
          "over"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositions of Movement",
        "explanation": "Use 'over' when clearing an obstacle from above."
      },
      {
        "id": "gr_g7_m_40",
        "sentencePrompt": "I wanted to go swimming, _____ it started raining heavily.",
        "laneOptions": [
          "but",
          "so",
          "because"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Conjunctions",
        "explanation": "'But' shows contrast between two clauses."
      },
      {
        "id": "gr_g7_m_41",
        "sentencePrompt": "While my brother was studying, I _____ my mountain bike.",
        "laneOptions": [
          "washed",
          "was washing",
          "wash"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Continuous (While)",
        "explanation": "Two simultaneous continuous actions in past."
      },
      {
        "id": "gr_g7_m_42",
        "sentencePrompt": "Mount Everest is _____ than any other mountain on Earth.",
        "laneOptions": [
          "more high",
          "highest",
          "higher"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparative Adjectives",
        "explanation": "One-syllable comparative takes -er."
      },
      {
        "id": "gr_g7_m_43",
        "sentencePrompt": "He used to _____ basketball every weekend when he was younger.",
        "laneOptions": [
          "play",
          "played",
          "playing"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Used To + Base Verb",
        "explanation": "'Used to' is followed by the bare base verb."
      },
      {
        "id": "gr_g7_m_44",
        "sentencePrompt": "If we protect national parks, endangered animals _____ survive.",
        "laneOptions": [
          "would",
          "will",
          "did"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "First Conditional",
        "explanation": "Real conditional: If + present, will + base verb."
      },
      {
        "id": "gr_g7_m_45",
        "sentencePrompt": "She is capable of _____ complex science equations quickly.",
        "laneOptions": [
          "solved",
          "solve",
          "solving"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Preposition + Gerund",
        "explanation": "Prepositions are followed by gerund (-ing)."
      },
      {
        "id": "gr_g7_m_46",
        "sentencePrompt": "The documentary was _____ interesting that we watched it twice.",
        "laneOptions": [
          "so",
          "such",
          "too"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "So ... That",
        "explanation": "'So' is used before standalone adjectives."
      },
      {
        "id": "gr_g7_m_47",
        "sentencePrompt": "Neither my friend _____ I had ever visited the royal palace.",
        "laneOptions": [
          "or",
          "nor",
          "and"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Correlative Conjunctions",
        "explanation": "'Neither' pairs with 'nor'."
      },
      {
        "id": "gr_g7_m_48",
        "sentencePrompt": "You ought _____ apologize for your clumsy behavior yesterday.",
        "laneOptions": [
          "with",
          "for",
          "to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Ought To",
        "explanation": "'Ought' requires particle 'to'."
      },
      {
        "id": "gr_g7_m_49",
        "sentencePrompt": "The fire station received an emergency call _____ midnight.",
        "laneOptions": [
          "at",
          "on",
          "in"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Prepositions of Time",
        "explanation": "Clock times and 'midnight' take 'at'."
      },
      {
        "id": "gr_g7_m_50",
        "sentencePrompt": "Although it was raining heavily, the spectators _____ in the arena.",
        "laneOptions": [
          "stay",
          "stayed",
          "staying"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Concessions (Although)",
        "explanation": "Expressing contrast in past narrative."
      },
      {
        "id": "gr_g7_m_51",
        "sentencePrompt": "Who _____ the telescope in the seventeenth century?",
        "laneOptions": [
          "invent",
          "did invent",
          "invented"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Subject Question",
        "explanation": "Subject questions do not use auxiliary 'did'."
      },
      {
        "id": "gr_g7_m_52",
        "sentencePrompt": "By the time the rescue team arrived, the hikers _____ a safe shelter.",
        "laneOptions": [
          "had built",
          "built",
          "build"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Perfect",
        "explanation": "Action completed before another past event."
      },
      {
        "id": "gr_g7_m_53",
        "sentencePrompt": "The municipality announced that the new art gallery _____ next month.",
        "laneOptions": [
          "opened",
          "will open",
          "opens"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Reported Future",
        "explanation": "Planned future event."
      },
      {
        "id": "gr_g7_m_54",
        "sentencePrompt": "You had better _____ your seatbelt during extreme safari rides.",
        "laneOptions": [
          "fastening",
          "to fasten",
          "fasten"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Had Better + Bare Verb",
        "explanation": "'Had better' takes a bare infinitive."
      },
      {
        "id": "gr_g7_m_55",
        "sentencePrompt": "She didn't use to _____ science fiction movies, but now she loves them.",
        "laneOptions": [
          "like",
          "liked",
          "liking"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Used To Negative",
        "explanation": "Negative 'didn't use to' takes base verb."
      },
      {
        "id": "gr_g7_m_56",
        "sentencePrompt": "The solar panels generate electricity _____ the day is cloudy.",
        "laneOptions": [
          "despite",
          "even if",
          "because"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Conjunctions of Condition",
        "explanation": "'Even if' introduces a concession."
      },
      {
        "id": "gr_g7_m_57",
        "sentencePrompt": "I haven't completed my biography presentation _____.",
        "laneOptions": [
          "just",
          "already",
          "yet"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Perfect with Yet",
        "explanation": "'Yet' is used in negative sentences at the end."
      },
      {
        "id": "gr_g7_m_58",
        "sentencePrompt": "How long have you _____ a member of the school environmental club?",
        "laneOptions": [
          "been",
          "be",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect with How Long",
        "explanation": "Past participle of 'be' is 'been'."
      },
      {
        "id": "gr_g7_m_59",
        "sentencePrompt": "He was looking forward to _____ the ancient museum ruins.",
        "laneOptions": [
          "visit",
          "visiting",
          "visited"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Look Forward To + -ing",
        "explanation": "'To' is a preposition here, followed by gerund."
      },
      {
        "id": "gr_g7_m_60",
        "sentencePrompt": "The cheetah ran so swiftly _____ no prey could escape.",
        "laneOptions": [
          "than",
          "as",
          "that"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "So ... That Result",
        "explanation": "Consecutive clause of result."
      },
      {
        "id": "gr_g7_m_61",
        "sentencePrompt": "Unless we reduce plastic waste, ocean wildlife _____ suffer severe damage.",
        "laneOptions": [
          "will",
          "would",
          "did"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Conditionals with Unless",
        "explanation": "'Unless' means 'if not' in first conditional."
      },
      {
        "id": "gr_g7_m_62",
        "sentencePrompt": "They were walking through the forest when they suddenly _____ an injured eagle.",
        "laneOptions": [
          "were spotting",
          "spotted",
          "spot"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Interruption",
        "explanation": "Short completed past action."
      },
      {
        "id": "gr_g7_m_63",
        "sentencePrompt": "This public library is _____ modern than the one in my hometown.",
        "laneOptions": [
          "much",
          "most",
          "more"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparative of Long Adjectives",
        "explanation": "Long adjectives take 'more' in comparatives."
      },
      {
        "id": "gr_g7_m_64",
        "sentencePrompt": "He had to stay after school in order to _____ his science experiment.",
        "laneOptions": [
          "finish",
          "finishing",
          "finished"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "In Order To + Infinitive",
        "explanation": "Purpose connector takes base verb."
      },
      {
        "id": "gr_g7_m_65",
        "sentencePrompt": "We enjoyed _____ the British heritage exhibition last weekend.",
        "laneOptions": [
          "explore",
          "exploring",
          "explored"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Gerunds after Enjoy",
        "explanation": "'Enjoy' is followed by a gerund (-ing)."
      },
      {
        "id": "gr_g7_m_66",
        "sentencePrompt": "The weather was sunny, _____ we decided to hike up the rocky hill.",
        "laneOptions": [
          "although",
          "because",
          "so"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Cause and Result (So)",
        "explanation": "Result connector."
      },
      {
        "id": "gr_g7_m_67",
        "sentencePrompt": "Has your class _____ planted trees in the municipal park?",
        "laneOptions": [
          "ever",
          "never",
          "yet"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect (Ever)",
        "explanation": "'Ever' in questions asking about life experience."
      },
      {
        "id": "gr_g7_m_68",
        "sentencePrompt": "A chameleon uses camouflage _____ hide from dangerous predators.",
        "laneOptions": [
          "for",
          "to",
          "so"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Infinitive of Purpose",
        "explanation": "'To + verb' expresses purpose."
      },
      {
        "id": "gr_g7_m_69",
        "sentencePrompt": "The spacecraft traveled beyond Earth's atmosphere _____ speed.",
        "laneOptions": [
          "with high",
          "in high",
          "at high"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositional Collocations",
        "explanation": "'At high speed' is the standard English phrase."
      },
      {
        "id": "gr_g7_m_70",
        "sentencePrompt": "You must avoid _____ personal passwords on public computers.",
        "laneOptions": [
          "saving",
          "save",
          "to save"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Verbs Followed by Gerund",
        "explanation": "'Avoid' takes a gerund (-ing)."
      },
      {
        "id": "gr_g7_m_71",
        "sentencePrompt": "The students were listening carefully while the teacher _____ the experiment.",
        "laneOptions": [
          "explained",
          "was explaining",
          "explains"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Continuous (While)",
        "explanation": "Simultaneous ongoing action in past."
      },
      {
        "id": "gr_g7_m_72",
        "sentencePrompt": "She is not old _____ to drive a motor vehicle legally.",
        "laneOptions": [
          "so",
          "too",
          "enough"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Adjective + Enough",
        "explanation": "'Enough' follows the adjective."
      },
      {
        "id": "gr_g7_m_73",
        "sentencePrompt": "This is the planet _____ gravity keeps the moons in stable orbit.",
        "laneOptions": [
          "whose",
          "which",
          "where"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Relative Pronouns (Whose)",
        "explanation": "Possessive relative pronoun."
      },
      {
        "id": "gr_g7_m_74",
        "sentencePrompt": "He succeeded in _____ the highest grade on the English exam.",
        "laneOptions": [
          "achieve",
          "achieving",
          "to achieve"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Preposition + Gerund",
        "explanation": "'In' takes a gerund."
      },
      {
        "id": "gr_g7_m_75",
        "sentencePrompt": "Would you mind _____ the window? It feels chilly in the room.",
        "laneOptions": [
          "close",
          "to close",
          "closing"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Mind + Gerund",
        "explanation": "'Would you mind' takes a gerund."
      },
      {
        "id": "gr_g7_m_76",
        "sentencePrompt": "They have lived in Britain _____ five memorable years.",
        "laneOptions": [
          "for",
          "since",
          "during"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "For vs Since",
        "explanation": "'For' is used for duration."
      },
      {
        "id": "gr_g7_m_77",
        "sentencePrompt": "The museum guide told us _____ touch the ancient Roman statues.",
        "laneOptions": [
          "don't",
          "not to",
          "no"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Reported Imperatives",
        "explanation": "Negative reported command: 'told us not to'."
      },
      {
        "id": "gr_g7_m_78",
        "sentencePrompt": "As soon as the alarm rang, the firefighters _____ the station.",
        "laneOptions": [
          "leave",
          "were leaving",
          "left"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Time Clauses (As Soon As)",
        "explanation": "Immediate sequential past actions."
      },
      {
        "id": "gr_g7_m_79",
        "sentencePrompt": "I would rather travel by train _____ drive through dense traffic.",
        "laneOptions": [
          "than",
          "to",
          "from"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Would Rather ... Than",
        "explanation": "'Would rather' takes 'than' with bare verbs."
      },
      {
        "id": "gr_g7_m_80",
        "sentencePrompt": "She spoke so quietly that _____ anyone could hear her explanation.",
        "laneOptions": [
          "hard",
          "hardly",
          "harder"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Adverb of Degree (Hardly)",
        "explanation": "'Hardly' means barely or scarcely."
      }
    ],
    "hard": [
      {
        "id": "gr_g7_h_01",
        "sentencePrompt": "While I _____ my homework, the power went out.",
        "laneOptions": [
          "am doing",
          "did",
          "was doing"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Continuous with While",
        "explanation": "'While' is followed by a continuous action in progress."
      },
      {
        "id": "gr_g7_h_02",
        "sentencePrompt": "The phone rang while she _____ a shower.",
        "laneOptions": [
          "takes",
          "was taking",
          "took"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Continuous Interruption",
        "explanation": "A long background action takes the past continuous (was taking)."
      },
      {
        "id": "gr_g7_h_03",
        "sentencePrompt": "We were playing football when it _____ to rain.",
        "laneOptions": [
          "starts",
          "was starting",
          "started"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple with When",
        "explanation": "A short interrupting action takes the past simple (started)."
      },
      {
        "id": "gr_g7_h_04",
        "sentencePrompt": "What _____ you doing at 8 PM yesterday evening?",
        "laneOptions": [
          "were",
          "did",
          "are"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Continuous Question",
        "explanation": "Use 'were you doing' for an action at a specific past moment."
      },
      {
        "id": "gr_g7_h_05",
        "sentencePrompt": "He broke his leg while he _____ down the mountain.",
        "laneOptions": [
          "skis",
          "was skiing",
          "skied"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Continuous with While",
        "explanation": "'Was skiing' describes the ongoing activity when the accident happened."
      },
      {
        "id": "gr_g7_h_06",
        "sentencePrompt": "I saw an old friend while I _____ for the bus.",
        "laneOptions": [
          "waited",
          "am waiting",
          "was waiting"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Continuous",
        "explanation": "Ongoing background action requires 'was waiting'."
      },
      {
        "id": "gr_g7_h_07",
        "sentencePrompt": "They _____ sleeping when the burglar entered the house.",
        "laneOptions": [
          "were",
          "was",
          "did"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Continuous Plural",
        "explanation": "'They' requires the auxiliary 'were'."
      },
      {
        "id": "gr_g7_h_08",
        "sentencePrompt": "As we were walking along the beach, we _____ a rare seashell.",
        "laneOptions": [
          "were finding",
          "found",
          "find"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Interruption",
        "explanation": "Discovering the shell is a completed single event ('found')."
      },
      {
        "id": "gr_g7_h_09",
        "sentencePrompt": "While mother was cooking, father _____ the garden.",
        "laneOptions": [
          "watered",
          "waters",
          "was watering"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Simultaneous Past Actions",
        "explanation": "Two parallel ongoing past actions both use past continuous."
      },
      {
        "id": "gr_g7_h_10",
        "sentencePrompt": "The teacher entered the room while the students _____ noisily.",
        "laneOptions": [
          "were arguing",
          "argued",
          "are arguing"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Continuous with While",
        "explanation": "Ongoing activity during the interruption uses past continuous."
      },
      {
        "id": "gr_g7_h_11",
        "sentencePrompt": "Look at those dark clouds! It _____ rain very soon.",
        "laneOptions": [
          "will",
          "is going to",
          "goes to"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Predictions with Evidence",
        "explanation": "Use 'be going to' when there is visible present evidence."
      },
      {
        "id": "gr_g7_h_12",
        "sentencePrompt": "I think robots _____ do most housework in 2050.",
        "laneOptions": [
          "do",
          "are going to",
          "will"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Future Predictions with Think",
        "explanation": "Use 'will' for personal opinions and predictions with 'think'."
      },
      {
        "id": "gr_g7_h_13",
        "sentencePrompt": "The phone is ringing. — I _____ answer it!",
        "laneOptions": [
          "will",
          "am going to",
          "am answering"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Instant Decisions",
        "explanation": "Use 'will' for spontaneous decisions made at the moment of speaking."
      },
      {
        "id": "gr_g7_h_14",
        "sentencePrompt": "We have already booked our flight; we _____ visit Rome in June.",
        "laneOptions": [
          "will",
          "are going to",
          "go to"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prior Plans & Intentions",
        "explanation": "Pre-planned future intentions use 'be going to'."
      },
      {
        "id": "gr_g7_h_15",
        "sentencePrompt": "Don't carry that heavy box alone; I _____ help you.",
        "laneOptions": [
          "am going to",
          "would",
          "will"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Future Offers",
        "explanation": "Use 'will' when offering immediate assistance."
      },
      {
        "id": "gr_g7_h_16",
        "sentencePrompt": "She _____ buy a new laptop with her savings next week.",
        "laneOptions": [
          "is going to",
          "will to",
          "shall to"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Planned Future",
        "explanation": "Use 'is going to' for planned future actions."
      },
      {
        "id": "gr_g7_h_17",
        "sentencePrompt": "I promise I _____ tell your secret to anyone.",
        "laneOptions": [
          "am not going to",
          "won't",
          "don't"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Promises with Will",
        "explanation": "Use 'will / won't' for promises and commitments."
      },
      {
        "id": "gr_g7_h_18",
        "sentencePrompt": "Be careful! You _____ drop those fragile glasses!",
        "laneOptions": [
          "will",
          "did",
          "are going to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Imminent Danger / Evidence",
        "explanation": "Use 'are going to' when an event is about to happen right now."
      },
      {
        "id": "gr_g7_h_19",
        "sentencePrompt": "Scientists believe temperatures _____ rise further next decade.",
        "laneOptions": [
          "will",
          "are going to",
          "are"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Beliefs & Forecasts",
        "explanation": "Future forecasts with 'believe' typically take 'will'."
      },
      {
        "id": "gr_g7_h_20",
        "sentencePrompt": "What _____ do after finishing school today?",
        "laneOptions": [
          "will you",
          "are you going to",
          "you will"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Future Intentions",
        "explanation": "Use 'are you going to' to ask about existing plans."
      },
      {
        "id": "gr_g7_h_21",
        "sentencePrompt": "_____ he ran fast, he missed the morning bus.",
        "laneOptions": [
          "Although",
          "Because",
          "So"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Concessions (Although)",
        "explanation": "'Although' introduces an unexpected contrast between running fast and missing the bus.",
        "contentVersion": 2
      },
      {
        "id": "gr_g7_h_22",
        "sentencePrompt": "She stayed at home _____ she felt very sick.",
        "laneOptions": [
          "because",
          "so",
          "unless"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Conjunctions of Cause",
        "explanation": "'Because' gives the reason for an action."
      },
      {
        "id": "gr_g7_h_23",
        "sentencePrompt": "It was freezing outside, _____ we put on warm coats.",
        "laneOptions": [
          "because",
          "so",
          "but"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Conjunctions of Result",
        "explanation": "'So' connects a cause to its direct result."
      },
      {
        "id": "gr_g7_h_24",
        "sentencePrompt": "The boy _____ won the chess tournament is my cousin.",
        "laneOptions": [
          "which",
          "where",
          "who"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Relative Pronouns",
        "explanation": "Use 'who' to refer to human subjects (the boy)."
      },
      {
        "id": "gr_g7_h_25",
        "sentencePrompt": "This is the restaurant _____ we ate delicious pizza.",
        "laneOptions": [
          "where",
          "which",
          "who"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Relative Pronouns",
        "explanation": "Use 'where' to refer to places."
      },
      {
        "id": "gr_g7_h_26",
        "sentencePrompt": "The book _____ is on the desk belongs to the teacher.",
        "laneOptions": [
          "who",
          "which",
          "where"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Relative Pronouns",
        "explanation": "Use 'which' or 'that' for things and objects."
      },
      {
        "id": "gr_g7_h_27",
        "sentencePrompt": "You cannot enter the museum _____ you have a valid ticket.",
        "laneOptions": [
          "if",
          "because",
          "unless"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Conditionals (Unless)",
        "explanation": "'Unless' means 'if not' (if you do not have a ticket)."
      },
      {
        "id": "gr_g7_h_28",
        "sentencePrompt": "We will leave _____ soon as the rain stops.",
        "laneOptions": [
          "as",
          "so",
          "than"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Time Conjunctions",
        "explanation": "'As soon as' connects two related time events."
      },
      {
        "id": "gr_g7_h_29",
        "sentencePrompt": "I will call you _____ I arrive at the train station.",
        "laneOptions": [
          "during",
          "when",
          "while"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Time Conjunctions",
        "explanation": "Use 'when' with a completed point of arrival."
      },
      {
        "id": "gr_g7_h_30",
        "sentencePrompt": "Neither John _____ his brother likes spicy food.",
        "laneOptions": [
          "or",
          "and",
          "nor"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Correlative Conjunctions",
        "explanation": "'Neither' is always paired with 'nor'."
      },
      {
        "id": "gr_g7_h_31",
        "sentencePrompt": "The pianist played the classical melody _____.",
        "laneOptions": [
          "beautifully",
          "beautiful",
          "beauty"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Adverbs of Manner",
        "explanation": "Modify verbs with adverbs of manner ending in '-ly'."
      },
      {
        "id": "gr_g7_h_32",
        "sentencePrompt": "He drove very _____ along the slippery mountain road.",
        "laneOptions": [
          "careful",
          "carefully",
          "carefulness"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Adverbs of Manner",
        "explanation": "Use the adverb 'carefully' to describe how he drove."
      },
      {
        "id": "gr_g7_h_33",
        "sentencePrompt": "She speaks English extremely _____.",
        "laneOptions": [
          "good",
          "goodly",
          "well"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Irregular Adverbs",
        "explanation": "'Well' is the adverb form of the adjective 'good'."
      },
      {
        "id": "gr_g7_h_34",
        "sentencePrompt": "I really enjoy _____ fantasy novels in my spare time.",
        "laneOptions": [
          "reading",
          "to read",
          "read"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Gerunds after Enjoy",
        "explanation": "The verb 'enjoy' is followed by a gerund (-ing)."
      },
      {
        "id": "gr_g7_h_35",
        "sentencePrompt": "We decided _____ to the cinema this evening.",
        "laneOptions": [
          "going",
          "to go",
          "go"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Infinitives after Decide",
        "explanation": "The verb 'decide' is followed by an infinitive with 'to'."
      },
      {
        "id": "gr_g7_h_36",
        "sentencePrompt": "She is very good at _____ basketball.",
        "laneOptions": [
          "play",
          "to play",
          "playing"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositions + Gerund",
        "explanation": "Prepositions like 'at' are followed by verb-ing."
      },
      {
        "id": "gr_g7_h_37",
        "sentencePrompt": "Don't forget _____ off the lights before you leave.",
        "laneOptions": [
          "to turn",
          "turn",
          "turning"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Remember / Forget + to",
        "explanation": "'Forget to do' refers to performing a future duty."
      },
      {
        "id": "gr_g7_h_38",
        "sentencePrompt": "My teacher suggested _____ more grammar exercises.",
        "laneOptions": [
          "to do",
          "doing",
          "do"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Gerunds after Suggest",
        "explanation": "'Suggest' is followed by a gerund (-ing)."
      },
      {
        "id": "gr_g7_h_39",
        "sentencePrompt": "I hope _____ you at the science fair next week.",
        "laneOptions": [
          "see",
          "seeing",
          "to see"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Infinitives after Hope",
        "explanation": "The verb 'hope' takes an infinitive with 'to'."
      },
      {
        "id": "gr_g7_h_40",
        "sentencePrompt": "Thank you for _____ me with my heavy suitcase.",
        "laneOptions": [
          "helping",
          "to help",
          "help"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Prepositions + Gerund",
        "explanation": "Follow the preposition 'for' with the gerund form 'helping'."
      },
      {
        "id": "gr_g7_h_41",
        "sentencePrompt": "Had the environmentalists not intervened, the wetland _____ drained.",
        "laneOptions": [
          "had been",
          "will be",
          "would have been"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Third Conditional Result",
        "explanation": "Unreal past condition result."
      },
      {
        "id": "gr_g7_h_42",
        "sentencePrompt": "Not only _____ the match, but they also broke the national record.",
        "laneOptions": [
          "did they win",
          "they won",
          "they did win"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Inversion with Negative Adverbials",
        "explanation": "'Not only' at the start triggers question word order."
      },
      {
        "id": "gr_g7_h_43",
        "sentencePrompt": "The ancient manuscript is believed _____ written in the fourth century.",
        "laneOptions": [
          "to be",
          "to have been",
          "being"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Passive Reporting Verbs",
        "explanation": "Past action with perfect passive infinitive."
      },
      {
        "id": "gr_g7_h_44",
        "sentencePrompt": "No sooner had the space shuttle launched _____ communications were restored.",
        "laneOptions": [
          "then",
          "when",
          "than"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Correlative Connectors (No Sooner)",
        "explanation": "'No sooner' pairs strictly with 'than'."
      },
      {
        "id": "gr_g7_h_45",
        "sentencePrompt": "It is essential that every student _____ cybersecurity rules online.",
        "laneOptions": [
          "follow",
          "follows",
          "followed"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Subjunctive",
        "explanation": "Formal subjunctive uses bare base verb."
      },
      {
        "id": "gr_g7_h_46",
        "sentencePrompt": "Under no circumstances _____ you reveal your authentication credentials.",
        "laneOptions": [
          "you should",
          "should",
          "ought"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion for Emphasis",
        "explanation": "Negative phrase at front triggers inversion."
      },
      {
        "id": "gr_g7_h_47",
        "sentencePrompt": "The biodiversity of the rainforest is far _____ than previously estimated.",
        "laneOptions": [
          "more rich",
          "richest",
          "richer"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparative with Intensifiers",
        "explanation": "'Far' intensifies the comparative degree."
      },
      {
        "id": "gr_g7_h_48",
        "sentencePrompt": "Scarcely had the hikers reached the summit _____ the blizzard struck.",
        "laneOptions": [
          "when",
          "than",
          "then"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Correlative Connectors (Scarcely)",
        "explanation": "'Scarcely' pairs strictly with 'when'."
      },
      {
        "id": "gr_g7_h_49",
        "sentencePrompt": "She would have finished her astronomy paper on time if she _____ more resources.",
        "laneOptions": [
          "has",
          "had had",
          "would have"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Third Conditional If-Clause",
        "explanation": "Past unreal condition takes past perfect."
      },
      {
        "id": "gr_g7_h_50",
        "sentencePrompt": "The mayor was praised for having _____ the municipal recycling initiative.",
        "laneOptions": [
          "championing",
          "champion",
          "championed"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Perfect Gerund",
        "explanation": "Having + past participle indicates completed action."
      },
      {
        "id": "gr_g7_h_51",
        "sentencePrompt": "_____ you to encounter an endangered predator, remain calm and back away.",
        "laneOptions": [
          "Were",
          "Had",
          "Should"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Inversion in Conditional",
        "explanation": "'Were you to...' expresses formal hypothetical condition."
      },
      {
        "id": "gr_g7_h_52",
        "sentencePrompt": "Little _____ the researchers realize how significant their discovery would be.",
        "laneOptions": [
          "had",
          "did",
          "were"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Negative Inversion (Little)",
        "explanation": "'Little' at front requires auxiliary inversion."
      },
      {
        "id": "gr_g7_h_53",
        "sentencePrompt": "The telescope is so powerful that distant nebulae are visible _____ detail.",
        "laneOptions": [
          "by great",
          "with great",
          "in great"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositional Collocations",
        "explanation": "'In great detail' is the standard English idiom."
      },
      {
        "id": "gr_g7_h_54",
        "sentencePrompt": "He spoke as if he _____ an eyewitness to the historic space landing.",
        "laneOptions": [
          "had been",
          "is",
          "has been"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "As If with Unreal Past",
        "explanation": "'As if' takes past perfect for past unreal situations."
      },
      {
        "id": "gr_g7_h_55",
        "sentencePrompt": "Seldom _____ such extraordinary courage been displayed in wildlife rescue.",
        "laneOptions": [
          "is",
          "has",
          "was"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Seldom",
        "explanation": "'Seldom' at the front requires auxiliary inversion."
      },
      {
        "id": "gr_g7_h_56",
        "sentencePrompt": "The more energy we conserve today, the _____ our ecological footprint will be.",
        "laneOptions": [
          "more small",
          "smallest",
          "smaller"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "The More ... The More",
        "explanation": "Parallel comparative structure."
      },
      {
        "id": "gr_g7_h_57",
        "sentencePrompt": "She insisted that the endangered habitat _____ strictly protected by law.",
        "laneOptions": [
          "be",
          "is",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Subjunctive Passive",
        "explanation": "'Insist that' takes base subjunctive 'be protected'."
      },
      {
        "id": "gr_g7_h_58",
        "sentencePrompt": "Had it not been for the swift evacuation, hundreds _____ perished in the quake.",
        "laneOptions": [
          "will have",
          "might have",
          "have"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Unreal Consequence",
        "explanation": "Past modal perfect for hypothetical result."
      },
      {
        "id": "gr_g7_h_59",
        "sentencePrompt": "The ancient fortress walls are said to _____ rebuilt three times.",
        "laneOptions": [
          "being",
          "be",
          "have been"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Perfect Passive Infinitive",
        "explanation": "Reporting past completed events."
      },
      {
        "id": "gr_g7_h_60",
        "sentencePrompt": "Hardly had the alarm sounded _____ the rescue crew mobilized.",
        "laneOptions": [
          "when",
          "than",
          "after"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Hardly ... When",
        "explanation": "'Hardly' pairs strictly with 'when'."
      },
      {
        "id": "gr_g7_h_61",
        "sentencePrompt": "So fierce _____ the gale that ancient oak trees were uprooted across the park.",
        "laneOptions": [
          "is",
          "was",
          "were"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with So + Adjective",
        "explanation": "'So + adjective' at front triggers inversion."
      },
      {
        "id": "gr_g7_h_62",
        "sentencePrompt": "The faster technology evolves, the _____ vigilant we must be online.",
        "laneOptions": [
          "much",
          "most",
          "more"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Double Comparative",
        "explanation": "Comparative correlation uses 'the more'."
      },
      {
        "id": "gr_g7_h_63",
        "sentencePrompt": "It is high time the city council _____ strict limits on industrial carbon emissions.",
        "laneOptions": [
          "imposed",
          "imposes",
          "impose"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "High Time + Past Tense",
        "explanation": "'It is high time' takes past tense for present urgency."
      },
      {
        "id": "gr_g7_h_64",
        "sentencePrompt": "Such _____ the beauty of the aurora that travelers stood in silent reverence.",
        "laneOptions": [
          "is",
          "was",
          "were"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Such",
        "explanation": "'Such was the beauty...' is the formal inversion."
      },
      {
        "id": "gr_g7_h_65",
        "sentencePrompt": "Had the satellite failed, global navigation systems _____ shut down.",
        "laneOptions": [
          "had",
          "will have",
          "would have"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Inverted Third Conditional",
        "explanation": "Conditional inversion without 'if'."
      },
      {
        "id": "gr_g7_h_66",
        "sentencePrompt": "They recommended that the solar facility _____ expanded across the desert.",
        "laneOptions": [
          "be",
          "is",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Subjunctive in Recommendations",
        "explanation": "Formal base subjunctive."
      },
      {
        "id": "gr_g7_h_67",
        "sentencePrompt": "Only after reviewing the archaeological findings _____ the theory accepted.",
        "laneOptions": [
          "is",
          "was",
          "did"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Only After",
        "explanation": "'Only after' phrase triggers inversion."
      },
      {
        "id": "gr_g7_h_68",
        "sentencePrompt": "The scientist spoke with such conviction as to _____ all initial skepticism.",
        "laneOptions": [
          "dispelled",
          "dispelling",
          "dispel"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "So As To + Infinitive",
        "explanation": "Result structure takes base verb."
      },
      {
        "id": "gr_g7_h_69",
        "sentencePrompt": "Never before _____ humanity witnessed such rapid technological transformation.",
        "laneOptions": [
          "has",
          "is",
          "had"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Inversion with Never Before",
        "explanation": "Negative time adverbial requires auxiliary inversion."
      },
      {
        "id": "gr_g7_h_70",
        "sentencePrompt": "He walked with cautious steps lest he _____ alarm the resting lioness.",
        "laneOptions": [
          "would",
          "should",
          "could"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Lest + Should Clause",
        "explanation": "'Lest' expresses precaution with 'should'."
      },
      {
        "id": "gr_g7_h_71",
        "sentencePrompt": "In no way _____ the student council be blamed for the rescheduled tournament.",
        "laneOptions": [
          "may",
          "it can",
          "can"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Negative Inversion",
        "explanation": "Fronted negative triggers inversion."
      },
      {
        "id": "gr_g7_h_72",
        "sentencePrompt": "The historical documentary was praised _____ both compelling and objective.",
        "laneOptions": [
          "for being",
          "to be",
          "as being"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Prepositional Verb Complements",
        "explanation": "'Praised for being' is standard idiom."
      },
      {
        "id": "gr_g7_h_73",
        "sentencePrompt": "Were the polar ice caps to melt completely, coastal cities _____ inundated.",
        "laneOptions": [
          "will be",
          "would be",
          "are"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Formal Second Conditional Inversion",
        "explanation": "'Were ... to melt' takes 'would be'."
      },
      {
        "id": "gr_g7_h_74",
        "sentencePrompt": "She was on the verge of _____ her doctoral thesis when the grant was approved.",
        "laneOptions": [
          "to submit",
          "submit",
          "submitting"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "On the Verge of + Gerund",
        "explanation": "Prepositional phrase takes gerund."
      },
      {
        "id": "gr_g7_h_75",
        "sentencePrompt": "Much as I admire his athletic skill, I _____ approve of his arrogant conduct.",
        "laneOptions": [
          "cannot",
          "should not",
          "might"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Concession with Much As",
        "explanation": "'Much as' expresses concession."
      },
      {
        "id": "gr_g7_h_76",
        "sentencePrompt": "Should anyone inquire about the confidential report, _____ them to the director.",
        "laneOptions": [
          "referred",
          "refer",
          "referring"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Conditional Inversion with Imperative",
        "explanation": "'Should anyone...' takes imperative in result."
      },
      {
        "id": "gr_g7_h_77",
        "sentencePrompt": "The environmental crisis is too critical _____ disregarded any longer.",
        "laneOptions": [
          "for be",
          "being",
          "to be"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Too ... To Be (Passive)",
        "explanation": "'Too + adjective + to be + V3'."
      },
      {
        "id": "gr_g7_h_78",
        "sentencePrompt": "Had you alerted the safety warden immediately, the mishap _____ prevented.",
        "laneOptions": [
          "could have been",
          "can be",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Third Conditional Passive",
        "explanation": "Hypothetical past modal."
      },
      {
        "id": "gr_g7_h_79",
        "sentencePrompt": "Nowhere else in Britain _____ such majestic Gothic cathedrals be found.",
        "laneOptions": [
          "you can",
          "can",
          "are"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Nowhere Else",
        "explanation": "Negative locative triggers inversion."
      },
      {
        "id": "gr_g7_h_80",
        "sentencePrompt": "The discovery was attributed to her having _____ countless sleepless lab hours.",
        "laneOptions": [
          "devoting",
          "devote",
          "devoted"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Perfect Participle after Preposition",
        "explanation": "Having + V3 shows completed contribution."
      }
    ]
  },
  "grade-8": {
    "easy": [
      {
        "id": "gr_g8_e_01",
        "sentencePrompt": "Have you _____ visited the ancient ruins of Ephesus?",
        "laneOptions": [
          "ever",
          "never",
          "already"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect (Ever)",
        "explanation": "Use 'ever' in questions to ask about life experiences."
      },
      {
        "id": "gr_g8_e_02",
        "sentencePrompt": "I have _____ seen snow because I live in a tropical place.",
        "laneOptions": [
          "ever",
          "never",
          "yet"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Perfect (Never)",
        "explanation": "'Never' expresses that something has not happened in one's life."
      },
      {
        "id": "gr_g8_e_03",
        "sentencePrompt": "She has _____ finished her homework; she is free now.",
        "laneOptions": [
          "yet",
          "ever",
          "already"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Perfect (Already)",
        "explanation": "Use 'already' to indicate something was completed sooner than expected."
      },
      {
        "id": "gr_g8_e_04",
        "sentencePrompt": "We haven't received our test results _____.",
        "laneOptions": [
          "yet",
          "already",
          "never"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect (Yet)",
        "explanation": "Use 'yet' at the end of negative sentences and questions."
      },
      {
        "id": "gr_g8_e_05",
        "sentencePrompt": "He has lived in this neighbourhood _____ five years.",
        "laneOptions": [
          "since",
          "for",
          "during"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "For vs Since",
        "explanation": "Use 'for' with a duration or period of time (five years)."
      },
      {
        "id": "gr_g8_e_06",
        "sentencePrompt": "They have been close friends _____ primary school.",
        "laneOptions": [
          "from",
          "for",
          "since"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "For vs Since",
        "explanation": "Use 'since' with a specific starting point in the past."
      },
      {
        "id": "gr_g8_e_07",
        "sentencePrompt": "Has he _____ eaten sushi before?",
        "laneOptions": [
          "ever",
          "already",
          "just"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect Question",
        "explanation": "Use 'ever' to ask about life experience."
      },
      {
        "id": "gr_g8_e_08",
        "sentencePrompt": "I have just _____ a strange noise in the kitchen.",
        "laneOptions": [
          "hear",
          "heard",
          "hearing"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Perfect (Just)",
        "explanation": "Use the past participle 'heard' after 'have just'."
      },
      {
        "id": "gr_g8_e_09",
        "sentencePrompt": "The train has already _____ the station.",
        "laneOptions": [
          "leave",
          "leaving",
          "left"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Participle",
        "explanation": "The past participle of 'leave' is 'left'."
      },
      {
        "id": "gr_g8_e_10",
        "sentencePrompt": "My brother _____ like eating vegetables.",
        "laneOptions": [
          "have",
          "did",
          "are"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect with How Long",
        "explanation": "'How long' with an ongoing state requires the Present Perfect."
      },
      {
        "id": "gr_g8_e_11",
        "sentencePrompt": "He cut _____ while he was chopping carrots in the kitchen.",
        "laneOptions": [
          "him",
          "himself",
          "his"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Reflexive Pronouns",
        "explanation": "Use 'himself' when the subject and object are the same male person."
      },
      {
        "id": "gr_g8_e_12",
        "sentencePrompt": "I prepared the whole science presentation by _____.",
        "laneOptions": [
          "mine",
          "me",
          "myself"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Reflexive Pronouns (By Myself)",
        "explanation": "'By myself' means independently or without help."
      },
      {
        "id": "gr_g8_e_13",
        "sentencePrompt": "The little children can dress _____ now.",
        "laneOptions": [
          "themselves",
          "theirselves",
          "them"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Reflexive Pronouns",
        "explanation": "'Themselves' is the correct plural reflexive pronoun."
      },
      {
        "id": "gr_g8_e_14",
        "sentencePrompt": "She looked at _____ in the mirror before leaving.",
        "laneOptions": [
          "her",
          "herself",
          "hers"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Reflexive Pronouns",
        "explanation": "Use 'herself' when the subject and object are the same female person."
      },
      {
        "id": "gr_g8_e_15",
        "sentencePrompt": "I prefer drinking tea _____ drinking coffee.",
        "laneOptions": [
          "from",
          "than",
          "to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Expressing Preference (Prefer)",
        "explanation": "The verb 'prefer' takes the preposition 'to' (prefer X to Y)."
      },
      {
        "id": "gr_g8_e_16",
        "sentencePrompt": "I would rather _____ at home tonight than go out.",
        "laneOptions": [
          "stay",
          "to stay",
          "staying"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Would Rather + Bare Infinitive",
        "explanation": "'Would rather' is followed by the bare base verb without 'to'."
      },
      {
        "id": "gr_g8_e_17",
        "sentencePrompt": "He would rather drink fruit juice than _____ soda.",
        "laneOptions": [
          "drinks",
          "drink",
          "drinking"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Would Rather Comparison",
        "explanation": "Use the base verb directly after 'would rather' (would rather study).",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_e_18",
        "sentencePrompt": "She prefers listening to music to _____ video games.",
        "laneOptions": [
          "play",
          "to play",
          "playing"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prefer + Gerund",
        "explanation": "In 'prefer -ing to -ing', both actions take the gerund form."
      },
      {
        "id": "gr_g8_e_19",
        "sentencePrompt": "We enjoyed _____ at the beach party all afternoon.",
        "laneOptions": [
          "ourselves",
          "our",
          "us"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Reflexive Pronouns",
        "explanation": "Use 'ourselves' to match the plural subject 'we'."
      },
      {
        "id": "gr_g8_e_20",
        "sentencePrompt": "The robot can turn _____ off when its battery is low.",
        "laneOptions": [
          "it",
          "itself",
          "its"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Reflexive Pronouns",
        "explanation": "Use 'itself' for singular non-human subjects."
      },
      {
        "id": "gr_g8_e_21",
        "sentencePrompt": "In Turkey, you _____ wear a helmet when riding a motorcycle.",
        "laneOptions": [
          "can",
          "may",
          "have to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Obligation (Have to)",
        "explanation": "'Have to' indicates an external legal rule or necessity."
      },
      {
        "id": "gr_g8_e_22",
        "sentencePrompt": "Tomorrow is Sunday, so I _____ wake up early.",
        "laneOptions": [
          "don't have to",
          "mustn't",
          "can't"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Lack of Obligation",
        "explanation": "'Don't have to' means there is no obligation or necessity."
      },
      {
        "id": "gr_g8_e_23",
        "sentencePrompt": "You _____ tell anyone the password; it is completely private.",
        "laneOptions": [
          "don't have to",
          "mustn't",
          "needn't"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prohibition (Mustn't)",
        "explanation": "'Mustn't' indicates strict prohibition."
      },
      {
        "id": "gr_g8_e_24",
        "sentencePrompt": "A true friend should always _____ your secrets.",
        "laneOptions": [
          "to keep",
          "keeps",
          "keep"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Modal + Base Verb",
        "explanation": "Modals like 'should' are followed by the bare base verb."
      },
      {
        "id": "gr_g8_e_25",
        "sentencePrompt": "She _____ English every day after school.",
        "laneOptions": [
          "has to",
          "have to",
          "having to"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Has to (3rd person)",
        "explanation": "Use 'has to' with third-person singular subjects (he/she/it)."
      },
      {
        "id": "gr_g8_e_26",
        "sentencePrompt": "Do we _____ bring our dictionaries tomorrow?",
        "laneOptions": [
          "must",
          "have to",
          "should"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Questions with Have to",
        "explanation": "In questions with 'Do we', use 'have to'."
      },
      {
        "id": "gr_g8_e_27",
        "sentencePrompt": "You _____ apologize to him; you were really impolite.",
        "laneOptions": [
          "may",
          "would",
          "ought to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Advice (Ought to)",
        "explanation": "'Ought to' expresses moral duty or strong advice, similar to 'should'."
      },
      {
        "id": "gr_g8_e_28",
        "sentencePrompt": "You _____ wash dishes; we have a dishwasher.",
        "laneOptions": [
          "needn't",
          "mustn't",
          "can't"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Lack of Necessity",
        "explanation": "'Needn't' means you don't need to do something."
      },
      {
        "id": "gr_g8_e_29",
        "sentencePrompt": "Students _____ respect each other's opinions in the debate.",
        "laneOptions": [
          "could",
          "should",
          "would"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Giving Advice",
        "explanation": "'Should' expresses what is right and sensible."
      },
      {
        "id": "gr_g8_e_30",
        "sentencePrompt": "He _____ study harder if he wants to pass the LGS exam.",
        "laneOptions": [
          "is needing",
          "need",
          "needs to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Need to",
        "explanation": "Use 'needs to' with a third-person singular subject."
      },
      {
        "id": "gr_g8_e_31",
        "sentencePrompt": "He is a _____ worker; he never wastes time.",
        "laneOptions": [
          "hard",
          "hardly",
          "harder"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Adjective Hard",
        "explanation": "'Hard' can be both an adjective and an adverb; 'hardly' means 'almost not'."
      },
      {
        "id": "gr_g8_e_32",
        "sentencePrompt": "I can _____ hear the teacher from the back row.",
        "laneOptions": [
          "hard",
          "hardly",
          "hardness"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Adverb Hardly",
        "explanation": "'Hardly' means scarcely or almost not at all."
      },
      {
        "id": "gr_g8_e_33",
        "sentencePrompt": "The test was _____ easy that everyone scored 100.",
        "laneOptions": [
          "too",
          "such",
          "so"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "So ... That",
        "explanation": "Use 'so + adjective + that' for cause and consequence."
      },
      {
        "id": "gr_g8_e_34",
        "sentencePrompt": "It was _____ a fascinating book that I read it in one day.",
        "laneOptions": [
          "such",
          "so",
          "very"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Such ... That",
        "explanation": "Use 'such + a/an + adjective + noun + that'."
      },
      {
        "id": "gr_g8_e_35",
        "sentencePrompt": "The room is _____ small to hold thirty desks.",
        "laneOptions": [
          "enough",
          "too",
          "so"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Too + Adjective",
        "explanation": "'Too' indicates more than suitable or possible (too small to hold)."
      },
      {
        "id": "gr_g8_e_36",
        "sentencePrompt": "She is not old _____ to drive a motor car.",
        "laneOptions": [
          "too",
          "so",
          "enough"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Adjective + Enough",
        "explanation": "'Enough' comes AFTER the adjective (old enough)."
      },
      {
        "id": "gr_g8_e_37",
        "sentencePrompt": "The soup smells _____ and looks tasty.",
        "laneOptions": [
          "delicious",
          "deliciously",
          "more delicious"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Sense Verbs + Adjective",
        "explanation": "Sense verbs (smell, taste, sound) are followed by adjectives, not adverbs."
      },
      {
        "id": "gr_g8_e_38",
        "sentencePrompt": "The music sounded _____ to my ears.",
        "laneOptions": [
          "loudly",
          "loud",
          "loudness"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Sense Verbs + Adjective",
        "explanation": "Verbs like 'sound' take an adjective predicate ('sounded loud')."
      },
      {
        "id": "gr_g8_e_39",
        "sentencePrompt": "He spoke _____ during the press conference.",
        "laneOptions": [
          "confident",
          "confidence",
          "confidently"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Adverb of Manner",
        "explanation": "Modify the action verb 'spoke' with the adverb 'confidently'."
      },
      {
        "id": "gr_g8_e_40",
        "sentencePrompt": "Both my brother _____ my sister attend university.",
        "laneOptions": [
          "and",
          "or",
          "nor"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Correlative Conjunctions",
        "explanation": "'Both' is paired with 'and'."
      },
      {
        "id": "gr_g8_e_41",
        "sentencePrompt": "A true friend always _____ your secrets and never shares them.",
        "laneOptions": [
          "keeps",
          "keep",
          "keeping"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Simple Habit",
        "explanation": "Singular subject takes third-person -s."
      },
      {
        "id": "gr_g8_e_42",
        "sentencePrompt": "I would rather _____ at home tonight than attend a crowded party.",
        "laneOptions": [
          "to stay",
          "stay",
          "staying"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Would Rather + Bare Verb",
        "explanation": "'Would rather' takes a bare infinitive."
      },
      {
        "id": "gr_g8_e_43",
        "sentencePrompt": "She prefers drinking fresh herbal tea _____ iced coffee.",
        "laneOptions": [
          "from",
          "than",
          "to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prefer X to Y",
        "explanation": "'Prefer' takes preposition 'to'."
      },
      {
        "id": "gr_g8_e_44",
        "sentencePrompt": "Would you like _____ come over to our house for dinner tonight?",
        "laneOptions": [
          "to",
          "for",
          "with"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Would You Like To",
        "explanation": "Polite invitation structure."
      },
      {
        "id": "gr_g8_e_45",
        "sentencePrompt": "First, peel the potatoes and _____ them into thin slices.",
        "laneOptions": [
          "cuts",
          "cut",
          "cutting"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Imperatives in Recipes",
        "explanation": "Recipe steps use imperative base verbs."
      },
      {
        "id": "gr_g8_e_46",
        "sentencePrompt": "Can you hold _____ a moment while I put you through to the manager?",
        "laneOptions": [
          "up",
          "in",
          "on"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Telephone Phrasal Verbs",
        "explanation": "'Hold on' means wait on the line."
      },
      {
        "id": "gr_g8_e_47",
        "sentencePrompt": "He didn't answer his phone because the line was _____.",
        "laneOptions": [
          "busy",
          "free",
          "open"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Telephone Terms",
        "explanation": "'Busy' or 'engaged' line."
      },
      {
        "id": "gr_g8_e_48",
        "sentencePrompt": "I always use a strong password to _____ my online social media account.",
        "laneOptions": [
          "protects",
          "protect",
          "protecting"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Infinitive of Purpose",
        "explanation": "'To + base verb' expresses purpose."
      },
      {
        "id": "gr_g8_e_49",
        "sentencePrompt": "Paragliding is much _____ dangerous than playing table tennis.",
        "laneOptions": [
          "much",
          "most",
          "more"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Comparative of Long Adjectives",
        "explanation": "Comparatives take 'more'."
      },
      {
        "id": "gr_g8_e_50",
        "sentencePrompt": "You must wear a protective helmet _____ you go skateboarding.",
        "laneOptions": [
          "when",
          "until",
          "unless"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Time Conjunctions",
        "explanation": "'When' indicates the condition of time."
      },
      {
        "id": "gr_g8_e_51",
        "sentencePrompt": "The ancient castle was _____ in the twelfth century by Norman settlers.",
        "laneOptions": [
          "build",
          "built",
          "building"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Passive",
        "explanation": "Was + V3 for historic creation."
      },
      {
        "id": "gr_g8_e_52",
        "sentencePrompt": "Whose duty is it to _____ out the kitchen garbage tonight?",
        "laneOptions": [
          "took",
          "taking",
          "take"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Chores Phrasal Verbs",
        "explanation": "'Take out the garbage' is the standard chore."
      },
      {
        "id": "gr_g8_e_53",
        "sentencePrompt": "My mother does the _____ every Saturday morning.",
        "laneOptions": [
          "laundry",
          "dishes",
          "dust"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Chores Collocations",
        "explanation": "'Do the laundry' means washing clothes."
      },
      {
        "id": "gr_g8_e_54",
        "sentencePrompt": "Scientists in the university lab _____ a new vaccine last month.",
        "laneOptions": [
          "discover",
          "discovered",
          "discovering"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Active",
        "explanation": "Past completed action with time marker."
      },
      {
        "id": "gr_g8_e_55",
        "sentencePrompt": "An earthquake is a violent shaking of the Earth's _____.",
        "laneOptions": [
          "water",
          "air",
          "crust"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Natural Disaster Science",
        "explanation": "Earthquakes occur in the Earth's crust."
      },
      {
        "id": "gr_g8_e_56",
        "sentencePrompt": "If an earthquake occurs, remember to drop, cover, and hold _____.",
        "laneOptions": [
          "on",
          "up",
          "in"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Disaster Safety Drill",
        "explanation": "'Hold on' is part of the standard drill."
      },
      {
        "id": "gr_g8_e_57",
        "sentencePrompt": "We _____ to the cinema together yesterday afternoon.",
        "laneOptions": [
          "go",
          "went",
          "gone"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Irregular",
        "explanation": "Past tense of 'go' is 'went'."
      },
      {
        "id": "gr_g8_e_58",
        "sentencePrompt": "I can't count on him because he never keeps his _____.",
        "laneOptions": [
          "games",
          "books",
          "promises"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Friendship Collocations",
        "explanation": "'Keep a promise' means staying true to words."
      },
      {
        "id": "gr_g8_e_59",
        "sentencePrompt": "How about _____ a barbecue in the back garden this Sunday?",
        "laneOptions": [
          "having",
          "have",
          "had"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Suggestions (How About)",
        "explanation": "'How about' takes a gerund (-ing)."
      },
      {
        "id": "gr_g8_e_60",
        "sentencePrompt": "Why don't we _____ to the newly opened internet café?",
        "laneOptions": [
          "going",
          "go",
          "went"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Suggestions (Why Don't We)",
        "explanation": "'Why don't we' takes base verb."
      },
      {
        "id": "gr_g8_e_61",
        "sentencePrompt": "She is very trendy; she always _____ fashionable clothes.",
        "laneOptions": [
          "wearing",
          "wear",
          "wears"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Habit",
        "explanation": "Third person singular takes -s."
      },
      {
        "id": "gr_g8_e_62",
        "sentencePrompt": "To prepare vegetable soup, boil the broth _____ twenty minutes.",
        "laneOptions": [
          "for",
          "since",
          "during"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Duration in Recipes",
        "explanation": "'For' indicates duration of time."
      },
      {
        "id": "gr_g8_e_63",
        "sentencePrompt": "Before you fry the chicken, _____ it with garlic and herbs.",
        "laneOptions": [
          "seasons",
          "season",
          "seasoning"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Process Steps",
        "explanation": "Imperative base verb."
      },
      {
        "id": "gr_g8_e_64",
        "sentencePrompt": "I am calling to make a flight reservation _____ Istanbul.",
        "laneOptions": [
          "on",
          "at",
          "to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prepositions with Travel",
        "explanation": "'Flight to' indicates destination."
      },
      {
        "id": "gr_g8_e_65",
        "sentencePrompt": "Could you please speak louder? The connection is very _____.",
        "laneOptions": [
          "bad",
          "clear",
          "good"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Telephone Expressions",
        "explanation": "'Bad connection' indicates poor line."
      },
      {
        "id": "gr_g8_e_66",
        "sentencePrompt": "Don't click on suspicious links _____ emails from strangers.",
        "laneOptions": [
          "on",
          "in",
          "at"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Internet Safety Rules",
        "explanation": "Links contained 'in' emails."
      },
      {
        "id": "gr_g8_e_67",
        "sentencePrompt": "Trekking in the alpine mountains requires sturdy hiking _____.",
        "laneOptions": [
          "slippers",
          "gloves",
          "boots"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Adventure Equipment",
        "explanation": "Boots are required for mountain trekking."
      },
      {
        "id": "gr_g8_e_68",
        "sentencePrompt": "This all-inclusive resort offers free meals and _____ rooms.",
        "laneOptions": [
          "comfortable",
          "discomfort",
          "comfortably"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Adjectives Modifying Nouns",
        "explanation": "Adjective 'comfortable' describes rooms."
      },
      {
        "id": "gr_g8_e_69",
        "sentencePrompt": "My brother and I take _____ vacuuming the living room carpet.",
        "laneOptions": [
          "steps",
          "turns",
          "times"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Chores Idiom",
        "explanation": "'Take turns' means alternating duties."
      },
      {
        "id": "gr_g8_e_70",
        "sentencePrompt": "Did Alexander Graham Bell _____ the telephone in 1876?",
        "laneOptions": [
          "inventing",
          "invented",
          "invent"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Question",
        "explanation": "Auxiliary 'did' takes base verb."
      },
      {
        "id": "gr_g8_e_71",
        "sentencePrompt": "A severe drought occurs when there is no _____ for months.",
        "laneOptions": [
          "rain",
          "wind",
          "snow"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Natural Forces Definition",
        "explanation": "Drought is caused by lack of rain."
      },
      {
        "id": "gr_g8_e_72",
        "sentencePrompt": "We must prepare an emergency _____ before the storm hits.",
        "laneOptions": [
          "ticket",
          "kit",
          "book"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Disaster Preparedness",
        "explanation": "'Emergency kit' contains survival supplies."
      },
      {
        "id": "gr_g8_e_73",
        "sentencePrompt": "He prefers playing acoustic guitar to _____ video games.",
        "laneOptions": [
          "played",
          "play",
          "playing"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prefer X to Y (Parallel)",
        "explanation": "Parallel gerund structure: playing to playing."
      },
      {
        "id": "gr_g8_e_74",
        "sentencePrompt": "Shall we _____ our science homework together in the library?",
        "laneOptions": [
          "do",
          "doing",
          "did"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Suggestions (Shall We)",
        "explanation": "'Shall we' takes base verb."
      },
      {
        "id": "gr_g8_e_75",
        "sentencePrompt": "She didn't invite him to her birthday party _____ he was rude.",
        "laneOptions": [
          "so",
          "because",
          "but"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Conjunction of Reason",
        "explanation": "'Because' gives the reason for refusal."
      },
      {
        "id": "gr_g8_e_76",
        "sentencePrompt": "Mix the flour, eggs, and sugar in a large ceramic _____.",
        "laneOptions": [
          "fork",
          "plate",
          "bowl"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Kitchen Utensils",
        "explanation": "Mixing occurs inside a bowl."
      },
      {
        "id": "gr_g8_e_77",
        "sentencePrompt": "I'm afraid Mrs. Clark is not _____ at her desk right now.",
        "laneOptions": [
          "available",
          "absent",
          "busy"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Telephone Expressions",
        "explanation": "'Not available' is polite business etiquette."
      },
      {
        "id": "gr_g8_e_78",
        "sentencePrompt": "Social media influencers often _____ videos to their followers.",
        "laneOptions": [
          "download",
          "upload",
          "delete"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Internet Vocabulary",
        "explanation": "'Upload' means posting content online."
      },
      {
        "id": "gr_g8_e_79",
        "sentencePrompt": "Bungee jumping is considered one of the most _____ sports.",
        "laneOptions": [
          "tame",
          "boring",
          "dangerous"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Extreme Sports Vocabulary",
        "explanation": "Bungee jumping is dangerous."
      },
      {
        "id": "gr_g8_e_80",
        "sentencePrompt": "The historic amphitheater was _____ by thousands of tourists.",
        "laneOptions": [
          "visited",
          "visiting",
          "visit"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Passive Voice",
        "explanation": "Was + V3 in past passive."
      }
    ],
    "medium": [
      {
        "id": "gr_g8_m_01",
        "sentencePrompt": "If it _____ sunny tomorrow, we will go on a picnic.",
        "laneOptions": [
          "is",
          "will be",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "First Conditional",
        "explanation": "In the 'if' clause of Conditionals Type 1, use the Present Simple."
      },
      {
        "id": "gr_g8_m_02",
        "sentencePrompt": "If you don't study consistently, you _____ pass the test.",
        "laneOptions": [
          "don't",
          "won't",
          "wouldn't"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "First Conditional Result",
        "explanation": "The result clause of Type 1 uses 'will / won't + base verb'."
      },
      {
        "id": "gr_g8_m_03",
        "sentencePrompt": "What will you do if she _____ not answer your call?",
        "laneOptions": [
          "is",
          "will",
          "does"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "First Conditional Question",
        "explanation": "Use the Present Simple auxiliary 'does' in the 'if' condition."
      },
      {
        "id": "gr_g8_m_04",
        "sentencePrompt": "As soon as the bell rings, the students _____ the class.",
        "laneOptions": [
          "will leave",
          "leave",
          "left"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Future Time Clauses",
        "explanation": "The main clause expresses future action with 'will leave'."
      },
      {
        "id": "gr_g8_m_05",
        "sentencePrompt": "We _____ wear school uniforms on weekdays.",
        "laneOptions": [
          "send",
          "will send",
          "sent"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Future Time Clauses",
        "explanation": "Use 'will send' in the main clause after a time clause."
      },
      {
        "id": "gr_g8_m_06",
        "sentencePrompt": "If they invite us to the party, we _____ definitely attend.",
        "laneOptions": [
          "shall to",
          "would",
          "will"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "First Conditional",
        "explanation": "Use 'will' for real future possibilities."
      },
      {
        "id": "gr_g8_m_07",
        "sentencePrompt": "Unless you _____ now, you will be late for the meeting.",
        "laneOptions": [
          "leave",
          "don't leave",
          "won't leave"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Conditionals with Unless",
        "explanation": "'Unless' already has a negative meaning; use the positive verb."
      },
      {
        "id": "gr_g8_m_08",
        "sentencePrompt": "If water reaches 0 degrees Celsius, it _____.",
        "laneOptions": [
          "will freeze",
          "freezes",
          "froze"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Zero Conditional",
        "explanation": "Scientific facts use Zero Conditional (present simple in both clauses)."
      },
      {
        "id": "gr_g8_m_09",
        "sentencePrompt": "If you heat ice, it _____ into water.",
        "laneOptions": [
          "turned",
          "will turn",
          "turns"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Zero Conditional",
        "explanation": "General scientific truths take Present Simple in both clauses."
      },
      {
        "id": "gr_g8_m_10",
        "sentencePrompt": "I will call you before I _____ the office.",
        "laneOptions": [
          "leave",
          "will leave",
          "am leaving"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Time Clauses",
        "explanation": "In clauses beginning with 'before', use the Present Simple for future events."
      },
      {
        "id": "gr_g8_m_11",
        "sentencePrompt": "The scientist _____ won the Nobel Prize gave a speech.",
        "laneOptions": [
          "which",
          "who",
          "where"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Relative Clauses (Who)",
        "explanation": "Use 'who' to describe people."
      },
      {
        "id": "gr_g8_m_12",
        "sentencePrompt": "The smartphone _____ I bought yesterday has a great camera.",
        "laneOptions": [
          "who",
          "where",
          "which"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Relative Clauses (Which)",
        "explanation": "Use 'which' or 'that' to describe objects or things."
      },
      {
        "id": "gr_g8_m_13",
        "sentencePrompt": "The laboratory _____ they conduct experiments is brand new.",
        "laneOptions": [
          "where",
          "which",
          "who"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Relative Clauses (Where)",
        "explanation": "Use 'where' to refer to a place where an action occurs."
      },
      {
        "id": "gr_g8_m_14",
        "sentencePrompt": "That is the student _____ bicycle was stolen outside school.",
        "laneOptions": [
          "who",
          "whose",
          "whom"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Relative Clauses (Whose)",
        "explanation": "Use 'whose' to show possession for a person or thing."
      },
      {
        "id": "gr_g8_m_15",
        "sentencePrompt": "You _____ be careful when crossing the avenue.",
        "laneOptions": [
          "where",
          "who",
          "that"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Relative Clauses (That)",
        "explanation": "'That' can be used for things in defining relative clauses."
      },
      {
        "id": "gr_g8_m_16",
        "sentencePrompt": "The doctor _____ treated my ankle was very kind.",
        "laneOptions": [
          "who",
          "which",
          "whose"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Relative Clauses (Who)",
        "explanation": "Use 'who' to refer to a person."
      },
      {
        "id": "gr_g8_m_17",
        "sentencePrompt": "Can you recommend a hotel _____ allows small pets?",
        "laneOptions": [
          "who",
          "which",
          "where"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Relative Clauses (Which)",
        "explanation": "'Which' is the subject relative pronoun referring to the hotel as a facility."
      },
      {
        "id": "gr_g8_m_18",
        "sentencePrompt": "The girl _____ father is an architect designed our club logo.",
        "laneOptions": [
          "whom",
          "who",
          "whose"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Relative Clauses (Whose)",
        "explanation": "'Whose' indicates the possession relationship (her father)."
      },
      {
        "id": "gr_g8_m_19",
        "sentencePrompt": "Summer is the season _____ most tourists visit Antalya.",
        "laneOptions": [
          "when",
          "where",
          "which"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Relative Clauses (When)",
        "explanation": "Use 'when' to refer to a specific time or season."
      },
      {
        "id": "gr_g8_m_20",
        "sentencePrompt": "The museum _____ displays historical artifacts is open today.",
        "laneOptions": [
          "who",
          "that",
          "where"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Relative Clauses (That)",
        "explanation": "'That' is used for things and institutions performing an action."
      },
      {
        "id": "gr_g8_m_21",
        "sentencePrompt": "English _____ by millions of people across the globe.",
        "laneOptions": [
          "is speaking",
          "speaks",
          "is spoken"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Passive",
        "explanation": "Use 'is/are + past participle' for Present Simple passive."
      },
      {
        "id": "gr_g8_m_22",
        "sentencePrompt": "He went to the library _____ borrow a science book.",
        "laneOptions": [
          "was",
          "is",
          "were"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Passive",
        "explanation": "Singular past passive requires 'was + past participle'."
      },
      {
        "id": "gr_g8_m_23",
        "sentencePrompt": "Thousands of new cars _____ manufactured in this factory every month.",
        "laneOptions": [
          "is",
          "are",
          "was"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple Passive",
        "explanation": "Plural subject 'cars' takes 'are + past participle'."
      },
      {
        "id": "gr_g8_m_24",
        "sentencePrompt": "The Pyramids of Giza _____ built thousands of years ago.",
        "laneOptions": [
          "are",
          "was",
          "were"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Passive Plural",
        "explanation": "'The Pyramids' is plural, so use 'were built'."
      },
      {
        "id": "gr_g8_m_25",
        "sentencePrompt": "Paper _____ made from wood pulp.",
        "laneOptions": [
          "is",
          "are",
          "were"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Simple Passive",
        "explanation": "'Paper' is uncountable and singular, taking 'is made'."
      },
      {
        "id": "gr_g8_m_26",
        "sentencePrompt": "The stolen jewelry _____ found by police yesterday morning.",
        "laneOptions": [
          "were",
          "was",
          "is"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Passive",
        "explanation": "'Jewelry' is uncountable and singular, so use 'was found'."
      },
      {
        "id": "gr_g8_m_27",
        "sentencePrompt": "Olive trees _____ grown in the Mediterranean region.",
        "laneOptions": [
          "was",
          "is",
          "are"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Simple Passive",
        "explanation": "Plural subject 'Olive trees' takes 'are grown'."
      },
      {
        "id": "gr_g8_m_28",
        "sentencePrompt": "The important message _____ sent via email two hours ago.",
        "laneOptions": [
          "was",
          "is",
          "has"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Passive",
        "explanation": "Past time marker 'two hours ago' requires 'was sent'."
      },
      {
        "id": "gr_g8_m_29",
        "sentencePrompt": "Our classroom _____ cleaned by the janitor every afternoon.",
        "laneOptions": [
          "was",
          "is",
          "are"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Simple Passive",
        "explanation": "Routine daily action in passive voice uses 'is cleaned'."
      },
      {
        "id": "gr_g8_m_30",
        "sentencePrompt": "If you finish your chores, you _____ play games.",
        "laneOptions": [
          "are being",
          "was",
          "were"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Simple Passive",
        "explanation": "Plural subject 'cookies' requires 'were baked'."
      },
      {
        "id": "gr_g8_m_31",
        "sentencePrompt": "He _____ play the violin, but he stopped two years ago.",
        "laneOptions": [
          "used to",
          "uses to",
          "was used"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Used to",
        "explanation": "Use 'used to + base verb' for past habits no longer true."
      },
      {
        "id": "gr_g8_m_32",
        "sentencePrompt": "Did you _____ have long hair when you were a child?",
        "laneOptions": [
          "used to",
          "use to",
          "using to"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Used to in Questions",
        "explanation": "After 'Did', use the base form 'use to'."
      },
      {
        "id": "gr_g8_m_33",
        "sentencePrompt": "I didn't _____ like broccoli when I was little.",
        "laneOptions": [
          "using to",
          "used to",
          "use to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Used to Negative",
        "explanation": "After 'didn't', use the base form 'use to'."
      },
      {
        "id": "gr_g8_m_34",
        "sentencePrompt": "There _____ be an old cinema on this street corner.",
        "laneOptions": [
          "used to",
          "used",
          "was used"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Used to for Past States",
        "explanation": "'There used to be' describes a state that existed in the past."
      },
      {
        "id": "gr_g8_m_35",
        "sentencePrompt": "She _____ living in a large crowded city yet.",
        "laneOptions": [
          "didn't use to",
          "isn't used to",
          "used to"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Be used to + -ing",
        "explanation": "'Be used to' means accustomed to something and takes a gerund."
      },
      {
        "id": "gr_g8_m_36",
        "sentencePrompt": "My grandfather _____ ride horses when he lived on a farm.",
        "laneOptions": [
          "is used to",
          "will",
          "would"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Would for Past Habits",
        "explanation": "'Would' can express repeated past actions, similar to 'used to'."
      },
      {
        "id": "gr_g8_m_37",
        "sentencePrompt": "I have known him _____ we were in kindergarten.",
        "laneOptions": [
          "since",
          "for",
          "while"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Since with Past Clause",
        "explanation": "Use 'since' followed by a past simple clause as a starting point."
      },
      {
        "id": "gr_g8_m_38",
        "sentencePrompt": "We haven't seen each other _____ ages.",
        "laneOptions": [
          "since",
          "for",
          "during"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "For with Duration",
        "explanation": "'For ages' is a standard idiom expressing a long period of time."
      },
      {
        "id": "gr_g8_m_39",
        "sentencePrompt": "He has been working on his science project _____ 8 AM.",
        "laneOptions": [
          "at",
          "for",
          "since"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Since with Clock Time",
        "explanation": "'Since' marks the specific beginning moment of an ongoing activity."
      },
      {
        "id": "gr_g8_m_40",
        "sentencePrompt": "How many books _____ you read so far this term?",
        "laneOptions": [
          "have",
          "did",
          "were"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect (So Far)",
        "explanation": "'So far' indicates progress up to the present moment, requiring Present Perfect."
      },
      {
        "id": "gr_g8_m_41",
        "sentencePrompt": "I would rather eat homemade soup than _____ oily fast food.",
        "laneOptions": [
          "to order",
          "order",
          "ordering"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Would Rather Comparison",
        "explanation": "Bare infinitive follows 'than'."
      },
      {
        "id": "gr_g8_m_42",
        "sentencePrompt": "She has been interested in robotics _____ she was ten years old.",
        "laneOptions": [
          "during",
          "for",
          "since"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Since with Past Clause",
        "explanation": "'Since' introduces a specific starting point."
      },
      {
        "id": "gr_g8_m_43",
        "sentencePrompt": "The cake smells _____ delicious that everyone wants a slice.",
        "laneOptions": [
          "so",
          "such",
          "too"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "So + Adjective + That",
        "explanation": "'So' precedes standalone adjective."
      },
      {
        "id": "gr_g8_m_44",
        "sentencePrompt": "If you encounter an emergency on the phone, _____ 112 immediately.",
        "laneOptions": [
          "dialing",
          "dial",
          "dialed"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "First Conditional Imperative",
        "explanation": "Imperative in the result clause."
      },
      {
        "id": "gr_g8_m_45",
        "sentencePrompt": "The garlic and onions should be _____ in olive oil until golden.",
        "laneOptions": [
          "sauteing",
          "saute",
          "sauteed"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Passive with Modals",
        "explanation": "Should be + V3."
      },
      {
        "id": "gr_g8_m_46",
        "sentencePrompt": "He refused the party invitation on the grounds _____ he was ill.",
        "laneOptions": [
          "that",
          "of",
          "for"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Formal Conjunctions",
        "explanation": "'On the grounds that' introduces justification."
      },
      {
        "id": "gr_g8_m_47",
        "sentencePrompt": "Neither the teacher nor the students _____ aware of the network glitch.",
        "laneOptions": [
          "was",
          "were",
          "is"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Subject-Verb Agreement",
        "explanation": "Verb agrees with nearest plural subject."
      },
      {
        "id": "gr_g8_m_48",
        "sentencePrompt": "By the time the firefighter arrived, the smoke _____ throughout the hall.",
        "laneOptions": [
          "spreads",
          "spread",
          "had spread"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Perfect Narrative",
        "explanation": "Action preceding another past moment."
      },
      {
        "id": "gr_g8_m_49",
        "sentencePrompt": "She apologized for _____ forgotten her classmate's notebook.",
        "laneOptions": [
          "having",
          "have",
          "had"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Preposition + Perfect Gerund",
        "explanation": "'For having forgotten'."
      },
      {
        "id": "gr_g8_m_50",
        "sentencePrompt": "The internet search engine was designed to _____ relevant results quickly.",
        "laneOptions": [
          "delivered",
          "deliver",
          "delivering"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Infinitive of Purpose",
        "explanation": "Designed to + base verb."
      },
      {
        "id": "gr_g8_m_51",
        "sentencePrompt": "You had better _____ your computer files before updating the operating system.",
        "laneOptions": [
          "backing",
          "to backup",
          "backup"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Had Better + Bare Verb",
        "explanation": "Advice with 'had better'."
      },
      {
        "id": "gr_g8_m_52",
        "sentencePrompt": "The severe flood caused _____ damage that whole bridges collapsed.",
        "laneOptions": [
          "so much",
          "such",
          "too much"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "So Much + Uncountable + That",
        "explanation": "'So much damage that'."
      },
      {
        "id": "gr_g8_m_53",
        "sentencePrompt": "We were hiking through the ravine when suddenly rock fragments _____ down.",
        "laneOptions": [
          "were tumbling",
          "tumbled",
          "tumble"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Interruption",
        "explanation": "Short completed action."
      },
      {
        "id": "gr_g8_m_54",
        "sentencePrompt": "A reliable friend is someone upon _____ you can always depend.",
        "laneOptions": [
          "which",
          "who",
          "whom"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Preposition + Relative Pronoun",
        "explanation": "Preposition 'upon' takes 'whom'."
      },
      {
        "id": "gr_g8_m_55",
        "sentencePrompt": "The historic site has been protected by UNESCO _____ several decades.",
        "laneOptions": [
          "for",
          "since",
          "during"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Duration (For)",
        "explanation": "'For' indicates duration."
      },
      {
        "id": "gr_g8_m_56",
        "sentencePrompt": "He would rather study science than _____ video games all evening.",
        "laneOptions": [
          "to play",
          "play",
          "playing"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Parallel Bare Infinitives",
        "explanation": "'Than play'."
      },
      {
        "id": "gr_g8_m_57",
        "sentencePrompt": "Unless we conserve water during summer, the municipality _____ introduce restrictions.",
        "laneOptions": [
          "did",
          "would",
          "will"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "First Conditional with Unless",
        "explanation": "'Unless' takes present, result takes will."
      },
      {
        "id": "gr_g8_m_58",
        "sentencePrompt": "The chef explained that the meat _____ marinated overnight for best flavor.",
        "laneOptions": [
          "must be",
          "has to",
          "is"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Passive Obligation",
        "explanation": "'Must be marinated'."
      },
      {
        "id": "gr_g8_m_59",
        "sentencePrompt": "She had no difficulty in _____ the online registration form.",
        "laneOptions": [
          "complete",
          "completing",
          "completed"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Have Difficulty In + Gerund",
        "explanation": "'In' takes gerund."
      },
      {
        "id": "gr_g8_m_60",
        "sentencePrompt": "The tourist was astonished to discover _____ historic monuments in the old city.",
        "laneOptions": [
          "such",
          "so much",
          "so many"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "So Many + Plural Noun",
        "explanation": "'So many' with countable plural."
      },
      {
        "id": "gr_g8_m_61",
        "sentencePrompt": "I am not accustomed to _____ up before sunrise for morning chores.",
        "laneOptions": [
          "waking",
          "wake",
          "woke"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Be Accustomed To + Gerund",
        "explanation": "'To' is a preposition here."
      },
      {
        "id": "gr_g8_m_62",
        "sentencePrompt": "The seismologists warned that aftershocks _____ continue for days.",
        "laneOptions": [
          "must",
          "might",
          "ought"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Modals of Possibility",
        "explanation": "'Might' expresses possibility."
      },
      {
        "id": "gr_g8_m_63",
        "sentencePrompt": "He spoke with such clarity that everybody _____ understand his instructions.",
        "laneOptions": [
          "may",
          "can",
          "could"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Past Ability in Result",
        "explanation": "'Could' expresses past ability."
      },
      {
        "id": "gr_g8_m_64",
        "sentencePrompt": "You are supposed to _____ your hands thoroughly before handling food.",
        "laneOptions": [
          "wash",
          "washing",
          "washed"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Be Supposed To + Verb",
        "explanation": "'Be supposed to' takes base verb."
      },
      {
        "id": "gr_g8_m_65",
        "sentencePrompt": "They decided to postpone the paragliding tournament _____ the turbulent wind.",
        "laneOptions": [
          "because",
          "due to",
          "although"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Prepositional Conjunction (Due To)",
        "explanation": "'Due to' takes noun phrase."
      },
      {
        "id": "gr_g8_m_66",
        "sentencePrompt": "She has never _____ an extreme adventure sport before in her life.",
        "laneOptions": [
          "trying",
          "try",
          "tried"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Perfect (Never)",
        "explanation": "'Has never + V3'."
      },
      {
        "id": "gr_g8_m_67",
        "sentencePrompt": "The scientist was honored for _____ the revolutionary solar cell.",
        "laneOptions": [
          "patenting",
          "patent",
          "patented"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Preposition + Gerund",
        "explanation": "'For patenting'."
      },
      {
        "id": "gr_g8_m_68",
        "sentencePrompt": "If you _____ to Istanbul, be sure to visit the Blue Mosque and Topkapi Palace.",
        "laneOptions": [
          "will go",
          "go",
          "went"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Zero/First Conditional",
        "explanation": "Present simple in conditional clause."
      },
      {
        "id": "gr_g8_m_69",
        "sentencePrompt": "He couldn't find his passport, _____ he had packed it in his carry-on bag.",
        "laneOptions": [
          "because",
          "despite",
          "though"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Concession at End",
        "explanation": "'Though' expresses contrast."
      },
      {
        "id": "gr_g8_m_70",
        "sentencePrompt": "The recipe calls for three tablespoons of olive oil, _____ is rich in healthy fats.",
        "laneOptions": [
          "which",
          "that",
          "where"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Non-Defining Relative Clause",
        "explanation": "'Which' refers to olive oil."
      },
      {
        "id": "gr_g8_m_71",
        "sentencePrompt": "She was excited about _____ the championship medal at school.",
        "laneOptions": [
          "win",
          "winning",
          "won"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Preposition + Gerund",
        "explanation": "'About winning'."
      },
      {
        "id": "gr_g8_m_72",
        "sentencePrompt": "No matter how challenging the chore was, he _____ it conscientiously.",
        "laneOptions": [
          "completing",
          "complete",
          "completed"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Concessive Clause in Past",
        "explanation": "Main clause takes past simple."
      },
      {
        "id": "gr_g8_m_73",
        "sentencePrompt": "The emergency shelter provided blankets and warm tea _____ the freezing survivors.",
        "laneOptions": [
          "to",
          "for",
          "at"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Provide Something To Someone",
        "explanation": "'Provide to/for'."
      },
      {
        "id": "gr_g8_m_74",
        "sentencePrompt": "She didn't use to like spicy food, but now she _____ it frequently.",
        "laneOptions": [
          "ate",
          "eats",
          "eating"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Contrast with Present Habit",
        "explanation": "Present simple 'eats'."
      },
      {
        "id": "gr_g8_m_75",
        "sentencePrompt": "How long has your father _____ as an aeronautical engineer?",
        "laneOptions": [
          "working",
          "work",
          "worked"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Perfect Duration",
        "explanation": "'Has worked'."
      },
      {
        "id": "gr_g8_m_76",
        "sentencePrompt": "We had better leave for the airport now, _____ we will miss our flight.",
        "laneOptions": [
          "otherwise",
          "unless",
          "although"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Connector of Consequence",
        "explanation": "'Otherwise' means or else."
      },
      {
        "id": "gr_g8_m_77",
        "sentencePrompt": "The archaeological excavation _____ by international university scholars.",
        "laneOptions": [
          "directed",
          "was directed",
          "was directing"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Simple Passive",
        "explanation": "Was + past participle."
      },
      {
        "id": "gr_g8_m_78",
        "sentencePrompt": "He would prefer to cook at home rather than _____ at an expensive diner.",
        "laneOptions": [
          "dined",
          "dining",
          "dine"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prefer Rather Than",
        "explanation": "Bare verb follows 'rather than'."
      },
      {
        "id": "gr_g8_m_79",
        "sentencePrompt": "If natural disasters strike, emergency personnel _____ immediately.",
        "laneOptions": [
          "respond",
          "will respond",
          "responded"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Real Conditional",
        "explanation": "Present habit or future certainty."
      },
      {
        "id": "gr_g8_m_80",
        "sentencePrompt": "She was tired after spending hours _____ the kitchen floor.",
        "laneOptions": [
          "mop",
          "mopping",
          "mopped"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Spend Time + Gerund",
        "explanation": "Spend time doing something."
      }
    ],
    "hard": [
      {
        "id": "gr_g8_h_01",
        "sentencePrompt": "I prefer _____ rafting to canoeing because it is more thrilling.",
        "laneOptions": [
          "to go",
          "go",
          "going"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prefer + V-ing",
        "explanation": "We use the -ing form of the verb after \"prefer\".",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_02",
        "sentencePrompt": "He prefers reading mystery books _____ watching television.",
        "laneOptions": [
          "than",
          "from",
          "to"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prefer X to Y",
        "explanation": "The preposition used with \"prefer\" when comparing two things is \"to\".",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_03",
        "sentencePrompt": "I would rather _____ at home tonight than go out in the rain.",
        "laneOptions": [
          "to stay",
          "staying",
          "stay"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Would rather + Bare Verb",
        "explanation": "Use the base verb after 'would rather' (would rather travel).",
        "contentVersion": 3
      },
      {
        "id": "gr_g8_h_04",
        "sentencePrompt": "She would rather cook dinner herself _____ order fast food.",
        "laneOptions": [
          "to",
          "instead",
          "than"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Would rather ... than",
        "explanation": "We use \"than\" when comparing two choices with \"would rather\".",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_05",
        "sentencePrompt": "My older brother is responsible for _____ the dishwasher after meals.",
        "laneOptions": [
          "empty",
          "emptying",
          "emptied"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Responsible for + Gerund",
        "explanation": "Prepositions like \"for\" are followed by the -ing form of the verb.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_06",
        "sentencePrompt": "Tomorrow is Sunday, so we _____ get up early for school.",
        "laneOptions": [
          "don't have to",
          "must not",
          "have to"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Lack of Obligation (don't have to)",
        "explanation": "We use \"don't have to\" when an action is not necessary.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_07",
        "sentencePrompt": "You _____ share your personal password with strangers on the internet.",
        "laneOptions": [
          "should",
          "don't need to",
          "mustn't"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Prohibition (Mustn't)",
        "explanation": "We use \"mustn't\" for strict prohibitions and internet safety rules.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_08",
        "sentencePrompt": "Have you _____ tried extreme sports like paragliding?",
        "laneOptions": [
          "never",
          "ever",
          "yet"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Perfect (Ever)",
        "explanation": "We use \"ever\" in questions to ask about life experiences.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_09",
        "sentencePrompt": "She has _____ travelled to a foreign country by plane.",
        "laneOptions": [
          "never",
          "ever",
          "already"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect (Never)",
        "explanation": "We use \"never\" with positive verbs to express a negative life experience.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_10",
        "sentencePrompt": "We haven't finished preparing the science presentation _____ .",
        "laneOptions": [
          "already",
          "just",
          "yet"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Present Perfect (Yet)",
        "explanation": "We place \"yet\" at the end of negative sentences and questions in Present Perfect.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_11",
        "sentencePrompt": "I am not hungry because I have _____ eaten a sandwich.",
        "laneOptions": [
          "yet",
          "already",
          "ever"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Perfect (Already)",
        "explanation": "We use \"already\" to say an action happened sooner than expected.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_12",
        "sentencePrompt": "They have lived in this neighbourhood _____ 2018.",
        "laneOptions": [
          "since",
          "for",
          "during"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Present Perfect (Since)",
        "explanation": "We use \"since\" with a specific starting point in time.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_13",
        "sentencePrompt": "He has been interested in robotics _____ three years.",
        "laneOptions": [
          "since",
          "for",
          "ago"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Present Perfect (For)",
        "explanation": "We use \"for\" to refer to a duration or period of time.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_14",
        "sentencePrompt": "We should recycle paper and plastic _____ protect nature.",
        "laneOptions": [
          "in order to",
          "so that",
          "because of"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Purpose (In order to + Infinitive)",
        "explanation": "\"In order to\" is followed directly by the base verb to express purpose.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_15",
        "sentencePrompt": "I set an alarm _____ I wouldn't miss the school bus.",
        "laneOptions": [
          "in order to",
          "because",
          "so that"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Purpose (So that + Clause)",
        "explanation": "\"So that\" is followed by a subject and modal verb clause.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_16",
        "sentencePrompt": "_____ rock climbing is risky, many adventurers love it.",
        "laneOptions": [
          "Although",
          "Because",
          "So"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Concession (Although)",
        "explanation": "\"Although\" introduces a contrast or concession between two clauses.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_17",
        "sentencePrompt": "The internet connection was weak, _____ we could not join the video meeting.",
        "laneOptions": [
          "because",
          "so",
          "although"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Cause and Result (So)",
        "explanation": "\"So\" introduces the result of the previous situation.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_18",
        "sentencePrompt": "If we waste fresh water, we _____ severe droughts in the future.",
        "laneOptions": [
          "will face",
          "faced",
          "would face"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "First Conditional (Real Future)",
        "explanation": "In first conditionals (real possibilities), the result clause uses \"will + base verb\".",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_19",
        "sentencePrompt": "If there is no rain this season, crops _____ grow properly.",
        "laneOptions": [
          "wouldn't",
          "didn't",
          "won't"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "First Conditional Negative",
        "explanation": "Real conditional negative result uses \"will not / won't + base verb\".",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_20",
        "sentencePrompt": "The landline phone rang while we _____ dinner together.",
        "laneOptions": [
          "had",
          "were having",
          "have had"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Past Continuous with While",
        "explanation": "\"While\" is used with past continuous to describe an action in progress in the past.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_21",
        "sentencePrompt": "While I was studying in the bedroom, the electricity suddenly _____ out.",
        "laneOptions": [
          "went",
          "was going",
          "goes"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Simple Interrupting Action",
        "explanation": "The short interrupting action takes the Past Simple tense.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_22",
        "sentencePrompt": "Please send me a text message as soon as you _____ home.",
        "laneOptions": [
          "arrived",
          "arrive",
          "will arrive"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Time Clauses with As Soon As",
        "explanation": "In time clauses referring to the future, we use Present Simple after \"as soon as\".",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_23",
        "sentencePrompt": "First peel the potatoes, and _____ slice them into thin pieces.",
        "laneOptions": [
          "before",
          "until",
          "then"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Sequencing Connectors (Then)",
        "explanation": "We use \"then\" to indicate the next step in a process.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_24",
        "sentencePrompt": "_____ that, place the baking tray into the oven for twenty minutes.",
        "laneOptions": [
          "After",
          "Before",
          "During"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Sequencing Connectors (After that)",
        "explanation": "\"After that\" is a standard connector for sequencing steps in recipes.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_25",
        "sentencePrompt": "Could you please hold on a minute? I will _____ you through to the manager.",
        "laneOptions": [
          "take",
          "put",
          "hang"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Telephone Expressions (Put through)",
        "explanation": "\"Put someone through\" means to connect someone by telephone.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_26",
        "sentencePrompt": "The doctor is busy right now. Would you like to _____ a message?",
        "laneOptions": [
          "leave",
          "take",
          "make"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Telephone Expressions (Leave a message)",
        "explanation": "A caller asks to \"leave a message\" for someone who is unavailable.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_27",
        "sentencePrompt": "Skydiving is _____ more dangerous than riding a bicycle.",
        "laneOptions": [
          "very",
          "more",
          "much"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Modifying Comparatives (Much)",
        "explanation": "We use \"much\" before comparative adjectives to show a big difference.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_28",
        "sentencePrompt": "Mount Everest is the _____ challenging peak in the world.",
        "laneOptions": [
          "more",
          "most",
          "much"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Superlatives (The most)",
        "explanation": "Long adjectives use \"the most\" in the superlative form.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_29",
        "sentencePrompt": "Scientists predict that robot helpers _____ common in homes by 2035.",
        "laneOptions": [
          "will be",
          "were",
          "would be"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Future Predictions with Will",
        "explanation": "We use \"will + base verb\" for general predictions about the future.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_30",
        "sentencePrompt": "Look at those heavy dark clouds; it _____ rain very heavily.",
        "laneOptions": [
          "will",
          "is going to",
          "was going to"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Predictions with Present Evidence (Be going to)",
        "explanation": "We use \"be going to\" when there is clear visual evidence in the present.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_31",
        "sentencePrompt": "Everyone in our family _____ share the household duties equally.",
        "laneOptions": [
          "must",
          "can",
          "may"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Obligation with Must",
        "explanation": "\"Must\" expresses a strong necessity or moral obligation.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_32",
        "sentencePrompt": "_____ you like to join our study group this afternoon?",
        "laneOptions": [
          "Do",
          "Did",
          "Would"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Invitations (Would you like to)",
        "explanation": "\"Would you like to...\" is the standard polite formula for making an invitation.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_33",
        "sentencePrompt": "_____ we look online for more information about the national park?",
        "laneOptions": [
          "Why don't",
          "How about",
          "What about"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Suggestions (Why don't we)",
        "explanation": "\"Why don't we\" is followed by a base verb (\"look\").",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_34",
        "sentencePrompt": "How about _____ a cycling tour along the coast on Saturday?",
        "laneOptions": [
          "take",
          "taking",
          "to take"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Suggestions (How about + V-ing)",
        "explanation": "\"How about\" is followed by the -ing form of the verb.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_35",
        "sentencePrompt": "A trustworthy friend _____ tells lies or breaks promises.",
        "laneOptions": [
          "always",
          "sometimes",
          "never"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Adverbs of Frequency (Never)",
        "explanation": "A trustworthy person \"never\" tells lies.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_36",
        "sentencePrompt": "Can you solve this computer network problem by _____ ?",
        "laneOptions": [
          "yourself",
          "yours",
          "you"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Reflexive Pronouns (By yourself)",
        "explanation": "\"By yourself\" means alone or without help.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_37",
        "sentencePrompt": "Both Selin _____ her sister are keen on classical music.",
        "laneOptions": [
          "or",
          "and",
          "nor"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Correlative Conjunctions (Both ... and)",
        "explanation": "\"Both\" pairs with \"and\" to join two subjects.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_38",
        "sentencePrompt": "Neither the bus _____ the metro was running during the heavy snowstorm.",
        "laneOptions": [
          "or",
          "and",
          "nor"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Correlative Conjunctions (Neither ... nor)",
        "explanation": "\"Neither\" pairs with \"nor\" to negate both choices.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_39",
        "sentencePrompt": "You look very exhausted; you _____ take a short rest before studying.",
        "laneOptions": [
          "should",
          "mustn't",
          "needn't"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Giving Advice (Should)",
        "explanation": "We use \"should\" to give helpful advice or recommendations.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_40",
        "sentencePrompt": "In my _____ , extreme adventure sports help build self-confidence.",
        "laneOptions": [
          "mind",
          "opinion",
          "thought"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Expressing Opinions (In my opinion)",
        "explanation": "\"In my opinion\" is the standard phrase to introduce personal viewpoints.",
        "contentVersion": 2
      },
      {
        "id": "gr_g8_h_41",
        "sentencePrompt": "I would much rather you _____ your friend directly instead of texting.",
        "laneOptions": [
          "calling",
          "call",
          "called"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Would Rather + Subject + Past",
        "explanation": "'Would rather you called' expresses preference for someone else's action."
      },
      {
        "id": "gr_g8_h_42",
        "sentencePrompt": "Had the warning sirens sounded earlier, the residents _____ safely.",
        "laneOptions": [
          "would have evacuated",
          "evacuated",
          "will evacuate"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Inverted Third Conditional",
        "explanation": "Past unreal conditional without 'if'."
      },
      {
        "id": "gr_g8_h_43",
        "sentencePrompt": "Not only did he prepare the banquet, but he also _____ the entire kitchen.",
        "laneOptions": [
          "cleans",
          "cleaned",
          "cleaning"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Parallel Past Narrative with Inversion",
        "explanation": "Second clause maintains past tense."
      },
      {
        "id": "gr_g8_h_44",
        "sentencePrompt": "It is high time we _____ our computer passwords to ensure cybersecurity.",
        "laneOptions": [
          "changing",
          "change",
          "changed"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "It Is High Time + Past Subjunctive",
        "explanation": "Urgent present necessity takes past tense."
      },
      {
        "id": "gr_g8_h_45",
        "sentencePrompt": "Under no circumstances should personal banking details _____ online.",
        "laneOptions": [
          "be shared",
          "share",
          "being shared"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Inversion with Passive Modal",
        "explanation": "Should + be + V3."
      },
      {
        "id": "gr_g8_h_46",
        "sentencePrompt": "The more meticulously you plan the recipe, the _____ the result will be.",
        "laneOptions": [
          "best",
          "better",
          "more good"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Double Comparative",
        "explanation": "The more ... the better."
      },
      {
        "id": "gr_g8_h_47",
        "sentencePrompt": "The research team was praised for having _____ the groundbreaking patent.",
        "laneOptions": [
          "securing",
          "secure",
          "secured"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Perfect Gerund",
        "explanation": "Having + past participle."
      },
      {
        "id": "gr_g8_h_48",
        "sentencePrompt": "She spoke with such diplomatic courtesy _____ all tension vanished.",
        "laneOptions": [
          "that",
          "as",
          "than"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Such + Noun + That",
        "explanation": "Result clause with 'that'."
      },
      {
        "id": "gr_g8_h_49",
        "sentencePrompt": "Were the earthquake to trigger a tsunami, coastal warnings _____ issued.",
        "laneOptions": [
          "will be",
          "would be",
          "are"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Formal Second Conditional Inversion",
        "explanation": "Were ... to trigger -> would be."
      },
      {
        "id": "gr_g8_h_50",
        "sentencePrompt": "Scarcely had the phone line connected _____ the battery died.",
        "laneOptions": [
          "then",
          "than",
          "when"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Scarcely ... When",
        "explanation": "'Scarcely' pairs strictly with 'when'."
      },
      {
        "id": "gr_g8_h_51",
        "sentencePrompt": "He acts as though he _____ the sole authority on extreme sports.",
        "laneOptions": [
          "were",
          "is",
          "has been"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "As Though with Subjunctive",
        "explanation": "Subjunctive 'were' for hypothetical claim."
      },
      {
        "id": "gr_g8_h_52",
        "sentencePrompt": "No sooner had the recipe been published _____ it went viral worldwide.",
        "laneOptions": [
          "when",
          "than",
          "after"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "No Sooner ... Than",
        "explanation": "'No sooner' pairs strictly with 'than'."
      },
      {
        "id": "gr_g8_h_53",
        "sentencePrompt": "The historic ruins are reported to _____ severely damaged in the tremor.",
        "laneOptions": [
          "being",
          "be",
          "have been"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Reporting Verbs with Perfect Passive",
        "explanation": "Past event reported with perfect infinitive."
      },
      {
        "id": "gr_g8_h_54",
        "sentencePrompt": "Little _____ the internet users realize how their personal data was harvested.",
        "laneOptions": [
          "did",
          "had",
          "were"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Negative Inversion (Little)",
        "explanation": "Fronted 'Little' requires auxiliary inversion."
      },
      {
        "id": "gr_g8_h_55",
        "sentencePrompt": "You had better not _____ that confidential document to unverified contacts.",
        "laneOptions": [
          "to send",
          "send",
          "sending"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Had Better Negative",
        "explanation": "'Had better not' + bare verb."
      },
      {
        "id": "gr_g8_h_56",
        "sentencePrompt": "Seldom _____ such culinary excellence been achieved by a young apprentice.",
        "laneOptions": [
          "was",
          "is",
          "has"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Inversion with Seldom",
        "explanation": "Auxiliary inversion with present perfect."
      },
      {
        "id": "gr_g8_h_57",
        "sentencePrompt": "She insisted that the laboratory protocol _____ strictly maintained.",
        "laneOptions": [
          "be",
          "is",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Formal Subjunctive",
        "explanation": "Base subjunctive 'be'."
      },
      {
        "id": "gr_g8_h_58",
        "sentencePrompt": "Had it not been for the sturdy helmet, the cyclist _____ head trauma.",
        "laneOptions": [
          "suffered",
          "would have suffered",
          "will suffer"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Third Conditional Inversion",
        "explanation": "Hypothetical past consequence."
      },
      {
        "id": "gr_g8_h_59",
        "sentencePrompt": "The paragliding instructor demanded that each student _____ safety checks.",
        "laneOptions": [
          "performed",
          "performs",
          "perform"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Subjunctive with Demand",
        "explanation": "Base form 'perform'."
      },
      {
        "id": "gr_g8_h_60",
        "sentencePrompt": "Hardly had the chef seasoned the soup _____ the VIP patrons arrived.",
        "laneOptions": [
          "when",
          "than",
          "then"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Hardly ... When",
        "explanation": "Pairing 'hardly' with 'when'."
      },
      {
        "id": "gr_g8_h_61",
        "sentencePrompt": "So severe _____ the winter blizzard that all airport runways were closed.",
        "laneOptions": [
          "is",
          "was",
          "were"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with So + Adjective",
        "explanation": "Fronted adjective triggers inversion."
      },
      {
        "id": "gr_g8_h_62",
        "sentencePrompt": "The older the architecture of the city, the _____ its historical value.",
        "laneOptions": [
          "more great",
          "greatest",
          "greater"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Parallel Comparative",
        "explanation": "The older ... the greater."
      },
      {
        "id": "gr_g8_h_63",
        "sentencePrompt": "It is essential that every household _____ an emergency preparedness kit.",
        "laneOptions": [
          "assemble",
          "assembles",
          "assembled"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Formal Mandative Subjunctive",
        "explanation": "'Essential that' takes base verb."
      },
      {
        "id": "gr_g8_h_64",
        "sentencePrompt": "Such _____ the ferocity of the hurricane that roofs were torn away.",
        "laneOptions": [
          "is",
          "was",
          "were"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Such + Noun",
        "explanation": "Fronted 'Such was...'."
      },
      {
        "id": "gr_g8_h_65",
        "sentencePrompt": "Had they checked the road conditions, they _____ trapped in the blizzard.",
        "laneOptions": [
          "will not be",
          "were not",
          "would not have been"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Third Conditional Negative",
        "explanation": "Hypothetical past avoidance."
      },
      {
        "id": "gr_g8_h_66",
        "sentencePrompt": "The committee recommended that the national disaster fund _____ expanded.",
        "laneOptions": [
          "be",
          "is",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Recommendation Subjunctive",
        "explanation": "Base subjunctive 'be'."
      },
      {
        "id": "gr_g8_h_67",
        "sentencePrompt": "Only after verifying the caller's credentials _____ the transaction authorized.",
        "laneOptions": [
          "is",
          "was",
          "did"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Only After",
        "explanation": "Fronted phrase triggers inversion."
      },
      {
        "id": "gr_g8_h_68",
        "sentencePrompt": "He was accustomed to _____ high-altitude mountain trails in all seasons.",
        "laneOptions": [
          "trekked",
          "trek",
          "trekking"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Accustomed To + Gerund",
        "explanation": "'To' as preposition takes gerund."
      },
      {
        "id": "gr_g8_h_69",
        "sentencePrompt": "Never before _____ such a powerful earthquake been recorded in this region.",
        "laneOptions": [
          "had",
          "has",
          "was"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Past Inversion (Never Before)",
        "explanation": "Auxiliary inversion."
      },
      {
        "id": "gr_g8_h_70",
        "sentencePrompt": "He prepared the meal with utmost caution lest the delicate sauce _____ burn.",
        "laneOptions": [
          "would",
          "should",
          "could"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Lest Clause",
        "explanation": "'Lest' takes 'should'."
      },
      {
        "id": "gr_g8_h_71",
        "sentencePrompt": "In no way _____ the volunteer team be faulted for the delayed rescue.",
        "laneOptions": [
          "may",
          "it can",
          "can"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Fronted Negative Inversion",
        "explanation": "'In no way' requires inversion."
      },
      {
        "id": "gr_g8_h_72",
        "sentencePrompt": "The ancient fortress is believed to _____ occupied during the Crusades.",
        "laneOptions": [
          "have been",
          "be",
          "being"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Perfect Passive Infinitive",
        "explanation": "Historical belief."
      },
      {
        "id": "gr_g8_h_73",
        "sentencePrompt": "Were the volcanic eruption to intensify, thousands _____ immediate relocation.",
        "laneOptions": [
          "will need",
          "would need",
          "needed"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Formal Conditional Inversion",
        "explanation": "Were ... to intensify -> would need."
      },
      {
        "id": "gr_g8_h_74",
        "sentencePrompt": "She was on the verge of _____ her culinary championship title.",
        "laneOptions": [
          "to defend",
          "defend",
          "defending"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "On the Verge of + Gerund",
        "explanation": "Prepositional phrase takes gerund."
      },
      {
        "id": "gr_g8_h_75",
        "sentencePrompt": "Much as we appreciate extreme thrills, safety _____ always take priority.",
        "laneOptions": [
          "must",
          "can",
          "might"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Concession with Obligation",
        "explanation": "'Must' expresses imperative priority."
      },
      {
        "id": "gr_g8_h_76",
        "sentencePrompt": "Should anyone require emergency assistance, _____ this direct extension.",
        "laneOptions": [
          "dialed",
          "dial",
          "dialing"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Imperative",
        "explanation": "'Should anyone...' takes imperative."
      },
      {
        "id": "gr_g8_h_77",
        "sentencePrompt": "The historic monument is far too valuable _____ demolished for a highway.",
        "laneOptions": [
          "for be",
          "being",
          "to be"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Too ... To Be Passive",
        "explanation": "Too valuable to be demolished."
      },
      {
        "id": "gr_g8_h_78",
        "sentencePrompt": "Had the scientist published the formula sooner, lives _____ saved.",
        "laneOptions": [
          "could have been",
          "can be",
          "were"
        ],
        "correctLaneIndex": 0,
        "grammarTopic": "Modal Third Conditional Passive",
        "explanation": "Could have been saved."
      },
      {
        "id": "gr_g8_h_79",
        "sentencePrompt": "Nowhere in Europe _____ such dramatic coastal cliffs be found.",
        "laneOptions": [
          "you can",
          "can",
          "are"
        ],
        "correctLaneIndex": 1,
        "grammarTopic": "Inversion with Nowhere",
        "explanation": "Fronted locative triggers inversion."
      },
      {
        "id": "gr_g8_h_80",
        "sentencePrompt": "The invention was credited to his having _____ years of dedicated research.",
        "laneOptions": [
          "investing",
          "invest",
          "invested"
        ],
        "correctLaneIndex": 2,
        "grammarTopic": "Perfect Participle after Preposition",
        "explanation": "Having + V3."
      }
    ]
  }
};
