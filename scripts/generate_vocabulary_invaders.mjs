import fs from 'fs';
import path from 'path';

// GRADE 7 EASY (40 items)
const g7_easy = [
  {
    id: 'vi_g7_e_01',
    prompt: 'Blast the word for: "A person who always tells the truth and never lies"',
    targetWord: 'Honest',
    distractorWords: ['Stubborn', 'Clumsy', 'Selfish'],
    wordCategory: 'Personality Traits',
    explanation: 'An honest person is truthful and sincere.'
  },
  {
    id: 'vi_g7_e_02',
    prompt: 'Blast the word for: "Someone who likes giving presents and sharing things"',
    targetWord: 'Generous',
    distractorWords: ['Mean', 'Shy', 'Greedy'],
    wordCategory: 'Personality Traits',
    explanation: 'Generous means willing to give or share freely.'
  },
  {
    id: 'vi_g7_e_03',
    prompt: 'Blast the word for: "A person who always arrives exactly on time"',
    targetWord: 'Punctual',
    distractorWords: ['Late', 'Lazy', 'Forgetful'],
    wordCategory: 'Personality Traits',
    explanation: 'Punctual means doing something at the agreed or proper time.'
  },
  {
    id: 'vi_g7_e_04',
    prompt: 'Blast the word for: "The sport where athletes shoot arrows with a bow"',
    targetWord: 'Archery',
    distractorWords: ['Tennis', 'Cricket', 'Boxing'],
    wordCategory: 'Sports',
    explanation: 'Archery is the sport of shooting arrows with a bow.'
  },
  {
    id: 'vi_g7_e_05',
    prompt: 'Blast the gold, silver, or bronze award given to sport winners',
    targetWord: 'Medal',
    distractorWords: ['Helmet', 'Racket', 'Net'],
    wordCategory: 'Sports',
    explanation: 'A medal is a small metal disc given as an award in competitions.'
  },
  {
    id: 'vi_g7_e_06',
    prompt: 'Blast the word for: "The story of a real person\'s life written by someone else"',
    targetWord: 'Biography',
    distractorWords: ['Poem', 'Novel', 'Cartoon'],
    wordCategory: 'Biographies',
    explanation: 'A biography is an account of someone\'s life written by another person.'
  },
  {
    id: 'vi_g7_e_07',
    prompt: 'Blast the word for: "Animals that feed only on meat, like tigers and lions"',
    targetWord: 'Carnivores',
    distractorWords: ['Herbivores', 'Insects', 'Plants'],
    wordCategory: 'Wild Animals',
    explanation: 'Carnivores are meat-eating predators.'
  },
  {
    id: 'vi_g7_e_08',
    prompt: 'Blast the word for: "An animal species that has completely died out"',
    targetWord: 'Extinct',
    distractorWords: ['Endangered', 'Alive', 'Domestic'],
    wordCategory: 'Wild Animals',
    explanation: 'Extinct means no longer in existence anywhere on Earth.'
  },
  {
    id: 'vi_g7_e_09',
    prompt: 'Blast the word for: "An educational film about nature, science, or real facts"',
    targetWord: 'Documentary',
    distractorWords: ['Sitcom', 'Soap Opera', 'Commercial'],
    wordCategory: 'Television',
    explanation: 'A documentary provides factual information about real events or nature.'
  },
  {
    id: 'vi_g7_e_10',
    prompt: 'Blast the word for: "A television advertisement promoting products"',
    targetWord: 'Commercial',
    distractorWords: ['News', 'Series', 'Talk Show'],
    wordCategory: 'Television',
    explanation: 'A commercial is a broadcast advertisement.'
  },
  {
    id: 'vi_g7_e_11',
    prompt: 'Blast the printed card you send to invite friends to a party',
    targetWord: 'Invitation',
    distractorWords: ['Menu', 'Receipt', 'Ticket'],
    wordCategory: 'Celebrations',
    explanation: 'An invitation is a written or printed request inviting someone to an event.'
  },
  {
    id: 'vi_g7_e_12',
    prompt: 'Blast the decorative wax sticks with fire placed on a birthday cake',
    targetWord: 'Candles',
    distractorWords: ['Balloons', 'Napkins', 'Ribbons'],
    wordCategory: 'Celebrations',
    explanation: 'Candles are lit on birthday cakes before making a wish.'
  },
  {
    id: 'vi_g7_e_13',
    prompt: 'Blast the word for: "To say what you think will happen in the future"',
    targetWord: 'Predict',
    distractorWords: ['Remember', 'Forget', 'Regret'],
    wordCategory: 'Dreams & Future',
    explanation: 'Predict means to forecast or estimate future events.'
  },
  {
    id: 'vi_g7_e_14',
    prompt: 'Blast the word for: "Calm, without wars, conflicts, or violence"',
    targetWord: 'Peaceful',
    distractorWords: ['Noisy', 'Dangerous', 'Crowded'],
    wordCategory: 'Dreams & Future',
    explanation: 'Peaceful describes a state free from disturbance or war.'
  },
  {
    id: 'vi_g7_e_15',
    prompt: 'Blast the shop where you buy fresh bread, rolls, and bagels',
    targetWord: 'Bakery',
    distractorWords: ['Chemist', 'Butcher', 'Library'],
    wordCategory: 'Public Buildings',
    explanation: 'A bakery is a shop where bread and pastries are baked and sold.'
  },
  {
    id: 'vi_g7_e_16',
    prompt: 'Blast the shop where you buy medicines and painkiller tablets',
    targetWord: 'Chemist',
    distractorWords: ['Museum', 'Post Office', 'Cinema'],
    wordCategory: 'Public Buildings',
    explanation: 'A chemist\'s or pharmacy sells prescription medicine and healthcare items.'
  },
  {
    id: 'vi_g7_e_17',
    prompt: 'Blast the eco-friendly process of converting waste into reusable materials',
    targetWord: 'Recycle',
    distractorWords: ['Pollute', 'Burn', 'Waste'],
    wordCategory: 'Environment',
    explanation: 'Recycling converts discarded materials into fresh, reusable products.'
  },
  {
    id: 'vi_g7_e_18',
    prompt: 'Blast the harmful substances contaminating air, water, and soil',
    targetWord: 'Pollution',
    distractorWords: ['Oxygen', 'Rainfall', 'Nature'],
    wordCategory: 'Environment',
    explanation: 'Pollution is the introduction of contaminants into the natural environment.'
  },
  {
    id: 'vi_g7_e_19',
    prompt: 'Blast the curved orbital path one celestial body takes around another',
    targetWord: 'Orbit',
    distractorWords: ['Planet', 'Galaxy', 'Crater'],
    wordCategory: 'Planets',
    explanation: 'An orbit is the curved path of a celestial body around a star or planet.'
  },
  {
    id: 'vi_g7_e_20',
    prompt: 'Blast the optical instrument astronomers use to observe distant stars',
    targetWord: 'Telescope',
    distractorWords: ['Microscope', 'Compass', 'Thermometer'],
    wordCategory: 'Planets',
    explanation: 'A telescope magnifies distant astronomical objects in space.'
  },
  {
    id: 'vi_g7_e_21',
    prompt: 'Blast the word for: "Someone who drops or knocks things over easily"',
    targetWord: 'Clumsy',
    distractorWords: ['Graceful', 'Careful', 'Athletic'],
    wordCategory: 'Personality Traits',
    explanation: 'Clumsy means moving awkwardly and dropping or breaking things.'
  },
  {
    id: 'vi_g7_e_22',
    prompt: 'Blast the word for: "Someone who refuses to change their mind"',
    targetWord: 'Stubborn',
    distractorWords: ['Flexible', 'Easygoing', 'Polite'],
    wordCategory: 'Personality Traits',
    explanation: 'Stubborn means determined not to change one\'s opinion or attitude.'
  },
  {
    id: 'vi_g7_e_23',
    prompt: 'Blast the person who trains and instructs an athlete or team',
    targetWord: 'Coach',
    distractorWords: ['Referee', 'Spectator', 'Opponent'],
    wordCategory: 'Sports',
    explanation: 'A coach trains and directs sports players.'
  },
  {
    id: 'vi_g7_e_24',
    prompt: 'Blast the natural home or environment of an animal or plant',
    targetWord: 'Habitat',
    distractorWords: ['Cage', 'Zoo', 'Shelter'],
    wordCategory: 'Wild Animals',
    explanation: 'A habitat is the natural home or environment of a plant or animal.'
  },
  {
    id: 'vi_g7_e_25',
    prompt: 'Blast an animal that only eats plants and herbs, like deer and zebras',
    targetWord: 'Herbivore',
    distractorWords: ['Carnivore', 'Predator', 'Hunter'],
    wordCategory: 'Wild Animals',
    explanation: 'Herbivores feed purely on plants.'
  },
  {
    id: 'vi_g7_e_26',
    prompt: 'Blast a funny TV comedy series with funny situations and recurring characters',
    targetWord: 'Sitcom',
    distractorWords: ['Documentary', 'News', 'Drama'],
    wordCategory: 'Television',
    explanation: 'A sitcom (situational comedy) is a humorous episodic television show.'
  },
  {
    id: 'vi_g7_e_27',
    prompt: 'Blast the person invited to a party or gathering',
    targetWord: 'Guest',
    distractorWords: ['Host', 'Stranger', 'Clerk'],
    wordCategory: 'Celebrations',
    explanation: 'A guest is a person who is invited to visit someone\'s home or event.'
  },
  {
    id: 'vi_g7_e_28',
    prompt: 'Blast drinks of any kind, such as lemonade, juice, or soda',
    targetWord: 'Beverages',
    distractorWords: ['Snacks', 'Desserts', 'Plates'],
    wordCategory: 'Celebrations',
    explanation: 'Beverages are refreshing drinks other than plain water.'
  },
  {
    id: 'vi_g7_e_29',
    prompt: 'Blast a person trained to travel in a spacecraft into space',
    targetWord: 'Astronaut',
    distractorWords: ['Pilot', 'Sailor', 'Driver'],
    wordCategory: 'Dreams & Space',
    explanation: 'An astronaut travels and works in outer space.'
  },
  {
    id: 'vi_g7_e_30',
    prompt: 'Blast the public building where you can borrow books for free',
    targetWord: 'Library',
    distractorWords: ['Bookshop', 'Cinema', 'Theatre'],
    wordCategory: 'Public Buildings',
    explanation: 'A library lends books and educational media to the public.'
  },
  {
    id: 'vi_g7_e_31',
    prompt: 'Blast the building where historical objects and paintings are exhibited',
    targetWord: 'Museum',
    distractorWords: ['Hospital', 'Factory', 'Gym'],
    wordCategory: 'Public Buildings',
    explanation: 'A museum houses, preserves, and exhibits historical and artistic objects.'
  },
  {
    id: 'vi_g7_e_32',
    prompt: 'Blast clean energy produced directly from sunlight',
    targetWord: 'Solar Energy',
    distractorWords: ['Coal', 'Petroleum', 'Smoke'],
    wordCategory: 'Environment',
    explanation: 'Solar energy harnesses light and heat radiation from the sun.'
  },
  {
    id: 'vi_g7_e_33',
    prompt: 'Blast the force that pulls objects toward the centre of the Earth',
    targetWord: 'Gravity',
    distractorWords: ['Magnet', 'Friction', 'Speed'],
    wordCategory: 'Planets & Physics',
    explanation: 'Gravity is the universal force of attraction between masses.'
  },
  {
    id: 'vi_g7_e_34',
    prompt: 'Blast the hottest inner planet in our solar system, famous for dense clouds',
    targetWord: 'Venus',
    distractorWords: ['Mars', 'Jupiter', 'Neptune'],
    wordCategory: 'Planets',
    explanation: 'Venus is the hottest planet due to a runaway greenhouse effect.'
  },
  {
    id: 'vi_g7_e_35',
    prompt: 'Blast the sport played with rackets, a yellow ball, and a net',
    targetWord: 'Tennis',
    distractorWords: ['Football', 'Judo', 'Swimming'],
    wordCategory: 'Sports',
    explanation: 'Tennis is a racket sport played individually or in pairs.'
  },
  {
    id: 'vi_g7_e_36',
    prompt: 'Blast the ceremony celebrating successful completion of school or university',
    targetWord: 'Graduation',
    distractorWords: ['Wedding', 'Funeral', 'Election'],
    wordCategory: 'Biographies & Life',
    explanation: 'Graduation marks receiving an academic degree or school diploma.'
  },
  {
    id: 'vi_g7_e_37',
    prompt: 'Blast illegal hunters who kill protected wild animals for profit',
    targetWord: 'Poachers',
    distractorWords: ['Rangers', 'Zookeepers', 'Vets'],
    wordCategory: 'Wild Animals',
    explanation: 'Poachers are illegal hunters who slaughter endangered wildlife.'
  },
  {
    id: 'vi_g7_e_38',
    prompt: 'Blast the building where municipal mayors and civil administrators work',
    targetWord: 'City Hall',
    distractorWords: ['Fire Station', 'Airport', 'Post Office'],
    wordCategory: 'Public Buildings',
    explanation: 'City Hall (Municipality) is the administrative headquarters of local government.'
  },
  {
    id: 'vi_g7_e_39',
    prompt: 'Blast the large-scale cutting down and destruction of natural forests',
    targetWord: 'Deforestation',
    distractorWords: ['Plantation', 'Agriculture', 'Irrigation'],
    wordCategory: 'Environment',
    explanation: 'Deforestation is the permanent clearing of forested land.'
  },
  {
    id: 'vi_g7_e_40',
    prompt: 'Blast the fourth planet from the Sun, often called the Red Planet',
    targetWord: 'Mars',
    distractorWords: ['Earth', 'Saturn', 'Uranus'],
    wordCategory: 'Planets',
    explanation: 'Mars is known as the Red Planet because of iron oxide on its surface.'
  }
];

