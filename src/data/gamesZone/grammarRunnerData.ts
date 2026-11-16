/**
 * UNIT REVIEW ARCADE — GRAMMAR RUNNER DATA BANK (PHASE 7A)
 * Version: 7.0.0
 * 
 * 240 validated unique questions across:
 * - Grade 7: Easy (40), Medium (40), Hard (40)
 * - Grade 8: Easy (40), Medium (40), Hard (40)
 */

import type { GrammarRunnerBank } from '../../types/gamesZone';

export const GRAMMAR_RUNNER_BANK: GrammarRunnerBank = {
  'grade-7': {
    easy: [
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
      }
],
    medium: [
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
            "explanation": "'Understand' is a stative verb and rarely takes '-ing'."
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
      }
],
    hard: [
      {
            "id": "gr_g7_h_01",
            "sentencePrompt": "While I _____ my homework, the power went out.",
            "laneOptions": [
                  "was doing",
                  "did",
                  "am doing"
            ],
            "correctLaneIndex": 0,
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
            "sentencePrompt": "He ran as fast as he could, _____ he still missed the bus.",
            "laneOptions": [
                  "because",
                  "so",
                  "although"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Conjunctions of Contrast",
            "explanation": "'Although' shows an unexpected contrast or concession."
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
      }
],
  },
  'grade-8': {
    easy: [
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
            "sentencePrompt": "How long _____ you known your best friend?",
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
            "explanation": "Both parallel verbs after 'would rather ... than' are bare infinitives."
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
            "sentencePrompt": "He _____ finish this chore before his parents return home.",
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
      }
],
    medium: [
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
            "sentencePrompt": "When I arrive at the airport, I _____ you a text message.",
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
            "sentencePrompt": "The cake _____ my mother baked smelled delightful.",
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
            "sentencePrompt": "The telephone _____ invented by Alexander Graham Bell.",
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
            "sentencePrompt": "These delicious cookies _____ baked by my grandmother.",
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
      }
],
    hard: [
      {
            "id": "gr_g8_h_01",
            "sentencePrompt": "If I _____ a million dollars, I would travel around the world.",
            "laneOptions": [
                  "had",
                  "have",
                  "would have"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Second Conditional",
            "explanation": "Conditionals Type 2 uses past simple in the 'if' condition."
      },
      {
            "id": "gr_g8_h_02",
            "sentencePrompt": "If she knew the answer, she _____ tell us immediately.",
            "laneOptions": [
                  "will",
                  "would",
                  "shall"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Second Conditional Result",
            "explanation": "Conditionals Type 2 uses 'would + base verb' in the main clause."
      },
      {
            "id": "gr_g8_h_03",
            "sentencePrompt": "If I _____ you, I would consult a doctor right away.",
            "laneOptions": [
                  "am",
                  "was",
                  "were"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Second Conditional (Advice)",
            "explanation": "'If I were you' is standard subjunctive phrasing for advice."
      },
      {
            "id": "gr_g8_h_04",
            "sentencePrompt": "Where would you live if you _____ choose any city on Earth?",
            "laneOptions": [
                  "could",
                  "can",
                  "will"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Second Conditional Modal",
            "explanation": "Use 'could' as the past form of 'can' in conditional clauses."
      },
      {
            "id": "gr_g8_h_05",
            "sentencePrompt": "If we had more free time, we _____ take up tennis lessons.",
            "laneOptions": [
                  "will",
                  "would",
                  "did"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Second Conditional",
            "explanation": "'Would' expresses an unreal hypothetical outcome."
      },
      {
            "id": "gr_g8_h_06",
            "sentencePrompt": "What _____ you do if you found a lost wallet in the park?",
            "laneOptions": [
                  "will",
                  "did",
                  "would"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Second Conditional Question",
            "explanation": "Questions in Type 2 conditional use 'would + subject + base verb'."
      },
      {
            "id": "gr_g8_h_07",
            "sentencePrompt": "If he didn't complain so much, people _____ enjoy his company.",
            "laneOptions": [
                  "would",
                  "will",
                  "shall"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Second Conditional",
            "explanation": "Use 'would' in the main clause."
      },
      {
            "id": "gr_g8_h_08",
            "sentencePrompt": "I wouldn't buy that expensive jacket if I _____ you.",
            "laneOptions": [
                  "was",
                  "were",
                  "am"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Hypothetical Were",
            "explanation": "In formal English, 'were' is preferred for all subjects in Type 2."
      },
      {
            "id": "gr_g8_h_09",
            "sentencePrompt": "If she _____ harder, she would achieve higher marks.",
            "laneOptions": [
                  "would study",
                  "studies",
                  "studied"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Second Conditional",
            "explanation": "Use the past simple in the 'if' condition."
      },
      {
            "id": "gr_g8_h_10",
            "sentencePrompt": "They would be much happier if they _____ in the countryside.",
            "laneOptions": [
                  "lived",
                  "live",
                  "will live"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Second Conditional",
            "explanation": "The condition takes the past simple tense ('lived')."
      },
      {
            "id": "gr_g8_h_11",
            "sentencePrompt": "When we arrived at the cinema, the movie _____ already started.",
            "laneOptions": [
                  "has",
                  "had",
                  "was"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Past Perfect",
            "explanation": "Use 'had + past participle' for an action that happened before another past event."
      },
      {
            "id": "gr_g8_h_12",
            "sentencePrompt": "She couldn't board the flight because she _____ her passport.",
            "laneOptions": [
                  "forgot",
                  "has forgotten",
                  "had forgotten"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Past Perfect Cause",
            "explanation": "Forgetting the passport happened before she was denied boarding."
      },
      {
            "id": "gr_g8_h_13",
            "sentencePrompt": "By the time the firefighter arrived, the neighbors _____ extinguished the blaze.",
            "laneOptions": [
                  "had",
                  "have",
                  "were"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Past Perfect with By The Time",
            "explanation": "'By the time' + past simple requires past perfect in the main clause."
      },
      {
            "id": "gr_g8_h_14",
            "sentencePrompt": "He was very nervous because he _____ never flown before.",
            "laneOptions": [
                  "has",
                  "had",
                  "was"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Past Perfect Experience",
            "explanation": "Life experience prior to a past event uses 'had never flown'."
      },
      {
            "id": "gr_g8_h_15",
            "sentencePrompt": "After they _____ lunch, they went for a walk in the garden.",
            "laneOptions": [
                  "finished",
                  "have finished",
                  "had finished"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Past Perfect with After",
            "explanation": "'After' introduces the earlier of two past actions (had finished)."
      },
      {
            "id": "gr_g8_h_16",
            "sentencePrompt": "I realized I _____ left my house keys on the dining table.",
            "laneOptions": [
                  "had",
                  "have",
                  "was"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Past Perfect",
            "explanation": "Leaving the keys occurred before the realization in the past."
      },
      {
            "id": "gr_g8_h_17",
            "sentencePrompt": "The grass was soaking wet because it _____ heavily all night.",
            "laneOptions": [
                  "rained",
                  "had rained",
                  "has rained"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Past Perfect Continuous / Simple",
            "explanation": "The rain happened before the observed past condition."
      },
      {
            "id": "gr_g8_h_18",
            "sentencePrompt": "She didn't want to see the film because she _____ already read the book.",
            "laneOptions": [
                  "was",
                  "has",
                  "had"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Past Perfect with Already",
            "explanation": "Reading the book occurred prior to the cinema invitation."
      },
      {
            "id": "gr_g8_h_19",
            "sentencePrompt": "Until yesterday, I _____ never heard of that famous Turkish scientist.",
            "laneOptions": [
                  "had",
                  "have",
                  "did"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Past Perfect with Until",
            "explanation": "'Until yesterday' sets a past deadline, requiring 'had never heard'."
      },
      {
            "id": "gr_g8_h_20",
            "sentencePrompt": "He thanked the stranger who _____ found his lost wallet.",
            "laneOptions": [
                  "has",
                  "had",
                  "did"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Past Perfect in Relative Clause",
            "explanation": "Finding the wallet happened before he expressed gratitude."
      },
      {
            "id": "gr_g8_h_21",
            "sentencePrompt": "You are coming to the graduation ceremony, _____ you?",
            "laneOptions": [
                  "won't",
                  "don't",
                  "aren't"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Tag Questions",
            "explanation": "A positive sentence with 'are' takes the negative tag 'aren't you?'."
      },
      {
            "id": "gr_g8_h_22",
            "sentencePrompt": "She doesn't eat meat, _____ she?",
            "laneOptions": [
                  "does",
                  "is",
                  "do"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Tag Questions",
            "explanation": "A negative sentence with 'doesn't' takes the positive tag 'does she?'."
      },
      {
            "id": "gr_g8_h_23",
            "sentencePrompt": "They won the regional championship, _____ they?",
            "laneOptions": [
                  "don't",
                  "didn't",
                  "weren't"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Tag Questions (Past Simple)",
            "explanation": "Past simple positive sentences take the tag 'didn't they?'."
      },
      {
            "id": "gr_g8_h_24",
            "sentencePrompt": "He can play the acoustic guitar, _____ he?",
            "laneOptions": [
                  "couldn't",
                  "doesn't",
                  "can't"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Tag Questions with Modals",
            "explanation": "Match the modal verb 'can' with 'can't he?'."
      },
      {
            "id": "gr_g8_h_25",
            "sentencePrompt": "Let's take a short break now, _____ we?",
            "laneOptions": [
                  "shall",
                  "will",
                  "don't"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Tag Questions with Let's",
            "explanation": "Suggestions starting with 'Let's' take the tag 'shall we?'."
      },
      {
            "id": "gr_g8_h_26",
            "sentencePrompt": "Could you tell me where the nearest pharmacy _____?",
            "laneOptions": [
                  "is it",
                  "is",
                  "it is"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Indirect Questions",
            "explanation": "In indirect questions, the verb follows the subject (where the pharmacy is)."
      },
      {
            "id": "gr_g8_h_27",
            "sentencePrompt": "Do you know what time the library _____?",
            "laneOptions": [
                  "is closing",
                  "does close",
                  "closes"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Indirect Questions",
            "explanation": "Indirect questions use statement word order without auxiliary 'does'."
      },
      {
            "id": "gr_g8_h_28",
            "sentencePrompt": "I wonder why she _____ so upset yesterday.",
            "laneOptions": [
                  "was",
                  "was she",
                  "did she be"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Embedded Clauses",
            "explanation": "Embedded clauses keep normal subject-verb order (why she was)."
      },
      {
            "id": "gr_g8_h_29",
            "sentencePrompt": "Don't be late for the exam, _____ you?",
            "laneOptions": [
                  "do",
                  "will",
                  "shall"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Imperative Tag Questions",
            "explanation": "Negative imperatives take the tag 'will you?'."
      },
      {
            "id": "gr_g8_h_30",
            "sentencePrompt": "Nobody was injured in the accident, _____ they?",
            "laneOptions": [
                  "was",
                  "weren't",
                  "were"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Tag Questions with Nobody",
            "explanation": "'Nobody' is negative, so it takes a positive plural tag 'were they?'."
      },
      {
            "id": "gr_g8_h_31",
            "sentencePrompt": "He said that he _____ travelling to London the next day.",
            "laneOptions": [
                  "was",
                  "is",
                  "were"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Reported Speech Tense Shift",
            "explanation": "Present Continuous 'am/is travelling' shifts back to 'was travelling'."
      },
      {
            "id": "gr_g8_h_32",
            "sentencePrompt": "She told me that she _____ her keys in the car.",
            "laneOptions": [
                  "has left",
                  "had left",
                  "leaves"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Reported Speech Past Shift",
            "explanation": "Past simple shifts to past perfect ('had left') in reported speech."
      },
      {
            "id": "gr_g8_h_33",
            "sentencePrompt": "The teacher told the students _____ quiet.",
            "laneOptions": [
                  "be",
                  "being",
                  "to be"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Reported Commands",
            "explanation": "Reported orders and commands use 'to + infinitive' (to be quiet)."
      },
      {
            "id": "gr_g8_h_34",
            "sentencePrompt": "My doctor advised me _____ more fresh vegetables.",
            "laneOptions": [
                  "to eat",
                  "eating",
                  "eat"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Reported Advice",
            "explanation": "The verb 'advise someone' takes an infinitive with 'to'."
      },
      {
            "id": "gr_g8_h_35",
            "sentencePrompt": "Look at the wet ground; it _____ have rained during the night.",
            "laneOptions": [
                  "can't",
                  "must",
                  "should"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Modal of Deduction",
            "explanation": "'Must have + past participle' expresses near-certainty based on evidence."
      },
      {
            "id": "gr_g8_h_36",
            "sentencePrompt": "He _____ be at home; I saw him at the library five minutes ago.",
            "laneOptions": [
                  "might",
                  "must",
                  "can't"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "Modal of Impossibility",
            "explanation": "'Can't be' expresses logical impossibility based on known facts."
      },
      {
            "id": "gr_g8_h_37",
            "sentencePrompt": "You _____ have shouted at your sister; now she is crying.",
            "laneOptions": [
                  "shouldn't",
                  "mustn't",
                  "couldn't"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Criticism / Past Regret",
            "explanation": "'Shouldn't have + past participle' criticizes a past action."
      },
      {
            "id": "gr_g8_h_38",
            "sentencePrompt": "Despite _____ exhausted, he finished the marathon race.",
            "laneOptions": [
                  "be",
                  "being",
                  "to be"
            ],
            "correctLaneIndex": 1,
            "grammarTopic": "Despite + Gerund",
            "explanation": "The preposition 'despite' is followed by a gerund (-ing)."
      },
      {
            "id": "gr_g8_h_39",
            "sentencePrompt": "In order to _____ your grades, you must study regularly.",
            "laneOptions": [
                  "improved",
                  "improving",
                  "improve"
            ],
            "correctLaneIndex": 2,
            "grammarTopic": "In order to + Infinitive",
            "explanation": "'In order to' is followed by the bare base verb."
      },
      {
            "id": "gr_g8_h_40",
            "sentencePrompt": "We decided to walk _____ of taking the crowded bus.",
            "laneOptions": [
                  "instead",
                  "in place",
                  "rather"
            ],
            "correctLaneIndex": 0,
            "grammarTopic": "Instead of + Gerund",
            "explanation": "The fixed prepositional phrase is 'instead of'."
      }
],
  },
};
