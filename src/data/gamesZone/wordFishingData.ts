/**
 * UNIT REVIEW ARCADE — WORD FISHING DATA BANK (PHASE 7A)
 * Version: 7.0.0
 * 
 * 240 validated unique questions across:
 * - Grade 7: Easy (40), Medium (40), Hard (40)
 * - Grade 8: Easy (40), Medium (40), Hard (40)
 */

import type { WordFishingBank } from '../../types/gamesZone';

export const WORD_FISHING_BANK: WordFishingBank = {
  'grade-7': {
    easy: [
      {
            "id": "wf_g7_e_01",
            "cluePrompt": "Hook the animal known as 'Man's best friend'",
            "clueCategory": "Animals",
            "targetWord": "Dog",
            "distractorWords": [
                  "Lion",
                  "Monkey",
                  "Eagle"
            ],
            "explanation": "Dogs are domestic animals celebrated for their loyalty."
      },
      {
            "id": "wf_g7_e_02",
            "cluePrompt": "Hook the large animal with a long trunk and big ears",
            "clueCategory": "Animals",
            "targetWord": "Elephant",
            "distractorWords": [
                  "Giraffe",
                  "Zebra",
                  "Tiger"
            ],
            "explanation": "Elephants are the largest living land mammals with long trunks."
      },
      {
            "id": "wf_g7_e_03",
            "cluePrompt": "Hook the animal that produces milk and eats grass on farms",
            "clueCategory": "Animals",
            "targetWord": "Cow",
            "distractorWords": [
                  "Bear",
                  "Wolf",
                  "Fox"
            ],
            "explanation": "Cows are farm animals that give us milk and dairy products."
      },
      {
            "id": "wf_g7_e_04",
            "cluePrompt": "Hook the sea creature with eight arms",
            "clueCategory": "Sea Life",
            "targetWord": "Octopus",
            "distractorWords": [
                  "Shark",
                  "Whale",
                  "Dolphin"
            ],
            "explanation": "An octopus is an ocean mollusc with eight flexible arms."
      },
      {
            "id": "wf_g7_e_05",
            "cluePrompt": "Hook the tall animal with a very long neck",
            "clueCategory": "Animals",
            "targetWord": "Giraffe",
            "distractorWords": [
                  "Hippo",
                  "Camel",
                  "Horse"
            ],
            "explanation": "Giraffes are tall African mammals with iconic long necks."
      },
      {
            "id": "wf_g7_e_06",
            "cluePrompt": "Hook the bird that can swim underwater but cannot fly",
            "clueCategory": "Animals",
            "targetWord": "Penguin",
            "distractorWords": [
                  "Parrot",
                  "Sparrow",
                  "Pigeon"
            ],
            "explanation": "Penguins are flightless birds adapted for swimming in cold oceans."
      },
      {
            "id": "wf_g7_e_07",
            "cluePrompt": "Hook the insect that makes sweet honey in hives",
            "clueCategory": "Insects",
            "targetWord": "Bee",
            "distractorWords": [
                  "Ant",
                  "Fly",
                  "Mosquito"
            ],
            "explanation": "Honey bees collect nectar and produce sweet honey."
      },
      {
            "id": "wf_g7_e_08",
            "cluePrompt": "Hook the small domestic animal that loves to catch mice",
            "clueCategory": "Pets",
            "targetWord": "Cat",
            "distractorWords": [
                  "Rabbit",
                  "Duck",
                  "Sheep"
            ],
            "explanation": "Cats are independent domestic pets famous for catching mice."
      },
      {
            "id": "wf_g7_e_09",
            "cluePrompt": "Hook the animal that hops and carries its baby in a pouch",
            "clueCategory": "Animals",
            "targetWord": "Kangaroo",
            "distractorWords": [
                  "Koala",
                  "Panda",
                  "Cheetah"
            ],
            "explanation": "Kangaroos are Australian marsupials with pouches."
      },
      {
            "id": "wf_g7_e_10",
            "cluePrompt": "Hook the huge ocean mammal that breathes air through a blowhole",
            "clueCategory": "Sea Life",
            "targetWord": "Whale",
            "distractorWords": [
                  "Tuna",
                  "Jellyfish",
                  "Crab"
            ],
            "explanation": "Whales are warm-blooded ocean mammals, not fish."
      },
      {
            "id": "wf_g7_e_11",
            "cluePrompt": "Hook the yellow fruit that monkeys love to eat",
            "clueCategory": "Food",
            "targetWord": "Banana",
            "distractorWords": [
                  "Apple",
                  "Orange",
                  "Grape"
            ],
            "explanation": "Bananas are curved, yellow tropical fruits."
      },
      {
            "id": "wf_g7_e_12",
            "cluePrompt": "Hook the round baked food with sauce, cheese, and toppings",
            "clueCategory": "Food",
            "targetWord": "Pizza",
            "distractorWords": [
                  "Soup",
                  "Salad",
                  "Steak"
            ],
            "explanation": "Pizza is a famous Italian dish topped with cheese and tomato sauce."
      },
      {
            "id": "wf_g7_e_13",
            "cluePrompt": "Hook the warm liquid food usually eaten in a bowl with a spoon",
            "clueCategory": "Food",
            "targetWord": "Soup",
            "distractorWords": [
                  "Bread",
                  "Burger",
                  "Cake"
            ],
            "explanation": "Soup is a liquid food made by boiling vegetables, meat, or lentils."
      },
      {
            "id": "wf_g7_e_14",
            "cluePrompt": "Hook the white liquid produced by cows and goats",
            "clueCategory": "Drinks",
            "targetWord": "Milk",
            "distractorWords": [
                  "Tea",
                  "Lemonade",
                  "Coffee"
            ],
            "explanation": "Milk is a nutrient-rich dairy drink full of calcium."
      },
      {
            "id": "wf_g7_e_15",
            "cluePrompt": "Hook the cold sweet dessert made from cream or milk",
            "clueCategory": "Desserts",
            "targetWord": "Ice cream",
            "distractorWords": [
                  "Toast",
                  "Biscuit",
                  "Pie"
            ],
            "explanation": "Ice cream is a chilled sweet treat loved worldwide."
      },
      {
            "id": "wf_g7_e_16",
            "cluePrompt": "Hook the red vegetable commonly sliced into fresh salads",
            "clueCategory": "Vegetables",
            "targetWord": "Tomato",
            "distractorWords": [
                  "Carrot",
                  "Potato",
                  "Cucumber"
            ],
            "explanation": "Tomatoes are juicy red fruits botanically, eaten as vegetables."
      },
      {
            "id": "wf_g7_e_17",
            "cluePrompt": "Hook the orange root vegetable that rabbits enjoy",
            "clueCategory": "Vegetables",
            "targetWord": "Carrot",
            "distractorWords": [
                  "Onion",
                  "Garlic",
                  "Cabbage"
            ],
            "explanation": "Carrots are crunchy, orange root vegetables rich in vitamin A."
      },
      {
            "id": "wf_g7_e_18",
            "cluePrompt": "Hook the popular morning beverage made from brewed dried leaves",
            "clueCategory": "Drinks",
            "targetWord": "Tea",
            "distractorWords": [
                  "Cola",
                  "Milkshake",
                  "Smoothie"
            ],
            "explanation": "Tea is brewed by steeping dried tea leaves in hot water."
      },
      {
            "id": "wf_g7_e_19",
            "cluePrompt": "Hook the baked bakery item made from flour, yeast, and water",
            "clueCategory": "Food",
            "targetWord": "Bread",
            "distractorWords": [
                  "Pasta",
                  "Rice",
                  "Cereal"
            ],
            "explanation": "Bread is a staple food baked from dough."
      },
      {
            "id": "wf_g7_e_20",
            "cluePrompt": "Hook the oval food laid by chickens with a white and yolk",
            "clueCategory": "Food",
            "targetWord": "Egg",
            "distractorWords": [
                  "Cheese",
                  "Butter",
                  "Yogurt"
            ],
            "explanation": "Eggs are laid by hens and are rich in protein."
      },
      {
            "id": "wf_g7_e_21",
            "cluePrompt": "Hook the book with blank pages used for writing study notes",
            "clueCategory": "School Supplies",
            "targetWord": "Notebook",
            "distractorWords": [
                  "Eraser",
                  "Scissors",
                  "Compass"
            ],
            "explanation": "Students write notes and homework inside a notebook."
      },
      {
            "id": "wf_g7_e_22",
            "cluePrompt": "Hook the tool used to rub out pencil mistakes",
            "clueCategory": "School Supplies",
            "targetWord": "Eraser",
            "distractorWords": [
                  "Ruler",
                  "Stapler",
                  "Pencil sharpener"
            ],
            "explanation": "An eraser (rubber) cleans pencil marks off paper."
      },
      {
            "id": "wf_g7_e_23",
            "cluePrompt": "Hook the bag used by students to carry books to class",
            "clueCategory": "School Supplies",
            "targetWord": "Backpack",
            "distractorWords": [
                  "Suitcase",
                  "Wallet",
                  "Handbag"
            ],
            "explanation": "A backpack is worn on the back to carry school essentials."
      },
      {
            "id": "wf_g7_e_24",
            "cluePrompt": "Hook the straight wooden or plastic tool used to measure centimetres",
            "clueCategory": "School Supplies",
            "targetWord": "Ruler",
            "distractorWords": [
                  "Calculator",
                  "Highlighter",
                  "Folder"
            ],
            "explanation": "A ruler has centimetre markings for drawing straight lines."
      },
      {
            "id": "wf_g7_e_25",
            "cluePrompt": "Hook the piece of furniture designed for sleeping comfortably",
            "clueCategory": "Furniture",
            "targetWord": "Bed",
            "distractorWords": [
                  "Sofa",
                  "Wardrobe",
                  "Bookshelf"
            ],
            "explanation": "A bed with a mattress is where we sleep at night."
      },
      {
            "id": "wf_g7_e_26",
            "cluePrompt": "Hook the kitchen appliance used to keep food and drinks cold",
            "clueCategory": "Appliances",
            "targetWord": "Fridge",
            "distractorWords": [
                  "Oven",
                  "Toaster",
                  "Blender"
            ],
            "explanation": "A refrigerator keeps perishables fresh at cold temperatures."
      },
      {
            "id": "wf_g7_e_27",
            "cluePrompt": "Hook the room in a house where meals are cooked",
            "clueCategory": "Rooms",
            "targetWord": "Kitchen",
            "distractorWords": [
                  "Bathroom",
                  "Attic",
                  "Balcony"
            ],
            "explanation": "The kitchen is equipped with a stove and oven for cooking."
      },
      {
            "id": "wf_g7_e_28",
            "cluePrompt": "Hook the furniture piece with drawers and a flat top for studying",
            "clueCategory": "Furniture",
            "targetWord": "Desk",
            "distractorWords": [
                  "Armchair",
                  "Cupboard",
                  "Stool"
            ],
            "explanation": "A study desk provides a flat surface for reading and writing."
      },
      {
            "id": "wf_g7_e_29",
            "cluePrompt": "Hook the item on the wall that tells what hour and minute it is",
            "clueCategory": "Home",
            "targetWord": "Clock",
            "distractorWords": [
                  "Mirror",
                  "Painting",
                  "Calendar"
            ],
            "explanation": "Clocks measure and show the current time of day."
      },
      {
            "id": "wf_g7_e_30",
            "cluePrompt": "Hook the opening in a wall with glass that lets sunlight in",
            "clueCategory": "Home",
            "targetWord": "Window",
            "distractorWords": [
                  "Door",
                  "Ceiling",
                  "Floor"
            ],
            "explanation": "Windows allow natural light and fresh air into a room."
      },
      {
            "id": "wf_g7_e_31",
            "cluePrompt": "Hook the professional who treats sick or injured patients",
            "clueCategory": "Occupations",
            "targetWord": "Doctor",
            "distractorWords": [
                  "Chef",
                  "Pilot",
                  "Mechanic"
            ],
            "explanation": "Doctors examine patients and prescribe medical treatments."
      },
      {
            "id": "wf_g7_e_32",
            "cluePrompt": "Hook the person who educates students in a school classroom",
            "clueCategory": "Occupations",
            "targetWord": "Teacher",
            "distractorWords": [
                  "Lawyer",
                  "Waiter",
                  "Farmer"
            ],
            "explanation": "Teachers guide and instruct students in learning subjects."
      },
      {
            "id": "wf_g7_e_33",
            "cluePrompt": "Hook the person who prepares delicious meals in a restaurant",
            "clueCategory": "Occupations",
            "targetWord": "Chef",
            "distractorWords": [
                  "Tailor",
                  "Dentist",
                  "Architect"
            ],
            "explanation": "Chefs are professional cooks in kitchens and restaurants."
      },
      {
            "id": "wf_g7_e_34",
            "cluePrompt": "Hook the person who flies aeroplanes through the sky",
            "clueCategory": "Occupations",
            "targetWord": "Pilot",
            "distractorWords": [
                  "Driver",
                  "Sailor",
                  "Astronaut"
            ],
            "explanation": "Pilots operate the flight controls of aircraft."
      },
      {
            "id": "wf_g7_e_35",
            "cluePrompt": "Hook the doctor specializing in taking care of teeth and gums",
            "clueCategory": "Occupations",
            "targetWord": "Dentist",
            "distractorWords": [
                  "Surgeon",
                  "Pharmacist",
                  "Nurse"
            ],
            "explanation": "Dentists clean teeth, fill cavities, and check oral health."
      },
      {
            "id": "wf_g7_e_36",
            "cluePrompt": "Hook the quiet place where you can borrow and read books",
            "clueCategory": "Places",
            "targetWord": "Library",
            "distractorWords": [
                  "Cinema",
                  "Gym",
                  "Stadium"
            ],
            "explanation": "A library lends books and provides silent study areas."
      },
      {
            "id": "wf_g7_e_37",
            "cluePrompt": "Hook the shop where people buy fresh bread and pastries",
            "clueCategory": "Places",
            "targetWord": "Bakery",
            "distractorWords": [
                  "Pharmacy",
                  "Butcher",
                  "Florist"
            ],
            "explanation": "A bakery bakes and sells fresh bread, bagels, and rolls."
      },
      {
            "id": "wf_g7_e_38",
            "cluePrompt": "Hook the building where people go to watch movies on a big screen",
            "clueCategory": "Places",
            "targetWord": "Cinema",
            "distractorWords": [
                  "Museum",
                  "Post office",
                  "Bank"
            ],
            "explanation": "Cinemas project motion pictures onto large screens with surround sound."
      },
      {
            "id": "wf_g7_e_39",
            "cluePrompt": "Hook the shop where medicines are dispensed by a pharmacist",
            "clueCategory": "Places",
            "targetWord": "Pharmacy",
            "distractorWords": [
                  "Stationery",
                  "Supermarket",
                  "Boutique"
            ],
            "explanation": "Pharmacies dispense prescriptions and health remedies."
      },
      {
            "id": "wf_g7_e_40",
            "cluePrompt": "Hook the place where athletes play matches in front of spectators",
            "clueCategory": "Places",
            "targetWord": "Stadium",
            "distractorWords": [
                  "Airport",
                  "Harbour",
                  "Factory"
            ],
            "explanation": "A stadium has sports fields surrounded by seating tiers."
      }
],
    medium: [
      {
            "id": "wf_g7_m_01",
            "cluePrompt": "Hook the water sport where athletes paddle through rapid rivers",
            "clueCategory": "Sports",
            "targetWord": "Rafting",
            "distractorWords": [
                  "Bowling",
                  "Archery",
                  "Darts"
            ],
            "explanation": "White-water rafting involves navigating river rapids in an inflatable raft."
      },
      {
            "id": "wf_g7_m_02",
            "cluePrompt": "Hook the game played with two rackets, a net, and a shuttlecock",
            "clueCategory": "Sports",
            "targetWord": "Badminton",
            "distractorWords": [
                  "Squash",
                  "Cricket",
                  "Polo"
            ],
            "explanation": "Badminton is played hitting a feathered shuttlecock over a net."
      },
      {
            "id": "wf_g7_m_03",
            "cluePrompt": "Hook the sport where two teams try to throw a ball into elevated hoops",
            "clueCategory": "Sports",
            "targetWord": "Basketball",
            "distractorWords": [
                  "Volleyball",
                  "Handball",
                  "Baseball"
            ],
            "explanation": "Basketball involves dribbling and shooting into an elevated hoop."
      },
      {
            "id": "wf_g7_m_04",
            "cluePrompt": "Hook the activity of walking long distances across countryside or hills",
            "clueCategory": "Hobbies",
            "targetWord": "Hiking",
            "distractorWords": [
                  "Jogging",
                  "Climbing",
                  "Skiing"
            ],
            "explanation": "Hiking is scenic trail walking in nature."
      },
      {
            "id": "wf_g7_m_05",
            "cluePrompt": "Hook the winter sport where athletes slide down snow-covered slopes on two planks",
            "clueCategory": "Sports",
            "targetWord": "Skiing",
            "distractorWords": [
                  "Skating",
                  "Surfing",
                  "Sledging"
            ],
            "explanation": "Skiing uses two long skis strapped to boots to glide on snow."
      },
      {
            "id": "wf_g7_m_06",
            "cluePrompt": "Hook the target sport where arrows are shot from a bow",
            "clueCategory": "Sports",
            "targetWord": "Archery",
            "distractorWords": [
                  "Fencing",
                  "Javelin",
                  "Billiards"
            ],
            "explanation": "Archery is the skill of shooting arrows at a bullseye."
      },
      {
            "id": "wf_g7_m_07",
            "cluePrompt": "Hook the peaceful hobby of cultivating flowers and plants in soil",
            "clueCategory": "Hobbies",
            "targetWord": "Gardening",
            "distractorWords": [
                  "Knitting",
                  "Pottery",
                  "Woodwork"
            ],
            "explanation": "Gardening involves growing plants, vegetables, and ornamental flowers."
      },
      {
            "id": "wf_g7_m_08",
            "cluePrompt": "Hook the combat sport where athletes wear protective gloves inside a ring",
            "clueCategory": "Sports",
            "targetWord": "Boxing",
            "distractorWords": [
                  "Karate",
                  "Wrestling",
                  "Judo"
            ],
            "explanation": "Boxing is a sport involving punches thrown with padded gloves."
      },
      {
            "id": "wf_g7_m_09",
            "cluePrompt": "Hook the board game featuring kings, queens, bishops, and knights",
            "clueCategory": "Games",
            "targetWord": "Chess",
            "distractorWords": [
                  "Checkers",
                  "Monopoly",
                  "Scrabble"
            ],
            "explanation": "Chess is an ancient strategy game played on an 8x8 chequered board."
      },
      {
            "id": "wf_g7_m_10",
            "cluePrompt": "Hook the water sport where riders stand on a board catching ocean waves",
            "clueCategory": "Sports",
            "targetWord": "Surfing",
            "distractorWords": [
                  "Diving",
                  "Rowing",
                  "Kayaking"
            ],
            "explanation": "Surfers ride ocean swells towards shore on surfboards."
      },
      {
            "id": "wf_g7_m_11",
            "cluePrompt": "Hook the word meaning 'Feeling happy, enthusiastic, and eager about an upcoming event'",
            "clueCategory": "Emotions",
            "targetWord": "Excited",
            "distractorWords": [
                  "Bored",
                  "Angry",
                  "Tired"
            ],
            "explanation": "Excited describes energetic anticipation and happiness."
      },
      {
            "id": "wf_g7_m_12",
            "cluePrompt": "Hook the word for someone who feels afraid or frightened by danger",
            "clueCategory": "Emotions",
            "targetWord": "Scared",
            "distractorWords": [
                  "Brave",
                  "Calm",
                  "Proud"
            ],
            "explanation": "Scared means feeling fear or panic."
      },
      {
            "id": "wf_g7_m_13",
            "cluePrompt": "Hook the personality trait for someone who readily shares their belongings with others",
            "clueCategory": "Personality",
            "targetWord": "Generous",
            "distractorWords": [
                  "Selfish",
                  "Greedy",
                  "Mean"
            ],
            "explanation": "Generous people enjoy giving and sharing freely."
      },
      {
            "id": "wf_g7_m_14",
            "cluePrompt": "Hook the trait for a person who always tells the truth and never lies",
            "clueCategory": "Personality",
            "targetWord": "Honest",
            "distractorWords": [
                  "Dishonest",
                  "Sneaky",
                  "Deceptive"
            ],
            "explanation": "Honesty means sincerity and telling the factual truth."
      },
      {
            "id": "wf_g7_m_15",
            "cluePrompt": "Hook the feeling of being displeased because something is dull and uninteresting",
            "clueCategory": "Emotions",
            "targetWord": "Bored",
            "distractorWords": [
                  "Curious",
                  "Astonished",
                  "Delighted"
            ],
            "explanation": "Boredom occurs when an activity lacks excitement or interest."
      },
      {
            "id": "wf_g7_m_16",
            "cluePrompt": "Hook the personality trait of someone who refuses to change their mind easily",
            "clueCategory": "Personality",
            "targetWord": "Stubborn",
            "distractorWords": [
                  "Easygoing",
                  "Flexible",
                  "Polite"
            ],
            "explanation": "Stubborn people firmly hold onto their opinions."
      },
      {
            "id": "wf_g7_m_17",
            "cluePrompt": "Hook the emotion felt when something unexpected and extraordinary happens",
            "clueCategory": "Emotions",
            "targetWord": "Surprised",
            "distractorWords": [
                  "Upset",
                  "Annoyed",
                  "Jealous"
            ],
            "explanation": "Surprise is the reaction to an unexpected revelation or event."
      },
      {
            "id": "wf_g7_m_18",
            "cluePrompt": "Hook the trait of someone who always arrives on time without delay",
            "clueCategory": "Personality",
            "targetWord": "Punctual",
            "distractorWords": [
                  "Clumsy",
                  "Forgetful",
                  "Lazy"
            ],
            "explanation": "Punctual people are never late for appointments."
      },
      {
            "id": "wf_g7_m_19",
            "cluePrompt": "Hook the feeling of deep satisfaction with one's own or another's achievement",
            "clueCategory": "Emotions",
            "targetWord": "Proud",
            "distractorWords": [
                  "Ashamed",
                  "Guilty",
                  "Embarrassed"
            ],
            "explanation": "Pride is a positive emotion stemming from notable accomplishment."
      },
      {
            "id": "wf_g7_m_20",
            "cluePrompt": "Hook the trait of being quiet and nervous around unfamiliar people",
            "clueCategory": "Personality",
            "targetWord": "Shy",
            "distractorWords": [
                  "Outgoing",
                  "Talkative",
                  "Confident"
            ],
            "explanation": "Shy people feel timid and hesitant in social settings."
      },
      {
            "id": "wf_g7_m_21",
            "cluePrompt": "Hook the sudden electric discharge accompanied by bright light during a storm",
            "clueCategory": "Weather",
            "targetWord": "Lightning",
            "distractorWords": [
                  "Thunder",
                  "Hail",
                  "Breeze"
            ],
            "explanation": "Lightning is a brilliant electrical flash between clouds and earth."
      },
      {
            "id": "wf_g7_m_22",
            "cluePrompt": "Hook the loud booming sound that follows an electrical lightning flash",
            "clueCategory": "Weather",
            "targetWord": "Thunder",
            "distractorWords": [
                  "Tornado",
                  "Fog",
                  "Drizzle"
            ],
            "explanation": "Thunder is the sonic shockwave produced by lightning heating air."
      },
      {
            "id": "wf_g7_m_23",
            "cluePrompt": "Hook pellets of frozen rain that fall in showers from cumulonimbus clouds",
            "clueCategory": "Weather",
            "targetWord": "Hail",
            "distractorWords": [
                  "Snow",
                  "Dew",
                  "Frost"
            ],
            "explanation": "Hail consists of solid balls of ice falling from storm clouds."
      },
      {
            "id": "wf_g7_m_24",
            "cluePrompt": "Hook thick cloud water droplets near the ground that restrict visibility",
            "clueCategory": "Weather",
            "targetWord": "Fog",
            "distractorWords": [
                  "Mist",
                  "Smog",
                  "Smoke"
            ],
            "explanation": "Dense fog reduces visibility for drivers and navigators."
      },
      {
            "id": "wf_g7_m_25",
            "cluePrompt": "Hook a gentle, light wind that blows pleasantly on a warm day",
            "clueCategory": "Weather",
            "targetWord": "Breeze",
            "distractorWords": [
                  "Gale",
                  "Hurricane",
                  "Typhoon"
            ],
            "explanation": "A breeze is a soft, refreshing movement of air."
      },
      {
            "id": "wf_g7_m_26",
            "cluePrompt": "Hook the curved arc of seven vibrant colours appearing in the sky after rain",
            "clueCategory": "Nature",
            "targetWord": "Rainbow",
            "distractorWords": [
                  "Aurora",
                  "Horizon",
                  "Sunrise"
            ],
            "explanation": "Rainbows form when sunlight refracts through falling raindrops."
      },
      {
            "id": "wf_g7_m_27",
            "cluePrompt": "Hook an arid dry biome with sandy dunes and very scarce rainfall",
            "clueCategory": "Geography",
            "targetWord": "Desert",
            "distractorWords": [
                  "Swamp",
                  "Jungle",
                  "Glacier"
            ],
            "explanation": "Deserts are barren landscapes with little precipitation."
      },
      {
            "id": "wf_g7_m_28",
            "cluePrompt": "Hook a piece of land entirely surrounded on all sides by water",
            "clueCategory": "Geography",
            "targetWord": "Island",
            "distractorWords": [
                  "Peninsula",
                  "Valley",
                  "Canyon"
            ],
            "explanation": "An island is completely encircled by ocean, sea, or lake."
      },
      {
            "id": "wf_g7_m_29",
            "cluePrompt": "Hook a massive mountain of slow-moving compressed ice found in polar regions",
            "clueCategory": "Geography",
            "targetWord": "Glacier",
            "distractorWords": [
                  "Volcano",
                  "Plateau",
                  "Crater"
            ],
            "explanation": "Glaciers are enormous bodies of dense, slowly flowing ice."
      },
      {
            "id": "wf_g7_m_30",
            "cluePrompt": "Hook a mountain opening with a crater that can erupt lava and ash",
            "clueCategory": "Geography",
            "targetWord": "Volcano",
            "distractorWords": [
                  "Waterfall",
                  "Cave",
                  "Cliff"
            ],
            "explanation": "Volcanoes rupture Earth's crust to vent molten magma."
      },
      {
            "id": "wf_g7_m_31",
            "cluePrompt": "Hook the official government document required for travelling to foreign countries",
            "clueCategory": "Travel",
            "targetWord": "Passport",
            "distractorWords": [
                  "Receipt",
                  "License",
                  "Diploma"
            ],
            "explanation": "Passports certify citizenship and allow international border crossing."
      },
      {
            "id": "wf_g7_m_32",
            "cluePrompt": "Hook bags and suitcases packed with personal clothes for a trip",
            "clueCategory": "Travel",
            "targetWord": "Luggage",
            "distractorWords": [
                  "Cargo",
                  "Parcel",
                  "Package"
            ],
            "explanation": "Luggage (or baggage) holds travellers' personal belongings."
      },
      {
            "id": "wf_g7_m_33",
            "cluePrompt": "Hook an object bought or kept as a memento of a visit or holiday",
            "clueCategory": "Travel",
            "targetWord": "Souvenir",
            "distractorWords": [
                  "Coupon",
                  "Brochure",
                  "Postcard"
            ],
            "explanation": "A souvenir reminds travellers of places they have visited."
      },
      {
            "id": "wf_g7_m_34",
            "cluePrompt": "Hook the building where people board commercial aeroplanes",
            "clueCategory": "Travel",
            "targetWord": "Airport",
            "distractorWords": [
                  "Station",
                  "Terminal",
                  "Subway"
            ],
            "explanation": "Airports feature runways, hangars, and passenger terminals."
      },
      {
            "id": "wf_g7_m_35",
            "cluePrompt": "Hook a continuous pain located inside the head",
            "clueCategory": "Health",
            "targetWord": "Headache",
            "distractorWords": [
                  "Toothache",
                  "Fever",
                  "Cough"
            ],
            "explanation": "A headache is pain experienced anywhere in the region of the head."
      },
      {
            "id": "wf_g7_m_36",
            "cluePrompt": "Hook an abnormally high body temperature that signals illness or infection",
            "clueCategory": "Health",
            "targetWord": "Fever",
            "distractorWords": [
                  "Chill",
                  "Bruise",
                  "Scratch"
            ],
            "explanation": "A fever is body temperature elevated above the normal 37°C."
      },
      {
            "id": "wf_g7_m_37",
            "cluePrompt": "Hook an instrument used by doctors to measure body temperature",
            "clueCategory": "Health",
            "targetWord": "Thermometer",
            "distractorWords": [
                  "Stethoscope",
                  "Bandage",
                  "Syringe"
            ],
            "explanation": "Thermometers accurately register internal thermal readings."
      },
      {
            "id": "wf_g7_m_38",
            "cluePrompt": "Hook a strip of fabric used to bind and protect a wound or injury",
            "clueCategory": "Health",
            "targetWord": "Bandage",
            "distractorWords": [
                  "Plaster",
                  "Stitch",
                  "Ointment"
            ],
            "explanation": "Bandages support dressings and immobilize injured limbs."
      },
      {
            "id": "wf_g7_m_39",
            "cluePrompt": "Hook the written order from a doctor specifying medicine for a patient",
            "clueCategory": "Health",
            "targetWord": "Prescription",
            "distractorWords": [
                  "Receipt",
                  "Bill",
                  "Notice"
            ],
            "explanation": "A prescription authorizes a chemist to supply medical drugs."
      },
      {
            "id": "wf_g7_m_40",
            "cluePrompt": "Hook the vehicle equipped to transport injured patients swiftly to hospital",
            "clueCategory": "Health",
            "targetWord": "Ambulance",
            "distractorWords": [
                  "Police car",
                  "Fire truck",
                  "Taxi"
            ],
            "explanation": "Ambulances provide emergency medical care en route to hospital."
      }
],
    hard: [
      {
            "id": "wf_g7_h_01",
            "cluePrompt": "Hook the process of converting waste materials into reusable new products",
            "clueCategory": "Environment",
            "targetWord": "Recycling",
            "distractorWords": [
                  "Littering",
                  "Polluting",
                  "Deforestation"
            ],
            "explanation": "Recycling recovers raw materials like plastic, glass, and paper."
      },
      {
            "id": "wf_g7_h_02",
            "cluePrompt": "Hook the natural surroundings in which plants and animals live",
            "clueCategory": "Environment",
            "targetWord": "Habitat",
            "distractorWords": [
                  "Territory",
                  "Reserve",
                  "Sanctuary"
            ],
            "explanation": "A habitat provides organisms with food, water, and shelter."
      },
      {
            "id": "wf_g7_h_03",
            "cluePrompt": "Hook the harmful contamination of air, water, or soil by toxic substances",
            "clueCategory": "Environment",
            "targetWord": "Pollution",
            "distractorWords": [
                  "Preservation",
                  "Purification",
                  "Conservation"
            ],
            "explanation": "Pollution degrades ecological systems and public health."
      },
      {
            "id": "wf_g7_h_04",
            "cluePrompt": "Hook animals or plants at serious risk of disappearing forever from Earth",
            "clueCategory": "Environment",
            "targetWord": "Endangered",
            "distractorWords": [
                  "Extinct",
                  "Abundant",
                  "Domestic"
            ],
            "explanation": "Endangered species face imminent extinction without protection."
      },
      {
            "id": "wf_g7_h_05",
            "cluePrompt": "Hook energy harnessed directly from sunlight using photovoltaic panels",
            "clueCategory": "Science",
            "targetWord": "Solar energy",
            "distractorWords": [
                  "Fossil fuel",
                  "Nuclear power",
                  "Geothermal"
            ],
            "explanation": "Solar power converts radiant sun rays into clean electricity."
      },
      {
            "id": "wf_g7_h_06",
            "cluePrompt": "Hook the large-scale clearing or cutting down of natural forest trees",
            "clueCategory": "Environment",
            "targetWord": "Deforestation",
            "distractorWords": [
                  "Reforestation",
                  "Afforestation",
                  "Cultivation"
            ],
            "explanation": "Deforestation destroys biodiversity and contributes to carbon emissions."
      },
      {
            "id": "wf_g7_h_07",
            "cluePrompt": "Hook the gradual increase in overall global temperature due to greenhouse gases",
            "clueCategory": "Environment",
            "targetWord": "Global warming",
            "distractorWords": [
                  "Ozone layer",
                  "Acid rain",
                  "Ice age"
            ],
            "explanation": "Global warming causes glaciers to melt and alters weather patterns."
      },
      {
            "id": "wf_g7_h_08",
            "cluePrompt": "Hook an optical instrument used to observe distant celestial bodies like stars",
            "clueCategory": "Science",
            "targetWord": "Telescope",
            "distractorWords": [
                  "Microscope",
                  "Periscope",
                  "Kaleidoscope"
            ],
            "explanation": "Astronomers peer through telescopes to examine distant galaxies."
      },
      {
            "id": "wf_g7_h_09",
            "cluePrompt": "Hook an instrument used in laboratories to view microscopic bacteria and cells",
            "clueCategory": "Science",
            "targetWord": "Microscope",
            "distractorWords": [
                  "Stethoscope",
                  "Binoculars",
                  "Projector"
            ],
            "explanation": "Microscopes magnify tiny microscopic specimens thousands of times."
      },
      {
            "id": "wf_g7_h_10",
            "cluePrompt": "Hook a scientific test conducted under controlled conditions to discover facts",
            "clueCategory": "Science",
            "targetWord": "Experiment",
            "distractorWords": [
                  "Hypothesis",
                  "Conclusion",
                  "Observation"
            ],
            "explanation": "Scientists run controlled experiments to validate hypotheses."
      },
      {
            "id": "wf_g7_h_11",
            "cluePrompt": "Hook the input device with letters and numbers used to type text on computers",
            "clueCategory": "Technology",
            "targetWord": "Keyboard",
            "distractorWords": [
                  "Monitor",
                  "Webcam",
                  "Speaker"
            ],
            "explanation": "Keyboards allow users to type characters and commands into PCs."
      },
      {
            "id": "wf_g7_h_12",
            "cluePrompt": "Hook the physical display screen where visual output is presented to the user",
            "clueCategory": "Technology",
            "targetWord": "Monitor",
            "distractorWords": [
                  "Processor",
                  "Modem",
                  "Motherboard"
            ],
            "explanation": "A computer monitor displays graphics, videos, and software windows."
      },
      {
            "id": "wf_g7_h_13",
            "cluePrompt": "Hook the act of copying data or software from the internet onto a local computer",
            "clueCategory": "Technology",
            "targetWord": "Download",
            "distractorWords": [
                  "Upload",
                  "Stream",
                  "Install"
            ],
            "explanation": "Downloading transfers files from a remote server to local storage."
      },
      {
            "id": "wf_g7_h_14",
            "cluePrompt": "Hook the secret sequence of characters used to log in securely to an account",
            "clueCategory": "Technology",
            "targetWord": "Password",
            "distractorWords": [
                  "Username",
                  "Fingerprint",
                  "Captcha"
            ],
            "explanation": "Strong passwords prevent unauthorized access to digital profiles."
      },
      {
            "id": "wf_g7_h_15",
            "cluePrompt": "Hook the portable computer with an integrated screen and folding clamshell body",
            "clueCategory": "Technology",
            "targetWord": "Laptop",
            "distractorWords": [
                  "Tablet",
                  "Desktop",
                  "Console"
            ],
            "explanation": "Laptops combine mobile computing power with built-in battery."
      },
      {
            "id": "wf_g7_h_16",
            "cluePrompt": "Hook a wireless internet network technology found in homes and schools",
            "clueCategory": "Technology",
            "targetWord": "Wi-Fi",
            "distractorWords": [
                  "Bluetooth",
                  "Ethernet",
                  "Cellular"
            ],
            "explanation": "Wi-Fi enables wireless radio-wave data transfer between devices."
      },
      {
            "id": "wf_g7_h_17",
            "cluePrompt": "Hook sending files, images, or videos from your computer up to a web server",
            "clueCategory": "Technology",
            "targetWord": "Upload",
            "distractorWords": [
                  "Download",
                  "Delete",
                  "Refresh"
            ],
            "explanation": "Uploading pushes local digital files up to internet platforms."
      },
      {
            "id": "wf_g7_h_18",
            "cluePrompt": "Hook an application program designed to run on smartphones and tablets",
            "clueCategory": "Technology",
            "targetWord": "App",
            "distractorWords": [
                  "Driver",
                  "Browser",
                  "Algorithm"
            ],
            "explanation": "Apps offer specific software tools and games on smart mobile devices."
      },
      {
            "id": "wf_g7_h_19",
            "cluePrompt": "Hook an unwanted and harmful computer code designed to damage or infect devices",
            "clueCategory": "Technology",
            "targetWord": "Virus",
            "distractorWords": [
                  "Bug",
                  "Firewall",
                  "Cookie"
            ],
            "explanation": "Computer viruses replicate maliciously to corrupt or steal data."
      },
      {
            "id": "wf_g7_h_20",
            "cluePrompt": "Hook software used to browse and view webpages on the World Wide Web",
            "clueCategory": "Technology",
            "targetWord": "Browser",
            "distractorWords": [
                  "Search engine",
                  "Operating system",
                  "Database"
            ],
            "explanation": "Web browsers like Chrome and Firefox render HTML webpages."
      },
      {
            "id": "wf_g7_h_21",
            "cluePrompt": "Hook a tall ancient structure with a square base and four triangular sloping sides",
            "clueCategory": "Architecture",
            "targetWord": "Pyramid",
            "distractorWords": [
                  "Temple",
                  "Palace",
                  "Dome"
            ],
            "explanation": "Ancient Egyptians erected stone pyramids as royal tombs."
      },
      {
            "id": "wf_g7_h_22",
            "cluePrompt": "Hook a large fortified medieval stone fortress built by royalty and lords",
            "clueCategory": "Architecture",
            "targetWord": "Castle",
            "distractorWords": [
                  "Mansion",
                  "Cottage",
                  "Bungalow"
            ],
            "explanation": "Castles featured moats, battlements, and thick stone defensive walls."
      },
      {
            "id": "wf_g7_h_23",
            "cluePrompt": "Hook an artistic stone, bronze, or marble figure sculpted to represent a person",
            "clueCategory": "Art",
            "targetWord": "Statue",
            "distractorWords": [
                  "Mural",
                  "Portrait",
                  "Mosaic"
            ],
            "explanation": "Statues are three-dimensional carvings honouring figures."
      },
      {
            "id": "wf_g7_h_24",
            "cluePrompt": "Hook a traditional story passed down through generations explaining myths",
            "clueCategory": "Literature",
            "targetWord": "Legend",
            "distractorWords": [
                  "Novel",
                  "Biography",
                  "Poem"
            ],
            "explanation": "Legends blend historical memory with folklore and heroic deeds."
      },
      {
            "id": "wf_g7_h_25",
            "cluePrompt": "Hook a musical performance presented live on stage by a band or orchestra",
            "clueCategory": "Music",
            "targetWord": "Concert",
            "distractorWords": [
                  "Exhibition",
                  "Play",
                  "Festival"
            ],
            "explanation": "A concert is a live musical show attended by music fans."
      },
      {
            "id": "wf_g7_h_26",
            "cluePrompt": "Hook a theatrical play where actors perform a dramatic script before an audience",
            "clueCategory": "Theatre",
            "targetWord": "Drama",
            "distractorWords": [
                  "Opera",
                  "Ballet",
                  "Circus"
            ],
            "explanation": "Dramatic plays portray narratives through dialogue and acting."
      },
      {
            "id": "wf_g7_h_27",
            "cluePrompt": "Hook a large outdoor public fair with carnival rides, food stalls, and music",
            "clueCategory": "Culture",
            "targetWord": "Festival",
            "distractorWords": [
                  "Carnival",
                  "Banquet",
                  "Ceremony"
            ],
            "explanation": "Festivals celebrate cultural holidays or seasonal harvests."
      },
      {
            "id": "wf_g7_h_28",
            "cluePrompt": "Hook a short printed publication with news, articles, and photographs",
            "clueCategory": "Media",
            "targetWord": "Magazine",
            "distractorWords": [
                  "Journal",
                  "Brochure",
                  "Flyer"
            ],
            "explanation": "Magazines are published weekly or monthly covering hobbies and news."
      },
      {
            "id": "wf_g7_h_29",
            "cluePrompt": "Hook an official conversation where a journalist asks a celebrity questions",
            "clueCategory": "Media",
            "targetWord": "Interview",
            "distractorWords": [
                  "Debate",
                  "Lecture",
                  "Speech"
            ],
            "explanation": "Interviews gather quotes and insights directly from prominent figures."
      },
      {
            "id": "wf_g7_h_30",
            "cluePrompt": "Hook the written story of a real person's entire life composed by another writer",
            "clueCategory": "Literature",
            "targetWord": "Biography",
            "distractorWords": [
                  "Autobiography",
                  "Memoir",
                  "Anthology"
            ],
            "explanation": "A biography chronicles a notable subject's lifetime accomplishments."
      },
      {
            "id": "wf_g7_h_31",
            "cluePrompt": "Hook the ability to understand and respect beliefs that differ from one's own",
            "clueCategory": "Values",
            "targetWord": "Tolerance",
            "distractorWords": [
                  "Prejudice",
                  "Ignorance",
                  "Hostility"
            ],
            "explanation": "Tolerance is accepting different lifestyles and cultural customs."
      },
      {
            "id": "wf_g7_h_32",
            "cluePrompt": "Hook the mental courage to face danger, pain, or difficulty without backing down",
            "clueCategory": "Values",
            "targetWord": "Bravery",
            "distractorWords": [
                  "Cowardice",
                  "Hesitation",
                  "Weakness"
            ],
            "explanation": "Bravery allows heroes to stand resolute against frightening hazards."
      },
      {
            "id": "wf_g7_h_33",
            "cluePrompt": "Hook the feeling of deep gratitude and appreciation toward someone who assisted you",
            "clueCategory": "Values",
            "targetWord": "Thankfulness",
            "distractorWords": [
                  "Resentment",
                  "Bitterness",
                  "Pride"
            ],
            "explanation": "Expressing thankfulness acknowledges kindness and support received."
      },
      {
            "id": "wf_g7_h_34",
            "cluePrompt": "Hook doing something without any hesitation or fear",
            "clueCategory": "Values",
            "targetWord": "Confident",
            "distractorWords": [
                  "Hesitant",
                  "Doubtful",
                  "Insecure"
            ],
            "explanation": "Confidence reflects trust in one's skills and preparedness."
      },
      {
            "id": "wf_g7_h_35",
            "cluePrompt": "Hook acting in a sensible, careful, and mature manner",
            "clueCategory": "Values",
            "targetWord": "Responsible",
            "distractorWords": [
                  "Reckless",
                  "Careless",
                  "Immature"
            ],
            "explanation": "Responsible students take ownership of tasks and commitments."
      },
      {
            "id": "wf_g7_h_36",
            "cluePrompt": "Hook working smoothly with other classmates toward a shared victory",
            "clueCategory": "Values",
            "targetWord": "Cooperation",
            "distractorWords": [
                  "Competition",
                  "Conflict",
                  "Isolation"
            ],
            "explanation": "Cooperation combines group strengths to achieve shared goals."
      },
      {
            "id": "wf_g7_h_37",
            "cluePrompt": "Hook having high hopes and believing that good results will happen",
            "clueCategory": "Mindset",
            "targetWord": "Optimistic",
            "distractorWords": [
                  "Pessimistic",
                  "Cynical",
                  "Negative"
            ],
            "explanation": "Optimists expect favorable outcomes and look on the bright side."
      },
      {
            "id": "wf_g7_h_38",
            "cluePrompt": "Hook the quality of being polite, kind, and respectful in conversation",
            "clueCategory": "Social",
            "targetWord": "Courteous",
            "distractorWords": [
                  "Rude",
                  "Impatient",
                  "Cheeky"
            ],
            "explanation": "Courteous individuals show impeccable manners and consideration."
      },
      {
            "id": "wf_g7_h_39",
            "cluePrompt": "Hook finding an answer or resolution to a complex problem or puzzle",
            "clueCategory": "Skills",
            "targetWord": "Solution",
            "distractorWords": [
                  "Obstacle",
                  "Barrier",
                  "Dilemma"
            ],
            "explanation": "A solution successfully resolves a challenging question or difficulty."
      },
      {
            "id": "wf_g7_h_40",
            "cluePrompt": "Hook the achievement of a desired aim, objective, or prosperity",
            "clueCategory": "Success",
            "targetWord": "Success",
            "distractorWords": [
                  "Failure",
                  "Defeat",
                  "Loss"
            ],
            "explanation": "Success is the rewarding fruition of persistent effort and skill."
      }
],
  },
  'grade-8': {
    easy: [
      {
            "id": "wf_g8_e_01",
            "cluePrompt": "Hook the word for a close, dependable friend who always backs you up",
            "clueCategory": "Friendship",
            "targetWord": "Buddy",
            "distractorWords": [
                  "Enemy",
                  "Stranger",
                  "Rival"
            ],
            "explanation": "A buddy is an intimate, trustworthy pal."
      },
      {
            "id": "wf_g8_e_02",
            "cluePrompt": "Hook the quality of keeping personal confidences and never betraying friends",
            "clueCategory": "Friendship",
            "targetWord": "Loyalty",
            "distractorWords": [
                  "Treachery",
                  "Jealousy",
                  "Betrayal"
            ],
            "explanation": "Loyalty means staying faithful and supportive to your companions."
      },
      {
            "id": "wf_g8_e_03",
            "cluePrompt": "Hook the trait of someone who supports and encourages friends when they feel low",
            "clueCategory": "Friendship",
            "targetWord": "Supportive",
            "distractorWords": [
                  "Critical",
                  "Indifferent",
                  "Mocking"
            ],
            "explanation": "Supportive friends provide emotional comfort and encouragement."
      },
      {
            "id": "wf_g8_e_04",
            "cluePrompt": "Hook the feeling of firmly relying on the honesty and integrity of another person",
            "clueCategory": "Friendship",
            "targetWord": "Trust",
            "distractorWords": [
                  "Suspicion",
                  "Doubt",
                  "Fear"
            ],
            "explanation": "Trust is the cornerstone of healthy, enduring relationships."
      },
      {
            "id": "wf_g8_e_05",
            "cluePrompt": "Hook the action of spending time casually socializing with friends",
            "clueCategory": "Teen Life",
            "targetWord": "Hang out",
            "distractorWords": [
                  "Drop out",
                  "Fall out",
                  "Turn out"
            ],
            "explanation": "'Hang out' means relaxing and spending leisurely hours together."
      },
      {
            "id": "wf_g8_e_06",
            "cluePrompt": "Hook the phrase meaning to have a harmonious, friendly relationship with someone",
            "clueCategory": "Relationships",
            "targetWord": "Get along",
            "distractorWords": [
                  "Break up",
                  "Look down",
                  "Give up"
            ],
            "explanation": "'Get along with' means enjoying peaceable mutual friendship."
      },
      {
            "id": "wf_g8_e_07",
            "cluePrompt": "Hook the verb meaning to have the same interests and hobbies as someone else",
            "clueCategory": "Friendship",
            "targetWord": "Have in common",
            "distractorWords": [
                  "Stand out",
                  "Take apart",
                  "Look after"
            ],
            "explanation": "Friends have interests in common when they enjoy similar things."
      },
      {
            "id": "wf_g8_e_08",
            "cluePrompt": "Hook someone who is always friendly, welcoming, and hospitable to guests",
            "clueCategory": "Traits",
            "targetWord": "Welcoming",
            "distractorWords": [
                  "Distant",
                  "Cold",
                  "Hostile"
            ],
            "explanation": "Welcoming hosts treat visitors with warmth and kindness."
      },
      {
            "id": "wf_g8_e_09",
            "cluePrompt": "Hook someone who always thinks only about their own personal benefit",
            "clueCategory": "Traits",
            "targetWord": "Selfish",
            "distractorWords": [
                  "Altruistic",
                  "Selfless",
                  "Empathetic"
            ],
            "explanation": "Selfish individuals ignore others' needs to prioritise themselves."
      },
      {
            "id": "wf_g8_e_10",
            "cluePrompt": "Hook the trait of someone who makes people laugh with witty humour",
            "clueCategory": "Traits",
            "targetWord": "Amusing",
            "distractorWords": [
                  "Boring",
                  "Gloomy",
                  "Severe"
            ],
            "explanation": "Amusing people tell hilarious jokes and entertain peers."
      },
      {
            "id": "wf_g8_e_11",
            "cluePrompt": "Hook the cooking technique of heating food in boiling water inside a saucepan",
            "clueCategory": "Cooking",
            "targetWord": "Boil",
            "distractorWords": [
                  "Roast",
                  "Grill",
                  "Fry"
            ],
            "explanation": "Boiling cooks ingredients submerged in bubbling water at 100°C."
      },
      {
            "id": "wf_g8_e_12",
            "cluePrompt": "Hook the technique of cooking dough or pastries inside a hot enclosed oven",
            "clueCategory": "Cooking",
            "targetWord": "Bake",
            "distractorWords": [
                  "Steam",
                  "Sauté",
                  "Microwave"
            ],
            "explanation": "Baking uses dry indirect heat to cook breads and cakes."
      },
      {
            "id": "wf_g8_e_13",
            "cluePrompt": "Hook the action of cutting vegetables into smaller irregular bite-sized pieces with a knife",
            "clueCategory": "Kitchen",
            "targetWord": "Chop",
            "distractorWords": [
                  "Peel",
                  "Spread",
                  "Squeeze"
            ],
            "explanation": "Chopping divides onions and herbs into small diced pieces."
      },
      {
            "id": "wf_g8_e_14",
            "cluePrompt": "Hook the culinary action of removing the outer skin from potatoes or apples",
            "clueCategory": "Kitchen",
            "targetWord": "Peel",
            "distractorWords": [
                  "Grate",
                  "Stir",
                  "Whisk"
            ],
            "explanation": "Peeling strips the inedible skin off fruits and tubers."
      },
      {
            "id": "wf_g8_e_15",
            "cluePrompt": "Hook the kitchen utensil with metal holes used to shred cheese and carrots into ribbons",
            "clueCategory": "Utensils",
            "targetWord": "Grater",
            "distractorWords": [
                  "Whisk",
                  "Colander",
                  "Ladle"
            ],
            "explanation": "A grater shreds firm cheeses and carrots through sharp slits."
      },
      {
            "id": "wf_g8_e_16",
            "cluePrompt": "Hook the perforated bowl used to drain water from boiled spaghetti",
            "clueCategory": "Utensils",
            "targetWord": "Colander",
            "distractorWords": [
                  "Saucepan",
                  "Skillet",
                  "Rolling pin"
            ],
            "explanation": "A colander allows boiling water to drain while retaining pasta."
      },
      {
            "id": "wf_g8_e_17",
            "cluePrompt": "Hook the step-by-step cooking instructions and list of ingredients for a meal",
            "clueCategory": "Cooking",
            "targetWord": "Recipe",
            "distractorWords": [
                  "Menu",
                  "Bill",
                  "Order"
            ],
            "explanation": "A recipe details the exact proportions and cooking sequence."
      },
      {
            "id": "wf_g8_e_18",
            "cluePrompt": "Hook any raw food item that is combined to prepare a culinary dish",
            "clueCategory": "Cooking",
            "targetWord": "Ingredient",
            "distractorWords": [
                  "Utensil",
                  "Nutrient",
                  "Seasoning"
            ],
            "explanation": "Flour, eggs, and sugar are key baking ingredients."
      },
      {
            "id": "wf_g8_e_19",
            "cluePrompt": "Hook the cooking method where food is cooked over direct flame on metal bars",
            "clueCategory": "Cooking",
            "targetWord": "Grill",
            "distractorWords": [
                  "Steam",
                  "Poach",
                  "Simmer"
            ],
            "explanation": "Grilling chars food over coals or gas burners with smoky flavor."
      },
      {
            "id": "wf_g8_e_20",
            "cluePrompt": "Hook the kitchen action of beating eggs vigorously with a wire tool",
            "clueCategory": "Cooking",
            "targetWord": "Whisk",
            "distractorWords": [
                  "Slice",
                  "Dice",
                  "Knead"
            ],
            "explanation": "Whisking whips air into eggs and cream until fluffy."
      },
      {
            "id": "wf_g8_e_21",
            "cluePrompt": "Hook a phone call conducted where both callers see each other's live camera video",
            "clueCategory": "Communication",
            "targetWord": "Video call",
            "distractorWords": [
                  "Voicemail",
                  "Text message",
                  "Morse code"
            ],
            "explanation": "Video calls stream synchronized audio and live camera feeds."
      },
      {
            "id": "wf_g8_e_22",
            "cluePrompt": "Hook the act of dialling a number and talking to someone over mobile networks",
            "clueCategory": "Communication",
            "targetWord": "Phone conversation",
            "distractorWords": [
                  "Handwritten letter",
                  "Telegram",
                  "Smoke signal"
            ],
            "explanation": "Phone conversations permit direct two-way spoken communication."
      },
      {
            "id": "wf_g8_e_23",
            "cluePrompt": "Hook the audio recording left when a called recipient does not answer the line",
            "clueCategory": "Communication",
            "targetWord": "Voicemail",
            "distractorWords": [
                  "Ringtone",
                  "Notification",
                  "Broadcast"
            ],
            "explanation": "Voicemail records voice notes for unanswered phone lines."
      },
      {
            "id": "wf_g8_e_24",
            "cluePrompt": "Hook a person who follows and watches updates on a social media channel regularly",
            "clueCategory": "Social Media",
            "targetWord": "Subscriber",
            "distractorWords": [
                  "Troll",
                  "Spammer",
                  "Hacker"
            ],
            "explanation": "Subscribers sign up to receive alerts from preferred channels."
      },
      {
            "id": "wf_g8_e_25",
            "cluePrompt": "Hook a digital alert popping up on your smartphone screen to announce new messages",
            "clueCategory": "Technology",
            "targetWord": "Notification",
            "distractorWords": [
                  "Malware",
                  "Cookie",
                  "Pop-up ad"
            ],
            "explanation": "Notifications inform users about fresh emails and social alerts."
      },
      {
            "id": "wf_g8_e_26",
            "cluePrompt": "Hook a small graphical icon used in digital messaging to express emotions",
            "clueCategory": "Digital",
            "targetWord": "Emoji",
            "distractorWords": [
                  "Font",
                  "Pixel",
                  "Avatar"
            ],
            "explanation": "Emojis visually convey smiles, laughter, hearts, and gestures."
      },
      {
            "id": "wf_g8_e_27",
            "cluePrompt": "Hook the act of sending short typed SMS messages between phone handsets",
            "clueCategory": "Communication",
            "targetWord": "Texting",
            "distractorWords": [
                  "Printing",
                  "Faxing",
                  "Scanning"
            ],
            "explanation": "Texting exchanges rapid short text messages on mobile phones."
      },
      {
            "id": "wf_g8_e_28",
            "cluePrompt": "Hook the sound made by a telephone handset when receiving an incoming call",
            "clueCategory": "Digital",
            "targetWord": "Ringtone",
            "distractorWords": [
                  "Dial tone",
                  "Static",
                  "Feedback"
            ],
            "explanation": "Ringtones alert users that an incoming call is arriving."
      },
      {
            "id": "wf_g8_e_29",
            "cluePrompt": "Hook speaking face to face without relying on digital screens or telephone lines",
            "clueCategory": "Communication",
            "targetWord": "In person",
            "distractorWords": [
                  "Virtually",
                  "Remotely",
                  "Digitally"
            ],
            "explanation": "Communicating in person involves real physical presence."
      },
      {
            "id": "wf_g8_e_30",
            "cluePrompt": "Hook keeping in touch with distant relatives or old classmates across years",
            "clueCategory": "Social",
            "targetWord": "Keep in touch",
            "distractorWords": [
                  "Lose track",
                  "Turn away",
                  "Shut down"
            ],
            "explanation": "'Keep in touch' signifies maintaining communication over time."
      },
      {
            "id": "wf_g8_e_31",
            "cluePrompt": "Hook the aerial extreme sport of jumping out of an aircraft with a parachute",
            "clueCategory": "Extreme Sports",
            "targetWord": "Skydiving",
            "distractorWords": [
                  "Paragliding",
                  "Windsurfing",
                  "Scuba diving"
            ],
            "explanation": "Skydiving involves freefalling before opening a parachute."
      },
      {
            "id": "wf_g8_e_32",
            "cluePrompt": "Hook the thrilling sport of leaping off a bridge attached to a thick elastic rope",
            "clueCategory": "Extreme Sports",
            "targetWord": "Bungee jumping",
            "distractorWords": [
                  "Parkour",
                  "Motocross",
                  "Base jumping"
            ],
            "explanation": "Bungee jumpers bounce on elastic cords suspended above canyons."
      },
      {
            "id": "wf_g8_e_33",
            "cluePrompt": "Hook underwater swimming equipped with oxygen tanks and breathing regulators",
            "clueCategory": "Sports",
            "targetWord": "Scuba diving",
            "distractorWords": [
                  "Snorkelling",
                  "Water polo",
                  "Synchronised swimming"
            ],
            "explanation": "Scuba divers explore marine depths carrying pressurized tanks."
      },
      {
            "id": "wf_g8_e_34",
            "cluePrompt": "Hook climbing steep natural rock faces using ropes and harnesses",
            "clueCategory": "Sports",
            "targetWord": "Rock climbing",
            "distractorWords": [
                  "Bouldering",
                  "Trekking",
                  "Mountaineering"
            ],
            "explanation": "Rock climbers ascend sheer granite walls using harnesses."
      },
      {
            "id": "wf_g8_e_35",
            "cluePrompt": "Hook gliding through the air strapped beneath a lightweight canopy wing",
            "clueCategory": "Extreme Sports",
            "targetWord": "Paragliding",
            "distractorWords": [
                  "Hang gliding",
                  "Skydiving",
                  "Kitesurfing"
            ],
            "explanation": "Paragliders soar on thermals launching from hilltops."
      },
      {
            "id": "wf_g8_e_36",
            "cluePrompt": "Hook the adrenaline rush felt when attempting challenging adventures",
            "clueCategory": "Adventure",
            "targetWord": "Thrill",
            "distractorWords": [
                  "Boredom",
                  "Fatigue",
                  "Sorrow"
            ],
            "explanation": "Thrills are bursts of exhilarating excitement and adventure."
      },
      {
            "id": "wf_g8_e_37",
            "cluePrompt": "Hook the protective hard gear worn on the head when riding or doing extreme sports",
            "clueCategory": "Safety",
            "targetWord": "Helmet",
            "distractorWords": [
                  "Goggles",
                  "Kneepads",
                  "Gloves"
            ],
            "explanation": "Helmets shield the skull from severe impacts and concussions."
      },
      {
            "id": "wf_g8_e_38",
            "cluePrompt": "Hook safety straps strapped around the waist and thighs when climbing",
            "clueCategory": "Safety",
            "targetWord": "Harness",
            "distractorWords": [
                  "Carabiner",
                  "Anchor",
                  "Lanyard"
            ],
            "explanation": "A climbing harness secures climbers to safety ropes."
      },
      {
            "id": "wf_g8_e_39",
            "cluePrompt": "Hook protective eyewear worn to shield eyes from water or rushing wind",
            "clueCategory": "Safety",
            "targetWord": "Goggles",
            "distractorWords": [
                  "Sunglasses",
                  "Spectacles",
                  "Visor"
            ],
            "explanation": "Goggles seal tightly to protect the eyes during skiing or swimming."
      },
      {
            "id": "wf_g8_e_40",
            "cluePrompt": "Hook a brave person who loves seeking dangerous excitement and thrills",
            "clueCategory": "Personality",
            "targetWord": "Adrenalin seeker",
            "distractorWords": [
                  "Homebody",
                  "Observer",
                  "Coward"
            ],
            "explanation": "Adrenaline junkies actively chase exhilarating physical challenges."
      }
],
    medium: [
      {
            "id": "wf_g8_m_01",
            "cluePrompt": "Hook a holiday resort package where all meals, drinks, and activities are prepaid",
            "clueCategory": "Tourism",
            "targetWord": "All-inclusive",
            "distractorWords": [
                  "Self-catering",
                  "Bed and breakfast",
                  "Room only"
            ],
            "explanation": "All-inclusive packages cover lodging, dining, and recreation."
      },
      {
            "id": "wf_g8_m_02",
            "cluePrompt": "Hook historic structures and remains dating from civilisations thousands of years old",
            "clueCategory": "Heritage",
            "targetWord": "Ancient ruins",
            "distractorWords": [
                  "Modern towers",
                  "Skyscrapers",
                  "Highways"
            ],
            "explanation": "Ancient ruins like Ephesus showcase classical Greco-Roman architecture."
      },
      {
            "id": "wf_g8_m_03",
            "cluePrompt": "Hook a place to stay while on holiday, such as a hotel, hostel, or rental villa",
            "clueCategory": "Tourism",
            "targetWord": "Accommodation",
            "distractorWords": [
                  "Transportation",
                  "Entertainment",
                  "Itinerary"
            ],
            "explanation": "Accommodation denotes lodging arrangements made by travellers."
      },
      {
            "id": "wf_g8_m_04",
            "cluePrompt": "Hook the planned route, schedule, and list of stops for a travel trip",
            "clueCategory": "Travel",
            "targetWord": "Itinerary",
            "distractorWords": [
                  "Brochure",
                  "Boarding pass",
                  "Voucher"
            ],
            "explanation": "An itinerary itemizes daily excursion timetables and destinations."
      },
      {
            "id": "wf_g8_m_05",
            "cluePrompt": "Hook a prominent geographical feature or monument easily recognized by travellers",
            "clueCategory": "Tourism",
            "targetWord": "Landmark",
            "distractorWords": [
                  "Boundary",
                  "Checkpoint",
                  "Crossroad"
            ],
            "explanation": "Landmarks like Galata Tower serve as unmistakable city focal points."
      },
      {
            "id": "wf_g8_m_06",
            "cluePrompt": "Hook the ultimate place or town to which a traveller is heading",
            "clueCategory": "Tourism",
            "targetWord": "Destination",
            "distractorWords": [
                  "Departure",
                  "Transit",
                  "Stopover"
            ],
            "explanation": "Destination is the goal journey endpoint of an expedition."
      },
      {
            "id": "wf_g8_m_07",
            "cluePrompt": "Hook traditional dishes and culinary styles unique to a particular nation or region",
            "clueCategory": "Cuisine",
            "targetWord": "Local cuisine",
            "distractorWords": [
                  "Fast food",
                  "Junk food",
                  "Snack"
            ],
            "explanation": "Local cuisine presents indigenous recipes and culinary traditions."
      },
      {
            "id": "wf_g8_m_08",
            "cluePrompt": "Hook travelling around a city visiting famous historic sights and monuments",
            "clueCategory": "Tourism",
            "targetWord": "Sightseeing",
            "distractorWords": [
                  "Shopping",
                  "Sunbathing",
                  "Commuting"
            ],
            "explanation": "Sightseeing visits iconic cultural and architectural attractions."
      },
      {
            "id": "wf_g8_m_09",
            "cluePrompt": "Hook breathtakingly scenic views of countryside, hills, or coastlines",
            "clueCategory": "Nature",
            "targetWord": "Landscape",
            "distractorWords": [
                  "Backyard",
                  "Basement",
                  "Alley"
            ],
            "explanation": "A landscape encompasses sweeping panoramic rural panoramas."
      },
      {
            "id": "wf_g8_m_10",
            "cluePrompt": "Hook an official specialist who leads tourists and explains history at cultural sites",
            "clueCategory": "Tourism",
            "targetWord": "Tour guide",
            "distractorWords": [
                  "Hotel concierge",
                  "Ticket agent",
                  "Chauffeur"
            ],
            "explanation": "Tour guides offer interpretive commentary on heritage sites."
      },
      {
            "id": "wf_g8_m_11",
            "cluePrompt": "Hook the chore of cleaning carpets and floors using an electrical suction device",
            "clueCategory": "Chores",
            "targetWord": "Vacuum the floor",
            "distractorWords": [
                  "Mop the deck",
                  "Sweep the porch",
                  "Dust the shelf"
            ],
            "explanation": "Vacuuming lifts dust particles from carpets via motorized suction."
      },
      {
            "id": "wf_g8_m_12",
            "cluePrompt": "Hook the household task of smoothing wrinkled laundered clothes with a hot iron",
            "clueCategory": "Chores",
            "targetWord": "Do the ironing",
            "distractorWords": [
                  "Fold the sheets",
                  "Wash the laundry",
                  "Sort the towels"
            ],
            "explanation": "Ironing presses out textile wrinkles using heat and steam."
      },
      {
            "id": "wf_g8_m_13",
            "cluePrompt": "Hook placing plates, glasses, and cutlery on the dining table before dinner",
            "clueCategory": "Chores",
            "targetWord": "Set the table",
            "distractorWords": [
                  "Clear the table",
                  "Wash the dishes",
                  "Pack the lunch"
            ],
            "explanation": "'Set the table' arranges plates, napkins, and utensils for dining."
      },
      {
            "id": "wf_g8_m_14",
            "cluePrompt": "Hook placing dirty dinner plates into the washing machine and adding detergent",
            "clueCategory": "Chores",
            "targetWord": "Load the dishwasher",
            "distractorWords": [
                  "Empty the trash",
                  "Scrub the sink",
                  "Rinse the glasses"
            ],
            "explanation": "Loading the dishwasher packs soiled dishware into spray racks."
      },
      {
            "id": "wf_g8_m_15",
            "cluePrompt": "Hook carrying household waste bags outside to the public rubbish container",
            "clueCategory": "Chores",
            "targetWord": "Take out the trash",
            "distractorWords": [
                  "Mow the lawn",
                  "Water the plants",
                  "Walk the dog"
            ],
            "explanation": "Taking out the trash disposes of refuse bags into exterior bins."
      },
      {
            "id": "wf_g8_m_16",
            "cluePrompt": "Hook pulling weeds, cutting grass, and planting flowers in the house garden",
            "clueCategory": "Chores",
            "targetWord": "Do the gardening",
            "distractorWords": [
                  "Clean the garage",
                  "Wash the windows",
                  "Paint the fence"
            ],
            "explanation": "Gardening involves caring for soil, shrubs, lawns, and flowerbeds."
      },
      {
            "id": "wf_g8_m_17",
            "cluePrompt": "Hook wiping away fine gray particles from bookshelves and wooden furniture",
            "clueCategory": "Chores",
            "targetWord": "Dust the furniture",
            "distractorWords": [
                  "Wax the floor",
                  "Bleach the tiles",
                  "Polish the silver"
            ],
            "explanation": "Dusting removes settled airborne particles from surfaces."
      },
      {
            "id": "wf_g8_m_18",
            "cluePrompt": "Hook washing dirty shirts, trousers, and socks in the laundry appliance",
            "clueCategory": "Chores",
            "targetWord": "Do the laundry",
            "distractorWords": [
                  "Hang the curtains",
                  "Sew the buttons",
                  "Starch the collars"
            ],
            "explanation": "Doing the laundry washes and spins garments clean."
      },
      {
            "id": "wf_g8_m_19",
            "cluePrompt": "Hook a duty, obligation, or chore that you are expected to handle reliably",
            "clueCategory": "Values",
            "targetWord": "Responsibility",
            "distractorWords": [
                  "Privilege",
                  "Distraction",
                  "Reward"
            ],
            "explanation": "Responsibilities are tasks one is accountable to complete."
      },
      {
            "id": "wf_g8_m_20",
            "cluePrompt": "Hook tidy, organized, and free from clutter or mess in a bedroom",
            "clueCategory": "Traits",
            "targetWord": "Neat and tidy",
            "distractorWords": [
                  "Chaotic",
                  "Disorderly",
                  "Messy"
            ],
            "explanation": "A neat and tidy room has everything stored in its proper place."
      },
      {
            "id": "wf_g8_m_21",
            "cluePrompt": "Hook the process of finding or uncovering something that existed but was unknown",
            "clueCategory": "Science",
            "targetWord": "Discovery",
            "distractorWords": [
                  "Invention",
                  "Fabrication",
                  "Copy"
            ],
            "explanation": "Discoveries uncover existing natural truths, like penicillin or gravity."
      },
      {
            "id": "wf_g8_m_22",
            "cluePrompt": "Hook creating a brand new mechanical device or process that never existed before",
            "clueCategory": "Science",
            "targetWord": "Invention",
            "distractorWords": [
                  "Discovery",
                  "Imitation",
                  "Duplication"
            ],
            "explanation": "Inventions engineer novel instruments, like the lightbulb or telephone."
      },
      {
            "id": "wf_g8_m_23",
            "cluePrompt": "Hook a room equipped with scientific glassware and apparatus for testing hypotheses",
            "clueCategory": "Science",
            "targetWord": "Laboratory",
            "distractorWords": [
                  "Auditorium",
                  "Greenhouse",
                  "Observatory"
            ],
            "explanation": "Laboratories offer sterile testing benches for experiments."
      },
      {
            "id": "wf_g8_m_24",
            "cluePrompt": "Hook a medicine, medical treatment, or therapy that restores health after illness",
            "clueCategory": "Medicine",
            "targetWord": "Cure",
            "distractorWords": [
                  "Symptom",
                  "Diagnosis",
                  "Outbreak"
            ],
            "explanation": "A cure permanently eradicates a disease from a patient."
      },
      {
            "id": "wf_g8_m_25",
            "cluePrompt": "Hook a proposed scientific explanation that can be tested through experimentation",
            "clueCategory": "Science",
            "targetWord": "Hypothesis",
            "distractorWords": [
                  "Conspiracy",
                  "Myth",
                  "Rumour"
            ],
            "explanation": "A hypothesis offers a reasoned testable guess for observed phenomena."
      },
      {
            "id": "wf_g8_m_26",
            "cluePrompt": "Hook the invisible force that pulls physical objects down toward Earth's centre",
            "clueCategory": "Physics",
            "targetWord": "Gravity",
            "distractorWords": [
                  "Friction",
                  "Magnetism",
                  "Pressure"
            ],
            "explanation": "Gravity pulls masses downward with an acceleration of 9.8 m/s²."
      },
      {
            "id": "wf_g8_m_27",
            "cluePrompt": "Hook an astronomical vehicle built to fly and carry astronauts into outer space",
            "clueCategory": "Space",
            "targetWord": "Spacecraft",
            "distractorWords": [
                  "Submarine",
                  "Helicopter",
                  "Hovercraft"
            ],
            "explanation": "Spacecraft rocket past Earth's atmosphere into planetary orbit."
      },
      {
            "id": "wf_g8_m_28",
            "cluePrompt": "Hook a medicine prepared with weakened antigens that grants immunity against viruses",
            "clueCategory": "Medicine",
            "targetWord": "Vaccine",
            "distractorWords": [
                  "Antibiotic",
                  "Painkiller",
                  "Vitamin"
            ],
            "explanation": "Vaccines stimulate antibody production to defend against pathogens."
      },
      {
            "id": "wf_g8_m_29",
            "cluePrompt": "Hook an expert who conducts systematic research to expand scientific knowledge",
            "clueCategory": "Occupations",
            "targetWord": "Scientist",
            "distractorWords": [
                  "Novelist",
                  "Politician",
                  "Artist"
            ],
            "explanation": "Scientists employ the scientific method to investigate natural phenomena."
      },
      {
            "id": "wf_g8_m_30",
            "cluePrompt": "Hook artificial human-made machines launched to orbit Earth and relay communications",
            "clueCategory": "Space",
            "targetWord": "Satellite",
            "distractorWords": [
                  "Asteroid",
                  "Meteor",
                  "Comet"
            ],
            "explanation": "Satellites orbit Earth relaying GPS signals and weather radar."
      },
      {
            "id": "wf_g8_m_31",
            "cluePrompt": "Hook a sudden violent shaking of the ground caused by movements in Earth's tectonic plates",
            "clueCategory": "Disasters",
            "targetWord": "Earthquake",
            "distractorWords": [
                  "Avalanche",
                  "Drought",
                  "Hurricane"
            ],
            "explanation": "Earthquakes release seismic energy along geological fault lines."
      },
      {
            "id": "wf_g8_m_32",
            "cluePrompt": "Hook an overflow of huge amounts of water submerging normally dry urban or rural land",
            "clueCategory": "Disasters",
            "targetWord": "Flood",
            "distractorWords": [
                  "Tsunami",
                  "Tornado",
                  "Wildfire"
            ],
            "explanation": "Floods occur when torrential downpours breach river banks."
      },
      {
            "id": "wf_g8_m_33",
            "cluePrompt": "Hook a prolonged period of abnormally low rainfall leading to severe water shortages",
            "clueCategory": "Disasters",
            "targetWord": "Drought",
            "distractorWords": [
                  "Blizzard",
                  "Monsoon",
                  "Cyclone"
            ],
            "explanation": "Droughts dry out water reservoirs and devastate agricultural crops."
      },
      {
            "id": "wf_g8_m_34",
            "cluePrompt": "Hook a mass of snow, ice, and rocks tumbling swiftly down a steep mountainside",
            "clueCategory": "Disasters",
            "targetWord": "Avalanche",
            "distractorWords": [
                  "Mudslide",
                  "Sinkhole",
                  "Quarry"
            ],
            "explanation": "Avalanches roar down alpine slopes with crushing momentum."
      },
      {
            "id": "wf_g8_m_35",
            "cluePrompt": "Hook a violently rotating column of air extending from a thunderstorm to the ground",
            "clueCategory": "Disasters",
            "targetWord": "Tornado",
            "distractorWords": [
                  "Typhoon",
                  "Squall",
                  "Dust storm"
            ],
            "explanation": "Tornadoes exhibit destructive funnel winds exceeding 300 km/h."
      },
      {
            "id": "wf_g8_m_36",
            "cluePrompt": "Hook a gigantic ocean sea wave generated by undersea seismic earthquakes",
            "clueCategory": "Disasters",
            "targetWord": "Tsunami",
            "distractorWords": [
                  "Riptide",
                  "High tide",
                  "Undertow"
            ],
            "explanation": "Tsunamis surge ashore in devastating walls of seawater."
      },
      {
            "id": "wf_g8_m_37",
            "cluePrompt": "Hook an uncontrollable forest fire sweeping rapidly through dry brush and woodland",
            "clueCategory": "Disasters",
            "targetWord": "Wildfire",
            "distractorWords": [
                  "Campfire",
                  "Bonfire",
                  "Flare"
            ],
            "explanation": "Wildfires consume acres of timber driven by fierce dry winds."
      },
      {
            "id": "wf_g8_m_38",
            "cluePrompt": "Hook a protective safe building designed to shield people from catastrophe or storms",
            "clueCategory": "Safety",
            "targetWord": "Shelter",
            "distractorWords": [
                  "Warehouse",
                  "Basement",
                  "Shed"
            ],
            "explanation": "Shelters provide survival refuge and provisions during crises."
      },
      {
            "id": "wf_g8_m_39",
            "cluePrompt": "Hook an assembled pack with bandages, antiseptics, and painkillers for urgent injuries",
            "clueCategory": "Safety",
            "targetWord": "First-aid kit",
            "distractorWords": [
                  "Toolbox",
                  "Survival vest",
                  "Ration box"
            ],
            "explanation": "First-aid kits contain sterile dressings for immediate injury care."
      },
      {
            "id": "wf_g8_m_40",
            "cluePrompt": "Hook the emergency order to remove people immediately from a zone of imminent danger",
            "clueCategory": "Safety",
            "targetWord": "Evacuation",
            "distractorWords": [
                  "Relocation",
                  "Migration",
                  "Quarantine"
            ],
            "explanation": "Evacuations clear civilian populations away from disaster zones."
      }
],
    hard: [
      {
            "id": "wf_g8_h_01",
            "cluePrompt": "Hook the direct outcome or effect produced by a specific prior action or decision",
            "clueCategory": "Academic",
            "targetWord": "Consequence",
            "distractorWords": [
                  "Pretext",
                  "Coincidence",
                  "Assumption"
            ],
            "explanation": "A consequence is a logical or practical result following an act."
      },
      {
            "id": "wf_g8_h_02",
            "cluePrompt": "Hook facts, documents, and physical traces that prove whether a claim is true",
            "clueCategory": "Academic",
            "targetWord": "Evidence",
            "distractorWords": [
                  "Hypothesis",
                  "Conjecture",
                  "Speculation"
            ],
            "explanation": "Evidence substantiates factual conclusions in research and law."
      },
      {
            "id": "wf_g8_h_03",
            "cluePrompt": "Hook an important meaning, noteworthy impact, or high consequence of an event",
            "clueCategory": "Academic",
            "targetWord": "Significance",
            "distractorWords": [
                  "Triviality",
                  "Irrelevance",
                  "Mediocrity"
            ],
            "explanation": "Significance denotes historical or scientific importance."
      },
      {
            "id": "wf_g8_h_04",
            "cluePrompt": "Hook the state of extreme poverty where people lack basic necessities like food and water",
            "clueCategory": "Global Issues",
            "targetWord": "Poverty",
            "distractorWords": [
                  "Prosperity",
                  "Abundance",
                  "Affluence"
            ],
            "explanation": "Poverty is severe deprivation of fundamental human living standards."
      },
      {
            "id": "wf_g8_h_05",
            "cluePrompt": "Hook mutual support, unity, and shared responsibility among members of a community",
            "clueCategory": "Values",
            "targetWord": "Solidarity",
            "distractorWords": [
                  "Discord",
                  "Division",
                  "Alienation"
            ],
            "explanation": "Solidarity unites communities in harmonious mutual aid."
      },
      {
            "id": "wf_g8_h_06",
            "cluePrompt": "Hook the capability of an energy resource to be replenished naturally without depleting",
            "clueCategory": "Environment",
            "targetWord": "Renewable",
            "distractorWords": [
                  "Exhaustible",
                  "Finite",
                  "Consumable"
            ],
            "explanation": "Renewable energy from wind and sun renews indefinitely."
      },
      {
            "id": "wf_g8_h_07",
            "cluePrompt": "Hook an extreme and widespread scarcity of food causing starvation across a region",
            "clueCategory": "Global Issues",
            "targetWord": "Famine",
            "distractorWords": [
                  "Drought",
                  "Plague",
                  "Epidemic"
            ],
            "explanation": "Famine occurs when crop collapse causes severe mass malnutrition."
      },
      {
            "id": "wf_g8_h_08",
            "cluePrompt": "Hook preserving natural landscapes and cultural heritage from destruction or neglect",
            "clueCategory": "Conservation",
            "targetWord": "Preservation",
            "distractorWords": [
                  "Exploitation",
                  "Degradation",
                  "Destruction"
            ],
            "explanation": "Preservation safeguards historical relics and wildlife sanctuaries."
      },
      {
            "id": "wf_g8_h_09",
            "cluePrompt": "Hook the wide variety of plant and animal species living within a particular ecosystem",
            "clueCategory": "Ecology",
            "targetWord": "Biodiversity",
            "distractorWords": [
                  "Monoculture",
                  "Biomass",
                  "Equilibrium"
            ],
            "explanation": "Biodiversity measures the genetic richness of living systems."
      },
      {
            "id": "wf_g8_h_10",
            "cluePrompt": "Hook the deliberate avoidance of wasteful consumption to protect natural resources",
            "clueCategory": "Environment",
            "targetWord": "Sustainability",
            "distractorWords": [
                  "Overconsumption",
                  "Depletion",
                  "Extravagance"
            ],
            "explanation": "Sustainability meets present needs without compromising the future."
      },
      {
            "id": "wf_g8_h_11",
            "cluePrompt": "Hook the mental power to bounce back and recover swiftly from adversity or misfortune",
            "clueCategory": "Mindset",
            "targetWord": "Resilience",
            "distractorWords": [
                  "Fragility",
                  "Vulnerability",
                  "Surrender"
            ],
            "explanation": "Resilient people recover strength after suffering setbacks."
      },
      {
            "id": "wf_g8_h_12",
            "cluePrompt": "Hook the deep capacity to comprehend and share the feelings of another suffering person",
            "clueCategory": "Empathy",
            "targetWord": "Compassion",
            "distractorWords": [
                  "Apathy",
                  "Cruelty",
                  "Indifference"
            ],
            "explanation": "Compassion is sympathetic concern motivating acts to relieve misery."
      },
      {
            "id": "wf_g8_h_13",
            "cluePrompt": "Hook strict adherence to strong ethical and moral codes of honesty at all times",
            "clueCategory": "Values",
            "targetWord": "Integrity",
            "distractorWords": [
                  "Deceit",
                  "Pretence",
                  "Corruption"
            ],
            "explanation": "Integrity is unwavering honesty even when unobserved."
      },
      {
            "id": "wf_g8_h_14",
            "cluePrompt": "Hook working stubbornly toward long-term goals despite hardship and slow progress",
            "clueCategory": "Mindset",
            "targetWord": "Perseverance",
            "distractorWords": [
                  "Lethargy",
                  "Apathy",
                  "Resignation"
            ],
            "explanation": "Perseverance is dogged steadfastness against discouragement."
      },
      {
            "id": "wf_g8_h_15",
            "cluePrompt": "Hook willingness to consider and evaluate ideas that conflict with your own bias",
            "clueCategory": "Mindset",
            "targetWord": "Open-minded",
            "distractorWords": [
                  "Bigoted",
                  "Intolerant",
                  "Narrow-minded"
            ],
            "explanation": "Open-minded thinkers welcome novel perspectives and evidence."
      },
      {
            "id": "wf_g8_h_16",
            "cluePrompt": "Hook excessive pride or arrogant self-admiration that alienates colleagues",
            "clueCategory": "Flaws",
            "targetWord": "Vanity",
            "distractorWords": [
                  "Modesty",
                  "Humility",
                  "Diffidence"
            ],
            "explanation": "Vanity is exaggerated obsession with personal appearance or glory."
      },
      {
            "id": "wf_g8_h_17",
            "cluePrompt": "Hook an intuitive flash of understanding that solves a puzzling conundrum",
            "clueCategory": "Intellect",
            "targetWord": "Insight",
            "distractorWords": [
                  "Blindness",
                  "Stupor",
                  "Illusion"
            ],
            "explanation": "Insight provides clear discernment into complex inner realities."
      },
      {
            "id": "wf_g8_h_18",
            "cluePrompt": "Hook being extremely attentive and careful to avoid any potential peril or blunder",
            "clueCategory": "Mindset",
            "targetWord": "Cautious",
            "distractorWords": [
                  "Reckless",
                  "Rash",
                  "Impulsive"
            ],
            "explanation": "Cautious decision-makers weigh risks before taking action."
      },
      {
            "id": "wf_g8_h_19",
            "cluePrompt": "Hook having genuine modest humility without boasting of one's talents",
            "clueCategory": "Values",
            "targetWord": "Modesty",
            "distractorWords": [
                  "Arrogance",
                  "Haughtiness",
                  "Conceit"
            ],
            "explanation": "Modest individuals refrain from boasting of personal triumphs."
      },
      {
            "id": "wf_g8_h_20",
            "cluePrompt": "Hook expressing oneself fluently, persuasively, and with articulate elegance",
            "clueCategory": "Communication",
            "targetWord": "Eloquent",
            "distractorWords": [
                  "Incoherent",
                  "Hesitant",
                  "Muddled"
            ],
            "explanation": "Eloquent speakers command persuasive and polished rhetoric."
      },
      {
            "id": "wf_g8_h_21",
            "cluePrompt": "Hook the fundamental legal rules and principles that establish how a nation is governed",
            "clueCategory": "Civics",
            "targetWord": "Constitution",
            "distractorWords": [
                  "Treaty",
                  "Charter",
                  "Manifesto"
            ],
            "explanation": "The constitution is the supreme law grounding democratic rights."
      },
      {
            "id": "wf_g8_h_22",
            "cluePrompt": "Hook fair treatment and impartiality under the law for all citizens without prejudice",
            "clueCategory": "Law",
            "targetWord": "Justice",
            "distractorWords": [
                  "Tyranny",
                  "Partiality",
                  "Iniquity"
            ],
            "explanation": "Justice administers equitable fairness and legal vindication."
      },
      {
            "id": "wf_g8_h_23",
            "cluePrompt": "Hook an official agreement reached between sovereign nations after international negotiations",
            "clueCategory": "Diplomacy",
            "targetWord": "Treaty",
            "distractorWords": [
                  "Pact",
                  "Accord",
                  "Sanction"
            ],
            "explanation": "Treaties codify formal peace or trade terms between states."
      },
      {
            "id": "wf_g8_h_24",
            "cluePrompt": "Hook a system of government where citizens elect their representatives through voting",
            "clueCategory": "Governance",
            "targetWord": "Democracy",
            "distractorWords": [
                  "Monarchy",
                  "Autocracy",
                  "Oligarchy"
            ],
            "explanation": "Democracies derive authority from the consent of voters."
      },
      {
            "id": "wf_g8_h_25",
            "cluePrompt": "Hook an unreasonable preconceived opinion formed about a group without factual basis",
            "clueCategory": "Society",
            "targetWord": "Prejudice",
            "distractorWords": [
                  "Fairness",
                  "Neutrality",
                  "Objectivity"
            ],
            "explanation": "Prejudice discriminates unjustifiably based on stereotype."
      },
      {
            "id": "wf_g8_h_26",
            "cluePrompt": "Hook the legal right or entitlement possessed by human beings simply by virtue of being human",
            "clueCategory": "Rights",
            "targetWord": "Human rights",
            "distractorWords": [
                  "Privilege",
                  "Exemption",
                  "Concession"
            ],
            "explanation": "Human rights guarantee inherent dignity and freedom to all."
      },
      {
            "id": "wf_g8_h_27",
            "cluePrompt": "Hook an official ban on commerce or trade imposed upon a country as a diplomatic penalty",
            "clueCategory": "Diplomacy",
            "targetWord": "Sanction",
            "distractorWords": [
                  "Tariff",
                  "Quota",
                  "Subsidy"
            ],
            "explanation": "Sanctions leverage trade embargoes to enforce international compliance."
      },
      {
            "id": "wf_g8_h_28",
            "cluePrompt": "Hook an organized peaceful gathering of citizens voicing grievance or demands in public",
            "clueCategory": "Civics",
            "targetWord": "Demonstration",
            "distractorWords": [
                  "Riot",
                  "Mutiny",
                  "Insurrection"
            ],
            "explanation": "Peaceful demonstrations express public political demands."
      },
      {
            "id": "wf_g8_h_29",
            "cluePrompt": "Hook an elected assembly responsible for debating and enacting national statutory legislation",
            "clueCategory": "Governance",
            "targetWord": "Parliament",
            "distractorWords": [
                  "Cabinet",
                  "Tribunal",
                  "Congress"
            ],
            "explanation": "Parliaments draft, debate, and pass statutory laws."
      },
      {
            "id": "wf_g8_h_30",
            "cluePrompt": "Hook the state of being completely independent and exempt from foreign rule or subjugation",
            "clueCategory": "Civics",
            "targetWord": "Sovereignty",
            "distractorWords": [
                  "Vassalage",
                  "Colonialism",
                  "Dependency"
            ],
            "explanation": "Sovereignty gives a country total self-governance over its territory."
      },
      {
            "id": "wf_g8_h_31",
            "cluePrompt": "Hook the study and engineering of automated computer systems and physical robots",
            "clueCategory": "Innovation",
            "targetWord": "Robotics",
            "distractorWords": [
                  "Cybernetics",
                  "Mechanics",
                  "Automation"
            ],
            "explanation": "Robotics designs mechanical robots to perform industrial tasks."
      },
      {
            "id": "wf_g8_h_32",
            "cluePrompt": "Hook computer software capable of performing tasks that traditionally require human intellect",
            "clueCategory": "Innovation",
            "targetWord": "Artificial intelligence",
            "distractorWords": [
                  "Virtual reality",
                  "Blockchain",
                  "Quantum computing"
            ],
            "explanation": "AI enables algorithmic problem-solving and pattern recognition."
      },
      {
            "id": "wf_g8_h_33",
            "cluePrompt": "Hook computer simulation generating realistic 3D environments viewed through specialized headsets",
            "clueCategory": "Innovation",
            "targetWord": "Virtual reality",
            "distractorWords": [
                  "Augmented reality",
                  "Holography",
                  "Projection"
            ],
            "explanation": "Virtual reality immerses users in simulated interactive realms."
      },
      {
            "id": "wf_g8_h_34",
            "cluePrompt": "Hook the alteration of the genetic structure of an organism to enhance specific traits",
            "clueCategory": "Biology",
            "targetWord": "Genetic engineering",
            "distractorWords": [
                  "Selective breeding",
                  "Cloning",
                  "Cross-pollination"
            ],
            "explanation": "Genetic modification edits DNA sequences directly in labs."
      },
      {
            "id": "wf_g8_h_35",
            "cluePrompt": "Hook an innovative, unprecedented idea or breakthrough that fundamentally alters progress",
            "clueCategory": "Innovation",
            "targetWord": "Breakthrough",
            "distractorWords": [
                  "Stalemate",
                  "Regression",
                  "Drawback"
            ],
            "explanation": "A breakthrough marks a giant innovative leap forward."
      },
      {
            "id": "wf_g8_h_36",
            "cluePrompt": "Hook an early functional model constructed to test the design and concept of a machine",
            "clueCategory": "Engineering",
            "targetWord": "Prototype",
            "distractorWords": [
                  "Blueprint",
                  "Replica",
                  "Specimen"
            ],
            "explanation": "Prototypes let engineers identify bugs before mass production."
      },
      {
            "id": "wf_g8_h_37",
            "cluePrompt": "Hook a step-by-step mathematical computational procedure for solving a defined problem",
            "clueCategory": "Computing",
            "targetWord": "Algorithm",
            "distractorWords": [
                  "Flowchart",
                  "Syntax",
                  "Compiler"
            ],
            "explanation": "Algorithms dictate computer processing calculations."
      },
      {
            "id": "wf_g8_h_38",
            "cluePrompt": "Hook the branch of physics and astronomy dealing with the origin and evolution of the universe",
            "clueCategory": "Science",
            "targetWord": "Cosmology",
            "distractorWords": [
                  "Astrology",
                  "Meteorology",
                  "Geology"
            ],
            "explanation": "Cosmology examines cosmic origins, dark matter, and the Big Bang."
      },
      {
            "id": "wf_g8_h_39",
            "cluePrompt": "Hook the process of converting private data into secure mathematical cipher codes",
            "clueCategory": "Cybersecurity",
            "targetWord": "Encryption",
            "distractorWords": [
                  "Decryption",
                  "Compression",
                  "Formatting"
            ],
            "explanation": "Encryption renders sensitive messages unreadable to eavesdroppers."
      },
      {
            "id": "wf_g8_h_40",
            "cluePrompt": "Hook the transmission of clean data and power without any physical conducting cords",
            "clueCategory": "Technology",
            "targetWord": "Wireless",
            "distractorWords": [
                  "Fibre-optic",
                  "Coaxial",
                  "Hardwired"
            ],
            "explanation": "Wireless systems communicate via electromagnetic waves without physical wires."
      }
],
  },
};