// GRADE 7 MEDIUM (40 items)
const g7_medium = [
  {
    id: 'vi_g7_m_01',
    prompt: 'Target the synonym for: "Friendly and enjoying being with other people"',
    targetWord: 'Outgoing',
    distractorWords: ['Shy', 'Introverted', 'Selfish'],
    wordCategory: 'Personality Traits',
    explanation: 'Outgoing describes someone who is socially confident and enthusiastic.'
  },
  {
    id: 'vi_g7_m_02',
    prompt: 'Target the trait: "Caring only about oneself and never sharing with others"',
    targetWord: 'Selfish',
    distractorWords: ['Generous', 'Kind', 'Honest'],
    wordCategory: 'Personality Traits',
    explanation: 'Selfish people care primarily about their own personal profit or pleasure.'
  },
  {
    id: 'vi_g7_m_03',
    prompt: 'Target the person watching a sporting event live in a stadium',
    targetWord: 'Spectator',
    distractorWords: ['Athlete', 'Referee', 'Opponent'],
    wordCategory: 'Sports',
    explanation: 'A spectator is someone who watches an event, especially a sports match.'
  },
  {
    id: 'vi_g7_m_04',
    prompt: 'Target the sports result when both teams finish with the exact same score',
    targetWord: 'Draw',
    distractorWords: ['Victory', 'Defeat', 'Foul'],
    wordCategory: 'Sports',
    explanation: 'A draw or tie occurs when teams finish with equal points.'
  },
  {
    id: 'vi_g7_m_05',
    prompt: 'Target the word for: "An exceptionally talented person with extraordinary intellect"',
    targetWord: 'Genius',
    distractorWords: ['Novice', 'Amateur', 'Apprentice'],
    wordCategory: 'Biographies',
    explanation: 'A genius has exceptional intellectual ability or creative power.'
  },
  {
    id: 'vi_g7_m_06',
    prompt: 'Target the word for: "Wildlife species facing a very high risk of extinction"',
    targetWord: 'Endangered',
    distractorWords: ['Abundant', 'Domesticated', 'Thriving'],
    wordCategory: 'Wild Animals',
    explanation: 'Endangered species are at risk of vanishing from the wild.'
  },
  {
    id: 'vi_g7_m_07',
    prompt: 'Target cold-blooded vertebrates that lay eggs, like snakes and lizards',
    targetWord: 'Reptiles',
    distractorWords: ['Mammals', 'Birds', 'Amphibians'],
    wordCategory: 'Wild Animals',
    explanation: 'Reptiles are scaly, cold-blooded vertebrates.'
  },
  {
    id: 'vi_g7_m_08',
    prompt: 'Target a TV show where contestants compete by answering trivia questions',
    targetWord: 'Quiz Show',
    distractorWords: ['News Bulletin', 'Soap Opera', 'Sitcom'],
    wordCategory: 'Television',
    explanation: 'A quiz show tests participants on knowledge and trivia.'
  },
  {
    id: 'vi_g7_m_09',
    prompt: 'Target the person who hosts and entertains guests at a party or event',
    targetWord: 'Host',
    distractorWords: ['Visitor', 'Stranger', 'Customer'],
    wordCategory: 'Celebrations',
    explanation: 'The host receives, entertains, and cares for guests.'
  },
  {
    id: 'vi_g7_m_10',
    prompt: 'Target a protected sanctuary where wild animals live safely in nature',
    targetWord: 'Reserve',
    distractorWords: ['Circus', 'Cage', 'Abattoir'],
    wordCategory: 'Wild Animals',
    explanation: 'A nature reserve protects wildlife and natural ecosystems.'
  },
  {
    id: 'vi_g7_m_11',
    prompt: 'Target the professional occupation or life journey a person pursues',
    targetWord: 'Career',
    distractorWords: ['Hobby', 'Vacation', 'Chore'],
    wordCategory: 'Dreams & Life',
    explanation: 'A career is an occupation undertaken for a significant period of a person\'s life.'
  },
  {
    id: 'vi_g7_m_12',
    prompt: 'Target the shop where you buy fresh meat, poultry, and sausages',
    targetWord: 'Butcher',
    distractorWords: ['Bakery', 'Florist', 'Chemist'],
    wordCategory: 'Public Buildings',
    explanation: 'A butcher prepares and sells cuts of meat.'
  },
  {
    id: 'vi_g7_m_13',
    prompt: 'Target the shop where you buy colourful fresh flowers and plants',
    targetWord: 'Florist',
    distractorWords: ['Stationery', 'Greengrocer', 'Optician'],
    wordCategory: 'Public Buildings',
    explanation: 'A florist arranges and sells decorative flowers.'
  },
  {
    id: 'vi_g7_m_14',
    prompt: 'Target the gradual increase in overall global atmospheric temperatures',
    targetWord: 'Global Warming',
    distractorWords: ['Ice Age', 'Acid Rain', 'Biodiversity'],
    wordCategory: 'Environment',
    explanation: 'Global warming describes long-term heating of Earth\'s climate system.'
  },
  {
    id: 'vi_g7_m_15',
    prompt: 'Target harmful chemical waste produced by industrial factories',
    targetWord: 'Toxic Waste',
    distractorWords: ['Clean Water', 'Compost', 'Solar Panels'],
    wordCategory: 'Environment',
    explanation: 'Toxic waste consists of hazardous industrial residues.'
  },
  {
    id: 'vi_g7_m_16',
    prompt: 'Target a small rocky celestial body that burns brightly entering Earth\'s atmosphere',
    targetWord: 'Meteor',
    distractorWords: ['Planet', 'Galaxy', 'Black Hole'],
    wordCategory: 'Planets',
    explanation: 'A meteor is a glowing streak of light caused by space debris burning in the atmosphere.'
  },
  {
    id: 'vi_g7_m_17',
    prompt: 'Target a gigantic system of billions of stars, gas, and dust held by gravity',
    targetWord: 'Galaxy',
    distractorWords: ['Meteorite', 'Satellite', 'Atmosphere'],
    wordCategory: 'Planets',
    explanation: 'A galaxy is a massive gravitationally bound system of stars, such as the Milky Way.'
  },
  {
    id: 'vi_g7_m_18',
    prompt: 'Target the personal quality of not showing off or bragging about success',
    targetWord: 'Modest',
    distractorWords: ['Arrogant', 'Snobbish', 'Proud'],
    wordCategory: 'Personality Traits',
    explanation: 'A modest person does not boast or seek attention for their achievements.'
  },
  {
    id: 'vi_g7_m_19',
    prompt: 'Target the items, gear, and tools needed for a specific sport',
    targetWord: 'Equipment',
    distractorWords: ['Trophy', 'Referee', 'Ticket'],
    wordCategory: 'Sports',
    explanation: 'Equipment refers to the necessary tools, apparel, and apparatus for an activity.'
  },
  {
    id: 'vi_g7_m_20',
    prompt: 'Target the animal that is hunted and eaten by a predator',
    targetWord: 'Prey',
    distractorWords: ['Carnivore', 'Hunter', 'Poacher'],
    wordCategory: 'Wild Animals',
    explanation: 'Prey is an animal that is hunted and killed by another for food.'
  },
  {
    id: 'vi_g7_m_21',
    prompt: 'Target a single broadcast installment in a television series',
    targetWord: 'Episode',
    distractorWords: ['Trailer', 'Commercial', 'Channel'],
    wordCategory: 'Television',
    explanation: 'An episode is an individual part of a serialized television show.'
  },
  {
    id: 'vi_g7_m_22',
    prompt: 'Target the decorative paper wrapped neatly around a present',
    targetWord: 'Wrapping Paper',
    distractorWords: ['Newspaper', 'Towel', 'Blanket'],
    wordCategory: 'Celebrations',
    explanation: 'Wrapping paper is decorative paper used to cover presents.'
  },
  {
    id: 'vi_g7_m_23',
    prompt: 'Target futuristic vehicles imagined to fly through city skies',
    targetWord: 'Flying Cars',
    distractorWords: ['Steam Trains', 'Submarines', 'Bicycles'],
    wordCategory: 'Dreams & Future',
    explanation: 'Flying cars are visionary future urban personal transport.'
  },
  {
    id: 'vi_g7_m_24',
    prompt: 'Target the place where you report crimes and ask officers for help',
    targetWord: 'Police Station',
    distractorWords: ['Post Office', 'Pharmacy', 'Bakery'],
    wordCategory: 'Public Buildings',
    explanation: 'A police station is the headquarters of local law enforcement.'
  },
  {
    id: 'vi_g7_m_25',
    prompt: 'Target clean kinetic energy generated by giant spinning turbines',
    targetWord: 'Wind Energy',
    distractorWords: ['Oil', 'Coal', 'Nuclear Waste'],
    wordCategory: 'Environment',
    explanation: 'Wind energy is renewable electricity generated by air flow.'
  },
  {
    id: 'vi_g7_m_26',
    prompt: 'Target an icy celestial object with a glowing tail that orbits the Sun',
    targetWord: 'Comet',
    distractorWords: ['Asteroid', 'Satellite', 'Planet'],
    wordCategory: 'Planets',
    explanation: 'A comet is an icy body that releases gas and dust as it approaches the Sun.'
  },
  {
    id: 'vi_g7_m_27',
    prompt: 'Target someone who is unwilling to wait or gets annoyed easily',
    targetWord: 'Impatient',
    distractorWords: ['Patient', 'Tolerant', 'Generous'],
    wordCategory: 'Personality Traits',
    explanation: 'Impatient people get easily irritated when things take time.'
  },
  {
    id: 'vi_g7_m_28',
    prompt: 'Target an official contest involving multiple sports matches and rounds',
    targetWord: 'Tournament',
    distractorWords: ['Exhibition', 'Rehearsal', 'Training'],
    wordCategory: 'Sports',
    explanation: 'A tournament is a series of contests in a competition.'
  },
  {
    id: 'vi_g7_m_29',
    prompt: 'Target the animal that preys on other animals for food',
    targetWord: 'Predator',
    distractorWords: ['Prey', 'Herbivore', 'Grazer'],
    wordCategory: 'Wild Animals',
    explanation: 'A predator naturally hunts and feeds on other animals.'
  },
  {
    id: 'vi_g7_m_30',
    prompt: 'Target a TV show that features real people in unscripted situations',
    targetWord: 'Reality Show',
    distractorWords: ['Cartoon', 'Documentary', 'Historical Film'],
    wordCategory: 'Television',
    explanation: 'A reality show depicts unscripted real-life situations and drama.'
  },
  {
    id: 'vi_g7_m_31',
    prompt: 'Target a sweet baked dessert with icing served at festive birthdays',
    targetWord: 'Birthday Cake',
    distractorWords: ['Bread', 'Salad', 'Soup'],
    wordCategory: 'Celebrations',
    explanation: 'Birthday cakes are decorated pastries traditionally served on birthdays.'
  },
  {
    id: 'vi_g7_m_32',
    prompt: 'Target a medical cure or pharmaceutical treatment that ends a sickness',
    targetWord: 'Remedy',
    distractorWords: ['Poison', 'Infection', 'Virus'],
    wordCategory: 'Dreams & Health',
    explanation: 'A remedy or cure relieves or heals a disease.'
  },
  {
    id: 'vi_g7_m_33',
    prompt: 'Target the shop where you buy fresh fruit and vegetables',
    targetWord: 'Greengrocer',
    distractorWords: ['Chemist', 'Bakery', 'Butcher'],
    wordCategory: 'Public Buildings',
    explanation: 'A greengrocer specializes in fresh fruits and vegetables.'
  },
  {
    id: 'vi_g7_m_34',
    prompt: 'Target the protective gas layer high above Earth shielding us from UV rays',
    targetWord: 'Ozone Layer',
    distractorWords: ['Soil', 'Ocean Bed', 'Troposphere'],
    wordCategory: 'Environment',
    explanation: 'The ozone layer absorbs most of the sun\'s harmful ultraviolet radiation.'
  },
  {
    id: 'vi_g7_m_35',
    prompt: 'Target an artificial machine launched into space to transmit telecommunications',
    targetWord: 'Satellite',
    distractorWords: ['Submarine', 'Helicopter', 'Rover'],
    wordCategory: 'Planets & Tech',
    explanation: 'A satellite orbits Earth or planets to collect data or relay signals.'
  },
  {
    id: 'vi_g7_m_36',
    prompt: 'Target the character trait of someone who always keeps a tidy room',
    targetWord: 'Neat',
    distractorWords: ['Messy', 'Clumsy', 'Untidy'],
    wordCategory: 'Personality Traits',
    explanation: 'Neat means organized, clean, and orderly.'
  },
  {
    id: 'vi_g7_m_37',
    prompt: 'Blast the protective headgear worn during cycling or horse riding',
    targetWord: 'Helmet',
    distractorWords: ['Scarf', 'Cap', 'Glasses'],
    wordCategory: 'Sports Safety',
    explanation: 'A helmet protects the head against injury during impact.'
  },
  {
    id: 'vi_g7_m_38',
    prompt: 'Target warm-blooded vertebrates that nurse their young with milk',
    targetWord: 'Mammals',
    distractorWords: ['Reptiles', 'Fish', 'Insects'],
    wordCategory: 'Wild Animals',
    explanation: 'Mammals are warm-blooded vertebrates with hair and milk glands.'
  },
  {
    id: 'vi_g7_m_39',
    prompt: 'Target the person directing actors and crew on a TV set',
    targetWord: 'Director',
    distractorWords: ['Viewer', 'Spectator', 'Audience'],
    wordCategory: 'Television',
    explanation: 'A director oversees the creative and dramatic aspects of filming.'
  },
  {
    id: 'vi_g7_m_40',
    prompt: 'Target the planet with the most magnificent visible ice and rock rings',
    targetWord: 'Saturn',
    distractorWords: ['Mercury', 'Mars', 'Venus'],
    wordCategory: 'Planets',
    explanation: 'Saturn is world-famous for its prominent and expansive planetary ring system.'
  }
];

