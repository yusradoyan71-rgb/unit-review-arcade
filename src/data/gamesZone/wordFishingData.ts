/**
 * UNIT REVIEW ARCADE — WORD FISHING DATA BANK (PHASE 7A - AUDITED & SIMPLIFIED)
 * Version: 7.1.0
 * 
 * 240 validated unique questions across:
 * - Grade 7: Easy (40), Medium (40), Hard (40)
 * - Grade 8: Easy (40), Medium (40), Hard (40)
 * 
 * AUDIT COMPLETE:
 * All questions conform to middle school English (Grade 7 A1-A2; Grade 8 A2-B1 / LGS targets).
 * Obscure and college-level definitions replaced with natural, accessible clues.
 */

import type { WordFishingBank } from '../../types/gamesZone';

export const WORD_FISHING_BANK: WordFishingBank = {
  'grade-7': {
    easy: [
      {
            "id": "wf_g7_e_01",
            "cluePrompt": "Hook the pet that barks and wags its tail",
            "clueCategory": "Animals",
            "targetWord": "Dog",
            "distractorWords": [
                  "Cat",
                  "Rabbit",
                  "Horse"
            ],
            "explanation": "A dog is a friendly domestic pet known as man's best friend."
      },
      {
            "id": "wf_g7_e_02",
            "cluePrompt": "Hook the animal that gives us milk on the farm",
            "clueCategory": "Animals",
            "targetWord": "Cow",
            "distractorWords": [
                  "Lion",
                  "Monkey",
                  "Tiger"
            ],
            "explanation": "Cows are farm animals that provide fresh milk and dairy."
      },
      {
            "id": "wf_g7_e_03",
            "cluePrompt": "Hook the giant wild animal with big ears and a long trunk",
            "clueCategory": "Animals",
            "targetWord": "Elephant",
            "distractorWords": [
                  "Giraffe",
                  "Zebra",
                  "Bear"
            ],
            "explanation": "Elephants are the largest living land animals with long trunks."
      },
      {
            "id": "wf_g7_e_04",
            "cluePrompt": "Hook the sea animal that has eight long arms",
            "clueCategory": "Animals",
            "targetWord": "Octopus",
            "distractorWords": [
                  "Dolphin",
                  "Shark",
                  "Whale"
            ],
            "explanation": "An octopus is an ocean creature with eight arms."
      },
      {
            "id": "wf_g7_e_05",
            "cluePrompt": "Hook the tall yellow animal with a very long neck",
            "clueCategory": "Animals",
            "targetWord": "Giraffe",
            "distractorWords": [
                  "Hippo",
                  "Kangaroo",
                  "Camel"
            ],
            "explanation": "Giraffes are tall animals that eat leaves from tall trees."
      },
      {
            "id": "wf_g7_e_06",
            "cluePrompt": "Hook the small domestic pet that loves catching mice",
            "clueCategory": "Animals",
            "targetWord": "Cat",
            "distractorWords": [
                  "Duck",
                  "Goat",
                  "Sheep"
            ],
            "explanation": "Cats are popular domestic pets that purr and catch mice."
      },
      {
            "id": "wf_g7_e_07",
            "cluePrompt": "Hook the sweet yellow fruit that you peel before eating",
            "clueCategory": "Food",
            "targetWord": "Banana",
            "distractorWords": [
                  "Apple",
                  "Orange",
                  "Lemon"
            ],
            "explanation": "Bananas are soft, sweet yellow fruits."
      },
      {
            "id": "wf_g7_e_08",
            "cluePrompt": "Hook the round Italian food topped with cheese and tomato sauce",
            "clueCategory": "Food",
            "targetWord": "Pizza",
            "distractorWords": [
                  "Soup",
                  "Rice",
                  "Salad"
            ],
            "explanation": "Pizza is a delicious baked crust topped with melted cheese."
      },
      {
            "id": "wf_g7_e_09",
            "cluePrompt": "Hook the healthy white drink that gives you strong bones",
            "clueCategory": "Drinks",
            "targetWord": "Milk",
            "distractorWords": [
                  "Cola",
                  "Tea",
                  "Coffee"
            ],
            "explanation": "Milk is rich in calcium and helps build strong bones."
      },
      {
            "id": "wf_g7_e_10",
            "cluePrompt": "Hook the baked food made from flour used to make sandwiches",
            "clueCategory": "Food",
            "targetWord": "Bread",
            "distractorWords": [
                  "Butter",
                  "Yogurt",
                  "Cheese"
            ],
            "explanation": "Bread is a staple bakery food used for toast and sandwiches."
      },
      {
            "id": "wf_g7_e_11",
            "cluePrompt": "Hook the cold and sweet summer dessert that comes in a cone",
            "clueCategory": "Food",
            "targetWord": "Ice cream",
            "distractorWords": [
                  "Hot soup",
                  "Toast",
                  "Biscuit"
            ],
            "explanation": "Ice cream is a frozen sweet treat loved during warm weather."
      },
      {
            "id": "wf_g7_e_12",
            "cluePrompt": "Hook the red fruit that grows on trees and is crunchy to bite",
            "clueCategory": "Food",
            "targetWord": "Apple",
            "distractorWords": [
                  "Grape",
                  "Melon",
                  "Peach"
            ],
            "explanation": "Apples are crisp, round fruits that can be red, green, or yellow."
      },
      {
            "id": "wf_g7_e_13",
            "cluePrompt": "Hook the orange vegetable that rabbits love to munch",
            "clueCategory": "Food",
            "targetWord": "Carrot",
            "distractorWords": [
                  "Potato",
                  "Onion",
                  "Garlic"
            ],
            "explanation": "Carrots are crunchy, orange root vegetables."
      },
      {
            "id": "wf_g7_e_14",
            "cluePrompt": "Hook the round food laid by hens that people fry or boil for breakfast",
            "clueCategory": "Food",
            "targetWord": "Egg",
            "distractorWords": [
                  "Pancake",
                  "Mushroom",
                  "Olive"
            ],
            "explanation": "Eggs come from hens and are packed with protein."
      },
      {
            "id": "wf_g7_e_15",
            "cluePrompt": "Hook the school tool you use to write notes with pencil lead",
            "clueCategory": "School",
            "targetWord": "Pencil",
            "distractorWords": [
                  "Ruler",
                  "Scissors",
                  "Glue"
            ],
            "explanation": "A pencil uses graphite lead to write and draw on paper."
      },
      {
            "id": "wf_g7_e_16",
            "cluePrompt": "Hook the rubber item you use to erase pencil mistakes",
            "clueCategory": "School",
            "targetWord": "Eraser",
            "distractorWords": [
                  "Sharpener",
                  "Stapler",
                  "Folder"
            ],
            "explanation": "An eraser rubs away pencil markings cleanly from paper."
      },
      {
            "id": "wf_g7_e_17",
            "cluePrompt": "Hook the bag you pack with books to carry to school",
            "clueCategory": "School",
            "targetWord": "Backpack",
            "distractorWords": [
                  "Suitcase",
                  "Wallet",
                  "Handbag"
            ],
            "explanation": "A backpack carries study books and pencil cases comfortably."
      },
      {
            "id": "wf_g7_e_18",
            "cluePrompt": "Hook the straight tool with numbers used to draw straight lines",
            "clueCategory": "School",
            "targetWord": "Ruler",
            "distractorWords": [
                  "Compass",
                  "Pen",
                  "Brush"
            ],
            "explanation": "A ruler has centimetre marks to measure and draw lines."
      },
      {
            "id": "wf_g7_e_19",
            "cluePrompt": "Hook the piece of furniture with a mattress where you sleep at night",
            "clueCategory": "Home",
            "targetWord": "Bed",
            "distractorWords": [
                  "Sofa",
                  "Desk",
                  "Armchair"
            ],
            "explanation": "A comfortable bed is where you sleep and rest every night."
      },
      {
            "id": "wf_g7_e_20",
            "cluePrompt": "Hook the kitchen appliance that keeps milk, fruit, and food cold",
            "clueCategory": "Home",
            "targetWord": "Fridge",
            "distractorWords": [
                  "Oven",
                  "Toaster",
                  "Kettle"
            ],
            "explanation": "A refrigerator keeps food cool so it does not spoil."
      },
      {
            "id": "wf_g7_e_21",
            "cluePrompt": "Hook the room in a house where delicious meals are cooked",
            "clueCategory": "Home",
            "targetWord": "Kitchen",
            "distractorWords": [
                  "Bedroom",
                  "Bathroom",
                  "Balcony"
            ],
            "explanation": "Meals and family recipes are prepared in the kitchen."
      },
      {
            "id": "wf_g7_e_22",
            "cluePrompt": "Hook the opening with transparent glass that lets sunlight into a room",
            "clueCategory": "Home",
            "targetWord": "Window",
            "distractorWords": [
                  "Door",
                  "Ceiling",
                  "Floor"
            ],
            "explanation": "Windows let fresh daylight and air into houses."
      },
      {
            "id": "wf_g7_e_23",
            "cluePrompt": "Hook the object on the wall that shows the hour and minute",
            "clueCategory": "Home",
            "targetWord": "Clock",
            "distractorWords": [
                  "Painting",
                  "Mirror",
                  "Curtain"
            ],
            "explanation": "Clocks measure and show the current time of day."
      },
      {
            "id": "wf_g7_e_24",
            "cluePrompt": "Hook the person who teaches lessons to students in a school",
            "clueCategory": "Jobs",
            "targetWord": "Teacher",
            "distractorWords": [
                  "Chef",
                  "Pilot",
                  "Mechanic"
            ],
            "explanation": "Teachers guide and educate students in classrooms."
      },
      {
            "id": "wf_g7_e_25",
            "cluePrompt": "Hook the medical professional who examines you when you are ill",
            "clueCategory": "Jobs",
            "targetWord": "Doctor",
            "distractorWords": [
                  "Lawyer",
                  "Actor",
                  "Architect"
            ],
            "explanation": "Doctors help heal sick people and prescribe medicine."
      },
      {
            "id": "wf_g7_e_26",
            "cluePrompt": "Hook the doctor who looks after your teeth and fills cavities",
            "clueCategory": "Jobs",
            "targetWord": "Dentist",
            "distractorWords": [
                  "Pharmacist",
                  "Nurse",
                  "Optician"
            ],
            "explanation": "Dentists take care of teeth, gums, and oral hygiene."
      },
      {
            "id": "wf_g7_e_27",
            "cluePrompt": "Hook the person who prepares food in a restaurant kitchen",
            "clueCategory": "Jobs",
            "targetWord": "Chef",
            "distractorWords": [
                  "Waiter",
                  "Driver",
                  "Tailor"
            ],
            "explanation": "Chefs are professional cooks who make restaurant meals."
      },
      {
            "id": "wf_g7_e_28",
            "cluePrompt": "Hook the quiet building where you can borrow and read library books",
            "clueCategory": "Places",
            "targetWord": "Library",
            "distractorWords": [
                  "Cinema",
                  "Gym",
                  "Stadium"
            ],
            "explanation": "Libraries lend storybooks and study books to readers."
      },
      {
            "id": "wf_g7_e_29",
            "cluePrompt": "Hook the shop where people buy fresh bread, bagels, and cakes",
            "clueCategory": "Places",
            "targetWord": "Bakery",
            "distractorWords": [
                  "Pharmacy",
                  "Bank",
                  "Butcher"
            ],
            "explanation": "Bakeries bake and sell fresh daily bread and pastries."
      },
      {
            "id": "wf_g7_e_30",
            "cluePrompt": "Hook the place where you watch movies on a gigantic screen",
            "clueCategory": "Places",
            "targetWord": "Cinema",
            "distractorWords": [
                  "Museum",
                  "Post office",
                  "Park"
            ],
            "explanation": "A cinema projects films on a huge screen with surround sound."
      },
      {
            "id": "wf_g7_e_31",
            "cluePrompt": "Hook the two-wheeled vehicle you pedal with your feet",
            "clueCategory": "Transport",
            "targetWord": "Bicycle",
            "distractorWords": [
                  "Bus",
                  "Train",
                  "Airplane"
            ],
            "explanation": "Bicycles have two wheels and pedals for exercise and travel."
      },
      {
            "id": "wf_g7_e_32",
            "cluePrompt": "Hook the large vehicle that carries many students together to school",
            "clueCategory": "Transport",
            "targetWord": "School bus",
            "distractorWords": [
                  "Taxi",
                  "Motorcycle",
                  "Helicopter"
            ],
            "explanation": "School buses safely transport students to and from school."
      },
      {
            "id": "wf_g7_e_33",
            "cluePrompt": "Hook the part of the body at the end of your arm with five fingers",
            "clueCategory": "Body",
            "targetWord": "Hand",
            "distractorWords": [
                  "Foot",
                  "Knee",
                  "Elbow"
            ],
            "explanation": "Your hand has fingers and a thumb to hold objects."
      },
      {
            "id": "wf_g7_e_34",
            "cluePrompt": "Hook the organs on your face that allow you to see the world",
            "clueCategory": "Body",
            "targetWord": "Eyes",
            "distractorWords": [
                  "Ears",
                  "Nose",
                  "Lips"
            ],
            "explanation": "We see colors, books, and friends with our eyes."
      },
      {
            "id": "wf_g7_e_35",
            "cluePrompt": "Hook the family word for your mother's son",
            "clueCategory": "Family",
            "targetWord": "Brother",
            "distractorWords": [
                  "Sister",
                  "Cousin",
                  "Uncle"
            ],
            "explanation": "Your mother's son is your brother."
      },
      {
            "id": "wf_g7_e_36",
            "cluePrompt": "Hook the season when snow falls and the weather is cold",
            "clueCategory": "Seasons",
            "targetWord": "Winter",
            "distractorWords": [
                  "Summer",
                  "Spring",
                  "Autumn"
            ],
            "explanation": "Winter is the coldest season when snow often falls."
      },
      {
            "id": "wf_g7_e_37",
            "cluePrompt": "Hook the bright star in the sky that warms our planet by day",
            "clueCategory": "Nature",
            "targetWord": "Sun",
            "distractorWords": [
                  "Moon",
                  "Cloud",
                  "Star"
            ],
            "explanation": "The sun provides natural heat and light to our world."
      },
      {
            "id": "wf_g7_e_38",
            "cluePrompt": "Hook the opposite of feeling sad",
            "clueCategory": "Feelings",
            "targetWord": "Happy",
            "distractorWords": [
                  "Angry",
                  "Tired",
                  "Bored"
            ],
            "explanation": "Happy means feeling joy, cheerful energy, and smiles."
      },
      {
            "id": "wf_g7_e_39",
            "cluePrompt": "Hook the opposite of small or tiny",
            "clueCategory": "Adjectives",
            "targetWord": "Big",
            "distractorWords": [
                  "Short",
                  "Little",
                  "Thin"
            ],
            "explanation": "Big describes something large in size or volume."
      },
      {
            "id": "wf_g7_e_40",
            "cluePrompt": "Hook the item of clothing you wear on your feet inside shoes",
            "clueCategory": "Clothes",
            "targetWord": "Socks",
            "distractorWords": [
                  "Gloves",
                  "Hat",
                  "Scarf"
            ],
            "explanation": "Socks keep your feet warm and comfortable inside shoes."
      }
],
    medium: [
      {
            "id": "wf_g7_m_01",
            "cluePrompt": "Hook the water sport where swimmers paddle through river rapids in an inflatable boat",
            "clueCategory": "Sports",
            "targetWord": "Rafting",
            "distractorWords": [
                  "Bowling",
                  "Archery",
                  "Darts"
            ],
            "explanation": "White-water rafting is an adventurous river paddling sport."
      },
      {
            "id": "wf_g7_m_02",
            "cluePrompt": "Hook the racquet sport played by hitting a feathered shuttlecock over a net",
            "clueCategory": "Sports",
            "targetWord": "Badminton",
            "distractorWords": [
                  "Squash",
                  "Cricket",
                  "Polo"
            ],
            "explanation": "Badminton uses lightweight rackets to hit a shuttlecock."
      },
      {
            "id": "wf_g7_m_03",
            "cluePrompt": "Hook the game with kings, queens, and knights played on a black-and-white board",
            "clueCategory": "Games",
            "targetWord": "Chess",
            "distractorWords": [
                  "Monopoly",
                  "Scrabble",
                  "Checkers"
            ],
            "explanation": "Chess is a classic strategic board game with 64 squares."
      },
      {
            "id": "wf_g7_m_04",
            "cluePrompt": "Hook walking long trails in nature and climbing hills for exercise",
            "clueCategory": "Hobbies",
            "targetWord": "Hiking",
            "distractorWords": [
                  "Jogging",
                  "Skating",
                  "Surfing"
            ],
            "explanation": "Hiking involves scenic walking along countryside trails."
      },
      {
            "id": "wf_g7_m_05",
            "cluePrompt": "Hook the sport where riders catch ocean waves standing on a surfboard",
            "clueCategory": "Sports",
            "targetWord": "Surfing",
            "distractorWords": [
                  "Diving",
                  "Rowing",
                  "Sailing"
            ],
            "explanation": "Surfers ride waves toward the shore on a surfboard."
      },
      {
            "id": "wf_g7_m_06",
            "cluePrompt": "Hook the winter sport of gliding down snow-covered mountains on two skis",
            "clueCategory": "Sports",
            "targetWord": "Skiing",
            "distractorWords": [
                  "Ice hockey",
                  "Bobsled",
                  "Snowboarding"
            ],
            "explanation": "Skiing uses skis and poles to slide downhill on snow."
      },
      {
            "id": "wf_g7_m_07",
            "cluePrompt": "Hook the feeling of energetic excitement about a fun event coming up",
            "clueCategory": "Feelings",
            "targetWord": "Excited",
            "distractorWords": [
                  "Bored",
                  "Angry",
                  "Sleepy"
            ],
            "explanation": "Feeling excited means looking forward to something with joy."
      },
      {
            "id": "wf_g7_m_08",
            "cluePrompt": "Hook the personality trait of someone who always tells the truth and never lies",
            "clueCategory": "Personality",
            "targetWord": "Honest",
            "distractorWords": [
                  "Selfish",
                  "Sneaky",
                  "Impolite"
            ],
            "explanation": "Honest students tell the truth and act with sincerity."
      },
      {
            "id": "wf_g7_m_09",
            "cluePrompt": "Hook someone who loves sharing their things and helping others freely",
            "clueCategory": "Personality",
            "targetWord": "Generous",
            "distractorWords": [
                  "Mean",
                  "Greedy",
                  "Lazy"
            ],
            "explanation": "Generous people share their snacks, books, and time gladly."
      },
      {
            "id": "wf_g7_m_10",
            "cluePrompt": "Hook someone who is quiet and nervous when speaking to new people",
            "clueCategory": "Personality",
            "targetWord": "Shy",
            "distractorWords": [
                  "Outgoing",
                  "Talkative",
                  "Loud"
            ],
            "explanation": "Shy people feel timid and hesitant in unfamiliar crowds."
      },
      {
            "id": "wf_g7_m_11",
            "cluePrompt": "Hook the person who always arrives on time and is never late",
            "clueCategory": "Personality",
            "targetWord": "Punctual",
            "distractorWords": [
                  "Clumsy",
                  "Forgetful",
                  "Messy"
            ],
            "explanation": "Punctual individuals value time and arrive as scheduled."
      },
      {
            "id": "wf_g7_m_12",
            "cluePrompt": "Hook the feeling of boredom when an activity lacks any fun or interest",
            "clueCategory": "Feelings",
            "targetWord": "Bored",
            "distractorWords": [
                  "Curious",
                  "Delighted",
                  "Shocked"
            ],
            "explanation": "We feel bored when there is nothing interesting to do."
      },
      {
            "id": "wf_g7_m_13",
            "cluePrompt": "Hook the bright flash of electricity seen in the sky during a thunderstorm",
            "clueCategory": "Weather",
            "targetWord": "Lightning",
            "distractorWords": [
                  "Thunder",
                  "Hail",
                  "Breeze"
            ],
            "explanation": "Lightning is an electrical discharge that lights up the sky."
      },
      {
            "id": "wf_g7_m_14",
            "cluePrompt": "Hook the loud booming sound that follows a lightning flash",
            "clueCategory": "Weather",
            "targetWord": "Thunder",
            "distractorWords": [
                  "Storm",
                  "Fog",
                  "Rainbow"
            ],
            "explanation": "Thunder is the sonic rumble created by lightning."
      },
      {
            "id": "wf_g7_m_15",
            "cluePrompt": "Hook small balls of frozen ice that fall from the sky like rain",
            "clueCategory": "Weather",
            "targetWord": "Hail",
            "distractorWords": [
                  "Snow",
                  "Dew",
                  "Frost"
            ],
            "explanation": "Hail consists of solid ice pellets falling during storms."
      },
      {
            "id": "wf_g7_m_16",
            "cluePrompt": "Hook the thick cloud near the ground that makes it hard for drivers to see",
            "clueCategory": "Weather",
            "targetWord": "Fog",
            "distractorWords": [
                  "Breeze",
                  "Smoke",
                  "Dust"
            ],
            "explanation": "Dense fog reduces visibility on roads and mountains."
      },
      {
            "id": "wf_g7_m_17",
            "cluePrompt": "Hook the colorful arch of seven colors appearing in the sky after rain",
            "clueCategory": "Nature",
            "targetWord": "Rainbow",
            "distractorWords": [
                  "Horizon",
                  "Sunset",
                  "Aurora"
            ],
            "explanation": "Rainbows form when sunlight shines through raindrops."
      },
      {
            "id": "wf_g7_m_18",
            "cluePrompt": "Hook a large dry land with sand dunes where very little rain falls",
            "clueCategory": "Geography",
            "targetWord": "Desert",
            "distractorWords": [
                  "Jungle",
                  "Glacier",
                  "Swamp"
            ],
            "explanation": "Deserts are arid regions with cacti and sand dunes."
      },
      {
            "id": "wf_g7_m_19",
            "cluePrompt": "Hook a piece of land completely surrounded by water on all sides",
            "clueCategory": "Geography",
            "targetWord": "Island",
            "distractorWords": [
                  "Peninsula",
                  "Valley",
                  "Cliff"
            ],
            "explanation": "An island is surrounded by the sea, ocean, or lake."
      },
      {
            "id": "wf_g7_m_20",
            "cluePrompt": "Hook a mountain that can erupt hot red lava and smoke from its top",
            "clueCategory": "Nature",
            "targetWord": "Volcano",
            "distractorWords": [
                  "Waterfall",
                  "Cave",
                  "Canyon"
            ],
            "explanation": "Volcanoes erupt molten lava and volcanic ash."
      },
      {
            "id": "wf_g7_m_21",
            "cluePrompt": "Hook the official passport booklet you need when travelling to foreign countries",
            "clueCategory": "Travel",
            "targetWord": "Passport",
            "distractorWords": [
                  "Ticket",
                  "Receipt",
                  "License"
            ],
            "explanation": "A passport is the official document needed to visit other nations."
      },
      {
            "id": "wf_g7_m_22",
            "cluePrompt": "Hook the suitcases and travel bags you pack with clothes for a journey",
            "clueCategory": "Travel",
            "targetWord": "Luggage",
            "distractorWords": [
                  "Parcel",
                  "Backpack",
                  "Box"
            ],
            "explanation": "Luggage carries your holiday clothes and belongings."
      },
      {
            "id": "wf_g7_m_23",
            "cluePrompt": "Hook a small gift or item you buy on holiday to remember your trip",
            "clueCategory": "Travel",
            "targetWord": "Souvenir",
            "distractorWords": [
                  "Bill",
                  "Postcard",
                  "Map"
            ],
            "explanation": "Souvenirs are keepsakes bought to remember visited places."
      },
      {
            "id": "wf_g7_m_24",
            "cluePrompt": "Hook the place with runways where passengers board airplanes",
            "clueCategory": "Travel",
            "targetWord": "Airport",
            "distractorWords": [
                  "Harbor",
                  "Station",
                  "Metro"
            ],
            "explanation": "Airports feature departure halls and airplane runways."
      },
      {
            "id": "wf_g7_m_25",
            "cluePrompt": "Hook the unpleasant continuous pain felt inside your head",
            "clueCategory": "Health",
            "targetWord": "Headache",
            "distractorWords": [
                  "Toothache",
                  "Fever",
                  "Cough"
            ],
            "explanation": "A headache is pain felt in the head, often relieved by rest."
      },
      {
            "id": "wf_g7_m_26",
            "cluePrompt": "Hook having a high body temperature when your body fights off an illness",
            "clueCategory": "Health",
            "targetWord": "Fever",
            "distractorWords": [
                  "Cold",
                  "Scratch",
                  "Bruise"
            ],
            "explanation": "A fever means body temperature is higher than normal."
      },
      {
            "id": "wf_g7_m_27",
            "cluePrompt": "Hook the instrument doctors use to measure your body temperature",
            "clueCategory": "Health",
            "targetWord": "Thermometer",
            "distractorWords": [
                  "Stethoscope",
                  "Syringe",
                  "Bandage"
            ],
            "explanation": "Thermometers read internal body temperature accurately."
      },
      {
            "id": "wf_g7_m_28",
            "cluePrompt": "Hook a strip of cloth wrapped around a cut or sprained wrist to protect it",
            "clueCategory": "Health",
            "targetWord": "Bandage",
            "distractorWords": [
                  "Plaster",
                  "Towel",
                  "Tissue"
            ],
            "explanation": "A bandage supports and shields injuries while they heal."
      },
      {
            "id": "wf_g7_m_29",
            "cluePrompt": "Hook the note a doctor writes for the chemist telling what medicine you need",
            "clueCategory": "Health",
            "targetWord": "Prescription",
            "distractorWords": [
                  "Receipt",
                  "Letter",
                  "Card"
            ],
            "explanation": "A prescription gives permission to get needed pharmacy medicine."
      },
      {
            "id": "wf_g7_m_30",
            "cluePrompt": "Hook the emergency vehicle with flashing sirens that rushes patients to hospital",
            "clueCategory": "Health",
            "targetWord": "Ambulance",
            "distractorWords": [
                  "Police car",
                  "Fire truck",
                  "Taxi"
            ],
            "explanation": "Ambulances transport sick or injured people quickly to hospital."
      },
      {
            "id": "wf_g7_m_31",
            "cluePrompt": "Hook the hobby of planting flowers, seeds, and watering plants in soil",
            "clueCategory": "Hobbies",
            "targetWord": "Gardening",
            "distractorWords": [
                  "Painting",
                  "Knitting",
                  "Cooking"
            ],
            "explanation": "Gardening involves caring for plants, vegetables, and flowers."
      },
      {
            "id": "wf_g7_m_32",
            "cluePrompt": "Hook an ancient stone castle where kings and medieval knights once lived",
            "clueCategory": "History",
            "targetWord": "Castle",
            "distractorWords": [
                  "Villa",
                  "Cottage",
                  "Apartment"
            ],
            "explanation": "Castles were fortified stone homes for royalty."
      },
      {
            "id": "wf_g7_m_33",
            "cluePrompt": "Hook the musical event where a band plays live music on stage for an audience",
            "clueCategory": "Entertainment",
            "targetWord": "Concert",
            "distractorWords": [
                  "Movie",
                  "Exhibition",
                  "Play"
            ],
            "explanation": "A concert is a live musical performance by singers or bands."
      },
      {
            "id": "wf_g7_m_34",
            "cluePrompt": "Hook a short printed magazine or newspaper you read for entertainment and articles",
            "clueCategory": "Media",
            "targetWord": "Magazine",
            "distractorWords": [
                  "Dictionary",
                  "Atlas",
                  "Notebook"
            ],
            "explanation": "Magazines have articles, pictures, and interviews on fun topics."
      },
      {
            "id": "wf_g7_m_35",
            "cluePrompt": "Hook being sensible, careful, and doing your school duties without reminders",
            "clueCategory": "Personality",
            "targetWord": "Responsible",
            "distractorWords": [
                  "Reckless",
                  "Careless",
                  "Forgetful"
            ],
            "explanation": "Responsible students take ownership of their tasks."
      },
      {
            "id": "wf_g7_m_36",
            "cluePrompt": "Hook working together as a friendly team to solve a classroom challenge",
            "clueCategory": "Teamwork",
            "targetWord": "Cooperation",
            "distractorWords": [
                  "Argument",
                  "Fighting",
                  "Dispute"
            ],
            "explanation": "Cooperation means teaming up and helping one another."
      },
      {
            "id": "wf_g7_m_37",
            "cluePrompt": "Hook looking on the bright side and believing good things will happen",
            "clueCategory": "Mindset",
            "targetWord": "Optimistic",
            "distractorWords": [
                  "Gloomy",
                  "Grumpy",
                  "Negative"
            ],
            "explanation": "Optimistic people stay cheerful and hope for the best."
      },
      {
            "id": "wf_g7_m_38",
            "cluePrompt": "Hook saying 'please' and 'thank you' and treating everyone with good manners",
            "clueCategory": "Manners",
            "targetWord": "Polite",
            "distractorWords": [
                  "Rude",
                  "Cheeky",
                  "Loud"
            ],
            "explanation": "Polite individuals treat others with courtesy and respect."
      },
      {
            "id": "wf_g7_m_39",
            "cluePrompt": "Hook finding the correct answer to a difficult problem or puzzle",
            "clueCategory": "Skills",
            "targetWord": "Solution",
            "distractorWords": [
                  "Mistake",
                  "Problem",
                  "Question"
            ],
            "explanation": "A solution solves a riddle, problem, or difficult situation."
      },
      {
            "id": "wf_g7_m_40",
            "cluePrompt": "Hook achieving your goal through hard study and practice",
            "clueCategory": "Success",
            "targetWord": "Success",
            "distractorWords": [
                  "Failure",
                  "Loss",
                  "Defeat"
            ],
            "explanation": "Success is the rewarding result of perseverance and effort."
      }
],
    hard: [
      {
            "id": "wf_g7_h_01",
            "cluePrompt": "Hook sorting plastic bottles, paper, and glass into recycling bins",
            "clueCategory": "Environment",
            "targetWord": "Recycling",
            "distractorWords": [
                  "Littering",
                  "Polluting",
                  "Wasting"
            ],
            "explanation": "Recycling turns used materials into fresh new items."
      },
      {
            "id": "wf_g7_h_02",
            "cluePrompt": "Hook the natural home where an animal or plant lives in the wild",
            "clueCategory": "Nature",
            "targetWord": "Habitat",
            "distractorWords": [
                  "Cage",
                  "Zoo",
                  "Barn"
            ],
            "explanation": "A natural habitat provides wild animals with food, water, and shelter."
      },
      {
            "id": "wf_g7_h_03",
            "cluePrompt": "Hook dirty smoke, chemicals, or trash that harm clean air and water",
            "clueCategory": "Environment",
            "targetWord": "Pollution",
            "distractorWords": [
                  "Freshness",
                  "Protection",
                  "Safety"
            ],
            "explanation": "Pollution makes the air, rivers, or soil unclean."
      },
      {
            "id": "wf_g7_h_04",
            "cluePrompt": "Hook rare animals like pandas that are in danger of dying out",
            "clueCategory": "Wildlife",
            "targetWord": "Endangered",
            "distractorWords": [
                  "Abundant",
                  "Common",
                  "Safe"
            ],
            "explanation": "Endangered animals need our protection so they do not disappear."
      },
      {
            "id": "wf_g7_h_05",
            "cluePrompt": "Hook clean electricity generated from sunlight using solar panels on roofs",
            "clueCategory": "Science",
            "targetWord": "Solar energy",
            "distractorWords": [
                  "Coal",
                  "Gasoline",
                  "Oil"
            ],
            "explanation": "Solar energy uses power from the sun to make clean electricity."
      },
      {
            "id": "wf_g7_h_06",
            "cluePrompt": "Hook cutting down too many forest trees, which harms wildlife",
            "clueCategory": "Environment",
            "targetWord": "Deforestation",
            "distractorWords": [
                  "Gardening",
                  "Watering",
                  "Planting"
            ],
            "explanation": "Deforestation is the loss of forest land when trees are cut down."
      },
      {
            "id": "wf_g7_h_07",
            "cluePrompt": "Hook the long tube instrument astronomers use to look at stars and planets",
            "clueCategory": "Science",
            "targetWord": "Telescope",
            "distractorWords": [
                  "Microscope",
                  "Camera",
                  "Compass"
            ],
            "explanation": "Telescopes magnify distant celestial stars and planets."
      },
      {
            "id": "wf_g7_h_08",
            "cluePrompt": "Hook the laboratory tool used to view tiny cells and bacteria",
            "clueCategory": "Science",
            "targetWord": "Microscope",
            "distractorWords": [
                  "Binoculars",
                  "Thermometer",
                  "Periscope"
            ],
            "explanation": "Microscopes allow scientists to see tiny bacteria and microscopic cells."
      },
      {
            "id": "wf_g7_h_09",
            "cluePrompt": "Hook a practical science test conducted in a lab to discover new facts",
            "clueCategory": "Science",
            "targetWord": "Experiment",
            "distractorWords": [
                  "Opinion",
                  "Story",
                  "Joke"
            ],
            "explanation": "Scientists perform experiments to test ideas and discover truths."
      },
      {
            "id": "wf_g7_h_10",
            "cluePrompt": "Hook the plastic computer board with letter keys used for typing",
            "clueCategory": "Technology",
            "targetWord": "Keyboard",
            "distractorWords": [
                  "Monitor",
                  "Speaker",
                  "Mousepad"
            ],
            "explanation": "You use a keyboard to type letters, numbers, and sentences."
      },
      {
            "id": "wf_g7_h_11",
            "cluePrompt": "Hook copying photos, songs, or games from the internet to your device",
            "clueCategory": "Technology",
            "targetWord": "Download",
            "distractorWords": [
                  "Upload",
                  "Delete",
                  "Print"
            ],
            "explanation": "Downloading brings digital files from the web onto your device."
      },
      {
            "id": "wf_g7_h_12",
            "cluePrompt": "Hook sending your photos or homework from your device up to the internet",
            "clueCategory": "Technology",
            "targetWord": "Upload",
            "distractorWords": [
                  "Download",
                  "Erase",
                  "Unplug"
            ],
            "explanation": "Uploading transfers local files up to an online platform."
      },
      {
            "id": "wf_g7_h_13",
            "cluePrompt": "Hook the secret combination of letters and numbers that protects your account",
            "clueCategory": "Technology",
            "targetWord": "Password",
            "distractorWords": [
                  "Username",
                  "Email",
                  "Nickname"
            ],
            "explanation": "A private password keeps your digital accounts secure."
      },
      {
            "id": "wf_g7_h_14",
            "cluePrompt": "Hook the portable computer you can fold closed and carry in your bag",
            "clueCategory": "Technology",
            "targetWord": "Laptop",
            "distractorWords": [
                  "Television",
                  "Desktop",
                  "Monitor"
            ],
            "explanation": "A laptop is a compact computer with a built-in screen and battery."
      },
      {
            "id": "wf_g7_h_15",
            "cluePrompt": "Hook wireless internet connection that lets your phone surf the web at home",
            "clueCategory": "Technology",
            "targetWord": "Wi-Fi",
            "distractorWords": [
                  "Cable",
                  "Radio",
                  "Bluetooth"
            ],
            "explanation": "Wi-Fi connects computers and phones to the internet without wires."
      },
      {
            "id": "wf_g7_h_16",
            "cluePrompt": "Hook software like Chrome or Safari used to browse webpages on the internet",
            "clueCategory": "Technology",
            "targetWord": "Web browser",
            "distractorWords": [
                  "Folder",
                  "Calculator",
                  "Spreadsheet"
            ],
            "explanation": "A browser loads and displays internet websites."
      },
      {
            "id": "wf_g7_h_17",
            "cluePrompt": "Hook the carved stone or bronze monument created in the likeness of a person",
            "clueCategory": "Art",
            "targetWord": "Statue",
            "distractorWords": [
                  "Painting",
                  "Drawing",
                  "Photo"
            ],
            "explanation": "A statue is a 3D sculpture honouring a historic figure or hero."
      },
      {
            "id": "wf_g7_h_18",
            "cluePrompt": "Hook the book that tells the real-life story of a famous person's life",
            "clueCategory": "Reading",
            "targetWord": "Biography",
            "distractorWords": [
                  "Fairy tale",
                  "Comic",
                  "Poem"
            ],
            "explanation": "A biography describes the real life and achievements of a person."
      },
      {
            "id": "wf_g7_h_19",
            "cluePrompt": "Hook when a reporter asks a famous athlete or scientist questions for the news",
            "clueCategory": "Media",
            "targetWord": "Interview",
            "distractorWords": [
                  "Argument",
                  "Lecture",
                  "Debate"
            ],
            "explanation": "In an interview, journalists ask questions to learn new details."
      },
      {
            "id": "wf_g7_h_20",
            "cluePrompt": "Hook the mental courage to face danger or fear without giving up",
            "clueCategory": "Values",
            "targetWord": "Bravery",
            "distractorWords": [
                  "Fear",
                  "Weakness",
                  "Hesitation"
            ],
            "explanation": "Bravery means acting with courage even when something is scary."
      },
      {
            "id": "wf_g7_h_21",
            "cluePrompt": "Hook feeling thankful and appreciating the help people give you",
            "clueCategory": "Values",
            "targetWord": "Gratitude",
            "distractorWords": [
                  "Anger",
                  "Jealousy",
                  "Pride"
            ],
            "explanation": "Gratitude is showing appreciation and warmth to helpful friends."
      },
      {
            "id": "wf_g7_h_22",
            "cluePrompt": "Hook having confidence in your abilities and not doubting yourself",
            "clueCategory": "Mindset",
            "targetWord": "Confidence",
            "distractorWords": [
                  "Worry",
                  "Confusion",
                  "Shyness"
            ],
            "explanation": "Confidence means believing in your practice and strengths."
      },
      {
            "id": "wf_g7_h_23",
            "cluePrompt": "Hook planting small green tree saplings in the soil to grow a forest",
            "clueCategory": "Nature",
            "targetWord": "Plant trees",
            "distractorWords": [
                  "Cut trees",
                  "Burn leaves",
                  "Build road"
            ],
            "explanation": "Planting trees cleans our air and creates homes for birds."
      },
      {
            "id": "wf_g7_h_24",
            "cluePrompt": "Hook picking up plastic wrappers and bottles dropped on the grass",
            "clueCategory": "Environment",
            "targetWord": "Collect litter",
            "distractorWords": [
                  "Drop litter",
                  "Ignore trash",
                  "Break glass"
            ],
            "explanation": "Collecting litter keeps parks and playgrounds clean and safe."
      },
      {
            "id": "wf_g7_h_25",
            "cluePrompt": "Hook an expert who travels into space in a rocket ship",
            "clueCategory": "Jobs",
            "targetWord": "Astronaut",
            "distractorWords": [
                  "Sailor",
                  "Miner",
                  "Builder"
            ],
            "explanation": "Astronauts train to fly into space and explore the solar system."
      },
      {
            "id": "wf_g7_h_26",
            "cluePrompt": "Hook a person whose job is to design buildings, schools, and houses",
            "clueCategory": "Jobs",
            "targetWord": "Architect",
            "distractorWords": [
                  "Plumber",
                  "Electrician",
                  "Carpenter"
            ],
            "explanation": "Architects draw plans to construct beautiful, sturdy buildings."
      },
      {
            "id": "wf_g7_h_27",
            "cluePrompt": "Hook someone whose job is to put out fires and rescue trapped people",
            "clueCategory": "Jobs",
            "targetWord": "Firefighter",
            "distractorWords": [
                  "Police officer",
                  "Security",
                  "Guard"
            ],
            "explanation": "Firefighters bravely extinguish fires and help in emergencies."
      },
      {
            "id": "wf_g7_h_28",
            "cluePrompt": "Hook the brave sport of climbing up natural rocky mountain cliffs with ropes",
            "clueCategory": "Sports",
            "targetWord": "Rock climbing",
            "distractorWords": [
                  "Running",
                  "Bowling",
                  "Fishing"
            ],
            "explanation": "Rock climbing requires strength, agility, and safety ropes."
      },
      {
            "id": "wf_g7_h_29",
            "cluePrompt": "Hook the traditional skill of shooting arrows at a target with a bow",
            "clueCategory": "Sports",
            "targetWord": "Archery",
            "distractorWords": [
                  "Fencing",
                  "Wrestling",
                  "Karate"
            ],
            "explanation": "Archery tests concentration when shooting arrows at a bullseye."
      },
      {
            "id": "wf_g7_h_30",
            "cluePrompt": "Hook sleeping outside in a tent under the night stars in the forest",
            "clueCategory": "Hobbies",
            "targetWord": "Camping",
            "distractorWords": [
                  "Shopping",
                  "Sightseeing",
                  "Hotel stay"
            ],
            "explanation": "Camping is staying in tents and cooking food over campfires."
      },
      {
            "id": "wf_g7_h_31",
            "cluePrompt": "Hook the hard protective cap you strap on your head when riding a bicycle",
            "clueCategory": "Safety",
            "targetWord": "Helmet",
            "distractorWords": [
                  "Beanie",
                  "Cap",
                  "Sunhat"
            ],
            "explanation": "A safety helmet protects your head from bumps and falls."
      },
      {
            "id": "wf_g7_h_32",
            "cluePrompt": "Hook protective glasses that keep water out of your eyes while swimming",
            "clueCategory": "Sports",
            "targetWord": "Goggles",
            "distractorWords": [
                  "Sunglasses",
                  "Spectacles",
                  "Visor"
            ],
            "explanation": "Swimming goggles seal tightly so you can see underwater."
      },
      {
            "id": "wf_g7_h_33",
            "cluePrompt": "Hook the warm clothing accessory you wrap around your neck in winter",
            "clueCategory": "Clothes",
            "targetWord": "Scarf",
            "distractorWords": [
                  "Belt",
                  "Tie",
                  "Bracelet"
            ],
            "explanation": "A woolen scarf keeps your neck warm in chilly weather."
      },
      {
            "id": "wf_g7_h_34",
            "cluePrompt": "Hook the warm clothing items you wear on your hands to keep fingers warm",
            "clueCategory": "Clothes",
            "targetWord": "Gloves",
            "distractorWords": [
                  "Socks",
                  "Slippers",
                  "Boots"
            ],
            "explanation": "Gloves shield your hands and fingers from winter cold."
      },
      {
            "id": "wf_g7_h_35",
            "cluePrompt": "Hook turning off tap water while brushing teeth to avoid wasting water",
            "clueCategory": "Environment",
            "targetWord": "Save water",
            "distractorWords": [
                  "Waste water",
                  "Pollute water",
                  "Boil water"
            ],
            "explanation": "Saving water protects our lakes and keeps clean water plentiful."
      },
      {
            "id": "wf_g7_h_36",
            "cluePrompt": "Hook remembering to switch off lights when you leave an empty room",
            "clueCategory": "Environment",
            "targetWord": "Save electricity",
            "distractorWords": [
                  "Leave lights on",
                  "Waste energy",
                  "Burn fuel"
            ],
            "explanation": "Turning off lights saves energy and helps the environment."
      },
      {
            "id": "wf_g7_h_37",
            "cluePrompt": "Hook the gold, silver, or bronze award given to athletes on the sports podium",
            "clueCategory": "Sports",
            "targetWord": "Medal",
            "distractorWords": [
                  "Flag",
                  "Ticket",
                  "Whistle"
            ],
            "explanation": "Winners on the sports podium are awarded champion medals."
      },
      {
            "id": "wf_g7_h_38",
            "cluePrompt": "Hook the silver cup prize given to the winning sports team",
            "clueCategory": "Sports",
            "targetWord": "Trophy",
            "distractorWords": [
                  "Ribbon",
                  "Poster",
                  "Badge"
            ],
            "explanation": "A trophy is a championship cup won at tournament finals."
      },
      {
            "id": "wf_g7_h_39",
            "cluePrompt": "Hook a funny TV program with jokes that makes the audience laugh",
            "clueCategory": "Media",
            "targetWord": "Comedy",
            "distractorWords": [
                  "Horror",
                  "News",
                  "Documentary"
            ],
            "explanation": "Comedies are amusing shows designed to bring laughter."
      },
      {
            "id": "wf_g7_h_40",
            "cluePrompt": "Hook a TV program about real animals, nature, and wild oceans",
            "clueCategory": "Media",
            "targetWord": "Documentary",
            "distractorWords": [
                  "Cartoon",
                  "Drama",
                  "Commercial"
            ],
            "explanation": "Nature documentaries show real wildlife behavior on television."
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
            "explanation": "A buddy is a loyal pal who stands by you through thick and thin."
      },
      {
            "id": "wf_g8_e_02",
            "cluePrompt": "Hook keeping secrets and never breaking a friend's confidence",
            "clueCategory": "Friendship",
            "targetWord": "Trust",
            "distractorWords": [
                  "Doubt",
                  "Jealousy",
                  "Lie"
            ],
            "explanation": "Trust means relying fully on a companion's honesty."
      },
      {
            "id": "wf_g8_e_03",
            "cluePrompt": "Hook encouraging friends and helping them whenever they feel down",
            "clueCategory": "Friendship",
            "targetWord": "Supportive",
            "distractorWords": [
                  "Mean",
                  "Selfish",
                  "Strict"
            ],
            "explanation": "Supportive friends listen and offer comfort in tough times."
      },
      {
            "id": "wf_g8_e_04",
            "cluePrompt": "Hook spending fun, relaxing free time together with your friends",
            "clueCategory": "Teen Life",
            "targetWord": "Hang out",
            "distractorWords": [
                  "Fall out",
                  "Give up",
                  "Drop out"
            ],
            "explanation": "Hanging out means spending friendly, leisurely hours together."
      },
      {
            "id": "wf_g8_e_05",
            "cluePrompt": "Hook having a harmonious, friendly relationship with someone",
            "clueCategory": "Friendship",
            "targetWord": "Get along",
            "distractorWords": [
                  "Argue",
                  "Fight",
                  "Break up"
            ],
            "explanation": "Getting along with peers means enjoying mutual friendship."
      },
      {
            "id": "wf_g8_e_06",
            "cluePrompt": "Hook having similar interests, music tastes, and hobbies as a friend",
            "clueCategory": "Friendship",
            "targetWord": "Have in common",
            "distractorWords": [
                  "Disagree",
                  "Dislike",
                  "Ignore"
            ],
            "explanation": "Friends have things in common when they enjoy similar hobbies."
      },
      {
            "id": "wf_g8_e_07",
            "cluePrompt": "Hook a written or verbal invitation asking a friend to your birthday party",
            "clueCategory": "Social",
            "targetWord": "Invitation",
            "distractorWords": [
                  "Refusal",
                  "Excuse",
                  "Argument"
            ],
            "explanation": "An invitation invites guests to join a celebratory party."
      },
      {
            "id": "wf_g8_e_08",
            "cluePrompt": "Hook politely saying 'yes' when a friend invites you to play games",
            "clueCategory": "Friendship",
            "targetWord": "Accept",
            "distractorWords": [
                  "Refuse",
                  "Reject",
                  "Ignore"
            ],
            "explanation": "Accepting an invitation means agreeing happily to come."
      },
      {
            "id": "wf_g8_e_09",
            "cluePrompt": "Hook politely saying 'no' when you cannot attend an event",
            "clueCategory": "Friendship",
            "targetWord": "Refuse",
            "distractorWords": [
                  "Accept",
                  "Welcome",
                  "Invite"
            ],
            "explanation": "Refusing an offer means declining politely when busy."
      },
      {
            "id": "wf_g8_e_10",
            "cluePrompt": "Hook giving a polite reason why you cannot come to a party",
            "clueCategory": "Friendship",
            "targetWord": "Excuse",
            "distractorWords": [
                  "Demand",
                  "Order",
                  "Secret"
            ],
            "explanation": "An excuse explains why you are unable to attend an activity."
      },
      {
            "id": "wf_g8_e_11",
            "cluePrompt": "Hook the cooking action of heating water until it bubbles at 100 degrees",
            "clueCategory": "Cooking",
            "targetWord": "Boil",
            "distractorWords": [
                  "Freeze",
                  "Bake",
                  "Grill"
            ],
            "explanation": "Boiling cooks pasta and eggs in bubbling hot water."
      },
      {
            "id": "wf_g8_e_12",
            "cluePrompt": "Hook cooking cake dough or biscuits inside a hot enclosed oven",
            "clueCategory": "Cooking",
            "targetWord": "Bake",
            "distractorWords": [
                  "Fry",
                  "Boil",
                  "Steam"
            ],
            "explanation": "Baking uses dry heat inside an oven to bake cookies."
      },
      {
            "id": "wf_g8_e_13",
            "cluePrompt": "Hook cutting onions and tomatoes into small bite-sized pieces with a knife",
            "clueCategory": "Cooking",
            "targetWord": "Chop",
            "distractorWords": [
                  "Spread",
                  "Peel",
                  "Stir"
            ],
            "explanation": "Chopping cuts vegetables into smaller diced pieces."
      },
      {
            "id": "wf_g8_e_14",
            "cluePrompt": "Hook removing the thin outer skin from an apple or potato",
            "clueCategory": "Cooking",
            "targetWord": "Peel",
            "distractorWords": [
                  "Mash",
                  "Grate",
                  "Whisk"
            ],
            "explanation": "Peeling strips away the skin of potatoes or apples."
      },
      {
            "id": "wf_g8_e_15",
            "cluePrompt": "Hook cutting bread or meat into thin flat pieces",
            "clueCategory": "Cooking",
            "targetWord": "Slice",
            "distractorWords": [
                  "Freeze",
                  "Boil",
                  "Peel"
            ],
            "explanation": "Slicing produces even, flat slices of bread or cheese."
      },
      {
            "id": "wf_g8_e_16",
            "cluePrompt": "Hook rubbing hard yellow cheese against sharp metal holes to make shreds",
            "clueCategory": "Cooking",
            "targetWord": "Grate",
            "distractorWords": [
                  "Whisk",
                  "Boil",
                  "Pour"
            ],
            "explanation": "Grating shreds cheese over pasta and pizza."
      },
      {
            "id": "wf_g8_e_17",
            "cluePrompt": "Hook beating eggs and cream quickly in a bowl with a wire tool",
            "clueCategory": "Cooking",
            "targetWord": "Whisk",
            "distractorWords": [
                  "Bake",
                  "Peel",
                  "Chop"
            ],
            "explanation": "Whisking whips air into eggs until they are frothy."
      },
      {
            "id": "wf_g8_e_18",
            "cluePrompt": "Hook the step-by-step cooking instructions to prepare a tasty dish",
            "clueCategory": "Cooking",
            "targetWord": "Recipe",
            "distractorWords": [
                  "Menu",
                  "Bill",
                  "Order"
            ],
            "explanation": "A recipe lists the steps and ingredients for a meal."
      },
      {
            "id": "wf_g8_e_19",
            "cluePrompt": "Hook any food item like flour, sugar, or salt used in a recipe",
            "clueCategory": "Cooking",
            "targetWord": "Ingredient",
            "distractorWords": [
                  "Utensil",
                  "Plate",
                  "Napkin"
            ],
            "explanation": "Ingredients are the items combined to cook a dish."
      },
      {
            "id": "wf_g8_e_20",
            "cluePrompt": "Hook cooking meatballs or chicken over hot charcoal bars outdoors",
            "clueCategory": "Cooking",
            "targetWord": "Grill",
            "distractorWords": [
                  "Boil",
                  "Steam",
                  "Poach"
            ],
            "explanation": "Grilling cooks barbecue food over hot coals."
      },
      {
            "id": "wf_g8_e_21",
            "cluePrompt": "Hook the kitchen utensil with a long handle and deep spoon used to serve soup",
            "clueCategory": "Kitchen",
            "targetWord": "Ladle",
            "distractorWords": [
                  "Fork",
                  "Knife",
                  "Whisk"
            ],
            "explanation": "A ladle serves soup from the pot into dinner bowls."
      },
      {
            "id": "wf_g8_e_22",
            "cluePrompt": "Hook the bowl with drain holes used to drain boiling water from pasta",
            "clueCategory": "Kitchen",
            "targetWord": "Colander",
            "distractorWords": [
                  "Saucepan",
                  "Skillet",
                  "Baking sheet"
            ],
            "explanation": "A colander lets water drain out while holding the pasta."
      },
      {
            "id": "wf_g8_e_23",
            "cluePrompt": "Hook the taste of honey, chocolate, and sugar",
            "clueCategory": "Food",
            "targetWord": "Sweet",
            "distractorWords": [
                  "Salty",
                  "Sour",
                  "Bitter"
            ],
            "explanation": "Sugar and honey have a sweet taste."
      },
      {
            "id": "wf_g8_e_24",
            "cluePrompt": "Hook the sour taste of fresh lemon juice",
            "clueCategory": "Food",
            "targetWord": "Sour",
            "distractorWords": [
                  "Sweet",
                  "Spicy",
                  "Greasy"
            ],
            "explanation": "Lemons and vinegar have a sharp, sour flavor."
      },
      {
            "id": "wf_g8_e_25",
            "cluePrompt": "Hook food with lots of red chili peppers that makes your tongue feel hot",
            "clueCategory": "Food",
            "targetWord": "Spicy",
            "distractorWords": [
                  "Sweet",
                  "Cold",
                  "Mild"
            ],
            "explanation": "Chili peppers give Mexican and Asian dishes a spicy kick."
      },
      {
            "id": "wf_g8_e_26",
            "cluePrompt": "Hook the kitchen action of moving a wooden spoon in circles inside a pot",
            "clueCategory": "Cooking",
            "targetWord": "Stir",
            "distractorWords": [
                  "Chop",
                  "Peel",
                  "Grate"
            ],
            "explanation": "Stirring blends soup ingredients evenly while cooking."
      },
      {
            "id": "wf_g8_e_27",
            "cluePrompt": "Hook speaking face-to-face with a friend in real life instead of texting",
            "clueCategory": "Communication",
            "targetWord": "In person",
            "distractorWords": [
                  "Online",
                  "Virtually",
                  "By mail"
            ],
            "explanation": "Talking in person means meeting up physically."
      },
      {
            "id": "wf_g8_e_28",
            "cluePrompt": "Hook the recorded voice message left when someone doesn't answer your call",
            "clueCategory": "Communication",
            "targetWord": "Voicemail",
            "distractorWords": [
                  "Email",
                  "Letter",
                  "Ringtone"
            ],
            "explanation": "Voicemail saves an audio message for unanswered calls."
      },
      {
            "id": "wf_g8_e_29",
            "cluePrompt": "Hook typing short messages on a mobile phone to a classmate",
            "clueCategory": "Communication",
            "targetWord": "Texting",
            "distractorWords": [
                  "Printing",
                  "Painting",
                  "Calling"
            ],
            "explanation": "Texting sends quick SMS and chat messages on mobile phones."
      },
      {
            "id": "wf_g8_e_30",
            "cluePrompt": "Hook a live phone call where you see each other on your screens",
            "clueCategory": "Communication",
            "targetWord": "Video call",
            "distractorWords": [
                  "Radio",
                  "Telegram",
                  "Voicemail"
            ],
            "explanation": "Video calls let friends see and talk to each other live."
      },
      {
            "id": "wf_g8_e_31",
            "cluePrompt": "Hook keeping contact with friends over many years so you don't lose touch",
            "clueCategory": "Friendship",
            "targetWord": "Keep in touch",
            "distractorWords": [
                  "Argue",
                  "Forget",
                  "Hang up"
            ],
            "explanation": "Keeping in touch preserves connections with pals."
      },
      {
            "id": "wf_g8_e_32",
            "cluePrompt": "Hook ending a phone call by tapping the red end button",
            "clueCategory": "Communication",
            "targetWord": "Hang up",
            "distractorWords": [
                  "Dial",
                  "Connect",
                  "Pick up"
            ],
            "explanation": "Hanging up finishes a telephone conversation."
      },
      {
            "id": "wf_g8_e_33",
            "cluePrompt": "Hook answering an incoming phone call when your smartphone rings",
            "clueCategory": "Communication",
            "targetWord": "Pick up",
            "distractorWords": [
                  "Hang up",
                  "Reject",
                  "Ignore"
            ],
            "explanation": "Picking up answers the ringing telephone."
      },
      {
            "id": "wf_g8_e_34",
            "cluePrompt": "Hook entering a phone number on keypad to place a telephone call",
            "clueCategory": "Communication",
            "targetWord": "Dial",
            "distractorWords": [
                  "Erase",
                  "Scroll",
                  "Download"
            ],
            "explanation": "Dialing enters numbers to connect to a person's phone."
      },
      {
            "id": "wf_g8_e_35",
            "cluePrompt": "Hook a musical tune played by your phone when someone calls you",
            "clueCategory": "Communication",
            "targetWord": "Ringtone",
            "distractorWords": [
                  "Static",
                  "Silence",
                  "Dial tone"
            ],
            "explanation": "A ringtone plays aloud to announce an incoming call."
      },
      {
            "id": "wf_g8_e_36",
            "cluePrompt": "Hook a yellow smiley icon in a chat message showing how you feel",
            "clueCategory": "Digital",
            "targetWord": "Emoji",
            "distractorWords": [
                  "Photo",
                  "Video",
                  "Audio"
            ],
            "explanation": "Emojis show smiles, hearts, and emotions in text messages."
      },
      {
            "id": "wf_g8_e_37",
            "cluePrompt": "Hook a pop-up alert on your phone showing a new message has arrived",
            "clueCategory": "Digital",
            "targetWord": "Notification",
            "distractorWords": [
                  "Virus",
                  "Spam",
                  "Battery"
            ],
            "explanation": "Notifications alert you to incoming messages and news."
      },
      {
            "id": "wf_g8_e_38",
            "cluePrompt": "Hook being someone friends can always depend on and trust",
            "clueCategory": "Personality",
            "targetWord": "Reliable",
            "distractorWords": [
                  "Unfair",
                  "Deceitful",
                  "Lazy"
            ],
            "explanation": "Reliable friends keep their promises every time."
      },
      {
            "id": "wf_g8_e_39",
            "cluePrompt": "Hook wanting what another person has and feeling jealous",
            "clueCategory": "Feelings",
            "targetWord": "Jealous",
            "distractorWords": [
                  "Proud",
                  "Supportive",
                  "Calm"
            ],
            "explanation": "Jealousy is an unhappy feeling when envying others."
      },
      {
            "id": "wf_g8_e_40",
            "cluePrompt": "Hook refusing to change your opinion even when you might be wrong",
            "clueCategory": "Personality",
            "targetWord": "Stubborn",
            "distractorWords": [
                  "Easygoing",
                  "Polite",
                  "Flexible"
            ],
            "explanation": "Stubborn people stick firmly to their viewpoint."
      }
],
    medium: [
      {
            "id": "wf_g8_m_01",
            "cluePrompt": "Hook an all-inclusive holiday hotel where food and drinks are included in the price",
            "clueCategory": "Tourism",
            "targetWord": "All-inclusive",
            "distractorWords": [
                  "Room only",
                  "Self-service",
                  "Takeaway"
            ],
            "explanation": "All-inclusive resorts provide meals, drinks, and activities."
      },
      {
            "id": "wf_g8_m_02",
            "cluePrompt": "Hook ancient stone ruins from civilisations that lived thousands of years ago",
            "clueCategory": "Tourism",
            "targetWord": "Ancient ruins",
            "distractorWords": [
                  "Modern malls",
                  "Skyscrapers",
                  "Highways"
            ],
            "explanation": "Ancient ruins like Ephesus show how ancestors lived long ago."
      },
      {
            "id": "wf_g8_m_03",
            "cluePrompt": "Hook a place where travellers stay overnight on holiday, like a hotel or hostel",
            "clueCategory": "Tourism",
            "targetWord": "Accommodation",
            "distractorWords": [
                  "Transportation",
                  "Souvenir",
                  "Itinerary"
            ],
            "explanation": "Accommodation means lodging where tourists sleep."
      },
      {
            "id": "wf_g8_m_04",
            "cluePrompt": "Hook the daily travel plan and list of sights a tourist will visit",
            "clueCategory": "Tourism",
            "targetWord": "Itinerary",
            "distractorWords": [
                  "Passport",
                  "Receipt",
                  "Ticket"
            ],
            "explanation": "An itinerary schedules places to see on each day of a trip."
      },
      {
            "id": "wf_g8_m_05",
            "cluePrompt": "Hook a famous building or tower in a city that everyone recognizes easily",
            "clueCategory": "Tourism",
            "targetWord": "Landmark",
            "distractorWords": [
                  "Subway",
                  "Alley",
                  "Sidewalk"
            ],
            "explanation": "Landmarks like Galata Tower or the Eiffel Tower are famous symbols."
      },
      {
            "id": "wf_g8_m_06",
            "cluePrompt": "Hook the final city or holiday spot where your journey ends",
            "clueCategory": "Tourism",
            "targetWord": "Destination",
            "distractorWords": [
                  "Departure",
                  "Transit",
                  "Station"
            ],
            "explanation": "Your destination is the place you are travelling to reach."
      },
      {
            "id": "wf_g8_m_07",
            "cluePrompt": "Hook traditional dishes and foods famous in a specific city or country",
            "clueCategory": "Tourism",
            "targetWord": "Local cuisine",
            "distractorWords": [
                  "Fast food",
                  "Junk food",
                  "Snacks"
            ],
            "explanation": "Local cuisine reflects regional cooking traditions and spices."
      },
      {
            "id": "wf_g8_m_08",
            "cluePrompt": "Hook touring around a new city to see its famous sights, monuments, and parks",
            "clueCategory": "Tourism",
            "targetWord": "Sightseeing",
            "distractorWords": [
                  "Shopping",
                  "Commuting",
                  "Sleeping"
            ],
            "explanation": "Sightseeing means visiting famous architectural and historical sights."
      },
      {
            "id": "wf_g8_m_09",
            "cluePrompt": "Hook the guide who shows tourists around historic sites and explains their stories",
            "clueCategory": "Tourism",
            "targetWord": "Tour guide",
            "distractorWords": [
                  "Driver",
                  "Pilot",
                  "Ticket agent"
            ],
            "explanation": "Tour guides explain history and culture to tourists."
      },
      {
            "id": "wf_g8_m_10",
            "cluePrompt": "Hook the sweeping view of green hills, mountains, and trees in nature",
            "clueCategory": "Nature",
            "targetWord": "Landscape",
            "distractorWords": [
                  "Ceiling",
                  "Basement",
                  "Backyard"
            ],
            "explanation": "A landscape is a beautiful panoramic view of natural scenery."
      },
      {
            "id": "wf_g8_m_11",
            "cluePrompt": "Hook cleaning the carpets and rugs using an electric suction machine",
            "clueCategory": "Chores",
            "targetWord": "Vacuum the floor",
            "distractorWords": [
                  "Wash dishes",
                  "Make bed",
                  "Water plants"
            ],
            "explanation": "Vacuuming lifts dirt and dust out of carpets."
      },
      {
            "id": "wf_g8_m_12",
            "cluePrompt": "Hook smoothing out wrinkles on clean shirts and trousers with a hot iron",
            "clueCategory": "Chores",
            "targetWord": "Do the ironing",
            "distractorWords": [
                  "Mop floor",
                  "Dust shelf",
                  "Take out trash"
            ],
            "explanation": "Ironing uses heat and steam to make garments neat."
      },
      {
            "id": "wf_g8_m_13",
            "cluePrompt": "Hook putting plates, glasses, forks, and napkins on the dining table before dinner",
            "clueCategory": "Chores",
            "targetWord": "Set the table",
            "distractorWords": [
                  "Clear table",
                  "Wash floor",
                  "Dry dishes"
            ],
            "explanation": "Setting the table prepares place settings for dinner guests."
      },
      {
            "id": "wf_g8_m_14",
            "cluePrompt": "Hook putting dirty dinner plates and cutlery into the dishwashing machine",
            "clueCategory": "Chores",
            "targetWord": "Load the dishwasher",
            "distractorWords": [
                  "Empty bins",
                  "Clean oven",
                  "Mop kitchen"
            ],
            "explanation": "Loading the dishwasher packs dishes into racks for cleaning."
      },
      {
            "id": "wf_g8_m_15",
            "cluePrompt": "Hook taking the kitchen garbage bags out to the big rubbish bin outside",
            "clueCategory": "Chores",
            "targetWord": "Take out the trash",
            "distractorWords": [
                  "Feed the cat",
                  "Sweep patio",
                  "Wash car"
            ],
            "explanation": "Taking out trash removes household rubbish bags."
      },
      {
            "id": "wf_g8_m_16",
            "cluePrompt": "Hook wiping away gray dust particles from wooden desks and bookshelves",
            "clueCategory": "Chores",
            "targetWord": "Dust the furniture",
            "distractorWords": [
                  "Scrub floor",
                  "Paint wall",
                  "Wash sheets"
            ],
            "explanation": "Dusting clears away fine dust from wooden tables."
      },
      {
            "id": "wf_g8_m_17",
            "cluePrompt": "Hook washing dirty shirts, trousers, and socks in the washing machine",
            "clueCategory": "Chores",
            "targetWord": "Do the laundry",
            "distractorWords": [
                  "Iron clothes",
                  "Fold towels",
                  "Sew buttons"
            ],
            "explanation": "Doing laundry washes dirty clothing clean."
      },
      {
            "id": "wf_g8_m_18",
            "cluePrompt": "Hook a personal duty or chore that you are responsible for doing regularly",
            "clueCategory": "Values",
            "targetWord": "Responsibility",
            "distractorWords": [
                  "Hobby",
                  "Game",
                  "Reward"
            ],
            "explanation": "A responsibility is a duty you take care of faithfully."
      },
      {
            "id": "wf_g8_m_19",
            "cluePrompt": "Hook a bedroom that is organized, clean, and free of messy clutter",
            "clueCategory": "Home",
            "targetWord": "Neat and tidy",
            "distractorWords": [
                  "Messy",
                  "Disorderly",
                  "Dirty"
            ],
            "explanation": "A neat and tidy bedroom has everything organized in place."
      },
      {
            "id": "wf_g8_m_20",
            "cluePrompt": "Hook clearing away plates and glasses from the table after finishing dinner",
            "clueCategory": "Chores",
            "targetWord": "Clear the table",
            "distractorWords": [
                  "Set the table",
                  "Cook dinner",
                  "Make salad"
            ],
            "explanation": "Clearing the table takes dirty dishes to the kitchen sink."
      },
      {
            "id": "wf_g8_m_21",
            "cluePrompt": "Hook jumping out of an airplane with a parachute for a sky-high thrill",
            "clueCategory": "Extreme Sports",
            "targetWord": "Skydiving",
            "distractorWords": [
                  "Swimming",
                  "Jogging",
                  "Cycling"
            ],
            "explanation": "Skydiving involves jumping from a plane before opening a parachute."
      },
      {
            "id": "wf_g8_m_22",
            "cluePrompt": "Hook leaping off a tall bridge attached to a strong, stretchy rubber rope",
            "clueCategory": "Extreme Sports",
            "targetWord": "Bungee jumping",
            "distractorWords": [
                  "High jump",
                  "Diving",
                  "Parkour"
            ],
            "explanation": "Bungee jumping lets thrill-seekers bounce on elastic cords."
      },
      {
            "id": "wf_g8_m_23",
            "cluePrompt": "Hook swimming deep underwater wearing an oxygen tank and breathing mask",
            "clueCategory": "Sports",
            "targetWord": "Scuba diving",
            "distractorWords": [
                  "Snorkelling",
                  "Surfing",
                  "Rowing"
            ],
            "explanation": "Scuba divers carry pressurized air tanks to explore reefs."
      },
      {
            "id": "wf_g8_m_24",
            "cluePrompt": "Hook soaring through the sky strapped under a wide fabric glider wing",
            "clueCategory": "Extreme Sports",
            "targetWord": "Paragliding",
            "distractorWords": [
                  "Skating",
                  "Skiing",
                  "Rafting"
            ],
            "explanation": "Paragliders launch from mountain slopes and float on thermals."
      },
      {
            "id": "wf_g8_m_25",
            "cluePrompt": "Hook a burst of heart-racing excitement and adventure during extreme sports",
            "clueCategory": "Feelings",
            "targetWord": "Adrenaline rush",
            "distractorWords": [
                  "Tiredness",
                  "Boredom",
                  "Sadness"
            ],
            "explanation": "An adrenaline rush is an energetic surge of excitement."
      },
      {
            "id": "wf_g8_m_26",
            "cluePrompt": "Hook someone who seeks adventure and exciting challenges",
            "clueCategory": "Personality",
            "targetWord": "Adventurous",
            "distractorWords": [
                  "Lazy",
                  "Timid",
                  "Boring"
            ],
            "explanation": "Adventurous people love exploring new and thrilling activities."
      },
      {
            "id": "wf_g8_m_27",
            "cluePrompt": "Hook strong straps wrapped around your body to keep you safe while climbing",
            "clueCategory": "Safety",
            "targetWord": "Harness",
            "distractorWords": [
                  "Belt",
                  "Ribbon",
                  "Scarf"
            ],
            "explanation": "A climbing harness clips into safety ropes to prevent falls."
      },
      {
            "id": "wf_g8_m_28",
            "cluePrompt": "Hook the wooden pole with a flat blade used to row and steer a raft",
            "clueCategory": "Equipment",
            "targetWord": "Paddle",
            "distractorWords": [
                  "Stick",
                  "Ruler",
                  "Bat"
            ],
            "explanation": "Paddles help rafters steer through white-water waves."
      },
      {
            "id": "wf_g8_m_29",
            "cluePrompt": "Hook a thick foam jacket you wear on boats to stay afloat in water",
            "clueCategory": "Safety",
            "targetWord": "Life jacket",
            "distractorWords": [
                  "Raincoat",
                  "Winter coat",
                  "Sweater"
            ],
            "explanation": "Life jackets keep swimmers safely floating in water."
      },
      {
            "id": "wf_g8_m_30",
            "cluePrompt": "Hook creating a brand new device or tool that nobody ever built before",
            "clueCategory": "Science",
            "targetWord": "Invention",
            "distractorWords": [
                  "Imitation",
                  "Copy",
                  "Mistake"
            ],
            "explanation": "Inventions are original mechanical or technological creations."
      },
      {
            "id": "wf_g8_m_31",
            "cluePrompt": "Hook finding or uncovering something in nature that was previously unknown",
            "clueCategory": "Science",
            "targetWord": "Discovery",
            "distractorWords": [
                  "Secret",
                  "Invention",
                  "Plan"
            ],
            "explanation": "Discoveries uncover existing natural wonders, like fossils or islands."
      },
      {
            "id": "wf_g8_m_32",
            "cluePrompt": "Hook the special room equipped with beakers and test tubes where scientists work",
            "clueCategory": "Science",
            "targetWord": "Laboratory",
            "distractorWords": [
                  "Library",
                  "Auditorium",
                  "Greenhouse"
            ],
            "explanation": "Scientists run safe experiments inside laboratories."
      },
      {
            "id": "wf_g8_m_33",
            "cluePrompt": "Hook an expert who studies natural science and discovers how things work",
            "clueCategory": "Jobs",
            "targetWord": "Scientist",
            "distractorWords": [
                  "Politician",
                  "Lawyer",
                  "Accountant"
            ],
            "explanation": "Scientists study physics, biology, and chemistry to discover facts."
      },
      {
            "id": "wf_g8_m_34",
            "cluePrompt": "Hook a treatment or medicine that heals a disease completely",
            "clueCategory": "Medicine",
            "targetWord": "Cure",
            "distractorWords": [
                  "Wound",
                  "Symptom",
                  "Fever"
            ],
            "explanation": "A cure restores a patient back to full health."
      },
      {
            "id": "wf_g8_m_35",
            "cluePrompt": "Hook an injection given to protect children from catching serious viral illnesses",
            "clueCategory": "Medicine",
            "targetWord": "Vaccine",
            "distractorWords": [
                  "Vitamin",
                  "Bandage",
                  "Lotion"
            ],
            "explanation": "Vaccines build strong immunity against dangerous viruses."
      },
      {
            "id": "wf_g8_m_36",
            "cluePrompt": "Hook artificial metal probes launched into outer space to orbit Earth and send TV signals",
            "clueCategory": "Space",
            "targetWord": "Satellite",
            "distractorWords": [
                  "Asteroid",
                  "Meteor",
                  "Comet"
            ],
            "explanation": "Satellites orbit Earth relaying GPS and weather data."
      },
      {
            "id": "wf_g8_m_37",
            "cluePrompt": "Hook a vehicle designed to carry astronauts into outer space",
            "clueCategory": "Space",
            "targetWord": "Spacecraft",
            "distractorWords": [
                  "Submarine",
                  "Helicopter",
                  "Cruiser"
            ],
            "explanation": "Spacecraft rocket past Earth's atmosphere into space."
      },
      {
            "id": "wf_g8_m_38",
            "cluePrompt": "Hook a small emergency kit with bandages, antiseptic, and plasters for injuries",
            "clueCategory": "Safety",
            "targetWord": "First-aid kit",
            "distractorWords": [
                  "Toolbox",
                  "Sewing box",
                  "Lunchbox"
            ],
            "explanation": "A first-aid kit treats small cuts and injuries quickly."
      },
      {
            "id": "wf_g8_m_39",
            "cluePrompt": "Hook a safe, sturdy building where families go for protection during a storm",
            "clueCategory": "Safety",
            "targetWord": "Shelter",
            "distractorWords": [
                  "Shed",
                  "Barn",
                  "Garage"
            ],
            "explanation": "Emergency shelters protect people during bad storms."
      },
      {
            "id": "wf_g8_m_40",
            "cluePrompt": "Hook moving people away from a dangerous flood area to a safe place",
            "clueCategory": "Safety",
            "targetWord": "Evacuate",
            "distractorWords": [
                  "Return",
                  "Stay",
                  "Ignore"
            ],
            "explanation": "Evacuating moves people out of danger to safety."
      }
],
    hard: [
      {
            "id": "wf_g8_h_01",
            "cluePrompt": "Hook a sudden violent shaking of the ground caused by shifts in Earth's crust",
            "clueCategory": "Disasters",
            "targetWord": "Earthquake",
            "distractorWords": [
                  "Flood",
                  "Drought",
                  "Hurricane"
            ],
            "explanation": "An earthquake shakes the ground when tectonic plates move."
      },
      {
            "id": "wf_g8_h_02",
            "cluePrompt": "Hook a huge overflow of water that covers streets and houses after heavy rain",
            "clueCategory": "Disasters",
            "targetWord": "Flood",
            "distractorWords": [
                  "Drought",
                  "Wildfire",
                  "Snowstorm"
            ],
            "explanation": "Floods happen when heavy rain causes rivers to overflow."
      },
      {
            "id": "wf_g8_h_03",
            "cluePrompt": "Hook a long period with no rain where lakes dry up and crops cannot grow",
            "clueCategory": "Disasters",
            "targetWord": "Drought",
            "distractorWords": [
                  "Flood",
                  "Thunder",
                  "Blizzard"
            ],
            "explanation": "A drought is a prolonged lack of rain that dries out rivers."
      },
      {
            "id": "wf_g8_h_04",
            "cluePrompt": "Hook a huge mass of snow and ice tumbling rapidly down a steep mountain",
            "clueCategory": "Disasters",
            "targetWord": "Avalanche",
            "distractorWords": [
                  "Earthquake",
                  "Tornado",
                  "Wildfire"
            ],
            "explanation": "Avalanches roar down snowy alpine mountainsides."
      },
      {
            "id": "wf_g8_h_05",
            "cluePrompt": "Hook a spinning funnel of fierce wind that sweeps across land like a whirlwind",
            "clueCategory": "Disasters",
            "targetWord": "Tornado",
            "distractorWords": [
                  "Fog",
                  "Drizzle",
                  "Breeze"
            ],
            "explanation": "A tornado is a violently spinning column of air."
      },
      {
            "id": "wf_g8_h_06",
            "cluePrompt": "Hook a massive ocean wave triggered by undersea earthquakes that hits the coast",
            "clueCategory": "Disasters",
            "targetWord": "Tsunami",
            "distractorWords": [
                  "Riptide",
                  "High tide",
                  "River"
            ],
            "explanation": "Tsunamis are gigantic waves caused by underwater tremors."
      },
      {
            "id": "wf_g8_h_07",
            "cluePrompt": "Hook a dangerous fire that spreads quickly across dry forest trees and brush",
            "clueCategory": "Disasters",
            "targetWord": "Wildfire",
            "distractorWords": [
                  "Campfire",
                  "Candle",
                  "Bonfire"
            ],
            "explanation": "Wildfires consume forest timber fueled by hot winds."
      },
      {
            "id": "wf_g8_h_08",
            "cluePrompt": "Hook rocks and earth sliding suddenly down a steep hillside after rain",
            "clueCategory": "Disasters",
            "targetWord": "Landslide",
            "distractorWords": [
                  "Earthquake",
                  "Drought",
                  "Flood"
            ],
            "explanation": "Landslides slide wet mud and rocks down hills."
      },
      {
            "id": "wf_g8_h_09",
            "cluePrompt": "Hook saving people or animals from danger after a natural disaster",
            "clueCategory": "Safety",
            "targetWord": "Rescue",
            "distractorWords": [
                  "Harm",
                  "Damage",
                  "Ignore"
            ],
            "explanation": "Rescue teams save people trapped after an emergency."
      },
      {
            "id": "wf_g8_h_10",
            "cluePrompt": "Hook a person who stays alive after living through a terrible accident",
            "clueCategory": "Safety",
            "targetWord": "Survivor",
            "distractorWords": [
                  "Casualty",
                  "Witness",
                  "Bystander"
            ],
            "explanation": "A survivor lives through a catastrophe safely."
      },
      {
            "id": "wf_g8_h_11",
            "cluePrompt": "Hook harm or broken destruction caused to houses by a fierce storm",
            "clueCategory": "Safety",
            "targetWord": "Damage",
            "distractorWords": [
                  "Repair",
                  "Protection",
                  "Comfort"
            ],
            "explanation": "Storms can cause severe damage to roofs and trees."
      },
      {
            "id": "wf_g8_h_12",
            "cluePrompt": "Hook an unexpected dangerous situation like an accident that needs fast action",
            "clueCategory": "Safety",
            "targetWord": "Emergency",
            "distractorWords": [
                  "Routine",
                  "Party",
                  "Holiday"
            ],
            "explanation": "An emergency requires urgent help from firefighters or doctors."
      },
      {
            "id": "wf_g8_h_13",
            "cluePrompt": "Hook giving helpful suggestions to a friend to help them solve a dilemma",
            "clueCategory": "Friendship",
            "targetWord": "Advice",
            "distractorWords": [
                  "Criticism",
                  "Insult",
                  "Complaint"
            ],
            "explanation": "Good friends give wise, encouraging advice when asked."
      },
      {
            "id": "wf_g8_h_14",
            "cluePrompt": "Hook liking one thing more than another, like preferring tea over coffee",
            "clueCategory": "Preferences",
            "targetWord": "Prefer",
            "distractorWords": [
                  "Dislike",
                  "Hate",
                  "Refuse"
            ],
            "explanation": "To prefer means to like one option better than another."
      },
      {
            "id": "wf_g8_h_15",
            "cluePrompt": "Hook protecting nature, wild animals, and clean oceans from harm",
            "clueCategory": "Environment",
            "targetWord": "Protect",
            "distractorWords": [
                  "Pollute",
                  "Destroy",
                  "Litter"
            ],
            "explanation": "Protecting our planet preserves clean air and wildlife."
      },
      {
            "id": "wf_g8_h_16",
            "cluePrompt": "Hook working stubbornly toward your dreams and not giving up when tasks get tough",
            "clueCategory": "Mindset",
            "targetWord": "Perseverance",
            "distractorWords": [
                  "Giving up",
                  "Laziness",
                  "Carelessness"
            ],
            "explanation": "Perseverance means keeping on trying until you succeed."
      },
      {
            "id": "wf_g8_h_17",
            "cluePrompt": "Hook wanting to learn more, asking good questions, and exploring new ideas",
            "clueCategory": "Mindset",
            "targetWord": "Curious",
            "distractorWords": [
                  "Bored",
                  "Lazy",
                  "Indifferent"
            ],
            "explanation": "Curious students love discovering how things work."
      },
      {
            "id": "wf_g8_h_18",
            "cluePrompt": "Hook waiting calmly without getting angry when something takes time",
            "clueCategory": "Personality",
            "targetWord": "Patient",
            "distractorWords": [
                  "Impatient",
                  "Angry",
                  "Rude"
            ],
            "explanation": "Patient people remain calm even when queues are long."
      },
      {
            "id": "wf_g8_h_19",
            "cluePrompt": "Hook having strong dreams and working hard to achieve high future goals",
            "clueCategory": "Personality",
            "targetWord": "Ambitious",
            "distractorWords": [
                  "Lazy",
                  "Hopeless",
                  "Timid"
            ],
            "explanation": "Ambitious students set high goals for high school and beyond."
      },
      {
            "id": "wf_g8_h_20",
            "cluePrompt": "Hook someone you can count on and who will never let you down",
            "clueCategory": "Personality",
            "targetWord": "Trustworthy",
            "distractorWords": [
                  "Dishonest",
                  "Sneaky",
                  "Selfish"
            ],
            "explanation": "Trustworthy friends can be trusted with any secret."
      },
      {
            "id": "wf_g8_h_21",
            "cluePrompt": "Hook energy from wind or sunshine that never runs out or causes pollution",
            "clueCategory": "Environment",
            "targetWord": "Renewable energy",
            "distractorWords": [
                  "Fossil fuels",
                  "Coal",
                  "Gas"
            ],
            "explanation": "Renewable energy like solar and wind power never runs out."
      },
      {
            "id": "wf_g8_h_22",
            "cluePrompt": "Hook friendly to nature and not causing harm to the environment",
            "clueCategory": "Environment",
            "targetWord": "Eco-friendly",
            "distractorWords": [
                  "Toxic",
                  "Polluting",
                  "Wasteful"
            ],
            "explanation": "Eco-friendly products protect clean air and wildlife."
      },
      {
            "id": "wf_g8_h_23",
            "cluePrompt": "Hook helping your community or school without asking for money",
            "clueCategory": "Values",
            "targetWord": "Volunteer",
            "distractorWords": [
                  "Employer",
                  "Customer",
                  "Buyer"
            ],
            "explanation": "Volunteers give their free time generously to help others."
      },
      {
            "id": "wf_g8_h_24",
            "cluePrompt": "Hook reaching an agreement where both sides give up a small wish to make peace",
            "clueCategory": "Social",
            "targetWord": "Compromise",
            "distractorWords": [
                  "Argument",
                  "Fight",
                  "Conflict"
            ],
            "explanation": "A compromise settles a disagreement fairly for both sides."
      },
      {
            "id": "wf_g8_h_25",
            "cluePrompt": "Hook a wonderful breakthrough discovery that solves a difficult medical puzzle",
            "clueCategory": "Science",
            "targetWord": "Breakthrough",
            "distractorWords": [
                  "Mistake",
                  "Problem",
                  "Failure"
            ],
            "explanation": "A scientific breakthrough opens up exciting new treatments."
      },
      {
            "id": "wf_g8_h_26",
            "cluePrompt": "Hook the result or outcome that happens after making a bad decision",
            "clueCategory": "Values",
            "targetWord": "Consequence",
            "distractorWords": [
                  "Reward",
                  "Gift",
                  "Prize"
            ],
            "explanation": "Every action has consequences we must take responsibility for."
      },
      {
            "id": "wf_g8_h_27",
            "cluePrompt": "Hook facts, proof, and clues that show whether a statement is true",
            "clueCategory": "Skills",
            "targetWord": "Evidence",
            "distractorWords": [
                  "Rumor",
                  "Gossip",
                  "Guess"
            ],
            "explanation": "Scientists look for factual evidence to prove ideas."
      },
      {
            "id": "wf_g8_h_28",
            "cluePrompt": "Hook unity and mutual support among classmates during hard times",
            "clueCategory": "Values",
            "targetWord": "Solidarity",
            "distractorWords": [
                  "Division",
                  "Discord",
                  "Conflict"
            ],
            "explanation": "Solidarity means standing together in harmony and mutual support."
      },
      {
            "id": "wf_g8_h_29",
            "cluePrompt": "Hook looking after historic monuments and ancient relics so they last forever",
            "clueCategory": "Culture",
            "targetWord": "Preservation",
            "distractorWords": [
                  "Demolition",
                  "Destruction",
                  "Damage"
            ],
            "explanation": "Preservation protects old castles and monuments from decay."
      },
      {
            "id": "wf_g8_h_30",
            "cluePrompt": "Hook the variety of different birds, animals, and plants living in a forest",
            "clueCategory": "Nature",
            "targetWord": "Wildlife variety",
            "distractorWords": [
                  "Desert",
                  "Concrete",
                  "Factory"
            ],
            "explanation": "A healthy forest has a rich variety of wild plants and animals."
      },
      {
            "id": "wf_g8_h_31",
            "cluePrompt": "Hook acting honestly and doing what is right even when nobody is watching",
            "clueCategory": "Values",
            "targetWord": "Integrity",
            "distractorWords": [
                  "Dishonesty",
                  "Cheating",
                  "Lying"
            ],
            "explanation": "Integrity means being honest and true to your values at all times."
      },
      {
            "id": "wf_g8_h_32",
            "cluePrompt": "Hook the ability to bounce back and stay cheerful after facing a setback",
            "clueCategory": "Mindset",
            "targetWord": "Resilience",
            "distractorWords": [
                  "Surrender",
                  "Weakness",
                  "Panic"
            ],
            "explanation": "Resilient students bounce back with a smile after losing a game."
      },
      {
            "id": "wf_g8_h_33",
            "cluePrompt": "Hook deep kindness and caring for others who are hurt or having a hard day",
            "clueCategory": "Values",
            "targetWord": "Compassion",
            "distractorWords": [
                  "Cruelty",
                  "Coldness",
                  "Spite"
            ],
            "explanation": "Compassion is showing gentle caring and sympathy to friends in need."
      },
      {
            "id": "wf_g8_h_34",
            "cluePrompt": "Hook having modest humility and not boasting about your test scores",
            "clueCategory": "Personality",
            "targetWord": "Modest",
            "distractorWords": [
                  "Boastful",
                  "Arrogant",
                  "Proud"
            ],
            "explanation": "Modest winners celebrate quietly without showing off."
      },
      {
            "id": "wf_g8_h_35",
            "cluePrompt": "Hook being open to new ideas and respecting opinions different from your own",
            "clueCategory": "Mindset",
            "targetWord": "Open-minded",
            "distractorWords": [
                  "Stubborn",
                  "Narrow-minded",
                  "Intolerant"
            ],
            "explanation": "Open-minded learners listen respectfully to new viewpoints."
      },
      {
            "id": "wf_g8_h_36",
            "cluePrompt": "Hook speaking clearly, smoothly, and expressing your thoughts persuasively",
            "clueCategory": "Communication",
            "targetWord": "Fluent",
            "distractorWords": [
                  "Mumbled",
                  "Silent",
                  "Confused"
            ],
            "explanation": "Fluent English speakers speak naturally and comfortably."
      },
      {
            "id": "wf_g8_h_37",
            "cluePrompt": "Hook an early test model made by inventors before building the final machine",
            "clueCategory": "Engineering",
            "targetWord": "Prototype",
            "distractorWords": [
                  "Toy",
                  "Drawing",
                  "Waste"
            ],
            "explanation": "Inventors test a prototype to fix problems before making more."
      },
      {
            "id": "wf_g8_h_38",
            "cluePrompt": "Hook automated mechanical machines built to help doctors or explore Mars",
            "clueCategory": "Technology",
            "targetWord": "Robots",
            "distractorWords": [
                  "Statues",
                  "Tools",
                  "Furniture"
            ],
            "explanation": "Robots are automated machines that perform useful tasks."
      },
      {
            "id": "wf_g8_h_39",
            "cluePrompt": "Hook the set of rules or democratic laws that protect citizens' freedoms",
            "clueCategory": "Civics",
            "targetWord": "Constitution",
            "distractorWords": [
                  "Bill",
                  "Tax",
                  "Notice"
            ],
            "explanation": "The constitution is the supreme law that protects citizens' rights."
      },
      {
            "id": "wf_g8_h_40",
            "cluePrompt": "Hook a system where citizens choose their leaders through democratic voting",
            "clueCategory": "Civics",
            "targetWord": "Democracy",
            "distractorWords": [
                  "Monarchy",
                  "Empire",
                  "Dynasty"
            ],
            "explanation": "In a democracy, citizens vote to choose their representatives."
      }
],
  },
};
