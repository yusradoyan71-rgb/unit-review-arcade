/**
 * UNIT REVIEW ARCADE — WORDLE ENGLISH DATA BANK (PHASE 7A & MIXED CURRICULUM EXPANSION)
 * 
 * 480 validated unique words (80 items per tier) across:
 * - Grade 7: Easy (80, 4-letter), Medium (80, 5-letter), Hard (80, 6-letter)
 * - Grade 8: Easy (80, 4-letter), Medium (80, 5-letter), Hard (80, 6-letter)
 * 
 * Mixed Curriculum: Turkish MEB English Units 1-10 + School English Curriculum.
 */

import type { WordleEnglishBank } from '../../types/gamesZone';

export const WORDLE_ENGLISH_BANK: WordleEnglishBank = {
  "grade-7": {
    "easy": [
      {
        "id": "we_g7_e_01",
        "word": "TALL",
        "clue": "Having a greater height than normal",
        "turkishMeaning": "Uzun boylu",
        "exampleSentence": "My brother is tall and plays basketball.",
        "category": "Appearance",
        "explanation": "TALL (Uzun boylu): Having a greater height than normal. E.g.: \"My brother is tall and plays basketball.\""
      },
      {
        "id": "we_g7_e_02",
        "word": "SLIM",
        "clue": "Thin in an attractive and healthy way",
        "turkishMeaning": "Zayıf, ince",
        "exampleSentence": "She exercises every morning to stay slim.",
        "category": "Appearance",
        "explanation": "SLIM (Zayıf, ince): Thin in an attractive and healthy way. E.g.: \"She exercises every morning to stay slim.\""
      },
      {
        "id": "we_g7_e_03",
        "word": "FAIR",
        "clue": "Treating everyone equally or light in color",
        "turkishMeaning": "Adil / Açık renk",
        "exampleSentence": "A referee must always be fair to both teams.",
        "category": "Personality",
        "explanation": "FAIR (Adil / Açık renk): Treating everyone equally or light in color. E.g.: \"A referee must always be fair to both teams.\""
      },
      {
        "id": "we_g7_e_04",
        "word": "CUTE",
        "clue": "Attractive in a pretty or endearing way",
        "turkishMeaning": "Sevimli, şirin",
        "exampleSentence": "The kitten is very cute and playful.",
        "category": "Appearance",
        "explanation": "CUTE (Sevimli, şirin): Attractive in a pretty or endearing way. E.g.: \"The kitten is very cute and playful.\""
      },
      {
        "id": "we_g7_e_05",
        "word": "SWIM",
        "clue": "To move through water by moving your arms and legs",
        "turkishMeaning": "Yüzmek",
        "exampleSentence": "Dolphins swim very fast in the ocean.",
        "category": "Sports",
        "explanation": "SWIM (Yüzmek): To move through water by moving your arms and legs. E.g.: \"Dolphins swim very fast in the ocean.\""
      },
      {
        "id": "we_g7_e_06",
        "word": "RING",
        "clue": "A circle of metal or a boxing enclosure",
        "turkishMeaning": "Yüzük / Boks ringi",
        "exampleSentence": "The boxers stepped inside the ring.",
        "category": "Sports",
        "explanation": "RING (Yüzük / Boks ringi): A circle of metal or a boxing enclosure. E.g.: \"The boxers stepped inside the ring.\""
      },
      {
        "id": "we_g7_e_07",
        "word": "BORN",
        "clue": "Brought into life as a baby",
        "turkishMeaning": "Doğmuş",
        "exampleSentence": "Albert Einstein was born in Germany in 1879.",
        "category": "Biographies",
        "explanation": "BORN (Doğmuş): Brought into life as a baby. E.g.: \"Albert Einstein was born in Germany in 1879.\""
      },
      {
        "id": "we_g7_e_08",
        "word": "GROW",
        "clue": "To become bigger or develop over time",
        "turkishMeaning": "Büyümek, gelişmek",
        "exampleSentence": "Plants grow quickly when they get sunlight.",
        "category": "Biographies",
        "explanation": "GROW (Büyümek, gelişmek): To become bigger or develop over time. E.g.: \"Plants grow quickly when they get sunlight.\""
      },
      {
        "id": "we_g7_e_09",
        "word": "LION",
        "clue": "A large wild cat known as the king of the jungle",
        "turkishMeaning": "Aslan",
        "exampleSentence": "The lion rested under the tall acacia tree.",
        "category": "Wild Animals",
        "explanation": "LION (Aslan): A large wild cat known as the king of the jungle. E.g.: \"The lion rested under the tall acacia tree.\""
      },
      {
        "id": "we_g7_e_10",
        "word": "PREY",
        "clue": "An animal that is hunted and eaten by another",
        "turkishMeaning": "Av",
        "exampleSentence": "Zebras are the main prey of hungry lions.",
        "category": "Wild Animals",
        "explanation": "PREY (Av): An animal that is hunted and eaten by another. E.g.: \"Zebras are the main prey of hungry lions.\""
      },
      {
        "id": "we_g7_e_11",
        "word": "NEWS",
        "clue": "Information about recent events broadcast on TV",
        "turkishMeaning": "Haberler",
        "exampleSentence": "My parents watch the evening news at seven.",
        "category": "Television",
        "explanation": "NEWS (Haberler): Information about recent events broadcast on TV. E.g.: \"My parents watch the evening news at seven.\""
      },
      {
        "id": "we_g7_e_12",
        "word": "QUIZ",
        "clue": "A competition testing knowledge with questions",
        "turkishMeaning": "Bilgi yarışması",
        "exampleSentence": "We won first prize in the school English quiz.",
        "category": "Television",
        "explanation": "QUIZ (Bilgi yarışması): A competition testing knowledge with questions. E.g.: \"We won first prize in the school English quiz.\""
      },
      {
        "id": "we_g7_e_13",
        "word": "SHOW",
        "clue": "A program or performance on television",
        "turkishMeaning": "Gösteri, program",
        "exampleSentence": "That nature show about polar bears was amazing.",
        "category": "Television",
        "explanation": "SHOW (Gösteri, program): A program or performance on television. E.g.: \"That nature show about polar bears was amazing.\""
      },
      {
        "id": "we_g7_e_14",
        "word": "GIFT",
        "clue": "Something given willingly to someone on an occasion",
        "turkishMeaning": "Hediye",
        "exampleSentence": "She unwrapped a wonderful birthday gift.",
        "category": "Celebrations",
        "explanation": "GIFT (Hediye): Something given willingly to someone on an occasion. E.g.: \"She unwrapped a wonderful birthday gift.\""
      },
      {
        "id": "we_g7_e_15",
        "word": "CAKE",
        "clue": "A sweet baked food enjoyed at birthday parties",
        "turkishMeaning": "Pasta, kek",
        "exampleSentence": "We blew out the candles on the birthday cake.",
        "category": "Celebrations",
        "explanation": "CAKE (Pasta, kek): A sweet baked food enjoyed at birthday parties. E.g.: \"We blew out the candles on the birthday cake.\""
      },
      {
        "id": "we_g7_e_16",
        "word": "RICH",
        "clue": "Having a lot of money, wealth, or resources",
        "turkishMeaning": "Zengin",
        "exampleSentence": "He dreams of becoming rich and helping schools.",
        "category": "Dreams",
        "explanation": "RICH (Zengin): Having a lot of money, wealth, or resources. E.g.: \"He dreams of becoming rich and helping schools.\""
      },
      {
        "id": "we_g7_e_17",
        "word": "STAR",
        "clue": "A bright celestial body shining in the night sky",
        "turkishMeaning": "Yıldız",
        "exampleSentence": "The Sun is the closest star to our planet Earth.",
        "category": "Planets",
        "explanation": "STAR (Yıldız): A bright celestial body shining in the night sky. E.g.: \"The Sun is the closest star to our planet Earth.\""
      },
      {
        "id": "we_g7_e_18",
        "word": "MOON",
        "clue": "The natural satellite that orbits planet Earth",
        "turkishMeaning": "Ay",
        "exampleSentence": "The full moon lit up the night sky beautifully.",
        "category": "Planets",
        "explanation": "MOON (Ay): The natural satellite that orbits planet Earth. E.g.: \"The full moon lit up the night sky beautifully.\""
      },
      {
        "id": "we_g7_e_19",
        "word": "MARS",
        "clue": "The fourth planet from the sun, the Red Planet",
        "turkishMeaning": "Mars, Kızıl Gezegen",
        "exampleSentence": "Scientists send robotic rovers to explore Mars.",
        "category": "Planets",
        "explanation": "MARS (Mars, Kızıl Gezegen): The fourth planet from the sun, the Red Planet. E.g.: \"Scientists send robotic rovers to explore Mars.\""
      },
      {
        "id": "we_g7_e_20",
        "word": "WIND",
        "clue": "Air moving naturally across the earth surface",
        "turkishMeaning": "Rüzgar",
        "exampleSentence": "Wind turbines generate clean renewable energy.",
        "category": "Environment",
        "explanation": "WIND (Rüzgar): Air moving naturally across the earth surface. E.g.: \"Wind turbines generate clean renewable energy.\""
      },
      {
        "id": "we_g7_e_21",
        "word": "PARK",
        "clue": "A green public area for walking and playing",
        "turkishMeaning": "Park",
        "exampleSentence": "Children love playing on the swings in the park.",
        "category": "Public Buildings",
        "explanation": "PARK (Park): A green public area for walking and playing. E.g.: \"Children love playing on the swings in the park.\""
      },
      {
        "id": "we_g7_e_22",
        "word": "BANK",
        "clue": "A financial building where people save money",
        "turkishMeaning": "Banka",
        "exampleSentence": "My father visited the bank to open an account.",
        "category": "Public Buildings",
        "explanation": "BANK (Banka): A financial building where people save money. E.g.: \"My father visited the bank to open an account.\""
      },
      {
        "id": "we_g7_e_23",
        "word": "CAFE",
        "clue": "A small casual restaurant serving drinks and snacks",
        "turkishMeaning": "Kafe",
        "exampleSentence": "We drank hot chocolate at the corner cafe.",
        "category": "Public Buildings",
        "explanation": "CAFE (Kafe): A small casual restaurant serving drinks and snacks. E.g.: \"We drank hot chocolate at the corner cafe.\""
      },
      {
        "id": "we_g7_e_24",
        "word": "MALL",
        "clue": "A large indoor shopping center with many stores",
        "turkishMeaning": "Alışveriş merkezi",
        "exampleSentence": "We bought new sneakers at the shopping mall.",
        "category": "Public Buildings",
        "explanation": "MALL (Alışveriş merkezi): A large indoor shopping center with many stores. E.g.: \"We bought new sneakers at the shopping mall.\""
      },
      {
        "id": "we_g7_e_25",
        "word": "SHOP",
        "clue": "A building or room where goods are sold",
        "turkishMeaning": "Dükkan, mağaza",
        "exampleSentence": "There is a cozy book shop near our school.",
        "category": "Public Buildings",
        "explanation": "SHOP (Dükkan, mağaza): A building or room where goods are sold. E.g.: \"There is a cozy book shop near our school.\""
      },
      {
        "id": "we_g7_e_26",
        "word": "SAVE",
        "clue": "To protect from harm or keep for future use",
        "turkishMeaning": "Korumak, tasarruf etmek",
        "exampleSentence": "We must save water to protect our planet.",
        "category": "Environment",
        "explanation": "SAVE (Korumak, tasarruf etmek): To protect from harm or keep for future use. E.g.: \"We must save water to protect our planet.\""
      },
      {
        "id": "we_g7_e_27",
        "word": "TREE",
        "clue": "A woody perennial plant with a trunk and branches",
        "turkishMeaning": "Ağaç",
        "exampleSentence": "The students planted a pine tree in the garden.",
        "category": "Environment",
        "explanation": "TREE (Ağaç): A woody perennial plant with a trunk and branches. E.g.: \"The students planted a pine tree in the garden.\""
      },
      {
        "id": "we_g7_e_28",
        "word": "BIRD",
        "clue": "A warm-blooded feathered creature with wings",
        "turkishMeaning": "Kuş",
        "exampleSentence": "A colorful bird sang sweetly in the morning.",
        "category": "Wild Animals",
        "explanation": "BIRD (Kuş): A warm-blooded feathered creature with wings. E.g.: \"A colorful bird sang sweetly in the morning.\""
      },
      {
        "id": "we_g7_e_29",
        "word": "FISH",
        "clue": "A limbless cold-blooded creature living in water",
        "turkishMeaning": "Balık",
        "exampleSentence": "Goldfish swim gracefully inside the clear aquarium.",
        "category": "Wild Animals",
        "explanation": "FISH (Balık): A limbless cold-blooded creature living in water. E.g.: \"Goldfish swim gracefully inside the clear aquarium.\""
      },
      {
        "id": "we_g7_e_30",
        "word": "DEER",
        "clue": "A graceful hoofed animal with antlers in the forest",
        "turkishMeaning": "Geyik",
        "exampleSentence": "We spotted a quiet deer drinking from the river.",
        "category": "Wild Animals",
        "explanation": "DEER (Geyik): A graceful hoofed animal with antlers in the forest. E.g.: \"We spotted a quiet deer drinking from the river.\""
      },
      {
        "id": "we_g7_e_31",
        "word": "WOLF",
        "clue": "A wild carnivorous mammal living in packs",
        "turkishMeaning": "Kurt",
        "exampleSentence": "The wolf howled under the bright full moon.",
        "category": "Wild Animals",
        "explanation": "WOLF (Kurt): A wild carnivorous mammal living in packs. E.g.: \"The wolf howled under the bright full moon.\""
      },
      {
        "id": "we_g7_e_32",
        "word": "BEAR",
        "clue": "A large heavy mammal with thick fur and claws",
        "turkishMeaning": "Ayı",
        "exampleSentence": "The brown bear hibernates during the cold winter.",
        "category": "Wild Animals",
        "explanation": "BEAR (Ayı): A large heavy mammal with thick fur and claws. E.g.: \"The brown bear hibernates during the cold winter.\""
      },
      {
        "id": "we_g7_e_33",
        "word": "DUCK",
        "clue": "A waterbird with webbed feet and a broad bill",
        "turkishMeaning": "Ördek",
        "exampleSentence": "A mother duck guided her ducklings across the pond.",
        "category": "Wild Animals",
        "explanation": "DUCK (Ördek): A waterbird with webbed feet and a broad bill. E.g.: \"A mother duck guided her ducklings across the pond.\""
      },
      {
        "id": "we_g7_e_34",
        "word": "FROG",
        "clue": "A tailless amphibian that hops and lives near ponds",
        "turkishMeaning": "Kurbağa",
        "exampleSentence": "The green frog jumped into the cool water.",
        "category": "Wild Animals",
        "explanation": "FROG (Kurbağa): A tailless amphibian that hops and lives near ponds. E.g.: \"The green frog jumped into the cool water.\""
      },
      {
        "id": "we_g7_e_35",
        "word": "SEED",
        "clue": "A small plant unit capable of developing into a plant",
        "turkishMeaning": "Tohum",
        "exampleSentence": "Water the seed daily so it can sprout into a flower.",
        "category": "Environment",
        "explanation": "SEED (Tohum): A small plant unit capable of developing into a plant. E.g.: \"Water the seed daily so it can sprout into a flower.\""
      },
      {
        "id": "we_g7_e_36",
        "word": "LEAF",
        "clue": "A flat green part of a plant growing from a stem",
        "turkishMeaning": "Yaprak",
        "exampleSentence": "Autumn leaves turn golden and fall from branches.",
        "category": "Environment",
        "explanation": "LEAF (Yaprak): A flat green part of a plant growing from a stem. E.g.: \"Autumn leaves turn golden and fall from branches.\""
      },
      {
        "id": "we_g7_e_37",
        "word": "SOIL",
        "clue": "The upper layer of earth in which plants grow",
        "turkishMeaning": "Toprak",
        "exampleSentence": "Rich black soil helps crops grow tall and strong.",
        "category": "Environment",
        "explanation": "SOIL (Toprak): The upper layer of earth in which plants grow. E.g.: \"Rich black soil helps crops grow tall and strong.\""
      },
      {
        "id": "we_g7_e_38",
        "word": "RAIN",
        "clue": "Moisture condensed from the atmosphere falling in drops",
        "turkishMeaning": "Yağmur",
        "exampleSentence": "The crops desperately needed fresh spring rain.",
        "category": "Environment",
        "explanation": "RAIN (Yağmur): Moisture condensed from the atmosphere falling in drops. E.g.: \"The crops desperately needed fresh spring rain.\""
      },
      {
        "id": "we_g7_e_39",
        "word": "SNOW",
        "clue": "Atmospheric water vapor frozen into ice crystals",
        "turkishMeaning": "Kar",
        "exampleSentence": "We built a friendly snowman when it started to snow.",
        "category": "Environment",
        "explanation": "SNOW (Kar): Atmospheric water vapor frozen into ice crystals. E.g.: \"We built a friendly snowman when it started to snow.\""
      },
      {
        "id": "we_g7_e_40",
        "word": "WARM",
        "clue": "Having a comfortable degree of mild heat",
        "turkishMeaning": "Ilık, sıcak",
        "exampleSentence": "The spring sunshine feels pleasantly warm.",
        "category": "Environment",
        "explanation": "WARM (Ilık, sıcak): Having a comfortable degree of mild heat. E.g.: \"The spring sunshine feels pleasantly warm.\""
      },
      {
        "id": "we_g7_e_41",
        "word": "CALM",
        "clue": "Not nervous, angry, or upset; peaceful",
        "turkishMeaning": "Sakin, huzurlu",
        "exampleSentence": "He remained calm during the fire drill.",
        "category": "Personality",
        "explanation": "CALM (Sakin, huzurlu): Not nervous, angry, or upset; peaceful. E.g.: \"He remained calm during the fire drill.\""
      },
      {
        "id": "we_g7_e_42",
        "word": "KIND",
        "clue": "Generous, helpful, and caring about other people",
        "turkishMeaning": "Kibar, nazik",
        "exampleSentence": "She was very kind to the new student.",
        "category": "Personality",
        "explanation": "KIND (Kibar, nazik): Generous, helpful, and caring about other people. E.g.: \"She was very kind to the new student.\""
      },
      {
        "id": "we_g7_e_43",
        "word": "BOLD",
        "clue": "Brave and confident; not afraid to take risks",
        "turkishMeaning": "Cesur, cüretkâr",
        "exampleSentence": "The bold explorer entered the dark cave.",
        "category": "Personality",
        "explanation": "BOLD (Cesur, cüretkâr): Brave and confident; not afraid to take risks. E.g.: \"The bold explorer entered the dark cave.\""
      },
      {
        "id": "we_g7_e_44",
        "word": "WARM",
        "clue": "Having a comfortable degree of heat or friendly",
        "turkishMeaning": "Ilık / Samimi",
        "exampleSentence": "We received a warm welcome in London.",
        "category": "Personality & Climate",
        "explanation": "WARM (Ilık / Samimi): Having a comfortable degree of heat or friendly. E.g.: \"We received a warm welcome in London.\""
      },
      {
        "id": "we_g7_e_45",
        "word": "GOAL",
        "clue": "A point scored in football or an ambition",
        "turkishMeaning": "Hedef / Gol",
        "exampleSentence": "He scored the winning goal in the finals.",
        "category": "Sports",
        "explanation": "GOAL (Hedef / Gol): A point scored in football or an ambition. E.g.: \"He scored the winning goal in the finals.\""
      },
      {
        "id": "we_g7_e_46",
        "word": "BALL",
        "clue": "A round object used in tennis, football, and golf",
        "turkishMeaning": "Top",
        "exampleSentence": "Kick the ball into the opponent's net.",
        "category": "Sports",
        "explanation": "BALL (Top): A round object used in tennis, football, and golf. E.g.: \"Kick the ball into the opponent's net.\""
      },
      {
        "id": "we_g7_e_47",
        "word": "RACE",
        "clue": "A competition to see who is the fastest",
        "turkishMeaning": "Yarış",
        "exampleSentence": "She won the hundred-meter sprinting race.",
        "category": "Sports",
        "explanation": "RACE (Yarış): A competition to see who is the fastest. E.g.: \"She won the hundred-meter sprinting race.\""
      },
      {
        "id": "we_g7_e_48",
        "word": "TEAM",
        "clue": "A group of players competing together on one side",
        "turkishMeaning": "Takım",
        "exampleSentence": "Our basketball team won the cup.",
        "category": "Sports",
        "explanation": "TEAM (Takım): A group of players competing together on one side. E.g.: \"Our basketball team won the cup.\""
      },
      {
        "id": "we_g7_e_49",
        "word": "BORN",
        "clue": "Brought into life by birth",
        "turkishMeaning": "Doğmuş",
        "exampleSentence": "He was born in Ankara in 2011.",
        "category": "Biographies",
        "explanation": "BORN (Doğmuş): Brought into life by birth. E.g.: \"He was born in Ankara in 2011.\""
      },
      {
        "id": "we_g7_e_50",
        "word": "DIED",
        "clue": "Stopped living; ceased life",
        "turkishMeaning": "Vefat etti",
        "exampleSentence": "The ancient scientist died centuries ago.",
        "category": "Biographies",
        "explanation": "DIED (Vefat etti): Stopped living; ceased life. E.g.: \"The ancient scientist died centuries ago.\""
      },
      {
        "id": "we_g7_e_51",
        "word": "PAST",
        "clue": "The period of time before the present day",
        "turkishMeaning": "Geçmiş",
        "exampleSentence": "We study the past in our history class.",
        "category": "Biographies",
        "explanation": "PAST (Geçmiş): The period of time before the present day. E.g.: \"We study the past in our history class.\""
      },
      {
        "id": "we_g7_e_52",
        "word": "WILD",
        "clue": "Living in natural conditions without human care",
        "turkishMeaning": "Vahşi, doğal",
        "exampleSentence": "Wild deer roam freely in the reserve.",
        "category": "Wild Animals",
        "explanation": "WILD (Vahşi, doğal): Living in natural conditions without human care. E.g.: \"Wild deer roam freely in the reserve.\""
      },
      {
        "id": "we_g7_e_53",
        "word": "LION",
        "clue": "A large wild cat of the African savannah",
        "turkishMeaning": "Aslan",
        "exampleSentence": "The male lion has a thick golden mane.",
        "category": "Wild Animals",
        "explanation": "LION (Aslan): A large wild cat of the African savannah. E.g.: \"The male lion has a thick golden mane.\""
      },
      {
        "id": "we_g7_e_54",
        "word": "BEAR",
        "clue": "A heavy wild mammal with thick fur and claws",
        "turkishMeaning": "Ayı",
        "exampleSentence": "The brown bear catches salmon in the river.",
        "category": "Wild Animals",
        "explanation": "BEAR (Ayı): A heavy wild mammal with thick fur and claws. E.g.: \"The brown bear catches salmon in the river.\""
      },
      {
        "id": "we_g7_e_55",
        "word": "WOLF",
        "clue": "A wild carnivorous canine hunting in packs",
        "turkishMeaning": "Kurt",
        "exampleSentence": "A pack of wolves howled at the full moon.",
        "category": "Wild Animals",
        "explanation": "WOLF (Kurt): A wild carnivorous canine hunting in packs. E.g.: \"A pack of wolves howled at the full moon.\""
      },
      {
        "id": "we_g7_e_56",
        "word": "SHOW",
        "clue": "A television program or theatrical performance",
        "turkishMeaning": "Dizi, gösteri",
        "exampleSentence": "My sister watches a quiz show at night.",
        "category": "Television",
        "explanation": "SHOW (Dizi, gösteri): A television program or theatrical performance. E.g.: \"My sister watches a quiz show at night.\""
      },
      {
        "id": "we_g7_e_57",
        "word": "NEWS",
        "clue": "Information about recent events on television",
        "turkishMeaning": "Haberler",
        "exampleSentence": "My father watches the evening news at eight.",
        "category": "Television",
        "explanation": "NEWS (Haberler): Information about recent events on television. E.g.: \"My father watches the evening news at eight.\""
      },
      {
        "id": "we_g7_e_58",
        "word": "HOST",
        "clue": "A person who introduces guests on a television show",
        "turkishMeaning": "Sunucu",
        "exampleSentence": "The host asked the actor funny questions.",
        "category": "Television",
        "explanation": "HOST (Sunucu): A person who introduces guests on a television show. E.g.: \"The host asked the actor funny questions.\""
      },
      {
        "id": "we_g7_e_59",
        "word": "FILM",
        "clue": "A motion picture shown in cinemas or on TV",
        "turkishMeaning": "Film",
        "exampleSentence": "We watched an exciting action film together.",
        "category": "Television",
        "explanation": "FILM (Film): A motion picture shown in cinemas or on TV. E.g.: \"We watched an exciting action film together.\""
      },
      {
        "id": "we_g7_e_60",
        "word": "GIFT",
        "clue": "A present given to someone on a special occasion",
        "turkishMeaning": "Hediye",
        "exampleSentence": "I wrapped a special gift for my best friend.",
        "category": "Celebrations",
        "explanation": "GIFT (Hediye): A present given to someone on a special occasion. E.g.: \"I wrapped a special gift for my best friend.\""
      },
      {
        "id": "we_g7_e_61",
        "word": "CARD",
        "clue": "A piece of thick paper with a greeting message",
        "turkishMeaning": "Tebrik kartı",
        "exampleSentence": "She sent a colorful birthday card to her pal.",
        "category": "Celebrations",
        "explanation": "CARD (Tebrik kartı): A piece of thick paper with a greeting message. E.g.: \"She sent a colorful birthday card to her pal.\""
      },
      {
        "id": "we_g7_e_62",
        "word": "HOPE",
        "clue": "A feeling of expectation and desire for the future",
        "turkishMeaning": "Umut, ummak",
        "exampleSentence": "I hope to study astrophysics at university.",
        "category": "Dreams",
        "explanation": "HOPE (Umut, ummak): A feeling of expectation and desire for the future. E.g.: \"I hope to study astrophysics at university.\""
      },
      {
        "id": "we_g7_e_63",
        "word": "WISH",
        "clue": "A desire or hope for something to happen",
        "turkishMeaning": "Dilek, dilemek",
        "exampleSentence": "Make a wish before blowing out candles.",
        "category": "Dreams",
        "explanation": "WISH (Dilek, dilemek): A desire or hope for something to happen. E.g.: \"Make a wish before blowing out candles.\""
      },
      {
        "id": "we_g7_e_64",
        "word": "BANK",
        "clue": "A financial building where people save money",
        "turkishMeaning": "Banka",
        "exampleSentence": "He deposited cash at the municipal bank.",
        "category": "Public Buildings",
        "explanation": "BANK (Banka): A financial building where people save money. E.g.: \"He deposited cash at the municipal bank.\""
      },
      {
        "id": "we_g7_e_65",
        "word": "MALL",
        "clue": "A large enclosed building with many retail shops",
        "turkishMeaning": "Alışveriş merkezi",
        "exampleSentence": "We met our classmates at the shopping mall.",
        "category": "Public Buildings",
        "explanation": "MALL (Alışveriş merkezi): A large enclosed building with many retail shops. E.g.: \"We met our classmates at the shopping mall.\""
      },
      {
        "id": "we_g7_e_66",
        "word": "PARK",
        "clue": "A large public green area for recreation",
        "turkishMeaning": "Park",
        "exampleSentence": "Children ride bicycles in the city park.",
        "category": "Public Buildings",
        "explanation": "PARK (Park): A large public green area for recreation. E.g.: \"Children ride bicycles in the city park.\""
      },
      {
        "id": "we_g7_e_67",
        "word": "CAFE",
        "clue": "A small restaurant where drinks and snacks are sold",
        "turkishMeaning": "Kafe",
        "exampleSentence": "We ordered hot chocolate at the local cafe.",
        "category": "Public Buildings",
        "explanation": "CAFE (Kafe): A small restaurant where drinks and snacks are sold. E.g.: \"We ordered hot chocolate at the local cafe.\""
      },
      {
        "id": "we_g7_e_68",
        "word": "TREE",
        "clue": "A tall perennial woody plant with leaves",
        "turkishMeaning": "Ağaç",
        "exampleSentence": "Students planted a pine tree in the park.",
        "category": "Environment",
        "explanation": "TREE (Ağaç): A tall perennial woody plant with leaves. E.g.: \"Students planted a pine tree in the park.\""
      },
      {
        "id": "we_g7_e_69",
        "word": "SAVE",
        "clue": "To keep safe from harm or conserve resources",
        "turkishMeaning": "Korumak, tasarruf etmek",
        "exampleSentence": "Turn off taps to save freshwater supplies.",
        "category": "Environment",
        "explanation": "SAVE (Korumak, tasarruf etmek): To keep safe from harm or conserve resources. E.g.: \"Turn off taps to save freshwater supplies.\""
      },
      {
        "id": "we_g7_e_70",
        "word": "SOIL",
        "clue": "The top layer of Earth where plants grow",
        "turkishMeaning": "Toprak",
        "exampleSentence": "Rich soil helps saplings grow sturdy roots.",
        "category": "Environment",
        "explanation": "SOIL (Toprak): The top layer of Earth where plants grow. E.g.: \"Rich soil helps saplings grow sturdy roots.\""
      },
      {
        "id": "we_g7_e_71",
        "word": "LEAF",
        "clue": "A flat green structure growing from plant stems",
        "turkishMeaning": "Yaprak",
        "exampleSentence": "Autumn leaves fell softly from the oak tree.",
        "category": "Environment",
        "explanation": "LEAF (Yaprak): A flat green structure growing from plant stems. E.g.: \"Autumn leaves fell softly from the oak tree.\""
      },
      {
        "id": "we_g7_e_72",
        "word": "STAR",
        "clue": "A luminous celestial sphere of plasma in space",
        "turkishMeaning": "Yıldız",
        "exampleSentence": "The North Star guides travelers at night.",
        "category": "Planets",
        "explanation": "STAR (Yıldız): A luminous celestial sphere of plasma in space. E.g.: \"The North Star guides travelers at night.\""
      },
      {
        "id": "we_g7_e_73",
        "word": "MOON",
        "clue": "The natural satellite orbiting planet Earth",
        "turkishMeaning": "Ay",
        "exampleSentence": "The full moon shone brightly in the night sky.",
        "category": "Planets",
        "explanation": "MOON (Ay): The natural satellite orbiting planet Earth. E.g.: \"The full moon shone brightly in the night sky.\""
      },
      {
        "id": "we_g7_e_74",
        "word": "MARS",
        "clue": "The fourth planet from the Sun, known as red planet",
        "turkishMeaning": "Mars",
        "exampleSentence": "Robotic rovers explore the dry surface of Mars.",
        "category": "Planets",
        "explanation": "MARS (Mars): The fourth planet from the Sun, known as red planet. E.g.: \"Robotic rovers explore the dry surface of Mars.\""
      },
      {
        "id": "we_g7_e_75",
        "word": "DATA",
        "clue": "Facts and statistics stored on computer systems",
        "turkishMeaning": "Veri, bilgi",
        "exampleSentence": "Keep your private data secure online.",
        "category": "Life Online",
        "explanation": "DATA (Veri, bilgi): Facts and statistics stored on computer systems. E.g.: \"Keep your private data secure online.\""
      },
      {
        "id": "we_g7_e_76",
        "word": "SAFE",
        "clue": "Protected from danger, harm, or digital risk",
        "turkishMeaning": "Güvenli",
        "exampleSentence": "Choose a safe password for your game account.",
        "category": "Life Online",
        "explanation": "SAFE (Güvenli): Protected from danger, harm, or digital risk. E.g.: \"Choose a safe password for your game account.\""
      },
      {
        "id": "we_g7_e_77",
        "word": "USER",
        "clue": "A person who uses a computer or software service",
        "turkishMeaning": "Kullanıcı",
        "exampleSentence": "Each online user has a unique username.",
        "category": "Life Online",
        "explanation": "USER (Kullanıcı): A person who uses a computer or software service. E.g.: \"Each online user has a unique username.\""
      },
      {
        "id": "we_g7_e_78",
        "word": "HURT",
        "clue": "To cause physical pain or injury to someone",
        "turkishMeaning": "İncitmek / Yaralı",
        "exampleSentence": "He hurt his knee while playing basketball.",
        "category": "In and Out of Danger",
        "explanation": "HURT (İncitmek / Yaralı): To cause physical pain or injury to someone. E.g.: \"He hurt his knee while playing basketball.\""
      },
      {
        "id": "we_g7_e_79",
        "word": "BURN",
        "clue": "An injury caused by exposure to heat or fire",
        "turkishMeaning": "Yanık",
        "exampleSentence": "Run cold tap water over a minor heat burn.",
        "category": "In and Out of Danger",
        "explanation": "BURN (Yanık): An injury caused by exposure to heat or fire. E.g.: \"Run cold tap water over a minor heat burn.\""
      },
      {
        "id": "we_g7_e_80",
        "word": "HELP",
        "clue": "Assistance or aid given to someone in need",
        "turkishMeaning": "Yardım etmek",
        "exampleSentence": "Dial emergency services when you need help.",
        "category": "In and Out of Danger",
        "explanation": "HELP (Yardım etmek): Assistance or aid given to someone in need. E.g.: \"Dial emergency services when you need help.\""
      }
    ],
    "medium": [
      {
        "id": "we_g7_m_01",
        "word": "SMART",
        "clue": "Having or showing quick intelligence",
        "turkishMeaning": "Zeki, akıllı",
        "exampleSentence": "She is a smart student who solves puzzles fast.",
        "category": "Personality",
        "explanation": "SMART (Zeki, akıllı): Having or showing quick intelligence. E.g.: \"She is a smart student who solves puzzles fast.\""
      },
      {
        "id": "we_g7_m_02",
        "word": "BRAVE",
        "clue": "Ready to face danger or pain without fear",
        "turkishMeaning": "Cesur",
        "exampleSentence": "Firefighters are brave people who save lives.",
        "category": "Personality",
        "explanation": "BRAVE (Cesur): Ready to face danger or pain without fear. E.g.: \"Firefighters are brave people who save lives.\""
      },
      {
        "id": "we_g7_m_03",
        "word": "FUNNY",
        "clue": "Causing laughter or amusement",
        "turkishMeaning": "Komik, eğlenceli",
        "exampleSentence": "The comedy film was funny and made us laugh.",
        "category": "Personality",
        "explanation": "FUNNY (Komik, eğlenceli): Causing laughter or amusement. E.g.: \"The comedy film was funny and made us laugh.\""
      },
      {
        "id": "we_g7_m_04",
        "word": "QUIET",
        "clue": "Making very little or no sound",
        "turkishMeaning": "Sessiz, sakin",
        "exampleSentence": "Please keep quiet while studying in the library.",
        "category": "Personality",
        "explanation": "QUIET (Sessiz, sakin): Making very little or no sound. E.g.: \"Please keep quiet while studying in the library.\""
      },
      {
        "id": "we_g7_m_05",
        "word": "SHORT",
        "clue": "Measuring a small distance from head to foot",
        "turkishMeaning": "Kısa",
        "exampleSentence": "He is shorter than his older brother.",
        "category": "Appearance",
        "explanation": "SHORT (Kısa): Measuring a small distance from head to foot. E.g.: \"He is shorter than his older brother.\""
      },
      {
        "id": "we_g7_m_06",
        "word": "PLUMP",
        "clue": "Having a pleasantly soft, rounded shape",
        "turkishMeaning": "Balık etli, tombul",
        "exampleSentence": "The baby has cute plump cheeks.",
        "category": "Appearance",
        "explanation": "PLUMP (Balık etli, tombul): Having a pleasantly soft, rounded shape. E.g.: \"The baby has cute plump cheeks.\""
      },
      {
        "id": "we_g7_m_07",
        "word": "TRAIN",
        "clue": "To practice a sport or skill regularly",
        "turkishMeaning": "Antrenman yapmak",
        "exampleSentence": "Athletes train hard every day before the finals.",
        "category": "Sports",
        "explanation": "TRAIN (Antrenman yapmak): To practice a sport or skill regularly. E.g.: \"Athletes train hard every day before the finals.\""
      },
      {
        "id": "we_g7_m_08",
        "word": "MATCH",
        "clue": "A sports competition between two teams or players",
        "turkishMeaning": "Maç, karşılaşma",
        "exampleSentence": "Our school won the championship football match.",
        "category": "Sports",
        "explanation": "MATCH (Maç, karşılaşma): A sports competition between two teams or players. E.g.: \"Our school won the championship football match.\""
      },
      {
        "id": "we_g7_m_09",
        "word": "COURT",
        "clue": "A marked area for playing games like tennis",
        "turkishMeaning": "Kort, saha",
        "exampleSentence": "They reserved the tennis court for Saturday morning.",
        "category": "Sports",
        "explanation": "COURT (Kort, saha): A marked area for playing games like tennis. E.g.: \"They reserved the tennis court for Saturday morning.\""
      },
      {
        "id": "we_g7_m_10",
        "word": "COACH",
        "clue": "A person who trains an athlete or a sports team",
        "turkishMeaning": "Antrenör, koç",
        "exampleSentence": "The basketball coach gave inspiring advice.",
        "category": "Sports",
        "explanation": "COACH (Antrenör, koç): A person who trains an athlete or a sports team. E.g.: \"The basketball coach gave inspiring advice.\""
      },
      {
        "id": "we_g7_m_11",
        "word": "PRIZE",
        "clue": "An award given to the winner of a contest",
        "turkishMeaning": "Ödül",
        "exampleSentence": "He received the first prize in the painting contest.",
        "category": "Biographies",
        "explanation": "PRIZE (Ödül): An award given to the winner of a contest. E.g.: \"He received the first prize in the painting contest.\""
      },
      {
        "id": "we_g7_m_12",
        "word": "AWARD",
        "clue": "A recognition given for great achievement",
        "turkishMeaning": "Ödül, takdir",
        "exampleSentence": "Marie Curie received the Nobel award in science.",
        "category": "Biographies",
        "explanation": "AWARD (Ödül, takdir): A recognition given for great achievement. E.g.: \"Marie Curie received the Nobel award in science.\""
      },
      {
        "id": "we_g7_m_13",
        "word": "EAGLE",
        "clue": "A large bird of prey with keen eyesight",
        "turkishMeaning": "Kartal",
        "exampleSentence": "The golden eagle soared high above the mountains.",
        "category": "Wild Animals",
        "explanation": "EAGLE (Kartal): A large bird of prey with keen eyesight. E.g.: \"The golden eagle soared high above the mountains.\""
      },
      {
        "id": "we_g7_m_14",
        "word": "TIGER",
        "clue": "A large striped carnivorous wild feline",
        "turkishMeaning": "Kaplan",
        "exampleSentence": "Tigers are endangered and live in dense forests.",
        "category": "Wild Animals",
        "explanation": "TIGER (Kaplan): A large striped carnivorous wild feline. E.g.: \"Tigers are endangered and live in dense forests.\""
      },
      {
        "id": "we_g7_m_15",
        "word": "WHALE",
        "clue": "A very large marine mammal that breathes air",
        "turkishMeaning": "Balina",
        "exampleSentence": "The blue whale is the largest animal on Earth.",
        "category": "Wild Animals",
        "explanation": "WHALE (Balina): A very large marine mammal that breathes air. E.g.: \"The blue whale is the largest animal on Earth.\""
      },
      {
        "id": "we_g7_m_16",
        "word": "SHARK",
        "clue": "A large ocean predator fish with sharp teeth",
        "turkishMeaning": "Köpekbalığı",
        "exampleSentence": "The great white shark swam through coral reefs.",
        "category": "Wild Animals",
        "explanation": "SHARK (Köpekbalığı): A large ocean predator fish with sharp teeth. E.g.: \"The great white shark swam through coral reefs.\""
      },
      {
        "id": "we_g7_m_17",
        "word": "ACTOR",
        "clue": "A person who performs in plays, movies, or shows",
        "turkishMeaning": "Oyuncu, aktör",
        "exampleSentence": "The famous actor starred in a popular TV drama.",
        "category": "Television",
        "explanation": "ACTOR (Oyuncu, aktör): A person who performs in plays, movies, or shows. E.g.: \"The famous actor starred in a popular TV drama.\""
      },
      {
        "id": "we_g7_m_18",
        "word": "PARTY",
        "clue": "A social gathering of invited guests for celebration",
        "turkishMeaning": "Parti, kutlama",
        "exampleSentence": "We are organizing a surprise birthday party.",
        "category": "Celebrations",
        "explanation": "PARTY (Parti, kutlama): A social gathering of invited guests for celebration. E.g.: \"We are organizing a surprise birthday party.\""
      },
      {
        "id": "we_g7_m_19",
        "word": "GUEST",
        "clue": "A person invited to visit or attend an event",
        "turkishMeaning": "Misafir, konuk",
        "exampleSentence": "Each guest received a small welcome card.",
        "category": "Celebrations",
        "explanation": "GUEST (Misafir, konuk): A person invited to visit or attend an event. E.g.: \"Each guest received a small welcome card.\""
      },
      {
        "id": "we_g7_m_20",
        "word": "CLOWN",
        "clue": "A comic entertainer wearing funny costume and makeup",
        "turkishMeaning": "Palyaço",
        "exampleSentence": "The funny clown made balloon animals for children.",
        "category": "Celebrations",
        "explanation": "CLOWN (Palyaço): A comic entertainer wearing funny costume and makeup. E.g.: \"The funny clown made balloon animals for children.\""
      },
      {
        "id": "we_g7_m_21",
        "word": "MUSIC",
        "clue": "Vocal or instrumental sounds combined with rhythm",
        "turkishMeaning": "Müzik",
        "exampleSentence": "Lively music played at the festival celebration.",
        "category": "Celebrations",
        "explanation": "MUSIC (Müzik): Vocal or instrumental sounds combined with rhythm. E.g.: \"Lively music played at the festival celebration.\""
      },
      {
        "id": "we_g7_m_22",
        "word": "DREAM",
        "clue": "A cherished ambition, aspiration, or sleeping vision",
        "turkishMeaning": "Rüya, hayal",
        "exampleSentence": "Her lifelong dream is to travel around the world.",
        "category": "Dreams",
        "explanation": "DREAM (Rüya, hayal): A cherished ambition, aspiration, or sleeping vision. E.g.: \"Her lifelong dream is to travel around the world.\""
      },
      {
        "id": "we_g7_m_23",
        "word": "EARTH",
        "clue": "The third planet from the Sun and our home planet",
        "turkishMeaning": "Dünya gezegeni",
        "exampleSentence": "Earth has liquid water and supports diverse life.",
        "category": "Planets",
        "explanation": "EARTH (Dünya gezegeni): The third planet from the Sun and our home planet. E.g.: \"Earth has liquid water and supports diverse life.\""
      },
      {
        "id": "we_g7_m_24",
        "word": "SPACE",
        "clue": "The vast boundless region beyond Earth atmosphere",
        "turkishMeaning": "Uzay",
        "exampleSentence": "Astronauts float weightlessly in outer space.",
        "category": "Planets",
        "explanation": "SPACE (Uzay): The vast boundless region beyond Earth atmosphere. E.g.: \"Astronauts float weightlessly in outer space.\""
      },
      {
        "id": "we_g7_m_25",
        "word": "COMET",
        "clue": "An icy celestial object that develops a glowing tail",
        "turkishMeaning": "Kuyruklu yıldız",
        "exampleSentence": "Halley is a famous comet visible every 75 years.",
        "category": "Planets",
        "explanation": "COMET (Kuyruklu yıldız): An icy celestial object that develops a glowing tail. E.g.: \"Halley is a famous comet visible every 75 years.\""
      },
      {
        "id": "we_g7_m_26",
        "word": "ORBIT",
        "clue": "The curved path of a celestial object around a star",
        "turkishMeaning": "Yörünge",
        "exampleSentence": "The Moon completes an orbit around Earth each month.",
        "category": "Planets",
        "explanation": "ORBIT (Yörünge): The curved path of a celestial object around a star. E.g.: \"The Moon completes an orbit around Earth each month.\""
      },
      {
        "id": "we_g7_m_27",
        "word": "SOLAR",
        "clue": "Relating to or determined by the sun energy",
        "turkishMeaning": "Güneşle ilgili",
        "exampleSentence": "Solar panels turn clean sunlight into electricity.",
        "category": "Environment",
        "explanation": "SOLAR (Güneşle ilgili): Relating to or determined by the sun energy. E.g.: \"Solar panels turn clean sunlight into electricity.\""
      },
      {
        "id": "we_g7_m_28",
        "word": "CLEAN",
        "clue": "Free from dirt, marks, or unwanted pollution",
        "turkishMeaning": "Temiz, temizlemek",
        "exampleSentence": "We must keep our neighborhood parks clean.",
        "category": "Environment",
        "explanation": "CLEAN (Temiz, temizlemek): Free from dirt, marks, or unwanted pollution. E.g.: \"We must keep our neighborhood parks clean.\""
      },
      {
        "id": "we_g7_m_29",
        "word": "PLANT",
        "clue": "A living organism absorbing water and sunlight",
        "turkishMeaning": "Bitki, dikmek",
        "exampleSentence": "Let us plant fresh flowers in the courtyard.",
        "category": "Environment",
        "explanation": "PLANT (Bitki, dikmek): A living organism absorbing water and sunlight. E.g.: \"Let us plant fresh flowers in the courtyard.\""
      },
      {
        "id": "we_g7_m_30",
        "word": "GREEN",
        "clue": "The color of growing grass and eco-friendly nature",
        "turkishMeaning": "Yeşil, doğa dostu",
        "exampleSentence": "Riding a bicycle is a green way to commute.",
        "category": "Environment",
        "explanation": "GREEN (Yeşil, doğa dostu): The color of growing grass and eco-friendly nature. E.g.: \"Riding a bicycle is a green way to commute.\""
      },
      {
        "id": "we_g7_m_31",
        "word": "TRASH",
        "clue": "Waste material or discarded items",
        "turkishMeaning": "Çöp, atık",
        "exampleSentence": "Throw your plastic bottles into the recycling trash.",
        "category": "Environment",
        "explanation": "TRASH (Çöp, atık): Waste material or discarded items. E.g.: \"Throw your plastic bottles into the recycling trash.\""
      },
      {
        "id": "we_g7_m_32",
        "word": "WATER",
        "clue": "A colorless transparent liquid vital for all life",
        "turkishMeaning": "Su",
        "exampleSentence": "Drink plenty of fresh water during hot summer days.",
        "category": "Environment",
        "explanation": "WATER (Su): A colorless transparent liquid vital for all life. E.g.: \"Drink plenty of fresh water during hot summer days.\""
      },
      {
        "id": "we_g7_m_33",
        "word": "OCEAN",
        "clue": "A very large expanse of sea covering Earth",
        "turkishMeaning": "Okyanus",
        "exampleSentence": "We must protect ocean life from plastic waste.",
        "category": "Environment",
        "explanation": "OCEAN (Okyanus): A very large expanse of sea covering Earth. E.g.: \"We must protect ocean life from plastic waste.\""
      },
      {
        "id": "we_g7_m_34",
        "word": "RIVER",
        "clue": "A large natural stream of water flowing to the sea",
        "turkishMeaning": "Nehir, ırmak",
        "exampleSentence": "The river flows calmly through the mountain valley.",
        "category": "Environment",
        "explanation": "RIVER (Nehir, ırmak): A large natural stream of water flowing to the sea. E.g.: \"The river flows calmly through the mountain valley.\""
      },
      {
        "id": "we_g7_m_35",
        "word": "HABIT",
        "clue": "A settled or regular practice that you repeat",
        "turkishMeaning": "Alışkanlık",
        "exampleSentence": "Reading books before sleep is a great habit.",
        "category": "Dreams",
        "explanation": "HABIT (Alışkanlık): A settled or regular practice that you repeat. E.g.: \"Reading books before sleep is a great habit.\""
      },
      {
        "id": "we_g7_m_36",
        "word": "SHINE",
        "clue": "To give out or reflect a bright light",
        "turkishMeaning": "Parlamak, ışıldamak",
        "exampleSentence": "Stars shine brightly on clear cloudless nights.",
        "category": "Planets",
        "explanation": "SHINE (Parlamak, ışıldamak): To give out or reflect a bright light. E.g.: \"Stars shine brightly on clear cloudless nights.\""
      },
      {
        "id": "we_g7_m_37",
        "word": "STORM",
        "clue": "Violent atmospheric disturbance with strong winds",
        "turkishMeaning": "Fırtına",
        "exampleSentence": "The thunder storm brought heavy rain and lightning.",
        "category": "Environment",
        "explanation": "STORM (Fırtına): Violent atmospheric disturbance with strong winds. E.g.: \"The thunder storm brought heavy rain and lightning.\""
      },
      {
        "id": "we_g7_m_38",
        "word": "CLOUD",
        "clue": "A visible mass of condensed water vapor in the sky",
        "turkishMeaning": "Bulut",
        "exampleSentence": "White fluffy clouds drifted across the blue sky.",
        "category": "Environment",
        "explanation": "CLOUD (Bulut): A visible mass of condensed water vapor in the sky. E.g.: \"White fluffy clouds drifted across the blue sky.\""
      },
      {
        "id": "we_g7_m_39",
        "word": "LIGHT",
        "clue": "The natural agent that stimulates sight and illumines",
        "turkishMeaning": "Işık",
        "exampleSentence": "Turn off the bedroom light when leaving the room.",
        "category": "Environment",
        "explanation": "LIGHT (Işık): The natural agent that stimulates sight and illumines. E.g.: \"Turn off the bedroom light when leaving the room.\""
      },
      {
        "id": "we_g7_m_40",
        "word": "GLOBE",
        "clue": "A spherical representation of the Earth or the world",
        "turkishMeaning": "Küre, yerküre",
        "exampleSentence": "Our geography teacher spun the classroom globe.",
        "category": "Public Buildings",
        "explanation": "GLOBE (Küre, yerküre): A spherical representation of the Earth or the world. E.g.: \"Our geography teacher spun the classroom globe.\""
      },
      {
        "id": "we_g7_m_41",
        "word": "SMART",
        "clue": "Having or showing a high degree of intelligence",
        "turkishMeaning": "Zeki, akıllı",
        "exampleSentence": "The smart student solved the equation swiftly.",
        "category": "Personality",
        "explanation": "SMART (Zeki, akıllı): Having or showing a high degree of intelligence. E.g.: \"The smart student solved the equation swiftly.\""
      },
      {
        "id": "we_g7_m_42",
        "word": "BRAVE",
        "clue": "Ready to face danger or pain without showing fear",
        "turkishMeaning": "Cesur",
        "exampleSentence": "The brave firefighter rescued the trapped kitten.",
        "category": "Personality",
        "explanation": "BRAVE (Cesur): Ready to face danger or pain without showing fear. E.g.: \"The brave firefighter rescued the trapped kitten.\""
      },
      {
        "id": "we_g7_m_43",
        "word": "SHARP",
        "clue": "Having a thin edge or quick at understanding",
        "turkishMeaning": "Keskin / Zeki",
        "exampleSentence": "She has a sharp mind for solving puzzles.",
        "category": "Personality",
        "explanation": "SHARP (Keskin / Zeki): Having a thin edge or quick at understanding. E.g.: \"She has a sharp mind for solving puzzles.\""
      },
      {
        "id": "we_g7_m_44",
        "word": "TRACK",
        "clue": "A circular path for runners or a walking trail",
        "turkishMeaning": "Pist / Patika",
        "exampleSentence": "Athletes warmed up along the red gravel track.",
        "category": "Sports",
        "explanation": "TRACK (Pist / Patika): A circular path for runners or a walking trail. E.g.: \"Athletes warmed up along the red gravel track.\""
      },
      {
        "id": "we_g7_m_45",
        "word": "MEDAL",
        "clue": "A metal disc given as a prize for winning",
        "turkishMeaning": "Madalya",
        "exampleSentence": "He earned a silver medal in the swim meet.",
        "category": "Sports",
        "explanation": "MEDAL (Madalya): A metal disc given as a prize for winning. E.g.: \"He earned a silver medal in the swim meet.\""
      },
      {
        "id": "we_g7_m_46",
        "word": "COACH",
        "clue": "A person who trains an athletic sports team",
        "turkishMeaning": "Antrenör",
        "exampleSentence": "The coach designed winning tactics for Sunday.",
        "category": "Sports",
        "explanation": "COACH (Antrenör): A person who trains an athletic sports team. E.g.: \"The coach designed winning tactics for Sunday.\""
      },
      {
        "id": "we_g7_m_47",
        "word": "PITCH",
        "clue": "A grass field used for playing football or rugby",
        "turkishMeaning": "Saha",
        "exampleSentence": "Rain drenched the grassy football pitch.",
        "category": "Sports",
        "explanation": "PITCH (Saha): A grass field used for playing football or rugby. E.g.: \"Rain drenched the grassy football pitch.\""
      },
      {
        "id": "we_g7_m_48",
        "word": "PRIZE",
        "clue": "An award given to the winner of a contest",
        "turkishMeaning": "Ödül",
        "exampleSentence": "First prize went to the robotics invention.",
        "category": "Biographies",
        "explanation": "PRIZE (Ödül): An award given to the winner of a contest. E.g.: \"First prize went to the robotics invention.\""
      },
      {
        "id": "we_g7_m_49",
        "word": "EARLY",
        "clue": "Happening near the beginning of a period or day",
        "turkishMeaning": "Erken",
        "exampleSentence": "He woke up early to study for his finals.",
        "category": "Biographies",
        "explanation": "EARLY (Erken): Happening near the beginning of a period or day. E.g.: \"He woke up early to study for his finals.\""
      },
      {
        "id": "we_g7_m_50",
        "word": "TIGER",
        "clue": "A large wild striped predatory Asian feline",
        "turkishMeaning": "Kaplan",
        "exampleSentence": "The royal Bengal tiger prowled the jungle.",
        "category": "Wild Animals",
        "explanation": "TIGER (Kaplan): A large wild striped predatory Asian feline. E.g.: \"The royal Bengal tiger prowled the jungle.\""
      },
      {
        "id": "we_g7_m_51",
        "word": "EAGLE",
        "clue": "A large bird of prey with keen eyesight and talons",
        "turkishMeaning": "Kartal",
        "exampleSentence": "The golden eagle circled above the alpine peaks.",
        "category": "Wild Animals",
        "explanation": "EAGLE (Kartal): A large bird of prey with keen eyesight and talons. E.g.: \"The golden eagle circled above the alpine peaks.\""
      },
      {
        "id": "we_g7_m_52",
        "word": "SHARK",
        "clue": "A predatory marine fish with cartilaginous skeleton",
        "turkishMeaning": "Köpekbalığı",
        "exampleSentence": "The white shark patrolled deep ocean waters.",
        "category": "Wild Animals",
        "explanation": "SHARK (Köpekbalığı): A predatory marine fish with cartilaginous skeleton. E.g.: \"The white shark patrolled deep ocean waters.\""
      },
      {
        "id": "we_g7_m_53",
        "word": "WHALE",
        "clue": "A massive marine mammal that surfaces to breathe",
        "turkishMeaning": "Balina",
        "exampleSentence": "The blue whale is Earth's largest mammal.",
        "category": "Wild Animals",
        "explanation": "WHALE (Balina): A massive marine mammal that surfaces to breathe. E.g.: \"The blue whale is Earth's largest mammal.\""
      },
      {
        "id": "we_g7_m_54",
        "word": "ZEBRA",
        "clue": "A wild African equine with black and white stripes",
        "turkishMeaning": "Zebra",
        "exampleSentence": "A herd of zebras drank at the waterhole.",
        "category": "Wild Animals",
        "explanation": "ZEBRA (Zebra): A wild African equine with black and white stripes. E.g.: \"A herd of zebras drank at the waterhole.\""
      },
      {
        "id": "we_g7_m_55",
        "word": "SCENE",
        "clue": "A sequence of continuous action in a film or show",
        "turkishMeaning": "Sahne",
        "exampleSentence": "The movie ended with an emotional farewell scene.",
        "category": "Television",
        "explanation": "SCENE (Sahne): A sequence of continuous action in a film or show. E.g.: \"The movie ended with an emotional farewell scene.\""
      },
      {
        "id": "we_g7_m_56",
        "word": "ACTOR",
        "clue": "A person who portrays a character in films or plays",
        "turkishMeaning": "Oyuncu",
        "exampleSentence": "The young actor delivered an impressive monologue.",
        "category": "Television",
        "explanation": "ACTOR (Oyuncu): A person who portrays a character in films or plays. E.g.: \"The young actor delivered an impressive monologue.\""
      },
      {
        "id": "we_g7_m_57",
        "word": "DRAMA",
        "clue": "A serious play or television show depicting conflict",
        "turkishMeaning": "Dram, tiyatro",
        "exampleSentence": "We watched an engaging historical school drama.",
        "category": "Television",
        "explanation": "DRAMA (Dram, tiyatro): A serious play or television show depicting conflict. E.g.: \"We watched an engaging historical school drama.\""
      },
      {
        "id": "we_g7_m_58",
        "word": "EVENT",
        "clue": "A planned public or social celebration occasion",
        "turkishMeaning": "Etkinlik",
        "exampleSentence": "Our graduation festival was an unforgettable event.",
        "category": "Celebrations",
        "explanation": "EVENT (Etkinlik): A planned public or social celebration occasion. E.g.: \"Our graduation festival was an unforgettable event.\""
      },
      {
        "id": "we_g7_m_59",
        "word": "PARTY",
        "clue": "A social gathering for celebration and fun",
        "turkishMeaning": "Parti",
        "exampleSentence": "Classmates danced happily at the farewell party.",
        "category": "Celebrations",
        "explanation": "PARTY (Parti): A social gathering for celebration and fun. E.g.: \"Classmates danced happily at the farewell party.\""
      },
      {
        "id": "we_g7_m_60",
        "word": "GUEST",
        "clue": "A person who is invited to visit someone's home",
        "turkishMeaning": "Misafir",
        "exampleSentence": "Greet each guest with a warm and polite smile.",
        "category": "Celebrations",
        "explanation": "GUEST (Misafir): A person who is invited to visit someone's home. E.g.: \"Greet each guest with a warm and polite smile.\""
      },
      {
        "id": "we_g7_m_61",
        "word": "DREAM",
        "clue": "A series of thoughts or ambitions for the future",
        "turkishMeaning": "Rüya, hayal",
        "exampleSentence": "Her dream is to become a marine biologist.",
        "category": "Dreams",
        "explanation": "DREAM (Rüya, hayal): A series of thoughts or ambitions for the future. E.g.: \"Her dream is to become a marine biologist.\""
      },
      {
        "id": "we_g7_m_62",
        "word": "PEACE",
        "clue": "Freedom from disturbance, hostility, or warfare",
        "turkishMeaning": "Barış, huzur",
        "exampleSentence": "Nations strive to maintain international peace.",
        "category": "Dreams",
        "explanation": "PEACE (Barış, huzur): Freedom from disturbance, hostility, or warfare. E.g.: \"Nations strive to maintain international peace.\""
      },
      {
        "id": "we_g7_m_63",
        "word": "PLAZA",
        "clue": "A public square or marketplace in an urban center",
        "turkishMeaning": "Meydan, çarşı",
        "exampleSentence": "Musicians performed in the central town plaza.",
        "category": "Public Buildings",
        "explanation": "PLAZA (Meydan, çarşı): A public square or marketplace in an urban center. E.g.: \"Musicians performed in the central town plaza.\""
      },
      {
        "id": "we_g7_m_64",
        "word": "HOTEL",
        "clue": "An establishment providing accommodation for guests",
        "turkishMeaning": "Otel",
        "exampleSentence": "Tourists booked rooms at a historic seaside hotel.",
        "category": "Public Buildings",
        "explanation": "HOTEL (Otel): An establishment providing accommodation for guests. E.g.: \"Tourists booked rooms at a historic seaside hotel.\""
      },
      {
        "id": "we_g7_m_65",
        "word": "CLOTH",
        "clue": "Woven or felted fabric used for garments",
        "turkishMeaning": "Kumaş",
        "exampleSentence": "Tailors sew suits from fine woolen cloth.",
        "category": "Public Buildings",
        "explanation": "CLOTH (Kumaş): Woven or felted fabric used for garments. E.g.: \"Tailors sew suits from fine woolen cloth.\""
      },
      {
        "id": "we_g7_m_66",
        "word": "STORE",
        "clue": "A retail shop where goods are kept and sold",
        "turkishMeaning": "Mağaza",
        "exampleSentence": "The sports store sells durable hiking gear.",
        "category": "Public Buildings",
        "explanation": "STORE (Mağaza): A retail shop where goods are kept and sold. E.g.: \"The sports store sells durable hiking gear.\""
      },
      {
        "id": "we_g7_m_67",
        "word": "CLEAN",
        "clue": "Free from dirt, pollution, or chemical stains",
        "turkishMeaning": "Temiz, temizlemek",
        "exampleSentence": "Keep your neighborhood parks clean and tidy.",
        "category": "Environment",
        "explanation": "CLEAN (Temiz, temizlemek): Free from dirt, pollution, or chemical stains. E.g.: \"Keep your neighborhood parks clean and tidy.\""
      },
      {
        "id": "we_g7_m_68",
        "word": "PLANT",
        "clue": "A living organism that absorbs water through roots",
        "turkishMeaning": "Bitki / Dikmek",
        "exampleSentence": "Volunteers plant saplings along the hillside.",
        "category": "Environment",
        "explanation": "PLANT (Bitki / Dikmek): A living organism that absorbs water through roots. E.g.: \"Volunteers plant saplings along the hillside.\""
      },
      {
        "id": "we_g7_m_69",
        "word": "WATER",
        "clue": "A transparent odorless liquid vital for life",
        "turkishMeaning": "Su",
        "exampleSentence": "Drink pure water to maintain physical energy.",
        "category": "Environment",
        "explanation": "WATER (Su): A transparent odorless liquid vital for life. E.g.: \"Drink pure water to maintain physical energy.\""
      },
      {
        "id": "we_g7_m_70",
        "word": "SOLAR",
        "clue": "Relating to or derived from the radiant Sun",
        "turkishMeaning": "Güneş ile ilgili",
        "exampleSentence": "Solar panels supply green power to schools.",
        "category": "Environment",
        "explanation": "SOLAR (Güneş ile ilgili): Relating to or derived from the radiant Sun. E.g.: \"Solar panels supply green power to schools.\""
      },
      {
        "id": "we_g7_m_71",
        "word": "ORBIT",
        "clue": "The curved gravitational path of a celestial body",
        "turkishMeaning": "Yörünge",
        "exampleSentence": "Satellites orbit Earth every ninety minutes.",
        "category": "Planets",
        "explanation": "ORBIT (Yörünge): The curved gravitational path of a celestial body. E.g.: \"Satellites orbit Earth every ninety minutes.\""
      },
      {
        "id": "we_g7_m_72",
        "word": "EARTH",
        "clue": "The third planet from the Sun; our terrestrial home",
        "turkishMeaning": "Dünya",
        "exampleSentence": "Earth is the only planet known to host life.",
        "category": "Planets",
        "explanation": "EARTH (Dünya): The third planet from the Sun; our terrestrial home. E.g.: \"Earth is the only planet known to host life.\""
      },
      {
        "id": "we_g7_m_73",
        "word": "SPACE",
        "clue": "The boundless three-dimensional expanse of the cosmos",
        "turkishMeaning": "Uzay",
        "exampleSentence": "Astronauts float weightlessly in outer space.",
        "category": "Planets",
        "explanation": "SPACE (Uzay): The boundless three-dimensional expanse of the cosmos. E.g.: \"Astronauts float weightlessly in outer space.\""
      },
      {
        "id": "we_g7_m_74",
        "word": "PROBE",
        "clue": "An unmanned robotic spacecraft exploring space",
        "turkishMeaning": "Sonda",
        "exampleSentence": "The space probe sent back photos of Saturn's rings.",
        "category": "Planets",
        "explanation": "PROBE (Sonda): An unmanned robotic spacecraft exploring space. E.g.: \"The space probe sent back photos of Saturn's rings.\""
      },
      {
        "id": "we_g7_m_75",
        "word": "LOGON",
        "clue": "The act of logging into a secure computer account",
        "turkishMeaning": "Giriş yapmak",
        "exampleSentence": "Always logoff properly after each online session.",
        "category": "Life Online",
        "explanation": "LOGON (Giriş yapmak): The act of logging into a secure computer account. E.g.: \"Always logoff properly after each online session.\""
      },
      {
        "id": "we_g7_m_76",
        "word": "CLICK",
        "clue": "To press and release a mouse button or link",
        "turkishMeaning": "Tıklamak",
        "exampleSentence": "Never click on suspicious web links from strangers.",
        "category": "Life Online",
        "explanation": "CLICK (Tıklamak): To press and release a mouse button or link. E.g.: \"Never click on suspicious web links from strangers.\""
      },
      {
        "id": "we_g7_m_77",
        "word": "SHARE",
        "clue": "To distribute or post digital files with friends",
        "turkishMeaning": "Paylaşmak",
        "exampleSentence": "Share study notes responsibly with your group.",
        "category": "Life Online",
        "explanation": "SHARE (Paylaşmak): To distribute or post digital files with friends. E.g.: \"Share study notes responsibly with your group.\""
      },
      {
        "id": "we_g7_m_78",
        "word": "FIRST",
        "clue": "Preceding all others in time, order, or importance",
        "turkishMeaning": "İlk, birinci",
        "exampleSentence": "First aid should be delivered without delay.",
        "category": "In and Out of Danger",
        "explanation": "FIRST (İlk, birinci): Preceding all others in time, order, or importance. E.g.: \"First aid should be delivered without delay.\""
      },
      {
        "id": "we_g7_m_79",
        "word": "ALERT",
        "clue": "Quick to notice danger or an emergency warning",
        "turkishMeaning": "Alarm / Uyanık",
        "exampleSentence": "The weather alert warned hikers of heavy snow.",
        "category": "In and Out of Danger",
        "explanation": "ALERT (Alarm / Uyanık): Quick to notice danger or an emergency warning. E.g.: \"The weather alert warned hikers of heavy snow.\""
      },
      {
        "id": "we_g7_m_80",
        "word": "STORM",
        "clue": "Violent weather with gales, rain, or thunder",
        "turkishMeaning": "Fırtına",
        "exampleSentence": "The mountain storm forced travelers to take shelter.",
        "category": "In and Out of Danger",
        "explanation": "STORM (Fırtına): Violent weather with gales, rain, or thunder. E.g.: \"The mountain storm forced travelers to take shelter.\""
      }
    ],
    "hard": [
      {
        "id": "we_g7_h_01",
        "word": "HONEST",
        "clue": "Free of deceit and untruthfulness; sincere",
        "turkishMeaning": "Dürüst",
        "exampleSentence": "An honest student always tells the truth.",
        "category": "Personality",
        "explanation": "HONEST (Dürüst): Free of deceit and untruthfulness; sincere. E.g.: \"An honest student always tells the truth.\""
      },
      {
        "id": "we_g7_h_02",
        "word": "CLUMSY",
        "clue": "Awkward in movement or handling things",
        "turkishMeaning": "Sakar",
        "exampleSentence": "He dropped the glass because he was clumsy.",
        "category": "Personality",
        "explanation": "CLUMSY (Sakar): Awkward in movement or handling things. E.g.: \"He dropped the glass because he was clumsy.\""
      },
      {
        "id": "we_g7_h_03",
        "word": "POLITE",
        "clue": "Having good manners and showing respect for others",
        "turkishMeaning": "Kibar, nazik",
        "exampleSentence": "Saying thank you is polite and courteous.",
        "category": "Personality",
        "explanation": "POLITE (Kibar, nazik): Having good manners and showing respect for others. E.g.: \"Saying thank you is polite and courteous.\""
      },
      {
        "id": "we_g7_h_04",
        "word": "BLONDE",
        "clue": "Having fair or pale yellow hair",
        "turkishMeaning": "Sarışın",
        "exampleSentence": "She has wavy blonde hair and blue eyes.",
        "category": "Appearance",
        "explanation": "BLONDE (Sarışın): Having fair or pale yellow hair. E.g.: \"She has wavy blonde hair and blue eyes.\""
      },
      {
        "id": "we_g7_h_05",
        "word": "FAMOUS",
        "clue": "Known about by many people around the world",
        "turkishMeaning": "Ünlü, meşhur",
        "exampleSentence": "The famous scientist gave a lecture at university.",
        "category": "Biographies",
        "explanation": "FAMOUS (Ünlü, meşhur): Known about by many people around the world. E.g.: \"The famous scientist gave a lecture at university.\""
      },
      {
        "id": "we_g7_h_06",
        "word": "CAREER",
        "clue": "An occupation undertaken for a significant period",
        "turkishMeaning": "Kariyer, meslek",
        "exampleSentence": "She built a successful career in medicine.",
        "category": "Biographies",
        "explanation": "CAREER (Kariyer, meslek): An occupation undertaken for a significant period. E.g.: \"She built a successful career in medicine.\""
      },
      {
        "id": "we_g7_h_07",
        "word": "TENNIS",
        "clue": "A racket sport played on a marked rectangular court",
        "turkishMeaning": "Tenis",
        "exampleSentence": "They play tennis every Sunday afternoon.",
        "category": "Sports",
        "explanation": "TENNIS (Tenis): A racket sport played on a marked rectangular court. E.g.: \"They play tennis every Sunday afternoon.\""
      },
      {
        "id": "we_g7_h_08",
        "word": "RUNNER",
        "clue": "An athlete who competes in running races",
        "turkishMeaning": "Koşucu",
        "exampleSentence": "The marathon runner crossed the finish line first.",
        "category": "Sports",
        "explanation": "RUNNER (Koşucu): An athlete who competes in running races. E.g.: \"The marathon runner crossed the finish line first.\""
      },
      {
        "id": "we_g7_h_09",
        "word": "TROPHY",
        "clue": "A decorative cup or award won in a competition",
        "turkishMeaning": "Kupa, ödül",
        "exampleSentence": "Our school won the championship trophy.",
        "category": "Sports",
        "explanation": "TROPHY (Kupa, ödül): A decorative cup or award won in a competition. E.g.: \"Our school won the championship trophy.\""
      },
      {
        "id": "we_g7_h_10",
        "word": "MONKEY",
        "clue": "A playful primate living in tropical trees",
        "turkishMeaning": "Maymun",
        "exampleSentence": "The clever monkey swung easily between the branches.",
        "category": "Wild Animals",
        "explanation": "MONKEY (Maymun): A playful primate living in tropical trees. E.g.: \"The clever monkey swung easily between the branches.\""
      },
      {
        "id": "we_g7_h_11",
        "word": "RABBIT",
        "clue": "A burrowing plant-eating mammal with long ears",
        "turkishMeaning": "Tavşan",
        "exampleSentence": "The white rabbit hopped across the green lawn.",
        "category": "Wild Animals",
        "explanation": "RABBIT (Tavşan): A burrowing plant-eating mammal with long ears. E.g.: \"The white rabbit hopped across the green lawn.\""
      },
      {
        "id": "we_g7_h_12",
        "word": "JUNGLE",
        "clue": "An area of land overgrown with dense tropical forest",
        "turkishMeaning": "Balta girmemiş orman",
        "exampleSentence": "Many exotic birds live in the Amazon jungle.",
        "category": "Wild Animals",
        "explanation": "JUNGLE (Balta girmemiş orman): An area of land overgrown with dense tropical forest. E.g.: \"Many exotic birds live in the Amazon jungle.\""
      },
      {
        "id": "we_g7_h_13",
        "word": "DESERT",
        "clue": "A barren dry area of land with little precipitation",
        "turkishMeaning": "Çöl",
        "exampleSentence": "Camels can survive long journeys across the desert.",
        "category": "Wild Animals",
        "explanation": "DESERT (Çöl): A barren dry area of land with little precipitation. E.g.: \"Camels can survive long journeys across the desert.\""
      },
      {
        "id": "we_g7_h_14",
        "word": "INSECT",
        "clue": "A small arthropod with six legs and three body parts",
        "turkishMeaning": "Böcek",
        "exampleSentence": "A butterfly is a colorful flying insect.",
        "category": "Wild Animals",
        "explanation": "INSECT (Böcek): A small arthropod with six legs and three body parts. E.g.: \"A butterfly is a colorful flying insect.\""
      },
      {
        "id": "we_g7_h_15",
        "word": "SITCOM",
        "clue": "A humorous television drama series with regular cast",
        "turkishMeaning": "Durum komedisi, sitkom",
        "exampleSentence": "We watched a funny family sitcom on television.",
        "category": "Television",
        "explanation": "SITCOM (Durum komedisi, sitkom): A humorous television drama series with regular cast. E.g.: \"We watched a funny family sitcom on television.\""
      },
      {
        "id": "we_g7_h_16",
        "word": "CINEMA",
        "clue": "A theater where movies are shown for entertainment",
        "turkishMeaning": "Sinema",
        "exampleSentence": "We went to the cinema to watch the new animation.",
        "category": "Public Buildings",
        "explanation": "CINEMA (Sinema): A theater where movies are shown for entertainment. E.g.: \"We went to the cinema to watch the new animation.\""
      },
      {
        "id": "we_g7_h_17",
        "word": "BAKERY",
        "clue": "A shop where bread, rolls, and cakes are baked",
        "turkishMeaning": "Fırın, pastane",
        "exampleSentence": "The warm scent of fresh bread came from the bakery.",
        "category": "Public Buildings",
        "explanation": "BAKERY (Fırın, pastane): A shop where bread, rolls, and cakes are baked. E.g.: \"The warm scent of fresh bread came from the bakery.\""
      },
      {
        "id": "we_g7_h_18",
        "word": "MUSEUM",
        "clue": "A building displaying historical or artistic objects",
        "turkishMeaning": "Müze",
        "exampleSentence": "We visited the science museum on our school trip.",
        "category": "Public Buildings",
        "explanation": "MUSEUM (Müze): A building displaying historical or artistic objects. E.g.: \"We visited the science museum on our school trip.\""
      },
      {
        "id": "we_g7_h_19",
        "word": "MARKET",
        "clue": "An open area or hall where farm produce is sold",
        "turkishMeaning": "Pazar, market",
        "exampleSentence": "They bought fresh fruits at the weekend market.",
        "category": "Public Buildings",
        "explanation": "MARKET (Pazar, market): An open area or hall where farm produce is sold. E.g.: \"They bought fresh fruits at the weekend market.\""
      },
      {
        "id": "we_g7_h_20",
        "word": "INVITE",
        "clue": "To ask someone formally to attend an event or party",
        "turkishMeaning": "Davet etmek",
        "exampleSentence": "I want to invite all my classmates to the party.",
        "category": "Celebrations",
        "explanation": "INVITE (Davet etmek): To ask someone formally to attend an event or party. E.g.: \"I want to invite all my classmates to the party.\""
      },
      {
        "id": "we_g7_h_21",
        "word": "CANDLE",
        "clue": "A cylinder of wax with a wick burned for light",
        "turkishMeaning": "Mum",
        "exampleSentence": "Light twelve candles on the birthday cake.",
        "category": "Celebrations",
        "explanation": "CANDLE (Mum): A cylinder of wax with a wick burned for light. E.g.: \"Light twelve candles on the birthday cake.\""
      },
      {
        "id": "we_g7_h_22",
        "word": "RIBBON",
        "clue": "A narrow strip of decorative fabric",
        "turkishMeaning": "Kurdele",
        "exampleSentence": "She tied a shiny red ribbon around the gift box.",
        "category": "Celebrations",
        "explanation": "RIBBON (Kurdele): A narrow strip of decorative fabric used for gifts. E.g.: 'She tied a shiny red ribbon around the gift box.'",
        "contentVersion": 2
      },
      {
        "id": "we_g7_h_23",
        "word": "FUTURE",
        "clue": "The time or a period of time following the present",
        "turkishMeaning": "Gelecek",
        "exampleSentence": "In the future, electric cars will be everywhere.",
        "category": "Dreams",
        "explanation": "FUTURE (Gelecek): The time or a period of time following the present. E.g.: \"In the future, electric cars will be everywhere.\""
      },
      {
        "id": "we_g7_h_24",
        "word": "TRAVEL",
        "clue": "To make a journey across different cities or lands",
        "turkishMeaning": "Seyahat etmek",
        "exampleSentence": "I hope to travel to exciting new countries.",
        "category": "Dreams",
        "explanation": "TRAVEL (Seyahat etmek): To make a journey across different cities or lands. E.g.: \"I hope to travel to exciting new countries.\""
      },
      {
        "id": "we_g7_h_25",
        "word": "PLANET",
        "clue": "A celestial body orbiting a star such as the Sun",
        "turkishMeaning": "Gezegen",
        "exampleSentence": "Jupiter is the largest planet in our solar system.",
        "category": "Planets",
        "explanation": "PLANET (Gezegen): A celestial body orbiting a star such as the Sun. E.g.: \"Jupiter is the largest planet in our solar system.\""
      },
      {
        "id": "we_g7_h_26",
        "word": "CRATER",
        "clue": "A large bowl-shaped cavity formed by a meteorite",
        "turkishMeaning": "Krater",
        "exampleSentence": "The surface of the Moon is covered with craters.",
        "category": "Planets",
        "explanation": "CRATER (Krater): A large bowl-shaped cavity formed by a meteorite. E.g.: \"The surface of the Moon is covered with craters.\""
      },
      {
        "id": "we_g7_h_27",
        "word": "GALAXY",
        "clue": "A system of millions or billions of stars and dust",
        "turkishMeaning": "Galaksi, gök ada",
        "exampleSentence": "The Milky Way is our home galaxy in the cosmos.",
        "category": "Planets",
        "explanation": "GALAXY (Galaksi, gök ada): A system of millions or billions of stars and dust. E.g.: \"The Milky Way is our home galaxy in the cosmos.\""
      },
      {
        "id": "we_g7_h_28",
        "word": "SYSTEM",
        "clue": "A set of connected things working together",
        "turkishMeaning": "Sistem",
        "exampleSentence": "Eight planets orbit the Sun in our solar system.",
        "category": "Planets",
        "explanation": "SYSTEM (Sistem): A set of connected things working together. E.g.: \"Eight planets orbit the Sun in our solar system.\""
      },
      {
        "id": "we_g7_h_29",
        "word": "NATURE",
        "clue": "The physical world including plants, animals, and earth",
        "turkishMeaning": "Doğa, tabiat",
        "exampleSentence": "Spending time in nature reduces stress and fatigue.",
        "category": "Environment",
        "explanation": "NATURE (Doğa, tabiat): The physical world including plants, animals, and earth. E.g.: \"Spending time in nature reduces stress and fatigue.\""
      },
      {
        "id": "we_g7_h_30",
        "word": "ANIMAL",
        "clue": "A living organism that feeds on organic matter",
        "turkishMeaning": "Hayvan",
        "exampleSentence": "A dolphin is an intelligent and friendly marine animal.",
        "category": "Wild Animals",
        "explanation": "ANIMAL (Hayvan): A living organism that feeds on organic matter. E.g.: \"A dolphin is an intelligent and friendly marine animal.\""
      },
      {
        "id": "we_g7_h_31",
        "word": "DANGER",
        "clue": "The possibility of suffering harm or injury",
        "turkishMeaning": "Tehlike",
        "exampleSentence": "Endangered animals are in danger of extinction.",
        "category": "Wild Animals",
        "explanation": "DANGER (Tehlike): The possibility of suffering harm or injury. E.g.: \"Endangered animals are in danger of extinction.\""
      },
      {
        "id": "we_g7_h_32",
        "word": "DAMAGE",
        "clue": "Physical harm that impairs value, usefulness, or form",
        "turkishMeaning": "Zarar, hasar",
        "exampleSentence": "Pollution causes severe damage to coral reefs.",
        "category": "Environment",
        "explanation": "DAMAGE (Zarar, hasar): Physical harm that impairs value, usefulness, or form. E.g.: \"Pollution causes severe damage to coral reefs.\""
      },
      {
        "id": "we_g7_h_33",
        "word": "RESCUE",
        "clue": "To save someone or something from a dangerous situation",
        "turkishMeaning": "Kurtarmak",
        "exampleSentence": "Volunteers rescue injured wildlife from the wildfire.",
        "category": "Environment",
        "explanation": "RESCUE (Kurtarmak): To save someone or something from a dangerous situation. E.g.: \"Volunteers rescue injured wildlife from the wildfire.\""
      },
      {
        "id": "we_g7_h_34",
        "word": "ENERGY",
        "clue": "Power derived from chemical, physical, or solar sources",
        "turkishMeaning": "Enerji",
        "exampleSentence": "Solar panels generate green electrical energy.",
        "category": "Environment",
        "explanation": "ENERGY (Enerji): Power derived from chemical, physical, or solar sources. E.g.: \"Solar panels generate green electrical energy.\""
      },
      {
        "id": "we_g7_h_35",
        "word": "OXYGEN",
        "clue": "A colorless gas vital for animal and human respiration",
        "turkishMeaning": "Oksijen",
        "exampleSentence": "Trees produce oxygen and purify the air we breathe.",
        "category": "Environment",
        "explanation": "OXYGEN (Oksijen): A colorless gas vital for animal and human respiration. E.g.: \"Trees produce oxygen and purify the air we breathe.\""
      },
      {
        "id": "we_g7_h_36",
        "word": "WONDER",
        "clue": "A feeling of amazement caused by something beautiful",
        "turkishMeaning": "Merak, harika",
        "exampleSentence": "The northern lights are a true wonder of nature.",
        "category": "Environment",
        "explanation": "WONDER (Merak, harika): A feeling of amazement caused by something beautiful. E.g.: \"The northern lights are a true wonder of nature.\""
      },
      {
        "id": "we_g7_h_37",
        "word": "HEAVEN",
        "clue": "The sky, firmament, or a state of supreme happiness",
        "turkishMeaning": "Gök, cennet",
        "exampleSentence": "Looking at starry heavens inspires our imagination.",
        "category": "Planets",
        "explanation": "HEAVEN (Gök, cennet): The sky, firmament, or a state of supreme happiness. E.g.: \"Looking at starry heavens inspires our imagination.\""
      },
      {
        "id": "we_g7_h_38",
        "word": "DOCTOR",
        "clue": "A qualified person trained in medicine to treat patients",
        "turkishMeaning": "Doktor, hekim",
        "exampleSentence": "The doctor examined the patient and prescribed medicine.",
        "category": "Biographies",
        "explanation": "DOCTOR (Doktor, hekim): A qualified person trained in medicine to treat patients. E.g.: \"The doctor examined the patient and prescribed medicine.\""
      },
      {
        "id": "we_g7_h_39",
        "word": "HEALTH",
        "clue": "The state of being free from illness or injury",
        "turkishMeaning": "Sağlık",
        "exampleSentence": "Eating fresh vegetables promotes good physical health.",
        "category": "Environment",
        "explanation": "HEALTH (Sağlık): The state of being free from illness or injury. E.g.: \"Eating fresh vegetables promotes good physical health.\""
      },
      {
        "id": "we_g7_h_40",
        "word": "FOREST",
        "clue": "A large area covered chiefly with trees and undergrowth",
        "turkishMeaning": "Orman",
        "exampleSentence": "The ancient forest is home to hundreds of species.",
        "category": "Wild Animals",
        "explanation": "FOREST (Orman): A large area covered chiefly with trees and undergrowth. E.g.: \"The ancient forest is home to hundreds of species.\""
      },
      {
        "id": "we_g7_h_41",
        "word": "POLITE",
        "clue": "Having or showing courteous and respectful behavior",
        "turkishMeaning": "Kibar, saygılı",
        "exampleSentence": "A polite greeting sets a positive classroom tone.",
        "category": "Personality",
        "explanation": "POLITE (Kibar, saygılı): Having or showing courteous and respectful behavior. E.g.: \"A polite greeting sets a positive classroom tone.\""
      },
      {
        "id": "we_g7_h_42",
        "word": "HONEST",
        "clue": "Free of deceit and untruthfulness; sincere",
        "turkishMeaning": "Dürüst",
        "exampleSentence": "An honest student never cheats on examinations.",
        "category": "Personality",
        "explanation": "HONEST (Dürüst): Free of deceit and untruthfulness; sincere. E.g.: \"An honest student never cheats on examinations.\""
      },
      {
        "id": "we_g7_h_43",
        "word": "STABLE",
        "clue": "Firmly established and not likely to change or fail",
        "turkishMeaning": "Dengeli, istikrarlı",
        "exampleSentence": "A stable friendship withstands occasional disagreements.",
        "category": "Personality",
        "explanation": "STABLE (Dengeli, istikrarlı): Firmly established and not likely to change or fail. E.g.: \"A stable friendship withstands occasional disagreements.\""
      },
      {
        "id": "we_g7_h_44",
        "word": "SPORTS",
        "clue": "Athletic activities requiring skill and physical prowess",
        "turkishMeaning": "Sporlar",
        "exampleSentence": "School sports promote health and mutual respect.",
        "category": "Sports",
        "explanation": "SPORTS (Sporlar): Athletic activities requiring skill and physical prowess. E.g.: \"School sports promote health and mutual respect.\""
      },
      {
        "id": "we_g7_h_45",
        "word": "PLAYER",
        "clue": "A person taking part in an athletic sporting game",
        "turkishMeaning": "Oyuncu",
        "exampleSentence": "The tennis player served five consecutive aces.",
        "category": "Sports",
        "explanation": "PLAYER (Oyuncu): A person taking part in an athletic sporting game. E.g.: \"The tennis player served five consecutive aces.\""
      },
      {
        "id": "we_g7_h_46",
        "word": "ARCHER",
        "clue": "A person who shoots arrows with a bow at targets",
        "turkishMeaning": "Okçu",
        "exampleSentence": "The archer hit the center yellow bullseye.",
        "category": "Sports",
        "explanation": "ARCHER (Okçu): A person who shoots arrows with a bow at targets. E.g.: \"The archer hit the center yellow bullseye.\""
      },
      {
        "id": "we_g7_h_47",
        "word": "LEAGUE",
        "clue": "A collection of sports teams that compete together",
        "turkishMeaning": "Lig",
        "exampleSentence": "Our soccer club advanced to the national league.",
        "category": "Sports",
        "explanation": "LEAGUE (Lig): A collection of sports teams that compete together. E.g.: \"Our soccer club advanced to the national league.\""
      },
      {
        "id": "we_g7_h_48",
        "word": "CAREER",
        "clue": "An occupation undertaken for a significant life period",
        "turkishMeaning": "Kariyer",
        "exampleSentence": "She pursued a successful scientific research career.",
        "category": "Biographies",
        "explanation": "CAREER (Kariyer): An occupation undertaken for a significant life period. E.g.: \"She pursued a successful scientific research career.\""
      },
      {
        "id": "we_g7_h_49",
        "word": "FAMOUS",
        "clue": "Known and recognized by numerous people worldwide",
        "turkishMeaning": "Ünlü",
        "exampleSentence": "The famous inventor shared his patent insights.",
        "category": "Biographies",
        "explanation": "FAMOUS (Ünlü): Known and recognized by numerous people worldwide. E.g.: \"The famous inventor shared his patent insights.\""
      },
      {
        "id": "we_g7_h_50",
        "word": "HONOUR",
        "clue": "High respect, great esteem, or a public tribute",
        "turkishMeaning": "Onur, şeref",
        "exampleSentence": "Winning the championship brought great honour.",
        "category": "Biographies",
        "explanation": "HONOUR (Onur, şeref): High respect, great esteem, or a public tribute. E.g.: \"Winning the championship brought great honour.\""
      },
      {
        "id": "we_g7_h_51",
        "word": "JUNGLE",
        "clue": "An area of dense tropical forest with wild tangled trees",
        "turkishMeaning": "Balta girmemiş orman",
        "exampleSentence": "Tigers prowl through the shadowed tropical jungle.",
        "category": "Wild Animals",
        "explanation": "JUNGLE (Balta girmemiş orman): An area of dense tropical forest with wild tangled trees. E.g.: \"Tigers prowl through the shadowed tropical jungle.\""
      },
      {
        "id": "we_g7_h_52",
        "word": "MONKEY",
        "clue": "A wild primate with a long tail living in tree branches",
        "turkishMeaning": "Maymun",
        "exampleSentence": "The nimble monkey swung gracefully between vines.",
        "category": "Wild Animals",
        "explanation": "MONKEY (Maymun): A wild primate with a long tail living in tree branches. E.g.: \"The nimble monkey swung gracefully between vines.\""
      },
      {
        "id": "we_g7_h_53",
        "word": "FALCON",
        "clue": "A bird of prey with long pointed wings and sharp talons",
        "turkishMeaning": "Doğan, şahin",
        "exampleSentence": "The peregrine falcon dives at extraordinary speeds.",
        "category": "Wild Animals",
        "explanation": "FALCON (Doğan, şahin): A bird of prey with long pointed wings and sharp talons. E.g.: \"The peregrine falcon dives at extraordinary speeds.\""
      },
      {
        "id": "we_g7_h_54",
        "word": "SAFARI",
        "clue": "An expedition to observe wild animals in habitats",
        "turkishMeaning": "Safari",
        "exampleSentence": "Tourists photographed giraffes on a wildlife safari.",
        "category": "Wild Animals",
        "explanation": "SAFARI (Safari): An expedition to observe wild animals in habitats. E.g.: \"Tourists photographed giraffes on a wildlife safari.\""
      },
      {
        "id": "we_g7_h_55",
        "word": "SERIES",
        "clue": "A set of television episodes featuring the same cast",
        "turkishMeaning": "Dizi",
        "exampleSentence": "The documentary series explored ocean coral reefs.",
        "category": "Television",
        "explanation": "SERIES (Dizi): A set of television episodes featuring the same cast. E.g.: \"The documentary series explored ocean coral reefs.\""
      },
      {
        "id": "we_g7_h_56",
        "word": "AUTHOR",
        "clue": "A writer of a book, article, or television report",
        "turkishMeaning": "Yazar",
        "exampleSentence": "The author signed copies of her new history book.",
        "category": "Television",
        "explanation": "AUTHOR (Yazar): A writer of a book, article, or television report. E.g.: \"The author signed copies of her new history book.\""
      },
      {
        "id": "we_g7_h_57",
        "word": "CAMERA",
        "clue": "A device for recording visual images or videos",
        "turkishMeaning": "Kamera",
        "exampleSentence": "The television camera zoomed in on the presenter.",
        "category": "Television",
        "explanation": "CAMERA (Kamera): A device for recording visual images or videos. E.g.: \"The television camera zoomed in on the presenter.\""
      },
      {
        "id": "we_g7_h_58",
        "word": "SCREEN",
        "clue": "The flat surface on a television showing pictures",
        "turkishMeaning": "Ekran",
        "exampleSentence": "We watched the match on a large classroom screen.",
        "category": "Television",
        "explanation": "SCREEN (Ekran): The flat surface on a television showing pictures. E.g.: \"We watched the match on a large classroom screen.\""
      },
      {
        "id": "we_g7_h_59",
        "word": "STREAM",
        "clue": "A continuous flow of data or a small forest brook",
        "turkishMeaning": "Akış / Dere",
        "exampleSentence": "Students stream educational lectures from the web.",
        "category": "Television & Environment",
        "explanation": "STREAM (Akış / Dere): A continuous flow of data or a small forest brook. E.g.: \"Students stream educational lectures from the web.\""
      },
      {
        "id": "we_g7_h_60",
        "word": "CANDLE",
        "clue": "A cylinder of wax with a wick burned for light",
        "turkishMeaning": "Mum",
        "exampleSentence": "Blow out every birthday candle in a single breath.",
        "category": "Celebrations",
        "explanation": "CANDLE (Mum): A cylinder of wax with a wick burned for light. E.g.: \"Blow out every birthday candle in a single breath.\""
      },
      {
        "id": "we_g7_h_61",
        "word": "BANNER",
        "clue": "A long strip of cloth bearing a festive slogan",
        "turkishMeaning": "Pankart, afiş",
        "exampleSentence": "They hung a welcome banner across the doorway.",
        "category": "Celebrations",
        "explanation": "BANNER (Pankart, afiş): A long strip of cloth bearing a festive slogan. E.g.: \"They hung a welcome banner across the doorway.\""
      },
      {
        "id": "we_g7_h_62",
        "word": "PARADE",
        "clue": "A public procession celebrating a special occasion",
        "turkishMeaning": "Geçit töreni",
        "exampleSentence": "Musicians marched in the Republic Day parade.",
        "category": "Celebrations",
        "explanation": "PARADE (Geçit töreni): A public procession celebrating a special occasion. E.g.: \"Musicians marched in the Republic Day parade.\""
      },
      {
        "id": "we_g7_h_63",
        "word": "INVITE",
        "clue": "To request the presence or company of someone",
        "turkishMeaning": "Davet etmek",
        "exampleSentence": "Be sure to invite your study group to the party.",
        "category": "Celebrations",
        "explanation": "INVITE (Davet etmek): To request the presence or company of someone. E.g.: \"Be sure to invite your study group to the party.\""
      },
      {
        "id": "we_g7_h_64",
        "word": "FUTURE",
        "clue": "The period of time that will come after present",
        "turkishMeaning": "Gelecek",
        "exampleSentence": "Renewable energy will power cities in the future.",
        "category": "Dreams",
        "explanation": "FUTURE (Gelecek): The period of time that will come after present. E.g.: \"Renewable energy will power cities in the future.\""
      },
      {
        "id": "we_g7_h_65",
        "word": "FLYING",
        "clue": "Moving through air using wings or an aircraft",
        "turkishMeaning": "Uçuş, uçma",
        "exampleSentence": "He dreamed of flying among planetary constellations.",
        "category": "Dreams",
        "explanation": "FLYING (Uçuş, uçma): Moving through air using wings or an aircraft. E.g.: \"He dreamed of flying among planetary constellations.\""
      },
      {
        "id": "we_g7_h_66",
        "word": "MUSEUM",
        "clue": "A building displaying historical and artistic objects",
        "turkishMeaning": "Müze",
        "exampleSentence": "The municipal museum displays ancient Roman coins.",
        "category": "Public Buildings",
        "explanation": "MUSEUM (Müze): A building displaying historical and artistic objects. E.g.: \"The municipal museum displays ancient Roman coins.\""
      },
      {
        "id": "we_g7_h_67",
        "word": "MARKET",
        "clue": "An open-air area where food and merchandise are sold",
        "turkishMeaning": "Pazar, çarşı",
        "exampleSentence": "We bought fresh organic peaches at the market.",
        "category": "Public Buildings",
        "explanation": "MARKET (Pazar, çarşı): An open-air area where food and merchandise are sold. E.g.: \"We bought fresh organic peaches at the market.\""
      },
      {
        "id": "we_g7_h_68",
        "word": "BRIDGE",
        "clue": "A structure carrying a roadway across a river",
        "turkishMeaning": "Köprü",
        "exampleSentence": "Tourists photographed Tower Bridge over the Thames.",
        "category": "Public Buildings & Britain",
        "explanation": "BRIDGE (Köprü): A structure carrying a roadway across a river. E.g.: \"Tourists photographed Tower Bridge over the Thames.\""
      },
      {
        "id": "we_g7_h_69",
        "word": "STREET",
        "clue": "A public road in a city flanked by buildings",
        "turkishMeaning": "Sokak, cadde",
        "exampleSentence": "Street lamps illuminated the historic paved lane.",
        "category": "Public Buildings",
        "explanation": "STREET (Sokak, cadde): A public road in a city flanked by buildings. E.g.: \"Street lamps illuminated the historic paved lane.\""
      },
      {
        "id": "we_g7_h_70",
        "word": "NATURE",
        "clue": "The physical world collective, plants, animals, land",
        "turkishMeaning": "Doğa",
        "exampleSentence": "Spend weekends in nature away from city noise.",
        "category": "Environment",
        "explanation": "NATURE (Doğa): The physical world collective, plants, animals, land. E.g.: \"Spend weekends in nature away from city noise.\""
      },
      {
        "id": "we_g7_h_71",
        "word": "FOREST",
        "clue": "A large area covered chiefly with trees and undergrowth",
        "turkishMeaning": "Orman",
        "exampleSentence": "Protect old-growth forests from commercial logging.",
        "category": "Environment",
        "explanation": "FOREST (Orman): A large area covered chiefly with trees and undergrowth. E.g.: \"Protect old-growth forests from commercial logging.\""
      },
      {
        "id": "we_g7_h_72",
        "word": "PLANET",
        "clue": "A celestial body moving in elliptical orbit around a star",
        "turkishMeaning": "Gezegen",
        "exampleSentence": "Jupiter is the largest planet in our solar family.",
        "category": "Planets",
        "explanation": "PLANET (Gezegen): A celestial body moving in elliptical orbit around a star. E.g.: \"Jupiter is the largest planet in our solar family.\""
      },
      {
        "id": "we_g7_h_73",
        "word": "SATURN",
        "clue": "The sixth planet from the Sun, surrounded by rings",
        "turkishMeaning": "Satürn",
        "exampleSentence": "Saturn possesses thousands of beautiful icy rings.",
        "category": "Planets",
        "explanation": "SATURN (Satürn): The sixth planet from the Sun, surrounded by rings. E.g.: \"Saturn possesses thousands of beautiful icy rings.\""
      },
      {
        "id": "we_g7_h_74",
        "word": "ONLINE",
        "clue": "Connected to or available through digital internet",
        "turkishMeaning": "Çevrim içi",
        "exampleSentence": "Never post personal phone numbers when online.",
        "category": "Life Online",
        "explanation": "ONLINE (Çevrim içi): Connected to or available through digital internet. E.g.: \"Never post personal phone numbers when online.\""
      },
      {
        "id": "we_g7_h_75",
        "word": "BROWSE",
        "clue": "To survey goods or navigate through internet web pages",
        "turkishMeaning": "Göz atmak / Gezinmek",
        "exampleSentence": "Browse reliable scientific websites for project data.",
        "category": "Life Online",
        "explanation": "BROWSE (Göz atmak / Gezinmek): To survey goods or navigate through internet web pages. E.g.: \"Browse reliable scientific websites for project data.\""
      },
      {
        "id": "we_g7_h_76",
        "word": "SAFETY",
        "clue": "The condition of being protected from danger or harm",
        "turkishMeaning": "Güvenlik",
        "exampleSentence": "Follow classroom laboratory safety regulations.",
        "category": "In and Out of Danger",
        "explanation": "SAFETY (Güvenlik): The condition of being protected from danger or harm. E.g.: \"Follow classroom laboratory safety regulations.\""
      },
      {
        "id": "we_g7_h_77",
        "word": "RESCUE",
        "clue": "To save someone from a dangerous or distressing situation",
        "turkishMeaning": "Kurtarmak",
        "exampleSentence": "Coastguards rescue stranded sailors during storms.",
        "category": "In and Out of Danger",
        "explanation": "RESCUE (Kurtarmak): To save someone from a dangerous or distressing situation. E.g.: \"Coastguards rescue stranded sailors during storms.\""
      },
      {
        "id": "we_g7_h_78",
        "word": "HEALTH",
        "clue": "The state of being free from illness or injury",
        "turkishMeaning": "Sağlık",
        "exampleSentence": "Regular exercise maintains physical cardiovascular health.",
        "category": "In and Out of Danger",
        "explanation": "HEALTH (Sağlık): The state of being free from illness or injury. E.g.: \"Regular exercise maintains physical cardiovascular health.\""
      },
      {
        "id": "we_g7_h_79",
        "word": "DOCTOR",
        "clue": "A qualified medical practitioner who treats the sick",
        "turkishMeaning": "Doktor",
        "exampleSentence": "The doctor prescribed soothing syrup for the cough.",
        "category": "In and Out of Danger",
        "explanation": "DOCTOR (Doktor): A qualified medical practitioner who treats the sick. E.g.: \"The doctor prescribed soothing syrup for the cough.\""
      },
      {
        "id": "we_g7_h_80",
        "word": "CASTLE",
        "clue": "A large historic fortified stronghold with towers",
        "turkishMeaning": "Kale, şato",
        "exampleSentence": "Windsor Castle stands proud in the English valley.",
        "category": "Britain",
        "explanation": "CASTLE (Kale, şato): A large historic fortified stronghold with towers. E.g.: \"Windsor Castle stands proud in the English valley.\""
      }
    ]
  },
  "grade-8": {
    "easy": [
      {
        "id": "we_g8_e_01",
        "word": "MATE",
        "clue": "A close friend or companion in school or work",
        "turkishMeaning": "Arkadaş, dost",
        "exampleSentence": "Ali is my best mate and we study together.",
        "category": "Friendship",
        "explanation": "MATE (Arkadaş, dost): A close friend or companion in school or work. E.g.: \"Ali is my best mate and we study together.\""
      },
      {
        "id": "we_g8_e_02",
        "word": "ALLY",
        "clue": "A partner or supporter who helps and cooperates",
        "turkishMeaning": "Müttefik, destekçi",
        "exampleSentence": "A loyal ally stands by you during difficult times.",
        "category": "Friendship",
        "explanation": "ALLY (Müttefik, destekçi): A partner or supporter who helps and cooperates. E.g.: \"A loyal ally stands by you during difficult times.\""
      },
      {
        "id": "we_g8_e_03",
        "word": "TRUE",
        "clue": "In accordance with fact, reality, or loyal fidelity",
        "turkishMeaning": "Gerçek, sadık",
        "exampleSentence": "A true friend will never share your private secrets.",
        "category": "Friendship",
        "explanation": "TRUE (Gerçek, sadık): In accordance with fact, reality, or loyal fidelity. E.g.: \"A true friend will never share your private secrets.\""
      },
      {
        "id": "we_g8_e_04",
        "word": "HANG",
        "clue": "To spend time relaxing together with friends",
        "turkishMeaning": "Vakit geçirmek (hang out)",
        "exampleSentence": "We like to hang out at the youth park on Fridays.",
        "category": "Friendship",
        "explanation": "HANG (Vakit geçirmek (hang out)): To spend time relaxing together with friends. E.g.: \"We like to hang out at the youth park on Fridays.\""
      },
      {
        "id": "we_g8_e_05",
        "word": "CAMP",
        "clue": "An outdoor place where people live temporarily in tents",
        "turkishMeaning": "Kamp yapmak, kamp",
        "exampleSentence": "We set up our tents at the summer adventure camp.",
        "category": "Teen Life",
        "explanation": "CAMP (Kamp yapmak, kamp): An outdoor place where people live temporarily in tents. E.g.: \"We set up our tents at the summer adventure camp.\""
      },
      {
        "id": "we_g8_e_06",
        "word": "ROCK",
        "clue": "A popular genre of lively music featuring electric guitars",
        "turkishMeaning": "Rock müzik",
        "exampleSentence": "My brother loves playing electric rock guitar.",
        "category": "Teen Life",
        "explanation": "ROCK (Rock müzik): A popular genre of lively music featuring electric guitars. E.g.: \"My brother loves playing electric rock guitar.\""
      },
      {
        "id": "we_g8_e_07",
        "word": "JAZZ",
        "clue": "A music style originating from African American communities",
        "turkishMeaning": "Caz müzik",
        "exampleSentence": "The acoustic jazz concert had fantastic trumpet solos.",
        "category": "Teen Life",
        "explanation": "JAZZ (Caz müzik): A music style originating from African American communities. E.g.: \"The acoustic jazz concert had fantastic trumpet solos.\""
      },
      {
        "id": "we_g8_e_08",
        "word": "TREK",
        "clue": "A long arduous journey made on foot through nature",
        "turkishMeaning": "Doğa yürüyüşü",
        "exampleSentence": "We planned a mountain trek through the pine woods.",
        "category": "Teen Life",
        "explanation": "TREK (Doğa yürüyüşü): A long arduous journey made on foot through nature. E.g.: \"We planned a mountain trek through the pine woods.\""
      },
      {
        "id": "we_g8_e_09",
        "word": "HIKE",
        "clue": "A long vigorous walk along woodland trails",
        "turkishMeaning": "Yürüyüşe çıkmak",
        "exampleSentence": "Put on your boots because we will hike up the hill.",
        "category": "Teen Life",
        "explanation": "HIKE (Yürüyüşe çıkmak): A long vigorous walk along woodland trails. E.g.: \"Put on your boots because we will hike up the hill.\""
      },
      {
        "id": "we_g8_e_10",
        "word": "BAKE",
        "clue": "To cook food by dry heat without direct flame in an oven",
        "turkishMeaning": "Fırında pişirmek",
        "exampleSentence": "Grandmother will bake fresh apple pie this evening.",
        "category": "In The Kitchen",
        "explanation": "BAKE (Fırında pişirmek): To cook food by dry heat without direct flame in an oven. E.g.: \"Grandmother will bake fresh apple pie this evening.\""
      },
      {
        "id": "we_g8_e_11",
        "word": "BOIL",
        "clue": "To heat liquid until it bubbles and turns into vapor",
        "turkishMeaning": "Kaynatmak, haşlamak",
        "exampleSentence": "Boil the pasta in salted water for ten minutes.",
        "category": "In The Kitchen",
        "explanation": "BOIL (Kaynatmak, haşlamak): To heat liquid until it bubbles and turns into vapor. E.g.: \"Boil the pasta in salted water for ten minutes.\""
      },
      {
        "id": "we_g8_e_12",
        "word": "CHOP",
        "clue": "To cut food into small pieces using a sharp knife",
        "turkishMeaning": "Doğramak",
        "exampleSentence": "Please chop the onions and carrots for the soup.",
        "category": "In The Kitchen",
        "explanation": "CHOP (Doğramak): To cut food into small pieces using a sharp knife. E.g.: \"Please chop the onions and carrots for the soup.\""
      },
      {
        "id": "we_g8_e_13",
        "word": "COOK",
        "clue": "To prepare food by combining and heating ingredients",
        "turkishMeaning": "Yemek pişirmek",
        "exampleSentence": "My father loves to cook healthy meals for dinner.",
        "category": "In The Kitchen",
        "explanation": "COOK (Yemek pişirmek): To prepare food by combining and heating ingredients. E.g.: \"My father loves to cook healthy meals for dinner.\""
      },
      {
        "id": "we_g8_e_14",
        "word": "CALL",
        "clue": "To contact someone by speaking over the telephone",
        "turkishMeaning": "Aramak, telefon etmek",
        "exampleSentence": "I will call you back when the class finishes.",
        "category": "On The Phone",
        "explanation": "CALL (Aramak, telefon etmek): To contact someone by speaking over the telephone. E.g.: \"I will call you back when the class finishes.\""
      },
      {
        "id": "we_g8_e_15",
        "word": "DIAL",
        "clue": "To enter numbers on a telephone keypad to place a call",
        "turkishMeaning": "Numara tuşlamak",
        "exampleSentence": "Dial the school extension number to reach the office.",
        "category": "On The Phone",
        "explanation": "DIAL (Numara tuşlamak): To enter numbers on a telephone keypad to place a call. E.g.: \"Dial the school extension number to reach the office.\""
      },
      {
        "id": "we_g8_e_16",
        "word": "TEXT",
        "clue": "To send a written electronic message via smartphone",
        "turkishMeaning": "Kısa mesaj atmak",
        "exampleSentence": "Text me the meeting location so I can find you.",
        "category": "On The Phone",
        "explanation": "TEXT (Kısa mesaj atmak): To send a written electronic message via smartphone. E.g.: \"Text me the meeting location so I can find you.\""
      },
      {
        "id": "we_g8_e_17",
        "word": "HOLD",
        "clue": "To wait briefly on a phone call while connected",
        "turkishMeaning": "Hatta beklemek",
        "exampleSentence": "Please hold the line while I transfer your call.",
        "category": "On The Phone",
        "explanation": "HOLD (Hatta beklemek): To wait briefly on a phone call while connected. E.g.: \"Please hold the line while I transfer your call.\""
      },
      {
        "id": "we_g8_e_18",
        "word": "LINE",
        "clue": "A telephone connection or wire",
        "turkishMeaning": "Telefon hattı",
        "exampleSentence": "The phone line was busy so I called back later.",
        "category": "On The Phone",
        "explanation": "LINE (Telefon hattı): A telephone connection or wire. E.g.: \"The phone line was busy so I called back later.\""
      },
      {
        "id": "we_g8_e_19",
        "word": "BLOG",
        "clue": "A regularly updated website written in an informal style",
        "turkishMeaning": "Blog, web günlüğü",
        "exampleSentence": "She publishes travel stories on her personal blog.",
        "category": "The Internet",
        "explanation": "BLOG (Blog, web günlüğü): A regularly updated website written in an informal style. E.g.: \"She publishes travel stories on her personal blog.\""
      },
      {
        "id": "we_g8_e_20",
        "word": "LINK",
        "clue": "A clickable web address connecting electronic pages",
        "turkishMeaning": "Bağlantı, link",
        "exampleSentence": "Click on the blue link to download the study guide.",
        "category": "The Internet",
        "explanation": "LINK (Bağlantı, link): A clickable web address connecting electronic pages. E.g.: \"Click on the blue link to download the study guide.\""
      },
      {
        "id": "we_g8_e_21",
        "word": "WIFI",
        "clue": "A facility allowing computers to connect to the internet",
        "turkishMeaning": "Kablosuz ağ (Wi-Fi)",
        "exampleSentence": "Is there a free Wi-Fi connection in the library?",
        "category": "The Internet",
        "explanation": "WIFI (Kablosuz ağ (Wi-Fi)): A facility allowing computers to connect to the internet. E.g.: \"Is there a free Wi-Fi connection in the library?\""
      },
      {
        "id": "we_g8_e_22",
        "word": "POST",
        "clue": "To publish content or comments online on social media",
        "turkishMeaning": "Gönderi paylaşmak",
        "exampleSentence": "Do not post personal passwords on public forums.",
        "category": "The Internet",
        "explanation": "POST (Gönderi paylaşmak): To publish content or comments online on social media. E.g.: \"Do not post personal passwords on public forums.\""
      },
      {
        "id": "we_g8_e_23",
        "word": "CHAT",
        "clue": "To talk or communicate textually online in real time",
        "turkishMeaning": "Sohbet etmek",
        "exampleSentence": "Students chat online to discuss group homework.",
        "category": "The Internet",
        "explanation": "CHAT (Sohbet etmek): To talk or communicate textually online in real time. E.g.: \"Students chat online to discuss group homework.\""
      },
      {
        "id": "we_g8_e_24",
        "word": "SITE",
        "clue": "A website location connected to the World Wide Web",
        "turkishMeaning": "İnternet sitesi",
        "exampleSentence": "Bookmark this educational site for English practice.",
        "category": "The Internet",
        "explanation": "SITE (İnternet sitesi): A website location connected to the World Wide Web. E.g.: \"Bookmark this educational site for English practice.\""
      },
      {
        "id": "we_g8_e_25",
        "word": "SOAR",
        "clue": "To fly or rise high in the air smoothly and effortlessly",
        "turkishMeaning": "Süzülmek, yükselmek",
        "exampleSentence": "Paragliders soar gracefully over the turquoise sea.",
        "category": "Adventures",
        "explanation": "SOAR (Süzülmek, yükselmek): To fly or rise high in the air smoothly and effortlessly. E.g.: \"Paragliders soar gracefully over the turquoise sea.\""
      },
      {
        "id": "we_g8_e_26",
        "word": "RAFT",
        "clue": "An inflatable boat used for traveling down rushing rivers",
        "turkishMeaning": "Sal, rafting botu",
        "exampleSentence": "We wore life jackets before boarding the white-water raft.",
        "category": "Adventures",
        "explanation": "RAFT (Sal, rafting botu): An inflatable boat used for traveling down rushing rivers. E.g.: \"We wore life jackets before boarding the white-water raft.\""
      },
      {
        "id": "we_g8_e_27",
        "word": "RISK",
        "clue": "A situation involving exposure to danger or hazard",
        "turkishMeaning": "Risk, tehlike",
        "exampleSentence": "Extreme sports involve risk but thrill adventurers.",
        "category": "Adventures",
        "explanation": "RISK (Risk, tehlike): A situation involving exposure to danger or hazard. E.g.: \"Extreme sports involve risk but thrill adventurers.\""
      },
      {
        "id": "we_g8_e_28",
        "word": "TOUR",
        "clue": "A guided journey for pleasure visiting several places",
        "turkishMeaning": "Tur, gezi",
        "exampleSentence": "We joined a guided city tour of historic Istanbul.",
        "category": "Tourism",
        "explanation": "TOUR (Tur, gezi): A guided journey for pleasure visiting several places. E.g.: \"We joined a guided city tour of historic Istanbul.\""
      },
      {
        "id": "we_g8_e_29",
        "word": "TRIP",
        "clue": "A journey or excursion made for business or vacation",
        "turkishMeaning": "Seyahat, yolculuk",
        "exampleSentence": "Our school organized an unforgettable trip to Ephesus.",
        "category": "Tourism",
        "explanation": "TRIP (Seyahat, yolculuk): A journey or excursion made for business or vacation. E.g.: \"Our school organized an unforgettable trip to Ephesus.\""
      },
      {
        "id": "we_g8_e_30",
        "word": "TIDY",
        "clue": "Arranged neatly and in order, or to clean up a room",
        "turkishMeaning": "Düzenli, toplamak",
        "exampleSentence": "Tidy your bedroom before guests arrive for dinner.",
        "category": "Chores",
        "explanation": "TIDY (Düzenli, toplamak): Arranged neatly and in order, or to clean up a room. E.g.: \"Tidy your bedroom before guests arrive for dinner.\""
      },
      {
        "id": "we_g8_e_31",
        "word": "WASH",
        "clue": "To clean with water and soap or detergent",
        "turkishMeaning": "Yıkamak",
        "exampleSentence": "Wash your hands thoroughly before preparing food.",
        "category": "Chores",
        "explanation": "WASH (Yıkamak): To clean with water and soap or detergent. E.g.: \"Wash your hands thoroughly before preparing food.\""
      },
      {
        "id": "we_g8_e_32",
        "word": "DUST",
        "clue": "To wipe away fine dry powder particles from surfaces",
        "turkishMeaning": "Toz almak",
        "exampleSentence": "I must dust the wooden bookshelves in the living room.",
        "category": "Chores",
        "explanation": "DUST (Toz almak): To wipe away fine dry powder particles from surfaces. E.g.: \"I must dust the wooden bookshelves in the living room.\""
      },
      {
        "id": "we_g8_e_33",
        "word": "DISH",
        "clue": "A shallow container for food or tableware to be washed",
        "turkishMeaning": "Bulaşık, tabak",
        "exampleSentence": "It is my turn to load the dirty dishes into the washer.",
        "category": "Chores",
        "explanation": "DISH (Bulaşık, tabak): A shallow container for food or tableware to be washed. E.g.: \"It is my turn to load the dirty dishes into the washer.\""
      },
      {
        "id": "we_g8_e_34",
        "word": "IRON",
        "clue": "To smooth clothes with a heated metal appliance",
        "turkishMeaning": "Ütülemek",
        "exampleSentence": "I need to iron my school shirt for tomorrow.",
        "category": "Chores",
        "explanation": "IRON (Ütülemek): To smooth clothes with a heated metal appliance. E.g.: \"I need to iron my school shirt for tomorrow.\""
      },
      {
        "id": "we_g8_e_35",
        "word": "CURE",
        "clue": "A substance or treatment that relieves a disease",
        "turkishMeaning": "Tedavi, çare",
        "exampleSentence": "Medical scientists are searching for a cure for cancer.",
        "category": "Science",
        "explanation": "CURE (Tedavi, çare): A substance or treatment that relieves a disease. E.g.: \"Medical scientists are searching for a cure for cancer.\""
      },
      {
        "id": "we_g8_e_36",
        "word": "GENE",
        "clue": "A unit of heredity transferred from parent to offspring",
        "turkishMeaning": "Gen",
        "exampleSentence": "Genes determine physical traits such as eye color.",
        "category": "Science",
        "explanation": "GENE (Gen): A unit of heredity transferred from parent to offspring. E.g.: \"Genes determine physical traits such as eye color.\""
      },
      {
        "id": "we_g8_e_37",
        "word": "LABS",
        "clue": "Laboratories equipped for scientific experimentation",
        "turkishMeaning": "Laboratuvarlar",
        "exampleSentence": "Students conducted chemistry experiments in modern labs.",
        "category": "Science",
        "explanation": "LABS (Laboratuvarlar): Laboratories equipped for scientific experimentation. E.g.: \"Students conducted chemistry experiments in modern labs.\""
      },
      {
        "id": "we_g8_e_38",
        "word": "CELL",
        "clue": "The smallest structural and functional unit of an organism",
        "turkishMeaning": "Hücre",
        "exampleSentence": "We examined plant cells under the school microscope.",
        "category": "Science",
        "explanation": "CELL (Hücre): The smallest structural and functional unit of an organism. E.g.: \"We examined plant cells under the school microscope.\""
      },
      {
        "id": "we_g8_e_39",
        "word": "ATOM",
        "clue": "The basic building block of all chemical elements",
        "turkishMeaning": "Atom",
        "exampleSentence": "Atoms consist of protons, neutrons, and electrons.",
        "category": "Science",
        "explanation": "ATOM (Atom): The basic building block of all chemical elements. E.g.: \"Atoms consist of protons, neutrons, and electrons.\""
      },
      {
        "id": "we_g8_e_40",
        "word": "FIRE",
        "clue": "Combustion or burning in which substances produce flame",
        "turkishMeaning": "Yangın, ateş",
        "exampleSentence": "The forest fire was extinguished by brave firefighters.",
        "category": "Natural Forces",
        "explanation": "FIRE (Yangın, ateş): Combustion or burning in which substances produce flame. E.g.: \"The forest fire was extinguished by brave firefighters.\""
      },
      {
        "id": "we_g8_e_41",
        "word": "MATE",
        "clue": "A fellow member, close companion, or school pal",
        "turkishMeaning": "Arkadaş, dost",
        "exampleSentence": "He introduced his study mate to the teacher.",
        "category": "Friendship",
        "explanation": "MATE (Arkadaş, dost): A fellow member, close companion, or school pal. E.g.: \"He introduced his study mate to the teacher.\""
      },
      {
        "id": "we_g8_e_42",
        "word": "TRUE",
        "clue": "In accordance with fact or steadfast and loyal",
        "turkishMeaning": "Doğru, sadık",
        "exampleSentence": "A true companion stands by you through difficulties.",
        "category": "Friendship",
        "explanation": "TRUE (Doğru, sadık): In accordance with fact or steadfast and loyal. E.g.: \"A true companion stands by you through difficulties.\""
      },
      {
        "id": "we_g8_e_43",
        "word": "PEER",
        "clue": "A person of the same age, status, or social grade",
        "turkishMeaning": "Akran",
        "exampleSentence": "Peer tutoring helps classmates master algebra.",
        "category": "Teen Life",
        "explanation": "PEER (Akran): A person of the same age, status, or social grade. E.g.: \"Peer tutoring helps classmates master algebra.\""
      },
      {
        "id": "we_g8_e_44",
        "word": "BUSY",
        "clue": "Actively doing something or an engaged phone line",
        "turkishMeaning": "Meşgul",
        "exampleSentence": "Her phone line was busy so I called later.",
        "category": "Phone",
        "explanation": "BUSY (Meşgul): Actively doing something or an engaged phone line. E.g.: \"Her phone line was busy so I called later.\""
      },
      {
        "id": "we_g8_e_45",
        "word": "CALL",
        "clue": "To telephone someone or speak loudly to them",
        "turkishMeaning": "Aramak / Çağrı",
        "exampleSentence": "I will call you after my tennis lesson finishes.",
        "category": "Phone",
        "explanation": "CALL (Aramak / Çağrı): To telephone someone or speak loudly to them. E.g.: \"I will call you after my tennis lesson finishes.\""
      },
      {
        "id": "we_g8_e_46",
        "word": "RING",
        "clue": "The chime of a phone or a round enclosure",
        "turkishMeaning": "Çalmak / Yüzük",
        "exampleSentence": "Let the phone ring four times before hanging up.",
        "category": "Phone",
        "explanation": "RING (Çalmak / Yüzük): The chime of a phone or a round enclosure. E.g.: \"Let the phone ring four times before hanging up.\""
      },
      {
        "id": "we_g8_e_47",
        "word": "LINE",
        "clue": "A telephone connection circuit or a written queue",
        "turkishMeaning": "Hat / Sıra",
        "exampleSentence": "The phone line was clear and we heard clearly.",
        "category": "Phone",
        "explanation": "LINE (Hat / Sıra): A telephone connection circuit or a written queue. E.g.: \"The phone line was clear and we heard clearly.\""
      },
      {
        "id": "we_g8_e_48",
        "word": "BOIL",
        "clue": "To heat liquid until bubbles break on the surface",
        "turkishMeaning": "Kaynatmak",
        "exampleSentence": "Boil water in the kettle before making mint tea.",
        "category": "Kitchen",
        "explanation": "BOIL (Kaynatmak): To heat liquid until bubbles break on the surface. E.g.: \"Boil water in the kettle before making mint tea.\""
      },
      {
        "id": "we_g8_e_49",
        "word": "BAKE",
        "clue": "To cook food in an enclosed oven using dry heat",
        "turkishMeaning": "Fırında pişirmek",
        "exampleSentence": "Bake the apple pie for forty minutes until crisp.",
        "category": "Kitchen",
        "explanation": "BAKE (Fırında pişirmek): To cook food in an enclosed oven using dry heat. E.g.: \"Bake the apple pie for forty minutes until crisp.\""
      },
      {
        "id": "we_g8_e_50",
        "word": "CHOP",
        "clue": "To cut food into pieces with repeated sharp blows",
        "turkishMeaning": "Doğramak",
        "exampleSentence": "Chop the parsley finely with a chef's knife.",
        "category": "Kitchen",
        "explanation": "CHOP (Doğramak): To cut food into pieces with repeated sharp blows. E.g.: \"Chop the parsley finely with a chef's knife.\""
      },
      {
        "id": "we_g8_e_51",
        "word": "PEEL",
        "clue": "To strip the skin or outer covering off fruit",
        "turkishMeaning": "Soymak",
        "exampleSentence": "Peel three yellow lemons for the dessert glaze.",
        "category": "Kitchen",
        "explanation": "PEEL (Soymak): To strip the skin or outer covering off fruit. E.g.: \"Peel three yellow lemons for the dessert glaze.\""
      },
      {
        "id": "we_g8_e_52",
        "word": "POUR",
        "clue": "To cause liquid to flow from a jug in a stream",
        "turkishMeaning": "Dökmek",
        "exampleSentence": "Pour fresh milk into the mixing bowl slowly.",
        "category": "Kitchen",
        "explanation": "POUR (Dökmek): To cause liquid to flow from a jug in a stream. E.g.: \"Pour fresh milk into the mixing bowl slowly.\""
      },
      {
        "id": "we_g8_e_53",
        "word": "STIR",
        "clue": "To mix ingredients by moving a spoon in circles",
        "turkishMeaning": "Karıştırmak",
        "exampleSentence": "Stir the creamy soup so it does not stick to pans.",
        "category": "Kitchen",
        "explanation": "STIR (Karıştırmak): To mix ingredients by moving a spoon in circles. E.g.: \"Stir the creamy soup so it does not stick to pans.\""
      },
      {
        "id": "we_g8_e_54",
        "word": "DISH",
        "clue": "A shallow container or a particular food recipe",
        "turkishMeaning": "Yemek / Tabak",
        "exampleSentence": "Pasta with tomato basil is his favorite dish.",
        "category": "Kitchen",
        "explanation": "DISH (Yemek / Tabak): A shallow container or a particular food recipe. E.g.: \"Pasta with tomato basil is his favorite dish.\""
      },
      {
        "id": "we_g8_e_55",
        "word": "FORK",
        "clue": "A dining utensil with two or more prongs",
        "turkishMeaning": "Çatal",
        "exampleSentence": "Eat the garden salad with a stainless steel fork.",
        "category": "Kitchen",
        "explanation": "FORK (Çatal): A dining utensil with two or more prongs. E.g.: \"Eat the garden salad with a stainless steel fork.\""
      },
      {
        "id": "we_g8_e_56",
        "word": "BOWL",
        "clue": "A round deep dish used for holding food or soup",
        "turkishMeaning": "Kase",
        "exampleSentence": "Whisk the egg yolks together in a mixing bowl.",
        "category": "Kitchen",
        "explanation": "BOWL (Kase): A round deep dish used for holding food or soup. E.g.: \"Whisk the egg yolks together in a mixing bowl.\""
      },
      {
        "id": "we_g8_e_57",
        "word": "HIKE",
        "clue": "A long brisk walk in the country or over mountains",
        "turkishMeaning": "Doğa yürüyüşü",
        "exampleSentence": "We went on an alpine hike across forest ridges.",
        "category": "Adventures",
        "explanation": "HIKE (Doğa yürüyüşü): A long brisk walk in the country or over mountains. E.g.: \"We went on an alpine hike across forest ridges.\""
      },
      {
        "id": "we_g8_e_58",
        "word": "ROPE",
        "clue": "A strong thick cord used for climbing and securing",
        "turkishMeaning": "Halat, ip",
        "exampleSentence": "Check your climbing rope before ascending rocks.",
        "category": "Adventures",
        "explanation": "ROPE (Halat, ip): A strong thick cord used for climbing and securing. E.g.: \"Check your climbing rope before ascending rocks.\""
      },
      {
        "id": "we_g8_e_59",
        "word": "TENT",
        "clue": "A portable fabric shelter supported by poles and pegs",
        "turkishMeaning": "Çadır",
        "exampleSentence": "Campers pitched their canvas tent by the stream.",
        "category": "Adventures",
        "explanation": "TENT (Çadır): A portable fabric shelter supported by poles and pegs. E.g.: \"Campers pitched their canvas tent by the stream.\""
      },
      {
        "id": "we_g8_e_60",
        "word": "CAMP",
        "clue": "A place with tents or huts where holidaymakers stay",
        "turkishMeaning": "Kamp yapmak",
        "exampleSentence": "We set up camp under the starry mountain sky.",
        "category": "Adventures",
        "explanation": "CAMP (Kamp yapmak): A place with tents or huts where holidaymakers stay. E.g.: \"We set up camp under the starry mountain sky.\""
      },
      {
        "id": "we_g8_e_61",
        "word": "TRIP",
        "clue": "A journey or excursion, especially for holiday fun",
        "turkishMeaning": "Gezi, yolculuk",
        "exampleSentence": "Our school trip to Cappadocia was unforgettable.",
        "category": "Tourism",
        "explanation": "TRIP (Gezi, yolculuk): A journey or excursion, especially for holiday fun. E.g.: \"Our school trip to Cappadocia was unforgettable.\""
      },
      {
        "id": "we_g8_e_62",
        "word": "TOUR",
        "clue": "A journey for pleasure in which several places are visited",
        "turkishMeaning": "Tur, gezinti",
        "exampleSentence": "The tourist took a guided walking tour of Ephesus.",
        "category": "Tourism",
        "explanation": "TOUR (Tur, gezinti): A journey for pleasure in which several places are visited. E.g.: \"The tourist took a guided walking tour of Ephesus.\""
      },
      {
        "id": "we_g8_e_63",
        "word": "STAY",
        "clue": "To reside temporarily at a hotel or resort",
        "turkishMeaning": "Kalmak, konaklamak",
        "exampleSentence": "Guests stay in cozy stone bungalows by the beach.",
        "category": "Tourism",
        "explanation": "STAY (Kalmak, konaklamak): To reside temporarily at a hotel or resort. E.g.: \"Guests stay in cozy stone bungalows by the beach.\""
      },
      {
        "id": "we_g8_e_64",
        "word": "VIEW",
        "clue": "The visible prospect seen from an elevated location",
        "turkishMeaning": "Manzara",
        "exampleSentence": "The summit hotel offers a panoramic sea view.",
        "category": "Tourism",
        "explanation": "VIEW (Manzara): The visible prospect seen from an elevated location. E.g.: \"The summit hotel offers a panoramic sea view.\""
      },
      {
        "id": "we_g8_e_65",
        "word": "CITY",
        "clue": "A large human settlement with extensive buildings",
        "turkishMeaning": "Şehir",
        "exampleSentence": "Istanbul is a vibrant historic bridge city.",
        "category": "Tourism",
        "explanation": "CITY (Şehir): A large human settlement with extensive buildings. E.g.: \"Istanbul is a vibrant historic bridge city.\""
      },
      {
        "id": "we_g8_e_66",
        "word": "DUST",
        "clue": "To wipe fine dry powder off furniture and shelves",
        "turkishMeaning": "Tozunu almak",
        "exampleSentence": "Dust the library bookshelves every Saturday.",
        "category": "Chores",
        "explanation": "DUST (Tozunu almak): To wipe fine dry powder off furniture and shelves. E.g.: \"Dust the library bookshelves every Saturday.\""
      },
      {
        "id": "we_g8_e_67",
        "word": "WASH",
        "clue": "To clean garments, dishes, or hands with water",
        "turkishMeaning": "Yıkamak",
        "exampleSentence": "Wash your hands thoroughly before preparing meals.",
        "category": "Chores",
        "explanation": "WASH (Yıkamak): To clean garments, dishes, or hands with water. E.g.: \"Wash your hands thoroughly before preparing meals.\""
      },
      {
        "id": "we_g8_e_68",
        "word": "IRON",
        "clue": "To smooth garments with a heated electrical press",
        "turkishMeaning": "Ütülemek",
        "exampleSentence": "Iron your school uniform shirts on Sunday evening.",
        "category": "Chores",
        "explanation": "IRON (Ütülemek): To smooth garments with a heated electrical press. E.g.: \"Iron your school uniform shirts on Sunday evening.\""
      },
      {
        "id": "we_g8_e_69",
        "word": "MEND",
        "clue": "To repair something that is broken or torn",
        "turkishMeaning": "Onarmak, tamir etmek",
        "exampleSentence": "She helped mend the ripped backpack strap cleanly.",
        "category": "Chores",
        "explanation": "MEND (Onarmak, tamir etmek): To repair something that is broken or torn. E.g.: \"She helped mend the ripped backpack strap cleanly.\""
      },
      {
        "id": "we_g8_e_70",
        "word": "ATOM",
        "clue": "The smallest particle of a chemical element",
        "turkishMeaning": "Atom",
        "exampleSentence": "Atoms combine to form complex organic molecules.",
        "category": "Science",
        "explanation": "ATOM (Atom): The smallest particle of a chemical element. E.g.: \"Atoms combine to form complex organic molecules.\""
      },
      {
        "id": "we_g8_e_71",
        "word": "CELL",
        "clue": "The microscopic structural unit of living organisms",
        "turkishMeaning": "Hücre",
        "exampleSentence": "Living plant cells contain chlorophyll organelles.",
        "category": "Science",
        "explanation": "CELL (Hücre): The microscopic structural unit of living organisms. E.g.: \"Living plant cells contain chlorophyll organelles.\""
      },
      {
        "id": "we_g8_e_72",
        "word": "TEST",
        "clue": "A procedure to verify the quality or truth of a fact",
        "turkishMeaning": "Test, deney",
        "exampleSentence": "The laboratory test confirmed the chemical theory.",
        "category": "Science",
        "explanation": "TEST (Test, deney): A procedure to verify the quality or truth of a fact. E.g.: \"The laboratory test confirmed the chemical theory.\""
      },
      {
        "id": "we_g8_e_73",
        "word": "MIND",
        "clue": "The element of thought, memory, and cognitive feeling",
        "turkishMeaning": "Zihin / Akıl",
        "exampleSentence": "Puzzles stimulate analytical logic in the mind.",
        "category": "Science",
        "explanation": "MIND (Zihin / Akıl): The element of thought, memory, and cognitive feeling. E.g.: \"Puzzles stimulate analytical logic in the mind.\""
      },
      {
        "id": "we_g8_e_74",
        "word": "WAVE",
        "clue": "A moving ridge of ocean water or sound vibration",
        "turkishMeaning": "Dalga",
        "exampleSentence": "A tidal wave crested against coastal stone seawalls.",
        "category": "Natural Forces",
        "explanation": "WAVE (Dalga): A moving ridge of ocean water or sound vibration. E.g.: \"A tidal wave crested against coastal stone seawalls.\""
      },
      {
        "id": "we_g8_e_75",
        "word": "WIND",
        "clue": "The perceptible natural movement of atmospheric air",
        "turkishMeaning": "Rüzgar",
        "exampleSentence": "Strong wind spun the coastal electricity turbines.",
        "category": "Natural Forces",
        "explanation": "WIND (Rüzgar): The perceptible natural movement of atmospheric air. E.g.: \"Strong wind spun the coastal electricity turbines.\""
      },
      {
        "id": "we_g8_e_76",
        "word": "RAIN",
        "clue": "Moisture condensed from atmospheric vapor falling in drops",
        "turkishMeaning": "Yağmur",
        "exampleSentence": "Monsoon rain quenched the parched desert valley.",
        "category": "Natural Forces",
        "explanation": "RAIN (Yağmur): Moisture condensed from atmospheric vapor falling in drops. E.g.: \"Monsoon rain quenched the parched desert valley.\""
      },
      {
        "id": "we_g8_e_77",
        "word": "SNOW",
        "clue": "Atmospheric water vapor frozen into ice crystals",
        "turkishMeaning": "Kar",
        "exampleSentence": "Fresh snow blanked the ski slopes overnight.",
        "category": "Natural Forces",
        "explanation": "SNOW (Kar): Atmospheric water vapor frozen into ice crystals. E.g.: \"Fresh snow blanked the ski slopes overnight.\""
      },
      {
        "id": "we_g8_e_78",
        "word": "ROCK",
        "clue": "The solid mineral material forming Earth's crust",
        "turkishMeaning": "Kaya",
        "exampleSentence": "Huge rocks tumbled during the mountain tremor.",
        "category": "Natural Forces",
        "explanation": "ROCK (Kaya): The solid mineral material forming Earth's crust. E.g.: \"Huge rocks tumbled during the mountain tremor.\""
      },
      {
        "id": "we_g8_e_79",
        "word": "FIRE",
        "clue": "Combustion producing heat, smoke, and blazing flames",
        "turkishMeaning": "Yangın, ateş",
        "exampleSentence": "Never leave an open camp fire burning unattended.",
        "category": "Natural Forces",
        "explanation": "FIRE (Yangın, ateş): Combustion producing heat, smoke, and blazing flames. E.g.: \"Never leave an open camp fire burning unattended.\""
      },
      {
        "id": "we_g8_e_80",
        "word": "LAND",
        "clue": "The solid part of the surface of the Earth",
        "turkishMeaning": "Kara, toprak",
        "exampleSentence": "Dry land cracked during the prolonged drought.",
        "category": "Natural Forces",
        "explanation": "LAND (Kara, toprak): The solid part of the surface of the Earth. E.g.: \"Dry land cracked during the prolonged drought.\""
      }
    ],
    "medium": [
      {
        "id": "we_g8_m_01",
        "word": "TRUST",
        "clue": "Firm belief in the reliability or truth of someone",
        "turkishMeaning": "Güvenmek, güven",
        "exampleSentence": "True friendship is based on mutual honesty and trust.",
        "category": "Friendship",
        "explanation": "TRUST (Güvenmek, güven): Firm belief in the reliability or truth of someone. E.g.: \"True friendship is based on mutual honesty and trust.\""
      },
      {
        "id": "we_g8_m_02",
        "word": "SHARE",
        "clue": "To have or use something together with others",
        "turkishMeaning": "Paylaşmak",
        "exampleSentence": "Good friends share both their joys and secrets.",
        "category": "Friendship",
        "explanation": "SHARE (Paylaşmak): To have or use something together with others. E.g.: \"Good friends share both their joys and secrets.\""
      },
      {
        "id": "we_g8_m_03",
        "word": "LOYAL",
        "clue": "Giving firm and constant support or allegiance",
        "turkishMeaning": "Sadık, vefalı",
        "exampleSentence": "A loyal buddy stands by you no matter what happens.",
        "category": "Friendship",
        "explanation": "LOYAL (Sadık, vefalı): Giving firm and constant support or allegiance. E.g.: \"A loyal buddy stands by you no matter what happens.\""
      },
      {
        "id": "we_g8_m_04",
        "word": "VOICE",
        "clue": "The sound produced in a person larynx uttered in words",
        "turkishMeaning": "Ses",
        "exampleSentence": "Leave a brief voice message if I cannot answer.",
        "category": "On The Phone",
        "explanation": "VOICE (Ses): The sound produced in a person larynx uttered in words. E.g.: \"Leave a brief voice message if I cannot answer.\""
      },
      {
        "id": "we_g8_m_05",
        "word": "MUSIC",
        "clue": "Vocal or instrumental sounds produced with harmony",
        "turkishMeaning": "Müzik",
        "exampleSentence": "Classical music helps many students concentrate while reading.",
        "category": "Teen Life",
        "explanation": "MUSIC (Müzik): Vocal or instrumental sounds produced with harmony. E.g.: \"Classical music helps many students concentrate while reading.\""
      },
      {
        "id": "we_g8_m_06",
        "word": "SLICE",
        "clue": "To cut food into thin flat broad pieces",
        "turkishMeaning": "Dilimlemek",
        "exampleSentence": "Slice the ripe tomatoes for the fresh green salad.",
        "category": "In The Kitchen",
        "explanation": "SLICE (Dilimlemek): To cut food into thin flat broad pieces. E.g.: \"Slice the ripe tomatoes for the fresh green salad.\""
      },
      {
        "id": "we_g8_m_07",
        "word": "ROAST",
        "clue": "To cook food by prolonged exposure to heat in an oven",
        "turkishMeaning": "Fırında kızartmak",
        "exampleSentence": "They roast seasoned chicken with potatoes for dinner.",
        "category": "In The Kitchen",
        "explanation": "ROAST (Fırında kızartmak): To cook food by prolonged exposure to heat in an oven. E.g.: \"They roast seasoned chicken with potatoes for dinner.\""
      },
      {
        "id": "we_g8_m_08",
        "word": "GRILL",
        "clue": "To cook food over direct charcoal or electrical heat",
        "turkishMeaning": "Izgara yapmak",
        "exampleSentence": "We will grill fresh fish and peppers in the garden.",
        "category": "In The Kitchen",
        "explanation": "GRILL (Izgara yapmak): To cook food over direct charcoal or electrical heat. E.g.: \"We will grill fresh fish and peppers in the garden.\""
      },
      {
        "id": "we_g8_m_09",
        "word": "SPICE",
        "clue": "An aromatic vegetable substance used to flavor food",
        "turkishMeaning": "Baharat",
        "exampleSentence": "Add a pinch of black spice to enrich the vegetable soup.",
        "category": "In The Kitchen",
        "explanation": "SPICE (Baharat): An aromatic vegetable substance used to flavor food. E.g.: \"Add a pinch of black spice to enrich the vegetable soup.\""
      },
      {
        "id": "we_g8_m_10",
        "word": "FLOUR",
        "clue": "A powder obtained by grinding wheat used in baking",
        "turkishMeaning": "Un",
        "exampleSentence": "Mix two cups of flour with warm water and yeast.",
        "category": "In The Kitchen",
        "explanation": "FLOUR (Un): A powder obtained by grinding wheat used in baking. E.g.: \"Mix two cups of flour with warm water and yeast.\""
      },
      {
        "id": "we_g8_m_11",
        "word": "DOUGH",
        "clue": "A thick malleable mixture of flour and liquid for bread",
        "turkishMeaning": "Hamur",
        "exampleSentence": "Knead the pizza dough until it becomes soft and elastic.",
        "category": "In The Kitchen",
        "explanation": "DOUGH (Hamur): A thick malleable mixture of flour and liquid for bread. E.g.: \"Knead the pizza dough until it becomes soft and elastic.\""
      },
      {
        "id": "we_g8_m_12",
        "word": "SPEAK",
        "clue": "To articulate words or converse with someone",
        "turkishMeaning": "Konuşmak",
        "exampleSentence": "May I speak with Mr. Demir regarding the exam?",
        "category": "On The Phone",
        "explanation": "SPEAK (Konuşmak): To articulate words or converse with someone. E.g.: \"May I speak with Mr. Demir regarding the exam?\""
      },
      {
        "id": "we_g8_m_13",
        "word": "PHONE",
        "clue": "A telephone apparatus used for transmitting voice calls",
        "turkishMeaning": "Telefon",
        "exampleSentence": "Answer the ringing phone before it goes to voicemail.",
        "category": "On The Phone",
        "explanation": "PHONE (Telefon): A telephone apparatus used for transmitting voice calls. E.g.: \"Answer the ringing phone before it goes to voicemail.\""
      },
      {
        "id": "we_g8_m_14",
        "word": "CLICK",
        "clue": "To press a mouse button to select an option on screen",
        "turkishMeaning": "Tıklamak",
        "exampleSentence": "Click the submit button to save your test answers.",
        "category": "The Internet",
        "explanation": "CLICK (Tıklamak): To press a mouse button to select an option on screen. E.g.: \"Click the submit button to save your test answers.\""
      },
      {
        "id": "we_g8_m_15",
        "word": "CLIMB",
        "clue": "To go up or ascend a steep mountain or rock face",
        "turkishMeaning": "Tırmanmak",
        "exampleSentence": "Adventurers climb steep cliffs wearing safety ropes.",
        "category": "Adventures",
        "explanation": "CLIMB (Tırmanmak): To go up or ascend a steep mountain or rock face. E.g.: \"Adventurers climb steep cliffs wearing safety ropes.\""
      },
      {
        "id": "we_g8_m_16",
        "word": "SCUBA",
        "clue": "Apparatus used by divers to breathe underwater",
        "turkishMeaning": "Tüplü dalış (scuba)",
        "exampleSentence": "Scuba diving lets you explore vibrant coral reefs.",
        "category": "Adventures",
        "explanation": "SCUBA (Tüplü dalış (scuba)): Apparatus used by divers to breathe underwater. E.g.: \"Scuba diving lets you explore vibrant coral reefs.\""
      },
      {
        "id": "we_g8_m_17",
        "word": "BEACH",
        "clue": "A sandy or pebbly shore by the ocean or sea",
        "turkishMeaning": "Plaj, kumsal",
        "exampleSentence": "Tourists enjoy swimming and sunbathing on the sandy beach.",
        "category": "Tourism",
        "explanation": "BEACH (Plaj, kumsal): A sandy or pebbly shore by the ocean or sea. E.g.: \"Tourists enjoy swimming and sunbathing on the sandy beach.\""
      },
      {
        "id": "we_g8_m_18",
        "word": "GUIDE",
        "clue": "A person who advises or shows tourists around a site",
        "turkishMeaning": "Rehber",
        "exampleSentence": "Our tour guide explained the history of the ancient ruins.",
        "category": "Tourism",
        "explanation": "GUIDE (Rehber): A person who advises or shows tourists around a site. E.g.: \"Our tour guide explained the history of the ancient ruins.\""
      },
      {
        "id": "we_g8_m_19",
        "word": "COAST",
        "clue": "The land near or bordering the ocean shore",
        "turkishMeaning": "Sahil, kıyı",
        "exampleSentence": "We drove along the Aegean coast during summer holiday.",
        "category": "Tourism",
        "explanation": "COAST (Sahil, kıyı): The land near or bordering the ocean shore. E.g.: \"We drove along the Aegean coast during summer holiday.\""
      },
      {
        "id": "we_g8_m_20",
        "word": "HOTEL",
        "clue": "An establishment providing accommodation and meals",
        "turkishMeaning": "Otel",
        "exampleSentence": "We booked a family hotel room near the historic center.",
        "category": "Tourism",
        "explanation": "HOTEL (Otel): An establishment providing accommodation and meals. E.g.: \"We booked a family hotel room near the historic center.\""
      },
      {
        "id": "we_g8_m_21",
        "word": "SIGHT",
        "clue": "A place of interest or attraction visited by tourists",
        "turkishMeaning": "Görülmeye değer yer",
        "exampleSentence": "The ancient amphitheater is an impressive sight.",
        "category": "Tourism",
        "explanation": "SIGHT (Görülmeye değer yer): A place of interest or attraction visited by tourists. E.g.: \"The ancient amphitheater is an impressive sight.\""
      },
      {
        "id": "we_g8_m_22",
        "word": "VISIT",
        "clue": "To go and see someone or spend time at a place",
        "turkishMeaning": "Ziyaret etmek",
        "exampleSentence": "Millions of travelers visit Pamukkale every year.",
        "category": "Tourism",
        "explanation": "VISIT (Ziyaret etmek): To go to see someone or travel to a place as a guest. E.g.: \"Millions of travelers visit Pamukkale every year.\"",
        "contentVersion": 2
      },
      {
        "id": "we_g8_m_23",
        "word": "SWEEP",
        "clue": "To clean a floor surface by brushing away dirt with a broom",
        "turkishMeaning": "Süpürmek",
        "exampleSentence": "Sweep the kitchen floor after finishing dinner.",
        "category": "Chores",
        "explanation": "SWEEP (Süpürmek): To clean a floor surface by brushing away dirt with a broom. E.g.: \"Sweep the kitchen floor after finishing dinner.\""
      },
      {
        "id": "we_g8_m_24",
        "word": "CHORE",
        "clue": "A routine household task such as cleaning or washing",
        "turkishMeaning": "Ev işi",
        "exampleSentence": "Sharing household chores makes family life easier.",
        "category": "Chores",
        "explanation": "CHORE (Ev işi): A routine household task such as cleaning or washing. E.g.: \"Sharing household chores makes family life easier.\""
      },
      {
        "id": "we_g8_m_25",
        "word": "CLEAN",
        "clue": "Free from dirt or unneeded clutter",
        "turkishMeaning": "Temizlemek, temiz",
        "exampleSentence": "Help me clean the windows this Saturday morning.",
        "category": "Chores",
        "explanation": "CLEAN (Temizlemek, temiz): Free from dirt or unneeded clutter. E.g.: \"Help me clean the windows this Saturday morning.\""
      },
      {
        "id": "we_g8_m_26",
        "word": "SHINE",
        "clue": "To polish a surface until it is bright and reflective",
        "turkishMeaning": "Parlatmak",
        "exampleSentence": "Polish the wooden dining table until it begins to shine.",
        "category": "Chores",
        "explanation": "SHINE (Parlatmak): To polish a surface until it is bright and reflective. E.g.: \"Polish the wooden dining table until it begins to shine.\""
      },
      {
        "id": "we_g8_m_27",
        "word": "TRASH",
        "clue": "Discarded household waste or rubbish",
        "turkishMeaning": "Çöp",
        "exampleSentence": "Please take out the trash before leaving for school.",
        "category": "Chores",
        "explanation": "TRASH (Çöp): Discarded household waste or rubbish. E.g.: \"Please take out the trash before leaving for school.\""
      },
      {
        "id": "we_g8_m_28",
        "word": "ROBOT",
        "clue": "A machine capable of carrying out complex actions automatically",
        "turkishMeaning": "Robot",
        "exampleSentence": "Robots assist surgeons during delicate medical operations.",
        "category": "Science",
        "explanation": "ROBOT (Robot): A machine capable of carrying out complex actions automatically. E.g.: \"Robots assist surgeons during delicate medical operations.\""
      },
      {
        "id": "we_g8_m_29",
        "word": "LASER",
        "clue": "A device generating an intense narrow beam of light",
        "turkishMeaning": "Lazer",
        "exampleSentence": "Laser technology is widely used in eye surgeries.",
        "category": "Science",
        "explanation": "LASER (Lazer): A device generating an intense narrow beam of light. E.g.: \"Laser technology is widely used in eye surgeries.\""
      },
      {
        "id": "we_g8_m_30",
        "word": "SOLAR",
        "clue": "Relating to or utilizing the light and heat of the sun",
        "turkishMeaning": "Güneşle ilgili",
        "exampleSentence": "Solar energy is an abundant source of clean power.",
        "category": "Science",
        "explanation": "SOLAR (Güneşle ilgili): Relating to or utilizing the light and heat of the sun. E.g.: \"Solar energy is an abundant source of clean power.\""
      },
      {
        "id": "we_g8_m_31",
        "word": "FLOOD",
        "clue": "An overflow of a large amount of water covering dry land",
        "turkishMeaning": "Sel, su baskını",
        "exampleSentence": "Heavy monsoon rains caused a devastating river flood.",
        "category": "Natural Forces",
        "explanation": "FLOOD (Sel, su baskını): An overflow of a large amount of water covering dry land. E.g.: \"Heavy monsoon rains caused a devastating river flood.\""
      },
      {
        "id": "we_g8_m_32",
        "word": "STORM",
        "clue": "A violent disturbance of the atmosphere with gale winds",
        "turkishMeaning": "Fırtına",
        "exampleSentence": "The winter storm knocked down power lines in the village.",
        "category": "Natural Forces",
        "explanation": "STORM (Fırtına): A violent disturbance of the atmosphere with gale winds. E.g.: \"The winter storm knocked down power lines in the village.\""
      },
      {
        "id": "we_g8_m_33",
        "word": "QUAKE",
        "clue": "A sudden violent shaking of the ground; earthquake",
        "turkishMeaning": "Deprem (earthquake)",
        "exampleSentence": "The earthquake drill taught students to drop, cover, and hold.",
        "category": "Natural Forces",
        "explanation": "QUAKE (Deprem (earthquake)): A sudden violent shaking of the ground; earthquake. E.g.: \"The earthquake drill taught students to drop, cover, and hold.\""
      },
      {
        "id": "we_g8_m_34",
        "word": "ASHES",
        "clue": "The powdery gray residue left after combustion of material",
        "turkishMeaning": "Küller",
        "exampleSentence": "Volcanic ashes covered the landscape after the eruption.",
        "category": "Natural Forces",
        "explanation": "ASHES (Küller): The powdery gray residue left after combustion of material. E.g.: \"Volcanic ashes covered the landscape after the eruption.\""
      },
      {
        "id": "we_g8_m_35",
        "word": "RADAR",
        "clue": "A system detecting the presence or speed of objects",
        "turkishMeaning": "Radar",
        "exampleSentence": "Meteorologists use doppler radar to track approaching storms.",
        "category": "Natural Forces",
        "explanation": "RADAR (Radar): A system detecting the presence or speed of objects. E.g.: \"Meteorologists use doppler radar to track approaching storms.\""
      },
      {
        "id": "we_g8_m_36",
        "word": "SPEED",
        "clue": "The rate at which someone or something moves or operates",
        "turkishMeaning": "Hız",
        "exampleSentence": "High wind speed tore branches from neighborhood trees.",
        "category": "Natural Forces",
        "explanation": "SPEED (Hız): The rate at which someone or something moves or operates. E.g.: \"High wind speed tore branches from neighborhood trees.\""
      },
      {
        "id": "we_g8_m_37",
        "word": "CRASH",
        "clue": "A violent collision of vehicles or planes",
        "turkishMeaning": "Çarpışma, kaza",
        "exampleSentence": "Emergency rescue teams responded immediately to the crash.",
        "category": "Natural Forces",
        "explanation": "CRASH (Çarpışma, kaza): A violent collision of vehicles or planes. E.g.: \"Emergency rescue teams responded immediately to the crash.\""
      },
      {
        "id": "we_g8_m_38",
        "word": "FORCE",
        "clue": "Strength or energy as an attribute of physical action",
        "turkishMeaning": "Kuvvet, güç",
        "exampleSentence": "The immense force of the tsunami wave broke seawalls.",
        "category": "Natural Forces",
        "explanation": "FORCE (Kuvvet, güç): Strength or energy as an attribute of physical action. E.g.: \"The immense force of the tsunami wave broke seawalls.\""
      },
      {
        "id": "we_g8_m_39",
        "word": "EARTH",
        "clue": "The crust and soil of the globe, or our planet",
        "turkishMeaning": "Yer kabuğu / Dünya",
        "exampleSentence": "Tectonic plates drift slowly beneath the earth crust.",
        "category": "Natural Forces",
        "explanation": "EARTH (Yer kabuğu / Dünya): The crust and soil of the globe, or our planet. E.g.: \"Tectonic plates drift slowly beneath the earth crust.\""
      },
      {
        "id": "we_g8_m_40",
        "word": "ALIEN",
        "clue": "Supposed extraterrestrial life or something completely strange",
        "turkishMeaning": "Uzaylı / Yabancı",
        "exampleSentence": "Science fiction books often imagine friendly alien beings.",
        "category": "Science",
        "explanation": "ALIEN (Uzaylı / Yabancı): Supposed extraterrestrial life or something completely strange. E.g.: \"Science fiction books often imagine friendly alien beings.\""
      },
      {
        "id": "we_g8_m_41",
        "word": "LOYAL",
        "clue": "Giving or showing firm and constant support to peers",
        "turkishMeaning": "Sadık, vefalı",
        "exampleSentence": "A loyal companion never abandons you in trouble.",
        "category": "Friendship",
        "explanation": "LOYAL (Sadık, vefalı): Giving or showing firm and constant support to peers. E.g.: \"A loyal companion never abandons you in trouble.\""
      },
      {
        "id": "we_g8_m_42",
        "word": "SHARE",
        "clue": "To distribute among others or express thoughts freely",
        "turkishMeaning": "Paylaşmak",
        "exampleSentence": "True friends share their hopes and anxieties.",
        "category": "Friendship",
        "explanation": "SHARE (Paylaşmak): To distribute among others or express thoughts freely. E.g.: \"True friends share their hopes and anxieties.\""
      },
      {
        "id": "we_g8_m_43",
        "word": "TRUST",
        "clue": "Firm belief in the reliability and truth of someone",
        "turkishMeaning": "Güven, güvenmek",
        "exampleSentence": "Trust is earned through consistent honesty and care.",
        "category": "Friendship",
        "explanation": "TRUST (Güven, güvenmek): Firm belief in the reliability and truth of someone. E.g.: \"Trust is earned through consistent honesty and care.\""
      },
      {
        "id": "we_g8_m_44",
        "word": "TREND",
        "clue": "A general direction in which teen fashion develops",
        "turkishMeaning": "Akım, eğilim",
        "exampleSentence": "Casual sneakers are a dominant fashion trend.",
        "category": "Teen Life",
        "explanation": "TREND (Akım, eğilim): A general direction in which teen fashion develops. E.g.: \"Casual sneakers are a dominant fashion trend.\""
      },
      {
        "id": "we_g8_m_45",
        "word": "HABIT",
        "clue": "A settled or regular tendency practiced daily",
        "turkishMeaning": "Alışkanlık",
        "exampleSentence": "Daily reading is a beneficial intellectual habit.",
        "category": "Teen Life",
        "explanation": "HABIT (Alışkanlık): A settled or regular tendency practiced daily. E.g.: \"Daily reading is a beneficial intellectual habit.\""
      },
      {
        "id": "we_g8_m_46",
        "word": "PHONE",
        "clue": "An electronic device used to converse with distant people",
        "turkishMeaning": "Telefon",
        "exampleSentence": "She answered the ringing phone after two chimes.",
        "category": "Phone",
        "explanation": "PHONE (Telefon): An electronic device used to converse with distant people. E.g.: \"She answered the ringing phone after two chimes.\""
      },
      {
        "id": "we_g8_m_47",
        "word": "CALLS",
        "clue": "Makes telephone calls or shouts to someone",
        "turkishMeaning": "Aramalar",
        "exampleSentence": "He makes brief calls to his family every evening.",
        "category": "Phone",
        "explanation": "CALLS (Aramalar): Makes telephone calls or shouts to someone. E.g.: \"He makes brief calls to his family every evening.\""
      },
      {
        "id": "we_g8_m_48",
        "word": "REPLY",
        "clue": "To give a spoken or written answer to someone",
        "turkishMeaning": "Cevap vermek",
        "exampleSentence": "Reply promptly to your study partner's text message.",
        "category": "Phone",
        "explanation": "REPLY (Cevap vermek): To give a spoken or written answer to someone. E.g.: \"Reply promptly to your study partner's text message.\""
      },
      {
        "id": "we_g8_m_49",
        "word": "VOICE",
        "clue": "The sound produced in a person's larynx during speech",
        "turkishMeaning": "Ses",
        "exampleSentence": "His calm voice reassured the anxious caller.",
        "category": "Phone",
        "explanation": "VOICE (Ses): The sound produced in a person's larynx during speech. E.g.: \"His calm voice reassured the anxious caller.\""
      },
      {
        "id": "we_g8_m_50",
        "word": "INBOX",
        "clue": "An electronic folder where received emails are saved",
        "turkishMeaning": "Gelen kutusu",
        "exampleSentence": "Check your student email inbox for class bulletins.",
        "category": "Internet",
        "explanation": "INBOX (Gelen kutusu): An electronic folder where received emails are saved. E.g.: \"Check your student email inbox for class bulletins.\""
      },
      {
        "id": "we_g8_m_51",
        "word": "LOGIN",
        "clue": "The credentials or act of entering a secure system",
        "turkishMeaning": "Giriş yapmak",
        "exampleSentence": "Keep your computer login credentials private.",
        "category": "Internet",
        "explanation": "LOGIN (Giriş yapmak): The credentials or act of entering a secure system. E.g.: \"Keep your computer login credentials private.\""
      },
      {
        "id": "we_g8_m_52",
        "word": "CYBER",
        "clue": "Relating to electronic communication and internet networks",
        "turkishMeaning": "Siber",
        "exampleSentence": "Cyber safety guidelines protect student accounts.",
        "category": "Internet",
        "explanation": "CYBER (Siber): Relating to electronic communication and internet networks. E.g.: \"Cyber safety guidelines protect student accounts.\""
      },
      {
        "id": "we_g8_m_53",
        "word": "SPICE",
        "clue": "An aromatic vegetable substance used to season dishes",
        "turkishMeaning": "Baharat",
        "exampleSentence": "Cumin is an essential fragrant spice in lentil soup.",
        "category": "Kitchen",
        "explanation": "SPICE (Baharat): An aromatic vegetable substance used to season dishes. E.g.: \"Cumin is an essential fragrant spice in lentil soup.\""
      },
      {
        "id": "we_g8_m_54",
        "word": "GRILL",
        "clue": "A device on a cooker radiating heat downwards",
        "turkishMeaning": "Izgara yapmak",
        "exampleSentence": "Grill seasoned salmon fillets for eight minutes.",
        "category": "Kitchen",
        "explanation": "GRILL (Izgara yapmak): A device on a cooker radiating heat downwards. E.g.: \"Grill seasoned salmon fillets for eight minutes.\""
      },
      {
        "id": "we_g8_m_55",
        "word": "ROAST",
        "clue": "To cook meat or vegetables in an oven with dry heat",
        "turkishMeaning": "Fırında kızartmak",
        "exampleSentence": "Roast potatoes until they are golden and crispy.",
        "category": "Kitchen",
        "explanation": "ROAST (Fırında kızartmak): To cook meat or vegetables in an oven with dry heat. E.g.: \"Roast potatoes until they are golden and crispy.\""
      },
      {
        "id": "we_g8_m_56",
        "word": "SLICE",
        "clue": "A thin broad piece of food cut from a larger cake",
        "turkishMeaning": "Dilim, dilimlemek",
        "exampleSentence": "Cut the freshly baked bread into thin even slices.",
        "category": "Kitchen",
        "explanation": "SLICE (Dilim, dilimlemek): A thin broad piece of food cut from a larger cake. E.g.: \"Cut the freshly baked bread into thin even slices.\""
      },
      {
        "id": "we_g8_m_57",
        "word": "DRAIN",
        "clue": "To remove water from food using a colander",
        "turkishMeaning": "Süzmek",
        "exampleSentence": "Drain the boiled spaghetti thoroughly before sauce.",
        "category": "Kitchen",
        "explanation": "DRAIN (Süzmek): To remove water from food using a colander. E.g.: \"Drain the boiled spaghetti thoroughly before sauce.\""
      },
      {
        "id": "we_g8_m_58",
        "word": "TASTE",
        "clue": "The sensation of flavor perceived in the mouth",
        "turkishMeaning": "Tat, tatmak",
        "exampleSentence": "Taste the stew and adjust the salt if necessary.",
        "category": "Kitchen",
        "explanation": "TASTE (Tat, tatmak): The sensation of flavor perceived in the mouth. E.g.: \"Taste the stew and adjust the salt if necessary.\""
      },
      {
        "id": "we_g8_m_59",
        "word": "SPOON",
        "clue": "An implement with a shallow bowl used for eating soup",
        "turkishMeaning": "Kaşık",
        "exampleSentence": "Eat the warm chicken broth with a soup spoon.",
        "category": "Kitchen",
        "explanation": "SPOON (Kaşık): An implement with a shallow bowl used for eating soup. E.g.: \"Eat the warm chicken broth with a soup spoon.\""
      },
      {
        "id": "we_g8_m_60",
        "word": "PLATE",
        "clue": "A flat dish from which food is eaten or served",
        "turkishMeaning": "Tabak",
        "exampleSentence": "Arrange the grilled chicken skewers on a warm plate.",
        "category": "Kitchen",
        "explanation": "PLATE (Tabak): A flat dish from which food is eaten or served. E.g.: \"Arrange the grilled chicken skewers on a warm plate.\""
      },
      {
        "id": "we_g8_m_61",
        "word": "KNIFE",
        "clue": "An instrument with a cutting blade and a handle",
        "turkishMeaning": "Bıçak",
        "exampleSentence": "Chop vegetables carefully using a sharp chef knife.",
        "category": "Kitchen",
        "explanation": "KNIFE (Bıçak): An instrument with a cutting blade and a handle. E.g.: \"Chop vegetables carefully using a sharp chef knife.\""
      },
      {
        "id": "we_g8_m_62",
        "word": "CABIN",
        "clue": "A small wooden shelter erected in wilderness forests",
        "turkishMeaning": "Dağ kulübesi",
        "exampleSentence": "The mountaineers spent the night in an alpine cabin.",
        "category": "Adventures",
        "explanation": "CABIN (Dağ kulübesi): A small wooden shelter erected in wilderness forests. E.g.: \"The mountaineers spent the night in an alpine cabin.\""
      },
      {
        "id": "we_g8_m_63",
        "word": "KAYAK",
        "clue": "A narrow watercraft propelled by a double-bladed paddle",
        "turkishMeaning": "Kano",
        "exampleSentence": "Paddlers steered their sleek kayak through river bends.",
        "category": "Adventures",
        "explanation": "KAYAK (Kano): A narrow watercraft propelled by a double-bladed paddle. E.g.: \"Paddlers steered their sleek kayak through river bends.\""
      },
      {
        "id": "we_g8_m_64",
        "word": "CLIMB",
        "clue": "To ascend mountains or steep rocks using limbs",
        "turkishMeaning": "Tırmanmak",
        "exampleSentence": "Athletes climb vertical rock faces with chalked hands.",
        "category": "Adventures",
        "explanation": "CLIMB (Tırmanmak): To ascend mountains or steep rocks using limbs. E.g.: \"Athletes climb vertical rock faces with chalked hands.\""
      },
      {
        "id": "we_g8_m_65",
        "word": "BEACH",
        "clue": "A strip of sand or shingle along an ocean coast",
        "turkishMeaning": "Plaj, sahil",
        "exampleSentence": "Tourists sunbathed along the Mediterranean beach.",
        "category": "Tourism",
        "explanation": "BEACH (Plaj, sahil): A strip of sand or shingle along an ocean coast. E.g.: \"Tourists sunbathed along the Mediterranean beach.\""
      },
      {
        "id": "we_g8_m_66",
        "word": "HOTEL",
        "clue": "An establishment providing accommodation for guests",
        "turkishMeaning": "Otel",
        "exampleSentence": "Book comfortable hotel rooms before holiday peak.",
        "category": "Tourism",
        "explanation": "HOTEL (Otel): An establishment providing accommodation for guests. E.g.: \"Book comfortable hotel rooms before holiday peak.\""
      },
      {
        "id": "we_g8_m_67",
        "word": "GUIDE",
        "clue": "A person who shows the way to tourists at landmarks",
        "turkishMeaning": "Rehber",
        "exampleSentence": "The licensed guide explained the history of Troy.",
        "category": "Tourism",
        "explanation": "GUIDE (Rehber): A person who shows the way to tourists at landmarks. E.g.: \"The licensed guide explained the history of Troy.\""
      },
      {
        "id": "we_g8_m_68",
        "word": "LODGE",
        "clue": "A small house at the gates of a park or ski resort",
        "turkishMeaning": "Dağ evi, pansiyon",
        "exampleSentence": "The alpine ski lodge welcomed frozen hikers warmly.",
        "category": "Tourism",
        "explanation": "LODGE (Dağ evi, pansiyon): A small house at the gates of a park or ski resort. E.g.: \"The alpine ski lodge welcomed frozen hikers warmly.\""
      },
      {
        "id": "we_g8_m_69",
        "word": "CHORE",
        "clue": "A routine household task such as sweeping or dishes",
        "turkishMeaning": "Ev işi",
        "exampleSentence": "Vacuuming the living room carpet is his weekly chore.",
        "category": "Chores",
        "explanation": "CHORE (Ev işi): A routine household task such as sweeping or dishes. E.g.: \"Vacuuming the living room carpet is his weekly chore.\""
      },
      {
        "id": "we_g8_m_70",
        "word": "SWEEP",
        "clue": "To clean floor tiles by brushing away dirt with brooms",
        "turkishMeaning": "Süpürmek",
        "exampleSentence": "Sweep the kitchen tiles after cooking dinner.",
        "category": "Chores",
        "explanation": "SWEEP (Süpürmek): To clean floor tiles by brushing away dirt with brooms. E.g.: \"Sweep the kitchen tiles after cooking dinner.\""
      },
      {
        "id": "we_g8_m_71",
        "word": "SCRUB",
        "clue": "To rub surfaces hard with a brush and soapy water",
        "turkishMeaning": "Ovalamak",
        "exampleSentence": "Scrub the cooking pots until all grease vanishes.",
        "category": "Chores",
        "explanation": "SCRUB (Ovalamak): To rub surfaces hard with a brush and soapy water. E.g.: \"Scrub the cooking pots until all grease vanishes.\""
      },
      {
        "id": "we_g8_m_72",
        "word": "FORCE",
        "clue": "Strength or energy as an attribute of physical motion",
        "turkishMeaning": "Kuvvet, güç",
        "exampleSentence": "Gravitational force binds planets to solar orbits.",
        "category": "Science",
        "explanation": "FORCE (Kuvvet, güç): Strength or energy as an attribute of physical motion. E.g.: \"Gravitational force binds planets to solar orbits.\""
      },
      {
        "id": "we_g8_m_73",
        "word": "LIGHT",
        "clue": "The natural agent that stimulates sight; electromagnetic",
        "turkishMeaning": "Işık",
        "exampleSentence": "Sunlight supplies photosynthetic energy to plants.",
        "category": "Science",
        "explanation": "LIGHT (Işık): The natural agent that stimulates sight; electromagnetic. E.g.: \"Sunlight supplies photosynthetic energy to plants.\""
      },
      {
        "id": "we_g8_m_74",
        "word": "RADAR",
        "clue": "A system for detecting objects by using radio waves",
        "turkishMeaning": "Radar",
        "exampleSentence": "Airport radar tracks incoming passenger flights.",
        "category": "Science",
        "explanation": "RADAR (Radar): A system for detecting objects by using radio waves. E.g.: \"Airport radar tracks incoming passenger flights.\""
      },
      {
        "id": "we_g8_m_75",
        "word": "STEAM",
        "clue": "The vapor into which water is converted when boiled",
        "turkishMeaning": "Buhar",
        "exampleSentence": "Steam rose in fragrant plumes from the hot saucepan.",
        "category": "Science",
        "explanation": "STEAM (Buhar): The vapor into which water is converted when boiled. E.g.: \"Steam rose in fragrant plumes from the hot saucepan.\""
      },
      {
        "id": "we_g8_m_76",
        "word": "FLOOD",
        "clue": "An overflow of a large amount of water beyond limits",
        "turkishMeaning": "Sel, su baskını",
        "exampleSentence": "Flash floods submerged streets following cloudbursts.",
        "category": "Natural Forces",
        "explanation": "FLOOD (Sel, su baskını): An overflow of a large amount of water beyond limits. E.g.: \"Flash floods submerged streets following cloudbursts.\""
      },
      {
        "id": "we_g8_m_77",
        "word": "EARTH",
        "clue": "The planet on which we live; the world",
        "turkishMeaning": "Dünya",
        "exampleSentence": "Tectonic faults fracture deep within the solid Earth.",
        "category": "Natural Forces",
        "explanation": "EARTH (Dünya): The planet on which we live; the world. E.g.: \"Tectonic faults fracture deep within the solid Earth.\""
      },
      {
        "id": "we_g8_m_78",
        "word": "CRUST",
        "clue": "The outermost solid rocky shell of our planet",
        "turkishMeaning": "Yer kabuğu",
        "exampleSentence": "Seismic tremors rupture faults inside Earth's crust.",
        "category": "Natural Forces",
        "explanation": "CRUST (Yer kabuğu): The outermost solid rocky shell of our planet. E.g.: \"Seismic tremors rupture faults inside Earth's crust.\""
      },
      {
        "id": "we_g8_m_79",
        "word": "FAULT",
        "clue": "An extended fracture in the rock formations of Earth",
        "turkishMeaning": "Fay hattı",
        "exampleSentence": "The North Anatolian fault slip produced temblors.",
        "category": "Natural Forces",
        "explanation": "FAULT (Fay hattı): An extended fracture in the rock formations of Earth. E.g.: \"The North Anatolian fault slip produced temblors.\""
      },
      {
        "id": "we_g8_m_80",
        "word": "SMOKE",
        "clue": "A visible suspension of carbon particles in the air",
        "turkishMeaning": "Duman",
        "exampleSentence": "Volcanic smoke billowed high above the mountain cone.",
        "category": "Natural Forces",
        "explanation": "SMOKE (Duman): A visible suspension of carbon particles in the air. E.g.: \"Volcanic smoke billowed high above the mountain cone.\""
      }
    ],
    "hard": [
      {
        "id": "we_g8_h_01",
        "word": "FRIEND",
        "clue": "A person with whom one has a bond of mutual affection",
        "turkishMeaning": "Arkadaş, dost",
        "exampleSentence": "A reliable friend will always support you through challenges.",
        "category": "Friendship",
        "explanation": "FRIEND (Arkadaş, dost): A person with whom one has a bond of mutual affection. E.g.: \"A reliable friend will always support you through challenges.\""
      },
      {
        "id": "we_g8_h_02",
        "word": "SECRET",
        "clue": "Something that is kept unknown or hidden from others",
        "turkishMeaning": "Sır, gizli",
        "exampleSentence": "You can tell her a secret because she is trustworthy.",
        "category": "Friendship",
        "explanation": "SECRET (Sır, gizli): Something that is kept unknown or hidden from others. E.g.: \"You can tell her a secret because she is trustworthy.\""
      },
      {
        "id": "we_g8_h_03",
        "word": "BACKUP",
        "clue": "To provide support, help, or a secondary copy of data",
        "turkishMeaning": "Desteklemek / Yedek",
        "exampleSentence": "True buddies always backup each other in tough times.",
        "category": "Friendship",
        "explanation": "BACKUP (Desteklemek / Yedek): To provide support, help, or a secondary copy of data. E.g.: \"True buddies always backup each other in tough times.\""
      },
      {
        "id": "we_g8_h_04",
        "word": "TRENDY",
        "clue": "Very fashionable and up to date with modern styles",
        "turkishMeaning": "Modaya uygun, trend",
        "exampleSentence": "Teens love wearing trendy sneakers and modern hoodies.",
        "category": "Teen Life",
        "explanation": "TRENDY (Modaya uygun, trend): Very fashionable and up to date with modern styles. E.g.: \"Teens love wearing trendy sneakers and modern hoodies.\""
      },
      {
        "id": "we_g8_h_05",
        "word": "RECIPE",
        "clue": "A set of culinary instructions for preparing a dish",
        "turkishMeaning": "Yemek tarifi",
        "exampleSentence": "Follow the traditional recipe to bake Turkish baklava.",
        "category": "In The Kitchen",
        "explanation": "RECIPE (Yemek tarifi): A set of culinary instructions for preparing a dish. E.g.: \"Follow the traditional recipe to bake Turkish baklava.\""
      },
      {
        "id": "we_g8_h_06",
        "word": "GARLIC",
        "clue": "A strong-smelling pungent bulb used in cooking",
        "turkishMeaning": "Sarımsak",
        "exampleSentence": "Add crushed garlic cloves to season the tomato sauce.",
        "category": "In The Kitchen",
        "explanation": "GARLIC (Sarımsak): A strong-smelling pungent bulb used in cooking. E.g.: \"Add crushed garlic cloves to season the tomato sauce.\""
      },
      {
        "id": "we_g8_h_07",
        "word": "PEPPER",
        "clue": "A pungent hot-tasting vegetable or spice powder",
        "turkishMeaning": "Biber",
        "exampleSentence": "Sprinkle freshly ground black pepper over the roasted meat.",
        "category": "In The Kitchen",
        "explanation": "PEPPER (Biber): A pungent hot-tasting vegetable or spice powder. E.g.: \"Sprinkle freshly ground black pepper over the roasted meat.\""
      },
      {
        "id": "we_g8_h_08",
        "word": "BUTTER",
        "clue": "A pale yellow fatty food made by churning milk or cream",
        "turkishMeaning": "Tereyağı",
        "exampleSentence": "Melt a spoonful of farm butter into the hot rice.",
        "category": "In The Kitchen",
        "explanation": "BUTTER (Tereyağı): A pale yellow fatty food made by churning milk or cream. E.g.: \"Melt a spoonful of farm butter into the hot rice.\""
      },
      {
        "id": "we_g8_h_09",
        "word": "ENGAGE",
        "clue": "To occupy or attract someone attention or participate",
        "turkishMeaning": "Katılmak, meşgul olmak",
        "exampleSentence": "Active students engage enthusiastically in English debates.",
        "category": "On The Phone",
        "explanation": "ENGAGE (Katılmak, meşgul olmak): To occupy or attract someone attention or participate. E.g.: \"Active students engage enthusiastically in English debates.\""
      },
      {
        "id": "we_g8_h_10",
        "word": "HANGUP",
        "clue": "To end a telephone conversation by breaking connection",
        "turkishMeaning": "Telefonu kapatmak",
        "exampleSentence": "Do not hang up yet; I have one more question to ask.",
        "category": "On The Phone",
        "explanation": "HANGUP (Telefonu kapatmak): To end a telephone conversation by breaking connection. E.g.: \"Do not hang up yet; I have one more question to ask.\""
      },
      {
        "id": "we_g8_h_11",
        "word": "SEARCH",
        "clue": "To look for information systematically on the internet",
        "turkishMeaning": "Aramak, araştırmak",
        "exampleSentence": "Use search engines to gather verified scientific data.",
        "category": "The Internet",
        "explanation": "SEARCH (Aramak, araştırmak): To look for information systematically on the internet. E.g.: \"Use search engines to gather verified scientific data.\""
      },
      {
        "id": "we_g8_h_12",
        "word": "SCREEN",
        "clue": "A flat display panel on a computer, tablet, or phone",
        "turkishMeaning": "Ekran",
        "exampleSentence": "Limit your daily screen time to protect your eyesight.",
        "category": "The Internet",
        "explanation": "SCREEN (Ekran): A flat display panel on a computer, tablet, or phone. E.g.: \"Limit your daily screen time to protect your eyesight.\""
      },
      {
        "id": "we_g8_h_13",
        "word": "SOCIAL",
        "clue": "Relating to society or interactive communication between people",
        "turkishMeaning": "Sosyal",
        "exampleSentence": "Social networking sites help people connect globally.",
        "category": "The Internet",
        "explanation": "SOCIAL (Sosyal): Relating to society or interactive communication between people. E.g.: \"Social networking sites help people connect globally.\""
      },
      {
        "id": "we_g8_h_14",
        "word": "DEVICE",
        "clue": "An electronic mechanism invented for a practical purpose",
        "turkishMeaning": "Cihaz, aygıt",
        "exampleSentence": "Charge your electronic device before heading to class.",
        "category": "The Internet",
        "explanation": "DEVICE (Cihaz, aygıt): An electronic mechanism invented for a practical purpose. E.g.: \"Charge your electronic device before heading to class.\""
      },
      {
        "id": "we_g8_h_15",
        "word": "DANGER",
        "clue": "The possibility of suffering serious harm or injury",
        "turkishMeaning": "Tehlike",
        "exampleSentence": "Extreme mountaineering involves serious natural danger.",
        "category": "Adventures",
        "explanation": "DANGER (Tehlike): The possibility of suffering serious harm or injury. E.g.: \"Extreme mountaineering involves serious natural danger.\""
      },
      {
        "id": "we_g8_h_16",
        "word": "SAFARI",
        "clue": "An expedition to observe wild animals in natural habitat",
        "turkishMeaning": "Safari turu",
        "exampleSentence": "They went on a jeep safari across the Serengeti plains.",
        "category": "Adventures",
        "explanation": "SAFARI (Safari turu): An expedition to observe wild animals in natural habitat. E.g.: \"They went on a jeep safari across the Serengeti plains.\""
      },
      {
        "id": "we_g8_h_17",
        "word": "RESORT",
        "clue": "A destination visited for holidays or recreation",
        "turkishMeaning": "Tatil köyü, tatil yeri",
        "exampleSentence": "The coastal resort offers windsurfing and sailing lessons.",
        "category": "Tourism",
        "explanation": "RESORT (Tatil köyü, tatil yeri): A destination visited for holidays or recreation. E.g.: \"The coastal resort offers windsurfing and sailing lessons.\""
      },
      {
        "id": "we_g8_h_18",
        "word": "TRAVEL",
        "clue": "To take trips to distant cities or explore countries",
        "turkishMeaning": "Seyahat etmek",
        "exampleSentence": "Many tourists travel to Antalya during the summer season.",
        "category": "Tourism",
        "explanation": "TRAVEL (Seyahat etmek): To take trips to distant cities or explore countries. E.g.: \"Many tourists travel to Antalya during the summer season.\""
      },
      {
        "id": "we_g8_h_19",
        "word": "TEMPLE",
        "clue": "A building devoted to the worship of a deity",
        "turkishMeaning": "Tapınak",
        "exampleSentence": "We visited the ancient marble temple of Artemis.",
        "category": "Tourism",
        "explanation": "TEMPLE (Tapınak): A building devoted to the worship of a deity. E.g.: \"We visited the ancient marble temple of Artemis.\""
      },
      {
        "id": "we_g8_h_20",
        "word": "CASTLE",
        "clue": "A large fortified medieval building with defensive walls",
        "turkishMeaning": "Kale, şato",
        "exampleSentence": "The medieval castle overlooks the scenic harbor.",
        "category": "Tourism",
        "explanation": "CASTLE (Kale, şato): A large fortified medieval building with defensive walls. E.g.: \"The medieval castle overlooks the scenic harbor.\""
      },
      {
        "id": "we_g8_h_21",
        "word": "VACUUM",
        "clue": "To clean rugs and carpets with an electric suction cleaner",
        "turkishMeaning": "Elektrik süpürgesiyle süpürmek",
        "exampleSentence": "Please vacuum the living room carpet before guests arrive.",
        "category": "Chores",
        "explanation": "VACUUM (Elektrik süpürgesiyle süpürmek): To clean rugs and carpets with an electric suction cleaner. E.g.: \"Please vacuum the living room carpet before guests arrive.\""
      },
      {
        "id": "we_g8_h_22",
        "word": "ERRAND",
        "clue": "A short trip taken to perform a necessary household task",
        "turkishMeaning": "Ayak işi, getir götür",
        "exampleSentence": "I ran an errand to the grocery store to buy milk.",
        "category": "Chores",
        "explanation": "ERRAND (Ayak işi, getir götür): A short trip taken to perform a necessary household task. E.g.: \"I ran an errand to the grocery store to buy milk.\""
      },
      {
        "id": "we_g8_h_23",
        "word": "DISHES",
        "clue": "Plates, bowls, and cutlery that need washing after meals",
        "turkishMeaning": "Bulaşıklar",
        "exampleSentence": "Help your sister rinse and dry the dinner dishes.",
        "category": "Chores",
        "explanation": "DISHES (Bulaşıklar): Plates, bowls, and cutlery that need washing after meals. E.g.: \"Help your sister rinse and dry the dinner dishes.\""
      },
      {
        "id": "we_g8_h_24",
        "word": "SPREAD",
        "clue": "To apply a substance in an even layer across a surface",
        "turkishMeaning": "Sürmek, yaymak",
        "exampleSentence": "Spread creamy strawberry jam over the toasted bread.",
        "category": "In The Kitchen",
        "explanation": "SPREAD (Sürmek, yaymak): To apply a substance in an even layer across a surface. E.g.: \"Spread creamy strawberry jam over the toasted bread.\""
      },
      {
        "id": "we_g8_h_25",
        "word": "INVENT",
        "clue": "To create or design a new device, process, or machine",
        "turkishMeaning": "İcat etmek",
        "exampleSentence": "Thomas Edison worked tirelessly to invent the electric bulb.",
        "category": "Science",
        "explanation": "INVENT (İcat etmek): To create or design a new device, process, or machine. E.g.: \"Thomas Edison worked tirelessly to invent the electric bulb.\""
      },
      {
        "id": "we_g8_h_26",
        "word": "FOSSIL",
        "clue": "The preserved remains of a prehistoric organism in rock",
        "turkishMeaning": "Fosil",
        "exampleSentence": "Paleontologists discovered a dinosaur fossil in the quarry.",
        "category": "Science",
        "explanation": "FOSSIL (Fosil): The preserved remains of a prehistoric organism in rock. E.g.: \"Paleontologists discovered a dinosaur fossil in the quarry.\""
      },
      {
        "id": "we_g8_h_27",
        "word": "GENOME",
        "clue": "The complete set of genetic material in an organism",
        "turkishMeaning": "Genom",
        "exampleSentence": "Mapping the human genome revolutionized modern genetics.",
        "category": "Science",
        "explanation": "GENOME (Genom): The complete set of genetic material in an organism. E.g.: \"Mapping the human genome revolutionized modern genetics.\""
      },
      {
        "id": "we_g8_h_28",
        "word": "HEATED",
        "clue": "Made hot or intensely energetic through thermal energy",
        "turkishMeaning": "Isıtılmış",
        "exampleSentence": "The test tube was gently heated over the laboratory burner.",
        "category": "Science",
        "explanation": "HEATED (Isıtılmış): Made hot or intensely energetic through thermal energy. E.g.: \"The test tube was gently heated over the laboratory burner.\""
      },
      {
        "id": "we_g8_h_29",
        "word": "DAMAGE",
        "clue": "Physical harm caused to buildings or natural terrain",
        "turkishMeaning": "Hasar, zarar",
        "exampleSentence": "The heavy storm caused severe damage to the coastal buildings.",
        "category": "Natural Forces",
        "explanation": "DAMAGE (Hasar, zarar): Physical harm caused to buildings or objects. E.g.: 'The heavy storm caused serious damage to the roof.'",
        "contentVersion": 2
      },
      {
        "id": "we_g8_h_30",
        "word": "RESCUE",
        "clue": "An act of saving someone from imminent peril or disaster",
        "turkishMeaning": "Kurtarma",
        "exampleSentence": "Rescue helicopters evacuated flood victims from rooftops.",
        "category": "Natural Forces",
        "explanation": "RESCUE (Kurtarma): An act of saving someone from imminent peril or disaster. E.g.: \"Rescue helicopters evacuated flood victims from rooftops.\""
      },
      {
        "id": "we_g8_h_31",
        "word": "VICTIM",
        "clue": "A person harmed, injured, or suffering as a result of disaster",
        "turkishMeaning": "Kurban, mağdur",
        "exampleSentence": "Relief charities provided blankets and warm soup to victims.",
        "category": "Natural Forces",
        "explanation": "VICTIM (Kurban, mağdur): A person harmed, injured, or suffering as a result of disaster. E.g.: \"Relief charities provided blankets and warm soup to victims.\""
      },
      {
        "id": "we_g8_h_32",
        "word": "IMPACT",
        "clue": "The striking of one object against another or strong effect",
        "turkishMeaning": "Etki, darbe",
        "exampleSentence": "The meteorite impact formed an enormous circular crater.",
        "category": "Natural Forces",
        "explanation": "IMPACT (Etki, darbe): The striking of one object against another or strong effect. E.g.: \"The meteorite impact formed an enormous circular crater.\""
      },
      {
        "id": "we_g8_h_33",
        "word": "WINTER",
        "clue": "The coldest season of the year characterized by snowfall",
        "turkishMeaning": "Kış",
        "exampleSentence": "Severe winter blizzards blocked access to mountain villages.",
        "category": "Natural Forces",
        "explanation": "WINTER (Kış): The coldest season of the year characterized by snowfall. E.g.: \"Severe winter blizzards blocked access to mountain villages.\""
      },
      {
        "id": "we_g8_h_34",
        "word": "GLOBAL",
        "clue": "Relating to the whole world; worldwide or universal",
        "turkishMeaning": "Küresel",
        "exampleSentence": "Global warming is triggering erratic weather phenomena.",
        "category": "Natural Forces",
        "explanation": "GLOBAL (Küresel): Relating to the whole world; worldwide or universal. E.g.: \"Global warming is triggering erratic weather phenomena.\""
      },
      {
        "id": "we_g8_h_35",
        "word": "OXYGEN",
        "clue": "The life-giving atmospheric gas required by animals",
        "turkishMeaning": "Oksijen",
        "exampleSentence": "Deep sea divers carry oxygen cylinders on long expeditions.",
        "category": "Science",
        "explanation": "OXYGEN (Oksijen): The life-giving atmospheric gas required by animals. E.g.: \"Deep sea divers carry oxygen cylinders on long expeditions.\""
      },
      {
        "id": "we_g8_h_36",
        "word": "NATURE",
        "clue": "The natural world untouched by human industrialization",
        "turkishMeaning": "Doğa",
        "exampleSentence": "Wilderness nature reserves protect endangered leopards.",
        "category": "Adventures",
        "explanation": "NATURE (Doğa): The natural world untouched by human industrialization. E.g.: \"Wilderness nature reserves protect endangered leopards.\""
      },
      {
        "id": "we_g8_h_37",
        "word": "COPING",
        "clue": "Managing or dealing successfully with challenging situations",
        "turkishMeaning": "Başa çıkma",
        "exampleSentence": "Developing healthy coping strategies reduces exam anxiety.",
        "category": "Friendship",
        "explanation": "COPING (Başa çıkma): Managing or dealing successfully with challenging situations. E.g.: \"Developing healthy coping strategies reduces exam anxiety.\""
      },
      {
        "id": "we_g8_h_38",
        "word": "FLIGHT",
        "clue": "A journey made through the air by plane or balloon",
        "turkishMeaning": "Uçuş",
        "exampleSentence": "The hot-air balloon flight over Cappadocia was breathtaking.",
        "category": "Tourism",
        "explanation": "FLIGHT (Uçuş): A journey made through the air by plane or balloon. E.g.: \"The hot-air balloon flight over Cappadocia was breathtaking.\""
      },
      {
        "id": "we_g8_h_39",
        "word": "SAMPLE",
        "clue": "A small quantity of material collected for scientific testing",
        "turkishMeaning": "Numune, örnek",
        "exampleSentence": "The rover collected a soil sample from the Martian surface.",
        "category": "Science",
        "explanation": "SAMPLE (Numune, örnek): A small quantity of material collected for scientific testing. E.g.: \"The rover collected a soil sample from the Martian surface.\""
      },
      {
        "id": "we_g8_h_40",
        "word": "THEORY",
        "clue": "A well-substantiated scientific explanation of natural facts",
        "turkishMeaning": "Teori, kuram",
        "exampleSentence": "Einstein formulated the revolutionary theory of relativity.",
        "category": "Science",
        "explanation": "THEORY (Teori, kuram): A well-substantiated scientific explanation of natural facts. E.g.: \"Einstein formulated the revolutionary theory of relativity.\""
      },
      {
        "id": "we_g8_h_41",
        "word": "SECRET",
        "clue": "Not known or seen by others; private confidence",
        "turkishMeaning": "Sır, gizli",
        "exampleSentence": "Keep your companion's personal secret faithfully.",
        "category": "Friendship",
        "explanation": "SECRET (Sır, gizli): Not known or seen by others; private confidence. E.g.: \"Keep your companion's personal secret faithfully.\""
      },
      {
        "id": "we_g8_h_42",
        "word": "CARING",
        "clue": "Displaying kindness and concern for other people",
        "turkishMeaning": "Şefkatli, ilgili",
        "exampleSentence": "A caring friend offers comfort during stressful weeks.",
        "category": "Friendship",
        "explanation": "CARING (Şefkatli, ilgili): Displaying kindness and concern for other people. E.g.: \"A caring friend offers comfort during stressful weeks.\""
      },
      {
        "id": "we_g8_h_43",
        "word": "LISTEN",
        "clue": "To give one's attention to a sound or someone speaking",
        "turkishMeaning": "Dinlemek",
        "exampleSentence": "Listen patiently before formulating your response.",
        "category": "Friendship",
        "explanation": "LISTEN (Dinlemek): To give one's attention to a sound or someone speaking. E.g.: \"Listen patiently before formulating your response.\""
      },
      {
        "id": "we_g8_h_44",
        "word": "SOCIAL",
        "clue": "Relating to society, human fellowship, and interaction",
        "turkishMeaning": "Sosyal",
        "exampleSentence": "Social activities develop teenage communication skills.",
        "category": "Teen Life",
        "explanation": "SOCIAL (Sosyal): Relating to society, human fellowship, and interaction. E.g.: \"Social activities develop teenage communication skills.\""
      },
      {
        "id": "we_g8_h_45",
        "word": "TRENDY",
        "clue": "Very fashionable or responsive to modern trends",
        "turkishMeaning": "Modaya uygun",
        "exampleSentence": "She wore trendy casual streetwear to the school fair.",
        "category": "Teen Life",
        "explanation": "TRENDY (Modaya uygun): Very fashionable or responsive to modern trends. E.g.: \"She wore trendy casual streetwear to the school fair.\""
      },
      {
        "id": "we_g8_h_46",
        "word": "MOBILE",
        "clue": "Able to be moved easily; relating to smartphones",
        "turkishMeaning": "Taşınabilir / Mobil",
        "exampleSentence": "Smart mobile phones access digital class encyclopedias.",
        "category": "Phone",
        "explanation": "MOBILE (Taşınabilir / Mobil): Able to be moved easily; relating to smartphones. E.g.: \"Smart mobile phones access digital class encyclopedias.\""
      },
      {
        "id": "we_g8_h_47",
        "word": "HANGUP",
        "clue": "To end a telephone call by replacing the receiver",
        "turkishMeaning": "Telefonu kapatmak",
        "exampleSentence": "Do not hangup abruptly while the speaker is talking.",
        "category": "Phone",
        "explanation": "HANGUP (Telefonu kapatmak): To end a telephone call by replacing the receiver. E.g.: \"Do not hangup abruptly while the speaker is talking.\""
      },
      {
        "id": "we_g8_h_48",
        "word": "SIGNAL",
        "clue": "An electrical impulse or radio transmission waves",
        "turkishMeaning": "Sinyal",
        "exampleSentence": "The cellular mobile signal was strong in the valley.",
        "category": "Phone",
        "explanation": "SIGNAL (Sinyal): An electrical impulse or radio transmission waves. E.g.: \"The cellular mobile signal was strong in the valley.\""
      },
      {
        "id": "we_g8_h_49",
        "word": "REPEAT",
        "clue": "To say or do something again for clarification",
        "turkishMeaning": "Tekrarlamak",
        "exampleSentence": "Could you repeat that telephone number once more?",
        "category": "Phone",
        "explanation": "REPEAT (Tekrarlamak): To say or do something again for clarification. E.g.: \"Could you repeat that telephone number once more?\""
      },
      {
        "id": "we_g8_h_50",
        "word": "BROWSE",
        "clue": "To search for information in internet web databases",
        "turkishMeaning": "Göz atmak / Gezinmek",
        "exampleSentence": "Browse accredited academic libraries for science data.",
        "category": "Internet",
        "explanation": "BROWSE (Göz atmak / Gezinmek): To search for information in internet web databases. E.g.: \"Browse accredited academic libraries for science data.\""
      },
      {
        "id": "we_g8_h_51",
        "word": "UPLOAD",
        "clue": "To transfer digital files from a client to a server",
        "turkishMeaning": "Yüklemek",
        "exampleSentence": "Upload your completed science presentation by five.",
        "category": "Internet",
        "explanation": "UPLOAD (Yüklemek): To transfer digital files from a client to a server. E.g.: \"Upload your completed science presentation by five.\""
      },
      {
        "id": "we_g8_h_52",
        "word": "ONLINE",
        "clue": "Connected to or available via the global internet",
        "turkishMeaning": "Çevrim içi",
        "exampleSentence": "Exercise vigilance whenever entering credentials online.",
        "category": "Internet",
        "explanation": "ONLINE (Çevrim içi): Connected to or available via the global internet. E.g.: \"Exercise vigilance whenever entering credentials online.\""
      },
      {
        "id": "we_g8_h_53",
        "word": "SEARCH",
        "clue": "To look for information in web databases or engines",
        "turkishMeaning": "Aramak, araştırmak",
        "exampleSentence": "Search reliable sources when drafting biology reports.",
        "category": "Internet",
        "explanation": "SEARCH (Aramak, araştırmak): To look for information in web databases or engines. E.g.: \"Search reliable sources when drafting biology reports.\""
      },
      {
        "id": "we_g8_h_54",
        "word": "RECIPE",
        "clue": "A set of culinary instructions for preparing a dish",
        "turkishMeaning": "Yemek tarifi",
        "exampleSentence": "Follow the traditional Italian pasta sauce recipe.",
        "category": "Kitchen",
        "explanation": "RECIPE (Yemek tarifi): A set of culinary instructions for preparing a dish. E.g.: \"Follow the traditional Italian pasta sauce recipe.\""
      },
      {
        "id": "we_g8_h_55",
        "word": "SEASON",
        "clue": "To add salt, herbs, or pepper to enhance flavor",
        "turkishMeaning": "Baharatlamak",
        "exampleSentence": "Season the roast vegetables with rosemary and oil.",
        "category": "Kitchen",
        "explanation": "SEASON (Baharatlamak): To add salt, herbs, or pepper to enhance flavor. E.g.: \"Season the roast vegetables with rosemary and oil.\""
      },
      {
        "id": "we_g8_h_56",
        "word": "WHISKS",
        "clue": "Culinary utensils beat eggs and cream into foams",
        "turkishMeaning": "Çırpıcılar",
        "exampleSentence": "The chef whisks egg whites until stiff peaks form.",
        "category": "Kitchen",
        "explanation": "WHISKS (Çırpıcılar): Culinary utensils beat eggs and cream into foams. E.g.: \"The chef whisks egg whites until stiff peaks form.\""
      },
      {
        "id": "we_g8_h_57",
        "word": "STRAIN",
        "clue": "Kitchen strainer bowl draining boiled pasta liquids",
        "turkishMeaning": "Süzmek",
        "exampleSentence": "Strain boiled macaroni into a stainless steel bowl.",
        "category": "Kitchen",
        "explanation": "STRAIN (Süzmek): Kitchen strainer bowl draining boiled pasta liquids. E.g.: \"Strain boiled macaroni into a stainless steel bowl.\""
      },
      {
        "id": "we_g8_h_58",
        "word": "BAKING",
        "clue": "The craft of cooking bread or pastry in hot ovens",
        "turkishMeaning": "Fırında pişirme",
        "exampleSentence": "Baking fresh sourdough bread requires yeast patience.",
        "category": "Kitchen",
        "explanation": "BAKING (Fırında pişirme): The craft of cooking bread or pastry in hot ovens. E.g.: \"Baking fresh sourdough bread requires yeast patience.\""
      },
      {
        "id": "we_g8_h_59",
        "word": "BOILED",
        "clue": "Cooked in water heated to one hundred Celsius",
        "turkishMeaning": "Haşlanmış",
        "exampleSentence": "Serve boiled garden peas alongside the roast potato.",
        "category": "Kitchen",
        "explanation": "BOILED (Haşlanmış): Cooked in water heated to one hundred Celsius. E.g.: \"Serve boiled garden peas alongside the roast potato.\""
      },
      {
        "id": "we_g8_h_60",
        "word": "PANTRY",
        "clue": "A small room or cupboard where foodstuffs are stored",
        "turkishMeaning": "Kiler",
        "exampleSentence": "Store dried grains and canned tomatoes in the pantry.",
        "category": "Kitchen",
        "explanation": "PANTRY (Kiler): A small room or cupboard where foodstuffs are stored. E.g.: \"Store dried grains and canned tomatoes in the pantry.\""
      },
      {
        "id": "we_g8_h_61",
        "word": "ALPINE",
        "clue": "Relating to high mountain peaks and alpine glaciers",
        "turkishMeaning": "Alplere özgü, dağlık",
        "exampleSentence": "Alpine mountaineers carried ropes across the pass.",
        "category": "Adventures",
        "explanation": "ALPINE (Alplere özgü, dağlık): Relating to high mountain peaks and alpine glaciers. E.g.: \"Alpine mountaineers carried ropes across the pass.\""
      },
      {
        "id": "we_g8_h_62",
        "word": "SAFETY",
        "clue": "The condition of being secure from hazard or peril",
        "turkishMeaning": "Güvenlik",
        "exampleSentence": "Wear your climbing helmet to maximize route safety.",
        "category": "Adventures",
        "explanation": "SAFETY (Güvenlik): The condition of being secure from hazard or peril. E.g.: \"Wear your climbing helmet to maximize route safety.\""
      },
      {
        "id": "we_g8_h_63",
        "word": "HELMET",
        "clue": "A hard protective hat worn by adventurers and riders",
        "turkishMeaning": "Kask",
        "exampleSentence": "Fasten your bicycle helmet chin strap snugly.",
        "category": "Adventures",
        "explanation": "HELMET (Kask): A hard protective hat worn by adventurers and riders. E.g.: \"Fasten your bicycle helmet chin strap snugly.\""
      },
      {
        "id": "we_g8_h_64",
        "word": "FLIGHT",
        "clue": "A journey made by an aircraft or hot-air balloon",
        "turkishMeaning": "Uçuş",
        "exampleSentence": "Our hot-air balloon flight over Goreme was magical.",
        "category": "Adventures",
        "explanation": "FLIGHT (Uçuş): A journey made by an aircraft or hot-air balloon. E.g.: \"Our hot-air balloon flight over Goreme was magical.\""
      },
      {
        "id": "we_g8_h_65",
        "word": "TRAVEL",
        "clue": "To go from one place to another over a distance",
        "turkishMeaning": "Seyahat etmek",
        "exampleSentence": "Traveling broadens teenage understanding of cultures.",
        "category": "Tourism",
        "explanation": "TRAVEL (Seyahat etmek): To go from one place to another over a distance. E.g.: \"Traveling broadens teenage understanding of cultures.\""
      },
      {
        "id": "we_g8_h_66",
        "word": "RESORT",
        "clue": "A commercial holiday hotel with extensive amenities",
        "turkishMeaning": "Tatil köyü",
        "exampleSentence": "The beach resort offered windsurfing lessons daily.",
        "category": "Tourism",
        "explanation": "RESORT (Tatil köyü): A commercial holiday hotel with extensive amenities. E.g.: \"The beach resort offered windsurfing lessons daily.\""
      },
      {
        "id": "we_g8_h_67",
        "word": "TICKET",
        "clue": "A printed or digital voucher entitling entry or travel",
        "turkishMeaning": "Bilet",
        "exampleSentence": "Keep your flight boarding ticket in your coat pocket.",
        "category": "Tourism",
        "explanation": "TICKET (Bilet): A printed or digital voucher entitling entry or travel. E.g.: \"Keep your flight boarding ticket in your coat pocket.\""
      },
      {
        "id": "we_g8_h_68",
        "word": "CHORES",
        "clue": "Routine domestic tasks required to keep homes tidy",
        "turkishMeaning": "Ev işleri",
        "exampleSentence": "Sharing chores equitably prevents family friction.",
        "category": "Chores",
        "explanation": "CHORES (Ev işleri): Routine domestic tasks required to keep homes tidy. E.g.: \"Sharing chores equitably prevents family friction.\""
      },
      {
        "id": "we_g8_h_69",
        "word": "VACUUM",
        "clue": "To clean rugs and carpets with an electric cleaner",
        "turkishMeaning": "Süpürmek (elektrikli)",
        "exampleSentence": "Vacuum the bedroom rug before the visitors arrive.",
        "category": "Chores",
        "explanation": "VACUUM (Süpürmek (elektrikli)): To clean rugs and carpets with an electric cleaner. E.g.: \"Vacuum the bedroom rug before the visitors arrive.\""
      },
      {
        "id": "we_g8_h_70",
        "word": "TIDIED",
        "clue": "Arranged things neatly in their proper places",
        "turkishMeaning": "Düzenledi",
        "exampleSentence": "She tidied her study desk before starting revision.",
        "category": "Chores",
        "explanation": "TIDIED (Düzenledi): Arranged things neatly in their proper places. E.g.: \"She tidied her study desk before starting revision.\""
      },
      {
        "id": "we_g8_h_71",
        "word": "METHOD",
        "clue": "A particular procedure for accomplishing scientific tasks",
        "turkishMeaning": "Yöntem",
        "exampleSentence": "Follow the scientific method to test hypotheses.",
        "category": "Science",
        "explanation": "METHOD (Yöntem): A particular procedure for accomplishing scientific tasks. E.g.: \"Follow the scientific method to test hypotheses.\""
      },
      {
        "id": "we_g8_h_72",
        "word": "THEORY",
        "clue": "A system of ideas intended to explain phenomena",
        "turkishMeaning": "Teori, kuram",
        "exampleSentence": "Einstein's theory of relativity revolutionized physics.",
        "category": "Science",
        "explanation": "THEORY (Teori, kuram): A system of ideas intended to explain phenomena. E.g.: \"Einstein's theory of relativity revolutionized physics.\""
      },
      {
        "id": "we_g8_h_73",
        "word": "RESULT",
        "clue": "A consequence, effect, or outcome of an experiment",
        "turkishMeaning": "Sonuç",
        "exampleSentence": "The experimental result proved our hypothesis valid.",
        "category": "Science",
        "explanation": "RESULT (Sonuç): A consequence, effect, or outcome of an experiment. E.g.: \"The experimental result proved our hypothesis valid.\""
      },
      {
        "id": "we_g8_h_74",
        "word": "QUAKES",
        "clue": "Sudden violent tremors of the ground; earthquakes",
        "turkishMeaning": "Depremler",
        "exampleSentence": "Severe quakes require robust structural engineering.",
        "category": "Natural Forces",
        "explanation": "QUAKES (Depremler): Sudden violent tremors of the ground; earthquakes. E.g.: \"Severe quakes require robust structural engineering.\""
      },
      {
        "id": "we_g8_h_75",
        "word": "TREMOR",
        "clue": "An involuntary vibration or a slight earthquake shake",
        "turkishMeaning": "Sarsıntı",
        "exampleSentence": "Seismologists detected a minor tremor near the fault.",
        "category": "Natural Forces",
        "explanation": "TREMOR (Sarsıntı): An involuntary vibration or a slight earthquake shake. E.g.: \"Seismologists detected a minor tremor near the fault.\""
      },
      {
        "id": "we_g8_h_76",
        "word": "DAMAGE",
        "clue": "Physical harm that impairs the value of structures",
        "turkishMeaning": "Hasar, zarar",
        "exampleSentence": "The earthquake caused structural damage to masonry.",
        "category": "Natural Forces",
        "explanation": "DAMAGE (Hasar, zarar): Physical harm that impairs the value of structures. E.g.: \"The earthquake caused structural damage to masonry.\""
      },
      {
        "id": "we_g8_h_77",
        "word": "RESCUE",
        "clue": "To save someone from dangerous or catastrophic ruins",
        "turkishMeaning": "Kurtarmak",
        "exampleSentence": "Rescue teams deployed sniffer dogs into the ruins.",
        "category": "Natural Forces",
        "explanation": "RESCUE (Kurtarmak): To save someone from dangerous or catastrophic ruins. E.g.: \"Rescue teams deployed sniffer dogs into the ruins.\""
      },
      {
        "id": "we_g8_h_78",
        "word": "DEBRIS",
        "clue": "Scattered fragments of wreckage after destruction",
        "turkishMeaning": "Enkaz, kalıntı",
        "exampleSentence": "Clear heavy debris carefully to find survivors.",
        "category": "Natural Forces",
        "explanation": "DEBRIS (Enkaz, kalıntı): Scattered fragments of wreckage after destruction. E.g.: \"Clear heavy debris carefully to find survivors.\""
      },
      {
        "id": "we_g8_h_79",
        "word": "DRILLS",
        "clue": "Regular training exercises rehearsing safety moves",
        "turkishMeaning": "Tatbikatlar",
        "exampleSentence": "Classroom earthquake drills prepare students for temblors.",
        "category": "Natural Forces",
        "explanation": "DRILLS (Tatbikatlar): Regular training exercises rehearsing safety moves. E.g.: \"Classroom earthquake drills prepare students for temblors.\""
      },
      {
        "id": "we_g8_h_80",
        "word": "NATURE",
        "clue": "The phenomena of the physical world collectively",
        "turkishMeaning": "Doğa",
        "exampleSentence": "Study nature to understand Earth's delicate balances.",
        "category": "Natural Forces",
        "explanation": "NATURE (Doğa): The phenomena of the physical world collectively. E.g.: \"Study nature to understand Earth's delicate balances.\""
      }
    ]
  }
};