// GRADE 7 HARD (40 items)
const g7_hard = [
  {
    id: 'vi_g7_h_01',
    prompt: 'Target the trait: "Thinking you are superior and looking down on others"',
    targetWord: 'Arrogant',
    distractorWords: ['Modest', 'Humble', 'Generous'],
    wordCategory: 'Personality Traits',
    explanation: 'Arrogant people have an exaggerated sense of their own importance.'
  },
  {
    id: 'vi_g7_h_02',
    prompt: 'Target the biological variety of plant and animal species in an ecosystem',
    targetWord: 'Biodiversity',
    distractorWords: ['Pollution', 'Deforestation', 'Atmosphere'],
    wordCategory: 'Wild Animals & Ecology',
    explanation: 'Biodiversity refers to the variety of living organisms in an environment.'
  },
  {
    id: 'vi_g7_h_03',
    prompt: 'Target the natural warming process where greenhouse gases trap heat on Earth',
    targetWord: 'Greenhouse Effect',
    distractorWords: ['Solar Eclipse', 'Photosynthesis', 'Tidal Wave'],
    wordCategory: 'Environment',
    explanation: 'The greenhouse effect traps solar warmth in the lower atmosphere.'
  },
  {
    id: 'vi_g7_h_04',
    prompt: 'Target the scientific study of stars, planets, and celestial universe phenomena',
    targetWord: 'Astronomy',
    distractorWords: ['Astrology', 'Geology', 'Botany'],
    wordCategory: 'Planets & Science',
    explanation: 'Astronomy is the natural science that studies celestial objects and phenomena.'
  },
  {
    id: 'vi_g7_h_05',
    prompt: 'Target the trait of someone who is easily hurt by criticism or remarks',
    targetWord: 'Sensitive',
    distractorWords: ['Tough', 'Callous', 'Outgoing'],
    wordCategory: 'Personality Traits',
    explanation: 'Sensitive people respond quickly or delicately to emotional stimuli.'
  },
  {
    id: 'vi_g7_h_06',
    prompt: 'Target a protected sanctuary where wild animals breed without human harm',
    targetWord: 'Sanctuary',
    distractorWords: ['Slaughterhouse', 'Factory', 'Dungeon'],
    wordCategory: 'Wild Animals',
    explanation: 'A wildlife sanctuary provides refuge for injured, endangered, or abused animals.'
  },
  {
    id: 'vi_g7_h_07',
    prompt: 'Target an official written agreement between nations to preserve nature',
    targetWord: 'Treaty',
    distractorWords: ['Broadcast', 'Advertisement', 'Rumour'],
    wordCategory: 'Environment & Law',
    explanation: 'A treaty is a formally ratified agreement between states or nations.'
  },
  {
    id: 'vi_g7_h_08',
    prompt: 'Target the invisible astronomical region with gravitational pull so strong not even light escapes',
    targetWord: 'Black Hole',
    distractorWords: ['Supernova', 'Meteor', 'White Dwarf'],
    wordCategory: 'Planets & Space',
    explanation: 'A black hole is a region of spacetime where gravity prevents anything from escaping.'
  },
  {
    id: 'vi_g7_h_09',
    prompt: 'Target someone who is dependable and can be trusted with any responsibility',
    targetWord: 'Reliable',
    distractorWords: ['Deceitful', 'Irresponsible', 'Sneaky'],
    wordCategory: 'Personality Traits',
    explanation: 'Reliable means consistently good in quality or performance; able to be trusted.'
  },
  {
    id: 'vi_g7_h_10',
    prompt: 'Target the animal\'s ability to blend into its surroundings to hide from predators',
    targetWord: 'Camouflage',
    distractorWords: ['Hibernation', 'Migration', 'Extinction'],
    wordCategory: 'Wild Animals',
    explanation: 'Camouflage allows animals to blend visually into their natural environment.'
  },
  {
    id: 'vi_g7_h_11',
    prompt: 'Target the sudden death or vanishing of an entire biological species',
    targetWord: 'Extinction',
    distractorWords: ['Evolution', 'Adaptation', 'Reproduction'],
    wordCategory: 'Wild Animals',
    explanation: 'Extinction is the complete termination of an organism or taxon.'
  },
  {
    id: 'vi_g7_h_12',
    prompt: 'Target rainfall made unusually acidic by industrial atmospheric emissions',
    targetWord: 'Acid Rain',
    distractorWords: ['Morning Dew', 'Gentle Shower', 'Clean Mist'],
    wordCategory: 'Environment',
    explanation: 'Acid rain contains high levels of nitric and sulfuric acids from industrial pollution.'
  },
  {
    id: 'vi_g7_h_13',
    prompt: 'Target the outer gaseous envelope surrounding a planet or moon',
    targetWord: 'Atmosphere',
    distractorWords: ['Crust', 'Core', 'Mantle'],
    wordCategory: 'Planets',
    explanation: 'An atmosphere is the layer of gases retained by a celestial body\'s gravity.'
  },
  {
    id: 'vi_g7_h_14',
    prompt: 'Target someone who rarely shares personal thoughts and prefers privacy',
    targetWord: 'Reserved',
    distractorWords: ['Talkative', 'Noisy', 'Extroverted'],
    wordCategory: 'Personality Traits',
    explanation: 'Reserved people are slow to reveal emotions or opinions.'
  },
  {
    id: 'vi_g7_h_15',
    prompt: 'Target the biological period of deep winter sleep animals undertake to survive cold',
    targetWord: 'Hibernation',
    distractorWords: ['Camouflage', 'Migration', 'Hunting'],
    wordCategory: 'Wild Animals',
    explanation: 'Hibernation is a state of dormancy and metabolic depression in winter.'
  },
  {
    id: 'vi_g7_h_16',
    prompt: 'Target the seasonal travel of birds and animals from cold zones to warmer climates',
    targetWord: 'Migration',
    distractorWords: ['Hibernation', 'Pollution', 'Domesticity'],
    wordCategory: 'Wild Animals',
    explanation: 'Migration is seasonal movement of animals from one region to another.'
  },
  {
    id: 'vi_g7_h_17',
    prompt: 'Target the harmful garbage dumped into public nature spots by careless people',
    targetWord: 'Litter',
    distractorWords: ['Compost', 'Seedlings', 'Minerals'],
    wordCategory: 'Environment',
    explanation: 'Litter consists of waste products discarded improperly on streets or fields.'
  },
  {
    id: 'vi_g7_h_18',
    prompt: 'Target the immense circular collection of billions of rocky fragments between Mars and Jupiter',
    targetWord: 'Asteroid Belt',
    distractorWords: ['Milky Way', 'Oort Cloud', 'Solar Flare'],
    wordCategory: 'Planets',
    explanation: 'The asteroid belt is a torus-shaped region located between the orbits of Jupiter and Mars.'
  },
  {
    id: 'vi_g7_h_19',
    prompt: 'Target the quality of speaking truthfully without pretense or deception',
    targetWord: 'Sincerity',
    distractorWords: ['Hypocrisy', 'Arrogance', 'Jealousy'],
    wordCategory: 'Personality Traits',
    explanation: 'Sincerity is freedom from deceit, hypocrisy, or duplicity.'
  },
  {
    id: 'vi_g7_h_20',
    prompt: 'Target animals active and hunting primarily during the night',
    targetWord: 'Nocturnal',
    distractorWords: ['Diurnal', 'Aquatic', 'Domestic'],
    wordCategory: 'Wild Animals',
    explanation: 'Nocturnal creatures, like owls and bats, are active during night hours.'
  },
  {
    id: 'vi_g7_h_21',
    prompt: 'Target energy sources that naturally replenish, like solar and wind power',
    targetWord: 'Renewable',
    distractorWords: ['Fossil', 'Depletable', 'Harmful'],
    wordCategory: 'Environment',
    explanation: 'Renewable energy comes from sources that do not diminish upon use.'
  },
  {
    id: 'vi_g7_h_22',
    prompt: 'Target the huge explosive death of a dying massive star in space',
    targetWord: 'Supernova',
    distractorWords: ['Meteor', 'Solar Wind', 'Constellation'],
    wordCategory: 'Planets & Astronomy',
    explanation: 'A supernova is a catastrophic, luminous stellar explosion.'
  },
  {
    id: 'vi_g7_h_23',
    prompt: 'Target the personality of someone who enjoys competing and always wants to win',
    targetWord: 'Ambitious',
    distractorWords: ['Careless', 'Lazy', 'Apathetic'],
    wordCategory: 'Personality Traits',
    explanation: 'Ambitious individuals possess a strong desire and determination to succeed.'
  },
  {
    id: 'vi_g7_h_24',
    prompt: 'Target wild animals raised and bred for meat, fur, or human use',
    targetWord: 'Captivity',
    distractorWords: ['Wilderness', 'Sanctuary', 'Freedom'],
    wordCategory: 'Wild Animals',
    explanation: 'Captivity refers to the condition of being kept in an enclosure or zoo.'
  },
  {
    id: 'vi_g7_h_25',
    prompt: 'Target reusable natural organic fertilizer produced from decomposed vegetable scraps',
    targetWord: 'Compost',
    distractorWords: ['Plastic', 'Toxic Sludge', 'Chemical Spray'],
    wordCategory: 'Environment',
    explanation: 'Compost is decayed organic material used as plant fertilizer.'
  },
  {
    id: 'vi_g7_h_26',
    prompt: 'Target a recognizable pattern of stars forming mythological shapes in the night sky',
    targetWord: 'Constellation',
    distractorWords: ['Crater', 'Comet', 'Atmosphere'],
    wordCategory: 'Planets & Astronomy',
    explanation: 'A constellation is a group of stars forming a recognized celestial pattern.'
  },
  {
    id: 'vi_g7_h_27',
    prompt: 'Target someone who thinks carefully before making decisions to avoid risk',
    targetWord: 'Cautious',
    distractorWords: ['Reckless', 'Impulsive', 'Careless'],
    wordCategory: 'Personality Traits',
    explanation: 'Cautious means attentive to potential dangers and careful.'
  },
  {
    id: 'vi_g7_h_28',
    prompt: 'Target animals that live primarily or entirely in water habitats',
    targetWord: 'Aquatic',
    distractorWords: ['Terrestrial', 'Arboreal', 'Aerial'],
    wordCategory: 'Wild Animals',
    explanation: 'Aquatic animals live in water bodies such as oceans, rivers, or lakes.'
  },
  {
    id: 'vi_g7_h_29',
    prompt: 'Target the gradual wearing away of fertile topsoil by wind and water',
    targetWord: 'Soil Erosion',
    distractorWords: ['Afforestation', 'Composting', 'Harvesting'],
    wordCategory: 'Environment',
    explanation: 'Soil erosion is the denudation of the upper layer of soil by environmental forces.'
  },
  {
    id: 'vi_g7_h_30',
    prompt: 'Target the outer icy cloud boundary containing trillions of comets at solar system edge',
    targetWord: 'Oort Cloud',
    distractorWords: ['Asteroid Belt', 'Milky Way', 'Van Allen Belt'],
    wordCategory: 'Planets & Astronomy',
    explanation: 'The Oort cloud is a theoretical vast spherical shell of icy space objects.'
  },
  {
    id: 'vi_g7_h_31',
    prompt: 'Target someone who shows genuine affection, love, and care toward friends',
    targetWord: 'Affectionate',
    distractorWords: ['Cold', 'Hostile', 'Indifferent'],
    wordCategory: 'Personality Traits',
    explanation: 'Affectionate people readily display warmth, fondness, and care.'
  },
  {
    id: 'vi_g7_h_32',
    prompt: 'Target an animal species that no longer exists in its wild habitat, surviving only in zoos',
    targetWord: 'Extinct in Wild',
    distractorWords: ['Abundant', 'Overpopulated', 'Thriving'],
    wordCategory: 'Wild Animals',
    explanation: 'Species extinct in the wild only exist in captivity or cultivated settings.'
  },
  {
    id: 'vi_g7_h_33',
    prompt: 'Target substances that decompose naturally in soil without harming nature',
    targetWord: 'Biodegradable',
    distractorWords: ['Non-recyclable', 'Toxic', 'Indestructible'],
    wordCategory: 'Environment',
    explanation: 'Biodegradable materials break down naturally through biological microbes.'
  },
  {
    id: 'vi_g7_h_34',
    prompt: 'Target the coldest, windiest ice giant planet farthest from the Sun',
    targetWord: 'Neptune',
    distractorWords: ['Jupiter', 'Earth', 'Venus'],
    wordCategory: 'Planets',
    explanation: 'Neptune is the eighth and most distant major solar planet.'
  },
  {
    id: 'vi_g7_h_35',
    prompt: 'Target someone who remains calm and doesn\'t get angry easily under stress',
    targetWord: 'Patient',
    distractorWords: ['Impatient', 'Aggressive', 'Furious'],
    wordCategory: 'Personality Traits',
    explanation: 'Patient people endure hardship or delay without complaining or getting angry.'
  },
  {
    id: 'vi_g7_h_36',
    prompt: 'Target animals that eat both meat and plants, like brown bears and humans',
    targetWord: 'Omnivores',
    distractorWords: ['Carnivores', 'Herbivores', 'Insectivores'],
    wordCategory: 'Wild Animals',
    explanation: 'Omnivores feed on both plant and animal matter.'
  },
  {
    id: 'vi_g7_h_37',
    prompt: 'Target the planting of new trees on barren land to rebuild woodland',
    targetWord: 'Afforestation',
    distractorWords: ['Deforestation', 'Urbanization', 'Mining'],
    wordCategory: 'Environment',
    explanation: 'Afforestation is the establishment of a forest in an area where there was no previous tree cover.'
  },
  {
    id: 'vi_g7_h_38',
    prompt: 'Target the spin of a planet around its own internal imaginary axis',
    targetWord: 'Rotation',
    distractorWords: ['Revolution', 'Eclipse', 'Gravity'],
    wordCategory: 'Planets',
    explanation: 'Rotation is the circular movement of an object around its own centre/axis.'
  },
  {
    id: 'vi_g7_h_39',
    prompt: 'Target someone who is funny and makes others laugh with witty jokes',
    targetWord: 'Humorous',
    distractorWords: ['Gloomy', 'Serious', 'Dull'],
    wordCategory: 'Personality Traits',
    explanation: 'Humorous people are witty, amusing, and entertain others with laughter.'
  },
  {
    id: 'vi_g7_h_40',
    prompt: 'Target an official decree prohibiting the hunting of a threatened species',
    targetWord: 'Hunting Ban',
    distractorWords: ['Poaching License', 'Safari Ticket', 'Tax Refund'],
    wordCategory: 'Wild Animals & Law',
    explanation: 'A hunting ban legally outlaws the chasing or killing of wildlife.'
  }
];

