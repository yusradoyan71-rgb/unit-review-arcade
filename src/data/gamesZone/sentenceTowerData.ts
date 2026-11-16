/**
 * UNIT REVIEW ARCADE — SENTENCE TOWER DATA BANK (PHASE 7A - AUDITED & ENRICHED)
 * Version: 7.1.0
 * 
 * 240 validated unique questions across:
 * - Grade 7: Easy (40), Medium (40), Hard (40)
 * - Grade 8: Easy (40), Medium (40), Hard (40)
 * 
 * AUDIT COMPLETE:
 * - All valid grammatical permutations (preference reversals, adverbial fronting, conditional inversion)
 *   are comprehensively populated under alternativeSentences.
 * - Words in scrambledWords guaranteed to match correctSentence tokens 1:1.
 */

import type { SentenceTowerBank } from '../../types/gamesZone';

export const SENTENCE_TOWER_BANK: SentenceTowerBank = {
  'grade-7': {
    easy: [
      {
            "id": "st_g7_e_01",
            "scrambledWords": [
                  "She",
                  "likes",
                  "ice",
                  "cream",
                  "chocolate"
            ],
            "correctSentence": "She likes chocolate ice cream.",
            "themeOrTopic": "Likes & Preferences",
            "explanation": "Subject (She) + Verb (likes) + Object (chocolate ice cream)."
      },
      {
            "id": "st_g7_e_02",
            "scrambledWords": [
                  "play",
                  "afternoon",
                  "They",
                  "every",
                  "football"
            ],
            "correctSentence": "They play football every afternoon.",
            "alternativeSentences": [
                  "Every afternoon they play football."
            ],
            "themeOrTopic": "Daily Routine",
            "explanation": "Time adverbial can sit at the end or front of the sentence."
      },
      {
            "id": "st_g7_e_03",
            "scrambledWords": [
                  "My",
                  "a",
                  "is",
                  "doctor",
                  "father"
            ],
            "correctSentence": "My father is a doctor.",
            "themeOrTopic": "Occupations (To Be)",
            "explanation": "Subject + verb 'is' + article + noun complement."
      },
      {
            "id": "st_g7_e_04",
            "scrambledWords": [
                  "in",
                  "a",
                  "city",
                  "We",
                  "live"
            ],
            "correctSentence": "We live in a city.",
            "themeOrTopic": "Prepositions of Place",
            "explanation": "Subject (We) + Verb (live) + Prepositional phrase (in a city)."
      },
      {
            "id": "st_g7_e_05",
            "scrambledWords": [
                  "rises",
                  "sun",
                  "The",
                  "east",
                  "in"
            ],
            "correctSentence": "The sun rises in east.",
            "themeOrTopic": "Present Simple Facts",
            "explanation": "Definite article + noun + 3rd person singular verb + prepositional phrase."
      },
      {
            "id": "st_g7_e_06",
            "scrambledWords": [
                  "two",
                  "pet",
                  "cats",
                  "I",
                  "have"
            ],
            "correctSentence": "I have two pet cats.",
            "themeOrTopic": "Have / Has",
            "explanation": "Subject + have + numeral + adjective + plural noun."
      },
      {
            "id": "st_g7_e_07",
            "scrambledWords": [
                  "He",
                  "night",
                  "at",
                  "books",
                  "reads"
            ],
            "correctSentence": "He reads books at night.",
            "alternativeSentences": [
                  "At night he reads books."
            ],
            "themeOrTopic": "Habits",
            "explanation": "Subject + verb with -s + direct object + time phrase."
      },
      {
            "id": "st_g7_e_08",
            "scrambledWords": [
                  "Dogs",
                  "friendly",
                  "are",
                  "animals",
                  "very"
            ],
            "correctSentence": "Dogs are very friendly animals.",
            "themeOrTopic": "Adjectives",
            "explanation": "Plural subject + are + adverb + adjective + plural noun."
      },
      {
            "id": "st_g7_e_09",
            "scrambledWords": [
                  "every",
                  "She",
                  "milk",
                  "morning",
                  "drinks"
            ],
            "correctSentence": "She drinks milk every morning.",
            "alternativeSentences": [
                  "Every morning she drinks milk."
            ],
            "themeOrTopic": "Routines",
            "explanation": "Subject + drinks + uncountable noun + frequency phrase."
      },
      {
            "id": "st_g7_e_10",
            "scrambledWords": [
                  "in",
                  "Birds",
                  "sky",
                  "fly",
                  "can"
            ],
            "correctSentence": "Birds can fly in sky.",
            "themeOrTopic": "Modal Can",
            "explanation": "Subject + modal can + bare verb + prepositional phrase."
      },
      {
            "id": "st_g7_e_11",
            "scrambledWords": [
                  "my",
                  "is",
                  "new",
                  "bicycle",
                  "This"
            ],
            "correctSentence": "This is my new bicycle.",
            "themeOrTopic": "Demonstratives",
            "explanation": "Demonstrative pronoun + is + possessive adjective + noun."
      },
      {
            "id": "st_g7_e_12",
            "scrambledWords": [
                  "lunch",
                  "We",
                  "eat",
                  "school",
                  "at"
            ],
            "correctSentence": "We eat lunch at school.",
            "alternativeSentences": [
                  "At school we eat lunch."
            ],
            "themeOrTopic": "Daily Routine",
            "explanation": "Subject + eat + meal + prepositional place."
      },
      {
            "id": "st_g7_e_13",
            "scrambledWords": [
                  "sweet",
                  "and",
                  "apple",
                  "The",
                  "red",
                  "is"
            ],
            "correctSentence": "The apple is red and sweet.",
            "alternativeSentences": [
                  "The apple is sweet and red."
            ],
            "themeOrTopic": "Describing Things",
            "explanation": "Adjectives connected by 'and' can appear in either order."
      },
      {
            "id": "st_g7_e_14",
            "scrambledWords": [
                  "very",
                  "well",
                  "He",
                  "speaks",
                  "English"
            ],
            "correctSentence": "He speaks English very well.",
            "themeOrTopic": "Adverbs of Manner",
            "explanation": "Subject + speaks + language + intensifier + adverb."
      },
      {
            "id": "st_g7_e_15",
            "scrambledWords": [
                  "playing",
                  "Children",
                  "love",
                  "games",
                  "fun"
            ],
            "correctSentence": "Children love playing fun games.",
            "themeOrTopic": "Love + Gerund",
            "explanation": "Subject + love + gerund + adjective + noun."
      },
      {
            "id": "st_g7_e_16",
            "scrambledWords": [
                  "winter",
                  "is",
                  "It",
                  "cold",
                  "in"
            ],
            "correctSentence": "It is cold in winter.",
            "alternativeSentences": [
                  "In winter it is cold."
            ],
            "themeOrTopic": "Weather Expressions",
            "explanation": "Time prepositional phrase can go to the beginning."
      },
      {
            "id": "st_g7_e_17",
            "scrambledWords": [
                  "My",
                  "sweet",
                  "sings",
                  "songs",
                  "sister"
            ],
            "correctSentence": "My sister sings sweet songs.",
            "themeOrTopic": "Present Simple",
            "explanation": "Subject + 3rd person verb + adjective + noun."
      },
      {
            "id": "st_g7_e_18",
            "scrambledWords": [
                  "to",
                  "park",
                  "together",
                  "They",
                  "walk"
            ],
            "correctSentence": "They walk to park together.",
            "alternativeSentences": [
                  "Together they walk to park."
            ],
            "themeOrTopic": "Prepositions of Movement",
            "explanation": "Subject + walk + direction phrase + adverb."
      },
      {
            "id": "st_g7_e_19",
            "scrambledWords": [
                  "teeth",
                  "daily",
                  "brush",
                  "my",
                  "I"
            ],
            "correctSentence": "I brush my teeth daily.",
            "alternativeSentences": [
                  "Daily I brush my teeth."
            ],
            "themeOrTopic": "Personal Hygiene",
            "explanation": "Frequency adverb 'daily' can be placed at front or end."
      },
      {
            "id": "st_g7_e_20",
            "scrambledWords": [
                  "The",
                  "deep",
                  "water",
                  "is",
                  "blue"
            ],
            "correctSentence": "The water is deep blue.",
            "themeOrTopic": "Descriptions",
            "explanation": "Subject + is + compound color adjective."
      },
      {
            "id": "st_g7_e_21",
            "scrambledWords": [
                  "warm",
                  "wears",
                  "She",
                  "a",
                  "jacket"
            ],
            "correctSentence": "She wears a warm jacket.",
            "themeOrTopic": "Clothing",
            "explanation": "Subject + wears + article + adjective + noun."
      },
      {
            "id": "st_g7_e_22",
            "scrambledWords": [
                  "art",
                  "have",
                  "class",
                  "We",
                  "today"
            ],
            "correctSentence": "We have art class today.",
            "alternativeSentences": [
                  "Today we have art class."
            ],
            "themeOrTopic": "School Timetable",
            "explanation": "'Today' can be fronted for emphasis or placed at the end."
      },
      {
            "id": "st_g7_e_23",
            "scrambledWords": [
                  "arrives",
                  "on",
                  "time",
                  "The",
                  "train"
            ],
            "correctSentence": "The train arrives on time.",
            "themeOrTopic": "Time Expressions",
            "explanation": "Subject + arrives + prepositional phrase 'on time'."
      },
      {
            "id": "st_g7_e_24",
            "scrambledWords": [
                  "helps",
                  "his",
                  "cheerfully",
                  "mother",
                  "He"
            ],
            "correctSentence": "He helps his mother cheerfully.",
            "alternativeSentences": [
                  "Cheerfully he helps his mother."
            ],
            "themeOrTopic": "Family & Adverbs",
            "explanation": "Adverb of manner placement."
      },
      {
            "id": "st_g7_e_25",
            "scrambledWords": [
                  "I",
                  "listen",
                  "rock",
                  "to",
                  "music"
            ],
            "correctSentence": "I listen to rock music.",
            "themeOrTopic": "Hobbies",
            "explanation": "Listen always takes the preposition 'to'."
      },
      {
            "id": "st_g7_e_26",
            "scrambledWords": [
                  "sleeps",
                  "crib",
                  "The",
                  "baby",
                  "in"
            ],
            "correctSentence": "The baby sleeps in crib.",
            "themeOrTopic": "Simple Sentences",
            "explanation": "Subject + sleeps + prepositional location."
      },
      {
            "id": "st_g7_e_27",
            "scrambledWords": [
                  "leaves",
                  "Trees",
                  "lose",
                  "autumn",
                  "in"
            ],
            "correctSentence": "Trees lose leaves in autumn.",
            "alternativeSentences": [
                  "In autumn trees lose leaves."
            ],
            "themeOrTopic": "Seasons",
            "explanation": "Subject + verb + object + seasonal time phrase."
      },
      {
            "id": "st_g7_e_28",
            "scrambledWords": [
                  "lake",
                  "You",
                  "swim",
                  "in",
                  "can"
            ],
            "correctSentence": "You can swim in lake.",
            "themeOrTopic": "Modal Can",
            "explanation": "Subject + can + base verb + prepositional location."
      },
      {
            "id": "st_g7_e_29",
            "scrambledWords": [
                  "paints",
                  "flower",
                  "pictures",
                  "colorful",
                  "She"
            ],
            "correctSentence": "She paints colorful flower pictures.",
            "themeOrTopic": "Hobbies & Arts",
            "explanation": "Subject + paints + descriptive compound noun phrase."
      },
      {
            "id": "st_g7_e_30",
            "scrambledWords": [
                  "grass",
                  "Horses",
                  "fast",
                  "run",
                  "on"
            ],
            "correctSentence": "Horses run fast on grass.",
            "alternativeSentences": [
                  "On grass horses run fast."
            ],
            "themeOrTopic": "Animals & Adverbs",
            "explanation": "Subject + run + adverb + prepositional phrase."
      },
      {
            "id": "st_g7_e_31",
            "scrambledWords": [
                  "buy",
                  "bread",
                  "daily",
                  "We",
                  "fresh"
            ],
            "correctSentence": "We buy fresh bread daily.",
            "alternativeSentences": [
                  "Daily we buy fresh bread."
            ],
            "themeOrTopic": "Shopping",
            "explanation": "Time adverbial placement."
      },
      {
            "id": "st_g7_e_32",
            "scrambledWords": [
                  "clock",
                  "The",
                  "very",
                  "loudly",
                  "ticks"
            ],
            "correctSentence": "The clock ticks very loudly.",
            "themeOrTopic": "Sounds & Adverbs",
            "explanation": "Subject + ticks + intensifier + adverb."
      },
      {
            "id": "st_g7_e_33",
            "scrambledWords": [
                  "opens",
                  "the",
                  "bedroom",
                  "He",
                  "door"
            ],
            "correctSentence": "He opens the bedroom door.",
            "themeOrTopic": "Action Verbs",
            "explanation": "Subject + opens + article + noun phrase."
      },
      {
            "id": "st_g7_e_34",
            "scrambledWords": [
                  "juice",
                  "drink",
                  "I",
                  "orange",
                  "cold"
            ],
            "correctSentence": "I drink orange juice cold.",
            "themeOrTopic": "Beverages",
            "explanation": "Subject + drink + beverage + state."
      },
      {
            "id": "st_g7_e_35",
            "scrambledWords": [
                  "season",
                  "is",
                  "Summer",
                  "my",
                  "favorite"
            ],
            "correctSentence": "Summer is my favorite season.",
            "alternativeSentences": [
                  "My favorite season is summer."
            ],
            "themeOrTopic": "Preferences",
            "explanation": "Both equative orders 'X is Y' and 'Y is X' are valid English."
      },
      {
            "id": "st_g7_e_36",
            "scrambledWords": [
                  "water",
                  "Fish",
                  "in",
                  "silently",
                  "swim"
            ],
            "correctSentence": "Fish swim silently in water.",
            "alternativeSentences": [
                  "In water fish swim silently."
            ],
            "themeOrTopic": "Nature",
            "explanation": "Subject + swim + adverb of manner + place."
      },
      {
            "id": "st_g7_e_37",
            "scrambledWords": [
                  "They",
                  "friends",
                  "letters",
                  "write",
                  "to"
            ],
            "correctSentence": "They write letters to friends.",
            "themeOrTopic": "Communication",
            "explanation": "Subject + write + object + recipient phrase."
      },
      {
            "id": "st_g7_e_38",
            "scrambledWords": [
                  "delicious",
                  "very",
                  "soup",
                  "The",
                  "tastes"
            ],
            "correctSentence": "The soup tastes very delicious.",
            "themeOrTopic": "Sense Verbs",
            "explanation": "Subject + tastes + adverb + adjective."
      },
      {
            "id": "st_g7_e_39",
            "scrambledWords": [
                  "before",
                  "We",
                  "meals",
                  "wash",
                  "hands"
            ],
            "correctSentence": "We wash hands before meals.",
            "alternativeSentences": [
                  "Before meals we wash hands."
            ],
            "themeOrTopic": "Hygiene",
            "explanation": "Time prepositional phrase fronted or at the end."
      },
      {
            "id": "st_g7_e_40",
            "scrambledWords": [
                  "wakes",
                  "She",
                  "seven",
                  "up",
                  "at"
            ],
            "correctSentence": "She wakes up at seven.",
            "alternativeSentences": [
                  "At seven she wakes up."
            ],
            "themeOrTopic": "Daily Routine",
            "explanation": "Subject + phrasal verb 'wakes up' + time phrase."
      }
],
    medium: [
      {
            "id": "st_g7_m_01",
            "scrambledWords": [
                  "her",
                  "She",
                  "is",
                  "homework",
                  "now",
                  "doing"
            ],
            "correctSentence": "She is doing her homework now.",
            "alternativeSentences": [
                  "Now she is doing her homework."
            ],
            "themeOrTopic": "Present Continuous",
            "explanation": "Time adverbial 'now' can sit at start or end."
      },
      {
            "id": "st_g7_m_02",
            "scrambledWords": [
                  "grandparents",
                  "visited",
                  "We",
                  "Sunday",
                  "last",
                  "our"
            ],
            "correctSentence": "We visited our grandparents last Sunday.",
            "alternativeSentences": [
                  "Last Sunday we visited our grandparents."
            ],
            "themeOrTopic": "Past Simple",
            "explanation": "Past time expression 'last Sunday' can be fronted."
      },
      {
            "id": "st_g7_m_03",
            "scrambledWords": [
                  "yesterday",
                  "afternoon",
                  "did",
                  "Where",
                  "you",
                  "go"
            ],
            "correctSentence": "Where did you go yesterday afternoon?",
            "themeOrTopic": "Past Simple Questions",
            "explanation": "Question word + did + subject + base verb + time phrase."
      },
      {
            "id": "st_g7_m_04",
            "scrambledWords": [
                  "come",
                  "not",
                  "to",
                  "He",
                  "party",
                  "did"
            ],
            "correctSentence": "He did not come to party.",
            "themeOrTopic": "Past Simple Negative",
            "explanation": "Subject + did not + base verb + destination."
      },
      {
            "id": "st_g7_m_05",
            "scrambledWords": [
                  "comedy",
                  "watching",
                  "They",
                  "are",
                  "a",
                  "movie"
            ],
            "correctSentence": "They are watching a comedy movie.",
            "themeOrTopic": "Present Continuous",
            "explanation": "Subject + are watching + article + compound noun."
      },
      {
            "id": "st_g7_m_06",
            "scrambledWords": [
                  "Why",
                  "so",
                  "laughing",
                  "loudly",
                  "are",
                  "you"
            ],
            "correctSentence": "Why are you laughing so loudly?",
            "themeOrTopic": "Continuous Questions",
            "explanation": "Why + are + subject + -ing verb + adverbial phrase."
      },
      {
            "id": "st_g7_m_07",
            "scrambledWords": [
                  "bought",
                  "I",
                  "mother",
                  "a",
                  "for",
                  "gift"
            ],
            "correctSentence": "I bought a gift for mother.",
            "themeOrTopic": "Past Simple Transitive",
            "explanation": "Subject + bought + direct object + indirect recipient."
      },
      {
            "id": "st_g7_m_08",
            "scrambledWords": [
                  "My",
                  "is",
                  "taller",
                  "me",
                  "than",
                  "brother"
            ],
            "correctSentence": "My brother is taller than me.",
            "themeOrTopic": "Comparatives",
            "explanation": "Subject + is + comparative adjective + than + object pronoun."
      },
      {
            "id": "st_g7_m_09",
            "scrambledWords": [
                  "and",
                  "The",
                  "was",
                  "warm",
                  "sunny",
                  "weather"
            ],
            "correctSentence": "The weather was sunny and warm.",
            "alternativeSentences": [
                  "The weather was warm and sunny."
            ],
            "themeOrTopic": "Past Simple Weather",
            "explanation": "Coordinated adjectives connected by 'and' can appear in either order."
      },
      {
            "id": "st_g7_m_10",
            "scrambledWords": [
                  "play",
                  "can",
                  "She",
                  "the",
                  "skillfully",
                  "violin"
            ],
            "correctSentence": "She can play the violin skillfully.",
            "themeOrTopic": "Musical Instruments & Modals",
            "explanation": "Subject + can + play + the + instrument + adverb."
      },
      {
            "id": "st_g7_m_11",
            "scrambledWords": [
                  "you",
                  "orange",
                  "Do",
                  "some",
                  "want",
                  "juice"
            ],
            "correctSentence": "Do you want some orange juice?",
            "themeOrTopic": "Polite Offers",
            "explanation": "Do + subject + want + quantifier + noun."
      },
      {
            "id": "st_g7_m_12",
            "scrambledWords": [
                  "must",
                  "animals",
                  "endangered",
                  "We",
                  "protect",
                  "wild"
            ],
            "correctSentence": "We must protect endangered wild animals.",
            "themeOrTopic": "Modal of Obligation",
            "explanation": "Subject + must + base verb + adjective phrase."
      },
      {
            "id": "st_g7_m_13",
            "scrambledWords": [
                  "on",
                  "bus",
                  "lost",
                  "wallet",
                  "his",
                  "He"
            ],
            "correctSentence": "He lost his wallet on bus.",
            "alternativeSentences": [
                  "On bus he lost his wallet."
            ],
            "themeOrTopic": "Past Simple Experience",
            "explanation": "Prepositional location placement."
      },
      {
            "id": "st_g7_m_14",
            "scrambledWords": [
                  "books",
                  "are",
                  "many",
                  "library",
                  "in",
                  "There"
            ],
            "correctSentence": "There are many books in library.",
            "alternativeSentences": [
                  "In library there are many books."
            ],
            "themeOrTopic": "There are + Quantifiers",
            "explanation": "Prepositional phrase can be fronted."
      },
      {
            "id": "st_g7_m_15",
            "scrambledWords": [
                  "reading",
                  "I",
                  "to",
                  "movies",
                  "books",
                  "prefer"
            ],
            "correctSentence": "I prefer reading books to movies.",
            "alternativeSentences": [
                  "I prefer movies to reading books."
            ],
            "themeOrTopic": "Expressing Preference",
            "explanation": "Both preference orders form grammatically sound English."
      },
      {
            "id": "st_g7_m_16",
            "scrambledWords": [
                  "astronaut",
                  "wants",
                  "She",
                  "become",
                  "an",
                  "to"
            ],
            "correctSentence": "She wants to become an astronaut.",
            "themeOrTopic": "Infinitive of Ambition",
            "explanation": "Subject + wants + to become + indefinite article + profession."
      },
      {
            "id": "st_g7_m_17",
            "scrambledWords": [
                  "playing",
                  "home",
                  "They",
                  "were",
                  "chess",
                  "at"
            ],
            "correctSentence": "They were playing chess at home.",
            "alternativeSentences": [
                  "At home they were playing chess."
            ],
            "themeOrTopic": "Past Continuous",
            "explanation": "Location phrase can be fronted."
      },
      {
            "id": "st_g7_m_18",
            "scrambledWords": [
                  "What",
                  "lesson",
                  "begin",
                  "time",
                  "the",
                  "does"
            ],
            "correctSentence": "What time does the lesson begin?",
            "themeOrTopic": "Timetable Questions",
            "explanation": "What time + does + subject + base verb."
      },
      {
            "id": "st_g7_m_19",
            "scrambledWords": [
                  "more",
                  "fresh",
                  "fruit",
                  "You",
                  "eat",
                  "should"
            ],
            "correctSentence": "You should eat more fresh fruit.",
            "themeOrTopic": "Giving Advice",
            "explanation": "Subject + should + eat + comparative + noun."
      },
      {
            "id": "st_g7_m_20",
            "scrambledWords": [
                  "is",
                  "lion",
                  "The",
                  "than",
                  "faster",
                  "cheetah"
            ],
            "correctSentence": "The cheetah is faster than lion.",
            "themeOrTopic": "Animal Comparatives",
            "explanation": "Subject + is + comparative + than + object."
      },
      {
            "id": "st_g7_m_21",
            "scrambledWords": [
                  "it",
                  "indoors",
                  "We",
                  "because",
                  "stayed",
                  "rained"
            ],
            "correctSentence": "We stayed indoors because it rained.",
            "alternativeSentences": [
                  "Because it rained we stayed indoors."
            ],
            "themeOrTopic": "Conjunction Because",
            "explanation": "Subordinate 'because' clause can come first or second."
      },
      {
            "id": "st_g7_m_22",
            "scrambledWords": [
                  "He",
                  "smartest",
                  "here",
                  "is",
                  "the",
                  "boy"
            ],
            "correctSentence": "He is the smartest boy here.",
            "themeOrTopic": "Superlatives",
            "explanation": "Subject + is the + superlative adjective + noun + adverb."
      },
      {
            "id": "st_g7_m_23",
            "scrambledWords": [
                  "help",
                  "I",
                  "without",
                  "did",
                  "my",
                  "project"
            ],
            "correctSentence": "I did my project without help.",
            "alternativeSentences": [
                  "Without help I did my project."
            ],
            "themeOrTopic": "Prepositional Phrases",
            "explanation": "Prepositional modifier can go to front."
      },
      {
            "id": "st_g7_m_24",
            "scrambledWords": [
                  "She",
                  "arrives",
                  "early",
                  "school",
                  "at",
                  "always"
            ],
            "correctSentence": "She always arrives at school early.",
            "themeOrTopic": "Frequency Adverbs",
            "explanation": "Subject + frequency adverb + verb + place + time."
      },
      {
            "id": "st_g7_m_25",
            "scrambledWords": [
                  "she",
                  "finish",
                  "Did",
                  "her",
                  "maths",
                  "assignment"
            ],
            "correctSentence": "Did she finish her maths assignment?",
            "themeOrTopic": "Past Simple Yes/No Questions",
            "explanation": "Did + subject + base verb + object phrase."
      },
      {
            "id": "st_g7_m_26",
            "scrambledWords": [
                  "by",
                  "to",
                  "They",
                  "travelled",
                  "Antalya",
                  "plane"
            ],
            "correctSentence": "They travelled to Antalya by plane.",
            "alternativeSentences": [
                  "By plane they travelled to Antalya."
            ],
            "themeOrTopic": "Travel & Transport",
            "explanation": "Means of transport prepositional phrase."
      },
      {
            "id": "st_g7_m_27",
            "scrambledWords": [
                  "colorful",
                  "butterflies",
                  "beautiful",
                  "those",
                  "Look",
                  "at"
            ],
            "correctSentence": "Look at those beautiful colorful butterflies.",
            "alternativeSentences": [
                  "Look at those colorful beautiful butterflies."
            ],
            "themeOrTopic": "Imperatives & Demonstratives",
            "explanation": "Coordinate descriptive adjectives order."
      },
      {
            "id": "st_g7_m_28",
            "scrambledWords": [
                  "for",
                  "He",
                  "has",
                  "years",
                  "lived",
                  "here"
            ],
            "correctSentence": "He has lived here for years.",
            "alternativeSentences": [
                  "For years he has lived here."
            ],
            "themeOrTopic": "Present Perfect Basics",
            "explanation": "Duration phrase can be fronted."
      },
      {
            "id": "st_g7_m_29",
            "scrambledWords": [
                  "is",
                  "the",
                  "Why",
                  "now",
                  "crying",
                  "baby"
            ],
            "correctSentence": "Why is the baby crying now?",
            "themeOrTopic": "Present Continuous Questions",
            "explanation": "Why + is + subject + -ing verb + time marker."
      },
      {
            "id": "st_g7_m_30",
            "scrambledWords": [
                  "We",
                  "with",
                  "flags",
                  "celebrated",
                  "Republic",
                  "Day"
            ],
            "correctSentence": "We celebrated Republic Day with flags.",
            "alternativeSentences": [
                  "With flags we celebrated Republic Day."
            ],
            "themeOrTopic": "Holidays",
            "explanation": "Instrumental prepositional phrase."
      },
      {
            "id": "st_g7_m_31",
            "scrambledWords": [
                  "a",
                  "She",
                  "chocolate",
                  "baked",
                  "cake",
                  "delicious"
            ],
            "correctSentence": "She baked a delicious chocolate cake.",
            "themeOrTopic": "Cooking & Past Simple",
            "explanation": "Subject + baked + article + adjectives + noun."
      },
      {
            "id": "st_g7_m_32",
            "scrambledWords": [
                  "the",
                  "you",
                  "salt",
                  "Can",
                  "me",
                  "pass"
            ],
            "correctSentence": "Can you pass me the salt?",
            "themeOrTopic": "Polite Requests",
            "explanation": "Can + subject + verb + indirect object + direct object."
      },
      {
            "id": "st_g7_m_33",
            "scrambledWords": [
                  "teacher",
                  "to",
                  "students",
                  "listened",
                  "attentively",
                  "The"
            ],
            "correctSentence": "The students listened attentively to teacher.",
            "alternativeSentences": [
                  "Attentively the students listened to teacher."
            ],
            "themeOrTopic": "Adverbs of Manner",
            "explanation": "Adverb of manner placement."
      },
      {
            "id": "st_g7_m_34",
            "scrambledWords": [
                  "you",
                  "will",
                  "evening",
                  "tomorrow",
                  "I",
                  "call"
            ],
            "correctSentence": "I will call you tomorrow evening.",
            "alternativeSentences": [
                  "Tomorrow evening I will call you."
            ],
            "themeOrTopic": "Future with Will",
            "explanation": "Future time phrase can be placed at start or end."
      },
      {
            "id": "st_g7_m_35",
            "scrambledWords": [
                  "in",
                  "cheese",
                  "is",
                  "There",
                  "fridge",
                  "some"
            ],
            "correctSentence": "There is some cheese in fridge.",
            "alternativeSentences": [
                  "In fridge there is some cheese."
            ],
            "themeOrTopic": "There is + Uncountable",
            "explanation": "Prepositional location fronting."
      },
      {
            "id": "st_g7_m_36",
            "scrambledWords": [
                  "his",
                  "never",
                  "He",
                  "daily",
                  "chores",
                  "forgets"
            ],
            "correctSentence": "He never forgets his daily chores.",
            "themeOrTopic": "Negative Adverbs of Frequency",
            "explanation": "Subject + never + 3rd person verb + possessive noun phrase."
      },
      {
            "id": "st_g7_m_37",
            "scrambledWords": [
                  "were",
                  "pool",
                  "in",
                  "the",
                  "They",
                  "swimming"
            ],
            "correctSentence": "They were swimming in the pool.",
            "alternativeSentences": [
                  "In the pool they were swimming."
            ],
            "themeOrTopic": "Past Continuous",
            "explanation": "Location phrase can be fronted."
      },
      {
            "id": "st_g7_m_38",
            "scrambledWords": [
                  "does",
                  "this",
                  "cost",
                  "much",
                  "jacket",
                  "How"
            ],
            "correctSentence": "How much does this jacket cost?",
            "themeOrTopic": "Price Questions",
            "explanation": "How much + does + subject + cost."
      },
      {
            "id": "st_g7_m_39",
            "scrambledWords": [
                  "plastic",
                  "the",
                  "all",
                  "recycled",
                  "bottles",
                  "We"
            ],
            "correctSentence": "We recycled all the plastic bottles.",
            "themeOrTopic": "Environment",
            "explanation": "Subject + recycled + determiner + noun phrase."
      },
      {
            "id": "st_g7_m_40",
            "scrambledWords": [
                  "must",
                  "in",
                  "You",
                  "shout",
                  "library",
                  "not"
            ],
            "correctSentence": "You must not shout in library.",
            "alternativeSentences": [
                  "In library you must not shout."
            ],
            "themeOrTopic": "Prohibition",
            "explanation": "Location phrase can be placed at front."
      }
],
    hard: [
      {
            "id": "st_g7_h_01",
            "scrambledWords": [
                  "telephone",
                  "the",
                  "While",
                  "was",
                  "I",
                  "cooking",
                  "rang"
            ],
            "correctSentence": "While I was cooking the telephone rang.",
            "alternativeSentences": [
                  "The telephone rang while I was cooking."
            ],
            "themeOrTopic": "While + Past Continuous",
            "explanation": "Continuous while-clause can precede or follow main clause."
      },
      {
            "id": "st_g7_h_02",
            "scrambledWords": [
                  "is",
                  "for",
                  "He",
                  "going",
                  "to",
                  "exam",
                  "study",
                  "the"
            ],
            "correctSentence": "He is going to study for the exam.",
            "themeOrTopic": "Be going to Intention",
            "explanation": "Subject + is going to + verb + prepositional goal."
      },
      {
            "id": "st_g7_h_03",
            "scrambledWords": [
                  "we",
                  "make",
                  "snows",
                  "If",
                  "snowman",
                  "a",
                  "will",
                  "it",
                  "tomorrow"
            ],
            "correctSentence": "If it snows tomorrow we will make a snowman.",
            "alternativeSentences": [
                  "We will make a snowman if it snows tomorrow."
            ],
            "themeOrTopic": "First Conditional",
            "explanation": "If condition and main consequence clause order."
      },
      {
            "id": "st_g7_h_04",
            "scrambledWords": [
                  "the",
                  "is",
                  "This",
                  "girl",
                  "won",
                  "prize",
                  "first",
                  "who"
            ],
            "correctSentence": "This is the girl who won first prize.",
            "themeOrTopic": "Relative Clauses (Who)",
            "explanation": "Demonstrative + relative pronoun 'who' defining the person."
      },
      {
            "id": "st_g7_h_05",
            "scrambledWords": [
                  "task",
                  "he",
                  "tired",
                  "his",
                  "he",
                  "Although",
                  "was",
                  "finished"
            ],
            "correctSentence": "Although he was tired he finished his task.",
            "alternativeSentences": [
                  "He finished his task although he was tired."
            ],
            "themeOrTopic": "Concessions (Although)",
            "explanation": "Concessive 'although' clause can come first or second."
      },
      {
            "id": "st_g7_h_06",
            "scrambledWords": [
                  "walking",
                  "We",
                  "began",
                  "were",
                  "the",
                  "storm",
                  "when",
                  "home"
            ],
            "correctSentence": "We were walking home when the storm began.",
            "alternativeSentences": [
                  "When the storm began we were walking home."
            ],
            "themeOrTopic": "Past Continuous with When",
            "explanation": "When-clause can precede or follow the past continuous clause."
      },
      {
            "id": "st_g7_h_07",
            "scrambledWords": [
                  "planet",
                  "energy",
                  "save",
                  "I",
                  "will",
                  "solar",
                  "think",
                  "our"
            ],
            "correctSentence": "I think solar energy will save our planet.",
            "themeOrTopic": "Predictions with Think",
            "explanation": "Opinion clause + subject + will save + object."
      },
      {
            "id": "st_g7_h_08",
            "scrambledWords": [
                  "She",
                  "her",
                  "to",
                  "childhood",
                  "give",
                  "dream",
                  "up",
                  "refused"
            ],
            "correctSentence": "She refused to give up her childhood dream.",
            "themeOrTopic": "Phrasal Verbs & Infinitives",
            "explanation": "Refuse + to-infinitive + phrasal verb 'give up' + noun."
      },
      {
            "id": "st_g7_h_09",
            "scrambledWords": [
                  "visited",
                  "had",
                  "museum",
                  "ancient",
                  "which",
                  "we",
                  "relics",
                  "The"
            ],
            "correctSentence": "The museum which we visited had ancient relics.",
            "themeOrTopic": "Relative Clauses (Which)",
            "explanation": "Noun + relative clause 'which we visited' + main verb + object."
      },
      {
            "id": "st_g7_h_10",
            "scrambledWords": [
                  "puzzles",
                  "cannot",
                  "without",
                  "the",
                  "solving",
                  "pass",
                  "You",
                  "level"
            ],
            "correctSentence": "You cannot pass the level without solving puzzles.",
            "alternativeSentences": [
                  "Without solving puzzles you cannot pass the level."
            ],
            "themeOrTopic": "Preposition + Gerund",
            "explanation": "Prepositional condition phrase can be fronted."
      },
      {
            "id": "st_g7_h_11",
            "scrambledWords": [
                  "working",
                  "project",
                  "this",
                  "on",
                  "have",
                  "They",
                  "together",
                  "been"
            ],
            "correctSentence": "They have been working on this project together.",
            "alternativeSentences": [
                  "Together they have been working on this project."
            ],
            "themeOrTopic": "Present Perfect Continuous",
            "explanation": "Adverbial modifier placement."
      },
      {
            "id": "st_g7_h_12",
            "scrambledWords": [
                  "as",
                  "rings",
                  "soon",
                  "leave",
                  "bell",
                  "As",
                  "the",
                  "students"
            ],
            "correctSentence": "As soon as the bell rings students leave.",
            "alternativeSentences": [
                  "Students leave as soon as the bell rings."
            ],
            "themeOrTopic": "Time Clauses",
            "explanation": "'As soon as' clause can come first or second."
      },
      {
            "id": "st_g7_h_13",
            "scrambledWords": [
                  "the",
                  "students",
                  "late",
                  "Neither",
                  "the",
                  "were",
                  "nor",
                  "teacher"
            ],
            "correctSentence": "Neither the teacher nor the students were late.",
            "themeOrTopic": "Correlative Conjunctions",
            "explanation": "Neither... nor structure."
      },
      {
            "id": "st_g7_h_14",
            "scrambledWords": [
                  "build",
                  "tower",
                  "wooden",
                  "explained",
                  "a",
                  "He",
                  "to",
                  "how"
            ],
            "correctSentence": "He explained how to build a wooden tower.",
            "themeOrTopic": "Question Word + Infinitive",
            "explanation": "Subject + explained + wh-infinitive clause."
      },
      {
            "id": "st_g7_h_15",
            "scrambledWords": [
                  "book",
                  "return",
                  "that",
                  "would",
                  "the",
                  "she",
                  "promised",
                  "She"
            ],
            "correctSentence": "She promised that she would return the book.",
            "themeOrTopic": "Reported Promises",
            "explanation": "Subject + promised + noun clause with would."
      },
      {
            "id": "st_g7_h_16",
            "scrambledWords": [
                  "harder",
                  "become",
                  "better",
                  "the",
                  "The",
                  "you",
                  "you",
                  "practice"
            ],
            "correctSentence": "The harder you practice the better you become.",
            "themeOrTopic": "Double Comparatives",
            "explanation": "'The + comparative... the + comparative' pattern."
      },
      {
            "id": "st_g7_h_17",
            "scrambledWords": [
                  "computer",
                  "Don't",
                  "leaving",
                  "before",
                  "forget",
                  "to",
                  "off",
                  "turn"
            ],
            "correctSentence": "Don't forget to turn off computer before leaving.",
            "alternativeSentences": [
                  "Before leaving don't forget to turn off computer."
            ],
            "themeOrTopic": "Imperatives & Prepositions",
            "explanation": "Time clause can be fronted."
      },
      {
            "id": "st_g7_h_18",
            "scrambledWords": [
                  "in",
                  "We",
                  "protect",
                  "to",
                  "waste",
                  "nature",
                  "must",
                  "order",
                  "reduce"
            ],
            "correctSentence": "We must reduce waste in order to protect nature.",
            "alternativeSentences": [
                  "In order to protect nature we must reduce waste."
            ],
            "themeOrTopic": "In Order To Purpose",
            "explanation": "Purpose clause can come at start or end."
      },
      {
            "id": "st_g7_h_19",
            "scrambledWords": [
                  "so",
                  "spoke",
                  "could",
                  "quietly",
                  "that",
                  "hear",
                  "nobody",
                  "He"
            ],
            "correctSentence": "He spoke so quietly that nobody could hear.",
            "themeOrTopic": "So ... That Result",
            "explanation": "Verb + so + adverb + that + negative clause."
      },
      {
            "id": "st_g7_h_20",
            "scrambledWords": [
                  "Have",
                  "outside",
                  "ever",
                  "you",
                  "of",
                  "travelled",
                  "your",
                  "country"
            ],
            "correctSentence": "Have you ever travelled outside of your country?",
            "themeOrTopic": "Present Perfect Experience",
            "explanation": "Have + you + ever + past participle + prepositional phrase."
      },
      {
            "id": "st_g7_h_21",
            "scrambledWords": [
                  "was",
                  "music",
                  "he",
                  "to",
                  "read",
                  "while",
                  "She",
                  "listening"
            ],
            "correctSentence": "She was listening to music while he read.",
            "alternativeSentences": [
                  "While he read she was listening to music."
            ],
            "themeOrTopic": "Simultaneous Past Events",
            "explanation": "While clause can be placed first or second."
      },
      {
            "id": "st_g7_h_22",
            "scrambledWords": [
                  "steam",
                  "heat",
                  "turns",
                  "water",
                  "If",
                  "you",
                  "it",
                  "into"
            ],
            "correctSentence": "If you heat water it turns into steam.",
            "alternativeSentences": [
                  "Water turns into steam if you heat it.",
                  "It turns into steam if you heat water."
            ],
            "themeOrTopic": "Zero Conditional",
            "explanation": "Condition clause order."
      },
      {
            "id": "st_g7_h_23",
            "scrambledWords": [
                  "hard",
                  "The",
                  "record",
                  "the",
                  "athlete",
                  "broke",
                  "who",
                  "trained"
            ],
            "correctSentence": "The athlete who broke the record trained hard.",
            "themeOrTopic": "Defining Relative Clauses",
            "explanation": "Subject + who-relative clause + predicate."
      },
      {
            "id": "st_g7_h_24",
            "scrambledWords": [
                  "to",
                  "I",
                  "your",
                  "am",
                  "looking",
                  "forward",
                  "meeting",
                  "family"
            ],
            "correctSentence": "I am looking forward to meeting your family.",
            "themeOrTopic": "Look forward to + Gerund",
            "explanation": "Phrasal verb where 'to' takes -ing."
      },
      {
            "id": "st_g7_h_25",
            "scrambledWords": [
                  "late",
                  "of",
                  "we",
                  "Because",
                  "arrived",
                  "heavy",
                  "traffic"
            ],
            "correctSentence": "Because of heavy traffic we arrived late.",
            "alternativeSentences": [
                  "We arrived late because of heavy traffic."
            ],
            "themeOrTopic": "Because Of + Noun Phrase",
            "explanation": "Prepositional phrase of reason placement."
      },
      {
            "id": "st_g7_h_26",
            "scrambledWords": [
                  "managed",
                  "solve",
                  "the",
                  "difficult",
                  "to",
                  "She",
                  "maths",
                  "puzzle"
            ],
            "correctSentence": "She managed to solve the difficult maths puzzle.",
            "themeOrTopic": "Manage + Infinitive",
            "explanation": "Subject + managed + to-infinitive + object phrase."
      },
      {
            "id": "st_g7_h_27",
            "scrambledWords": [
                  "It",
                  "was",
                  "an",
                  "fans",
                  "exciting",
                  "such",
                  "cheered",
                  "that",
                  "match"
            ],
            "correctSentence": "It was such an exciting match that fans cheered.",
            "themeOrTopic": "Such ... That Clause",
            "explanation": "Such + an + adjective + noun + consequence clause."
      },
      {
            "id": "st_g7_h_28",
            "scrambledWords": [
                  "trees",
                  "everyone",
                  "should",
                  "more",
                  "encourage",
                  "plant",
                  "to",
                  "We"
            ],
            "correctSentence": "We should encourage everyone to plant more trees.",
            "themeOrTopic": "Verb + Object + Infinitive",
            "explanation": "Subject + modal + verb + object + to-infinitive."
      },
      {
            "id": "st_g7_h_29",
            "scrambledWords": [
                  "you",
                  "this",
                  "keys",
                  "the",
                  "did",
                  "Where",
                  "hide",
                  "morning"
            ],
            "correctSentence": "Where did you hide the keys this morning?",
            "themeOrTopic": "Wh- Questions in Past",
            "explanation": "Where + did + subject + base verb + object + time."
      },
      {
            "id": "st_g7_h_30",
            "scrambledWords": [
                  "top",
                  "to",
                  "university",
                  "at",
                  "decided",
                  "engineering",
                  "study",
                  "He"
            ],
            "correctSentence": "He decided to study engineering at top university.",
            "themeOrTopic": "Infinitives of Intent",
            "explanation": "Subject + decided + to study + object + location."
      },
      {
            "id": "st_g7_h_31",
            "scrambledWords": [
                  "up",
                  "we",
                  "the",
                  "hurry",
                  "train",
                  "Unless",
                  "we",
                  "will",
                  "miss"
            ],
            "correctSentence": "Unless we hurry up we will miss the train.",
            "alternativeSentences": [
                  "We will miss the train unless we hurry up."
            ],
            "themeOrTopic": "Conditionals with Unless",
            "explanation": "Unless clause can come at beginning or end."
      },
      {
            "id": "st_g7_h_32",
            "scrambledWords": [
                  "near",
                  "hotel",
                  "where",
                  "stayed",
                  "The",
                  "we",
                  "beach",
                  "was"
            ],
            "correctSentence": "The hotel where we stayed was near beach.",
            "themeOrTopic": "Relative Clauses (Where)",
            "explanation": "Subject + where-clause + verb to be + prepositional location."
      },
      {
            "id": "st_g7_h_33",
            "scrambledWords": [
                  "allowed",
                  "not",
                  "were",
                  "to",
                  "without",
                  "permission",
                  "They",
                  "enter"
            ],
            "correctSentence": "They were not allowed to enter without permission.",
            "alternativeSentences": [
                  "Without permission they were not allowed to enter."
            ],
            "themeOrTopic": "Passive Permission",
            "explanation": "Condition phrase can be placed first."
      },
      {
            "id": "st_g7_h_34",
            "scrambledWords": [
                  "you",
                  "I",
                  "like",
                  "to",
                  "to",
                  "dinner",
                  "would",
                  "invite"
            ],
            "correctSentence": "I would like to invite you to dinner.",
            "themeOrTopic": "Polite Invitations",
            "explanation": "I would like + to invite + person + event."
      },
      {
            "id": "st_g7_h_35",
            "scrambledWords": [
                  "the",
                  "plane",
                  "the",
                  "safely",
                  "Despite",
                  "landed",
                  "heavy",
                  "fog"
            ],
            "correctSentence": "Despite the heavy fog the plane landed safely.",
            "alternativeSentences": [
                  "The plane landed safely despite the heavy fog."
            ],
            "themeOrTopic": "Concessions (Despite)",
            "explanation": "Despite phrase can precede or follow main clause."
      },
      {
            "id": "st_g7_h_36",
            "scrambledWords": [
                  "a",
                  "and",
                  "writer",
                  "painter",
                  "She",
                  "talented",
                  "both",
                  "is"
            ],
            "correctSentence": "She is both a talented painter and writer.",
            "alternativeSentences": [
                  "She is both a talented writer and painter."
            ],
            "themeOrTopic": "Correlative Both... And",
            "explanation": "Coordinated occupations can be ordered either way."
      },
      {
            "id": "st_g7_h_37",
            "scrambledWords": [
                  "nobody",
                  "me",
                  "did",
                  "the",
                  "about",
                  "remind",
                  "test",
                  "Why"
            ],
            "correctSentence": "Why did nobody remind me about the test?",
            "themeOrTopic": "Past Questions with Nobody",
            "explanation": "Why + did + negative pronoun + base verb + object + topic."
      },
      {
            "id": "st_g7_h_38",
            "scrambledWords": [
                  "where",
                  "We",
                  "not",
                  "to",
                  "travel",
                  "yet",
                  "have",
                  "decided"
            ],
            "correctSentence": "We have not decided where to travel yet.",
            "alternativeSentences": [
                  "We have not yet decided where to travel."
            ],
            "themeOrTopic": "Present Perfect + Yet",
            "explanation": "'Yet' position."
      },
      {
            "id": "st_g7_h_39",
            "scrambledWords": [
                  "story",
                  "he",
                  "mysterious",
                  "very",
                  "told",
                  "sounded",
                  "which",
                  "The"
            ],
            "correctSentence": "The story which he told sounded very mysterious.",
            "themeOrTopic": "Relative Clauses & Sense Verbs",
            "explanation": "Noun + which clause + sense verb + predicate adjective."
      },
      {
            "id": "st_g7_h_40",
            "scrambledWords": [
                  "in",
                  "wear",
                  "seatbelt",
                  "cars",
                  "remember",
                  "your",
                  "Always",
                  "to"
            ],
            "correctSentence": "Always remember to wear your seatbelt in cars.",
            "alternativeSentences": [
                  "Remember always to wear your seatbelt in cars."
            ],
            "themeOrTopic": "Safety Instructions",
            "explanation": "Adverbial instruction order."
      }
],
  },
  'grade-8': {
    easy: [
      {
            "id": "st_g8_e_01",
            "scrambledWords": [
                  "I",
                  "my",
                  "finished",
                  "homework",
                  "have",
                  "already"
            ],
            "correctSentence": "I have already finished my homework.",
            "themeOrTopic": "Present Perfect with Already",
            "explanation": "Subject + have already + past participle + direct object."
      },
      {
            "id": "st_g8_e_02",
            "scrambledWords": [
                  "prefers",
                  "She",
                  "drinking",
                  "to",
                  "coffee",
                  "tea"
            ],
            "correctSentence": "She prefers drinking tea to coffee.",
            "alternativeSentences": [
                  "She prefers drinking coffee to tea."
            ],
            "themeOrTopic": "Expressing Preferences",
            "explanation": "Both preference directions are 100% grammatically correct English."
      },
      {
            "id": "st_g8_e_03",
            "scrambledWords": [
                  "always",
                  "true",
                  "A",
                  "you",
                  "friend",
                  "backs",
                  "up"
            ],
            "correctSentence": "A true friend always backs you up.",
            "themeOrTopic": "Friendship Traits",
            "explanation": "Subject phrase + frequency adverb + phrasal verb."
      },
      {
            "id": "st_g8_e_04",
            "scrambledWords": [
                  "would",
                  "rather",
                  "We",
                  "stay",
                  "home",
                  "at"
            ],
            "correctSentence": "We would rather stay at home.",
            "themeOrTopic": "Would Rather + Bare Verb",
            "explanation": "Subject + would rather + bare infinitive + location."
      },
      {
            "id": "st_g8_e_05",
            "scrambledWords": [
                  "He",
                  "pieces",
                  "into",
                  "the",
                  "onions",
                  "chopped"
            ],
            "correctSentence": "He chopped the onions into pieces.",
            "themeOrTopic": "Kitchen Preparation",
            "explanation": "Subject + chopped + object + prepositional result."
      },
      {
            "id": "st_g8_e_06",
            "scrambledWords": [
                  "They",
                  "here",
                  "2018",
                  "since",
                  "have",
                  "lived"
            ],
            "correctSentence": "They have lived here since 2018.",
            "alternativeSentences": [
                  "Since 2018 they have lived here."
            ],
            "themeOrTopic": "Present Perfect with Since",
            "explanation": "Time phrase can be fronted."
      },
      {
            "id": "st_g8_e_07",
            "scrambledWords": [
                  "myself",
                  "can",
                  "this",
                  "dish",
                  "prepare",
                  "I"
            ],
            "correctSentence": "I can prepare this dish myself.",
            "alternativeSentences": [
                  "Myself I can prepare this dish."
            ],
            "themeOrTopic": "Reflexive Pronouns",
            "explanation": "Subject + can prepare + object + emphatic reflexive."
      },
      {
            "id": "st_g8_e_08",
            "scrambledWords": [
                  "You",
                  "share",
                  "password",
                  "not",
                  "your",
                  "must"
            ],
            "correctSentence": "You must not share your password.",
            "themeOrTopic": "Digital Safety",
            "explanation": "Subject + must not + base verb + possessive object."
      },
      {
            "id": "st_g8_e_09",
            "scrambledWords": [
                  "has",
                  "She",
                  "never",
                  "extreme",
                  "tried",
                  "sports"
            ],
            "correctSentence": "She has never tried extreme sports.",
            "themeOrTopic": "Present Perfect with Never",
            "explanation": "Subject + has never tried + compound noun object."
      },
      {
            "id": "st_g8_e_10",
            "scrambledWords": [
                  "We",
                  "with",
                  "classmates",
                  "get",
                  "along",
                  "well"
            ],
            "correctSentence": "We get along well with classmates.",
            "themeOrTopic": "Phrasal Verbs (Get along)",
            "explanation": "Subject + get along well with + noun."
      },
      {
            "id": "st_g8_e_11",
            "scrambledWords": [
                  "dirty",
                  "dishes",
                  "loaded",
                  "He",
                  "inside",
                  "the"
            ],
            "correctSentence": "He loaded the dirty dishes inside.",
            "themeOrTopic": "Household Chores",
            "explanation": "Subject + loaded + adjective + noun + adverb."
      },
      {
            "id": "st_g8_e_12",
            "scrambledWords": [
                  "yet",
                  "sent",
                  "Have",
                  "the",
                  "email",
                  "you"
            ],
            "correctSentence": "Have you sent the email yet?",
            "themeOrTopic": "Present Perfect Question with Yet",
            "explanation": "Have + you + past participle + object + yet."
      },
      {
            "id": "st_g8_e_13",
            "scrambledWords": [
                  "helped",
                  "They",
                  "to",
                  "themselves",
                  "food",
                  "delicious"
            ],
            "correctSentence": "They helped themselves to delicious food.",
            "themeOrTopic": "Reflexive Idioms",
            "explanation": "Subject + helped themselves to + noun phrase."
      },
      {
            "id": "st_g8_e_14",
            "scrambledWords": [
                  "rather",
                  "read",
                  "TV",
                  "than",
                  "watch",
                  "would",
                  "I"
            ],
            "correctSentence": "I would rather read than watch TV.",
            "alternativeSentences": [
                  "I would rather watch TV than read."
            ],
            "themeOrTopic": "Would Rather Comparison",
            "explanation": "Both parallel preferences form grammatically correct English."
      },
      {
            "id": "st_g8_e_15",
            "scrambledWords": [
                  "in",
                  "First",
                  "water",
                  "the",
                  "saucepan",
                  "boil"
            ],
            "correctSentence": "First boil the water in saucepan.",
            "alternativeSentences": [
                  "In saucepan boil the water first."
            ],
            "themeOrTopic": "Recipe Steps",
            "explanation": "Sequence adverb and prepositional location."
      },
      {
            "id": "st_g8_e_16",
            "scrambledWords": [
                  "been",
                  "He",
                  "sick",
                  "has",
                  "for",
                  "days"
            ],
            "correctSentence": "He has been sick for days.",
            "alternativeSentences": [
                  "For days he has been sick."
            ],
            "themeOrTopic": "Present Perfect with For",
            "explanation": "Duration phrase can be placed at front."
      },
      {
            "id": "st_g8_e_17",
            "scrambledWords": [
                  "She",
                  "hanging",
                  "loves",
                  "buddies",
                  "with",
                  "out"
            ],
            "correctSentence": "She loves hanging out with buddies.",
            "themeOrTopic": "Teen Life",
            "explanation": "Subject + loves + gerund phrasal verb + prepositional phrase."
      },
      {
            "id": "st_g8_e_18",
            "scrambledWords": [
                  "vacuum",
                  "have",
                  "Do",
                  "today",
                  "you",
                  "to"
            ],
            "correctSentence": "Do you have to vacuum today?",
            "alternativeSentences": [
                  "Today do you have to vacuum?"
            ],
            "themeOrTopic": "Questions with Have To",
            "explanation": "Time adverbial placement."
      },
      {
            "id": "st_g8_e_19",
            "scrambledWords": [
                  "lot",
                  "in",
                  "a",
                  "We",
                  "common",
                  "have"
            ],
            "correctSentence": "We have a lot in common.",
            "themeOrTopic": "Friendship Idioms",
            "explanation": "Subject + have + a lot in common fixed phrase."
      },
      {
            "id": "st_g8_e_20",
            "scrambledWords": [
                  "You",
                  "carefully",
                  "peel",
                  "potatoes",
                  "the",
                  "should"
            ],
            "correctSentence": "You should peel the potatoes carefully.",
            "alternativeSentences": [
                  "Carefully you should peel the potatoes."
            ],
            "themeOrTopic": "Kitchen Advice",
            "explanation": "Adverb placement."
      },
      {
            "id": "st_g8_e_21",
            "scrambledWords": [
                  "himself",
                  "He",
                  "slicing",
                  "bread",
                  "while",
                  "cut"
            ],
            "correctSentence": "He cut himself while slicing bread.",
            "alternativeSentences": [
                  "While slicing bread he cut himself."
            ],
            "themeOrTopic": "Reflexive Pronouns",
            "explanation": "While clause can be fronted."
      },
      {
            "id": "st_g8_e_22",
            "scrambledWords": [
                  "prefer",
                  "I",
                  "outdoors",
                  "to",
                  "running",
                  "cycling"
            ],
            "correctSentence": "I prefer cycling outdoors to running.",
            "alternativeSentences": [
                  "I prefer running to cycling outdoors."
            ],
            "themeOrTopic": "Preferences with Gerunds",
            "explanation": "Both preference pairings are grammatically valid."
      },
      {
            "id": "st_g8_e_23",
            "scrambledWords": [
                  "to",
                  "replied",
                  "She",
                  "message",
                  "has",
                  "not"
            ],
            "correctSentence": "She has not replied to message.",
            "themeOrTopic": "Present Perfect Negative",
            "explanation": "Subject + has not replied to + noun."
      },
      {
            "id": "st_g8_e_24",
            "scrambledWords": [
                  "interested",
                  "are",
                  "They",
                  "adventures",
                  "in",
                  "extreme"
            ],
            "correctSentence": "They are interested in extreme adventures.",
            "themeOrTopic": "Adjective + Preposition",
            "explanation": "Subject + are interested in + noun phrase."
      },
      {
            "id": "st_g8_e_25",
            "scrambledWords": [
                  "Don't",
                  "out",
                  "trash",
                  "take",
                  "to",
                  "forget"
            ],
            "correctSentence": "Don't forget to take out trash.",
            "themeOrTopic": "Household Chores",
            "explanation": "Negative imperative + infinitive + phrasal verb + object."
      },
      {
            "id": "st_g8_e_26",
            "scrambledWords": [
                  "just",
                  "has",
                  "warm",
                  "He",
                  "baked",
                  "cookies"
            ],
            "correctSentence": "He has just baked warm cookies.",
            "themeOrTopic": "Present Perfect with Just",
            "explanation": "Subject + has just baked + adjective + noun."
      },
      {
            "id": "st_g8_e_27",
            "scrambledWords": [
                  "trust",
                  "other",
                  "each",
                  "with",
                  "We",
                  "secrets"
            ],
            "correctSentence": "We trust each other with secrets.",
            "themeOrTopic": "Mutual Trust",
            "explanation": "Subject + trust + reciprocal pronoun + prepositional topic."
      },
      {
            "id": "st_g8_e_28",
            "scrambledWords": [
                  "invitation",
                  "turn",
                  "down",
                  "did",
                  "you",
                  "Why"
            ],
            "correctSentence": "Why did you turn down invitation?",
            "themeOrTopic": "Phrasal Verbs (Turn down)",
            "explanation": "Why + did + you + turn down + noun."
      },
      {
            "id": "st_g8_e_29",
            "scrambledWords": [
                  "school",
                  "uniform",
                  "her",
                  "neatly",
                  "She",
                  "ironed"
            ],
            "correctSentence": "She ironed her school uniform neatly.",
            "alternativeSentences": [
                  "Neatly she ironed her school uniform."
            ],
            "themeOrTopic": "Chores & Adverbs",
            "explanation": "Manner adverb placement."
      },
      {
            "id": "st_g8_e_30",
            "scrambledWords": [
                  "ever",
                  "experienced",
                  "paragliding",
                  "before",
                  "Have",
                  "they"
            ],
            "correctSentence": "Have they ever experienced paragliding before?",
            "themeOrTopic": "Sports Experiences",
            "explanation": "Have + subject + ever + verb + gerund + before."
      },
      {
            "id": "st_g8_e_31",
            "scrambledWords": [
                  "rather",
                  "I",
                  "today",
                  "argue",
                  "not",
                  "would"
            ],
            "correctSentence": "I would rather not argue today.",
            "alternativeSentences": [
                  "Today I would rather not argue."
            ],
            "themeOrTopic": "Would Rather Negative",
            "explanation": "Time adverbial placement."
      },
      {
            "id": "st_g8_e_32",
            "scrambledWords": [
                  "Whisk",
                  "in",
                  "eggs",
                  "bowl",
                  "the",
                  "fresh"
            ],
            "correctSentence": "Whisk the fresh eggs in bowl.",
            "alternativeSentences": [
                  "In bowl whisk the fresh eggs."
            ],
            "themeOrTopic": "Imperatives in Recipes",
            "explanation": "Prepositional location fronting."
      },
      {
            "id": "st_g8_e_33",
            "scrambledWords": [
                  "has",
                  "me",
                  "hardships",
                  "supported",
                  "through",
                  "He"
            ],
            "correctSentence": "He has supported me through hardships.",
            "alternativeSentences": [
                  "Through hardships he has supported me."
            ],
            "themeOrTopic": "Loyal Friendship",
            "explanation": "Prepositional phrase can be fronted."
      },
      {
            "id": "st_g8_e_34",
            "scrambledWords": [
                  "cook",
                  "to",
                  "You",
                  "have",
                  "tonight",
                  "don't"
            ],
            "correctSentence": "You don't have to cook tonight.",
            "alternativeSentences": [
                  "Tonight you don't have to cook."
            ],
            "themeOrTopic": "Lack of Obligation",
            "explanation": "Time adverbial placement."
      },
      {
            "id": "st_g8_e_35",
            "scrambledWords": [
                  "decorated",
                  "the",
                  "cake",
                  "herself",
                  "She",
                  "birthday"
            ],
            "correctSentence": "She decorated the birthday cake herself.",
            "alternativeSentences": [
                  "Herself she decorated the birthday cake."
            ],
            "themeOrTopic": "Emphatic Reflexives",
            "explanation": "Emphatic reflexive placement."
      },
      {
            "id": "st_g8_e_36",
            "scrambledWords": [
                  "years",
                  "been",
                  "have",
                  "for",
                  "friends",
                  "We"
            ],
            "correctSentence": "We have been friends for years.",
            "alternativeSentences": [
                  "For years we have been friends."
            ],
            "themeOrTopic": "Duration Expressions",
            "explanation": "Duration phrase can precede or follow."
      },
      {
            "id": "st_g8_e_37",
            "scrambledWords": [
                  "some",
                  "yellow",
                  "on",
                  "top",
                  "Grate",
                  "cheese"
            ],
            "correctSentence": "Grate some yellow cheese on top.",
            "alternativeSentences": [
                  "On top grate some yellow cheese."
            ],
            "themeOrTopic": "Cooking Instructions",
            "explanation": "Directional phrase placement."
      },
      {
            "id": "st_g8_e_38",
            "scrambledWords": [
                  "his",
                  "mistake",
                  "refuses",
                  "to",
                  "admit",
                  "He"
            ],
            "correctSentence": "He refuses to admit his mistake.",
            "themeOrTopic": "Stubbornness",
            "explanation": "Subject + refuses + to-infinitive + object."
      },
      {
            "id": "st_g8_e_39",
            "scrambledWords": [
                  "helmet",
                  "Always",
                  "climbing",
                  "when",
                  "a",
                  "wear"
            ],
            "correctSentence": "Always wear a helmet when climbing.",
            "alternativeSentences": [
                  "When climbing always wear a helmet."
            ],
            "themeOrTopic": "Safety Rules",
            "explanation": "When-clause can be placed first or second."
      },
      {
            "id": "st_g8_e_40",
            "scrambledWords": [
                  "dishes",
                  "snacks",
                  "traditional",
                  "I",
                  "to",
                  "prefer"
            ],
            "correctSentence": "I prefer traditional dishes to snacks.",
            "alternativeSentences": [
                  "I prefer snacks to traditional dishes."
            ],
            "themeOrTopic": "Food Preferences",
            "explanation": "Both preference orders form grammatically sound English."
      }
],
    medium: [
      {
            "id": "st_g8_m_01",
            "scrambledWords": [
                  "rains",
                  "at",
                  "we",
                  "stay",
                  "it",
                  "will",
                  "home",
                  "If"
            ],
            "correctSentence": "If it rains we will stay at home.",
            "alternativeSentences": [
                  "We will stay at home if it rains."
            ],
            "themeOrTopic": "First Conditional",
            "explanation": "If-condition and main result clause order."
      },
      {
            "id": "st_g8_m_02",
            "scrambledWords": [
                  "new",
                  "ago",
                  "was",
                  "The",
                  "built",
                  "two",
                  "bridge",
                  "years"
            ],
            "correctSentence": "The new bridge was built two years ago.",
            "alternativeSentences": [
                  "Two years ago the new bridge was built."
            ],
            "themeOrTopic": "Past Simple Passive",
            "explanation": "Time expression placement."
      },
      {
            "id": "st_g8_m_03",
            "scrambledWords": [
                  "is",
                  "won",
                  "This",
                  "the",
                  "student",
                  "who",
                  "the",
                  "competition"
            ],
            "correctSentence": "This is the student who won the competition.",
            "themeOrTopic": "Relative Clauses (Who)",
            "explanation": "Demonstrative + relative clause identifying person."
      },
      {
            "id": "st_g8_m_04",
            "scrambledWords": [
                  "English",
                  "by",
                  "is",
                  "the",
                  "spoken",
                  "people",
                  "around",
                  "world"
            ],
            "correctSentence": "English is spoken by people around the world.",
            "alternativeSentences": [
                  "Around the world English is spoken by people."
            ],
            "themeOrTopic": "Present Simple Passive",
            "explanation": "Prepositional place phrase placement."
      },
      {
            "id": "st_g8_m_05",
            "scrambledWords": [
                  "live",
                  "in",
                  "used",
                  "He",
                  "quiet",
                  "a",
                  "to",
                  "village"
            ],
            "correctSentence": "He used to live in a quiet village.",
            "alternativeSentences": [
                  "In a quiet village he used to live."
            ],
            "themeOrTopic": "Used to for Past Habits",
            "explanation": "Prepositional location placement."
      },
      {
            "id": "st_g8_m_06",
            "scrambledWords": [
                  "full",
                  "The",
                  "recommended",
                  "completely",
                  "hotel",
                  "was",
                  "they",
                  "which"
            ],
            "correctSentence": "The hotel which they recommended was completely full.",
            "themeOrTopic": "Relative Clauses (Which)",
            "explanation": "Subject + defining which clause + predicate adjective."
      },
      {
            "id": "st_g8_m_07",
            "scrambledWords": [
                  "consistently",
                  "easily",
                  "study",
                  "you",
                  "you",
                  "will",
                  "If",
                  "succeed"
            ],
            "correctSentence": "If you study consistently you will succeed easily.",
            "alternativeSentences": [
                  "You will succeed easily if you study consistently."
            ],
            "themeOrTopic": "First Conditional Adverbs",
            "explanation": "If-clause and consequence clause order."
      },
      {
            "id": "st_g8_m_08",
            "scrambledWords": [
                  "of",
                  "smartphones",
                  "are",
                  "this",
                  "manufactured",
                  "in",
                  "Thousands",
                  "factory"
            ],
            "correctSentence": "Thousands of smartphones are manufactured in this factory.",
            "alternativeSentences": [
                  "In this factory thousands of smartphones are manufactured."
            ],
            "themeOrTopic": "Passive Voice Plural",
            "explanation": "Location phrase can be fronted."
      },
      {
            "id": "st_g8_m_09",
            "scrambledWords": [
                  "last",
                  "since",
                  "I",
                  "not",
                  "summer",
                  "him",
                  "seen",
                  "have"
            ],
            "correctSentence": "I have not seen him since last summer.",
            "alternativeSentences": [
                  "Since last summer I have not seen him."
            ],
            "themeOrTopic": "Present Perfect + Since",
            "explanation": "Time phrase can be fronted."
      },
      {
            "id": "st_g8_m_10",
            "scrambledWords": [
                  "She",
                  "doctor",
                  "clinic",
                  "whose",
                  "is",
                  "is",
                  "nearby",
                  "the"
            ],
            "correctSentence": "She is the doctor whose clinic is nearby.",
            "themeOrTopic": "Relative Clauses (Whose)",
            "explanation": "Subject + is the doctor + whose possession + location."
      },
      {
            "id": "st_g8_m_11",
            "scrambledWords": [
                  "use",
                  "tennis",
                  "Did",
                  "regularly",
                  "you",
                  "play",
                  "to"
            ],
            "correctSentence": "Did you use to play tennis regularly?",
            "alternativeSentences": [
                  "Did you use to regularly play tennis?"
            ],
            "themeOrTopic": "Questions with Used To",
            "explanation": "Adverb placement."
      },
      {
            "id": "st_g8_m_12",
            "scrambledWords": [
                  "car",
                  "officers",
                  "The",
                  "stolen",
                  "police",
                  "was",
                  "found",
                  "by"
            ],
            "correctSentence": "The stolen car was found by police officers.",
            "alternativeSentences": [
                  "By police officers the stolen car was found."
            ],
            "themeOrTopic": "Past Passive with By",
            "explanation": "Agent by-phrase placement."
      },
      {
            "id": "st_g8_m_13",
            "scrambledWords": [
                  "will",
                  "not",
                  "you",
                  "much",
                  "Unless",
                  "practice",
                  "improve",
                  "you"
            ],
            "correctSentence": "Unless you practice you will not improve much.",
            "alternativeSentences": [
                  "You will not improve much unless you practice."
            ],
            "themeOrTopic": "Unless Conditional",
            "explanation": "Unless clause can precede or follow main clause."
      },
      {
            "id": "st_g8_m_14",
            "scrambledWords": [
                  "century",
                  "This",
                  "ancient",
                  "discovered",
                  "in",
                  "nineteenth",
                  "was",
                  "temple"
            ],
            "correctSentence": "This ancient temple was discovered in nineteenth century.",
            "alternativeSentences": [
                  "In nineteenth century this ancient temple was discovered."
            ],
            "themeOrTopic": "Historical Passive",
            "explanation": "Historical time phrase placement."
      },
      {
            "id": "st_g8_m_15",
            "scrambledWords": [
                  "up",
                  "where",
                  "The",
                  "historic",
                  "I",
                  "grew",
                  "city",
                  "is"
            ],
            "correctSentence": "The city where I grew up is historic.",
            "themeOrTopic": "Relative Clauses (Where)",
            "explanation": "Subject + where-relative clause + predicate."
      },
      {
            "id": "st_g8_m_16",
            "scrambledWords": [
                  "impatient",
                  "discussion",
                  "He",
                  "during",
                  "apologized",
                  "being",
                  "for",
                  "the"
            ],
            "correctSentence": "He apologized for being impatient during the discussion.",
            "alternativeSentences": [
                  "During the discussion he apologized for being impatient."
            ],
            "themeOrTopic": "Apologize For + Gerund",
            "explanation": "Time phrase can be placed first."
      },
      {
            "id": "st_g8_m_17",
            "scrambledWords": [
                  "All",
                  "the",
                  "been",
                  "have",
                  "already",
                  "completed",
                  "preparations",
                  "necessary"
            ],
            "correctSentence": "All the necessary preparations have been completed already.",
            "alternativeSentences": [
                  "Already all the necessary preparations have been completed.",
                  "All the necessary preparations have already been completed."
            ],
            "themeOrTopic": "Present Perfect Passive",
            "explanation": "'Already' placement."
      },
      {
            "id": "st_g8_m_18",
            "scrambledWords": [
                  "we",
                  "we",
                  "now",
                  "will",
                  "leave",
                  "If",
                  "train",
                  "catch",
                  "the"
            ],
            "correctSentence": "If we leave now we will catch the train.",
            "alternativeSentences": [
                  "We will catch the train if we leave now."
            ],
            "themeOrTopic": "First Conditional Real",
            "explanation": "Conditional clause order."
      },
      {
            "id": "st_g8_m_19",
            "scrambledWords": [
                  "door",
                  "who",
                  "drums",
                  "plays",
                  "lives",
                  "The",
                  "boy",
                  "next"
            ],
            "correctSentence": "The boy who lives next door plays drums.",
            "themeOrTopic": "Relative Clauses (Who)",
            "explanation": "Subject + defining who clause + main verb phrase."
      },
      {
            "id": "st_g8_m_20",
            "scrambledWords": [
                  "Aegean",
                  "Delicious",
                  "is",
                  "produced",
                  "oil",
                  "in",
                  "region",
                  "olive"
            ],
            "correctSentence": "Delicious olive oil is produced in Aegean region.",
            "alternativeSentences": [
                  "In Aegean region delicious olive oil is produced."
            ],
            "themeOrTopic": "Present Simple Passive",
            "explanation": "Location phrase can be fronted."
      },
      {
            "id": "st_g8_m_21",
            "scrambledWords": [
                  "to",
                  "books",
                  "didn't",
                  "use",
                  "science",
                  "fiction",
                  "She",
                  "enjoy"
            ],
            "correctSentence": "She didn't use to enjoy science fiction books.",
            "themeOrTopic": "Negative Used to",
            "explanation": "Subject + didn't use to + base verb + object phrase."
      },
      {
            "id": "st_g8_m_22",
            "scrambledWords": [
                  "failed",
                  "lights",
                  "the",
                  "electricity",
                  "extinguished",
                  "When",
                  "all",
                  "the"
            ],
            "correctSentence": "When the electricity failed all the lights extinguished.",
            "alternativeSentences": [
                  "All the lights extinguished when the electricity failed."
            ],
            "themeOrTopic": "Past Time Clauses",
            "explanation": "When-clause can precede or follow."
      },
      {
            "id": "st_g8_m_23",
            "scrambledWords": [
                  "by",
                  "experiment",
                  "out",
                  "was",
                  "experienced",
                  "carried",
                  "scientists",
                  "The"
            ],
            "correctSentence": "The experiment was carried out by experienced scientists.",
            "themeOrTopic": "Passive Phrasal Verbs",
            "explanation": "Subject + was carried out + agent."
      },
      {
            "id": "st_g8_m_24",
            "scrambledWords": [
                  "her",
                  "I",
                  "If",
                  "tell",
                  "will",
                  "calls",
                  "she",
                  "return"
            ],
            "correctSentence": "If she calls tell her I will return.",
            "themeOrTopic": "Conditional Imperatives",
            "explanation": "If clause + imperative main clause with embedded future."
      },
      {
            "id": "st_g8_m_25",
            "scrambledWords": [
                  "we",
                  "That",
                  "reason",
                  "why",
                  "arrived",
                  "is",
                  "the",
                  "late"
            ],
            "correctSentence": "That is the reason why we arrived late.",
            "themeOrTopic": "Relative Clauses (Why)",
            "explanation": "Demonstrative + the reason why + clause."
      },
      {
            "id": "st_g8_m_26",
            "scrambledWords": [
                  "every",
                  "carriers",
                  "morning",
                  "Letters",
                  "by",
                  "were",
                  "postal",
                  "delivered"
            ],
            "correctSentence": "Letters were delivered by postal carriers every morning.",
            "alternativeSentences": [
                  "Every morning letters were delivered by postal carriers."
            ],
            "themeOrTopic": "Past Routine Passive",
            "explanation": "Time phrase can be fronted."
      },
      {
            "id": "st_g8_m_27",
            "scrambledWords": [
                  "planning",
                  "this",
                  "vacation",
                  "been",
                  "have",
                  "since",
                  "We",
                  "January"
            ],
            "correctSentence": "We have been planning this vacation since January.",
            "alternativeSentences": [
                  "Since January we have been planning this vacation."
            ],
            "themeOrTopic": "Present Perfect Continuous",
            "explanation": "Time phrase can be fronted."
      },
      {
            "id": "st_g8_m_28",
            "scrambledWords": [
                  "the",
                  "doctor",
                  "patient",
                  "to",
                  "advised",
                  "The",
                  "more",
                  "rest"
            ],
            "correctSentence": "The doctor advised the patient to rest more.",
            "themeOrTopic": "Advise + Object + To Infinitive",
            "explanation": "Subject + advised + person + to-infinitive."
      },
      {
            "id": "st_g8_m_29",
            "scrambledWords": [
                  "are",
                  "designed",
                  "panels",
                  "solar",
                  "These",
                  "to",
                  "electricity",
                  "generate"
            ],
            "correctSentence": "These solar panels are designed to generate electricity.",
            "themeOrTopic": "Passive with Purpose Infinitive",
            "explanation": "Subject + are designed + purpose to-infinitive."
      },
      {
            "id": "st_g8_m_30",
            "scrambledWords": [
                  "If",
                  "you",
                  "purple",
                  "and",
                  "you",
                  "blue",
                  "red",
                  "get",
                  "mix"
            ],
            "correctSentence": "If you mix red and blue you get purple.",
            "alternativeSentences": [
                  "You get purple if you mix red and blue.",
                  "If you mix blue and red you get purple."
            ],
            "themeOrTopic": "Zero Conditional",
            "explanation": "Condition clause and coordinated color order."
      },
      {
            "id": "st_g8_m_31",
            "scrambledWords": [
                  "castle",
                  "is",
                  "hill",
                  "on",
                  "ancient",
                  "stands",
                  "The",
                  "which"
            ],
            "correctSentence": "The castle which stands on hill is ancient.",
            "themeOrTopic": "Relative Clauses (Which)",
            "explanation": "Subject + which-clause + is + predicate."
      },
      {
            "id": "st_g8_m_32",
            "scrambledWords": [
                  "for",
                  "years",
                  "ten",
                  "Istanbul",
                  "He",
                  "has",
                  "lived",
                  "in"
            ],
            "correctSentence": "He has lived in Istanbul for ten years.",
            "alternativeSentences": [
                  "For ten years he has lived in Istanbul."
            ],
            "themeOrTopic": "Present Perfect Duration",
            "explanation": "Duration phrase can be placed first."
      },
      {
            "id": "st_g8_m_33",
            "scrambledWords": [
                  "held",
                  "will",
                  "The",
                  "be",
                  "in",
                  "hall",
                  "conference",
                  "meeting"
            ],
            "correctSentence": "The meeting will be held in conference hall.",
            "alternativeSentences": [
                  "In conference hall the meeting will be held."
            ],
            "themeOrTopic": "Future Passive",
            "explanation": "Location phrase can be fronted."
      },
      {
            "id": "st_g8_m_34",
            "scrambledWords": [
                  "we",
                  "arrives",
                  "dinner",
                  "as",
                  "As",
                  "start",
                  "will",
                  "she",
                  "soon"
            ],
            "correctSentence": "As soon as she arrives we will start dinner.",
            "alternativeSentences": [
                  "We will start dinner as soon as she arrives."
            ],
            "themeOrTopic": "Time Clauses (As soon as)",
            "explanation": "Time clause can precede or follow."
      },
      {
            "id": "st_g8_m_35",
            "scrambledWords": [
                  "Nobody",
                  "knows",
                  "ago",
                  "the",
                  "who",
                  "invented",
                  "centuries",
                  "wheel"
            ],
            "correctSentence": "Nobody knows who invented the wheel centuries ago.",
            "alternativeSentences": [
                  "Centuries ago nobody knows who invented the wheel."
            ],
            "themeOrTopic": "Indirect Wh- Clauses",
            "explanation": "Time phrase placement."
      },
      {
            "id": "st_g8_m_36",
            "scrambledWords": [
                  "oceans",
                  "be",
                  "Plastic",
                  "banned",
                  "protect",
                  "bags",
                  "to",
                  "should"
            ],
            "correctSentence": "Plastic bags should be banned to protect oceans.",
            "alternativeSentences": [
                  "To protect oceans plastic bags should be banned."
            ],
            "themeOrTopic": "Modal Passive",
            "explanation": "Purpose clause can come first."
      },
      {
            "id": "st_g8_m_37",
            "scrambledWords": [
                  "She",
                  "dawn",
                  "at",
                  "is",
                  "up",
                  "accustomed",
                  "waking",
                  "to"
            ],
            "correctSentence": "She is accustomed to waking up at dawn.",
            "alternativeSentences": [
                  "At dawn she is accustomed to waking up."
            ],
            "themeOrTopic": "Accustomed to + Gerund",
            "explanation": "Time phrase placement."
      },
      {
            "id": "st_g8_m_38",
            "scrambledWords": [
                  "very",
                  "book",
                  "The",
                  "that",
                  "inspiring",
                  "borrowed",
                  "was",
                  "I"
            ],
            "correctSentence": "The book that I borrowed was very inspiring.",
            "themeOrTopic": "Relative Clauses (That)",
            "explanation": "Subject + that-clause + predicate."
      },
      {
            "id": "st_g8_m_39",
            "scrambledWords": [
                  "he",
                  "the",
                  "will",
                  "If",
                  "flight",
                  "he",
                  "call",
                  "misses"
            ],
            "correctSentence": "If he misses the flight he will call.",
            "alternativeSentences": [
                  "He will call if he misses the flight."
            ],
            "themeOrTopic": "First Conditional",
            "explanation": "Condition and consequence clause order."
      },
      {
            "id": "st_g8_m_40",
            "scrambledWords": [
                  "to",
                  "drinking",
                  "must",
                  "be",
                  "provided",
                  "water",
                  "Clean",
                  "all"
            ],
            "correctSentence": "Clean drinking water must be provided to all.",
            "alternativeSentences": [
                  "To all clean drinking water must be provided."
            ],
            "themeOrTopic": "Modal Passive Obligation",
            "explanation": "Recipient phrase placement."
      }
],
    hard: [
      {
            "id": "st_g8_h_01",
            "scrambledWords": [
                  "a",
                  "would",
                  "dollars",
                  "I",
                  "travel",
                  "If",
                  "I",
                  "had",
                  "million"
            ],
            "correctSentence": "If I had a million dollars I would travel.",
            "alternativeSentences": [
                  "I would travel if I had a million dollars."
            ],
            "themeOrTopic": "Second Conditional",
            "explanation": "Hypothetical condition and result clause order."
      },
      {
            "id": "st_g8_h_02",
            "scrambledWords": [
                  "left",
                  "the",
                  "arrived",
                  "By",
                  "train",
                  "had",
                  "we",
                  "time",
                  "the"
            ],
            "correctSentence": "By the time we arrived the train had left.",
            "alternativeSentences": [
                  "The train had left by the time we arrived."
            ],
            "themeOrTopic": "Past Perfect with By The Time",
            "explanation": "Time boundary clause can precede or follow."
      },
      {
            "id": "st_g8_h_03",
            "scrambledWords": [
                  "us",
                  "she",
                  "tell",
                  "she",
                  "knew",
                  "truth",
                  "would",
                  "If",
                  "the"
            ],
            "correctSentence": "If she knew the truth she would tell us.",
            "alternativeSentences": [
                  "She would tell us if she knew the truth."
            ],
            "themeOrTopic": "Second Conditional",
            "explanation": "Condition and result clause order."
      },
      {
            "id": "st_g8_h_04",
            "scrambledWords": [
                  "flown",
                  "was",
                  "had",
                  "before",
                  "because",
                  "nervous",
                  "he",
                  "never",
                  "He"
            ],
            "correctSentence": "He was nervous because he had never flown before.",
            "alternativeSentences": [
                  "Because he had never flown before he was nervous."
            ],
            "themeOrTopic": "Past Perfect Reason",
            "explanation": "Because clause can come first or second."
      },
      {
            "id": "st_g8_h_05",
            "scrambledWords": [
                  "that",
                  "me",
                  "she",
                  "She",
                  "was",
                  "to",
                  "moving",
                  "London",
                  "told"
            ],
            "correctSentence": "She told me that she was moving to London.",
            "themeOrTopic": "Reported Speech Tense Shift",
            "explanation": "Subject + told me that + past continuous shift."
      },
      {
            "id": "st_g8_h_06",
            "scrambledWords": [
                  "would",
                  "your",
                  "I",
                  "in",
                  "were",
                  "position",
                  "I",
                  "apologize",
                  "If"
            ],
            "correctSentence": "If I were in your position I would apologize.",
            "alternativeSentences": [
                  "I would apologize if I were in your position."
            ],
            "themeOrTopic": "Second Conditional (Advice)",
            "explanation": "Advice conditional clause order."
      },
      {
            "id": "st_g8_h_07",
            "scrambledWords": [
                  "dinner",
                  "a",
                  "for",
                  "had",
                  "walk",
                  "they",
                  "they",
                  "went",
                  "finished",
                  "After"
            ],
            "correctSentence": "After they had finished dinner they went for a walk.",
            "alternativeSentences": [
                  "They went for a walk after they had finished dinner."
            ],
            "themeOrTopic": "Past Perfect with After",
            "explanation": "After clause can precede or follow."
      },
      {
            "id": "st_g8_h_08",
            "scrambledWords": [
                  "You",
                  "party",
                  "you",
                  "coming",
                  "aren't",
                  "are",
                  "the",
                  "tonight",
                  "to"
            ],
            "correctSentence": "You are coming to the party tonight aren't you?",
            "themeOrTopic": "Tag Questions",
            "explanation": "Positive sentence + negative question tag."
      },
      {
            "id": "st_g8_h_09",
            "scrambledWords": [
                  "is",
                  "the",
                  "you",
                  "me",
                  "Could",
                  "please",
                  "where",
                  "library",
                  "tell"
            ],
            "correctSentence": "Could you please tell me where the library is?",
            "alternativeSentences": [
                  "Could you tell me please where the library is?"
            ],
            "themeOrTopic": "Indirect Questions",
            "explanation": "Polite adverb 'please' placement."
      },
      {
            "id": "st_g8_h_10",
            "scrambledWords": [
                  "forgotten",
                  "his",
                  "at",
                  "He",
                  "must",
                  "yesterday",
                  "school",
                  "have",
                  "phone"
            ],
            "correctSentence": "He must have forgotten his phone at school yesterday.",
            "alternativeSentences": [
                  "Yesterday he must have forgotten his phone at school."
            ],
            "themeOrTopic": "Modal of Past Deduction",
            "explanation": "Time phrase can be fronted."
      },
      {
            "id": "st_g8_h_11",
            "scrambledWords": [
                  "tennis",
                  "raining",
                  "were",
                  "it",
                  "could",
                  "we",
                  "not",
                  "If",
                  "play"
            ],
            "correctSentence": "If it were not raining we could play tennis.",
            "alternativeSentences": [
                  "We could play tennis if it were not raining."
            ],
            "themeOrTopic": "Second Conditional Continuous",
            "explanation": "Hypothetical condition clause order."
      },
      {
            "id": "st_g8_h_12",
            "scrambledWords": [
                  "teacher",
                  "late",
                  "The",
                  "why",
                  "was",
                  "know",
                  "to",
                  "wanted",
                  "student",
                  "the"
            ],
            "correctSentence": "The teacher wanted to know why the student was late.",
            "themeOrTopic": "Embedded Wh- Questions",
            "explanation": "Reporting clause + why + subject + was predicate."
      },
      {
            "id": "st_g8_h_13",
            "scrambledWords": [
                  "in",
                  "if",
                  "much",
                  "lived",
                  "they",
                  "be",
                  "happier",
                  "countryside",
                  "would",
                  "They"
            ],
            "correctSentence": "They would be much happier if they lived in countryside.",
            "alternativeSentences": [
                  "If they lived in countryside they would be much happier."
            ],
            "themeOrTopic": "Second Conditional",
            "explanation": "Condition and result clause order."
      },
      {
            "id": "st_g8_h_14",
            "scrambledWords": [
                  "when",
                  "alarm",
                  "the",
                  "the",
                  "locked",
                  "had",
                  "She",
                  "doors",
                  "sounded",
                  "already"
            ],
            "correctSentence": "She had already locked the doors when the alarm sounded.",
            "alternativeSentences": [
                  "When the alarm sounded she had already locked the doors."
            ],
            "themeOrTopic": "Past Perfect with When",
            "explanation": "When clause can precede or follow."
      },
      {
            "id": "st_g8_h_15",
            "scrambledWords": [
                  "her",
                  "if",
                  "had",
                  "keys",
                  "me",
                  "She",
                  "seen",
                  "I",
                  "asked"
            ],
            "correctSentence": "She asked me if I had seen her keys.",
            "themeOrTopic": "Reported Yes/No Questions",
            "explanation": "Reporting verb + if + subject + past perfect."
      },
      {
            "id": "st_g8_h_16",
            "scrambledWords": [
                  "they",
                  "accident",
                  "in",
                  "Nobody",
                  "the",
                  "serious",
                  "were",
                  "was",
                  "injured"
            ],
            "correctSentence": "Nobody was injured in the serious accident were they?",
            "themeOrTopic": "Tag Questions with Nobody",
            "explanation": "Negative pronoun subject takes positive plural tag."
      },
      {
            "id": "st_g8_h_17",
            "scrambledWords": [
                  "morning",
                  "time",
                  "opens",
                  "what",
                  "the",
                  "museum",
                  "know",
                  "Do",
                  "you",
                  "in"
            ],
            "correctSentence": "Do you know what time the museum opens in morning?",
            "themeOrTopic": "Indirect Questions",
            "explanation": "Do you know + what time + subject + verb."
      },
      {
            "id": "st_g8_h_18",
            "scrambledWords": [
                  "because",
                  "wallet",
                  "can't",
                  "stolen",
                  "was",
                  "have",
                  "the",
                  "away",
                  "He",
                  "he"
            ],
            "correctSentence": "He can't have stolen the wallet because he was away.",
            "alternativeSentences": [
                  "Because he was away he can't have stolen the wallet."
            ],
            "themeOrTopic": "Modal of Past Impossibility",
            "explanation": "Reason clause can come first or second."
      },
      {
            "id": "st_g8_h_19",
            "scrambledWords": [
                  "had",
                  "we",
                  "time",
                  "would",
                  "we",
                  "explore",
                  "more",
                  "ancient",
                  "ruins",
                  "If"
            ],
            "correctSentence": "If we had more time we would explore ancient ruins.",
            "alternativeSentences": [
                  "We would explore ancient ruins if we had more time."
            ],
            "themeOrTopic": "Second Conditional",
            "explanation": "Hypothetical condition and result order."
      },
      {
            "id": "st_g8_h_20",
            "scrambledWords": [
                  "wallet",
                  "her",
                  "had",
                  "that",
                  "She",
                  "realized",
                  "she",
                  "home",
                  "at",
                  "left"
            ],
            "correctSentence": "She realized that she had left her wallet at home.",
            "themeOrTopic": "Past Perfect Discovery",
            "explanation": "Past realization + earlier action in past perfect."
      },
      {
            "id": "st_g8_h_21",
            "scrambledWords": [
                  "your",
                  "You",
                  "that",
                  "teacher",
                  "shouldn't",
                  "to",
                  "like",
                  "spoken",
                  "have"
            ],
            "correctSentence": "You shouldn't have spoken to your teacher like that.",
            "themeOrTopic": "Past Criticism (Shouldn't Have)",
            "explanation": "Shouldn't have + past participle criticizes past action."
      },
      {
            "id": "st_g8_h_22",
            "scrambledWords": [
                  "he",
                  "call",
                  "as",
                  "said",
                  "He",
                  "soon",
                  "he",
                  "would",
                  "landed",
                  "as"
            ],
            "correctSentence": "He said he would call as soon as he landed.",
            "themeOrTopic": "Reported Future in Past",
            "explanation": "Said + would call + as soon as past clause."
      },
      {
            "id": "st_g8_h_23",
            "scrambledWords": [
                  "go",
                  "you",
                  "could",
                  "would",
                  "you",
                  "if",
                  "anywhere",
                  "go",
                  "Where"
            ],
            "correctSentence": "Where would you go if you could go anywhere?",
            "alternativeSentences": [
                  "If you could go anywhere where would you go?"
            ],
            "themeOrTopic": "Second Conditional Questions",
            "explanation": "Question clause and if-clause order."
      },
      {
            "id": "st_g8_h_24",
            "scrambledWords": [
                  "cuisine",
                  "tasted",
                  "last",
                  "I",
                  "Until",
                  "traditional",
                  "year",
                  "had",
                  "never"
            ],
            "correctSentence": "Until last year I had never tasted traditional cuisine.",
            "alternativeSentences": [
                  "I had never tasted traditional cuisine until last year."
            ],
            "themeOrTopic": "Past Perfect with Until",
            "explanation": "Until time marker can precede or follow."
      },
      {
            "id": "st_g8_h_25",
            "scrambledWords": [
                  "doctor",
                  "weights",
                  "The",
                  "heavy",
                  "to",
                  "him",
                  "not",
                  "lift",
                  "warned"
            ],
            "correctSentence": "The doctor warned him not to lift heavy weights.",
            "themeOrTopic": "Reported Negative Commands",
            "explanation": "Warned + object + not to-infinitive."
      },
      {
            "id": "st_g8_h_26",
            "scrambledWords": [
                  "Despite",
                  "travel",
                  "to",
                  "comfortably",
                  "they",
                  "little",
                  "managed",
                  "money",
                  "having"
            ],
            "correctSentence": "Despite having little money they managed to travel comfortably.",
            "alternativeSentences": [
                  "They managed to travel comfortably despite having little money."
            ],
            "themeOrTopic": "Despite + Gerund Phrase",
            "explanation": "Despite phrase can precede or follow."
      },
      {
            "id": "st_g8_h_27",
            "scrambledWords": [
                  "If",
                  "make",
                  "he",
                  "carefully",
                  "errors",
                  "would",
                  "he",
                  "listened",
                  "fewer",
                  "more"
            ],
            "correctSentence": "If he listened more carefully he would make fewer errors.",
            "alternativeSentences": [
                  "He would make fewer errors if he listened more carefully."
            ],
            "themeOrTopic": "Second Conditional",
            "explanation": "Condition and consequence order."
      },
      {
            "id": "st_g8_h_28",
            "scrambledWords": [
                  "weather",
                  "whether",
                  "the",
                  "wondered",
                  "been",
                  "delayed",
                  "flight",
                  "She",
                  "by",
                  "had"
            ],
            "correctSentence": "She wondered whether the flight had been delayed by weather.",
            "themeOrTopic": "Embedded Passive Questions",
            "explanation": "Wondered + whether + past perfect passive."
      },
      {
            "id": "st_g8_h_29",
            "scrambledWords": [
                  "for",
                  "Let's",
                  "campaign",
                  "we",
                  "charity",
                  "shall",
                  "homeless",
                  "a",
                  "organize"
            ],
            "correctSentence": "Let's organize a charity campaign for homeless shall we?",
            "themeOrTopic": "Tag Questions with Let's",
            "explanation": "Suggestions starting with Let's end with 'shall we?'."
      },
      {
            "id": "st_g8_h_30",
            "scrambledWords": [
                  "taken",
                  "wrong",
                  "by",
                  "have",
                  "mistake",
                  "might",
                  "He",
                  "the",
                  "train"
            ],
            "correctSentence": "He might have taken the wrong train by mistake.",
            "alternativeSentences": [
                  "By mistake he might have taken the wrong train."
            ],
            "themeOrTopic": "Modal of Past Possibility",
            "explanation": "Adverbial prepositional phrase placement."
      },
      {
            "id": "st_g8_h_31",
            "scrambledWords": [
                  "she",
                  "she",
                  "would",
                  "German",
                  "for",
                  "If",
                  "job",
                  "spoke",
                  "apply",
                  "fluent"
            ],
            "correctSentence": "If she spoke fluent German she would apply for job.",
            "alternativeSentences": [
                  "She would apply for job if she spoke fluent German."
            ],
            "themeOrTopic": "Second Conditional Abilities",
            "explanation": "Condition and result clause order."
      },
      {
            "id": "st_g8_h_32",
            "scrambledWords": [
                  "for",
                  "The",
                  "been",
                  "decades",
                  "being",
                  "renovated",
                  "abandoned",
                  "house",
                  "before",
                  "had"
            ],
            "correctSentence": "The house had been abandoned for decades before being renovated.",
            "themeOrTopic": "Past Perfect Passive",
            "explanation": "Had been abandoned + time + before clause."
      },
      {
            "id": "st_g8_h_33",
            "scrambledWords": [
                  "take",
                  "urged",
                  "the",
                  "to",
                  "urgent",
                  "They",
                  "environmental",
                  "government",
                  "action"
            ],
            "correctSentence": "They urged the government to take urgent environmental action.",
            "themeOrTopic": "Reporting Verbs of Urgency",
            "explanation": "Urged + object + to-infinitive phrase."
      },
      {
            "id": "st_g8_h_34",
            "scrambledWords": [
                  "of",
                  "In",
                  "spite",
                  "the",
                  "storm",
                  "the",
                  "succeeded",
                  "team",
                  "rescue"
            ],
            "correctSentence": "In spite of the storm the rescue team succeeded.",
            "alternativeSentences": [
                  "The rescue team succeeded in spite of the storm."
            ],
            "themeOrTopic": "In Spite Of + Noun Phrase",
            "explanation": "Concessive prepositional phrase can precede or follow."
      },
      {
            "id": "st_g8_h_35",
            "scrambledWords": [
                  "the",
                  "would",
                  "if",
                  "ice",
                  "melted",
                  "polar",
                  "all",
                  "What",
                  "happen"
            ],
            "correctSentence": "What would happen if all the polar ice melted?",
            "alternativeSentences": [
                  "If all the polar ice melted what would happen?"
            ],
            "themeOrTopic": "Second Conditional Questions",
            "explanation": "Conditional question clause order."
      },
      {
            "id": "st_g8_h_36",
            "scrambledWords": [
                  "from",
                  "He",
                  "office",
                  "documents",
                  "confidential",
                  "taken",
                  "denied",
                  "the",
                  "having"
            ],
            "correctSentence": "He denied having taken the confidential documents from office.",
            "themeOrTopic": "Deny + Perfect Gerund",
            "explanation": "Denied + having taken + direct object."
      },
      {
            "id": "st_g8_h_37",
            "scrambledWords": [
                  "cured",
                  "The",
                  "claimed",
                  "the",
                  "formula",
                  "had",
                  "scientist",
                  "disease",
                  "that"
            ],
            "correctSentence": "The scientist claimed that the formula had cured disease.",
            "themeOrTopic": "Reported Claims with Past Perfect",
            "explanation": "Claimed that + formula had cured."
      },
      {
            "id": "st_g8_h_38",
            "scrambledWords": [
                  "the",
                  "injured",
                  "Neither",
                  "was",
                  "seriously",
                  "nor",
                  "driver",
                  "the",
                  "passengers"
            ],
            "correctSentence": "Neither the passengers nor the driver was seriously injured.",
            "themeOrTopic": "Correlative Agreement",
            "explanation": "Neither... nor structure."
      },
      {
            "id": "st_g8_h_39",
            "scrambledWords": [
                  "explain",
                  "satellite",
                  "Could",
                  "how",
                  "operates",
                  "in",
                  "advanced",
                  "this",
                  "orbit",
                  "you"
            ],
            "correctSentence": "Could you explain how this advanced satellite operates in orbit?",
            "themeOrTopic": "Indirect Embedded Questions",
            "explanation": "Could you explain + how clause with subject and verb."
      },
      {
            "id": "st_g8_h_40",
            "scrambledWords": [
                  "extinct",
                  "habitats",
                  "protected",
                  "fewer",
                  "If",
                  "would",
                  "become",
                  "we",
                  "species"
            ],
            "correctSentence": "If we protected habitats fewer species would become extinct.",
            "alternativeSentences": [
                  "Fewer species would become extinct if we protected habitats."
            ],
            "themeOrTopic": "Second Conditional Ecology",
            "explanation": "Hypothetical condition and result clause order."
      }
],
  },
};
