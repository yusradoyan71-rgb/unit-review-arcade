/**
 * UNIT REVIEW ARCADE — WORD NINJA DATA BANK (PHASE 7A)
 * Version: 7.0.0
 * 
 * 240 validated unique questions across:
 * - Grade 7: Easy (40), Medium (40), Hard (40)
 * - Grade 8: Easy (40), Medium (40), Hard (40)
 */

import type { WordNinjaBank } from '../../types/gamesZone';

export const WORD_NINJA_BANK: WordNinjaBank = {
  'grade-7': {
    easy: [
      { id: 'wn_g7_e_01', prompt: "Slice the OPPOSITE of 'Big'", promptType: 'antonym', correctWord: 'Small', distractorWords: ['Huge', 'Large', 'Giant'] },
      { id: 'wn_g7_e_02', prompt: "Slice the OPPOSITE of 'Hot'", promptType: 'antonym', correctWord: 'Cold', distractorWords: ['Warm', 'Boiling', 'Sunny'] },
      { id: 'wn_g7_e_03', prompt: "Slice the word for 'Day after Monday'", promptType: 'meaning', correctWord: 'Tuesday', distractorWords: ['Sunday', 'Friday', 'Thursday'] },
      { id: 'wn_g7_e_04', prompt: "Slice the animal that can FLY", promptType: 'category', correctWord: 'Eagle', distractorWords: ['Tiger', 'Elephant', 'Whale'] },
      { id: 'wn_g7_e_05', prompt: "Slice the OPPOSITE of 'Fast'", promptType: 'antonym', correctWord: 'Slow', distractorWords: ['Quick', 'Rapid', 'Swift'] },
      { id: 'wn_g7_e_06', prompt: "Slice the FRUIT among these words", promptType: 'category', correctWord: 'Banana', distractorWords: ['Carrot', 'Potato', 'Onion'] },
      { id: 'wn_g7_e_07', prompt: "Slice the OPPOSITE of 'Happy'", promptType: 'antonym', correctWord: 'Sad', distractorWords: ['Glad', 'Joyful', 'Cheerful'] },
      { id: 'wn_g7_e_08', prompt: "Slice the word for 'Mother\\'s brother'", promptType: 'meaning', correctWord: 'Uncle', distractorWords: ['Cousin', 'Nephew', 'Grandpa'] },
      { id: 'wn_g7_e_09', prompt: "Slice the OPPOSITE of 'Easy'", promptType: 'antonym', correctWord: 'Difficult', distractorWords: ['Simple', 'Light', 'Clear'] },
      { id: 'wn_g7_e_10', prompt: "Slice the colour of grass", promptType: 'meaning', correctWord: 'Green', distractorWords: ['Purple', 'Orange', 'Pink'] },
      { id: 'wn_g7_e_11', prompt: "Slice the OPPOSITE of 'Up'", promptType: 'antonym', correctWord: 'Down', distractorWords: ['Above', 'High', 'Sky'] },
      { id: 'wn_g7_e_12', prompt: "Slice the school subject with NUMBERS", promptType: 'meaning', correctWord: 'Maths', distractorWords: ['Art', 'Music', 'Drama'] },
      { id: 'wn_g7_e_13', prompt: "Slice the OPPOSITE of 'Early'", promptType: 'antonym', correctWord: 'Late', distractorWords: ['Soon', 'Fast', 'First'] },
      { id: 'wn_g7_e_14', prompt: "Slice the item you wear on your FEET", promptType: 'category', correctWord: 'Shoes', distractorWords: ['Hat', 'Scarf', 'Gloves'] },
      { id: 'wn_g7_e_15', prompt: "Slice the SYNONYM of 'Start'", promptType: 'synonym', correctWord: 'Begin', distractorWords: ['Finish', 'Stop', 'Pause'] },
      { id: 'wn_g7_e_16', prompt: "Slice the OPPOSITE of 'Clean'", promptType: 'antonym', correctWord: 'Dirty', distractorWords: ['Tidy', 'Neat', 'Bright'] },
      { id: 'wn_g7_e_17', prompt: "Slice the meal you eat in the MORNING", promptType: 'meaning', correctWord: 'Breakfast', distractorWords: ['Lunch', 'Dinner', 'Supper'] },
      { id: 'wn_g7_e_18', prompt: "Slice the OPPOSITE of 'Quiet'", promptType: 'antonym', correctWord: 'Noisy', distractorWords: ['Calm', 'Silent', 'Peaceful'] },
      { id: 'wn_g7_e_19', prompt: "Slice the room where you SLEEP", promptType: 'meaning', correctWord: 'Bedroom', distractorWords: ['Kitchen', 'Bathroom', 'Garage'] },
      { id: 'wn_g7_e_20', prompt: "Slice the OPPOSITE of 'Near'", promptType: 'antonym', correctWord: 'Far', distractorWords: ['Close', 'Next', 'Here'] },
      { id: 'wn_g7_e_21', prompt: "Slice the vehicle with TWO wheels", promptType: 'meaning', correctWord: 'Bicycle', distractorWords: ['Bus', 'Lorry', 'Train'] },
      { id: 'wn_g7_e_22', prompt: "Slice the OPPOSITE of 'Rich'", promptType: 'antonym', correctWord: 'Poor', distractorWords: ['Wealthy', 'Lucky', 'Fine'] },
      { id: 'wn_g7_e_23', prompt: "Slice the season after Winter", promptType: 'meaning', correctWord: 'Spring', distractorWords: ['Autumn', 'Summer', 'Fall'] },
      { id: 'wn_g7_e_24', prompt: "Slice the OPPOSITE of 'Heavy'", promptType: 'antonym', correctWord: 'Light', distractorWords: ['Hard', 'Dark', 'Thick'] },
      { id: 'wn_g7_e_25', prompt: "Slice the drink made from cows", promptType: 'meaning', correctWord: 'Milk', distractorWords: ['Lemonade', 'Coffee', 'Juice'] },
      { id: 'wn_g7_e_26', prompt: "Slice the OPPOSITE of 'Safe'", promptType: 'antonym', correctWord: 'Dangerous', distractorWords: ['Secure', 'Calm', 'Gentle'] },
      { id: 'wn_g7_e_27', prompt: "Slice the word that is a VERB", promptType: 'category', correctWord: 'Run', distractorWords: ['Table', 'Yellow', 'Slowly'] },
      { id: 'wn_g7_e_28', prompt: "Slice the OPPOSITE of 'Young'", promptType: 'antonym', correctWord: 'Old', distractorWords: ['New', 'Fresh', 'Little'] },
      { id: 'wn_g7_e_29', prompt: "Slice the thing you use to WRITE on paper", promptType: 'meaning', correctWord: 'Pencil', distractorWords: ['Ruler', 'Eraser', 'Desk'] },
      { id: 'wn_g7_e_30', prompt: "Slice the OPPOSITE of 'Open'", promptType: 'antonym', correctWord: 'Closed', distractorWords: ['Free', 'Wide', 'Empty'] },
      { id: 'wn_g7_e_31', prompt: "Slice the place where DOCTORS work", promptType: 'meaning', correctWord: 'Hospital', distractorWords: ['Cinema', 'Bank', 'Library'] },
      { id: 'wn_g7_e_32', prompt: "Slice the SYNONYM of 'Pretty'", promptType: 'synonym', correctWord: 'Beautiful', distractorWords: ['Ugly', 'Plain', 'Scary'] },
      { id: 'wn_g7_e_33', prompt: "Slice the OPPOSITE of 'Win'", promptType: 'antonym', correctWord: 'Lose', distractorWords: ['Gain', 'Catch', 'Score'] },
      { id: 'wn_g7_e_34', prompt: "Slice the object you use to TELL TIME", promptType: 'meaning', correctWord: 'Clock', distractorWords: ['Mirror', 'Lamp', 'Window'] },
      { id: 'wn_g7_e_35', prompt: "Slice the OPPOSITE of 'Dark'", promptType: 'antonym', correctWord: 'Bright', distractorWords: ['Black', 'Dim', 'Night'] },
      { id: 'wn_g7_e_36', prompt: "Slice the word for 'Twelve months'", promptType: 'meaning', correctWord: 'Year', distractorWords: ['Week', 'Hour', 'Century'] },
      { id: 'wn_g7_e_37', prompt: "Slice the OPPOSITE of 'Strong'", promptType: 'antonym', correctWord: 'Weak', distractorWords: ['Brave', 'Tough', 'Hard'] },
      { id: 'wn_g7_e_38', prompt: "Slice the pet that BARKS", promptType: 'meaning', correctWord: 'Dog', distractorWords: ['Cat', 'Rabbit', 'Hamster'] },
      { id: 'wn_g7_e_39', prompt: "Slice the OPPOSITE of 'Empty'", promptType: 'antonym', correctWord: 'Full', distractorWords: ['Bare', 'Clear', 'Open'] },
      { id: 'wn_g7_e_40', prompt: "Slice the building where BOOKS are kept to borrow", promptType: 'meaning', correctWord: 'Library', distractorWords: ['Supermarket', 'Post office', 'Bakery'] },
    ],
    medium: [
      { id: 'wn_g7_m_01', prompt: "Slice the PAST TENSE of 'Go'", promptType: 'past_tense', correctWord: 'Went', distractorWords: ['Goed', 'Gone', 'Going'] },
      { id: 'wn_g7_m_02', prompt: "Slice the SYNONYM of 'Tired'", promptType: 'synonym', correctWord: 'Exhausted', distractorWords: ['Energetic', 'Lively', 'Excited'] },
      { id: 'wn_g7_m_03', prompt: "Slice the PAST TENSE of 'Buy'", promptType: 'past_tense', correctWord: 'Bought', distractorWords: ['Buyed', 'Brought', 'Batten'] },
      { id: 'wn_g7_m_04', prompt: "Slice the person who designs new buildings", promptType: 'meaning', correctWord: 'Architect', distractorWords: ['Mechanic', 'Plumber', 'Dentist'] },
      { id: 'wn_g7_m_05', prompt: "Slice the PAST TENSE of 'Catch'", promptType: 'past_tense', correctWord: 'Caught', distractorWords: ['Catched', 'Cought', 'Cotched'] },
      { id: 'wn_g7_m_06', prompt: "Slice the OPPOSITE of 'Generous'", promptType: 'antonym', correctWord: 'Stingy', distractorWords: ['Kind', 'Helpful', 'Polite'] },
      { id: 'wn_g7_m_07', prompt: "Slice the word that collocates with: '_____ homework'", promptType: 'meaning', correctWord: 'Do', distractorWords: ['Make', 'Create', 'Play'] },
      { id: 'wn_g7_m_08', prompt: "Slice the PAST TENSE of 'Write'", promptType: 'past_tense', correctWord: 'Wrote', distractorWords: ['Written', 'Writed', 'Writted'] },
      { id: 'wn_g7_m_09', prompt: "Slice the word meaning 'Extremely cold'", promptType: 'meaning', correctWord: 'Freezing', distractorWords: ['Boiling', 'Lukewarm', 'Mild'] },
      { id: 'wn_g7_m_10', prompt: "Slice the PAST TENSE of 'Think'", promptType: 'past_tense', correctWord: 'Thought', distractorWords: ['Thanked', 'Thinked', 'Tought'] },
      { id: 'wn_g7_m_11', prompt: "Slice the OPPOSITE of 'Polite'", promptType: 'antonym', correctWord: 'Rude', distractorWords: ['Gentle', 'Kind', 'Patient'] },
      { id: 'wn_g7_m_12', prompt: "Slice the word that collocates with: '_____ a mistake'", promptType: 'meaning', correctWord: 'Make', distractorWords: ['Do', 'Write', 'Work'] },
      { id: 'wn_g7_m_13', prompt: "Slice the PAST TENSE of 'Swim'", promptType: 'past_tense', correctWord: 'Swam', distractorWords: ['Swum', 'Swimmed', 'Swom'] },
      { id: 'wn_g7_m_14', prompt: "Slice the adjective meaning 'Not afraid of danger'", promptType: 'meaning', correctWord: 'Brave', distractorWords: ['Cowardly', 'Timid', 'Shy'] },
      { id: 'wn_g7_m_15', prompt: "Slice the PAST TENSE of 'Speak'", promptType: 'past_tense', correctWord: 'Spoke', distractorWords: ['Spoken', 'Speaked', 'Spaked'] },
      { id: 'wn_g7_m_16', prompt: "Slice the SYNONYM of 'Huge'", promptType: 'synonym', correctWord: 'Enormous', distractorWords: ['Tiny', 'Narrow', 'Slim'] },
      { id: 'wn_g7_m_17', prompt: "Slice the PAST TENSE of 'Fly'", promptType: 'past_tense', correctWord: 'Flew', distractorWords: ['Flown', 'Flyed', 'Flowed'] },
      { id: 'wn_g7_m_18', prompt: "Slice the animal habitat with sand and very little water", promptType: 'meaning', correctWord: 'Desert', distractorWords: ['Jungle', 'Ocean', 'Forest'] },
      { id: 'wn_g7_m_19', prompt: "Slice the PAST TENSE of 'Teach'", promptType: 'past_tense', correctWord: 'Taught', distractorWords: ['Teached', 'Tought', 'Thought'] },
      { id: 'wn_g7_m_20', prompt: "Slice the OPPOSITE of 'Patient'", promptType: 'antonym', correctWord: 'Impatient', distractorWords: ['Calm', 'Slow', 'Quiet'] },
      { id: 'wn_g7_m_21', prompt: "Slice the storm with very strong winds", promptType: 'meaning', correctWord: 'Hurricane', distractorWords: ['Breeze', 'Drizzle', 'Shower'] },
      { id: 'wn_g7_m_22', prompt: "Slice the PAST TENSE of 'Eat'", promptType: 'past_tense', correctWord: 'Ate', distractorWords: ['Eaten', 'Eated', 'Et'] },
      { id: 'wn_g7_m_23', prompt: "Slice the SYNONYM of 'Smart'", promptType: 'synonym', correctWord: 'Intelligent', distractorWords: ['Foolish', 'Clumsy', 'Silly'] },
      { id: 'wn_g7_m_24', prompt: "Slice the PAST TENSE of 'Sleep'", promptType: 'past_tense', correctWord: 'Slept', distractorWords: ['Sleeped', 'Slapt', 'Sleeping'] },
      { id: 'wn_g7_m_25', prompt: "Slice the OPPOSITE of 'Honest'", promptType: 'antonym', correctWord: 'Dishonest', distractorWords: ['Sincere', 'Truthful', 'Loyal'] },
      { id: 'wn_g7_m_26', prompt: "Slice the PAST TENSE of 'Find'", promptType: 'past_tense', correctWord: 'Found', distractorWords: ['Finded', 'Founded', 'Fond'] },
      { id: 'wn_g7_m_27', prompt: "Slice the sport played with a RACKET and shuttlecock", promptType: 'meaning', correctWord: 'Badminton', distractorWords: ['Football', 'Basketball', 'Hockey'] },
      { id: 'wn_g7_m_28', prompt: "Slice the PAST TENSE of 'Drive'", promptType: 'past_tense', correctWord: 'Drove', distractorWords: ['Driven', 'Drived', 'Drawe'] },
      { id: 'wn_g7_m_29', prompt: "Slice the SYNONYM of 'Scared'", promptType: 'synonym', correctWord: 'Frightened', distractorWords: ['Bold', 'Calm', 'Relaxed'] },
      { id: 'wn_g7_m_30', prompt: "Slice the PAST TENSE of 'Give'", promptType: 'past_tense', correctWord: 'Gave', distractorWords: ['Given', 'Gived', 'Gaven'] },
      { id: 'wn_g7_m_31', prompt: "Slice the word meaning 'To protect nature from harm'", promptType: 'meaning', correctWord: 'Conserve', distractorWords: ['Pollute', 'Destroy', 'Waste'] },
      { id: 'wn_g7_m_32', prompt: "Slice the PAST TENSE of 'Hear'", promptType: 'past_tense', correctWord: 'Heard', distractorWords: ['Heared', 'Heardn', 'Hore'] },
      { id: 'wn_g7_m_33', prompt: "Slice the OPPOSITE of 'Friendly'", promptType: 'antonym', correctWord: 'Unfriendly', distractorWords: ['Warm', 'Sociable', 'Kind'] },
      { id: 'wn_g7_m_34', prompt: "Slice the PAST TENSE of 'Know'", promptType: 'past_tense', correctWord: 'Knew', distractorWords: ['Known', 'Knowed', 'Knewed'] },
      { id: 'wn_g7_m_35', prompt: "Slice the body part between the neck and the arm", promptType: 'meaning', correctWord: 'Shoulder', distractorWords: ['Ankle', 'Knee', 'Elbow'] },
      { id: 'wn_g7_m_36', prompt: "Slice the PAST TENSE of 'Take'", promptType: 'past_tense', correctWord: 'Took', distractorWords: ['Taken', 'Taked', 'Token'] },
      { id: 'wn_g7_m_37', prompt: "Slice the SYNONYM of 'Glad'", promptType: 'synonym', correctWord: 'Pleased', distractorWords: ['Angry', 'Upset', 'Miserable'] },
      { id: 'wn_g7_m_38', prompt: "Slice the PAST TENSE of 'Bring'", promptType: 'past_tense', correctWord: 'Brought', distractorWords: ['Bought', 'Bringed', 'Brung'] },
      { id: 'wn_g7_m_39', prompt: "Slice the place where ships load and unload goods", promptType: 'meaning', correctWord: 'Harbour', distractorWords: ['Runway', 'Station', 'Pavement'] },
      { id: 'wn_g7_m_40', prompt: "Slice the PAST TENSE of 'Lose'", promptType: 'past_tense', correctWord: 'Lost', distractorWords: ['Losed', 'Loosed', 'Lossed'] },
    ],
    hard: [
      { id: 'wn_g7_h_01', prompt: "Slice the word for 'never changes mind'", promptType: 'meaning', correctWord: 'Stubborn', distractorWords: ['Generous', 'Outgoing', 'Honest'], contentVersion: 2 },
      { id: 'wn_g7_h_02', prompt: "Slice the SYNONYM of 'Historic'", promptType: 'synonym', correctWord: 'Ancient', distractorWords: ['Modern', 'Futuristic', 'Recent'], contentVersion: 2 },
      { id: 'wn_g7_h_03', prompt: "Slice the word for 'always on time'", promptType: 'meaning', correctWord: 'Punctual', distractorWords: ['Clumsy', 'Lazy', 'Selfish'], contentVersion: 2 },
      { id: 'wn_g7_h_04', prompt: "Slice the OPPOSITE of 'Generous'", promptType: 'antonym', correctWord: 'Selfish', distractorWords: ['Helpful', 'Friendly', 'Polite'], contentVersion: 2 },
      { id: 'wn_g7_h_05', prompt: "Slice the word for 'drops things easily'", promptType: 'meaning', correctWord: 'Clumsy', distractorWords: ['Stubborn', 'Punctual', 'Honest'], contentVersion: 2 },
      { id: 'wn_g7_h_06', prompt: "Slice the damage caused by trash and smoke", promptType: 'meaning', correctWord: 'Pollution', distractorWords: ['Recycling', 'Oxygen', 'Wildlife'], contentVersion: 2 },
      { id: 'wn_g7_h_07', prompt: "Slice the word for 'natural world around us'", promptType: 'meaning', correctWord: 'Environment', distractorWords: ['Building', 'Factory', 'Highway'], contentVersion: 2 },
      { id: 'wn_g7_h_08', prompt: "Slice the word for 'from very long ago'", promptType: 'meaning', correctWord: 'Ancient', distractorWords: ['Modern', 'Recent', 'Current'], contentVersion: 2 },
      { id: 'wn_g7_h_09', prompt: "Slice the person who watches a sports match", promptType: 'meaning', correctWord: 'Spectator', distractorWords: ['Referee', 'Coach', 'Player'], contentVersion: 2 },
      { id: 'wn_g7_h_10', prompt: "Slice the tools needed for playing a sport", promptType: 'meaning', correctWord: 'Equipment', distractorWords: ['Medal', 'Uniform', 'Trophy'], contentVersion: 2 },
      { id: 'wn_g7_h_11', prompt: "Slice the sport of shooting arrows with bows", promptType: 'meaning', correctWord: 'Archery', distractorWords: ['Jogging', 'Swimming', 'Cycling'], contentVersion: 2 },
      { id: 'wn_g7_h_12', prompt: "Slice the device used to observe distant stars", promptType: 'meaning', correctWord: 'Telescope', distractorWords: ['Microscope', 'Compass', 'Thermometer'], contentVersion: 2 },
      { id: 'wn_g7_h_13', prompt: "Slice the verb for 'finish university or school'", promptType: 'meaning', correctWord: 'Graduate', distractorWords: ['Enroll', 'Fail', 'Repeat'], contentVersion: 2 },
      { id: 'wn_g7_h_14', prompt: "Slice the verb for 'design something completely new'", promptType: 'meaning', correctWord: 'Invent', distractorWords: ['Destroy', 'Borrow', 'Forget'], contentVersion: 2 },
      { id: 'wn_g7_h_15', prompt: "Slice the prize awarded for great success", promptType: 'meaning', correctWord: 'Award', distractorWords: ['Penalty', 'Tax', 'Ticket'], contentVersion: 2 },
      { id: 'wn_g7_h_16', prompt: "Slice the natural event when the ground shakes", promptType: 'meaning', correctWord: 'Earthquake', distractorWords: ['Flood', 'Blizzard', 'Drought'], contentVersion: 2 },
      { id: 'wn_g7_h_17', prompt: "Slice the word for 'animals in danger of dying out'", promptType: 'meaning', correctWord: 'Endangered', distractorWords: ['Common', 'Protected', 'Domestic'], contentVersion: 2 },
      { id: 'wn_g7_h_18', prompt: "Slice the word for 'species no longer alive'", promptType: 'meaning', correctWord: 'Extinct', distractorWords: ['Growing', 'Wild', 'Living'], contentVersion: 2 },
      { id: 'wn_g7_h_19', prompt: "Slice the natural home where wild animals live", promptType: 'meaning', correctWord: 'Habitat', distractorWords: ['Cage', 'Sanctuary', 'Zoo'], contentVersion: 2 },
      { id: 'wn_g7_h_20', prompt: "Slice the weather disaster of no rain for months", promptType: 'meaning', correctWord: 'Drought', distractorWords: ['Flood', 'Monsoon', 'Hail'], contentVersion: 2 },
      { id: 'wn_g7_h_21', prompt: "Slice the animal that eats only other animals", promptType: 'meaning', correctWord: 'Carnivore', distractorWords: ['Herbivore', 'Insect', 'Reptile'], contentVersion: 2 },
      { id: 'wn_g7_h_22', prompt: "Slice the animal that eats only green plants", promptType: 'meaning', correctWord: 'Herbivore', distractorWords: ['Carnivore', 'Predator', 'Parasite'], contentVersion: 2 },
      { id: 'wn_g7_h_23', prompt: "Slice the animal class of snakes and crocodiles", promptType: 'meaning', correctWord: 'Reptile', distractorWords: ['Mammal', 'Bird', 'Amphibian'], contentVersion: 2 },
      { id: 'wn_g7_h_24', prompt: "Slice the TV programme about real science and nature", promptType: 'meaning', correctWord: 'Documentary', distractorWords: ['Sitcom', 'Soap opera', 'Cartoons'], contentVersion: 2 },
      { id: 'wn_g7_h_25', prompt: "Slice the funny comedy show with recurring characters", promptType: 'meaning', correctWord: 'Sitcom', distractorWords: ['News', 'Documentary', 'Weather'], contentVersion: 2 },
      { id: 'wn_g7_h_26', prompt: "Slice the short advertisement video shown on television", promptType: 'meaning', correctWord: 'Commercial', distractorWords: ['Episode', 'Series', 'Channel'], contentVersion: 2 },
      { id: 'wn_g7_h_27', prompt: "Slice the card sent to invite party guests", promptType: 'meaning', correctWord: 'Invitation', distractorWords: ['Bill', 'Receipt', 'Ticket'], contentVersion: 2 },
      { id: 'wn_g7_h_28', prompt: "Slice the verb for 'make a room look festive'", promptType: 'meaning', correctWord: 'Decorate', distractorWords: ['Destroy', 'Clean', 'Leave'], contentVersion: 2 },
      { id: 'wn_g7_h_29', prompt: "Slice the special clothes worn for costume parties", promptType: 'meaning', correctWord: 'Costume', distractorWords: ['Uniform', 'Pyjamas', 'Coat'], contentVersion: 2 },
      { id: 'wn_g7_h_30', prompt: "Slice the time and events that are yet to come", promptType: 'meaning', correctWord: 'Future', distractorWords: ['History', 'Yesterday', 'Past'], contentVersion: 2 },
      { id: 'wn_g7_h_31', prompt: "Slice the word for 'chosen professional life work'", promptType: 'meaning', correctWord: 'Career', distractorWords: ['Hobby', 'Break', 'Holiday'], contentVersion: 2 },
      { id: 'wn_g7_h_32', prompt: "Slice clean electrical power generated from the sun", promptType: 'meaning', correctWord: 'Solar', distractorWords: ['Nuclear', 'Coal', 'Gas'], contentVersion: 2 },
      { id: 'wn_g7_h_33', prompt: "Slice the verb for 'say what will happen in future'", promptType: 'meaning', correctWord: 'Predict', distractorWords: ['Remember', 'Forget', 'Regret'], contentVersion: 2 },
      { id: 'wn_g7_h_34', prompt: "Slice the shop that bakes and sells fresh bread", promptType: 'meaning', correctWord: 'Bakery', distractorWords: ['Chemist', 'Cinema', 'Bank'], contentVersion: 2 },
      { id: 'wn_g7_h_35', prompt: "Slice the shop where you buy medicine and pills", promptType: 'meaning', correctWord: 'Pharmacy', distractorWords: ['Bakery', 'Library', 'Museum'], contentVersion: 2 },
      { id: 'wn_g7_h_36', prompt: "Slice the building where the city mayor works", promptType: 'meaning', correctWord: 'City Hall', distractorWords: ['Art Gallery', 'Police Station', 'Bakery'], contentVersion: 2 },
      { id: 'wn_g7_h_37', prompt: "Slice the public place where famous paintings are shown", promptType: 'meaning', correctWord: 'Art Gallery', distractorWords: ['Post Office', 'Pharmacy', 'Bakery'], contentVersion: 2 },
      { id: 'wn_g7_h_38', prompt: "Slice the curved path a planet travels around sun", promptType: 'meaning', correctWord: 'Orbit', distractorWords: ['Surface', 'Gravity', 'Atmosphere'], contentVersion: 2 },
      { id: 'wn_g7_h_39', prompt: "Slice all of space and every celestial object in it", promptType: 'meaning', correctWord: 'Universe', distractorWords: ['Planet', 'Continent', 'Island'], contentVersion: 2 },
      { id: 'wn_g7_h_40', prompt: "Slice the process of converting waste into new items", promptType: 'meaning', correctWord: 'Recycling', distractorWords: ['Pollution', 'Litter', 'Drought'], contentVersion: 2 },
    ],
  },
  'grade-8': {
    easy: [
      {
            "id": "wn_g8_e_01",
            "prompt": "Slice the personality trait of someone you CAN TRUST",
            "promptType": "meaning",
            "correctWord": "Reliable",
            "distractorWords": [
                  "Selfish",
                  "Sneaky",
                  "Jealous"
            ]
      },
      {
            "id": "wn_g8_e_02",
            "prompt": "Slice the OPPOSITE of 'Generous'",
            "promptType": "antonym",
            "correctWord": "Selfish",
            "distractorWords": [
                  "Caring",
                  "Giving",
                  "Kind"
            ]
      },
      {
            "id": "wn_g8_e_03",
            "prompt": "Slice the word meaning: Invite someone to an event",
            "promptType": "meaning",
            "correctWord": "Invite",
            "distractorWords": [
                  "Refuse",
                  "Decline",
                  "Reject"
            ]
      },
      {
            "id": "wn_g8_e_04",
            "prompt": "Slice someone who never changes their mind",
            "promptType": "meaning",
            "correctWord": "Stubborn",
            "distractorWords": [
                  "Easy-going",
                  "Relaxed",
                  "Friendly"
            ]
      },
      {
            "id": "wn_g8_e_05",
            "prompt": "Slice the SYNONYM of 'Friend'",
            "promptType": "synonym",
            "correctWord": "Buddy",
            "distractorWords": [
                  "Enemy",
                  "Rival",
                  "Opponent"
            ]
      },
      {
            "id": "wn_g8_e_06",
            "prompt": "Slice the word meaning: To say NO to an offer",
            "promptType": "meaning",
            "correctWord": "Refuse",
            "distractorWords": [
                  "Accept",
                  "Agree",
                  "Welcome"
            ]
      },
      {
            "id": "wn_g8_e_07",
            "prompt": "Slice the cooking method in an OVEN with dry heat",
            "promptType": "meaning",
            "correctWord": "Bake",
            "distractorWords": [
                  "Boil",
                  "Chop",
                  "Peel"
            ]
      },
      {
            "id": "wn_g8_e_08",
            "prompt": "Slice the personality trait of someone who shares things",
            "promptType": "meaning",
            "correctWord": "Generous",
            "distractorWords": [
                  "Mean",
                  "Stingy",
                  "Greedy"
            ]
      },
      {
            "id": "wn_g8_e_09",
            "prompt": "Slice the musical instrument with BLACK and WHITE keys",
            "promptType": "meaning",
            "correctWord": "Piano",
            "distractorWords": [
                  "Guitar",
                  "Violin",
                  "Drums"
            ]
      },
      {
            "id": "wn_g8_e_10",
            "prompt": "Slice the OPPOSITE of 'Honest'",
            "promptType": "antonym",
            "correctWord": "Dishonest",
            "distractorWords": [
                  "Truthful",
                  "Loyal",
                  "Sincere"
            ]
      },
      {
            "id": "wn_g8_e_11",
            "prompt": "Slice the phone action meaning 'End a phone call'",
            "promptType": "meaning",
            "correctWord": "Hang up",
            "distractorWords": [
                  "Pick up",
                  "Dial",
                  "Call back"
            ]
      },
      {
            "id": "wn_g8_e_12",
            "prompt": "Slice the SYNONYM of 'Trendy'",
            "promptType": "synonym",
            "correctWord": "Fashionable",
            "distractorWords": [
                  "Old-fashioned",
                  "Dull",
                  "Boring"
            ]
      },
      {
            "id": "wn_g8_e_13",
            "prompt": "Slice the kitchen verb: Remove fruit skin",
            "promptType": "meaning",
            "correctWord": "Peel",
            "distractorWords": [
                  "Slice",
                  "Whisk",
                  "Grate"
            ]
      },
      {
            "id": "wn_g8_e_14",
            "prompt": "Slice the OPPOSITE of 'Supportive'",
            "promptType": "antonym",
            "correctWord": "Unhelpful",
            "distractorWords": [
                  "Caring",
                  "Kind",
                  "Helpful"
            ]
      },
      {
            "id": "wn_g8_e_15",
            "prompt": "Slice the word for 'Person who visits places for pleasure'",
            "promptType": "meaning",
            "correctWord": "Tourist",
            "distractorWords": [
                  "Pilot",
                  "Sailor",
                  "Driver"
            ]
      },
      {
            "id": "wn_g8_e_16",
            "prompt": "Slice the sports gear worn on the HEAD for safety",
            "promptType": "meaning",
            "correctWord": "Helmet",
            "distractorWords": [
                  "Goggles",
                  "Boots",
                  "Gloves"
            ]
      },
      {
            "id": "wn_g8_e_17",
            "prompt": "Slice the SYNONYM of 'Awesome'",
            "promptType": "synonym",
            "correctWord": "Terrific",
            "distractorWords": [
                  "Awful",
                  "Terrible",
                  "Dreadful"
            ]
      },
      {
            "id": "wn_g8_e_18",
            "prompt": "Slice a list of dishes in a restaurant",
            "promptType": "meaning",
            "correctWord": "Menu",
            "distractorWords": [
                  "Bill",
                  "Receipt",
                  "Ticket"
            ]
      },
      {
            "id": "wn_g8_e_19",
            "prompt": "Slice the OPPOSITE of 'Calm'",
            "promptType": "antonym",
            "correctWord": "Anxious",
            "distractorWords": [
                  "Peaceful",
                  "Quiet",
                  "Serene"
            ]
      },
      {
            "id": "wn_g8_e_20",
            "prompt": "Slice the extreme sport of jumping from a plane",
            "promptType": "meaning",
            "correctWord": "Skydiving",
            "distractorWords": [
                  "Snorkeling",
                  "Hiking",
                  "Jogging"
            ]
      },
      {
            "id": "wn_g8_e_21",
            "prompt": "Slice the tool used to whisk eggs",
            "promptType": "meaning",
            "correctWord": "Whisk",
            "distractorWords": [
                  "Grater",
                  "Saucepan",
                  "Colander"
            ]
      },
      {
            "id": "wn_g8_e_22",
            "prompt": "Slice the adjective meaning 'Not proud; modest'",
            "promptType": "meaning",
            "correctWord": "Humble",
            "distractorWords": [
                  "Arrogant",
                  "Snobbish",
                  "Boastful"
            ]
      },
      {
            "id": "wn_g8_e_23",
            "prompt": "Slice the phone expression: 'Please _____ the line'",
            "promptType": "meaning",
            "correctWord": "Hold",
            "distractorWords": [
                  "Drop",
                  "Cut",
                  "Break"
            ]
      },
      {
            "id": "wn_g8_e_24",
            "prompt": "Slice the SYNONYM of 'Famous'",
            "promptType": "synonym",
            "correctWord": "Well-known",
            "distractorWords": [
                  "Unknown",
                  "Anonymous",
                  "Ordinary"
            ]
      },
      {
            "id": "wn_g8_e_25",
            "prompt": "Slice the music genre originating from Jamaica",
            "promptType": "meaning",
            "correctWord": "Reggae",
            "distractorWords": [
                  "Opera",
                  "Classical",
                  "Country"
            ]
      },
      {
            "id": "wn_g8_e_26",
            "prompt": "Slice the OPPOSITE of 'Boring'",
            "promptType": "antonym",
            "correctWord": "Exciting",
            "distractorWords": [
                  "Dull",
                  "Tedious",
                  "Tiring"
            ]
      },
      {
            "id": "wn_g8_e_27",
            "prompt": "Slice the cooking method in HOT OIL",
            "promptType": "meaning",
            "correctWord": "Fry",
            "distractorWords": [
                  "Steam",
                  "Bake",
                  "Boil"
            ]
      },
      {
            "id": "wn_g8_e_28",
            "prompt": "Slice the person who plays lead or rhythm guitar",
            "promptType": "meaning",
            "correctWord": "Guitarist",
            "distractorWords": [
                  "Drummer",
                  "Vocalist",
                  "Bassist"
            ]
      },
      {
            "id": "wn_g8_e_29",
            "prompt": "Slice the OPPOSITE of 'Polite'",
            "promptType": "antonym",
            "correctWord": "Impolite",
            "distractorWords": [
                  "Courteous",
                  "Charming",
                  "Respectful"
            ]
      },
      {
            "id": "wn_g8_e_30",
            "prompt": "Slice the item you need to BOARD a flight",
            "promptType": "meaning",
            "correctWord": "Boarding pass",
            "distractorWords": [
                  "Credit card",
                  "Postcard",
                  "Receipt"
            ]
      },
      {
            "id": "wn_g8_e_31",
            "prompt": "Slice the person who lives NEXT DOOR to you",
            "promptType": "meaning",
            "correctWord": "Neighbour",
            "distractorWords": [
                  "Stranger",
                  "Relative",
                  "Boss"
            ]
      },
      {
            "id": "wn_g8_e_32",
            "prompt": "Slice the SYNONYM of 'Relaxed'",
            "promptType": "synonym",
            "correctWord": "Laid-back",
            "distractorWords": [
                  "Stressed",
                  "Worried",
                  "Frantic"
            ]
      },
      {
            "id": "wn_g8_e_33",
            "prompt": "Slice the kitchen item used to SHRED cheese",
            "promptType": "meaning",
            "correctWord": "Grater",
            "distractorWords": [
                  "Rolling pin",
                  "Teaspoon",
                  "Kettle"
            ]
      },
      {
            "id": "wn_g8_e_34",
            "prompt": "Slice the OPPOSITE of 'Dangerous'",
            "promptType": "antonym",
            "correctWord": "Harmless",
            "distractorWords": [
                  "Risky",
                  "Fatal",
                  "Severe"
            ]
      },
      {
            "id": "wn_g8_e_35",
            "prompt": "Slice the digital action meaning 'Enter your username and PIN'",
            "promptType": "meaning",
            "correctWord": "Log in",
            "distractorWords": [
                  "Scroll",
                  "Post",
                  "Tag"
            ]
      },
      {
            "id": "wn_g8_e_36",
            "prompt": "Slice the person who LEADS a team or ship",
            "promptType": "meaning",
            "correctWord": "Captain",
            "distractorWords": [
                  "Soldier",
                  "Passenger",
                  "Guest"
            ]
      },
      {
            "id": "wn_g8_e_37",
            "prompt": "Slice the SYNONYM of 'Difficult'",
            "promptType": "synonym",
            "correctWord": "Challenging",
            "distractorWords": [
                  "Effortless",
                  "Simple",
                  "Smooth"
            ]
      },
      {
            "id": "wn_g8_e_38",
            "prompt": "Slice swimming underwater with a tube",
            "promptType": "meaning",
            "correctWord": "Snorkeling",
            "distractorWords": [
                  "Archery",
                  "Caving",
                  "Paragliding"
            ]
      },
      {
            "id": "wn_g8_e_39",
            "prompt": "Slice the OPPOSITE of 'Permanent'",
            "promptType": "antonym",
            "correctWord": "Temporary",
            "distractorWords": [
                  "Lifelong",
                  "Constant",
                  "Eternal"
            ]
      },
      {
            "id": "wn_g8_e_40",
            "prompt": "Slice to count on or trust a friend",
            "promptType": "meaning",
            "correctWord": "Rely on",
            "distractorWords": [
                  "Cheat on",
                  "Laugh at",
                  "Look down on"
            ]
      }
],
    medium: [
      {
            "id": "wn_g8_m_01",
            "prompt": "Slice: To share the same interests",
            "promptType": "meaning",
            "correctWord": "Have in common",
            "distractorWords": [
                  "Argue with",
                  "Back down",
                  "Count on"
            ]
      },
      {
            "id": "wn_g8_m_02",
            "prompt": "Slice the cooking method: Over steam",
            "promptType": "meaning",
            "correctWord": "Steam",
            "distractorWords": [
                  "Deep fry",
                  "Barbecue",
                  "Roast"
            ]
      },
      {
            "id": "wn_g8_m_03",
            "prompt": "Slice the SYNONYM of 'Back someone up'",
            "promptType": "synonym",
            "correctWord": "Support",
            "distractorWords": [
                  "Betray",
                  "Abandon",
                  "Mock"
            ]
      },
      {
            "id": "wn_g8_m_04",
            "prompt": "Slice ignoring friends for your phone",
            "promptType": "meaning",
            "correctWord": "Phubbing",
            "distractorWords": [
                  "Blogging",
                  "Chatting",
                  "Surfing"
            ]
      },
      {
            "id": "wn_g8_m_05",
            "prompt": "Slice the extreme sport of climbing up STEEP ROCK faces",
            "promptType": "meaning",
            "correctWord": "Rock climbing",
            "distractorWords": [
                  "Canoeing",
                  "Windsurfing",
                  "Cycling"
            ]
      },
      {
            "id": "wn_g8_m_06",
            "prompt": "Slice the OPPOSITE of 'Sensible'",
            "promptType": "antonym",
            "correctWord": "Foolish",
            "distractorWords": [
                  "Wise",
                  "Prudent",
                  "Smart"
            ]
      },
      {
            "id": "wn_g8_m_07",
            "prompt": "Slice the phone expression: 'The line is _____ right now'",
            "promptType": "meaning",
            "correctWord": "Engaged",
            "distractorWords": [
                  "Free",
                  "Open",
                  "Clear"
            ]
      },
      {
            "id": "wn_g8_m_08",
            "prompt": "Slice the kitchen ingredient that gives food a SWEET taste",
            "promptType": "meaning",
            "correctWord": "Sugar",
            "distractorWords": [
                  "Vinegar",
                  "Pepper",
                  "Mustard"
            ]
      },
      {
            "id": "wn_g8_m_09",
            "prompt": "Slice: Someone who feels superior to others",
            "promptType": "meaning",
            "correctWord": "Arrogant",
            "distractorWords": [
                  "Modest",
                  "Tolerant",
                  "Humble"
            ]
      },
      {
            "id": "wn_g8_m_10",
            "prompt": "Slice the SYNONYM of 'Fascinating'",
            "promptType": "synonym",
            "correctWord": "Captivating",
            "distractorWords": [
                  "Monotonous",
                  "Tedious",
                  "Dull"
            ]
      },
      {
            "id": "wn_g8_m_11",
            "prompt": "Slice the adventure sport of exploring caves",
            "promptType": "meaning",
            "correctWord": "Caving",
            "distractorWords": [
                  "Trekking",
                  "Surfing",
                  "Skateboarding"
            ]
      },
      {
            "id": "wn_g8_m_12",
            "prompt": "Slice to have a good relationship with someone",
            "promptType": "meaning",
            "correctWord": "Get on well",
            "distractorWords": [
                  "Fall out",
                  "Give up",
                  "Break down"
            ]
      },
      {
            "id": "wn_g8_m_13",
            "prompt": "Slice the OPPOSITE of 'Traditional'",
            "promptType": "antonym",
            "correctWord": "Contemporary",
            "distractorWords": [
                  "Conventional",
                  "Ancient",
                  "Customary"
            ]
      },
      {
            "id": "wn_g8_m_14",
            "prompt": "Slice the cooking step: Mix with a spoon",
            "promptType": "meaning",
            "correctWord": "Stir",
            "distractorWords": [
                  "Chop",
                  "Squeeze",
                  "Grate"
            ]
      },
      {
            "id": "wn_g8_m_15",
            "prompt": "Slice the phone term for 'Connection is noisy or unclear'",
            "promptType": "meaning",
            "correctWord": "Bad line",
            "distractorWords": [
                  "Dial tone",
                  "Voicemail",
                  "Contact list"
            ]
      },
      {
            "id": "wn_g8_m_16",
            "prompt": "Slice the SYNONYM of 'Unbearable'",
            "promptType": "synonym",
            "correctWord": "Intolerable",
            "distractorWords": [
                  "Pleasant",
                  "Enjoyable",
                  "Delightful"
            ]
      },
      {
            "id": "wn_g8_m_17",
            "prompt": "Slice the gear that protects eyes while swimming or skiing",
            "promptType": "meaning",
            "correctWord": "Goggles",
            "distractorWords": [
                  "Life jacket",
                  "Compass",
                  "Whistle"
            ]
      },
      {
            "id": "wn_g8_m_18",
            "prompt": "Slice the natural disaster with a GIANT OCEAN WAVE",
            "promptType": "meaning",
            "correctWord": "Tsunami",
            "distractorWords": [
                  "Tornado",
                  "Landslide",
                  "Blizzard"
            ]
      },
      {
            "id": "wn_g8_m_19",
            "prompt": "Slice the OPPOSITE of 'Punctual'",
            "promptType": "antonym",
            "correctWord": "Unpunctual",
            "distractorWords": [
                  "On time",
                  "Prompt",
                  "Ready"
            ]
      },
      {
            "id": "wn_g8_m_20",
            "prompt": "Slice the culinary taste of lemons or unripe apples",
            "promptType": "meaning",
            "correctWord": "Sour",
            "distractorWords": [
                  "Bitter",
                  "Salty",
                  "Sweet"
            ]
      },
      {
            "id": "wn_g8_m_21",
            "prompt": "Slice to lose contact or fall out",
            "promptType": "meaning",
            "correctWord": "Lose touch",
            "distractorWords": [
                  "Keep in touch",
                  "Back up",
                  "Count on"
            ]
      },
      {
            "id": "wn_g8_m_22",
            "prompt": "Slice the SYNONYM of 'Thrilling'",
            "promptType": "synonym",
            "correctWord": "Exhilarating",
            "distractorWords": [
                  "Boring",
                  "Unremarkable",
                  "Tiresome"
            ]
      },
      {
            "id": "wn_g8_m_23",
            "prompt": "Slice the device used to determine NORTH, SOUTH, EAST, WEST",
            "promptType": "meaning",
            "correctWord": "Compass",
            "distractorWords": [
                  "Altimeter",
                  "Binoculars",
                  "Flashlight"
            ]
      },
      {
            "id": "wn_g8_m_24",
            "prompt": "Slice the culinary verb: PRESSING citrus fruits for juice",
            "promptType": "meaning",
            "correctWord": "Squeeze",
            "distractorWords": [
                  "Knead",
                  "Sprinkle",
                  "Dice"
            ]
      },
      {
            "id": "wn_g8_m_25",
            "prompt": "Slice the OPPOSITE of 'Courteous'",
            "promptType": "antonym",
            "correctWord": "Discourteous",
            "distractorWords": [
                  "Mannerly",
                  "Civil",
                  "Gracious"
            ]
      },
      {
            "id": "wn_g8_m_26",
            "prompt": "Slice the phrase meaning 'To be enthusiastic about something'",
            "promptType": "meaning",
            "correctWord": "Keen on",
            "distractorWords": [
                  "Tired of",
                  "Bored with",
                  "Afraid of"
            ]
      },
      {
            "id": "wn_g8_m_27",
            "prompt": "Slice: Snow tumbling rapidly down mountains",
            "promptType": "meaning",
            "correctWord": "Avalanche",
            "distractorWords": [
                  "Volcano",
                  "Wildfire",
                  "Drought"
            ]
      },
      {
            "id": "wn_g8_m_28",
            "prompt": "Slice: Cutting food into small cubes",
            "promptType": "meaning",
            "correctWord": "Dice",
            "distractorWords": [
                  "Boil",
                  "Bake",
                  "Whisk"
            ]
      },
      {
            "id": "wn_g8_m_29",
            "prompt": "Slice the SYNONYM of 'Tolerant'",
            "promptType": "synonym",
            "correctWord": "Open-minded",
            "distractorWords": [
                  "Narrow-minded",
                  "Biased",
                  "Rigid"
            ]
      },
      {
            "id": "wn_g8_m_30",
            "prompt": "Slice: Vest you wear on boats to stay afloat",
            "promptType": "meaning",
            "correctWord": "Life jacket",
            "distractorWords": [
                  "Backpack",
                  "Parachute",
                  "Flippers"
            ]
      },
      {
            "id": "wn_g8_m_31",
            "prompt": "Slice the action: To call someone back",
            "promptType": "meaning",
            "correctWord": "Call back",
            "distractorWords": [
                  "Hang up",
                  "Dial",
                  "Hold on"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_m_32",
            "prompt": "Slice the OPPOSITE of 'Self-centered'",
            "promptType": "antonym",
            "correctWord": "Caring",
            "distractorWords": [
                  "Selfish",
                  "Arrogant",
                  "Sneaky"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_m_33",
            "prompt": "Slice the culinary technique: ROASTING on an open fire rack",
            "promptType": "meaning",
            "correctWord": "Grill",
            "distractorWords": [
                  "Poach",
                  "Mince",
                  "Blend"
            ]
      },
      {
            "id": "wn_g8_m_34",
            "prompt": "Slice the adventurous trek on foot carrying heavy gear",
            "promptType": "meaning",
            "correctWord": "Backpacking",
            "distractorWords": [
                  "Sunbathing",
                  "Cruising",
                  "Sightseeing"
            ]
      },
      {
            "id": "wn_g8_m_35",
            "prompt": "Slice the SYNONYM of 'Essential'",
            "promptType": "synonym",
            "correctWord": "Crucial",
            "distractorWords": [
                  "Trivial",
                  "Secondary",
                  "Insignificant"
            ]
      },
      {
            "id": "wn_g8_m_36",
            "prompt": "Slice phone status when nobody answers after rings",
            "promptType": "meaning",
            "correctWord": "Unanswered",
            "distractorWords": [
                  "Occupied",
                  "Connected",
                  "Received"
            ]
      },
      {
            "id": "wn_g8_m_37",
            "prompt": "Slice the flavor associated with dark coffee or unsweetened cocoa",
            "promptType": "meaning",
            "correctWord": "Bitter",
            "distractorWords": [
                  "Syrupy",
                  "Tangy",
                  "Savory"
            ]
      },
      {
            "id": "wn_g8_m_38",
            "prompt": "Slice the OPPOSITE of 'Reliable'",
            "promptType": "antonym",
            "correctWord": "Unreliable",
            "distractorWords": [
                  "Dependable",
                  "Trusty",
                  "Sound"
            ]
      },
      {
            "id": "wn_g8_m_39",
            "prompt": "Slice riding waves standing on a board",
            "promptType": "meaning",
            "correctWord": "Surfing",
            "distractorWords": [
                  "Rowing",
                  "Diving",
                  "Kayaking"
            ]
      },
      {
            "id": "wn_g8_m_40",
            "prompt": "Slice someone who gets jealous easily",
            "promptType": "meaning",
            "correctWord": "Possessive",
            "distractorWords": [
                  "Supportive",
                  "Generous",
                  "Patient"
            ]
      }
],
    hard: [
      {
            "id": "wn_g8_h_01",
            "prompt": "Slice the SYNONYM of 'Challenging'",
            "promptType": "synonym",
            "correctWord": "Difficult",
            "distractorWords": [
                  "Easy",
                  "Careless",
                  "Boring"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_02",
            "prompt": "Slice: You cannot stand or tolerate it",
            "promptType": "meaning",
            "correctWord": "Unbearable",
            "distractorWords": [
                  "Fascinating",
                  "Impressive",
                  "Awesome"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_03",
            "prompt": "Slice the OPPOSITE of 'Tactful'",
            "promptType": "antonym",
            "correctWord": "Tactless",
            "distractorWords": [
                  "Supportive",
                  "Generous",
                  "Honest"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_04",
            "prompt": "Slice the email file sent with a message",
            "promptType": "meaning",
            "correctWord": "Attachment",
            "distractorWords": [
                  "Connection",
                  "Password",
                  "Browser"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_05",
            "prompt": "Slice the SYNONYM of 'Back up' a friend",
            "promptType": "synonym",
            "correctWord": "Support",
            "distractorWords": [
                  "Refuse",
                  "Ignore",
                  "Argue"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_06",
            "prompt": "Slice the kitchen step: Press bread dough",
            "promptType": "meaning",
            "correctWord": "Knead",
            "distractorWords": [
                  "Chop",
                  "Peel",
                  "Boil"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_07",
            "prompt": "Slice: Long period without any rain",
            "promptType": "meaning",
            "correctWord": "Drought",
            "distractorWords": [
                  "Flood",
                  "Avalanche",
                  "Storm"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_08",
            "prompt": "Slice: Hotel where all meals are included",
            "promptType": "meaning",
            "correctWord": "All-inclusive",
            "distractorWords": [
                  "Bed and breakfast",
                  "Camping",
                  "Hostel"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_09",
            "prompt": "Slice: A chore or duty you MUST do",
            "promptType": "meaning",
            "correctWord": "Obligation",
            "distractorWords": [
                  "Excuse",
                  "Preference",
                  "Hobby"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_10",
            "prompt": "Slice: To find something for the first time",
            "promptType": "meaning",
            "correctWord": "Discover",
            "distractorWords": [
                  "Damage",
                  "Disappear",
                  "Refuse"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_11",
            "prompt": "Slice the SYNONYM of 'Fascinating'",
            "promptType": "synonym",
            "correctWord": "Captivating",
            "distractorWords": [
                  "Boring",
                  "Ordinary",
                  "Ridiculous"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_12",
            "prompt": "Slice the OPPOSITE of 'Safe' online",
            "promptType": "antonym",
            "correctWord": "Dangerous",
            "distractorWords": [
                  "Secure",
                  "Private",
                  "Helpful"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_13",
            "prompt": "Slice: Pour liquid through a sieve",
            "promptType": "meaning",
            "correctWord": "Drain",
            "distractorWords": [
                  "Melt",
                  "Dice",
                  "Slice"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_14",
            "prompt": "Slice: An internal telephone number",
            "promptType": "meaning",
            "correctWord": "Extension",
            "distractorWords": [
                  "Connection",
                  "Network",
                  "Message"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_15",
            "prompt": "Slice: An active internet user",
            "promptType": "meaning",
            "correctWord": "Netizen",
            "distractorWords": [
                  "Tourist",
                  "Passenger",
                  "Captain"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_16",
            "prompt": "Slice the SYNONYM of 'Count on'",
            "promptType": "synonym",
            "correctWord": "Rely on",
            "distractorWords": [
                  "Turn down",
                  "Call off",
                  "Keep away"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_17",
            "prompt": "Slice the OPPOSITE of 'Generous'",
            "promptType": "antonym",
            "correctWord": "Mean",
            "distractorWords": [
                  "Supportive",
                  "Reliable",
                  "Honest"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_18",
            "prompt": "Slice: Giant ocean wave from tremor",
            "promptType": "meaning",
            "correctWord": "Tsunami",
            "distractorWords": [
                  "Hurricane",
                  "Tornado",
                  "Blizzard"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_19",
            "prompt": "Slice: Room where scientific tests happen",
            "promptType": "meaning",
            "correctWord": "Laboratory",
            "distractorWords": [
                  "Library",
                  "Stadium",
                  "Bakery"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_20",
            "prompt": "Slice: Clean carpet with an electric machine",
            "promptType": "meaning",
            "correctWord": "Vacuum",
            "distractorWords": [
                  "Dust",
                  "Iron",
                  "Mop"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_21",
            "prompt": "Slice the SYNONYM of 'Impressive'",
            "promptType": "synonym",
            "correctWord": "Splendid",
            "distractorWords": [
                  "Ridiculous",
                  "Unbearable",
                  "Boring"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_22",
            "prompt": "Slice the OPPOSITE of 'Accept' an offer",
            "promptType": "antonym",
            "correctWord": "Refuse",
            "distractorWords": [
                  "Welcome",
                  "Join",
                  "Attend"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_23",
            "prompt": "Slice: Flying with a wide fabric wing",
            "promptType": "meaning",
            "correctWord": "Paragliding",
            "distractorWords": [
                  "Trekking",
                  "Cycling",
                  "Jogging"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_24",
            "prompt": "Slice: Cut vegetables into tiny pieces",
            "promptType": "meaning",
            "correctWord": "Chop",
            "distractorWords": [
                  "Boil",
                  "Bake",
                  "Roast"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_25",
            "prompt": "Slice: Famous historic site tourists visit",
            "promptType": "meaning",
            "correctWord": "Attraction",
            "distractorWords": [
                  "Departure",
                  "Ticket",
                  "Luggage"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_26",
            "prompt": "Slice the SYNONYM of 'Honest'",
            "promptType": "synonym",
            "correctWord": "Truthful",
            "distractorWords": [
                  "Sneaky",
                  "Jealous",
                  "Stubborn"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_27",
            "prompt": "Slice the OPPOSITE of 'Traditional'",
            "promptType": "antonym",
            "correctWord": "Modern",
            "distractorWords": [
                  "Ancient",
                  "Historic",
                  "Old"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_28",
            "prompt": "Slice: Snow tumbling rapidly down a slope",
            "promptType": "meaning",
            "correctWord": "Avalanche",
            "distractorWords": [
                  "Volcano",
                  "Drought",
                  "Flood"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_29",
            "prompt": "Slice: A test to see if a science idea works",
            "promptType": "meaning",
            "correctWord": "Experiment",
            "distractorWords": [
                  "Explanation",
                  "Argument",
                  "Invitation"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_30",
            "prompt": "Slice: Wash cups, plates, and forks",
            "promptType": "meaning",
            "correctWord": "Do dishes",
            "distractorWords": [
                  "Make bed",
                  "Walk dog",
                  "Set table"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_31",
            "prompt": "Slice the SYNONYM of 'Terrific'",
            "promptType": "synonym",
            "correctWord": "Wonderful",
            "distractorWords": [
                  "Awful",
                  "Terrible",
                  "Boring"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_32",
            "prompt": "Slice the OPPOSITE of 'Sneaky'",
            "promptType": "antonym",
            "correctWord": "Sincere",
            "distractorWords": [
                  "Dishonest",
                  "Secret",
                  "Sly"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_33",
            "prompt": "Slice: Secret code to protect your account",
            "promptType": "meaning",
            "correctWord": "Password",
            "distractorWords": [
                  "Browser",
                  "Screen",
                  "Cable"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_34",
            "prompt": "Slice: Short phone note left for someone",
            "promptType": "meaning",
            "correctWord": "Message",
            "distractorWords": [
                  "Call",
                  "Bell",
                  "Signal"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_35",
            "prompt": "Slice: Safety straps worn while climbing",
            "promptType": "meaning",
            "correctWord": "Harness",
            "distractorWords": [
                  "Helmet",
                  "Paddle",
                  "Mask"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_36",
            "prompt": "Slice the SYNONYM of 'Destination'",
            "promptType": "synonym",
            "correctWord": "Goal",
            "distractorWords": [
                  "Start",
                  "Delay",
                  "Route"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_37",
            "prompt": "Slice the OPPOSITE of 'Extinct'",
            "promptType": "antonym",
            "correctWord": "Alive",
            "distractorWords": [
                  "Endangered",
                  "Vanished",
                  "Gone"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_38",
            "prompt": "Slice: Person who designs a brand new tool",
            "promptType": "meaning",
            "correctWord": "Inventor",
            "distractorWords": [
                  "Explorer",
                  "Tourist",
                  "Passenger"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_39",
            "prompt": "Slice: Wipe dust off furniture with cloth",
            "promptType": "meaning",
            "correctWord": "Dust",
            "distractorWords": [
                  "Sweep",
                  "Mop",
                  "Dry"
            ],
            "contentVersion": 2
      },
      {
            "id": "wn_g8_h_40",
            "prompt": "Slice: Someone who cares only for themselves",
            "promptType": "meaning",
            "correctWord": "Selfish",
            "distractorWords": [
                  "Generous",
                  "Thoughtful",
                  "Caring"
            ],
            "contentVersion": 2
      }
],
  },
};