// GRADE 8 EASY (40 items)
const g8_easy = [
  {
    id: 'vi_g8_e_01',
    prompt: 'Blast the word for: "A faithful friend who never abandons you"',
    targetWord: 'Loyal',
    distractorWords: ['Disloyal', 'Arrogant', 'Snobbish'],
    wordCategory: 'Friendship',
    explanation: 'Loyal means giving firm and constant support or allegiance.'
  },
  {
    id: 'vi_g8_e_02',
    prompt: 'Blast the phrasal verb meaning: "To support or defend a friend in need"',
    targetWord: 'Back Up',
    distractorWords: ['Break Down', 'Hang Up', 'Give Up'],
    wordCategory: 'Friendship',
    explanation: 'To back someone up is to provide moral or physical support.'
  },
  {
    id: 'vi_g8_e_03',
    prompt: 'Blast the phrasal verb meaning: "To trust and rely completely on someone"',
    targetWord: 'Count On',
    distractorWords: ['Take Off', 'Look Down', 'Put Away'],
    wordCategory: 'Friendship',
    explanation: 'To count on someone means to rely on them with confidence.'
  },
  {
    id: 'vi_g8_e_04',
    prompt: 'Blast the kitchen action: "To cut food into thin flat slices"',
    targetWord: 'Slice',
    distractorWords: ['Boil', 'Bake', 'Freeze'],
    wordCategory: 'Cooking',
    explanation: 'To slice means cutting bread, tomatoes, or meat into flat pieces.'
  },
  {
    id: 'vi_g8_e_05',
    prompt: 'Blast the kitchen action: "To remove the outer skin of fruits or potatoes"',
    targetWord: 'Peel',
    distractorWords: ['Grate', 'Roast', 'Pour'],
    wordCategory: 'Cooking',
    explanation: 'Peeling removes the outer skin from vegetables or fruits.'
  },
  {
    id: 'vi_g8_e_06',
    prompt: 'Blast the cooking technique: "To cook in water heated to 100°C with bubbling"',
    targetWord: 'Boil',
    distractorWords: ['Fry', 'Bake', 'Chop'],
    wordCategory: 'Cooking',
    explanation: 'Boiling heats liquid until bubbles rise and break at the surface.'
  },
  {
    id: 'vi_g8_e_07',
    prompt: 'Blast the telephone action: "To end a phone call by putting down the receiver"',
    targetWord: 'Hang Up',
    distractorWords: ['Hold On', 'Call Back', 'Log In'],
    wordCategory: 'Phone',
    explanation: 'To hang up is to disconnect or terminate a telephone call.'
  },
  {
    id: 'vi_g8_e_08',
    prompt: 'Blast the telephone term for when someone else is currently using the line',
    targetWord: 'Engaged',
    distractorWords: ['Available', 'Empty', 'Broken'],
    wordCategory: 'Phone',
    explanation: 'An engaged line is busy with another active telephone call.'
  },
  {
    id: 'vi_g8_e_09',
    prompt: 'Blast the action: "To copy files from the internet onto your personal computer"',
    targetWord: 'Download',
    distractorWords: ['Upload', 'Delete', 'Crash'],
    wordCategory: 'Internet',
    explanation: 'Downloading transfers data from a remote server to a local device.'
  },
  {
    id: 'vi_g8_e_10',
    prompt: 'Blast the secret code of characters used to log into your account safely',
    targetWord: 'Password',
    distractorWords: ['Username', 'Attachment', 'Browser'],
    wordCategory: 'Internet',
    explanation: 'A password is a secret string of characters for user authentication.'
  },
  {
    id: 'vi_g8_e_11',
    prompt: 'Blast the extreme water sport where teams navigate rapids in an inflatable boat',
    targetWord: 'Rafting',
    distractorWords: ['Jogging', 'Chess', 'Golf'],
    wordCategory: 'Adventures',
    explanation: 'Rafting uses an inflatable raft to navigate turbulent river rapids.'
  },
  {
    id: 'vi_g8_e_12',
    prompt: 'Blast the protective headwear compulsory in extreme sports like rafting and skydiving',
    targetWord: 'Helmet',
    distractorWords: ['Scarf', 'Watch', 'Glove'],
    wordCategory: 'Adventures',
    explanation: 'A helmet prevents head injuries during extreme sports impacts.'
  },
  {
    id: 'vi_g8_e_13',
    prompt: 'Blast a place to sleep on vacation, such as a hotel, hostel, or resort',
    targetWord: 'Accommodation',
    distractorWords: ['Souvenir', 'Luggage', 'Ticket'],
    wordCategory: 'Tourism',
    explanation: 'Accommodation provides lodging for travellers and tourists.'
  },
  {
    id: 'vi_g8_e_14',
    prompt: 'Blast a memento or small object bought on holiday to remember a city',
    targetWord: 'Souvenir',
    distractorWords: ['Passport', 'Boarding Pass', 'Wallet'],
    wordCategory: 'Tourism',
    explanation: 'A souvenir is an item kept as a reminder of a visited place.'
  },
  {
    id: 'vi_g8_e_15',
    prompt: 'Blast the household chore of pressing wrinkled clothes with heat',
    targetWord: 'Ironing',
    distractorWords: ['Mopping', 'Dusting', 'Cooking'],
    wordCategory: 'Chores',
    explanation: 'Ironing uses a heated appliance to smooth fabric creases.'
  },
  {
    id: 'vi_g8_e_16',
    prompt: 'Blast the household waste, garbage, and trash discarded daily',
    targetWord: 'Rubbish',
    distractorWords: ['Furniture', 'Cutlery', 'Curtains'],
    wordCategory: 'Chores',
    explanation: 'Rubbish refers to waste material or refuse.'
  },
  {
    id: 'vi_g8_e_17',
    prompt: 'Blast the special room equipped for scientific testing and research',
    targetWord: 'Laboratory',
    distractorWords: ['Classroom', 'Gym', 'Cafeteria'],
    wordCategory: 'Science',
    explanation: 'A laboratory is a facility providing controlled conditions for research.'
  },
  {
    id: 'vi_g8_e_18',
    prompt: 'Blast a scientific procedure carried out to discover something new or test a theory',
    targetWord: 'Experiment',
    distractorWords: ['Accident', 'Ceremony', 'Celebration'],
    wordCategory: 'Science',
    explanation: 'An experiment is an orderly test undertaken to test a hypothesis.'
  },
  {
    id: 'vi_g8_e_19',
    prompt: 'Blast the violent shaking of the Earth\'s crust caused by tectonic movements',
    targetWord: 'Earthquake',
    distractorWords: ['Drought', 'Flood', 'Blizzard'],
    wordCategory: 'Natural Forces',
    explanation: 'An earthquake is seismic shaking of the ground resulting from subterranean movements.'
  },
  {
    id: 'vi_g8_e_20',
    prompt: 'Blast a gigantic destructive ocean wave triggered by undersea earthquakes',
    targetWord: 'Tsunami',
    distractorWords: ['Tornado', 'Landslide', 'Avalanche'],
    wordCategory: 'Natural Forces',
    explanation: 'A tsunami is a huge sea wave caused by an undersea earthquake or landslide.'
  },
  {
    id: 'vi_g8_e_21',
    prompt: 'Blast a close companion or pal with whom you share everything',
    targetWord: 'Buddy',
    distractorWords: ['Enemy', 'Stranger', 'Rival'],
    wordCategory: 'Friendship',
    explanation: 'A buddy is a close friend or pal.'
  },
  {
    id: 'vi_g8_e_22',
    prompt: 'Blast the kitchen action: "To cook food like bread or cake inside an oven"',
    targetWord: 'Bake',
    distractorWords: ['Fry', 'Boil', 'Chop'],
    wordCategory: 'Cooking',
    explanation: 'Baking cooks food by dry heat without direct exposure to a flame, usually in an oven.'
  },
  {
    id: 'vi_g8_e_23',
    prompt: 'Blast the telephone action: "To enter numbers on the keypad to initiate a call"',
    targetWord: 'Dial',
    distractorWords: ['Download', 'Hang', 'Transfer'],
    wordCategory: 'Phone',
    explanation: 'Dialling enters digits to call a specific telephone number.'
  },
  {
    id: 'vi_g8_e_24',
    prompt: 'Blast the software application used to view pages on the World Wide Web',
    targetWord: 'Browser',
    distractorWords: ['Monitor', 'Keyboard', 'Printer'],
    wordCategory: 'Internet',
    explanation: 'A browser (Chrome, Edge, Firefox) displays web pages.'
  },
  {
    id: 'vi_g8_e_25',
    prompt: 'Blast the jumping sport from a high bridge attached to an elastic cord',
    targetWord: 'Bungee Jumping',
    distractorWords: ['Jogging', 'Badminton', 'Darts'],
    wordCategory: 'Adventures',
    explanation: 'Bungee jumping involves leaping from a high structure while tethered to a cord.'
  },
  {
    id: 'vi_g8_e_26',
    prompt: 'Blast a holiday package including room, all meals, and drinks for one price',
    targetWord: 'All-inclusive',
    distractorWords: ['Self-catering', 'Bed and Breakfast', 'Homestay'],
    wordCategory: 'Tourism',
    explanation: 'All-inclusive resorts provide accommodation, food, and drinks in the overall package.'
  },
  {
    id: 'vi_g8_e_27',
    prompt: 'Blast the kitchen appliance that cleans plates, bowls, and cutlery automatically',
    targetWord: 'Dishwasher',
    distractorWords: ['Refrigerator', 'Toaster', 'Kettle'],
    wordCategory: 'Chores',
    explanation: 'A dishwasher washes eating utensils and dishes automatically.'
  },
  {
    id: 'vi_g8_e_28',
    prompt: 'Blast a cylindrical glass tube used by scientists to hold liquid samples in labs',
    targetWord: 'Test Tube',
    distractorWords: ['Saucepan', 'Water Bottle', 'Mug'],
    wordCategory: 'Science',
    explanation: 'A test tube is a thin glass tube closed at one end, used in laboratories.'
  },
  {
    id: 'vi_g8_e_29',
    prompt: 'Blast a prolonged period of abnormally low rainfall leading to severe water shortage',
    targetWord: 'Drought',
    distractorWords: ['Flood', 'Blizzard', 'Hail'],
    wordCategory: 'Natural Forces',
    explanation: 'Drought is prolonged dry weather causing severe water shortages.'
  },
  {
    id: 'vi_g8_e_30',
    prompt: 'Blast information kept private between best friends and never told to others',
    targetWord: 'Secret',
    distractorWords: ['News', 'Rumour', 'Headline'],
    wordCategory: 'Friendship',
    explanation: 'A secret is kept private and hidden from public knowledge.'
  },
  {
    id: 'vi_g8_e_31',
    prompt: 'Blast the kitchen tool with a mesh wire used to separate liquids from solids',
    targetWord: 'Strainer',
    distractorWords: ['Frying Pan', 'Knife', 'Spoon'],
    wordCategory: 'Cooking',
    explanation: 'A strainer or sieve drains water from boiled pasta or vegetables.'
  },
  {
    id: 'vi_g8_e_32',
    prompt: 'Blast a short written note or reminder left for someone in an office or home',
    targetWord: 'Memo',
    distractorWords: ['Novel', 'Dictionary', 'Menu'],
    wordCategory: 'Phone & Communication',
    explanation: 'A memo is a brief written record or reminder.'
  },
  {
    id: 'vi_g8_e_33',
    prompt: 'Blast a digital file (picture or document) attached and sent with an email',
    targetWord: 'Attachment',
    distractorWords: ['Password', 'Username', 'Spam'],
    wordCategory: 'Internet',
    explanation: 'An attachment is a computer file appended to an email.'
  },
  {
    id: 'vi_g8_e_34',
    prompt: 'Blast the extreme sport of gliding through the air with a wide canopy parachute',
    targetWord: 'Paragliding',
    distractorWords: ['Bowling', 'Archery', 'Rowing'],
    wordCategory: 'Adventures',
    explanation: 'Paragliding uses a foot-launched glider canopy to soar in the wind.'
  },
  {
    id: 'vi_g8_e_35',
    prompt: 'Blast a famous, prominent building or monument easily recognized in a city',
    targetWord: 'Landmark',
    distractorWords: ['Pavement', 'Bus Stop', 'Driveway'],
    wordCategory: 'Tourism',
    explanation: 'A landmark is a recognizable feature or famous monument.'
  },
  {
    id: 'vi_g8_e_36',
    prompt: 'Blast the household appliance used to clean dust and carpets with strong suction',
    targetWord: 'Vacuum Cleaner',
    distractorWords: ['Microwave', 'Mixer', 'Hairdryer'],
    wordCategory: 'Chores',
    explanation: 'A vacuum cleaner removes dirt and dust by suction.'
  },
  {
    id: 'vi_g8_e_37',
    prompt: 'Blast a medical substance that stimulates antibody production to provide immunity against viruses',
    targetWord: 'Vaccine',
    distractorWords: ['Bandage', 'Cast', 'Crutch'],
    wordCategory: 'Science',
    explanation: 'A vaccine primes the immune system against infectious pathogens.'
  },
  {
    id: 'vi_g8_e_38',
    prompt: 'Blast a massive slide of snow, ice, and rock tumbling down a steep mountainside',
    targetWord: 'Avalanche',
    distractorWords: ['Hurricane', 'Drought', 'Flood'],
    wordCategory: 'Natural Forces',
    explanation: 'An avalanche is a mass of snow and ice tumbling rapidly down a mountain.'
  },
  {
    id: 'vi_g8_e_39',
    prompt: 'Blast someone who is dishonest, sneaky, and tries to deceive others behind their backs',
    targetWord: 'Sneaky',
    distractorWords: ['Honest', 'Loyal', 'Fair'],
    wordCategory: 'Friendship Traits',
    explanation: 'Sneaky people act in a secretive and deceitful manner.'
  },
  {
    id: 'vi_g8_e_40',
    prompt: 'Blast the kitchen action: "To mix ingredients vigorously with a fork or wire tool"',
    targetWord: 'Whisk',
    distractorWords: ['Peel', 'Boil', 'Chop'],
    wordCategory: 'Cooking',
    explanation: 'Whisking beats or stirs eggs or batter with rapid, light strokes.'
  }
];

// GRADE 8 MEDIUM (40 items)
const g8_medium = [
  {
    id: 'vi_g8_m_01',
    prompt: 'Blast the trait: "Always helpful, offering encouragement and assistance to peers"',
    targetWord: 'Supportive',
    distractorWords: ['Unreliable', 'Jealous', 'Arrogant'],
    wordCategory: 'Friendship',
    explanation: 'A supportive friend provides encouragement and emotional or practical help.'
  },
  {
    id: 'vi_g8_m_02',
    prompt: 'Blast the term for music or situations so awful that you cannot tolerate them',
    targetWord: 'Unbearable',
    distractorWords: ['Fascinating', 'Pleasant', 'Harmonious'],
    wordCategory: 'Teen Life',
    explanation: 'Unbearable means too bad, painful, or annoying to be tolerated.'
  },
  {
    id: 'vi_g8_m_03',
    prompt: 'Blast the kitchen action: "To press and stretch dough with your hands to make bread"',
    targetWord: 'Knead',
    distractorWords: ['Grate', 'Simmer', 'Sift'],
    wordCategory: 'Cooking',
    explanation: 'Kneading works flour dough into a smooth, elastic mass for baking.'
  },
  {
    id: 'vi_g8_m_04',
    prompt: 'Blast the kitchen tool with sharp holes used to shred cheese or carrots',
    targetWord: 'Grater',
    distractorWords: ['Rolling Pin', 'Ladle', 'Whisk'],
    wordCategory: 'Cooking',
    explanation: 'A grater shreds food into fine shreds.'
  },
  {
    id: 'vi_g8_m_05',
    prompt: 'Blast the telephone state: "Ready and able to answer or talk on the phone"',
    targetWord: 'Available',
    distractorWords: ['Engaged', 'Occupied', 'Disconnected'],
    wordCategory: 'Phone',
    explanation: 'Available means free, present, and ready to take a call.'
  },
  {
    id: 'vi_g8_m_06',
    prompt: 'Blast the online hazard of someone pretending to be you to steal money or data',
    targetWord: 'Identity Theft',
    distractorWords: ['Online Shopping', 'Web Search', 'Cloud Storage'],
    wordCategory: 'Internet Safety',
    explanation: 'Identity theft is the fraudulent acquisition of personal identifying data.'
  },
  {
    id: 'vi_g8_m_07',
    prompt: 'Blast the hormone released in your body during danger or high-thrill extreme sports',
    targetWord: 'Adrenaline',
    distractorWords: ['Insulin', 'Melatonin', 'Hemoglobin'],
    wordCategory: 'Adventures',
    explanation: 'Adrenaline triggers the fight-or-flight response, boosting excitement and speed.'
  },
  {
    id: 'vi_g8_m_08',
    prompt: 'Blast ancient stone structures, temples, and fallen pillars from past civilizations',
    targetWord: 'Ruins',
    distractorWords: ['Skyscrapers', 'Highways', 'Malls'],
    wordCategory: 'Tourism',
    explanation: 'Ruins are the physical remains of historical buildings and cities.'
  },
  {
    id: 'vi_g8_m_09',
    prompt: 'Blast the domestic chore of wiping fine dust off tables, shelves, and cabinets',
    targetWord: 'Dusting',
    distractorWords: ['Mopping', 'Ironing', 'Gardening'],
    wordCategory: 'Chores',
    explanation: 'Dusting clears powdery dirt from indoor furniture.'
  },
  {
    id: 'vi_g8_m_10',
    prompt: 'Blast the optical laboratory instrument used to examine microscopic bacteria and cells',
    targetWord: 'Microscope',
    distractorWords: ['Telescope', 'Periscope', 'Thermometer'],
    wordCategory: 'Science',
    explanation: 'A microscope magnifies microscopic biological specimens.'
  },
  {
    id: 'vi_g8_m_11',
    prompt: 'Blast the downward sliding movement of a huge mass of earth and rock down a hill',
    targetWord: 'Landslide',
    distractorWords: ['Flood', 'Drought', 'Tornado'],
    wordCategory: 'Natural Forces',
    explanation: 'A landslide is the sliding down of a mass of earth or rock from a mountain.'
  },
  {
    id: 'vi_g8_m_12',
    prompt: 'Blast a friend who promises to keep a secret but reveals it to everyone',
    targetWord: 'Untrustworthy',
    distractorWords: ['Reliable', 'Loyal', 'Supportive'],
    wordCategory: 'Friendship',
    explanation: 'Untrustworthy people cannot be relied on to behave honestly or keep confidences.'
  },
  {
    id: 'vi_g8_m_13',
    prompt: 'Blast someone who looks down on others and thinks they have superior refined taste',
    targetWord: 'Snob',
    distractorWords: ['Companion', 'Ally', 'Helper'],
    wordCategory: 'Teen Life',
    explanation: 'A snob believes that their tastes or social status make them superior to others.'
  },
  {
    id: 'vi_g8_m_14',
    prompt: 'Blast cooking liquid gently just below boiling point with tiny occasional bubbles',
    targetWord: 'Simmer',
    distractorWords: ['Freeze', 'Roast', 'Chop'],
    wordCategory: 'Cooking',
    explanation: 'Simmering cooks food gently in liquid maintained just below boiling point.'
  },
  {
    id: 'vi_g8_m_15',
    prompt: 'Blast the telephone term for the individual internal line number within an office',
    targetWord: 'Extension',
    distractorWords: ['Password', 'Area Code', 'Zip Code'],
    wordCategory: 'Phone',
    explanation: 'An extension is an internal line connected to the main switchboard.'
  },
  {
    id: 'vi_g8_m_16',
    prompt: 'Blast the online crime of using digital messages to intimidate or harass someone',
    targetWord: 'Cyberbullying',
    distractorWords: ['Web Browsing', 'Blogging', 'Coding'],
    wordCategory: 'Internet Safety',
    explanation: 'Cyberbullying involves using electronic communication to bully or harass a person.'
  },
  {
    id: 'vi_g8_m_17',
    prompt: 'Blast an experience that is intensely exciting, electrifying, and heart-pounding',
    targetWord: 'Thrilling',
    distractorWords: ['Boring', 'Monotonous', 'Tedious'],
    wordCategory: 'Adventures',
    explanation: 'Thrilling means causing excitement or a sudden feeling of exhilaration.'
  },
  {
    id: 'vi_g8_m_18',
    prompt: 'Blast tourism centered around exploring the culture, traditions, and arts of a region',
    targetWord: 'Cultural Tourism',
    distractorWords: ['Medical Tourism', 'Space Tourism', 'Winter Sports'],
    wordCategory: 'Tourism',
    explanation: 'Cultural tourism focuses on historical landmarks, museums, and folklore.'
  },
  {
    id: 'vi_g8_m_19',
    prompt: 'Blast keeping your home and room organized, clean, and free of clutter',
    targetWord: 'Tidy',
    distractorWords: ['Chaotic', 'Messy', 'Disorganized'],
    wordCategory: 'Chores',
    explanation: 'Tidy means arranged neatly and in good order.'
  },
  {
    id: 'vi_g8_m_20',
    prompt: 'Blast a sudden, major breakthrough or significant scientific achievement',
    targetWord: 'Discovery',
    distractorWords: ['Disaster', 'Defeat', 'Decline'],
    wordCategory: 'Science',
    explanation: 'A discovery is the act or an instance of finding or learning something for the first time.'
  },
  {
    id: 'vi_g8_m_21',
    prompt: 'Blast a violent rotating column of air extending from a thunderstorm to the ground',
    targetWord: 'Tornado',
    distractorWords: ['Flood', 'Avalanche', 'Drought'],
    wordCategory: 'Natural Forces',
    explanation: 'A tornado is a mobile, destructive vortex of violently rotating winds.'
  },
  {
    id: 'vi_g8_m_22',
    prompt: 'Blast friends who share a lot of mutual hobbies and agree on almost everything',
    targetWord: 'In Common',
    distractorWords: ['In Trouble', 'In Dispute', 'In Danger'],
    wordCategory: 'Friendship',
    explanation: 'Having things in common means sharing similar interests, ideas, or backgrounds.'
  },
  {
    id: 'vi_g8_m_23',
    prompt: 'Blast clothing that is comfortable, informal, and worn for everyday relaxation',
    targetWord: 'Casual',
    distractorWords: ['Formal', 'Glamorous', 'Extravagant'],
    wordCategory: 'Teen Life',
    explanation: 'Casual clothing is relaxed and suitable for everyday leisure.'
  },
  {
    id: 'vi_g8_m_24',
    prompt: 'Blast heating an oven to the required temperature before placing the food inside',
    targetWord: 'Preheat',
    distractorWords: ['Cool Down', 'Defrost', 'Turn Off'],
    wordCategory: 'Cooking',
    explanation: 'Preheating heats an oven to a predetermined cooking temperature before baking.'
  },
  {
    id: 'vi_g8_m_25',
    prompt: 'Blast the telephone apparatus held to your ear and mouth during a call',
    targetWord: 'Receiver',
    distractorWords: ['Battery', 'Charger', 'Screen'],
    wordCategory: 'Phone',
    explanation: 'The receiver is the part of a telephone handset you speak into and listen with.'
  },
  {
    id: 'vi_g8_m_26',
    prompt: 'Blast the act of ending your authenticated session on a digital platform',
    targetWord: 'Log Out',
    distractorWords: ['Sign Up', 'Register', 'Install'],
    wordCategory: 'Internet',
    explanation: 'Logging out securely terminates a user\'s access to a website or account.'
  },
  {
    id: 'vi_g8_m_27',
    prompt: 'Blast the rubberized thermal suit worn by scuba divers to keep warm in cold water',
    targetWord: 'Wetsuit',
    distractorWords: ['Raincoat', 'Kimono', 'Overalls'],
    wordCategory: 'Adventures',
    explanation: 'A wetsuit provides thermal insulation while swimming or surfing in cold water.'
  },
  {
    id: 'vi_g8_m_28',
    prompt: 'Blast the distinctive art, style, and design of buildings and historic monuments',
    targetWord: 'Architecture',
    distractorWords: ['Cuisine', 'Literature', 'Folklore'],
    wordCategory: 'Tourism',
    explanation: 'Architecture refers to the art and practice of designing and erecting buildings.'
  },
  {
    id: 'vi_g8_m_29',
    prompt: 'Blast the daily task of cleaning dirty garments, shirts, and bed sheets',
    targetWord: 'Laundry',
    distractorWords: ['Plumbing', 'Wiring', 'Painting'],
    wordCategory: 'Chores',
    explanation: 'Laundry involves washing, drying, and folding clothes and linen.'
  },
  {
    id: 'vi_g8_m_30',
    prompt: 'Blast the famous international prize awarded annually for biology, physics, or peace',
    targetWord: 'Nobel Prize',
    distractorWords: ['Oscar', 'Grammy', 'Golden Boot'],
    wordCategory: 'Science',
    explanation: 'The Nobel Prize recognizes outstanding contributions to science, literature, and peace.'
  },
  {
    id: 'vi_g8_m_31',
    prompt: 'Blast the scientific measurement of the strength and energy of an earthquake',
    targetWord: 'Magnitude',
    distractorWords: ['Altitude', 'Latitude', 'Humidity'],
    wordCategory: 'Natural Forces',
    explanation: 'Magnitude measures the energy released by an earthquake on the Richter scale.'
  },
  {
    id: 'vi_g8_m_32',
    prompt: 'Blast friends who can be counted on in difficult moments without hesitation',
    targetWord: 'Dependable',
    distractorWords: ['Fickle', 'Shifty', 'Unstable'],
    wordCategory: 'Friendship',
    explanation: 'Dependable means trustworthy and reliable.'
  },
  {
    id: 'vi_g8_m_33',
    prompt: 'Blast following fashionable contemporary clothing and modern music styles',
    targetWord: 'Trendy',
    distractorWords: ['Outdated', 'Old-fashioned', 'Ancient'],
    wordCategory: 'Teen Life',
    explanation: 'Trendy means up to date with the latest fashionable styles.'
  },
  {
    id: 'vi_g8_m_34',
    prompt: 'Blast lightly scattering small pinches of salt, pepper, or herbs over food',
    targetWord: 'Sprinkle',
    distractorWords: ['Pour', 'Drown', 'Crush'],
    wordCategory: 'Cooking',
    explanation: 'Sprinkling scatters small drops or particles lightly over a surface.'
  },
  {
    id: 'vi_g8_m_35',
    prompt: 'Blast returning a telephone call after someone left you a message',
    targetWord: 'Call Back',
    distractorWords: ['Hang Up', 'Block', 'Ignore'],
    wordCategory: 'Phone',
    explanation: 'To call back is to return a phone call.'
  },
  {
    id: 'vi_g8_m_36',
    prompt: 'Blast a computer user who cannot stop browsing, gaming, or scrolling on screens',
    targetWord: 'Internet Addict',
    distractorWords: ['Web Master', 'Coder', 'Technician'],
    wordCategory: 'Internet',
    explanation: 'An internet addict exhibits compulsive, excessive online engagement.'
  },
  {
    id: 'vi_g8_m_37',
    prompt: 'Blast the extreme sport of exploring wild underground caves and caverns',
    targetWord: 'Caving',
    distractorWords: ['Skydiving', 'Rowing', 'Surfing'],
    wordCategory: 'Adventures',
    explanation: 'Caving is the recreational exploration of natural underground cave systems.'
  },
  {
    id: 'vi_g8_m_38',
    prompt: 'Blast a cosy small guest lodge that includes morning breakfast with your room',
    targetWord: 'Bed and Breakfast',
    distractorWords: ['All-inclusive Resort', 'Hostel Dorm', 'Campsite'],
    wordCategory: 'Tourism',
    explanation: 'A Bed and Breakfast (B&B) offers overnight lodging and a morning meal.'
  },
  {
    id: 'vi_g8_m_39',
    prompt: 'Blast being formally in charge of taking care of a specific chore or duty',
    targetWord: 'Responsible For',
    distractorWords: ['Exempt From', 'Unaware Of', 'Bored With'],
    wordCategory: 'Chores',
    explanation: 'Being responsible for a duty means having an obligation to ensure it is done.'
  },
  {
    id: 'vi_g8_m_40',
    prompt: 'Blast a prepared emergency backpack holding first-aid supplies, water, and flashlight',
    targetWord: 'Emergency Kit',
    distractorWords: ['School Bag', 'Luggage Case', 'Tool Box'],
    wordCategory: 'Natural Forces & Safety',
    explanation: 'An emergency kit contains essential supplies needed during a disaster.'
  }
];

// GRADE 8 HARD (40 items)
const g8_hard = [
  {
    id: 'vi_g8_h_01',
    prompt: 'Target someone who speaks carefully to avoid offending or hurting others\' feelings',
    targetWord: 'Tactful',
    distractorWords: ['Blunt', 'Rude', 'Tactless'],
    wordCategory: 'Friendship & Communication',
    explanation: 'Tactful people have sensitivity and skill in dealing with others or difficult issues.'
  },
  {
    id: 'vi_g8_h_02',
    prompt: 'Target having an immense, passionate passion and enthusiasm for a hobby',
    targetWord: 'Keen On',
    distractorWords: ['Averse To', 'Disgusted By', 'Weary Of'],
    wordCategory: 'Teen Life',
    explanation: 'Being keen on something means having an enthusiastic interest in it.'
  },
  {
    id: 'vi_g8_h_03',
    prompt: 'Target culinary substances like garlic, cumin, or cinnamon that enhance flavor',
    targetWord: 'Spices',
    distractorWords: ['Utensils', 'Packaging', 'Grease'],
    wordCategory: 'Cooking',
    explanation: 'Spices are aromatic vegetable substances used to flavor food.'
  },
  {
    id: 'vi_g8_h_04',
    prompt: 'Target the phone situation when background noise makes speech unclear and intermittent',
    targetWord: 'Breaking Up',
    distractorWords: ['Clear', 'Loud', 'Steady'],
    wordCategory: 'Phone',
    explanation: 'When a voice signal cuts in and out, we say the connection is \'breaking up\'.'
  },
  {
    id: 'vi_g8_h_05',
    prompt: 'Target a security protocol where user identity is verified through two distinct steps',
    targetWord: 'Two-Factor Authentication',
    distractorWords: ['Single Login', 'Open Access', 'Guest Account'],
    wordCategory: 'Internet Safety',
    explanation: 'Two-factor authentication adds a second verification factor (like an SMS code) to passwords.'
  },
  {
    id: 'vi_g8_h_06',
    prompt: 'Target someone who actively seeks out dangerous extreme sports for high excitement',
    targetWord: 'Adrenaline Seeker',
    distractorWords: ['Homebody', 'Coward', 'Pessimist'],
    wordCategory: 'Adventures',
    explanation: 'An adrenaline seeker craves thrilling, risky, and exhilarating adventures.'
  },
  {
    id: 'vi_g8_h_07',
    prompt: 'Target cultural customs, monuments, and historical inheritance passed down generations',
    targetWord: 'Heritage',
    distractorWords: ['Pollution', 'Fashion Fads', 'Novelties'],
    wordCategory: 'Tourism',
    explanation: 'Heritage includes cultural traditions, monuments, and historic assets inherited from past generations.'
  },
  {
    id: 'vi_g8_h_08',
    prompt: 'Target the shared domestic duties required to keep a household functioning smoothly',
    targetWord: 'Household Chores',
    distractorWords: ['Office Projects', 'Class Tests', 'Team Sports'],
    wordCategory: 'Chores',
    explanation: 'Household chores encompass cooking, cleaning, laundry, and daily maintenance.'
  },
  {
    id: 'vi_g8_h_09',
    prompt: 'Target the molecular double-helix molecule carrying genetic information in all living cells',
    targetWord: 'DNA',
    distractorWords: ['ATP', 'CO2', 'NaCl'],
    wordCategory: 'Science',
    explanation: 'DNA carries the genetic instructions for development, functioning, and reproduction.'
  },
  {
    id: 'vi_g8_h_10',
    prompt: 'Target an explosive natural disaster where molten magma, ash, and toxic gases erupt',
    targetWord: 'Volcanic Eruption',
    distractorWords: ['Solar Flare', 'Ocean Current', 'Blizzard'],
    wordCategory: 'Natural Forces',
    explanation: 'A volcanic eruption discharges lava, pyroclastics, and gases through a vent in Earth\'s crust.'
  },
  {
    id: 'vi_g8_h_11',
    prompt: 'Target an ally who stands beside you through hardships and never betrays you',
    targetWord: 'True Companion',
    distractorWords: ['Fair-weather Friend', 'Rival', 'Opponent'],
    wordCategory: 'Friendship',
    explanation: 'A true companion remains loyal in good times and through adversity.'
  },
  {
    id: 'vi_g8_h_12',
    prompt: 'Target someone so absorbed in their own self-importance that they ignore others',
    targetWord: 'Self-Centered',
    distractorWords: ['Altruistic', 'Empathetic', 'Thoughtful'],
    wordCategory: 'Friendship & Personality',
    explanation: 'Self-centered people are preoccupied with their own desires and ignore others.'
  },
  {
    id: 'vi_g8_h_13',
    prompt: 'Target culinary guidelines outlining ingredients and exact preparation steps',
    targetWord: 'Recipe',
    distractorWords: ['Receipt', 'Menu', 'Invoice'],
    wordCategory: 'Cooking',
    explanation: 'A recipe gives ingredients and directions for preparing a dish.'
  },
  {
    id: 'vi_g8_h_14',
    prompt: 'Target someone currently engaged on a telephone call and unable to respond',
    targetWord: 'Unavailable',
    distractorWords: ['Free', 'Waiting', 'Present'],
    wordCategory: 'Phone',
    explanation: 'Unavailable means unable to be accessed, contacted, or spoken to at that moment.'
  },
  {
    id: 'vi_g8_h_15',
    prompt: 'Target malicious software created to damage or compromise computer operating systems',
    targetWord: 'Malware',
    distractorWords: ['Hardware', 'Firmware', 'Freeware'],
    wordCategory: 'Internet Safety',
    explanation: 'Malware is malicious software (viruses, trojans, spyware) designed to infiltrate systems.'
  },
  {
    id: 'vi_g8_h_16',
    prompt: 'Target requiring immense physical strength, endurance, and mental stamina',
    targetWord: 'Challenging',
    distractorWords: ['Effortless', 'Trivial', 'Facile'],
    wordCategory: 'Adventures',
    explanation: 'Challenging tests one\'s abilities or resources in a stimulating way.'
  },
  {
    id: 'vi_g8_h_17',
    prompt: 'Target a vacation destination renowned for stunning natural scenery and coastlines',
    targetWord: 'Seaside Resort',
    distractorWords: ['Industrial Zone', 'Power Plant', 'Landfill'],
    wordCategory: 'Tourism',
    explanation: 'A seaside resort is a coastal town where tourism and beach recreation thrive.'
  },
  {
    id: 'vi_g8_h_18',
    prompt: 'Target an unfair division where one person does all the domestic cleaning alone',
    targetWord: 'Unequal Burden',
    distractorWords: ['Fair Share', 'Equal Teamwork', 'Mutual Duty'],
    wordCategory: 'Chores',
    explanation: 'An unequal burden leaves one person unfairly responsible for all labor.'
  },
  {
    id: 'vi_g8_h_19',
    prompt: 'Target a scientist who conducts scientific research to uncover new universal truths',
    targetWord: 'Researcher',
    distractorWords: ['Celebrity', 'Politician', 'Trader'],
    wordCategory: 'Science',
    explanation: 'A researcher investigates materials and sources in order to establish facts and reach conclusions.'
  },
  {
    id: 'vi_g8_h_20',
    prompt: 'Target specialized emergency teams trained to dig out survivors trapped under rubble',
    targetWord: 'Search and Rescue',
    distractorWords: ['Sales Department', 'Accounting Staff', 'Ticket Collectors'],
    wordCategory: 'Natural Forces & Safety',
    explanation: 'Search and rescue teams locate and extract disaster victims from collapsed debris.'
  },
  {
    id: 'vi_g8_h_21',
    prompt: 'Target someone who refuses to compromise, holding firmly to their viewpoints',
    targetWord: 'Uncompromising',
    distractorWords: ['Yielding', 'Submissive', 'Flexible'],
    wordCategory: 'Friendship & Personality',
    explanation: 'Uncompromising people will not make concessions or change their stance.'
  },
  {
    id: 'vi_g8_h_22',
    prompt: 'Target having an intense aversion to something to the point of being unable to tolerate it',
    targetWord: 'Can\'t Stand',
    distractorWords: ['Adore', 'Cherish', 'Favour'],
    wordCategory: 'Teen Life',
    explanation: '\'Can\'t stand\' expresses extreme dislike or intolerance.'
  },
  {
    id: 'vi_g8_h_23',
    prompt: 'Target cooking food directly over open glowing charcoal flames on a metal grate',
    targetWord: 'Grill',
    distractorWords: ['Boil', 'Steam', 'Freeze'],
    wordCategory: 'Cooking',
    explanation: 'Grilling cooks food over a rack directly above heat sources like charcoal.'
  },
  {
    id: 'vi_g8_h_24',
    prompt: 'Target connecting a telephone caller through the central switchboard to a colleague',
    targetWord: 'Put Through',
    distractorWords: ['Hang Up', 'Hang On', 'Turn Off'],
    wordCategory: 'Phone',
    explanation: '\'Put someone through\' is to connect them to the requested party on a telephone line.'
  },
  {
    id: 'vi_g8_h_25',
    prompt: 'Target deceptive emails disguised as legitimate banks attempting to steal passwords',
    targetWord: 'Phishing',
    distractorWords: ['Networking', 'Streaming', 'Blogging'],
    wordCategory: 'Internet Safety',
    explanation: 'Phishing is the fraudulent practice of sending emails to induce individuals to reveal passwords.'
  },
  {
    id: 'vi_g8_h_26',
    prompt: 'Target the intense psychological surge of excitement experienced during risky sports',
    targetWord: 'Adrenaline Rush',
    distractorWords: ['Fatigue', 'Drowsiness', 'Boredom'],
    wordCategory: 'Adventures',
    explanation: 'An adrenaline rush is a physiological surge of energy caused by high excitement or danger.'
  },
  {
    id: 'vi_g8_h_27',
    prompt: 'Target travel to remote, unspoiled villages and farming communities away from cities',
    targetWord: 'Rural Tourism',
    distractorWords: ['Metropolitan Transit', 'Urban Commute', 'Factory Tour'],
    wordCategory: 'Tourism',
    explanation: 'Rural tourism takes place in countryside areas celebrating agrarian lifestyles.'
  },
  {
    id: 'vi_g8_h_28',
    prompt: 'Target taking personal initiative and responsibility for domestic cleaning duties',
    targetWord: 'Duty',
    distractorWords: ['Privilege', 'Holiday', 'Reward'],
    wordCategory: 'Chores',
    explanation: 'A duty is a moral or legal obligation.'
  },
  {
    id: 'vi_g8_h_29',
    prompt: 'Target medical substances created to destroy harmful infectious bacterial organisms',
    targetWord: 'Antibiotics',
    distractorWords: ['Poisons', 'Toxins', 'Pollutants'],
    wordCategory: 'Science',
    explanation: 'Antibiotics are medicines that fight bacterial infections in humans and animals.'
  },
  {
    id: 'vi_g8_h_30',
    prompt: 'Target precautionary measures and rules established to minimize disaster casualties',
    targetWord: 'Safety Precautions',
    distractorWords: ['Careless Habits', 'Reckless Gambles', 'Neglect'],
    wordCategory: 'Natural Forces & Safety',
    explanation: 'Safety precautions are measures taken in advance to prevent damage or injury.'
  },
  {
    id: 'vi_g8_h_31',
    prompt: 'Target someone who stands by you in public and defends your honor against rumors',
    targetWord: 'Loyal Friend',
    distractorWords: ['Slanderer', 'Gossiper', 'Opponent'],
    wordCategory: 'Friendship',
    explanation: 'A loyal friend defends and upholds you against slander and adversity.'
  },
  {
    id: 'vi_g8_h_32',
    prompt: 'Target being so attached to modern smartphones that one cannot function without them',
    targetWord: 'Device Dependence',
    distractorWords: ['Digital Literacy', 'Tech Mastery', 'Offline Peace'],
    wordCategory: 'Teen Life & Tech',
    explanation: 'Device dependence refers to excessive reliance on personal electronics.'
  },
  {
    id: 'vi_g8_h_33',
    prompt: 'Target adding fragrant fresh herbs like parsley, oregano, or mint to a dish',
    targetWord: 'Herbs',
    distractorWords: ['Stones', 'Metals', 'Plastics'],
    wordCategory: 'Cooking',
    explanation: 'Herbs are aromatic plants used to flavor and garnish food.'
  },
  {
    id: 'vi_g8_h_34',
    prompt: 'Target the telephone greeting used in business: "How may I direct your call?"',
    targetWord: 'Formal Reception',
    distractorWords: ['Casual Banter', 'Rude Interruption', 'Silent Hangup'],
    wordCategory: 'Phone Etiquette',
    explanation: 'Formal reception denotes professional telephonic communication standards.'
  },
  {
    id: 'vi_g8_h_35',
    prompt: 'Target the safety rule never to meet face-to-face with an online stranger alone',
    targetWord: 'Stranger Danger',
    distractorWords: ['Social Gathering', 'School Reunion', 'Public Parade'],
    wordCategory: 'Internet Safety',
    explanation: 'Online safety warns against meeting unknown digital contacts in unsupervised physical settings.'
  },
  {
    id: 'vi_g8_h_36',
    prompt: 'Target the psychological feeling of absolute freedom and exhilaration while flying',
    targetWord: 'Weightlessness',
    distractorWords: ['Burden', 'Claustrophobia', 'Fatigue'],
    wordCategory: 'Adventures',
    explanation: 'Weightlessness describes the sensation of floating freely through the air.'
  },
  {
    id: 'vi_g8_h_37',
    prompt: 'Target an official UNESCO recognized site celebrated for universal cultural importance',
    targetWord: 'World Heritage Site',
    distractorWords: ['Commercial Mall', 'Bus Terminal', 'Theme Park'],
    wordCategory: 'Tourism',
    explanation: 'UNESCO World Heritage Sites possess outstanding universal value to humanity.'
  },
  {
    id: 'vi_g8_h_38',
    prompt: 'Target maintaining hygiene and cleanliness in food preparation and living spaces',
    targetWord: 'Sanitation',
    distractorWords: ['Contamination', 'Squalor', 'Pollution'],
    wordCategory: 'Chores & Health',
    explanation: 'Sanitation refers to public health conditions related to clean water and cleanliness.'
  },
  {
    id: 'vi_g8_h_39',
    prompt: 'Target the scientific process of testing hypotheses through rigorous control and observation',
    targetWord: 'Scientific Method',
    distractorWords: ['Superstition', 'Guesswork', 'Rumour'],
    wordCategory: 'Science',
    explanation: 'The scientific method is a rigorous empirical method of acquiring knowledge.'
  },
  {
    id: 'vi_g8_h_40',
    prompt: 'Target the high-pitch sound device used in emergency survival kits to signal rescuers',
    targetWord: 'Whistle',
    distractorWords: ['Mirror', 'Blanket', 'Radio'],
    wordCategory: 'Natural Forces & Safety',
    explanation: 'An emergency whistle produces a piercing acoustic signal audible across long distances to rescue teams.'
  }
];

// Helper to generate TS file
function generateFile() {
  const allGroups = [
    { name: 'g7_easy', items: g7_easy },
    { name: 'g7_medium', items: g7_medium },
    { name: 'g7_hard', items: g7_hard },
    { name: 'g8_easy', items: g8_easy },
    { name: 'g8_medium', items: g8_medium },
    { name: 'g8_hard', items: g8_hard },
  ];

  for (const group of allGroups) {
    if (group.items.length !== 40) {
      throw new Error(`Group ${group.name} has ${group.items.length} items, expected 40`);
    }
    for (const item of group.items) {
      if (!item.id || !item.prompt || !item.targetWord || !item.distractorWords || !item.wordCategory) {
        throw new Error(`Item ${JSON.stringify(item)} is invalid`);
      }
      if (item.distractorWords.length < 2) {
        throw new Error(`Item ${item.id} has fewer than 2 distractors`);
      }
      if (item.distractorWords.includes(item.targetWord)) {
        throw new Error(`Item ${item.id} targetWord is in distractorWords!`);
      }
      const uniqueDistractors = new Set(item.distractorWords);
      if (uniqueDistractors.size !== item.distractorWords.length) {
        throw new Error(`Item ${item.id} has duplicate distractors: ${item.distractorWords}`);
      }
    }
  }

  const tsContent = `/**
 * UNIT REVIEW ARCADE — VOCABULARY INVADERS DATA BANK (PHASE 10A)
 * Version: 10.0.0
 * 
 * 240 validated curriculum-aligned vocabulary defender questions:
 * - Grade 7: Easy (40), Medium (40), Hard (40)
 * - Grade 8: Easy (40), Medium (40), Hard (40)
 * 
 * Aligned strictly to Turkish MEB English Curriculum & LGS outcomes.
 */

import type { VocabularyInvadersBank } from '../../types/gamesZone';

export const VOCABULARY_INVADERS_BANK: VocabularyInvadersBank = {
  'grade-7': {
    easy: ${JSON.stringify(g7_easy, null, 2)},
    medium: ${JSON.stringify(g7_medium, null, 2)},
    hard: ${JSON.stringify(g7_hard, null, 2)},
  },
  'grade-8': {
    easy: ${JSON.stringify(g8_easy, null, 2)},
    medium: ${JSON.stringify(g8_medium, null, 2)},
    hard: ${JSON.stringify(g8_hard, null, 2)},
  },
};
`;

  const targetPath = path.resolve('src/data/gamesZone/vocabularyInvadersData.ts');
  fs.writeFileSync(targetPath, tsContent, 'utf-8');
  console.log('Successfully generated vocabularyInvadersData.ts with 240 validated questions.');
}

generateFile();
