/**
 * UNIT REVIEW ARCADE — WORD CONNECT DATA BANK (PHASE 7A & MIXED CURRICULUM EXPANSION)
 * 
 * 480 validated unique puzzles (80 items per tier) across:
 * - Grade 7: Easy (80, 4-letter wheels), Medium (80, 5-letter wheels), Hard (80, 6-letter wheels)
 * - Grade 8: Easy (80, 4-letter wheels), Medium (80, 5-letter wheels), Hard (80, 6-letter wheels)
 * 
 * Mixed Curriculum: Turkish MEB English Units 1-10 + School English Curriculum.
 */

import type { WordConnectBank } from '../../types/gamesZone';

export const WORD_CONNECT_BANK: WordConnectBank = {
  "grade-7": {
    "easy": [
      {
        "id": "wc_g7_e_01",
        "availableLetters": [
          "P",
          "L",
          "A",
          "Y"
        ],
        "targetWords": [
          {
            "word": "PLAY",
            "turkishMeaning": "Oynamak"
          },
          {
            "word": "LAY",
            "turkishMeaning": "Sermek"
          },
          {
            "word": "PAY",
            "turkishMeaning": "Ödemek"
          }
        ],
        "category": "Sports",
        "theme": "Playtime",
        "explanation": "Connect letters P, L, A, Y to form: PLAY, LAY, PAY."
      },
      {
        "id": "wc_g7_e_02",
        "availableLetters": [
          "S",
          "T",
          "E",
          "P"
        ],
        "targetWords": [
          {
            "word": "STEP",
            "turkishMeaning": "Adım"
          },
          {
            "word": "PETS",
            "turkishMeaning": "Evcil hayvanlar"
          },
          {
            "word": "PET",
            "turkishMeaning": "Evcil hayvan"
          },
          {
            "word": "SET",
            "turkishMeaning": "Ayar / set"
          }
        ],
        "category": "Sports & Health",
        "theme": "Fitness & Activity",
        "explanation": "Connect letters S, T, E, P to form: STEP, PETS, PET, SET.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_e_03",
        "availableLetters": [
          "L",
          "I",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "LION",
            "turkishMeaning": "Aslan"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          },
          {
            "word": "ION",
            "turkishMeaning": "İyon"
          }
        ],
        "category": "Wild Animals",
        "theme": "Savannah",
        "explanation": "Connect letters L, I, O, N to form: LION, OIL, ION."
      },
      {
        "id": "wc_g7_e_04",
        "availableLetters": [
          "B",
          "I",
          "R",
          "D"
        ],
        "targetWords": [
          {
            "word": "BIRD",
            "turkishMeaning": "Kuş"
          },
          {
            "word": "RIB",
            "turkishMeaning": "Kaburga"
          },
          {
            "word": "BID",
            "turkishMeaning": "Teklif"
          }
        ],
        "category": "Wild Animals",
        "theme": "Birds",
        "explanation": "Connect letters B, I, R, D to form: BIRD, RIB, BID."
      },
      {
        "id": "wc_g7_e_05",
        "availableLetters": [
          "C",
          "A",
          "K",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "CAKE",
            "turkishMeaning": "Pasta"
          },
          {
            "word": "CAKES",
            "turkishMeaning": "Pastalar"
          },
          {
            "word": "CASE",
            "turkishMeaning": "Kasa, durum"
          },
          {
            "word": "ACE",
            "turkishMeaning": "As"
          }
        ],
        "category": "Celebrations",
        "theme": "Party Food",
        "explanation": "Connect letters C, A, K, E, S to form: CAKE, CAKES, CASE, ACE."
      },
      {
        "id": "wc_g7_e_06",
        "availableLetters": [
          "S",
          "T",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          },
          {
            "word": "RAT",
            "turkishMeaning": "Fare"
          },
          {
            "word": "TAR",
            "turkishMeaning": "Katran"
          }
        ],
        "category": "Planets",
        "theme": "Sky",
        "explanation": "Connect letters S, T, A, R to form: STAR, ART, RAT, TAR."
      },
      {
        "id": "wc_g7_e_07",
        "availableLetters": [
          "W",
          "I",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "WIND",
            "turkishMeaning": "Rüzgar"
          },
          {
            "word": "WIN",
            "turkishMeaning": "Kazanmak"
          },
          {
            "word": "DIN",
            "turkishMeaning": "Gürültü"
          }
        ],
        "category": "Environment",
        "theme": "Breeze",
        "explanation": "Connect letters W, I, N, D to form: WIND, WIN, DIN."
      },
      {
        "id": "wc_g7_e_08",
        "availableLetters": [
          "P",
          "A",
          "R",
          "K"
        ],
        "targetWords": [
          {
            "word": "PARK",
            "turkishMeaning": "Park"
          },
          {
            "word": "ARK",
            "turkishMeaning": "Gemi"
          },
          {
            "word": "RAP",
            "turkishMeaning": "Vurmak"
          }
        ],
        "category": "Public Buildings",
        "theme": "Greenery",
        "explanation": "Connect letters P, A, R, K to form: PARK, ARK, RAP."
      },
      {
        "id": "wc_g7_e_09",
        "availableLetters": [
          "S",
          "A",
          "V",
          "E"
        ],
        "targetWords": [
          {
            "word": "SAVE",
            "turkishMeaning": "Korumak"
          },
          {
            "word": "VASE",
            "turkishMeaning": "Vazo"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          }
        ],
        "category": "Environment",
        "theme": "Eco",
        "explanation": "Connect letters S, A, V, E to form: SAVE, VASE, SEA."
      },
      {
        "id": "wc_g7_e_10",
        "availableLetters": [
          "W",
          "A",
          "R",
          "M"
        ],
        "targetWords": [
          {
            "word": "WARM",
            "turkishMeaning": "Ilık"
          },
          {
            "word": "ARM",
            "turkishMeaning": "Kol"
          },
          {
            "word": "RAM",
            "turkishMeaning": "Koç"
          },
          {
            "word": "RAW",
            "turkishMeaning": "Çiğ"
          }
        ],
        "category": "Environment",
        "theme": "Climate",
        "explanation": "Connect letters W, A, R, M to form: WARM, ARM, RAM, RAW."
      },
      {
        "id": "wc_g7_e_11",
        "availableLetters": [
          "C",
          "O",
          "L",
          "D"
        ],
        "targetWords": [
          {
            "word": "COLD",
            "turkishMeaning": "Soğuk"
          },
          {
            "word": "OLD",
            "turkishMeaning": "Eski"
          },
          {
            "word": "DOC",
            "turkishMeaning": "Doktor"
          }
        ],
        "category": "Environment",
        "theme": "Frost",
        "explanation": "Connect letters C, O, L, D to form: COLD, OLD, DOC."
      },
      {
        "id": "wc_g7_e_12",
        "availableLetters": [
          "B",
          "O",
          "R",
          "N"
        ],
        "targetWords": [
          {
            "word": "BORN",
            "turkishMeaning": "Doğmuş"
          },
          {
            "word": "ROB",
            "turkishMeaning": "Soymak"
          },
          {
            "word": "NOR",
            "turkishMeaning": "Ne de"
          }
        ],
        "category": "Biographies",
        "theme": "Origins",
        "explanation": "Connect letters B, O, R, N to form: BORN, ROB, NOR."
      },
      {
        "id": "wc_g7_e_13",
        "availableLetters": [
          "G",
          "I",
          "F",
          "T"
        ],
        "targetWords": [
          {
            "word": "GIFT",
            "turkishMeaning": "Hediye"
          },
          {
            "word": "FIT",
            "turkishMeaning": "Uygun"
          },
          {
            "word": "FIG",
            "turkishMeaning": "İncir"
          }
        ],
        "category": "Celebrations",
        "theme": "Presents",
        "explanation": "Connect letters G, I, F, T to form: GIFT, FIT, FIG."
      },
      {
        "id": "wc_g7_e_14",
        "availableLetters": [
          "P",
          "R",
          "E",
          "Y"
        ],
        "targetWords": [
          {
            "word": "PREY",
            "turkishMeaning": "Av"
          },
          {
            "word": "RYE",
            "turkishMeaning": "Çavdar"
          },
          {
            "word": "REP",
            "turkishMeaning": "Temsilci"
          }
        ],
        "category": "Wild Animals",
        "theme": "Hunter",
        "explanation": "Connect letters P, R, E, Y to form: PREY, RYE, REP."
      },
      {
        "id": "wc_g7_e_15",
        "availableLetters": [
          "N",
          "E",
          "W",
          "S"
        ],
        "targetWords": [
          {
            "word": "NEWS",
            "turkishMeaning": "Haberler"
          },
          {
            "word": "NEW",
            "turkishMeaning": "Yeni"
          },
          {
            "word": "SEW",
            "turkishMeaning": "Dikmek"
          }
        ],
        "category": "Television",
        "theme": "Media",
        "explanation": "Connect letters N, E, W, S to form: NEWS, NEW, SEW."
      },
      {
        "id": "wc_g7_e_16",
        "availableLetters": [
          "B",
          "E",
          "A",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "BEARS",
            "turkishMeaning": "Ayılar"
          },
          {
            "word": "BEAR",
            "turkishMeaning": "Ayı"
          },
          {
            "word": "EARS",
            "turkishMeaning": "Kulaklar"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          }
        ],
        "category": "Wild Animals",
        "theme": "Forest Bears",
        "explanation": "Connect letters B, E, A, R, S to form: BEARS, BEAR, EARS, SEA.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_e_17",
        "availableLetters": [
          "F",
          "R",
          "O",
          "G"
        ],
        "targetWords": [
          {
            "word": "FROG",
            "turkishMeaning": "Kurbağa"
          },
          {
            "word": "FOR",
            "turkishMeaning": "İçin"
          },
          {
            "word": "FOG",
            "turkishMeaning": "Sis"
          }
        ],
        "category": "Wild Animals",
        "theme": "Amphibian",
        "explanation": "Connect letters F, R, O, G to form: FROG, FOR, FOG."
      },
      {
        "id": "wc_g7_e_18",
        "availableLetters": [
          "D",
          "E",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "DEER",
            "turkishMeaning": "Geyik"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          },
          {
            "word": "REED",
            "turkishMeaning": "Kamış"
          }
        ],
        "category": "Wild Animals",
        "theme": "Fauna",
        "explanation": "Connect letters D, E, E, R to form: DEER, RED, REED."
      },
      {
        "id": "wc_g7_e_19",
        "availableLetters": [
          "B",
          "E",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "BEAR",
            "turkishMeaning": "Ayı"
          },
          {
            "word": "BARE",
            "turkishMeaning": "Çıplak, yalın"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "ERA",
            "turkishMeaning": "Dönem, çağ"
          }
        ],
        "category": "Wild Animals",
        "theme": "Forest Bear",
        "explanation": "Connect letters B, E, A, R to form: BEAR, BARE, EAR, ERA.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_e_20",
        "availableLetters": [
          "D",
          "U",
          "C",
          "K",
          "S"
        ],
        "targetWords": [
          {
            "word": "DUCK",
            "turkishMeaning": "Ördek"
          },
          {
            "word": "DUCKS",
            "turkishMeaning": "Ördekler"
          },
          {
            "word": "SUCK",
            "turkishMeaning": "Emmek"
          }
        ],
        "category": "Wild Animals",
        "theme": "Waterfowl",
        "explanation": "Connect letters D, U, C, K, S to form: DUCK, DUCKS, SUCK."
      },
      {
        "id": "wc_g7_e_21",
        "availableLetters": [
          "S",
          "O",
          "I",
          "L"
        ],
        "targetWords": [
          {
            "word": "SOIL",
            "turkishMeaning": "Toprak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          },
          {
            "word": "SILO",
            "turkishMeaning": "Silo"
          }
        ],
        "category": "Environment",
        "theme": "Ground",
        "explanation": "Connect letters S, O, I, L to form: SOIL, OIL, SILO."
      },
      {
        "id": "wc_g7_e_22",
        "availableLetters": [
          "S",
          "E",
          "E",
          "D",
          "S"
        ],
        "targetWords": [
          {
            "word": "SEED",
            "turkishMeaning": "Tohum"
          },
          {
            "word": "SEEDS",
            "turkishMeaning": "Tohumlar"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Environment",
        "theme": "Plant Sprout",
        "explanation": "Connect letters S, E, E, D, S to form: SEED, SEEDS, SEE."
      },
      {
        "id": "wc_g7_e_23",
        "availableLetters": [
          "L",
          "E",
          "A",
          "F"
        ],
        "targetWords": [
          {
            "word": "LEAF",
            "turkishMeaning": "Yaprak"
          },
          {
            "word": "ALE",
            "turkishMeaning": "Bira"
          },
          {
            "word": "ELF",
            "turkishMeaning": "Elf"
          }
        ],
        "category": "Environment",
        "theme": "Leaves",
        "explanation": "Connect letters L, E, A, F to form: LEAF, ALE, ELF."
      },
      {
        "id": "wc_g7_e_24",
        "availableLetters": [
          "R",
          "A",
          "I",
          "N"
        ],
        "targetWords": [
          {
            "word": "RAIN",
            "turkishMeaning": "Yağmur"
          },
          {
            "word": "RAN",
            "turkishMeaning": "Koştu"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          }
        ],
        "category": "Environment",
        "theme": "Precipitation",
        "explanation": "Connect letters R, A, I, N to form: RAIN, RAN, AIR."
      },
      {
        "id": "wc_g7_e_25",
        "availableLetters": [
          "S",
          "N",
          "O",
          "W"
        ],
        "targetWords": [
          {
            "word": "SNOW",
            "turkishMeaning": "Kar"
          },
          {
            "word": "NOW",
            "turkishMeaning": "Şimdi"
          },
          {
            "word": "WON",
            "turkishMeaning": "Kazandı"
          },
          {
            "word": "SON",
            "turkishMeaning": "Oğul"
          }
        ],
        "category": "Environment",
        "theme": "Snowflakes",
        "explanation": "Connect letters S, N, O, W to form: SNOW, NOW, WON, SON."
      },
      {
        "id": "wc_g7_e_26",
        "availableLetters": [
          "F",
          "I",
          "S",
          "H",
          "P"
        ],
        "targetWords": [
          {
            "word": "FISH",
            "turkishMeaning": "Balık"
          },
          {
            "word": "SHIP",
            "turkishMeaning": "Gemi"
          },
          {
            "word": "HIP",
            "turkishMeaning": "Kalça"
          }
        ],
        "category": "Wild Animals",
        "theme": "Marine",
        "explanation": "Connect letters F, I, S, H, P to form: FISH, SHIP, HIP."
      },
      {
        "id": "wc_g7_e_27",
        "availableLetters": [
          "T",
          "R",
          "E",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "TREE",
            "turkishMeaning": "Ağaç"
          },
          {
            "word": "TREES",
            "turkishMeaning": "Ağaçlar"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          },
          {
            "word": "SET",
            "turkishMeaning": "Kurmak"
          }
        ],
        "category": "Environment",
        "theme": "Woods",
        "explanation": "Connect letters T, R, E, E, S to form: TREE, TREES, SEE, SET."
      },
      {
        "id": "wc_g7_e_28",
        "availableLetters": [
          "M",
          "O",
          "O",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "MOON",
            "turkishMeaning": "Ay"
          },
          {
            "word": "MOONS",
            "turkishMeaning": "Aylar"
          },
          {
            "word": "MOO",
            "turkishMeaning": "Böğürmek"
          },
          {
            "word": "SOON",
            "turkishMeaning": "Yakında"
          }
        ],
        "category": "Planets",
        "theme": "Moon Orbit",
        "explanation": "Connect letters M, O, O, N, S to form: MOON, MOONS, MOO, SOON."
      },
      {
        "id": "wc_g7_e_29",
        "availableLetters": [
          "M",
          "A",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "MARS",
            "turkishMeaning": "Mars"
          },
          {
            "word": "ARM",
            "turkishMeaning": "Kol"
          },
          {
            "word": "RAM",
            "turkishMeaning": "Koç"
          },
          {
            "word": "ARMS",
            "turkishMeaning": "Kollar"
          }
        ],
        "category": "Planets",
        "theme": "Solar",
        "explanation": "Connect letters M, A, R, S to form: MARS, ARM, RAM, ARMS."
      },
      {
        "id": "wc_g7_e_30",
        "availableLetters": [
          "S",
          "H",
          "O",
          "P"
        ],
        "targetWords": [
          {
            "word": "SHOP",
            "turkishMeaning": "Dükkan"
          },
          {
            "word": "HOP",
            "turkishMeaning": "Zıplamak"
          },
          {
            "word": "POSH",
            "turkishMeaning": "Lüks"
          }
        ],
        "category": "Public Buildings",
        "theme": "Retail",
        "explanation": "Connect letters S, H, O, P to form: SHOP, HOP, POSH."
      },
      {
        "id": "wc_g7_e_31",
        "availableLetters": [
          "B",
          "A",
          "N",
          "K"
        ],
        "targetWords": [
          {
            "word": "BANK",
            "turkishMeaning": "Banka"
          },
          {
            "word": "BAN",
            "turkishMeaning": "Yasak"
          },
          {
            "word": "NAB",
            "turkishMeaning": "Yakalama"
          }
        ],
        "category": "Public Buildings",
        "theme": "Finance",
        "explanation": "Connect letters B, A, N, K to form: BANK, BAN, NAB."
      },
      {
        "id": "wc_g7_e_32",
        "availableLetters": [
          "C",
          "A",
          "F",
          "E"
        ],
        "targetWords": [
          {
            "word": "CAFE",
            "turkishMeaning": "Kafe"
          },
          {
            "word": "FACE",
            "turkishMeaning": "Yüz"
          },
          {
            "word": "ACE",
            "turkishMeaning": "As"
          }
        ],
        "category": "Public Buildings",
        "theme": "Bistro",
        "explanation": "Connect letters C, A, F, E to form: CAFE, FACE, ACE."
      },
      {
        "id": "wc_g7_e_33",
        "availableLetters": [
          "M",
          "A",
          "L",
          "L",
          "S"
        ],
        "targetWords": [
          {
            "word": "MALL",
            "turkishMeaning": "AVM"
          },
          {
            "word": "MALLS",
            "turkishMeaning": "AVMler"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          }
        ],
        "category": "Public Buildings",
        "theme": "Shopping",
        "explanation": "Connect letters M, A, L, L, S to form: MALL, MALLS, ALL."
      },
      {
        "id": "wc_g7_e_34",
        "availableLetters": [
          "G",
          "R",
          "O",
          "W",
          "N"
        ],
        "targetWords": [
          {
            "word": "GROW",
            "turkishMeaning": "Büyümek"
          },
          {
            "word": "GROWN",
            "turkishMeaning": "Büyümüş"
          },
          {
            "word": "ROW",
            "turkishMeaning": "Sıra"
          },
          {
            "word": "NOW",
            "turkishMeaning": "Şimdi"
          }
        ],
        "category": "Environment",
        "theme": "Plants",
        "explanation": "Connect letters G, R, O, W, N to form: GROW, GROWN, ROW, NOW."
      },
      {
        "id": "wc_g7_e_35",
        "availableLetters": [
          "C",
          "U",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "CUTE",
            "turkishMeaning": "Sevimli"
          },
          {
            "word": "CUE",
            "turkishMeaning": "İpucu"
          },
          {
            "word": "CUT",
            "turkishMeaning": "Kesmek"
          }
        ],
        "category": "Appearance",
        "theme": "Charm",
        "explanation": "Connect letters C, U, T, E to form: CUTE, CUE, CUT."
      },
      {
        "id": "wc_g7_e_36",
        "availableLetters": [
          "T",
          "A",
          "L",
          "L",
          "B"
        ],
        "targetWords": [
          {
            "word": "TALL",
            "turkishMeaning": "Uzun"
          },
          {
            "word": "BALL",
            "turkishMeaning": "Top"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          },
          {
            "word": "BAT",
            "turkishMeaning": "Yarasa"
          }
        ],
        "category": "Appearance",
        "theme": "Stature",
        "explanation": "Connect letters T, A, L, L, B to form: TALL, BALL, ALL, BAT."
      },
      {
        "id": "wc_g7_e_37",
        "availableLetters": [
          "M",
          "E",
          "D",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "MEDAL",
            "turkishMeaning": "Madalya"
          },
          {
            "word": "DEAL",
            "turkishMeaning": "Anlaşma"
          },
          {
            "word": "MALE",
            "turkishMeaning": "Erkek"
          },
          {
            "word": "LEAD",
            "turkishMeaning": "Öncülük etmek"
          }
        ],
        "category": "Sports & Awards",
        "theme": "Medals & Honors",
        "explanation": "Connect letters M, E, D, A, L to form: MEDAL, DEAL, MALE, LEAD.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_e_38",
        "availableLetters": [
          "F",
          "A",
          "I",
          "R"
        ],
        "targetWords": [
          {
            "word": "FAIR",
            "turkishMeaning": "Adil"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          },
          {
            "word": "FAR",
            "turkishMeaning": "Uzak"
          }
        ],
        "category": "Personality",
        "theme": "Justice",
        "explanation": "Connect letters F, A, I, R to form: FAIR, AIR, FAR."
      },
      {
        "id": "wc_g7_e_39",
        "availableLetters": [
          "P",
          "O",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "POND",
            "turkishMeaning": "Gölet"
          },
          {
            "word": "POD",
            "turkishMeaning": "Kapsül"
          },
          {
            "word": "NOD",
            "turkishMeaning": "Baş eğmek"
          }
        ],
        "category": "Environment",
        "theme": "Waterway",
        "explanation": "Connect letters P, O, N, D to form: POND, POD, NOD."
      },
      {
        "id": "wc_g7_e_40",
        "availableLetters": [
          "W",
          "O",
          "L",
          "F"
        ],
        "targetWords": [
          {
            "word": "WOLF",
            "turkishMeaning": "Kurt"
          },
          {
            "word": "OWL",
            "turkishMeaning": "Baykuş"
          },
          {
            "word": "FLOW",
            "turkishMeaning": "Akıntı"
          },
          {
            "word": "LOW",
            "turkishMeaning": "Alçak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Canine",
        "explanation": "Connect letters W, O, L, F to form: WOLF, OWL, FLOW, LOW."
      },
      {
        "id": "wc_g7_e_41",
        "availableLetters": [
          "C",
          "A",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "CARE",
            "turkishMeaning": "Bakım, önemseme"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "ERA",
            "turkishMeaning": "Dönem"
          },
          {
            "word": "ARC",
            "turkishMeaning": "Yay"
          }
        ],
        "category": "Personality",
        "theme": "Kindness & Empathy",
        "explanation": "Connect letters C, A, R, E to form: CARE, EAR, ERA, ARC."
      },
      {
        "id": "wc_g7_e_42",
        "availableLetters": [
          "K",
          "I",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "KIND",
            "turkishMeaning": "Kibar, nazik"
          },
          {
            "word": "INK",
            "turkishMeaning": "Mürekkep"
          },
          {
            "word": "KID",
            "turkishMeaning": "Çocuk"
          }
        ],
        "category": "Personality",
        "theme": "Friendliness",
        "explanation": "Connect letters K, I, N, D to form: KIND, INK, KID."
      },
      {
        "id": "wc_g7_e_43",
        "availableLetters": [
          "C",
          "A",
          "L",
          "M"
        ],
        "targetWords": [
          {
            "word": "CALM",
            "turkishMeaning": "Sakin"
          },
          {
            "word": "CAM",
            "turkishMeaning": "Kamera kamı"
          }
        ],
        "category": "Personality",
        "theme": "Tranquil Spirit",
        "explanation": "Connect letters C, A, L, M to form: CALM, CAM."
      },
      {
        "id": "wc_g7_e_44",
        "availableLetters": [
          "S",
          "W",
          "I",
          "M"
        ],
        "targetWords": [
          {
            "word": "SWIM",
            "turkishMeaning": "Yüzmek"
          }
        ],
        "category": "Sports",
        "theme": "Water Athletics",
        "explanation": "Connect letters S, W, I, M to form: SWIM."
      },
      {
        "id": "wc_g7_e_45",
        "availableLetters": [
          "G",
          "O",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "GOAL",
            "turkishMeaning": "Hedef, gol"
          },
          {
            "word": "LOG",
            "turkishMeaning": "Kütük"
          }
        ],
        "category": "Sports",
        "theme": "Field Success",
        "explanation": "Connect letters G, O, A, L to form: GOAL, LOG."
      },
      {
        "id": "wc_g7_e_46",
        "availableLetters": [
          "T",
          "E",
          "A",
          "M"
        ],
        "targetWords": [
          {
            "word": "TEAM",
            "turkishMeaning": "Takım"
          },
          {
            "word": "MET",
            "turkishMeaning": "Buluştu"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          },
          {
            "word": "EAT",
            "turkishMeaning": "Yemek"
          }
        ],
        "category": "Sports",
        "theme": "Cooperation",
        "explanation": "Connect letters T, E, A, M to form: TEAM, MET, TEA, EAT."
      },
      {
        "id": "wc_g7_e_47",
        "availableLetters": [
          "B",
          "A",
          "L",
          "L"
        ],
        "targetWords": [
          {
            "word": "BALL",
            "turkishMeaning": "Top"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          },
          {
            "word": "LAB",
            "turkishMeaning": "Laboratuvar"
          }
        ],
        "category": "Sports",
        "theme": "Ball Games",
        "explanation": "Connect letters B, A, L, L to form: BALL, ALL, LAB."
      },
      {
        "id": "wc_g7_e_48",
        "availableLetters": [
          "R",
          "A",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "RACE",
            "turkishMeaning": "Yarış"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          },
          {
            "word": "ERA",
            "turkishMeaning": "Çağ"
          },
          {
            "word": "ARC",
            "turkishMeaning": "Yay"
          }
        ],
        "category": "Sports",
        "theme": "Athletic Speed",
        "explanation": "Connect letters R, A, C, E to form: RACE, CAR, ERA, ARC."
      },
      {
        "id": "wc_g7_e_49",
        "availableLetters": [
          "W",
          "I",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "WINS",
            "turkishMeaning": "Kazanır"
          },
          {
            "word": "WIN",
            "turkishMeaning": "Kazanmak"
          },
          {
            "word": "SIN",
            "turkishMeaning": "Kusur"
          }
        ],
        "category": "Sports",
        "theme": "Victory",
        "explanation": "Connect letters W, I, N, S to form: WINS, WIN, SIN."
      },
      {
        "id": "wc_g7_e_50",
        "availableLetters": [
          "F",
          "A",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "FAST",
            "turkishMeaning": "Hızlı"
          },
          {
            "word": "FAT",
            "turkishMeaning": "Kilolu"
          },
          {
            "word": "SAT",
            "turkishMeaning": "Oturdu"
          }
        ],
        "category": "Sports",
        "theme": "Speed & Agility",
        "explanation": "Connect letters F, A, S, T to form: FAST, FAT, SAT."
      },
      {
        "id": "wc_g7_e_51",
        "availableLetters": [
          "P",
          "A",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "PAST",
            "turkishMeaning": "Geçmiş"
          },
          {
            "word": "TAP",
            "turkishMeaning": "Musluk"
          },
          {
            "word": "PAT",
            "turkishMeaning": "Okşamak"
          }
        ],
        "category": "Biographies",
        "theme": "History & Heritage",
        "explanation": "Connect letters P, A, S, T to form: PAST, TAP, PAT."
      },
      {
        "id": "wc_g7_e_52",
        "availableLetters": [
          "L",
          "I",
          "F",
          "E"
        ],
        "targetWords": [
          {
            "word": "LIFE",
            "turkishMeaning": "Hayat"
          },
          {
            "word": "LIE",
            "turkishMeaning": "Yalan / Uzanmak"
          }
        ],
        "category": "Biographies",
        "theme": "Biography Journeys",
        "explanation": "Connect letters L, I, F, E to form: LIFE, LIE."
      },
      {
        "id": "wc_g7_e_53",
        "availableLetters": [
          "W",
          "I",
          "L",
          "D"
        ],
        "targetWords": [
          {
            "word": "WILD",
            "turkishMeaning": "Vahşi"
          },
          {
            "word": "LID",
            "turkishMeaning": "Kapak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Nature Habitats",
        "explanation": "Connect letters W, I, L, D to form: WILD, LID."
      },
      {
        "id": "wc_g7_e_54",
        "availableLetters": [
          "L",
          "I",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "LION",
            "turkishMeaning": "Aslan"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          },
          {
            "word": "ION",
            "turkishMeaning": "İyon"
          }
        ],
        "category": "Wild Animals",
        "theme": "Savannah Kings",
        "explanation": "Connect letters L, I, O, N to form: LION, OIL, ION."
      },
      {
        "id": "wc_g7_e_55",
        "availableLetters": [
          "B",
          "E",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "BEAR",
            "turkishMeaning": "Ayı"
          },
          {
            "word": "BARE",
            "turkishMeaning": "Çıplak"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "BAR",
            "turkishMeaning": "Engel"
          }
        ],
        "category": "Wild Animals",
        "theme": "Alpine Fauna",
        "explanation": "Connect letters B, E, A, R to form: BEAR, BARE, EAR, BAR."
      },
      {
        "id": "wc_g7_e_56",
        "availableLetters": [
          "W",
          "O",
          "L",
          "F"
        ],
        "targetWords": [
          {
            "word": "WOLF",
            "turkishMeaning": "Kurt"
          },
          {
            "word": "FLOW",
            "turkishMeaning": "Akış"
          },
          {
            "word": "LOW",
            "turkishMeaning": "Alçak"
          },
          {
            "word": "OWL",
            "turkishMeaning": "Baykuş"
          }
        ],
        "category": "Wild Animals",
        "theme": "Forest Predators",
        "explanation": "Connect letters W, O, L, F to form: WOLF, FLOW, LOW, OWL."
      },
      {
        "id": "wc_g7_e_57",
        "availableLetters": [
          "D",
          "E",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "DEER",
            "turkishMeaning": "Geyik"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Wild Animals",
        "theme": "Woodland Animals",
        "explanation": "Connect letters D, E, E, R to form: DEER, RED."
      },
      {
        "id": "wc_g7_e_58",
        "availableLetters": [
          "S",
          "H",
          "O",
          "W"
        ],
        "targetWords": [
          {
            "word": "SHOW",
            "turkishMeaning": "Gösteri"
          },
          {
            "word": "HOW",
            "turkishMeaning": "Nasıl"
          },
          {
            "word": "WHO",
            "turkishMeaning": "Kim"
          }
        ],
        "category": "Television",
        "theme": "Broadcast Media",
        "explanation": "Connect letters S, H, O, W to form: SHOW, HOW, WHO."
      },
      {
        "id": "wc_g7_e_59",
        "availableLetters": [
          "N",
          "E",
          "W",
          "S"
        ],
        "targetWords": [
          {
            "word": "NEWS",
            "turkishMeaning": "Haberler"
          },
          {
            "word": "SEW",
            "turkishMeaning": "Dikmek"
          }
        ],
        "category": "Television",
        "theme": "Current Events",
        "explanation": "Connect letters N, E, W, S to form: NEWS, SEW."
      },
      {
        "id": "wc_g7_e_60",
        "availableLetters": [
          "F",
          "I",
          "L",
          "M"
        ],
        "targetWords": [
          {
            "word": "FILM",
            "turkishMeaning": "Film"
          }
        ],
        "category": "Television",
        "theme": "Cinema Arts",
        "explanation": "Connect letters F, I, L, M to form: FILM."
      },
      {
        "id": "wc_g7_e_61",
        "availableLetters": [
          "G",
          "I",
          "F",
          "T"
        ],
        "targetWords": [
          {
            "word": "GIFT",
            "turkishMeaning": "Hediye"
          },
          {
            "word": "FIT",
            "turkishMeaning": "Uygun, zinde"
          },
          {
            "word": "FIG",
            "turkishMeaning": "İncir"
          }
        ],
        "category": "Celebrations",
        "theme": "Presents",
        "explanation": "Connect letters G, I, F, T to form: GIFT, FIT, FIG."
      },
      {
        "id": "wc_g7_e_62",
        "availableLetters": [
          "C",
          "A",
          "R",
          "D"
        ],
        "targetWords": [
          {
            "word": "CARD",
            "turkishMeaning": "Kart"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          },
          {
            "word": "ARC",
            "turkishMeaning": "Kavis"
          }
        ],
        "category": "Celebrations",
        "theme": "Greeting Notes",
        "explanation": "Connect letters C, A, R, D to form: CARD, CAR, ARC."
      },
      {
        "id": "wc_g7_e_63",
        "availableLetters": [
          "H",
          "O",
          "P",
          "E"
        ],
        "targetWords": [
          {
            "word": "HOPE",
            "turkishMeaning": "Umut"
          },
          {
            "word": "HOP",
            "turkishMeaning": "Zıplamak"
          }
        ],
        "category": "Dreams",
        "theme": "Future Wishes",
        "explanation": "Connect letters H, O, P, E to form: HOPE, HOP."
      },
      {
        "id": "wc_g7_e_64",
        "availableLetters": [
          "W",
          "I",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "WISH",
            "turkishMeaning": "Dilek"
          }
        ],
        "category": "Dreams",
        "theme": "Aspirations",
        "explanation": "Connect letters W, I, S, H to form: WISH."
      },
      {
        "id": "wc_g7_e_65",
        "availableLetters": [
          "S",
          "T",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "ARTS",
            "turkishMeaning": "Sanatlar"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          },
          {
            "word": "RAT",
            "turkishMeaning": "Sıçan"
          },
          {
            "word": "TAR",
            "turkishMeaning": "Katran"
          }
        ],
        "category": "Planets",
        "theme": "Astronomy",
        "explanation": "Connect letters S, T, A, R to form: STAR, ARTS, ART, RAT, TAR."
      },
      {
        "id": "wc_g7_e_66",
        "availableLetters": [
          "M",
          "O",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "MOON",
            "turkishMeaning": "Ay"
          }
        ],
        "category": "Planets",
        "theme": "Night Sky",
        "explanation": "Connect letters M, O, O, N to form: MOON."
      },
      {
        "id": "wc_g7_e_67",
        "availableLetters": [
          "M",
          "A",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "MARS",
            "turkishMeaning": "Mars"
          },
          {
            "word": "ARMS",
            "turkishMeaning": "Kollar"
          },
          {
            "word": "ARM",
            "turkishMeaning": "Kol"
          },
          {
            "word": "RAM",
            "turkishMeaning": "Koç"
          }
        ],
        "category": "Planets",
        "theme": "Red Planet",
        "explanation": "Connect letters M, A, R, S to form: MARS, ARMS, ARM, RAM."
      },
      {
        "id": "wc_g7_e_68",
        "availableLetters": [
          "P",
          "A",
          "R",
          "K"
        ],
        "targetWords": [
          {
            "word": "PARK",
            "turkishMeaning": "Park"
          }
        ],
        "category": "Public Buildings",
        "theme": "Recreation",
        "explanation": "Connect letters P, A, R, K to form: PARK."
      },
      {
        "id": "wc_g7_e_69",
        "availableLetters": [
          "B",
          "A",
          "N",
          "K"
        ],
        "targetWords": [
          {
            "word": "BANK",
            "turkishMeaning": "Banka"
          },
          {
            "word": "BAN",
            "turkishMeaning": "Yasak"
          }
        ],
        "category": "Public Buildings",
        "theme": "Town Finance",
        "explanation": "Connect letters B, A, N, K to form: BANK, BAN."
      },
      {
        "id": "wc_g7_e_70",
        "availableLetters": [
          "M",
          "A",
          "L",
          "L"
        ],
        "targetWords": [
          {
            "word": "MALL",
            "turkishMeaning": "Alışveriş merkezi"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          }
        ],
        "category": "Public Buildings",
        "theme": "City Shopping",
        "explanation": "Connect letters M, A, L, L to form: MALL, ALL."
      },
      {
        "id": "wc_g7_e_71",
        "availableLetters": [
          "C",
          "A",
          "F",
          "E"
        ],
        "targetWords": [
          {
            "word": "CAFE",
            "turkishMeaning": "Kafe"
          },
          {
            "word": "FACE",
            "turkishMeaning": "Yüz"
          }
        ],
        "category": "Public Buildings",
        "theme": "Social Spots",
        "explanation": "Connect letters C, A, F, E to form: CAFE, FACE."
      },
      {
        "id": "wc_g7_e_72",
        "availableLetters": [
          "S",
          "A",
          "V",
          "E"
        ],
        "targetWords": [
          {
            "word": "SAVE",
            "turkishMeaning": "Korumak, kurtarmak"
          },
          {
            "word": "VASE",
            "turkishMeaning": "Vazo"
          }
        ],
        "category": "Environment",
        "theme": "Conservation",
        "explanation": "Connect letters S, A, V, E to form: SAVE, VASE."
      },
      {
        "id": "wc_g7_e_73",
        "availableLetters": [
          "T",
          "R",
          "E",
          "E"
        ],
        "targetWords": [
          {
            "word": "TREE",
            "turkishMeaning": "Ağaç"
          }
        ],
        "category": "Environment",
        "theme": "Forestry",
        "explanation": "Connect letters T, R, E, E to form: TREE."
      },
      {
        "id": "wc_g7_e_74",
        "availableLetters": [
          "S",
          "O",
          "I",
          "L"
        ],
        "targetWords": [
          {
            "word": "SOIL",
            "turkishMeaning": "Toprak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          }
        ],
        "category": "Environment",
        "theme": "Earth & Agriculture",
        "explanation": "Connect letters S, O, I, L to form: SOIL, OIL."
      },
      {
        "id": "wc_g7_e_75",
        "availableLetters": [
          "L",
          "E",
          "A",
          "F"
        ],
        "targetWords": [
          {
            "word": "LEAF",
            "turkishMeaning": "Yaprak"
          },
          {
            "word": "ALE",
            "turkishMeaning": "Mayalı içecek"
          }
        ],
        "category": "Environment",
        "theme": "Botany",
        "explanation": "Connect letters L, E, A, F to form: LEAF, ALE."
      },
      {
        "id": "wc_g7_e_76",
        "availableLetters": [
          "D",
          "A",
          "T",
          "A"
        ],
        "targetWords": [
          {
            "word": "DATA",
            "turkishMeaning": "Veri"
          }
        ],
        "category": "Life Online",
        "theme": "Cyber Information",
        "explanation": "Connect letters D, A, T, A to form: DATA."
      },
      {
        "id": "wc_g7_e_77",
        "availableLetters": [
          "S",
          "A",
          "F",
          "E"
        ],
        "targetWords": [
          {
            "word": "SAFE",
            "turkishMeaning": "Güvenli"
          }
        ],
        "category": "Life Online",
        "theme": "Online Security",
        "explanation": "Connect letters S, A, F, E to form: SAFE."
      },
      {
        "id": "wc_g7_e_78",
        "availableLetters": [
          "U",
          "S",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "USER",
            "turkishMeaning": "Kullanıcı"
          },
          {
            "word": "SURE",
            "turkishMeaning": "Emin"
          },
          {
            "word": "USE",
            "turkishMeaning": "Kullanmak"
          }
        ],
        "category": "Life Online",
        "theme": "Digital Accounts",
        "explanation": "Connect letters U, S, E, R to form: USER, SURE, USE."
      },
      {
        "id": "wc_g7_e_79",
        "availableLetters": [
          "H",
          "E",
          "L",
          "P"
        ],
        "targetWords": [
          {
            "word": "HELP",
            "turkishMeaning": "Yardım"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Safety Assistance",
        "explanation": "Connect letters H, E, L, P to form: HELP."
      },
      {
        "id": "wc_g7_e_80",
        "availableLetters": [
          "B",
          "U",
          "R",
          "N"
        ],
        "targetWords": [
          {
            "word": "BURN",
            "turkishMeaning": "Yanık"
          },
          {
            "word": "RUN",
            "turkishMeaning": "Koşmak"
          },
          {
            "word": "RUB",
            "turkishMeaning": "Ovalamak"
          },
          {
            "word": "URN",
            "turkishMeaning": "Vazo"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "First Aid Care",
        "explanation": "Connect letters B, U, R, N to form: BURN, RUN, RUB, URN."
      }
    ],
    "medium": [
      {
        "id": "wc_g7_m_01",
        "availableLetters": [
          "P",
          "L",
          "A",
          "N",
          "T"
        ],
        "targetWords": [
          {
            "word": "PLANT",
            "turkishMeaning": "Bitki"
          },
          {
            "word": "PLAN",
            "turkishMeaning": "Plan"
          },
          {
            "word": "PANT",
            "turkishMeaning": "Solumak"
          },
          {
            "word": "ANT",
            "turkishMeaning": "Karınca"
          },
          {
            "word": "PAN",
            "turkishMeaning": "Tava"
          }
        ],
        "category": "Environment",
        "theme": "Botany",
        "explanation": "Connect letters P, L, A, N, T to form: PLANT, PLAN, PANT, ANT, PAN."
      },
      {
        "id": "wc_g7_m_02",
        "availableLetters": [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        "targetWords": [
          {
            "word": "EARTH",
            "turkishMeaning": "Dünya"
          },
          {
            "word": "HEART",
            "turkishMeaning": "Kalp"
          },
          {
            "word": "HEAT",
            "turkishMeaning": "Isı"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          }
        ],
        "category": "Planets",
        "theme": "Terra",
        "explanation": "Connect letters E, A, R, T, H to form: EARTH, HEART, HEAT, HEAR, ART."
      },
      {
        "id": "wc_g7_m_03",
        "availableLetters": [
          "S",
          "M",
          "A",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "SMART",
            "turkishMeaning": "Zeki"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "TRAM",
            "turkishMeaning": "Tramvay"
          },
          {
            "word": "ARM",
            "turkishMeaning": "Kol"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          }
        ],
        "category": "Personality",
        "theme": "Intellect",
        "explanation": "Connect letters S, M, A, R, T to form: SMART, STAR, TRAM, ARM, ART."
      },
      {
        "id": "wc_g7_m_04",
        "availableLetters": [
          "B",
          "R",
          "A",
          "V",
          "E"
        ],
        "targetWords": [
          {
            "word": "BRAVE",
            "turkishMeaning": "Cesur"
          },
          {
            "word": "BEAR",
            "turkishMeaning": "Ayı"
          },
          {
            "word": "BARE",
            "turkishMeaning": "Yalın, sade"
          },
          {
            "word": "RAVE",
            "turkishMeaning": "Övgüyle bahsetmek"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Personality",
        "theme": "Courageous Friends",
        "explanation": "Connect letters B, R, A, V, E to form: BRAVE, BEAR, BARE, RAVE, EAR.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_m_05",
        "availableLetters": [
          "S",
          "H",
          "O",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "SHORT",
            "turkishMeaning": "Kısa"
          },
          {
            "word": "SHOT",
            "turkishMeaning": "Atış"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Sıralamak"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          }
        ],
        "category": "Appearance",
        "theme": "Length",
        "explanation": "Connect letters S, H, O, R, T to form: SHORT, SHOT, SORT, HOT, ROT."
      },
      {
        "id": "wc_g7_m_06",
        "availableLetters": [
          "T",
          "R",
          "A",
          "I",
          "N"
        ],
        "targetWords": [
          {
            "word": "TRAIN",
            "turkishMeaning": "Antrenman"
          },
          {
            "word": "RAIN",
            "turkishMeaning": "Yağmur"
          },
          {
            "word": "RANT",
            "turkishMeaning": "Bağırmak"
          },
          {
            "word": "TIN",
            "turkishMeaning": "Teneke"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          }
        ],
        "category": "Sports",
        "theme": "Exercise",
        "explanation": "Connect letters T, R, A, I, N to form: TRAIN, RAIN, RANT, TIN, AIR."
      },
      {
        "id": "wc_g7_m_07",
        "availableLetters": [
          "M",
          "A",
          "T",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "MATCH",
            "turkishMeaning": "Maç"
          },
          {
            "word": "CHAT",
            "turkishMeaning": "Sohbet"
          },
          {
            "word": "MATH",
            "turkishMeaning": "Matematik"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          },
          {
            "word": "HAT",
            "turkishMeaning": "Şapka"
          }
        ],
        "category": "Sports",
        "theme": "Competition",
        "explanation": "Connect letters M, A, T, C, H to form: MATCH, CHAT, MATH, CAT, HAT."
      },
      {
        "id": "wc_g7_m_08",
        "availableLetters": [
          "C",
          "O",
          "U",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "COURT",
            "turkishMeaning": "Kort"
          },
          {
            "word": "TOUR",
            "turkishMeaning": "Tur"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          },
          {
            "word": "OUT",
            "turkishMeaning": "Dışarı"
          },
          {
            "word": "COT",
            "turkishMeaning": "Karyola"
          }
        ],
        "category": "Sports",
        "theme": "Arena",
        "explanation": "Connect letters C, O, U, R, T to form: COURT, TOUR, ROT, OUT, COT."
      },
      {
        "id": "wc_g7_m_09",
        "availableLetters": [
          "P",
          "R",
          "I",
          "Z",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "PRIZE",
            "turkishMeaning": "Ödül"
          },
          {
            "word": "PRIZES",
            "turkishMeaning": "Ödüller"
          },
          {
            "word": "RIPE",
            "turkishMeaning": "Olgun"
          },
          {
            "word": "PIER",
            "turkishMeaning": "İskele"
          },
          {
            "word": "ZIP",
            "turkishMeaning": "Fermuar"
          }
        ],
        "category": "Biographies",
        "theme": "Awards",
        "explanation": "Connect letters P, R, I, Z, E, S to form: PRIZE, PRIZES, RIPE, PIER, ZIP."
      },
      {
        "id": "wc_g7_m_10",
        "availableLetters": [
          "A",
          "W",
          "A",
          "R",
          "D",
          "S"
        ],
        "targetWords": [
          {
            "word": "AWARDS",
            "turkishMeaning": "Ödüller"
          },
          {
            "word": "AWARD",
            "turkishMeaning": "Ödül"
          },
          {
            "word": "DRAW",
            "turkishMeaning": "Çizmek / berabere"
          },
          {
            "word": "RAW",
            "turkishMeaning": "Ham, çiğ"
          },
          {
            "word": "SAD",
            "turkishMeaning": "Üzgün"
          }
        ],
        "category": "Biographies",
        "theme": "Honors & Achievements",
        "explanation": "Connect letters A, W, A, R, D, S to form: AWARDS, AWARD, DRAW, RAW, SAD.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_m_11",
        "availableLetters": [
          "E",
          "A",
          "G",
          "L",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "EAGLE",
            "turkishMeaning": "Kartal"
          },
          {
            "word": "EAGLES",
            "turkishMeaning": "Kartallar"
          },
          {
            "word": "GALE",
            "turkishMeaning": "Fırtına"
          },
          {
            "word": "SALE",
            "turkishMeaning": "Satış"
          },
          {
            "word": "AGE",
            "turkishMeaning": "Yaş"
          }
        ],
        "category": "Wild Animals",
        "theme": "Raptors",
        "explanation": "Connect letters E, A, G, L, E, S to form: EAGLE, EAGLES, GALE, SALE, AGE."
      },
      {
        "id": "wc_g7_m_12",
        "availableLetters": [
          "T",
          "I",
          "G",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "TIGER",
            "turkishMeaning": "Kaplan"
          },
          {
            "word": "TIGERS",
            "turkishMeaning": "Kaplanlar"
          },
          {
            "word": "TIRE",
            "turkishMeaning": "Yormak"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağlamak"
          },
          {
            "word": "GET",
            "turkishMeaning": "Almak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Stripes",
        "explanation": "Connect letters T, I, G, E, R, S to form: TIGER, TIGERS, TIRE, TIE, GET."
      },
      {
        "id": "wc_g7_m_13",
        "availableLetters": [
          "W",
          "A",
          "T",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "WATERS",
            "turkishMeaning": "Sular"
          },
          {
            "word": "WATER",
            "turkishMeaning": "Su"
          },
          {
            "word": "SWEAT",
            "turkishMeaning": "Ter, terlemek"
          },
          {
            "word": "WASTE",
            "turkishMeaning": "Atık / israf"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          }
        ],
        "category": "Environment",
        "theme": "Fresh Water",
        "explanation": "Connect letters W, A, T, E, R, S to form: WATERS, WATER, SWEAT, WASTE, STAR.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_m_14",
        "availableLetters": [
          "S",
          "H",
          "A",
          "R",
          "K",
          "S"
        ],
        "targetWords": [
          {
            "word": "SHARK",
            "turkishMeaning": "Köpekbalığı"
          },
          {
            "word": "SHARKS",
            "turkishMeaning": "Köpekbalıkları"
          },
          {
            "word": "HARK",
            "turkishMeaning": "Dinlemek"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          },
          {
            "word": "ARK",
            "turkishMeaning": "Tekne"
          }
        ],
        "category": "Wild Animals",
        "theme": "Pelagic",
        "explanation": "Connect letters S, H, A, R, K, S to form: SHARK, SHARKS, HARK, ASH, ARK."
      },
      {
        "id": "wc_g7_m_15",
        "availableLetters": [
          "A",
          "C",
          "T",
          "O",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "ACTOR",
            "turkishMeaning": "Aktör"
          },
          {
            "word": "ACTORS",
            "turkishMeaning": "Aktörler"
          },
          {
            "word": "COAT",
            "turkishMeaning": "Palto"
          },
          {
            "word": "CART",
            "turkishMeaning": "Araba"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          }
        ],
        "category": "Television",
        "theme": "Cinema",
        "explanation": "Connect letters A, C, T, O, R, S to form: ACTOR, ACTORS, COAT, CART, CAT."
      },
      {
        "id": "wc_g7_m_16",
        "availableLetters": [
          "P",
          "A",
          "R",
          "T",
          "Y"
        ],
        "targetWords": [
          {
            "word": "PARTY",
            "turkishMeaning": "Parti"
          },
          {
            "word": "TRAY",
            "turkishMeaning": "Tepsi"
          },
          {
            "word": "PRAY",
            "turkishMeaning": "Dua etmek"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          },
          {
            "word": "PAY",
            "turkishMeaning": "Ödemek"
          }
        ],
        "category": "Celebrations",
        "theme": "Gala",
        "explanation": "Connect letters P, A, R, T, Y to form: PARTY, TRAY, PRAY, ART, PAY."
      },
      {
        "id": "wc_g7_m_17",
        "availableLetters": [
          "G",
          "U",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "GUEST",
            "turkishMeaning": "Misafir"
          },
          {
            "word": "GUST",
            "turkishMeaning": "Rüzgar hamlesi"
          },
          {
            "word": "GETS",
            "turkishMeaning": "Alır"
          },
          {
            "word": "SET",
            "turkishMeaning": "Kurmak"
          },
          {
            "word": "GUT",
            "turkishMeaning": "İçgüdü"
          }
        ],
        "category": "Celebrations",
        "theme": "Host",
        "explanation": "Connect letters G, U, E, S, T to form: GUEST, GUST, GETS, SET, GUT."
      },
      {
        "id": "wc_g7_m_18",
        "availableLetters": [
          "C",
          "L",
          "O",
          "W",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "CLOWN",
            "turkishMeaning": "Palyaço"
          },
          {
            "word": "CLOWNS",
            "turkishMeaning": "Palyaçolar"
          },
          {
            "word": "OWL",
            "turkishMeaning": "Baykuş"
          },
          {
            "word": "LOW",
            "turkishMeaning": "Alçak"
          },
          {
            "word": "NOW",
            "turkishMeaning": "Şimdi"
          }
        ],
        "category": "Celebrations",
        "theme": "Circus",
        "explanation": "Connect letters C, L, O, W, N, S to form: CLOWN, CLOWNS, OWL, LOW, NOW."
      },
      {
        "id": "wc_g7_m_19",
        "availableLetters": [
          "M",
          "U",
          "S",
          "I",
          "C",
          "S"
        ],
        "targetWords": [
          {
            "word": "MUSIC",
            "turkishMeaning": "Müzik"
          },
          {
            "word": "MUSICS",
            "turkishMeaning": "Müzikler"
          },
          {
            "word": "SCUM",
            "turkishMeaning": "Köpük"
          },
          {
            "word": "SUM",
            "turkishMeaning": "Toplam"
          },
          {
            "word": "SIC",
            "turkishMeaning": "Aynen"
          }
        ],
        "category": "Celebrations",
        "theme": "Tunes",
        "explanation": "Connect letters M, U, S, I, C, S to form: MUSIC, MUSICS, SCUM, SUM, SIC."
      },
      {
        "id": "wc_g7_m_20",
        "availableLetters": [
          "D",
          "R",
          "E",
          "A",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "DREAM",
            "turkishMeaning": "Rüya"
          },
          {
            "word": "DREAMS",
            "turkishMeaning": "Rüyalar"
          },
          {
            "word": "DARE",
            "turkishMeaning": "Cesaret"
          },
          {
            "word": "READ",
            "turkishMeaning": "Okumak"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Dreams",
        "theme": "Reverie",
        "explanation": "Connect letters D, R, E, A, M, S to form: DREAM, DREAMS, DARE, READ, RED."
      },
      {
        "id": "wc_g7_m_21",
        "availableLetters": [
          "S",
          "P",
          "A",
          "C",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "SPACE",
            "turkishMeaning": "Uzay"
          },
          {
            "word": "SPACES",
            "turkishMeaning": "Alanlar"
          },
          {
            "word": "CAPE",
            "turkishMeaning": "Pelerin"
          },
          {
            "word": "PACE",
            "turkishMeaning": "Adım"
          },
          {
            "word": "CAP",
            "turkishMeaning": "Şapka"
          }
        ],
        "category": "Planets",
        "theme": "Cosmos",
        "explanation": "Connect letters S, P, A, C, E, S to form: SPACE, SPACES, CAPE, PACE, CAP."
      },
      {
        "id": "wc_g7_m_22",
        "availableLetters": [
          "B",
          "R",
          "A",
          "V",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "BRAVES",
            "turkishMeaning": "Cesurlar"
          },
          {
            "word": "BRAVE",
            "turkishMeaning": "Cesur"
          },
          {
            "word": "BEARS",
            "turkishMeaning": "Ayılar"
          },
          {
            "word": "SAVE",
            "turkishMeaning": "Kurtarmak"
          },
          {
            "word": "BASE",
            "turkishMeaning": "Temel / üs"
          }
        ],
        "category": "Personality",
        "theme": "Heroic Courage",
        "explanation": "Connect letters B, R, A, V, E, S to form: BRAVES, BRAVE, BEARS, SAVE, BASE.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_m_23",
        "availableLetters": [
          "O",
          "R",
          "B",
          "I",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "ORBIT",
            "turkishMeaning": "Yörünge"
          },
          {
            "word": "ORBITS",
            "turkishMeaning": "Yörüngeler"
          },
          {
            "word": "RIOT",
            "turkishMeaning": "İsyan"
          },
          {
            "word": "BIT",
            "turkishMeaning": "Parça"
          },
          {
            "word": "ROB",
            "turkishMeaning": "Soymak"
          }
        ],
        "category": "Planets",
        "theme": "Revolution",
        "explanation": "Connect letters O, R, B, I, T, S to form: ORBIT, ORBITS, RIOT, BIT, ROB."
      },
      {
        "id": "wc_g7_m_24",
        "availableLetters": [
          "S",
          "O",
          "L",
          "A",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "SOLAR",
            "turkishMeaning": "Güneşle ilgili"
          },
          {
            "word": "SOAR",
            "turkishMeaning": "Süzülmek"
          },
          {
            "word": "ORAL",
            "turkishMeaning": "Sözlü"
          },
          {
            "word": "ALSO",
            "turkishMeaning": "Ayrıca"
          },
          {
            "word": "OAR",
            "turkishMeaning": "Kürek"
          }
        ],
        "category": "Environment",
        "theme": "Sun",
        "explanation": "Connect letters S, O, L, A, R, S to form: SOLAR, SOAR, ORAL, ALSO, OAR."
      },
      {
        "id": "wc_g7_m_25",
        "availableLetters": [
          "C",
          "L",
          "E",
          "A",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "CLEAN",
            "turkishMeaning": "Temiz"
          },
          {
            "word": "CLEANS",
            "turkishMeaning": "Temizler"
          },
          {
            "word": "LANE",
            "turkishMeaning": "Şerit"
          },
          {
            "word": "LEAN",
            "turkishMeaning": "Yaslanmak"
          },
          {
            "word": "CAN",
            "turkishMeaning": "Kutu"
          }
        ],
        "category": "Environment",
        "theme": "Sanitation",
        "explanation": "Connect letters C, L, E, A, N, S to form: CLEAN, CLEANS, LANE, LEAN, CAN."
      },
      {
        "id": "wc_g7_m_26",
        "availableLetters": [
          "G",
          "R",
          "E",
          "E",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "GREEN",
            "turkishMeaning": "Yeşil"
          },
          {
            "word": "GREENS",
            "turkishMeaning": "Yeşillikler"
          },
          {
            "word": "GENE",
            "turkishMeaning": "Gen"
          },
          {
            "word": "SEEN",
            "turkishMeaning": "Görülmüş"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Environment",
        "theme": "Flora",
        "explanation": "Connect letters G, R, E, E, N, S to form: GREEN, GREENS, GENE, SEEN, SEE."
      },
      {
        "id": "wc_g7_m_27",
        "availableLetters": [
          "T",
          "R",
          "A",
          "S",
          "H",
          "Y"
        ],
        "targetWords": [
          {
            "word": "TRASH",
            "turkishMeaning": "Çöp"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "RASH",
            "turkishMeaning": "Kızarıklık"
          },
          {
            "word": "HAT",
            "turkishMeaning": "Şapka"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          }
        ],
        "category": "Environment",
        "theme": "Waste",
        "explanation": "Connect letters T, R, A, S, H, Y to form: TRASH, STAR, RASH, HAT, ART."
      },
      {
        "id": "wc_g7_m_28",
        "availableLetters": [
          "W",
          "A",
          "T",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "WATERS",
            "turkishMeaning": "Sular"
          },
          {
            "word": "WATER",
            "turkishMeaning": "Su"
          },
          {
            "word": "SWEAT",
            "turkishMeaning": "Ter"
          },
          {
            "word": "WASTE",
            "turkishMeaning": "Atık / israf"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          }
        ],
        "category": "Environment",
        "theme": "Water Conservation",
        "explanation": "Connect letters W, A, T, E, R, S to form: WATERS, WATER, SWEAT, WASTE, STAR.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_m_29",
        "availableLetters": [
          "O",
          "C",
          "E",
          "A",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "OCEAN",
            "turkishMeaning": "Okyanus"
          },
          {
            "word": "OCEANS",
            "turkishMeaning": "Okyanuslar"
          },
          {
            "word": "CONE",
            "turkishMeaning": "Koni"
          },
          {
            "word": "CANE",
            "turkishMeaning": "Baston"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          }
        ],
        "category": "Environment",
        "theme": "Oceanic",
        "explanation": "Connect letters O, C, E, A, N, S to form: OCEAN, OCEANS, CONE, CANE, ONE."
      },
      {
        "id": "wc_g7_m_30",
        "availableLetters": [
          "R",
          "I",
          "V",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "RIVER",
            "turkishMeaning": "Nehir"
          },
          {
            "word": "RIVERS",
            "turkishMeaning": "Nehirler"
          },
          {
            "word": "RISE",
            "turkishMeaning": "Yükselmek"
          },
          {
            "word": "SIRE",
            "turkishMeaning": "Efendi"
          },
          {
            "word": "SIR",
            "turkishMeaning": "Beyefendi"
          }
        ],
        "category": "Environment",
        "theme": "Riparian",
        "explanation": "Connect letters R, I, V, E, R, S to form: RIVER, RIVERS, RISE, SIRE, SIR."
      },
      {
        "id": "wc_g7_m_31",
        "availableLetters": [
          "S",
          "H",
          "I",
          "N",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "SHINE",
            "turkishMeaning": "Parlamak"
          },
          {
            "word": "SHINES",
            "turkishMeaning": "Parlar"
          },
          {
            "word": "SHIN",
            "turkishMeaning": "İncik"
          },
          {
            "word": "SHE",
            "turkishMeaning": "O kadın"
          },
          {
            "word": "HEN",
            "turkishMeaning": "Tavuk"
          }
        ],
        "category": "Planets",
        "theme": "Radiance",
        "explanation": "Connect letters S, H, I, N, E, S to form: SHINE, SHINES, SHIN, SHE, HEN."
      },
      {
        "id": "wc_g7_m_32",
        "availableLetters": [
          "S",
          "T",
          "O",
          "R",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "STORM",
            "turkishMeaning": "Fırtına"
          },
          {
            "word": "STORMS",
            "turkishMeaning": "Fırtınalar"
          },
          {
            "word": "MOST",
            "turkishMeaning": "En çok"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          },
          {
            "word": "TOM",
            "turkishMeaning": "Erkek kedi"
          }
        ],
        "category": "Environment",
        "theme": "Tempest",
        "explanation": "Connect letters S, T, O, R, M, S to form: STORM, STORMS, MOST, ROT, TOM."
      },
      {
        "id": "wc_g7_m_33",
        "availableLetters": [
          "C",
          "L",
          "O",
          "U",
          "D",
          "S"
        ],
        "targetWords": [
          {
            "word": "CLOUD",
            "turkishMeaning": "Bulut"
          },
          {
            "word": "CLOUDS",
            "turkishMeaning": "Bulutlar"
          },
          {
            "word": "COLD",
            "turkishMeaning": "Soğuk"
          },
          {
            "word": "LOUD",
            "turkishMeaning": "Yüksek ses"
          },
          {
            "word": "OLD",
            "turkishMeaning": "Yaşlı"
          }
        ],
        "category": "Environment",
        "theme": "Cumulus",
        "explanation": "Connect letters C, L, O, U, D, S to form: CLOUD, CLOUDS, COLD, LOUD, OLD."
      },
      {
        "id": "wc_g7_m_34",
        "availableLetters": [
          "L",
          "I",
          "G",
          "H",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "LIGHT",
            "turkishMeaning": "Işık"
          },
          {
            "word": "LIGHTS",
            "turkishMeaning": "Işıklar"
          },
          {
            "word": "SIGHT",
            "turkishMeaning": "Görüş"
          },
          {
            "word": "HIT",
            "turkishMeaning": "Vurmak"
          },
          {
            "word": "LIT",
            "turkishMeaning": "Aydınlatılmış"
          }
        ],
        "category": "Environment",
        "theme": "Luminance",
        "explanation": "Connect letters L, I, G, H, T, S to form: LIGHT, LIGHTS, SIGHT, HIT, LIT."
      },
      {
        "id": "wc_g7_m_35",
        "availableLetters": [
          "G",
          "L",
          "O",
          "B",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "GLOBE",
            "turkishMeaning": "Yerküre"
          },
          {
            "word": "GLOBES",
            "turkishMeaning": "Küreler"
          },
          {
            "word": "LOBE",
            "turkishMeaning": "Lob"
          },
          {
            "word": "BLOG",
            "turkishMeaning": "Blog"
          },
          {
            "word": "LEG",
            "turkishMeaning": "Bacak"
          }
        ],
        "category": "Public Buildings",
        "theme": "Atlas",
        "explanation": "Connect letters G, L, O, B, E, S to form: GLOBE, GLOBES, LOBE, BLOG, LEG."
      },
      {
        "id": "wc_g7_m_36",
        "availableLetters": [
          "F",
          "O",
          "R",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "FOREST",
            "turkishMeaning": "Orman"
          },
          {
            "word": "FORT",
            "turkishMeaning": "Kale"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "SOFT",
            "turkishMeaning": "Yumuşak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Rainforest",
        "explanation": "Connect letters F, O, R, E, S, T to form: FOREST, FORT, REST, ROSE, SOFT."
      },
      {
        "id": "wc_g7_m_37",
        "availableLetters": [
          "C",
          "I",
          "N",
          "E",
          "M",
          "A"
        ],
        "targetWords": [
          {
            "word": "CINEMA",
            "turkishMeaning": "Sinema"
          },
          {
            "word": "MINE",
            "turkishMeaning": "Maden"
          },
          {
            "word": "NAME",
            "turkishMeaning": "İsim"
          },
          {
            "word": "MAIN",
            "turkishMeaning": "Ana"
          },
          {
            "word": "MAN",
            "turkishMeaning": "Adam"
          }
        ],
        "category": "Public Buildings",
        "theme": "Cinema",
        "explanation": "Connect letters C, I, N, E, M, A to form: CINEMA, MINE, NAME, MAIN, MAN."
      },
      {
        "id": "wc_g7_m_38",
        "availableLetters": [
          "R",
          "A",
          "F",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "RAFTS",
            "turkishMeaning": "Rafting botları"
          },
          {
            "word": "RAFT",
            "turkishMeaning": "Sal / bot"
          },
          {
            "word": "FAST",
            "turkishMeaning": "Hızlı"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "ARTS",
            "turkishMeaning": "Sanatlar"
          }
        ],
        "category": "Sports",
        "theme": "River Rafting",
        "explanation": "Connect letters R, A, F, T, S to form: RAFTS, RAFT, FAST, STAR, ARTS.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_m_39",
        "availableLetters": [
          "M",
          "A",
          "R",
          "K",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "MARKET",
            "turkishMeaning": "Pazar"
          },
          {
            "word": "MAKE",
            "turkishMeaning": "Yapmak"
          },
          {
            "word": "MARK",
            "turkishMeaning": "İşaret"
          },
          {
            "word": "MEAT",
            "turkishMeaning": "Et"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "Public Buildings",
        "theme": "Market",
        "explanation": "Connect letters M, A, R, K, E, T to form: MARKET, MAKE, MARK, MEAT, TEA."
      },
      {
        "id": "wc_g7_m_40",
        "availableLetters": [
          "C",
          "A",
          "N",
          "D",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "CANDLE",
            "turkishMeaning": "Mum"
          },
          {
            "word": "LANCE",
            "turkishMeaning": "Mızrak"
          },
          {
            "word": "LAND",
            "turkishMeaning": "Kara"
          },
          {
            "word": "LANE",
            "turkishMeaning": "Şerit"
          },
          {
            "word": "CAN",
            "turkishMeaning": "Kutu"
          }
        ],
        "category": "Celebrations",
        "theme": "Lantern",
        "explanation": "Connect letters C, A, N, D, L, E to form: CANDLE, LANCE, LAND, LANE, CAN."
      },
      {
        "id": "wc_g7_m_41",
        "availableLetters": [
          "S",
          "M",
          "A",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "SMART",
            "turkishMeaning": "Zeki"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "RAMS",
            "turkishMeaning": "Koçlar"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          },
          {
            "word": "MAT",
            "turkishMeaning": "Paspas"
          },
          {
            "word": "ARM",
            "turkishMeaning": "Kol"
          }
        ],
        "category": "Personality",
        "theme": "Intelligence",
        "explanation": "Connect letters S, M, A, R, T to form: SMART, STAR, RAMS, ART, MAT, ARM."
      },
      {
        "id": "wc_g7_m_42",
        "availableLetters": [
          "B",
          "R",
          "A",
          "V",
          "E"
        ],
        "targetWords": [
          {
            "word": "BRAVE",
            "turkishMeaning": "Cesur"
          },
          {
            "word": "BEAR",
            "turkishMeaning": "Ayı"
          },
          {
            "word": "BARE",
            "turkishMeaning": "Yalın"
          },
          {
            "word": "BAR",
            "turkishMeaning": "Bar"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Personality",
        "theme": "Courage",
        "explanation": "Connect letters B, R, A, V, E to form: BRAVE, BEAR, BARE, BAR, EAR."
      },
      {
        "id": "wc_g7_m_43",
        "availableLetters": [
          "T",
          "R",
          "A",
          "C",
          "K"
        ],
        "targetWords": [
          {
            "word": "TRACK",
            "turkishMeaning": "Pist, iz"
          },
          {
            "word": "CART",
            "turkishMeaning": "Araba"
          },
          {
            "word": "ACT",
            "turkishMeaning": "Eylem"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          }
        ],
        "category": "Sports",
        "theme": "Athletic Courses",
        "explanation": "Connect letters T, R, A, C, K to form: TRACK, CART, ACT, CAT, ART."
      },
      {
        "id": "wc_g7_m_44",
        "availableLetters": [
          "M",
          "E",
          "D",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "MEDAL",
            "turkishMeaning": "Madalya"
          },
          {
            "word": "DEAL",
            "turkishMeaning": "Anlaşma"
          },
          {
            "word": "MALE",
            "turkishMeaning": "Erkek"
          },
          {
            "word": "LEAD",
            "turkishMeaning": "Önderlik"
          },
          {
            "word": "DAM",
            "turkishMeaning": "Baraj"
          }
        ],
        "category": "Sports",
        "theme": "Podium Honors",
        "explanation": "Connect letters M, E, D, A, L to form: MEDAL, DEAL, MALE, LEAD, DAM."
      },
      {
        "id": "wc_g7_m_45",
        "availableLetters": [
          "C",
          "O",
          "A",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "COACH",
            "turkishMeaning": "Antrenör"
          }
        ],
        "category": "Sports",
        "theme": "Team Training",
        "explanation": "Connect letters C, O, A, C, H to form: COACH."
      },
      {
        "id": "wc_g7_m_46",
        "availableLetters": [
          "P",
          "I",
          "T",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "PITCH",
            "turkishMeaning": "Futbol sahası"
          },
          {
            "word": "CHIP",
            "turkishMeaning": "Çip"
          },
          {
            "word": "TIP",
            "turkishMeaning": "İpucu"
          },
          {
            "word": "PIT",
            "turkishMeaning": "Çukur"
          },
          {
            "word": "HIT",
            "turkishMeaning": "Vurmak"
          }
        ],
        "category": "Sports",
        "theme": "Football Grounds",
        "explanation": "Connect letters P, I, T, C, H to form: PITCH, CHIP, TIP, PIT, HIT."
      },
      {
        "id": "wc_g7_m_47",
        "availableLetters": [
          "P",
          "R",
          "I",
          "Z",
          "E"
        ],
        "targetWords": [
          {
            "word": "PRIZE",
            "turkishMeaning": "Ödül"
          },
          {
            "word": "RIPE",
            "turkishMeaning": "Olgun"
          },
          {
            "word": "ZIP",
            "turkishMeaning": "Fermuar"
          },
          {
            "word": "PIE",
            "turkishMeaning": "Turta"
          }
        ],
        "category": "Biographies",
        "theme": "Scientific Honors",
        "explanation": "Connect letters P, R, I, Z, E to form: PRIZE, RIPE, ZIP, PIE."
      },
      {
        "id": "wc_g7_m_48",
        "availableLetters": [
          "E",
          "A",
          "R",
          "L",
          "Y"
        ],
        "targetWords": [
          {
            "word": "EARLY",
            "turkishMeaning": "Erken"
          },
          {
            "word": "YEAR",
            "turkishMeaning": "Yıl"
          },
          {
            "word": "REAL",
            "turkishMeaning": "Gerçek"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "RAY",
            "turkishMeaning": "Işın"
          }
        ],
        "category": "Biographies",
        "theme": "Early Life",
        "explanation": "Connect letters E, A, R, L, Y to form: EARLY, YEAR, REAL, EAR, RAY."
      },
      {
        "id": "wc_g7_m_49",
        "availableLetters": [
          "T",
          "I",
          "G",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "TIGER",
            "turkishMeaning": "Kaplan"
          },
          {
            "word": "TIRE",
            "turkishMeaning": "Lastik / Yorulmak"
          },
          {
            "word": "GRIT",
            "turkishMeaning": "Cesaret"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Kravat"
          }
        ],
        "category": "Wild Animals",
        "theme": "Jungle Apex",
        "explanation": "Connect letters T, I, G, E, R to form: TIGER, TIRE, GRIT, TIE."
      },
      {
        "id": "wc_g7_m_50",
        "availableLetters": [
          "E",
          "A",
          "G",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "EAGLE",
            "turkishMeaning": "Kartal"
          },
          {
            "word": "GALE",
            "turkishMeaning": "Fırtına"
          },
          {
            "word": "AGE",
            "turkishMeaning": "Yaş"
          },
          {
            "word": "LEG",
            "turkishMeaning": "Bacak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Birds of Prey",
        "explanation": "Connect letters E, A, G, L, E to form: EAGLE, GALE, AGE, LEG."
      },
      {
        "id": "wc_g7_m_51",
        "availableLetters": [
          "S",
          "H",
          "A",
          "R",
          "K"
        ],
        "targetWords": [
          {
            "word": "SHARK",
            "turkishMeaning": "Köpekbalığı"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          },
          {
            "word": "ARK",
            "turkishMeaning": "Gemi"
          }
        ],
        "category": "Wild Animals",
        "theme": "Ocean Hunters",
        "explanation": "Connect letters S, H, A, R, K to form: SHARK, ASH, ARK."
      },
      {
        "id": "wc_g7_m_52",
        "availableLetters": [
          "W",
          "H",
          "A",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "WHALE",
            "turkishMeaning": "Balina"
          },
          {
            "word": "HEAL",
            "turkishMeaning": "İyileşmek"
          },
          {
            "word": "ALE",
            "turkishMeaning": "Bira"
          }
        ],
        "category": "Wild Animals",
        "theme": "Marine Giants",
        "explanation": "Connect letters W, H, A, L, E to form: WHALE, HEAL, ALE."
      },
      {
        "id": "wc_g7_m_53",
        "availableLetters": [
          "Z",
          "E",
          "B",
          "R",
          "A"
        ],
        "targetWords": [
          {
            "word": "ZEBRA",
            "turkishMeaning": "Zebra"
          },
          {
            "word": "BEAR",
            "turkishMeaning": "Ayı"
          },
          {
            "word": "BARE",
            "turkishMeaning": "Yalın"
          },
          {
            "word": "BAR",
            "turkishMeaning": "Çubuk"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Savannah Grazers",
        "explanation": "Connect letters Z, E, B, R, A to form: ZEBRA, BEAR, BARE, BAR, EAR."
      },
      {
        "id": "wc_g7_m_54",
        "availableLetters": [
          "S",
          "C",
          "E",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "SCENE",
            "turkishMeaning": "Sahne"
          },
          {
            "word": "SEEN",
            "turkishMeaning": "Görüldü"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Television",
        "theme": "Film Production",
        "explanation": "Connect letters S, C, E, N, E to form: SCENE, SEEN, SEE."
      },
      {
        "id": "wc_g7_m_55",
        "availableLetters": [
          "A",
          "C",
          "T",
          "O",
          "R"
        ],
        "targetWords": [
          {
            "word": "ACTOR",
            "turkishMeaning": "Oyuncu"
          },
          {
            "word": "COAT",
            "turkishMeaning": "Palto"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          },
          {
            "word": "OAT",
            "turkishMeaning": "Yulaf"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          }
        ],
        "category": "Television",
        "theme": "Drama Cast",
        "explanation": "Connect letters A, C, T, O, R to form: ACTOR, COAT, CAT, OAT, ROT."
      },
      {
        "id": "wc_g7_m_56",
        "availableLetters": [
          "D",
          "R",
          "A",
          "M",
          "A"
        ],
        "targetWords": [
          {
            "word": "DRAMA",
            "turkishMeaning": "Tiyatro, dram"
          },
          {
            "word": "ARM",
            "turkishMeaning": "Kol"
          },
          {
            "word": "RAM",
            "turkishMeaning": "Koç"
          },
          {
            "word": "MAD",
            "turkishMeaning": "Kızgın"
          }
        ],
        "category": "Television",
        "theme": "Theatrical Arts",
        "explanation": "Connect letters D, R, A, M, A to form: DRAMA, ARM, RAM, MAD."
      },
      {
        "id": "wc_g7_m_57",
        "availableLetters": [
          "E",
          "V",
          "E",
          "N",
          "T"
        ],
        "targetWords": [
          {
            "word": "EVENT",
            "turkishMeaning": "Etkinlik"
          },
          {
            "word": "EVEN",
            "turkishMeaning": "Çift / Hatta"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          },
          {
            "word": "TEN",
            "turkishMeaning": "On"
          }
        ],
        "category": "Celebrations",
        "theme": "Milestone Gatherings",
        "explanation": "Connect letters E, V, E, N, T to form: EVENT, EVEN, NET, TEN."
      },
      {
        "id": "wc_g7_m_58",
        "availableLetters": [
          "P",
          "A",
          "R",
          "T",
          "Y"
        ],
        "targetWords": [
          {
            "word": "PARTY",
            "turkishMeaning": "Parti"
          },
          {
            "word": "PART",
            "turkishMeaning": "Bölüm"
          },
          {
            "word": "TRAP",
            "turkishMeaning": "Tuzak"
          },
          {
            "word": "PAY",
            "turkishMeaning": "Ödemek"
          },
          {
            "word": "RAY",
            "turkishMeaning": "Işın"
          }
        ],
        "category": "Celebrations",
        "theme": "Social Festivities",
        "explanation": "Connect letters P, A, R, T, Y to form: PARTY, PART, TRAP, PAY, RAY."
      },
      {
        "id": "wc_g7_m_59",
        "availableLetters": [
          "G",
          "U",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "GUEST",
            "turkishMeaning": "Misafir"
          },
          {
            "word": "GUT",
            "turkishMeaning": "Bağırsak"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          }
        ],
        "category": "Celebrations",
        "theme": "Hospitality",
        "explanation": "Connect letters G, U, E, S, T to form: GUEST, GUT, SET."
      },
      {
        "id": "wc_g7_m_60",
        "availableLetters": [
          "D",
          "R",
          "E",
          "A",
          "M"
        ],
        "targetWords": [
          {
            "word": "DREAM",
            "turkishMeaning": "Rüya, hayal"
          },
          {
            "word": "MADE",
            "turkishMeaning": "Yaptı"
          },
          {
            "word": "DARE",
            "turkishMeaning": "Cesaret etmek"
          },
          {
            "word": "READ",
            "turkishMeaning": "Okumak"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Dreams",
        "theme": "Future Visions",
        "explanation": "Connect letters D, R, E, A, M to form: DREAM, MADE, DARE, READ, RED, EAR."
      },
      {
        "id": "wc_g7_m_61",
        "availableLetters": [
          "P",
          "E",
          "A",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "PEACE",
            "turkishMeaning": "Barış, huzur"
          },
          {
            "word": "CAPE",
            "turkishMeaning": "Pelerin"
          },
          {
            "word": "PACE",
            "turkishMeaning": "Adım, tempo"
          },
          {
            "word": "APE",
            "turkishMeaning": "İribaş maymun"
          },
          {
            "word": "CAP",
            "turkishMeaning": "Şapka"
          }
        ],
        "category": "Dreams",
        "theme": "Harmony",
        "explanation": "Connect letters P, E, A, C, E to form: PEACE, CAPE, PACE, APE, CAP."
      },
      {
        "id": "wc_g7_m_62",
        "availableLetters": [
          "P",
          "L",
          "A",
          "Z",
          "A"
        ],
        "targetWords": [
          {
            "word": "PLAZA",
            "turkishMeaning": "Meydan"
          },
          {
            "word": "LAP",
            "turkishMeaning": "Tur"
          }
        ],
        "category": "Public Buildings",
        "theme": "City Squares",
        "explanation": "Connect letters P, L, A, Z, A to form: PLAZA, LAP."
      },
      {
        "id": "wc_g7_m_63",
        "availableLetters": [
          "H",
          "O",
          "T",
          "E",
          "L"
        ],
        "targetWords": [
          {
            "word": "HOTEL",
            "turkishMeaning": "Otel"
          },
          {
            "word": "HOLE",
            "turkishMeaning": "Delik"
          },
          {
            "word": "LET",
            "turkishMeaning": "İzin vermek"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          },
          {
            "word": "THE",
            "turkishMeaning": "Belirtme"
          }
        ],
        "category": "Public Buildings",
        "theme": "Accommodation",
        "explanation": "Connect letters H, O, T, E, L to form: HOTEL, HOLE, LET, HOT, THE."
      },
      {
        "id": "wc_g7_m_64",
        "availableLetters": [
          "S",
          "T",
          "O",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "STORE",
            "turkishMeaning": "Mağaza"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "SORE",
            "turkishMeaning": "Ağrılı"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          }
        ],
        "category": "Public Buildings",
        "theme": "Commercial Shops",
        "explanation": "Connect letters S, T, O, R, E to form: STORE, ROSE, REST, SORE, SET."
      },
      {
        "id": "wc_g7_m_65",
        "availableLetters": [
          "C",
          "L",
          "E",
          "A",
          "N"
        ],
        "targetWords": [
          {
            "word": "CLEAN",
            "turkishMeaning": "Temiz"
          },
          {
            "word": "LANE",
            "turkishMeaning": "Şerit"
          },
          {
            "word": "LEAN",
            "turkishMeaning": "Dayanmak"
          },
          {
            "word": "CAN",
            "turkishMeaning": "Kutu / Yapabilmek"
          }
        ],
        "category": "Environment",
        "theme": "Purity",
        "explanation": "Connect letters C, L, E, A, N to form: CLEAN, LANE, LEAN, CAN."
      },
      {
        "id": "wc_g7_m_66",
        "availableLetters": [
          "P",
          "L",
          "A",
          "N",
          "T"
        ],
        "targetWords": [
          {
            "word": "PLANT",
            "turkishMeaning": "Bitki"
          },
          {
            "word": "PLAN",
            "turkishMeaning": "Plan"
          },
          {
            "word": "PANT",
            "turkishMeaning": "Solumak"
          },
          {
            "word": "TAP",
            "turkishMeaning": "Musluk"
          },
          {
            "word": "PAN",
            "turkishMeaning": "Tava"
          }
        ],
        "category": "Environment",
        "theme": "Vegetation",
        "explanation": "Connect letters P, L, A, N, T to form: PLANT, PLAN, PANT, TAP, PAN."
      },
      {
        "id": "wc_g7_m_67",
        "availableLetters": [
          "W",
          "A",
          "T",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "WATER",
            "turkishMeaning": "Su"
          },
          {
            "word": "TEAR",
            "turkishMeaning": "Gözyaşı"
          },
          {
            "word": "WEAR",
            "turkishMeaning": "Giymek"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "WET",
            "turkishMeaning": "Islak"
          },
          {
            "word": "RAW",
            "turkishMeaning": "Çiğ"
          }
        ],
        "category": "Environment",
        "theme": "Vital Hydration",
        "explanation": "Connect letters W, A, T, E, R to form: WATER, TEAR, WEAR, RATE, WET, RAW."
      },
      {
        "id": "wc_g7_m_68",
        "availableLetters": [
          "S",
          "O",
          "L",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "SOLAR",
            "turkishMeaning": "Güneş ile ilgili"
          },
          {
            "word": "ORAL",
            "turkishMeaning": "Sözlü"
          },
          {
            "word": "OAR",
            "turkishMeaning": "Kürek"
          }
        ],
        "category": "Environment",
        "theme": "Sun Energy",
        "explanation": "Connect letters S, O, L, A, R to form: SOLAR, ORAL, OAR."
      },
      {
        "id": "wc_g7_m_69",
        "availableLetters": [
          "O",
          "R",
          "B",
          "I",
          "T"
        ],
        "targetWords": [
          {
            "word": "ORBIT",
            "turkishMeaning": "Yörünge"
          },
          {
            "word": "RIOT",
            "turkishMeaning": "İsyan"
          },
          {
            "word": "BIT",
            "turkishMeaning": "Parça"
          },
          {
            "word": "RIB",
            "turkishMeaning": "Kaburga"
          }
        ],
        "category": "Planets",
        "theme": "Celestial Physics",
        "explanation": "Connect letters O, R, B, I, T to form: ORBIT, RIOT, BIT, RIB."
      },
      {
        "id": "wc_g7_m_70",
        "availableLetters": [
          "E",
          "A",
          "R",
          "T",
          "H"
        ],
        "targetWords": [
          {
            "word": "EARTH",
            "turkishMeaning": "Dünya"
          },
          {
            "word": "HEART",
            "turkishMeaning": "Kalp"
          },
          {
            "word": "HEAT",
            "turkishMeaning": "Isı"
          },
          {
            "word": "HATE",
            "turkishMeaning": "Nefret"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          }
        ],
        "category": "Planets",
        "theme": "Living Terrestrial",
        "explanation": "Connect letters E, A, R, T, H to form: EARTH, HEART, HEAT, HATE, HEAR, ART."
      },
      {
        "id": "wc_g7_m_71",
        "availableLetters": [
          "S",
          "P",
          "A",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "SPACE",
            "turkishMeaning": "Uzay"
          },
          {
            "word": "CAPE",
            "turkishMeaning": "Pelerin"
          },
          {
            "word": "PACE",
            "turkishMeaning": "Tempo"
          },
          {
            "word": "APE",
            "turkishMeaning": "Maymun"
          },
          {
            "word": "CAP",
            "turkishMeaning": "Kep"
          }
        ],
        "category": "Planets",
        "theme": "Cosmic Frontier",
        "explanation": "Connect letters S, P, A, C, E to form: SPACE, CAPE, PACE, APE, CAP."
      },
      {
        "id": "wc_g7_m_72",
        "availableLetters": [
          "P",
          "R",
          "O",
          "B",
          "E"
        ],
        "targetWords": [
          {
            "word": "PROBE",
            "turkishMeaning": "Sonda"
          },
          {
            "word": "ROPE",
            "turkishMeaning": "Halat"
          },
          {
            "word": "ROB",
            "turkishMeaning": "Soymak"
          },
          {
            "word": "ORE",
            "turkishMeaning": "Cevher"
          }
        ],
        "category": "Planets",
        "theme": "Space Explorers",
        "explanation": "Connect letters P, R, O, B, E to form: PROBE, ROPE, ROB, ORE."
      },
      {
        "id": "wc_g7_m_73",
        "availableLetters": [
          "C",
          "L",
          "I",
          "C",
          "K"
        ],
        "targetWords": [
          {
            "word": "CLICK",
            "turkishMeaning": "Tıklamak"
          }
        ],
        "category": "Life Online",
        "theme": "Digital Navigation",
        "explanation": "Connect letters C, L, I, C, K to form: CLICK."
      },
      {
        "id": "wc_g7_m_74",
        "availableLetters": [
          "S",
          "H",
          "A",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "SHARE",
            "turkishMeaning": "Paylaşmak"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "İşitmek"
          },
          {
            "word": "HARE",
            "turkishMeaning": "Yaban tavşanı"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          }
        ],
        "category": "Life Online",
        "theme": "Social Exchange",
        "explanation": "Connect letters S, H, A, R, E to form: SHARE, HEAR, HARE, EAR, ASH."
      },
      {
        "id": "wc_g7_m_75",
        "availableLetters": [
          "F",
          "I",
          "R",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "FIRST",
            "turkishMeaning": "İlk, birinci"
          },
          {
            "word": "FIST",
            "turkishMeaning": "Yumruk"
          },
          {
            "word": "STIR",
            "turkishMeaning": "Karıştırmak"
          },
          {
            "word": "FIT",
            "turkishMeaning": "Uygun"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Primary Action",
        "explanation": "Connect letters F, I, R, S, T to form: FIRST, FIST, STIR, FIT, SIT."
      },
      {
        "id": "wc_g7_m_76",
        "availableLetters": [
          "A",
          "L",
          "E",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "ALERT",
            "turkishMeaning": "Uyarı, tetikte"
          },
          {
            "word": "LATER",
            "turkishMeaning": "Sonra"
          },
          {
            "word": "ALTER",
            "turkishMeaning": "Değiştirmek"
          },
          {
            "word": "TALE",
            "turkishMeaning": "Masal"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Emergency Warnings",
        "explanation": "Connect letters A, L, E, R, T to form: ALERT, LATER, ALTER, TALE, RATE, LATE."
      },
      {
        "id": "wc_g7_m_77",
        "availableLetters": [
          "S",
          "T",
          "O",
          "R",
          "M"
        ],
        "targetWords": [
          {
            "word": "STORM",
            "turkishMeaning": "Fırtına"
          },
          {
            "word": "MOST",
            "turkishMeaning": "En çok"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Ayıklamak"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Severe Weather",
        "explanation": "Connect letters S, T, O, R, M to form: STORM, MOST, SORT."
      },
      {
        "id": "wc_g7_m_78",
        "availableLetters": [
          "G",
          "U",
          "A",
          "R",
          "D"
        ],
        "targetWords": [
          {
            "word": "GUARD",
            "turkishMeaning": "Korumak"
          },
          {
            "word": "RUG",
            "turkishMeaning": "Kilim"
          },
          {
            "word": "RAG",
            "turkishMeaning": "Bez"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Protection",
        "explanation": "Connect letters G, U, A, R, D to form: GUARD, RUG, RAG."
      },
      {
        "id": "wc_g7_m_79",
        "availableLetters": [
          "H",
          "A",
          "T",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "HATCH",
            "turkishMeaning": "Yumurtadan çıkmak"
          },
          {
            "word": "CHAT",
            "turkishMeaning": "Sohbet"
          },
          {
            "word": "ACT",
            "turkishMeaning": "Eylem"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          },
          {
            "word": "HAT",
            "turkishMeaning": "Şapka"
          }
        ],
        "category": "Wild Animals",
        "theme": "Avian Life",
        "explanation": "Connect letters H, A, T, C, H to form: HATCH, CHAT, ACT, CAT, HAT."
      },
      {
        "id": "wc_g7_m_80",
        "availableLetters": [
          "P",
          "O",
          "I",
          "N",
          "T"
        ],
        "targetWords": [
          {
            "word": "POINT",
            "turkishMeaning": "Nokta / Puan"
          },
          {
            "word": "PIN",
            "turkishMeaning": "İğne"
          },
          {
            "word": "TIN",
            "turkishMeaning": "Teneke"
          },
          {
            "word": "PIT",
            "turkishMeaning": "Çukur"
          },
          {
            "word": "POT",
            "turkishMeaning": "Tencere"
          }
        ],
        "category": "Sports",
        "theme": "Scoring Systems",
        "explanation": "Connect letters P, O, I, N, T to form: POINT, PIN, TIN, PIT, POT."
      }
    ],
    "hard": [
      {
        "id": "wc_g7_h_01",
        "availableLetters": [
          "H",
          "O",
          "N",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "HONEST",
            "turkishMeaning": "Dürüst"
          },
          {
            "word": "STONE",
            "turkishMeaning": "Taş"
          },
          {
            "word": "NOSE",
            "turkishMeaning": "Burun"
          },
          {
            "word": "SHOT",
            "turkishMeaning": "Atış"
          },
          {
            "word": "TONE",
            "turkishMeaning": "Ton"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          }
        ],
        "category": "Personality",
        "theme": "Truth",
        "explanation": "Connect letters H, O, N, E, S, T to form: HONEST, STONE, NOSE, SHOT, TONE, HOT."
      },
      {
        "id": "wc_g7_h_02",
        "availableLetters": [
          "P",
          "O",
          "L",
          "I",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "POLITE",
            "turkishMeaning": "Kibar"
          },
          {
            "word": "PILOT",
            "turkishMeaning": "Pilot"
          },
          {
            "word": "PLOT",
            "turkishMeaning": "Konu"
          },
          {
            "word": "POLE",
            "turkishMeaning": "Kutup"
          },
          {
            "word": "TILE",
            "turkishMeaning": "Fayans"
          },
          {
            "word": "TOP",
            "turkishMeaning": "Üst"
          }
        ],
        "category": "Personality",
        "theme": "Courtesy",
        "explanation": "Connect letters P, O, L, I, T, E to form: POLITE, PILOT, PLOT, POLE, TILE, TOP."
      },
      {
        "id": "wc_g7_h_03",
        "availableLetters": [
          "F",
          "A",
          "M",
          "O",
          "U",
          "S"
        ],
        "targetWords": [
          {
            "word": "FAMOUS",
            "turkishMeaning": "Ünlü"
          },
          {
            "word": "FOAM",
            "turkishMeaning": "Köpük"
          },
          {
            "word": "SUM",
            "turkishMeaning": "Toplam"
          },
          {
            "word": "SOFA",
            "turkishMeaning": "Kanepe"
          },
          {
            "word": "OAF",
            "turkishMeaning": "Aptal"
          }
        ],
        "category": "Biographies",
        "theme": "Worldwide Renown",
        "explanation": "Connect letters F, A, M, O, U, S to form: FAMOUS, FOAM, SUM, SOFA, OAF."
      },
      {
        "id": "wc_g7_h_04",
        "availableLetters": [
          "C",
          "A",
          "R",
          "E",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "CAREER",
            "turkishMeaning": "Kariyer"
          },
          {
            "word": "CAREERS",
            "turkishMeaning": "Kariyerler"
          },
          {
            "word": "RACE",
            "turkishMeaning": "Yarış"
          },
          {
            "word": "CARE",
            "turkishMeaning": "Özen"
          },
          {
            "word": "REAR",
            "turkishMeaning": "Arka"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Biographies",
        "theme": "Vocation",
        "explanation": "Connect letters C, A, R, E, E, R, S to form: CAREER, CAREERS, RACE, CARE, REAR, EAR."
      },
      {
        "id": "wc_g7_h_05",
        "availableLetters": [
          "T",
          "E",
          "N",
          "N",
          "I",
          "S"
        ],
        "targetWords": [
          {
            "word": "TENNIS",
            "turkishMeaning": "Tenis"
          },
          {
            "word": "NINE",
            "turkishMeaning": "Dokuz"
          },
          {
            "word": "NEST",
            "turkishMeaning": "Yuva"
          },
          {
            "word": "SENT",
            "turkishMeaning": "Gönderdi"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağlamak"
          },
          {
            "word": "NET",
            "turkishMeaning": "File"
          }
        ],
        "category": "Sports",
        "theme": "Wimbledon",
        "explanation": "Connect letters T, E, N, N, I, S to form: TENNIS, NINE, NEST, SENT, TIE, NET."
      },
      {
        "id": "wc_g7_h_06",
        "availableLetters": [
          "R",
          "U",
          "N",
          "N",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "RUNNER",
            "turkishMeaning": "Koşucu"
          },
          {
            "word": "RUNNERS",
            "turkishMeaning": "Koşucular"
          },
          {
            "word": "NURSE",
            "turkishMeaning": "Hemşire"
          },
          {
            "word": "RERUN",
            "turkishMeaning": "Tekrar"
          },
          {
            "word": "RUN",
            "turkishMeaning": "Koşmak"
          },
          {
            "word": "URN",
            "turkishMeaning": "Vazo"
          }
        ],
        "category": "Sports",
        "theme": "Athletics",
        "explanation": "Connect letters R, U, N, N, E, R, S to form: RUNNER, RUNNERS, NURSE, RERUN, RUN, URN."
      },
      {
        "id": "wc_g7_h_07",
        "availableLetters": [
          "T",
          "R",
          "O",
          "P",
          "H",
          "Y",
          "S"
        ],
        "targetWords": [
          {
            "word": "TROPHY",
            "turkishMeaning": "Kupa"
          },
          {
            "word": "SPORT",
            "turkishMeaning": "Spor"
          },
          {
            "word": "SHORT",
            "turkishMeaning": "Kısa"
          },
          {
            "word": "PORT",
            "turkishMeaning": "Liman"
          },
          {
            "word": "TOY",
            "turkishMeaning": "Oyuncak"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          }
        ],
        "category": "Sports",
        "theme": "Champion",
        "explanation": "Connect letters T, R, O, P, H, Y, S to form: TROPHY, SPORT, SHORT, PORT, TOY, HOT."
      },
      {
        "id": "wc_g7_h_08",
        "availableLetters": [
          "M",
          "O",
          "N",
          "K",
          "E",
          "Y",
          "S"
        ],
        "targetWords": [
          {
            "word": "MONKEY",
            "turkishMeaning": "Maymun"
          },
          {
            "word": "MONEY",
            "turkishMeaning": "Para"
          },
          {
            "word": "SMOKE",
            "turkishMeaning": "Duman"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "KEY",
            "turkishMeaning": "Anahtar"
          },
          {
            "word": "MEN",
            "turkishMeaning": "Erkekler"
          }
        ],
        "category": "Wild Animals",
        "theme": "Simian",
        "explanation": "Connect letters M, O, N, K, E, Y, S to form: MONKEY, MONEY, SMOKE, ONE, KEY, MEN."
      },
      {
        "id": "wc_g7_h_09",
        "availableLetters": [
          "R",
          "A",
          "B",
          "B",
          "I",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "RABBITS",
            "turkishMeaning": "Tavşanlar"
          },
          {
            "word": "RABBIT",
            "turkishMeaning": "Tavşan"
          },
          {
            "word": "BAIT",
            "turkishMeaning": "Yem"
          },
          {
            "word": "BATS",
            "turkishMeaning": "Yarasalar"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          }
        ],
        "category": "Wild Animals",
        "theme": "Forest Rabbits",
        "explanation": "Connect letters R, A, B, B, I, T, S to form: RABBITS, RABBIT, BAIT, BATS, STAR.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_h_10",
        "availableLetters": [
          "F",
          "O",
          "R",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "FOREST",
            "turkishMeaning": "Orman"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "SOFT",
            "turkishMeaning": "Yumuşak"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Tür, çeşit"
          }
        ],
        "category": "Wild Animals",
        "theme": "Forest Wildlife",
        "explanation": "Connect letters F, O, R, E, S, T to form: FOREST, REST, SOFT, ROSE, SORT.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_h_11",
        "availableLetters": [
          "D",
          "E",
          "S",
          "E",
          "R",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "DESERT",
            "turkishMeaning": "Çöl"
          },
          {
            "word": "RESET",
            "turkishMeaning": "Sıfırlamak"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "DEER",
            "turkishMeaning": "Geyik"
          },
          {
            "word": "TREE",
            "turkishMeaning": "Ağaç"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Wild Animals",
        "theme": "Sahara",
        "explanation": "Connect letters D, E, S, E, R, T, S to form: DESERT, RESET, REST, DEER, TREE, RED."
      },
      {
        "id": "wc_g7_h_12",
        "availableLetters": [
          "I",
          "N",
          "S",
          "E",
          "C",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "INSECT",
            "turkishMeaning": "Böcek"
          },
          {
            "word": "INSECTS",
            "turkishMeaning": "Böcekler"
          },
          {
            "word": "SCENT",
            "turkishMeaning": "Koku"
          },
          {
            "word": "NICE",
            "turkishMeaning": "Güzel"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağlamak"
          },
          {
            "word": "NET",
            "turkishMeaning": "File"
          }
        ],
        "category": "Wild Animals",
        "theme": "Entomology",
        "explanation": "Connect letters I, N, S, E, C, T, S to form: INSECT, INSECTS, SCENT, NICE, TIE, NET."
      },
      {
        "id": "wc_g7_h_13",
        "availableLetters": [
          "M",
          "U",
          "S",
          "E",
          "U",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "MUSEUM",
            "turkishMeaning": "Müze"
          },
          {
            "word": "MUSE",
            "turkishMeaning": "İlham"
          },
          {
            "word": "SUMS",
            "turkishMeaning": "Toplamlar"
          },
          {
            "word": "MUM",
            "turkishMeaning": "Anne"
          },
          {
            "word": "USE",
            "turkishMeaning": "Kullanmak"
          },
          {
            "word": "SUE",
            "turkishMeaning": "Dava"
          }
        ],
        "category": "Public Buildings",
        "theme": "Gallery",
        "explanation": "Connect letters M, U, S, E, U, M, S to form: MUSEUM, MUSE, SUMS, MUM, USE, SUE."
      },
      {
        "id": "wc_g7_h_14",
        "availableLetters": [
          "I",
          "N",
          "V",
          "I",
          "T",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "INVITE",
            "turkishMeaning": "Davet"
          },
          {
            "word": "INVITES",
            "turkishMeaning": "Davetler"
          },
          {
            "word": "VEIN",
            "turkishMeaning": "Damar"
          },
          {
            "word": "VINE",
            "turkishMeaning": "Asma"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağlamak"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Celebrations",
        "theme": "RSVP",
        "explanation": "Connect letters I, N, V, I, T, E, S to form: INVITE, INVITES, VEIN, VINE, TIE, NET."
      },
      {
        "id": "wc_g7_h_15",
        "availableLetters": [
          "R",
          "I",
          "B",
          "B",
          "O",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "RIBBON",
            "turkishMeaning": "Kurdele"
          },
          {
            "word": "BORN",
            "turkishMeaning": "Doğmuş"
          },
          {
            "word": "IRON",
            "turkishMeaning": "Demir"
          },
          {
            "word": "ROB",
            "turkishMeaning": "Soymak"
          },
          {
            "word": "BIN",
            "turkishMeaning": "Kutu"
          },
          {
            "word": "SON",
            "turkishMeaning": "Oğul"
          }
        ],
        "category": "Celebrations",
        "theme": "Bows",
        "explanation": "Connect letters R, I, B, B, O, N, S to form: RIBBON, BORN, IRON, ROB, BIN, SON."
      },
      {
        "id": "wc_g7_h_16",
        "availableLetters": [
          "F",
          "U",
          "T",
          "U",
          "R",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "FUTURE",
            "turkishMeaning": "Gelecek"
          },
          {
            "word": "TRUE",
            "turkishMeaning": "Doğru"
          },
          {
            "word": "RUE",
            "turkishMeaning": "Pişmanlık"
          },
          {
            "word": "FUR",
            "turkishMeaning": "Kürk"
          },
          {
            "word": "RUT",
            "turkishMeaning": "İz"
          },
          {
            "word": "USE",
            "turkishMeaning": "Kullanmak"
          }
        ],
        "category": "Dreams",
        "theme": "Destiny",
        "explanation": "Connect letters F, U, T, U, R, E, S to form: FUTURE, TRUE, RUE, FUR, RUT, USE."
      },
      {
        "id": "wc_g7_h_17",
        "availableLetters": [
          "T",
          "R",
          "A",
          "V",
          "E",
          "L",
          "S"
        ],
        "targetWords": [
          {
            "word": "TRAVEL",
            "turkishMeaning": "Seyahat"
          },
          {
            "word": "TRAVELS",
            "turkishMeaning": "Seyahatler"
          },
          {
            "word": "ALERT",
            "turkishMeaning": "Uyanık"
          },
          {
            "word": "ALTER",
            "turkishMeaning": "Değiştirmek"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          }
        ],
        "category": "Dreams",
        "theme": "Journey",
        "explanation": "Connect letters T, R, A, V, E, L, S to form: TRAVEL, TRAVELS, ALERT, ALTER, LATE, STAR."
      },
      {
        "id": "wc_g7_h_18",
        "availableLetters": [
          "P",
          "L",
          "A",
          "N",
          "E",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "PLANET",
            "turkishMeaning": "Gezegen"
          },
          {
            "word": "PLANETS",
            "turkishMeaning": "Gezegenler"
          },
          {
            "word": "PLANT",
            "turkishMeaning": "Bitki"
          },
          {
            "word": "PLANE",
            "turkishMeaning": "Uçak"
          },
          {
            "word": "LEAP",
            "turkishMeaning": "Sıçramak"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Planets",
        "theme": "Astrology",
        "explanation": "Connect letters P, L, A, N, E, T, S to form: PLANET, PLANETS, PLANT, PLANE, LEAP, NET."
      },
      {
        "id": "wc_g7_h_19",
        "availableLetters": [
          "C",
          "R",
          "A",
          "T",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "CRATER",
            "turkishMeaning": "Krater"
          },
          {
            "word": "CRATERS",
            "turkishMeaning": "Kraterler"
          },
          {
            "word": "TRACE",
            "turkishMeaning": "İz"
          },
          {
            "word": "CARE",
            "turkishMeaning": "Özen"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          }
        ],
        "category": "Planets",
        "theme": "Meteorite",
        "explanation": "Connect letters C, R, A, T, E, R, S to form: CRATER, CRATERS, TRACE, CARE, RATE, CAT."
      },
      {
        "id": "wc_g7_h_20",
        "availableLetters": [
          "G",
          "A",
          "L",
          "A",
          "X",
          "Y",
          "S"
        ],
        "targetWords": [
          {
            "word": "GALAXY",
            "turkishMeaning": "Galaksi"
          },
          {
            "word": "SLAG",
            "turkishMeaning": "Cüruf"
          },
          {
            "word": "LAY",
            "turkishMeaning": "Koymak"
          },
          {
            "word": "GAS",
            "turkishMeaning": "Gaz"
          },
          {
            "word": "SAY",
            "turkishMeaning": "Söylemek"
          }
        ],
        "category": "Planets",
        "theme": "Nebula",
        "explanation": "Connect letters G, A, L, A, X, Y, S to form: GALAXY, SLAG, LAY, GAS, SAY."
      },
      {
        "id": "wc_g7_h_21",
        "availableLetters": [
          "S",
          "Y",
          "S",
          "T",
          "E",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "SYSTEM",
            "turkishMeaning": "Sistem"
          },
          {
            "word": "SYSTEMS",
            "turkishMeaning": "Sistemler"
          },
          {
            "word": "STEM",
            "turkishMeaning": "Gövde"
          },
          {
            "word": "MESS",
            "turkishMeaning": "Dağınıklık"
          },
          {
            "word": "YES",
            "turkishMeaning": "Evet"
          },
          {
            "word": "SET",
            "turkishMeaning": "Küme"
          }
        ],
        "category": "Planets",
        "theme": "Cosmic System",
        "explanation": "Connect letters S, Y, S, T, E, M, S to form: SYSTEM, SYSTEMS, STEM, MESS, YES, SET."
      },
      {
        "id": "wc_g7_h_22",
        "availableLetters": [
          "N",
          "A",
          "T",
          "U",
          "R",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "NATURE",
            "turkishMeaning": "Doğa"
          },
          {
            "word": "TUNE",
            "turkishMeaning": "Melodi"
          },
          {
            "word": "NEAR",
            "turkishMeaning": "Yakın"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "RUN",
            "turkishMeaning": "Koşmak"
          },
          {
            "word": "NUT",
            "turkishMeaning": "Fındık"
          }
        ],
        "category": "Environment",
        "theme": "Biomes",
        "explanation": "Connect letters N, A, T, U, R, E, S to form: NATURE, TUNE, NEAR, RATE, RUN, NUT."
      },
      {
        "id": "wc_g7_h_23",
        "availableLetters": [
          "A",
          "N",
          "I",
          "M",
          "A",
          "L",
          "S"
        ],
        "targetWords": [
          {
            "word": "ANIMAL",
            "turkishMeaning": "Hayvan"
          },
          {
            "word": "ANIMALS",
            "turkishMeaning": "Hayvanlar"
          },
          {
            "word": "MAIN",
            "turkishMeaning": "Ana"
          },
          {
            "word": "MAIL",
            "turkishMeaning": "Posta"
          },
          {
            "word": "MAN",
            "turkishMeaning": "Adam"
          },
          {
            "word": "AIM",
            "turkishMeaning": "Hedef"
          }
        ],
        "category": "Wild Animals",
        "theme": "Creatures",
        "explanation": "Connect letters A, N, I, M, A, L, S to form: ANIMAL, ANIMALS, MAIN, MAIL, MAN, AIM."
      },
      {
        "id": "wc_g7_h_24",
        "availableLetters": [
          "D",
          "A",
          "M",
          "A",
          "G",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "DAMAGES",
            "turkishMeaning": "Zararlar"
          },
          {
            "word": "DAMAGE",
            "turkishMeaning": "Zarar, hasar"
          },
          {
            "word": "GAMES",
            "turkishMeaning": "Oyunlar"
          },
          {
            "word": "GAME",
            "turkishMeaning": "Oyun"
          },
          {
            "word": "MADE",
            "turkishMeaning": "Yapılmış"
          },
          {
            "word": "AGED",
            "turkishMeaning": "Yaşlı"
          }
        ],
        "category": "Environment",
        "theme": "Nature Protection",
        "explanation": "Connect letters D, A, M, A, G, E, S to form: DAMAGES, DAMAGE, GAMES, GAME, MADE, AGED.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_h_25",
        "availableLetters": [
          "D",
          "A",
          "M",
          "A",
          "G",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "DAMAGES",
            "turkishMeaning": "Zararlar"
          },
          {
            "word": "DAMAGE",
            "turkishMeaning": "Zarar, hasar"
          },
          {
            "word": "GAMES",
            "turkishMeaning": "Oyunlar"
          },
          {
            "word": "GAME",
            "turkishMeaning": "Oyun"
          },
          {
            "word": "MADE",
            "turkishMeaning": "Yapılmış"
          },
          {
            "word": "AGED",
            "turkishMeaning": "Yaşlı"
          }
        ],
        "category": "Environment",
        "theme": "Environmental Damage",
        "explanation": "Connect letters D, A, M, A, G, E, S to form: DAMAGES, DAMAGE, GAMES, GAME, MADE, AGED.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_h_26",
        "availableLetters": [
          "R",
          "E",
          "S",
          "C",
          "U",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "RESCUE",
            "turkishMeaning": "Kurtarmak"
          },
          {
            "word": "RESCUES",
            "turkishMeaning": "Kurtarmalar"
          },
          {
            "word": "CURSE",
            "turkishMeaning": "Lanet"
          },
          {
            "word": "CURE",
            "turkishMeaning": "Tedavi"
          },
          {
            "word": "USER",
            "turkishMeaning": "Kullanıcı"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Environment",
        "theme": "Lifeline",
        "explanation": "Connect letters R, E, S, C, U, E, S to form: RESCUE, RESCUES, CURSE, CURE, USER, SEE."
      },
      {
        "id": "wc_g7_h_27",
        "availableLetters": [
          "E",
          "N",
          "E",
          "R",
          "G",
          "Y",
          "S"
        ],
        "targetWords": [
          {
            "word": "ENERGY",
            "turkishMeaning": "Enerji"
          },
          {
            "word": "GENRE",
            "turkishMeaning": "Tür"
          },
          {
            "word": "GREY",
            "turkishMeaning": "Gri"
          },
          {
            "word": "GREEN",
            "turkishMeaning": "Yeşil"
          },
          {
            "word": "EYE",
            "turkishMeaning": "Göz"
          },
          {
            "word": "YES",
            "turkishMeaning": "Evet"
          }
        ],
        "category": "Environment",
        "theme": "Clean Power",
        "explanation": "Connect letters E, N, E, R, G, Y, S to form: ENERGY, GENRE, GREY, GREEN, EYE, YES."
      },
      {
        "id": "wc_g7_h_28",
        "availableLetters": [
          "O",
          "X",
          "Y",
          "G",
          "E",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "OXYGEN",
            "turkishMeaning": "Oksijen"
          },
          {
            "word": "GONE",
            "turkishMeaning": "Gitmiş"
          },
          {
            "word": "NOSE",
            "turkishMeaning": "Burun"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "YES",
            "turkishMeaning": "Evet"
          },
          {
            "word": "EGO",
            "turkishMeaning": "Ego"
          }
        ],
        "category": "Environment",
        "theme": "Respiration",
        "explanation": "Connect letters O, X, Y, G, E, N, S to form: OXYGEN, GONE, NOSE, ONE, YES, EGO."
      },
      {
        "id": "wc_g7_h_29",
        "availableLetters": [
          "W",
          "O",
          "N",
          "D",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "WONDER",
            "turkishMeaning": "Harika"
          },
          {
            "word": "WONDERS",
            "turkishMeaning": "Harikalar"
          },
          {
            "word": "OWNER",
            "turkishMeaning": "Sahip"
          },
          {
            "word": "DOWN",
            "turkishMeaning": "Aşağı"
          },
          {
            "word": "WORD",
            "turkishMeaning": "Kelime"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Environment",
        "theme": "Miracles",
        "explanation": "Connect letters W, O, N, D, E, R, S to form: WONDER, WONDERS, OWNER, DOWN, WORD, RED."
      },
      {
        "id": "wc_g7_h_30",
        "availableLetters": [
          "D",
          "O",
          "C",
          "T",
          "O",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "DOCTOR",
            "turkishMeaning": "Doktor"
          },
          {
            "word": "DOCTORS",
            "turkishMeaning": "Doktorlar"
          },
          {
            "word": "ROOT",
            "turkishMeaning": "Kök"
          },
          {
            "word": "DOOR",
            "turkishMeaning": "Kapı"
          },
          {
            "word": "ODOR",
            "turkishMeaning": "Koku"
          },
          {
            "word": "DOT",
            "turkishMeaning": "Nokta"
          }
        ],
        "category": "Biographies",
        "theme": "Physicians",
        "explanation": "Connect letters D, O, C, T, O, R, S to form: DOCTOR, DOCTORS, ROOT, DOOR, ODOR, DOT."
      },
      {
        "id": "wc_g7_h_31",
        "availableLetters": [
          "H",
          "E",
          "A",
          "L",
          "T",
          "H",
          "Y"
        ],
        "targetWords": [
          {
            "word": "HEALTHY",
            "turkishMeaning": "Sağlıklı"
          },
          {
            "word": "HEALTH",
            "turkishMeaning": "Sağlık"
          },
          {
            "word": "HEAL",
            "turkishMeaning": "İyileşmek"
          },
          {
            "word": "HEAT",
            "turkishMeaning": "Isı, sıcaklık"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "THEY",
            "turkishMeaning": "Onlar"
          }
        ],
        "category": "Sports & Health",
        "theme": "Healthy Living",
        "explanation": "Connect letters H, E, A, L, T, H, Y to form: HEALTHY, HEALTH, HEAL, HEAT, LATE, THEY.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_h_32",
        "availableLetters": [
          "S",
          "H",
          "A",
          "D",
          "O",
          "W",
          "S"
        ],
        "targetWords": [
          {
            "word": "SHADOW",
            "turkishMeaning": "Gölge"
          },
          {
            "word": "SHADOWS",
            "turkishMeaning": "Gölgeler"
          },
          {
            "word": "SHOW",
            "turkishMeaning": "Gösteri"
          },
          {
            "word": "WASH",
            "turkishMeaning": "Yıkamak"
          },
          {
            "word": "DASH",
            "turkishMeaning": "Fırlamak"
          },
          {
            "word": "HOW",
            "turkishMeaning": "Nasıl"
          }
        ],
        "category": "Planets",
        "theme": "Shadows",
        "explanation": "Connect letters S, H, A, D, O, W, S to form: SHADOW, SHADOWS, SHOW, WASH, DASH, HOW."
      },
      {
        "id": "wc_g7_h_33",
        "availableLetters": [
          "B",
          "E",
          "A",
          "C",
          "H",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "BEACHES",
            "turkishMeaning": "Kumsallar"
          },
          {
            "word": "BEACH",
            "turkishMeaning": "Kumsal, plaj"
          },
          {
            "word": "EACH",
            "turkishMeaning": "Her biri"
          },
          {
            "word": "CHASE",
            "turkishMeaning": "Kovalamak"
          },
          {
            "word": "BASE",
            "turkishMeaning": "Taban, üs"
          }
        ],
        "category": "Celebrations & Weather",
        "theme": "Summer Seaside",
        "explanation": "Connect letters B, E, A, C, H, E, S to form: BEACHES, BEACH, EACH, CHASE, BASE.",
        "contentVersion": 2
      },
      {
        "id": "wc_g7_h_34",
        "availableLetters": [
          "W",
          "I",
          "N",
          "T",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "WINTER",
            "turkishMeaning": "Kış"
          },
          {
            "word": "WINTERS",
            "turkishMeaning": "Kışlar"
          },
          {
            "word": "WRITE",
            "turkishMeaning": "Yazmak"
          },
          {
            "word": "TWIN",
            "turkishMeaning": "İkiz"
          },
          {
            "word": "WIRE",
            "turkishMeaning": "Tel"
          },
          {
            "word": "WIN",
            "turkishMeaning": "Kazanmak"
          }
        ],
        "category": "Environment",
        "theme": "Ice Season",
        "explanation": "Connect letters W, I, N, T, E, R, S to form: WINTER, WINTERS, WRITE, TWIN, WIRE, WIN."
      },
      {
        "id": "wc_g7_h_35",
        "availableLetters": [
          "S",
          "P",
          "R",
          "I",
          "N",
          "G",
          "S"
        ],
        "targetWords": [
          {
            "word": "SPRING",
            "turkishMeaning": "Bahar"
          },
          {
            "word": "SPRINGS",
            "turkishMeaning": "Pınarlar"
          },
          {
            "word": "RINGS",
            "turkishMeaning": "Yüzükler"
          },
          {
            "word": "GRIP",
            "turkishMeaning": "Kavrama"
          },
          {
            "word": "SIGN",
            "turkishMeaning": "İşaret"
          },
          {
            "word": "PIG",
            "turkishMeaning": "Domuz"
          }
        ],
        "category": "Environment",
        "theme": "Bloom",
        "explanation": "Connect letters S, P, R, I, N, G, S to form: SPRING, SPRINGS, RINGS, GRIP, SIGN, PIG."
      },
      {
        "id": "wc_g7_h_36",
        "availableLetters": [
          "A",
          "U",
          "T",
          "U",
          "M",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "AUTUMN",
            "turkishMeaning": "Sonbahar"
          },
          {
            "word": "TUNA",
            "turkishMeaning": "Ton balığı"
          },
          {
            "word": "AUNT",
            "turkishMeaning": "Teyze"
          },
          {
            "word": "NUT",
            "turkishMeaning": "Fındık"
          },
          {
            "word": "MAT",
            "turkishMeaning": "Paspas"
          },
          {
            "word": "SUN",
            "turkishMeaning": "Güneş"
          }
        ],
        "category": "Environment",
        "theme": "Harvest",
        "explanation": "Connect letters A, U, T, U, M, N, S to form: AUTUMN, TUNA, AUNT, NUT, MAT, SUN."
      },
      {
        "id": "wc_g7_h_37",
        "availableLetters": [
          "C",
          "A",
          "S",
          "T",
          "L",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "CASTLE",
            "turkishMeaning": "Kale"
          },
          {
            "word": "CASTLES",
            "turkishMeaning": "Kaleler"
          },
          {
            "word": "SCALE",
            "turkishMeaning": "Ölçek"
          },
          {
            "word": "STALE",
            "turkishMeaning": "Bayat"
          },
          {
            "word": "SALE",
            "turkishMeaning": "Satış"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          }
        ],
        "category": "Public Buildings",
        "theme": "Bastion",
        "explanation": "Connect letters C, A, S, T, L, E, S to form: CASTLE, CASTLES, SCALE, STALE, SALE, CAT."
      },
      {
        "id": "wc_g7_h_38",
        "availableLetters": [
          "P",
          "A",
          "L",
          "A",
          "C",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "PALACE",
            "turkishMeaning": "Saray"
          },
          {
            "word": "PALACES",
            "turkishMeaning": "Saraylar"
          },
          {
            "word": "PLACE",
            "turkishMeaning": "Yer"
          },
          {
            "word": "PACE",
            "turkishMeaning": "Adım"
          },
          {
            "word": "PLEA",
            "turkishMeaning": "Rica"
          },
          {
            "word": "CAPE",
            "turkishMeaning": "Pelerin"
          }
        ],
        "category": "Public Buildings",
        "theme": "Royalty",
        "explanation": "Connect letters P, A, L, A, C, E, S to form: PALACE, PALACES, PLACE, PACE, PLEA, CAPE."
      },
      {
        "id": "wc_g7_h_39",
        "availableLetters": [
          "S",
          "C",
          "H",
          "O",
          "O",
          "L",
          "S"
        ],
        "targetWords": [
          {
            "word": "SCHOOL",
            "turkishMeaning": "Okul"
          },
          {
            "word": "SCHOOLS",
            "turkishMeaning": "Okullar"
          },
          {
            "word": "COOL",
            "turkishMeaning": "Havalı"
          },
          {
            "word": "SOLO",
            "turkishMeaning": "Solo"
          },
          {
            "word": "LOO",
            "turkishMeaning": "Tuvalet"
          },
          {
            "word": "COO",
            "turkishMeaning": "Guguk"
          }
        ],
        "category": "Public Buildings",
        "theme": "Academy",
        "explanation": "Connect letters S, C, H, O, O, L, S to form: SCHOOL, SCHOOLS, COOL, SOLO, LOO, COO."
      },
      {
        "id": "wc_g7_h_40",
        "availableLetters": [
          "G",
          "A",
          "R",
          "D",
          "E",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "GARDEN",
            "turkishMeaning": "Bahçe"
          },
          {
            "word": "GARDENS",
            "turkishMeaning": "Bahçeler"
          },
          {
            "word": "DANGER",
            "turkishMeaning": "Tehlike"
          },
          {
            "word": "READ",
            "turkishMeaning": "Okumak"
          },
          {
            "word": "DEAR",
            "turkishMeaning": "Sevgili"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Environment",
        "theme": "Botanics",
        "explanation": "Connect letters G, A, R, D, E, N, S to form: GARDEN, GARDENS, DANGER, READ, DEAR, RED."
      },
      {
        "id": "wc_g7_h_41",
        "availableLetters": [
          "P",
          "O",
          "L",
          "I",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "POLITE",
            "turkishMeaning": "Kibar"
          },
          {
            "word": "PILOT",
            "turkishMeaning": "Pilot"
          },
          {
            "word": "POLE",
            "turkishMeaning": "Kutup"
          },
          {
            "word": "TOIL",
            "turkishMeaning": "Zahmet"
          },
          {
            "word": "PLOT",
            "turkishMeaning": "Komplo"
          },
          {
            "word": "TOP",
            "turkishMeaning": "Zirve"
          },
          {
            "word": "LIP",
            "turkishMeaning": "Dudak"
          }
        ],
        "category": "Personality",
        "theme": "Manners",
        "explanation": "Connect letters P, O, L, I, T, E to form: POLITE, PILOT, POLE, TOIL, PLOT, TOP, LIP."
      },
      {
        "id": "wc_g7_h_42",
        "availableLetters": [
          "H",
          "O",
          "N",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "HONEST",
            "turkishMeaning": "Dürüst"
          },
          {
            "word": "STONE",
            "turkishMeaning": "Taş"
          },
          {
            "word": "NOSE",
            "turkishMeaning": "Burun"
          },
          {
            "word": "NEST",
            "turkishMeaning": "Yuva"
          },
          {
            "word": "SHOE",
            "turkishMeaning": "Ayakkabı"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Personality",
        "theme": "Truthfulness",
        "explanation": "Connect letters H, O, N, E, S, T to form: HONEST, STONE, NOSE, NEST, SHOE, HOT, NET."
      },
      {
        "id": "wc_g7_h_43",
        "availableLetters": [
          "S",
          "T",
          "A",
          "B",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "STABLE",
            "turkishMeaning": "İstikrarlı"
          },
          {
            "word": "TABLE",
            "turkishMeaning": "Masa"
          },
          {
            "word": "BEAST",
            "turkishMeaning": "Canavar"
          },
          {
            "word": "LEAST",
            "turkishMeaning": "En az"
          },
          {
            "word": "ABLE",
            "turkishMeaning": "Yetenekli"
          },
          {
            "word": "BATS",
            "turkishMeaning": "Yarasalar"
          }
        ],
        "category": "Personality",
        "theme": "Firm Character",
        "explanation": "Connect letters S, T, A, B, L, E to form: STABLE, TABLE, BEAST, LEAST, ABLE, BATS."
      },
      {
        "id": "wc_g7_h_44",
        "availableLetters": [
          "S",
          "P",
          "O",
          "R",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "SPORTS",
            "turkishMeaning": "Sporlar"
          },
          {
            "word": "SPOTS",
            "turkishMeaning": "Noktalar"
          },
          {
            "word": "POSTS",
            "turkishMeaning": "Gönderiler"
          },
          {
            "word": "STOPS",
            "turkishMeaning": "Duraklar"
          },
          {
            "word": "PORT",
            "turkishMeaning": "Liman"
          },
          {
            "word": "SPOT",
            "turkishMeaning": "Leke"
          }
        ],
        "category": "Sports",
        "theme": "Athletic Contests",
        "explanation": "Connect letters S, P, O, R, T, S to form: SPORTS, SPOTS, POSTS, STOPS, PORT, SPOT."
      },
      {
        "id": "wc_g7_h_45",
        "availableLetters": [
          "P",
          "L",
          "A",
          "Y",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "PLAYER",
            "turkishMeaning": "Oyuncu"
          },
          {
            "word": "EARLY",
            "turkishMeaning": "Erken"
          },
          {
            "word": "REPAY",
            "turkishMeaning": "Geri ödemek"
          },
          {
            "word": "PEAR",
            "turkishMeaning": "Armut"
          },
          {
            "word": "PALE",
            "turkishMeaning": "Solgun"
          },
          {
            "word": "RAY",
            "turkishMeaning": "Işın"
          }
        ],
        "category": "Sports",
        "theme": "Athletes",
        "explanation": "Connect letters P, L, A, Y, E, R to form: PLAYER, EARLY, REPAY, PEAR, PALE, RAY."
      },
      {
        "id": "wc_g7_h_46",
        "availableLetters": [
          "A",
          "R",
          "C",
          "H",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "ARCHER",
            "turkishMeaning": "Okçu"
          },
          {
            "word": "REACH",
            "turkishMeaning": "Ulaşmak"
          },
          {
            "word": "RACE",
            "turkishMeaning": "Yarış"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "CARE",
            "turkishMeaning": "Önemsemek"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          }
        ],
        "category": "Sports",
        "theme": "Archery Skills",
        "explanation": "Connect letters A, R, C, H, E, R to form: ARCHER, REACH, RACE, HEAR, CARE, CAR."
      },
      {
        "id": "wc_g7_h_47",
        "availableLetters": [
          "L",
          "E",
          "A",
          "G",
          "U",
          "E"
        ],
        "targetWords": [
          {
            "word": "LEAGUE",
            "turkishMeaning": "Lig"
          },
          {
            "word": "EAGLE",
            "turkishMeaning": "Kartal"
          },
          {
            "word": "GLUE",
            "turkishMeaning": "Yapıştırıcı"
          },
          {
            "word": "GALE",
            "turkishMeaning": "Fırtına"
          },
          {
            "word": "AGE",
            "turkishMeaning": "Yaş"
          }
        ],
        "category": "Sports",
        "theme": "Tournaments",
        "explanation": "Connect letters L, E, A, G, U, E to form: LEAGUE, EAGLE, GLUE, GALE, AGE."
      },
      {
        "id": "wc_g7_h_48",
        "availableLetters": [
          "C",
          "A",
          "R",
          "E",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "CAREER",
            "turkishMeaning": "Kariyer"
          },
          {
            "word": "CARE",
            "turkishMeaning": "Özen"
          },
          {
            "word": "RACE",
            "turkishMeaning": "Yarış"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Biographies",
        "theme": "Professional Life",
        "explanation": "Connect letters C, A, R, E, E, R to form: CAREER, CARE, RACE, EAR."
      },
      {
        "id": "wc_g7_h_49",
        "availableLetters": [
          "F",
          "A",
          "M",
          "O",
          "U",
          "S"
        ],
        "targetWords": [
          {
            "word": "FAMOUS",
            "turkishMeaning": "Ünlü"
          },
          {
            "word": "FOAM",
            "turkishMeaning": "Köpük"
          },
          {
            "word": "SUM",
            "turkishMeaning": "Toplam"
          }
        ],
        "category": "Biographies",
        "theme": "Renown",
        "explanation": "Connect letters F, A, M, O, U, S to form: FAMOUS, FOAM, SUM."
      },
      {
        "id": "wc_g7_h_50",
        "availableLetters": [
          "J",
          "U",
          "N",
          "G",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "JUNGLE",
            "turkishMeaning": "Balta girmemiş orman"
          },
          {
            "word": "GLUE",
            "turkishMeaning": "Tutkal"
          },
          {
            "word": "LUNG",
            "turkishMeaning": "Akciğer"
          },
          {
            "word": "GUN",
            "turkishMeaning": "Silah"
          },
          {
            "word": "LEG",
            "turkishMeaning": "Bacak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Tropical Habitats",
        "explanation": "Connect letters J, U, N, G, L, E to form: JUNGLE, GLUE, LUNG, GUN, LEG."
      },
      {
        "id": "wc_g7_h_51",
        "availableLetters": [
          "M",
          "O",
          "N",
          "K",
          "E",
          "Y"
        ],
        "targetWords": [
          {
            "word": "MONKEY",
            "turkishMeaning": "Maymun"
          },
          {
            "word": "MONEY",
            "turkishMeaning": "Para"
          },
          {
            "word": "YOKE",
            "turkishMeaning": "Boyunduruk"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "KEY",
            "turkishMeaning": "Anahtar"
          }
        ],
        "category": "Wild Animals",
        "theme": "Tree Primates",
        "explanation": "Connect letters M, O, N, K, E, Y to form: MONKEY, MONEY, YOKE, ONE, KEY."
      },
      {
        "id": "wc_g7_h_52",
        "availableLetters": [
          "F",
          "A",
          "L",
          "C",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "FALCON",
            "turkishMeaning": "Doğan, şahin"
          },
          {
            "word": "LOAN",
            "turkishMeaning": "Borç"
          },
          {
            "word": "COAL",
            "turkishMeaning": "Kömür"
          },
          {
            "word": "CAN",
            "turkishMeaning": "Kutu"
          },
          {
            "word": "FAN",
            "turkishMeaning": "Vantilatör"
          }
        ],
        "category": "Wild Animals",
        "theme": "Avian Predators",
        "explanation": "Connect letters F, A, L, C, O, N to form: FALCON, LOAN, COAL, CAN, FAN."
      },
      {
        "id": "wc_g7_h_53",
        "availableLetters": [
          "S",
          "A",
          "F",
          "A",
          "R",
          "I"
        ],
        "targetWords": [
          {
            "word": "SAFARI",
            "turkishMeaning": "Safari"
          },
          {
            "word": "FAIR",
            "turkishMeaning": "Adil"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          },
          {
            "word": "FAR",
            "turkishMeaning": "Uzak"
          }
        ],
        "category": "Wild Animals",
        "theme": "Wild Expeditions",
        "explanation": "Connect letters S, A, F, A, R, I to form: SAFARI, FAIR, AIR, FAR."
      },
      {
        "id": "wc_g7_h_54",
        "availableLetters": [
          "S",
          "E",
          "R",
          "I",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "SERIES",
            "turkishMeaning": "Dizi"
          },
          {
            "word": "SEER",
            "turkishMeaning": "Kâhin"
          },
          {
            "word": "SIRE",
            "turkishMeaning": "Efendi"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Television",
        "theme": "Broadcast Episodes",
        "explanation": "Connect letters S, E, R, I, E, S to form: SERIES, SEER, SIRE, SEE."
      },
      {
        "id": "wc_g7_h_55",
        "availableLetters": [
          "A",
          "U",
          "T",
          "H",
          "O",
          "R"
        ],
        "targetWords": [
          {
            "word": "AUTHOR",
            "turkishMeaning": "Yazar"
          },
          {
            "word": "HART",
            "turkishMeaning": "Erkek geyik"
          },
          {
            "word": "HUT",
            "turkishMeaning": "Kulübe"
          },
          {
            "word": "OAT",
            "turkishMeaning": "Yulaf"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          }
        ],
        "category": "Television",
        "theme": "Writers",
        "explanation": "Connect letters A, U, T, H, O, R to form: AUTHOR, HART, HUT, OAT, HOT."
      },
      {
        "id": "wc_g7_h_56",
        "availableLetters": [
          "C",
          "A",
          "M",
          "E",
          "R",
          "A"
        ],
        "targetWords": [
          {
            "word": "CAMERA",
            "turkishMeaning": "Kamera"
          },
          {
            "word": "CREAM",
            "turkishMeaning": "Krema"
          },
          {
            "word": "ACRE",
            "turkishMeaning": "Dönüm"
          },
          {
            "word": "RACE",
            "turkishMeaning": "Yarış"
          },
          {
            "word": "CRAM",
            "turkishMeaning": "Tıkıştırmak"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          }
        ],
        "category": "Television",
        "theme": "Studio Equipment",
        "explanation": "Connect letters C, A, M, E, R, A to form: CAMERA, CREAM, ACRE, RACE, CRAM, CAR."
      },
      {
        "id": "wc_g7_h_57",
        "availableLetters": [
          "S",
          "C",
          "R",
          "E",
          "E",
          "N"
        ],
        "targetWords": [
          {
            "word": "SCREEN",
            "turkishMeaning": "Ekran"
          },
          {
            "word": "SCENE",
            "turkishMeaning": "Sahne"
          },
          {
            "word": "SEEN",
            "turkishMeaning": "Görüldü"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Television",
        "theme": "Display Technology",
        "explanation": "Connect letters S, C, R, E, E, N to form: SCREEN, SCENE, SEEN, SEE."
      },
      {
        "id": "wc_g7_h_58",
        "availableLetters": [
          "S",
          "T",
          "R",
          "E",
          "A",
          "M"
        ],
        "targetWords": [
          {
            "word": "STREAM",
            "turkishMeaning": "Akış, dere"
          },
          {
            "word": "MASTER",
            "turkishMeaning": "Usta"
          },
          {
            "word": "SMART",
            "turkishMeaning": "Akıllı"
          },
          {
            "word": "STEAM",
            "turkishMeaning": "Buhar"
          },
          {
            "word": "TEAM",
            "turkishMeaning": "Takım"
          },
          {
            "word": "MEAT",
            "turkishMeaning": "Et"
          }
        ],
        "category": "Television & Environment",
        "theme": "Continuous Flow",
        "explanation": "Connect letters S, T, R, E, A, M to form: STREAM, MASTER, SMART, STEAM, TEAM, MEAT."
      },
      {
        "id": "wc_g7_h_59",
        "availableLetters": [
          "C",
          "A",
          "N",
          "D",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "CANDLE",
            "turkishMeaning": "Mum"
          },
          {
            "word": "CLEAN",
            "turkishMeaning": "Temiz"
          },
          {
            "word": "DANCE",
            "turkishMeaning": "Dans"
          },
          {
            "word": "LANE",
            "turkishMeaning": "Şerit"
          },
          {
            "word": "LAND",
            "turkishMeaning": "Kara"
          }
        ],
        "category": "Celebrations",
        "theme": "Party Lights",
        "explanation": "Connect letters C, A, N, D, L, E to form: CANDLE, CLEAN, DANCE, LANE, LAND."
      },
      {
        "id": "wc_g7_h_60",
        "availableLetters": [
          "B",
          "A",
          "N",
          "N",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "BANNER",
            "turkishMeaning": "Pankart"
          },
          {
            "word": "BARE",
            "turkishMeaning": "Yalın"
          },
          {
            "word": "BARN",
            "turkishMeaning": "Ahır"
          },
          {
            "word": "NEAR",
            "turkishMeaning": "Yakın"
          },
          {
            "word": "BAR",
            "turkishMeaning": "Çubuk"
          }
        ],
        "category": "Celebrations",
        "theme": "Festival Signs",
        "explanation": "Connect letters B, A, N, N, E, R to form: BANNER, BARE, BARN, NEAR, BAR."
      },
      {
        "id": "wc_g7_h_61",
        "availableLetters": [
          "P",
          "A",
          "R",
          "A",
          "D",
          "E"
        ],
        "targetWords": [
          {
            "word": "PARADE",
            "turkishMeaning": "Geçit töreni"
          },
          {
            "word": "DEAR",
            "turkishMeaning": "Sevgili"
          },
          {
            "word": "DARE",
            "turkishMeaning": "Cesaret"
          },
          {
            "word": "PEAR",
            "turkishMeaning": "Armut"
          },
          {
            "word": "PAD",
            "turkishMeaning": "Ped"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Celebrations",
        "theme": "Civic Pageantry",
        "explanation": "Connect letters P, A, R, A, D, E to form: PARADE, DEAR, DARE, PEAR, PAD, RED."
      },
      {
        "id": "wc_g7_h_62",
        "availableLetters": [
          "I",
          "N",
          "V",
          "I",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "INVITE",
            "turkishMeaning": "Davet etmek"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağ"
          },
          {
            "word": "TIN",
            "turkishMeaning": "Teneke"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Celebrations",
        "theme": "Invitations",
        "explanation": "Connect letters I, N, V, I, T, E to form: INVITE, TIE, TIN, NET."
      },
      {
        "id": "wc_g7_h_63",
        "availableLetters": [
          "F",
          "U",
          "T",
          "U",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "FUTURE",
            "turkishMeaning": "Gelecek"
          },
          {
            "word": "TRUE",
            "turkishMeaning": "Doğru"
          },
          {
            "word": "FUR",
            "turkishMeaning": "Kürk"
          }
        ],
        "category": "Dreams",
        "theme": "Tomorrow's World",
        "explanation": "Connect letters F, U, T, U, R, E to form: FUTURE, TRUE, FUR."
      },
      {
        "id": "wc_g7_h_64",
        "availableLetters": [
          "F",
          "L",
          "Y",
          "I",
          "N",
          "G"
        ],
        "targetWords": [
          {
            "word": "FLYING",
            "turkishMeaning": "Uçan"
          },
          {
            "word": "FLY",
            "turkishMeaning": "Uçmak"
          },
          {
            "word": "FIG",
            "turkishMeaning": "İncir"
          },
          {
            "word": "GIN",
            "turkishMeaning": "Cırgır"
          }
        ],
        "category": "Dreams",
        "theme": "Aero Ambition",
        "explanation": "Connect letters F, L, Y, I, N, G to form: FLYING, FLY, FIG, GIN."
      },
      {
        "id": "wc_g7_h_65",
        "availableLetters": [
          "M",
          "U",
          "S",
          "E",
          "U",
          "M"
        ],
        "targetWords": [
          {
            "word": "MUSEUM",
            "turkishMeaning": "Müze"
          },
          {
            "word": "MUSE",
            "turkishMeaning": "Esinlenmek"
          },
          {
            "word": "SUM",
            "turkishMeaning": "Toplam"
          }
        ],
        "category": "Public Buildings",
        "theme": "Cultural Antiquities",
        "explanation": "Connect letters M, U, S, E, U, M to form: MUSEUM, MUSE, SUM."
      },
      {
        "id": "wc_g7_h_66",
        "availableLetters": [
          "M",
          "A",
          "R",
          "K",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "MARKET",
            "turkishMeaning": "Pazar, çarşı"
          },
          {
            "word": "MAKE",
            "turkishMeaning": "Yapmak"
          },
          {
            "word": "TAKE",
            "turkishMeaning": "Almak"
          },
          {
            "word": "TEAM",
            "turkishMeaning": "Takım"
          },
          {
            "word": "MEAT",
            "turkishMeaning": "Et"
          },
          {
            "word": "MATE",
            "turkishMeaning": "Dost"
          }
        ],
        "category": "Public Buildings",
        "theme": "Local Trade",
        "explanation": "Connect letters M, A, R, K, E, T to form: MARKET, MAKE, TAKE, TEAM, MEAT, MATE."
      },
      {
        "id": "wc_g7_h_67",
        "availableLetters": [
          "B",
          "R",
          "I",
          "D",
          "G",
          "E"
        ],
        "targetWords": [
          {
            "word": "BRIDGE",
            "turkishMeaning": "Köprü"
          },
          {
            "word": "BIRD",
            "turkishMeaning": "Kuş"
          },
          {
            "word": "RIDE",
            "turkishMeaning": "Binmek"
          },
          {
            "word": "GRID",
            "turkishMeaning": "Şebeke"
          },
          {
            "word": "BIG",
            "turkishMeaning": "Büyük"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Public Buildings",
        "theme": "Engineering Spans",
        "explanation": "Connect letters B, R, I, D, G, E to form: BRIDGE, BIRD, RIDE, GRID, BIG, RED."
      },
      {
        "id": "wc_g7_h_68",
        "availableLetters": [
          "S",
          "T",
          "R",
          "E",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "STREET",
            "turkishMeaning": "Cadde"
          },
          {
            "word": "TREE",
            "turkishMeaning": "Ağaç"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          }
        ],
        "category": "Public Buildings",
        "theme": "City Thoroughfares",
        "explanation": "Connect letters S, T, R, E, E, T to form: STREET, TREE, REST, SET."
      },
      {
        "id": "wc_g7_h_69",
        "availableLetters": [
          "N",
          "A",
          "T",
          "U",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "NATURE",
            "turkishMeaning": "Doğa"
          },
          {
            "word": "TRUE",
            "turkishMeaning": "Doğru"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "NEAR",
            "turkishMeaning": "Yakın"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Environment",
        "theme": "Living Biosphere",
        "explanation": "Connect letters N, A, T, U, R, E to form: NATURE, TRUE, RATE, NEAR, EAR."
      },
      {
        "id": "wc_g7_h_70",
        "availableLetters": [
          "F",
          "O",
          "R",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "FOREST",
            "turkishMeaning": "Orman"
          },
          {
            "word": "STORE",
            "turkishMeaning": "Mağaza"
          },
          {
            "word": "FROST",
            "turkishMeaning": "Don"
          },
          {
            "word": "FORTE",
            "turkishMeaning": "Güçlü yan"
          },
          {
            "word": "FORT",
            "turkishMeaning": "Kale"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          }
        ],
        "category": "Environment",
        "theme": "Canopy Habitats",
        "explanation": "Connect letters F, O, R, E, S, T to form: FOREST, STORE, FROST, FORTE, FORT, REST."
      },
      {
        "id": "wc_g7_h_71",
        "availableLetters": [
          "P",
          "L",
          "A",
          "N",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "PLANET",
            "turkishMeaning": "Gezegen"
          },
          {
            "word": "PLANT",
            "turkishMeaning": "Bitki"
          },
          {
            "word": "PLANE",
            "turkishMeaning": "Uçak"
          },
          {
            "word": "PLATE",
            "turkishMeaning": "Tabak"
          },
          {
            "word": "LEAP",
            "turkishMeaning": "Sıçramak"
          },
          {
            "word": "PALE",
            "turkishMeaning": "Solgun"
          }
        ],
        "category": "Planets",
        "theme": "Orbital Worlds",
        "explanation": "Connect letters P, L, A, N, E, T to form: PLANET, PLANT, PLANE, PLATE, LEAP, PALE."
      },
      {
        "id": "wc_g7_h_72",
        "availableLetters": [
          "S",
          "A",
          "T",
          "U",
          "R",
          "N"
        ],
        "targetWords": [
          {
            "word": "SATURN",
            "turkishMeaning": "Satürn"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "RUST",
            "turkishMeaning": "Pas"
          },
          {
            "word": "RUNS",
            "turkishMeaning": "Koşular"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          },
          {
            "word": "SUN",
            "turkishMeaning": "Güneş"
          }
        ],
        "category": "Planets",
        "theme": "Ringed Worlds",
        "explanation": "Connect letters S, A, T, U, R, N to form: SATURN, STAR, RUST, RUNS, ART, SUN."
      },
      {
        "id": "wc_g7_h_73",
        "availableLetters": [
          "O",
          "N",
          "L",
          "I",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "ONLINE",
            "turkishMeaning": "Çevrim içi"
          },
          {
            "word": "LINE",
            "turkishMeaning": "Çizgi"
          },
          {
            "word": "LION",
            "turkishMeaning": "Aslan"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "INN",
            "turkishMeaning": "Han"
          }
        ],
        "category": "Life Online",
        "theme": "Connected Net",
        "explanation": "Connect letters O, N, L, I, N, E to form: ONLINE, LINE, LION, ONE, INN."
      },
      {
        "id": "wc_g7_h_74",
        "availableLetters": [
          "B",
          "R",
          "O",
          "W",
          "S",
          "E"
        ],
        "targetWords": [
          {
            "word": "BROWSE",
            "turkishMeaning": "Gezinmek"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "SORE",
            "turkishMeaning": "Ağrılı"
          },
          {
            "word": "BOW",
            "turkishMeaning": "Yay"
          },
          {
            "word": "ROW",
            "turkishMeaning": "Kürek çekmek"
          }
        ],
        "category": "Life Online",
        "theme": "Web Exploration",
        "explanation": "Connect letters B, R, O, W, S, E to form: BROWSE, ROSE, SORE, BOW, ROW."
      },
      {
        "id": "wc_g7_h_75",
        "availableLetters": [
          "S",
          "A",
          "F",
          "E",
          "T",
          "Y"
        ],
        "targetWords": [
          {
            "word": "SAFETY",
            "turkishMeaning": "Güvenlik"
          },
          {
            "word": "SAFE",
            "turkishMeaning": "Güvenli"
          },
          {
            "word": "FATE",
            "turkishMeaning": "Kader"
          },
          {
            "word": "FAST",
            "turkishMeaning": "Hızlı"
          },
          {
            "word": "EASY",
            "turkishMeaning": "Kolay"
          },
          {
            "word": "SAY",
            "turkishMeaning": "Söylemek"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Risk Prevention",
        "explanation": "Connect letters S, A, F, E, T, Y to form: SAFETY, SAFE, FATE, FAST, EASY, SAY."
      },
      {
        "id": "wc_g7_h_76",
        "availableLetters": [
          "R",
          "E",
          "S",
          "C",
          "U",
          "E"
        ],
        "targetWords": [
          {
            "word": "RESCUE",
            "turkishMeaning": "Kurtarmak"
          },
          {
            "word": "CURE",
            "turkishMeaning": "Tedavi"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          },
          {
            "word": "SUE",
            "turkishMeaning": "Dava açmak"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Emergency Salvation",
        "explanation": "Connect letters R, E, S, C, U, E to form: RESCUE, CURE, SEE, SUE."
      },
      {
        "id": "wc_g7_h_77",
        "availableLetters": [
          "H",
          "E",
          "A",
          "L",
          "T",
          "H"
        ],
        "targetWords": [
          {
            "word": "HEALTH",
            "turkishMeaning": "Sağlık"
          },
          {
            "word": "HEAL",
            "turkishMeaning": "İyileşmek"
          },
          {
            "word": "HEAT",
            "turkishMeaning": "Isı"
          },
          {
            "word": "HATE",
            "turkishMeaning": "Nefret"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Wellbeing",
        "explanation": "Connect letters H, E, A, L, T, H to form: HEALTH, HEAL, HEAT, HATE, LATE."
      },
      {
        "id": "wc_g7_h_78",
        "availableLetters": [
          "D",
          "O",
          "C",
          "T",
          "O",
          "R"
        ],
        "targetWords": [
          {
            "word": "DOCTOR",
            "turkishMeaning": "Doktor"
          },
          {
            "word": "ROOT",
            "turkishMeaning": "Kök"
          },
          {
            "word": "DOOR",
            "turkishMeaning": "Kapı"
          },
          {
            "word": "ROD",
            "turkishMeaning": "Çubuk"
          },
          {
            "word": "DOT",
            "turkishMeaning": "Nokta"
          }
        ],
        "category": "In and Out of Danger",
        "theme": "Medical Care",
        "explanation": "Connect letters D, O, C, T, O, R to form: DOCTOR, ROOT, DOOR, ROD, DOT."
      },
      {
        "id": "wc_g7_h_79",
        "availableLetters": [
          "C",
          "A",
          "S",
          "T",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "CASTLE",
            "turkishMeaning": "Şato, kale"
          },
          {
            "word": "SCALE",
            "turkishMeaning": "Ölçek"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "SALE",
            "turkishMeaning": "Satış"
          },
          {
            "word": "CASE",
            "turkishMeaning": "Kasa"
          },
          {
            "word": "EAST",
            "turkishMeaning": "Doğu"
          }
        ],
        "category": "Britain",
        "theme": "Royal Strongholds",
        "explanation": "Connect letters C, A, S, T, L, E to form: CASTLE, SCALE, LATE, SALE, CASE, EAST."
      },
      {
        "id": "wc_g7_h_80",
        "availableLetters": [
          "G",
          "A",
          "L",
          "A",
          "X",
          "Y"
        ],
        "targetWords": [
          {
            "word": "GALAXY",
            "turkishMeaning": "Galaksi"
          },
          {
            "word": "LAG",
            "turkishMeaning": "Gecikme"
          }
        ],
        "category": "Planets",
        "theme": "Cosmic Systems",
        "explanation": "Connect letters G, A, L, A, X, Y to form: GALAXY, LAG."
      }
    ]
  },
  "grade-8": {
    "easy": [
      {
        "id": "wc_g8_e_01",
        "availableLetters": [
          "M",
          "A",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "MATE",
            "turkishMeaning": "Dost"
          },
          {
            "word": "MEAT",
            "turkishMeaning": "Et"
          },
          {
            "word": "TEAM",
            "turkishMeaning": "Takım"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "Friendship",
        "theme": "Best Buddies",
        "explanation": "Connect letters M, A, T, E to form: MATE, MEAT, TEAM, TEA."
      },
      {
        "id": "wc_g8_e_02",
        "availableLetters": [
          "T",
          "R",
          "U",
          "E"
        ],
        "targetWords": [
          {
            "word": "TRUE",
            "turkishMeaning": "Gerçek"
          },
          {
            "word": "RUE",
            "turkishMeaning": "Pişmanlık"
          },
          {
            "word": "RUT",
            "turkishMeaning": "İz"
          }
        ],
        "category": "Friendship",
        "theme": "Loyalty",
        "explanation": "Connect letters T, R, U, E to form: TRUE, RUE, RUT."
      },
      {
        "id": "wc_g8_e_03",
        "availableLetters": [
          "C",
          "A",
          "M",
          "P"
        ],
        "targetWords": [
          {
            "word": "CAMP",
            "turkishMeaning": "Kamp"
          },
          {
            "word": "CAP",
            "turkishMeaning": "Şapka"
          },
          {
            "word": "MAP",
            "turkishMeaning": "Harita"
          }
        ],
        "category": "Teen Life",
        "theme": "Summer Tents",
        "explanation": "Connect letters C, A, M, P to form: CAMP, CAP, MAP."
      },
      {
        "id": "wc_g8_e_04",
        "availableLetters": [
          "R",
          "O",
          "C",
          "K"
        ],
        "targetWords": [
          {
            "word": "ROCK",
            "turkishMeaning": "Rock müzik"
          },
          {
            "word": "CORK",
            "turkishMeaning": "Mantar"
          },
          {
            "word": "COR",
            "turkishMeaning": "Yürek"
          }
        ],
        "category": "Teen Life",
        "theme": "Music Beats",
        "explanation": "Connect letters R, O, C, K to form: ROCK, CORK, COR."
      },
      {
        "id": "wc_g8_e_05",
        "availableLetters": [
          "B",
          "A",
          "K",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "BAKE",
            "turkishMeaning": "Fırında pişirmek"
          },
          {
            "word": "BAKES",
            "turkishMeaning": "Pişirir"
          },
          {
            "word": "BEAK",
            "turkishMeaning": "Gaga"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Oven Baking",
        "explanation": "Connect letters B, A, K, E, S to form: BAKE, BAKES, BEAK."
      },
      {
        "id": "wc_g8_e_06",
        "availableLetters": [
          "B",
          "O",
          "I",
          "L"
        ],
        "targetWords": [
          {
            "word": "BOIL",
            "turkishMeaning": "Kaynatmak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Sıvı yağ"
          },
          {
            "word": "LOB",
            "turkishMeaning": "Atmak"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Boiling",
        "explanation": "Connect letters B, O, I, L to form: BOIL, OIL, LOB."
      },
      {
        "id": "wc_g8_e_07",
        "availableLetters": [
          "C",
          "H",
          "O",
          "P"
        ],
        "targetWords": [
          {
            "word": "CHOP",
            "turkishMeaning": "Doğramak"
          },
          {
            "word": "HOP",
            "turkishMeaning": "Zıplamak"
          },
          {
            "word": "COP",
            "turkishMeaning": "Polis"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Chopping",
        "explanation": "Connect letters C, H, O, P to form: CHOP, HOP, COP."
      },
      {
        "id": "wc_g8_e_08",
        "availableLetters": [
          "C",
          "O",
          "O",
          "K",
          "S"
        ],
        "targetWords": [
          {
            "word": "COOK",
            "turkishMeaning": "Yemek pişirmek"
          },
          {
            "word": "COOKS",
            "turkishMeaning": "Aşçılar"
          },
          {
            "word": "COO",
            "turkishMeaning": "Guguklamak"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Chef Cooking",
        "explanation": "Connect letters C, O, O, K, S to form: COOK, COOKS, COO."
      },
      {
        "id": "wc_g8_e_09",
        "availableLetters": [
          "C",
          "A",
          "L",
          "L",
          "S"
        ],
        "targetWords": [
          {
            "word": "CALL",
            "turkishMeaning": "Aramak"
          },
          {
            "word": "CALLS",
            "turkishMeaning": "Aramalar"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          }
        ],
        "category": "On The Phone",
        "theme": "Call Center",
        "explanation": "Connect letters C, A, L, L, S to form: CALL, CALLS, ALL."
      },
      {
        "id": "wc_g8_e_10",
        "availableLetters": [
          "D",
          "I",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "DIAL",
            "turkishMeaning": "Numara çevirmek"
          },
          {
            "word": "LID",
            "turkishMeaning": "Kapak"
          },
          {
            "word": "AID",
            "turkishMeaning": "Yardım"
          },
          {
            "word": "LAD",
            "turkishMeaning": "Delikanlı"
          }
        ],
        "category": "On The Phone",
        "theme": "Keypad",
        "explanation": "Connect letters D, I, A, L to form: DIAL, LID, AID, LAD."
      },
      {
        "id": "wc_g8_e_11",
        "availableLetters": [
          "H",
          "O",
          "L",
          "D"
        ],
        "targetWords": [
          {
            "word": "HOLD",
            "turkishMeaning": "Beklemek"
          },
          {
            "word": "OLD",
            "turkishMeaning": "Eski"
          },
          {
            "word": "HOD",
            "turkishMeaning": "Kova"
          }
        ],
        "category": "On The Phone",
        "theme": "Hold Line",
        "explanation": "Connect letters H, O, L, D to form: HOLD, OLD, HOD."
      },
      {
        "id": "wc_g8_e_12",
        "availableLetters": [
          "L",
          "I",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "LINE",
            "turkishMeaning": "Hat"
          },
          {
            "word": "NIL",
            "turkishMeaning": "Sıfır"
          },
          {
            "word": "LIE",
            "turkishMeaning": "Yalan"
          }
        ],
        "category": "On The Phone",
        "theme": "Telephone",
        "explanation": "Connect letters L, I, N, E to form: LINE, NIL, LIE."
      },
      {
        "id": "wc_g8_e_13",
        "availableLetters": [
          "B",
          "L",
          "O",
          "G"
        ],
        "targetWords": [
          {
            "word": "BLOG",
            "turkishMeaning": "Blog"
          },
          {
            "word": "GLOB",
            "turkishMeaning": "Damla"
          },
          {
            "word": "LOG",
            "turkishMeaning": "Kütük"
          },
          {
            "word": "BOG",
            "turkishMeaning": "Bataklık"
          }
        ],
        "category": "The Internet",
        "theme": "Blogging",
        "explanation": "Connect letters B, L, O, G to form: BLOG, GLOB, LOG, BOG."
      },
      {
        "id": "wc_g8_e_14",
        "availableLetters": [
          "L",
          "I",
          "N",
          "K"
        ],
        "targetWords": [
          {
            "word": "LINK",
            "turkishMeaning": "Bağlantı"
          },
          {
            "word": "KIN",
            "turkishMeaning": "Akraba"
          },
          {
            "word": "INK",
            "turkishMeaning": "Mürekkep"
          }
        ],
        "category": "The Internet",
        "theme": "Links",
        "explanation": "Connect letters L, I, N, K to form: LINK, KIN, INK."
      },
      {
        "id": "wc_g8_e_15",
        "availableLetters": [
          "P",
          "O",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "POST",
            "turkishMeaning": "Paylaşım"
          },
          {
            "word": "SPOT",
            "turkishMeaning": "Nokta"
          },
          {
            "word": "STOP",
            "turkishMeaning": "Dur"
          },
          {
            "word": "TOP",
            "turkishMeaning": "Üst"
          }
        ],
        "category": "The Internet",
        "theme": "Social Media",
        "explanation": "Connect letters P, O, S, T to form: POST, SPOT, STOP, TOP."
      },
      {
        "id": "wc_g8_e_16",
        "availableLetters": [
          "C",
          "H",
          "A",
          "T"
        ],
        "targetWords": [
          {
            "word": "CHAT",
            "turkishMeaning": "Sohbet"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          },
          {
            "word": "HAT",
            "turkishMeaning": "Şapka"
          },
          {
            "word": "ACT",
            "turkishMeaning": "Eylem"
          }
        ],
        "category": "The Internet",
        "theme": "Chatting",
        "explanation": "Connect letters C, H, A, T to form: CHAT, CAT, HAT, ACT."
      },
      {
        "id": "wc_g8_e_17",
        "availableLetters": [
          "S",
          "I",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "SITE",
            "turkishMeaning": "İnternet sitesi"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağlamak"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          }
        ],
        "category": "The Internet",
        "theme": "Web Sites",
        "explanation": "Connect letters S, I, T, E to form: SITE, TIE, SIT."
      },
      {
        "id": "wc_g8_e_18",
        "availableLetters": [
          "S",
          "O",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "SOAR",
            "turkishMeaning": "Süzülmek"
          },
          {
            "word": "OAR",
            "turkishMeaning": "Kürek"
          },
          {
            "word": "ROA",
            "turkishMeaning": "Kuş"
          }
        ],
        "category": "Adventures",
        "theme": "Gliding",
        "explanation": "Connect letters S, O, A, R to form: SOAR, OAR, ROA."
      },
      {
        "id": "wc_g8_e_19",
        "availableLetters": [
          "R",
          "A",
          "F",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "RAFTS",
            "turkishMeaning": "Botlar"
          },
          {
            "word": "RAFT",
            "turkishMeaning": "Sal / bot"
          },
          {
            "word": "FAST",
            "turkishMeaning": "Hızlı"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          }
        ],
        "category": "Adventures",
        "theme": "River Raft",
        "explanation": "Connect letters R, A, F, T, S to form: RAFTS, RAFT, FAST, STAR.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_e_20",
        "availableLetters": [
          "R",
          "I",
          "S",
          "K"
        ],
        "targetWords": [
          {
            "word": "RISK",
            "turkishMeaning": "Risk"
          },
          {
            "word": "SIR",
            "turkishMeaning": "Efendi"
          },
          {
            "word": "SKI",
            "turkishMeaning": "Kayak"
          }
        ],
        "category": "Adventures",
        "theme": "Adrenaline",
        "explanation": "Connect letters R, I, S, K to form: RISK, SIR, SKI."
      },
      {
        "id": "wc_g8_e_21",
        "availableLetters": [
          "T",
          "O",
          "U",
          "R"
        ],
        "targetWords": [
          {
            "word": "TOUR",
            "turkishMeaning": "Tur"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          },
          {
            "word": "OUT",
            "turkishMeaning": "Dışarı"
          }
        ],
        "category": "Tourism",
        "theme": "Sightseeing",
        "explanation": "Connect letters T, O, U, R to form: TOUR, ROT, OUT."
      },
      {
        "id": "wc_g8_e_22",
        "availableLetters": [
          "T",
          "R",
          "I",
          "P"
        ],
        "targetWords": [
          {
            "word": "TRIP",
            "turkishMeaning": "Gezi"
          },
          {
            "word": "TIP",
            "turkishMeaning": "Bahşiş"
          },
          {
            "word": "PIT",
            "turkishMeaning": "Çukur"
          },
          {
            "word": "RIP",
            "turkishMeaning": "Yırtmak"
          }
        ],
        "category": "Tourism",
        "theme": "Vacations",
        "explanation": "Connect letters T, R, I, P to form: TRIP, TIP, PIT, RIP."
      },
      {
        "id": "wc_g8_e_23",
        "availableLetters": [
          "T",
          "I",
          "D",
          "Y",
          "S"
        ],
        "targetWords": [
          {
            "word": "TIDY",
            "turkishMeaning": "Toplamak"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          },
          {
            "word": "ITS",
            "turkishMeaning": "Onun"
          }
        ],
        "category": "Chores",
        "theme": "Order",
        "explanation": "Connect letters T, I, D, Y, S to form: TIDY, SIT, ITS."
      },
      {
        "id": "wc_g8_e_24",
        "availableLetters": [
          "W",
          "A",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "WASH",
            "turkishMeaning": "Yıkamak"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          },
          {
            "word": "SAW",
            "turkishMeaning": "Testere"
          }
        ],
        "category": "Chores",
        "theme": "Washing",
        "explanation": "Connect letters W, A, S, H to form: WASH, ASH, SAW."
      },
      {
        "id": "wc_g8_e_25",
        "availableLetters": [
          "D",
          "U",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "DUST",
            "turkishMeaning": "Toz almak"
          },
          {
            "word": "STUD",
            "turkishMeaning": "Düğme"
          },
          {
            "word": "SUT",
            "turkishMeaning": "İs"
          }
        ],
        "category": "Chores",
        "theme": "Dusting",
        "explanation": "Connect letters D, U, S, T to form: DUST, STUD, SUT."
      },
      {
        "id": "wc_g8_e_26",
        "availableLetters": [
          "D",
          "I",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "DISH",
            "turkishMeaning": "Tabak"
          },
          {
            "word": "HIS",
            "turkishMeaning": "Onun"
          },
          {
            "word": "SID",
            "turkishMeaning": "Erkek adı"
          }
        ],
        "category": "Chores",
        "theme": "Dishes",
        "explanation": "Connect letters D, I, S, H to form: DISH, HIS, SID."
      },
      {
        "id": "wc_g8_e_27",
        "availableLetters": [
          "I",
          "R",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "IRON",
            "turkishMeaning": "Ütülemek"
          },
          {
            "word": "NOR",
            "turkishMeaning": "Ne de"
          },
          {
            "word": "ION",
            "turkishMeaning": "İyon"
          }
        ],
        "category": "Chores",
        "theme": "Ironing",
        "explanation": "Connect letters I, R, O, N to form: IRON, NOR, ION."
      },
      {
        "id": "wc_g8_e_28",
        "availableLetters": [
          "C",
          "U",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "CURE",
            "turkishMeaning": "Tedavi"
          },
          {
            "word": "CUE",
            "turkishMeaning": "İpucu"
          },
          {
            "word": "RUE",
            "turkishMeaning": "Pişmanlık"
          }
        ],
        "category": "Science",
        "theme": "Medicine",
        "explanation": "Connect letters C, U, R, E to form: CURE, CUE, RUE."
      },
      {
        "id": "wc_g8_e_29",
        "availableLetters": [
          "G",
          "E",
          "N",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "GENE",
            "turkishMeaning": "Gen"
          },
          {
            "word": "GENES",
            "turkishMeaning": "Genler"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          },
          {
            "word": "SEEN",
            "turkishMeaning": "Görülmüş"
          }
        ],
        "category": "Science",
        "theme": "Genetics",
        "explanation": "Connect letters G, E, N, E, S to form: GENE, GENES, SEE, SEEN."
      },
      {
        "id": "wc_g8_e_30",
        "availableLetters": [
          "C",
          "E",
          "L",
          "L",
          "S"
        ],
        "targetWords": [
          {
            "word": "CELL",
            "turkishMeaning": "Hücre"
          },
          {
            "word": "CELLS",
            "turkishMeaning": "Hücreler"
          },
          {
            "word": "ELL",
            "turkishMeaning": "Eski ölçü"
          }
        ],
        "category": "Science",
        "theme": "Microbiology",
        "explanation": "Connect letters C, E, L, L, S to form: CELL, CELLS, ELL."
      },
      {
        "id": "wc_g8_e_31",
        "availableLetters": [
          "A",
          "T",
          "O",
          "M"
        ],
        "targetWords": [
          {
            "word": "ATOM",
            "turkishMeaning": "Atom"
          },
          {
            "word": "MOAT",
            "turkishMeaning": "Hendek"
          },
          {
            "word": "TOM",
            "turkishMeaning": "Erkek kedi"
          },
          {
            "word": "MAT",
            "turkishMeaning": "Paspas"
          }
        ],
        "category": "Science",
        "theme": "Physics",
        "explanation": "Connect letters A, T, O, M to form: ATOM, MOAT, TOM, MAT."
      },
      {
        "id": "wc_g8_e_32",
        "availableLetters": [
          "F",
          "I",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "FIRE",
            "turkishMeaning": "Ateş"
          },
          {
            "word": "RIFE",
            "turkishMeaning": "Yaygın"
          },
          {
            "word": "FIR",
            "turkishMeaning": "Köknar"
          }
        ],
        "category": "Natural Forces",
        "theme": "Flames",
        "explanation": "Connect letters F, I, R, E to form: FIRE, RIFE, FIR."
      },
      {
        "id": "wc_g8_e_33",
        "availableLetters": [
          "T",
          "R",
          "E",
          "K",
          "S"
        ],
        "targetWords": [
          {
            "word": "TREK",
            "turkishMeaning": "Doğa yürüyüşü"
          },
          {
            "word": "TREKS",
            "turkishMeaning": "Yürüyüşler"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          }
        ],
        "category": "Teen Life",
        "theme": "Trekking",
        "explanation": "Connect letters T, R, E, K, S to form: TREK, TREKS, REST."
      },
      {
        "id": "wc_g8_e_34",
        "availableLetters": [
          "H",
          "I",
          "K",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "HIKE",
            "turkishMeaning": "Yürüyüş"
          },
          {
            "word": "HIKES",
            "turkishMeaning": "Yürüyüşler"
          },
          {
            "word": "SKI",
            "turkishMeaning": "Kayak"
          }
        ],
        "category": "Teen Life",
        "theme": "Trails",
        "explanation": "Connect letters H, I, K, E, S to form: HIKE, HIKES, SKI."
      },
      {
        "id": "wc_g8_e_35",
        "availableLetters": [
          "S",
          "U",
          "R",
          "F",
          "S"
        ],
        "targetWords": [
          {
            "word": "SURF",
            "turkishMeaning": "Sörf"
          },
          {
            "word": "SURFS",
            "turkishMeaning": "Sörfler"
          },
          {
            "word": "FUR",
            "turkishMeaning": "Kürk"
          }
        ],
        "category": "Adventures",
        "theme": "Ocean Waves",
        "explanation": "Connect letters S, U, R, F, S to form: SURF, SURFS, FUR."
      },
      {
        "id": "wc_g8_e_36",
        "availableLetters": [
          "D",
          "I",
          "V",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "DIVER",
            "turkishMeaning": "Dalgıç"
          },
          {
            "word": "DIVE",
            "turkishMeaning": "Dalmak"
          },
          {
            "word": "RIDE",
            "turkishMeaning": "Binmek / sürüş"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Adventures",
        "theme": "Scuba Diving",
        "explanation": "Connect letters D, I, V, E, R to form: DIVER, DIVE, RIDE, RED.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_e_37",
        "availableLetters": [
          "L",
          "A",
          "B",
          "S"
        ],
        "targetWords": [
          {
            "word": "LABS",
            "turkishMeaning": "Laboratuvarlar"
          },
          {
            "word": "LAB",
            "turkishMeaning": "Laboratuvar"
          },
          {
            "word": "SLAB",
            "turkishMeaning": "Plaka"
          }
        ],
        "category": "Science",
        "theme": "Chemistry",
        "explanation": "Connect letters L, A, B, S to form: LABS, LAB, SLAB."
      },
      {
        "id": "wc_g8_e_38",
        "availableLetters": [
          "F",
          "L",
          "A",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "FLATS",
            "turkishMeaning": "Düzlükler"
          },
          {
            "word": "FLAT",
            "turkishMeaning": "Düz"
          },
          {
            "word": "FAST",
            "turkishMeaning": "Hızlı"
          },
          {
            "word": "LAST",
            "turkishMeaning": "Son"
          }
        ],
        "category": "Tourism & Geography",
        "theme": "Plateaus & Nature",
        "explanation": "Connect letters F, L, A, T, S to form: FLATS, FLAT, FAST, LAST.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_e_39",
        "availableLetters": [
          "W",
          "I",
          "F",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "WIFE",
            "turkishMeaning": "Eş"
          },
          {
            "word": "FEW",
            "turkishMeaning": "Az"
          },
          {
            "word": "SEW",
            "turkishMeaning": "Dikiş dikmek"
          }
        ],
        "category": "The Internet",
        "theme": "Family",
        "explanation": "Connect letters W, I, F, E, S to form: WIFE, FEW, SEW."
      },
      {
        "id": "wc_g8_e_40",
        "availableLetters": [
          "S",
          "O",
          "N",
          "G",
          "S"
        ],
        "targetWords": [
          {
            "word": "SONG",
            "turkishMeaning": "Şarkı"
          },
          {
            "word": "SONGS",
            "turkishMeaning": "Şarkılar"
          },
          {
            "word": "SON",
            "turkishMeaning": "Oğul"
          }
        ],
        "category": "Teen Life",
        "theme": "Pop Songs",
        "explanation": "Connect letters S, O, N, G, S to form: SONG, SONGS, SON."
      },
      {
        "id": "wc_g8_e_41",
        "availableLetters": [
          "M",
          "A",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "MATE",
            "turkishMeaning": "Dost"
          },
          {
            "word": "TEAM",
            "turkishMeaning": "Takım"
          },
          {
            "word": "MEAT",
            "turkishMeaning": "Et"
          },
          {
            "word": "TAME",
            "turkishMeaning": "Evcil"
          },
          {
            "word": "EAT",
            "turkishMeaning": "Yemek"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "Friendship",
        "theme": "Allies",
        "explanation": "Connect letters M, A, T, E to form: MATE, TEAM, MEAT, TAME, EAT, TEA."
      },
      {
        "id": "wc_g8_e_42",
        "availableLetters": [
          "T",
          "R",
          "U",
          "E"
        ],
        "targetWords": [
          {
            "word": "TRUE",
            "turkishMeaning": "Doğru"
          },
          {
            "word": "RUE",
            "turkishMeaning": "Pişman olmak"
          }
        ],
        "category": "Friendship",
        "theme": "Loyalty",
        "explanation": "Connect letters T, R, U, E to form: TRUE, RUE."
      },
      {
        "id": "wc_g8_e_43",
        "availableLetters": [
          "P",
          "E",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "PEER",
            "turkishMeaning": "Akran"
          }
        ],
        "category": "Teen Life",
        "theme": "Classmates",
        "explanation": "Connect letters P, E, E, R to form: PEER."
      },
      {
        "id": "wc_g8_e_44",
        "availableLetters": [
          "B",
          "U",
          "S",
          "Y"
        ],
        "targetWords": [
          {
            "word": "BUSY",
            "turkishMeaning": "Meşgul"
          },
          {
            "word": "BUY",
            "turkishMeaning": "Satın almak"
          },
          {
            "word": "BUS",
            "turkishMeaning": "Otobüs"
          }
        ],
        "category": "Phone",
        "theme": "Active Calls",
        "explanation": "Connect letters B, U, S, Y to form: BUSY, BUY, BUS."
      },
      {
        "id": "wc_g8_e_45",
        "availableLetters": [
          "C",
          "A",
          "L",
          "L"
        ],
        "targetWords": [
          {
            "word": "CALL",
            "turkishMeaning": "Aramak"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          }
        ],
        "category": "Phone",
        "theme": "Phone Connections",
        "explanation": "Connect letters C, A, L, L to form: CALL, ALL."
      },
      {
        "id": "wc_g8_e_46",
        "availableLetters": [
          "R",
          "I",
          "N",
          "G"
        ],
        "targetWords": [
          {
            "word": "RING",
            "turkishMeaning": "Çalmak"
          },
          {
            "word": "GRIN",
            "turkishMeaning": "Sırıtmak"
          },
          {
            "word": "GIN",
            "turkishMeaning": "Cırgır"
          },
          {
            "word": "RIG",
            "turkishMeaning": "Donatmak"
          }
        ],
        "category": "Phone",
        "theme": "Phone Bells",
        "explanation": "Connect letters R, I, N, G to form: RING, GRIN, GIN, RIG."
      },
      {
        "id": "wc_g8_e_47",
        "availableLetters": [
          "L",
          "I",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "LINE",
            "turkishMeaning": "Hat"
          },
          {
            "word": "LIE",
            "turkishMeaning": "Yalan / Uzanmak"
          }
        ],
        "category": "Phone",
        "theme": "Audio Links",
        "explanation": "Connect letters L, I, N, E to form: LINE, LIE."
      },
      {
        "id": "wc_g8_e_48",
        "availableLetters": [
          "B",
          "O",
          "I",
          "L"
        ],
        "targetWords": [
          {
            "word": "BOIL",
            "turkishMeaning": "Kaynatmak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          }
        ],
        "category": "Kitchen",
        "theme": "Boiling Liquids",
        "explanation": "Connect letters B, O, I, L to form: BOIL, OIL."
      },
      {
        "id": "wc_g8_e_49",
        "availableLetters": [
          "B",
          "A",
          "K",
          "E"
        ],
        "targetWords": [
          {
            "word": "BAKE",
            "turkishMeaning": "Fırınlamak"
          }
        ],
        "category": "Kitchen",
        "theme": "Oven Craft",
        "explanation": "Connect letters B, A, K, E to form: BAKE."
      },
      {
        "id": "wc_g8_e_50",
        "availableLetters": [
          "C",
          "H",
          "O",
          "P"
        ],
        "targetWords": [
          {
            "word": "CHOP",
            "turkishMeaning": "Doğramak"
          },
          {
            "word": "HOP",
            "turkishMeaning": "Zıplamak"
          }
        ],
        "category": "Kitchen",
        "theme": "Knife Skills",
        "explanation": "Connect letters C, H, O, P to form: CHOP, HOP."
      },
      {
        "id": "wc_g8_e_51",
        "availableLetters": [
          "P",
          "E",
          "E",
          "L"
        ],
        "targetWords": [
          {
            "word": "PEEL",
            "turkishMeaning": "Soymak"
          }
        ],
        "category": "Kitchen",
        "theme": "Vegetable Prep",
        "explanation": "Connect letters P, E, E, L to form: PEEL."
      },
      {
        "id": "wc_g8_e_52",
        "availableLetters": [
          "P",
          "O",
          "U",
          "R"
        ],
        "targetWords": [
          {
            "word": "POUR",
            "turkishMeaning": "Dökmek"
          },
          {
            "word": "OUR",
            "turkishMeaning": "Bizim"
          },
          {
            "word": "PRO",
            "turkishMeaning": "Profesyonel"
          }
        ],
        "category": "Kitchen",
        "theme": "Sauce Pouring",
        "explanation": "Connect letters P, O, U, R to form: POUR, OUR, PRO."
      },
      {
        "id": "wc_g8_e_53",
        "availableLetters": [
          "S",
          "T",
          "I",
          "R"
        ],
        "targetWords": [
          {
            "word": "STIR",
            "turkishMeaning": "Karıştırmak"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          },
          {
            "word": "SIR",
            "turkishMeaning": "Beyefendi"
          }
        ],
        "category": "Kitchen",
        "theme": "Mixing Soups",
        "explanation": "Connect letters S, T, I, R to form: STIR, SIT, SIR."
      },
      {
        "id": "wc_g8_e_54",
        "availableLetters": [
          "D",
          "I",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "DISH",
            "turkishMeaning": "Tabak, yemek"
          }
        ],
        "category": "Kitchen",
        "theme": "Main Courses",
        "explanation": "Connect letters D, I, S, H to form: DISH."
      },
      {
        "id": "wc_g8_e_55",
        "availableLetters": [
          "F",
          "O",
          "R",
          "K"
        ],
        "targetWords": [
          {
            "word": "FORK",
            "turkishMeaning": "Çatal"
          },
          {
            "word": "FOR",
            "turkishMeaning": "İçin"
          }
        ],
        "category": "Kitchen",
        "theme": "Cutlery",
        "explanation": "Connect letters F, O, R, K to form: FORK, FOR."
      },
      {
        "id": "wc_g8_e_56",
        "availableLetters": [
          "B",
          "O",
          "W",
          "L"
        ],
        "targetWords": [
          {
            "word": "BOWL",
            "turkishMeaning": "Kase"
          },
          {
            "word": "BLOW",
            "turkishMeaning": "Üflemek"
          },
          {
            "word": "LOW",
            "turkishMeaning": "Düşük"
          },
          {
            "word": "OWL",
            "turkishMeaning": "Baykuş"
          }
        ],
        "category": "Kitchen",
        "theme": "Dinnerware",
        "explanation": "Connect letters B, O, W, L to form: BOWL, BLOW, LOW, OWL."
      },
      {
        "id": "wc_g8_e_57",
        "availableLetters": [
          "H",
          "I",
          "K",
          "E"
        ],
        "targetWords": [
          {
            "word": "HIKE",
            "turkishMeaning": "Yürüyüş"
          }
        ],
        "category": "Adventures",
        "theme": "Mountain Trails",
        "explanation": "Connect letters H, I, K, E to form: HIKE."
      },
      {
        "id": "wc_g8_e_58",
        "availableLetters": [
          "R",
          "O",
          "P",
          "E"
        ],
        "targetWords": [
          {
            "word": "ROPE",
            "turkishMeaning": "Halat"
          },
          {
            "word": "PORE",
            "turkishMeaning": "Gözenek"
          },
          {
            "word": "PRO",
            "turkishMeaning": "Uzman"
          }
        ],
        "category": "Adventures",
        "theme": "Climbing Cords",
        "explanation": "Connect letters R, O, P, E to form: ROPE, PORE, PRO."
      },
      {
        "id": "wc_g8_e_59",
        "availableLetters": [
          "T",
          "E",
          "N",
          "T"
        ],
        "targetWords": [
          {
            "word": "TENT",
            "turkishMeaning": "Çadır"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          },
          {
            "word": "TEN",
            "turkishMeaning": "On"
          }
        ],
        "category": "Adventures",
        "theme": "Camping Shelters",
        "explanation": "Connect letters T, E, N, T to form: TENT, NET, TEN."
      },
      {
        "id": "wc_g8_e_60",
        "availableLetters": [
          "C",
          "A",
          "M",
          "P"
        ],
        "targetWords": [
          {
            "word": "CAMP",
            "turkishMeaning": "Kamp"
          },
          {
            "word": "CAP",
            "turkishMeaning": "Kep"
          },
          {
            "word": "MAP",
            "turkishMeaning": "Harita"
          }
        ],
        "category": "Adventures",
        "theme": "Outdoor Camps",
        "explanation": "Connect letters C, A, M, P to form: CAMP, CAP, MAP."
      },
      {
        "id": "wc_g8_e_61",
        "availableLetters": [
          "T",
          "R",
          "I",
          "P"
        ],
        "targetWords": [
          {
            "word": "TRIP",
            "turkishMeaning": "Gezi"
          },
          {
            "word": "TIP",
            "turkishMeaning": "İpucu"
          },
          {
            "word": "RIP",
            "turkishMeaning": "Yırtmak"
          },
          {
            "word": "PIT",
            "turkishMeaning": "Çukur"
          }
        ],
        "category": "Tourism",
        "theme": "Holidays",
        "explanation": "Connect letters T, R, I, P to form: TRIP, TIP, RIP, PIT."
      },
      {
        "id": "wc_g8_e_62",
        "availableLetters": [
          "T",
          "O",
          "U",
          "R"
        ],
        "targetWords": [
          {
            "word": "TOUR",
            "turkishMeaning": "Tur"
          },
          {
            "word": "OUR",
            "turkishMeaning": "Bizim"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          },
          {
            "word": "OUT",
            "turkishMeaning": "Dışarı"
          }
        ],
        "category": "Tourism",
        "theme": "Sightseeing",
        "explanation": "Connect letters T, O, U, R to form: TOUR, OUR, ROT, OUT."
      },
      {
        "id": "wc_g8_e_63",
        "availableLetters": [
          "S",
          "T",
          "A",
          "Y"
        ],
        "targetWords": [
          {
            "word": "STAY",
            "turkishMeaning": "Kalmak"
          },
          {
            "word": "SAY",
            "turkishMeaning": "Söylemek"
          }
        ],
        "category": "Tourism",
        "theme": "Hotels",
        "explanation": "Connect letters S, T, A, Y to form: STAY, SAY."
      },
      {
        "id": "wc_g8_e_64",
        "availableLetters": [
          "V",
          "I",
          "E",
          "W"
        ],
        "targetWords": [
          {
            "word": "VIEW",
            "turkishMeaning": "Manzara"
          }
        ],
        "category": "Tourism",
        "theme": "Scenic Panoramas",
        "explanation": "Connect letters V, I, E, W to form: VIEW."
      },
      {
        "id": "wc_g8_e_65",
        "availableLetters": [
          "C",
          "I",
          "T",
          "Y"
        ],
        "targetWords": [
          {
            "word": "CITY",
            "turkishMeaning": "Şehir"
          }
        ],
        "category": "Tourism",
        "theme": "Urban Centers",
        "explanation": "Connect letters C, I, T, Y to form: CITY."
      },
      {
        "id": "wc_g8_e_66",
        "availableLetters": [
          "D",
          "U",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "DUST",
            "turkishMeaning": "Toz almak"
          }
        ],
        "category": "Chores",
        "theme": "Surface Tidying",
        "explanation": "Connect letters D, U, S, T to form: DUST."
      },
      {
        "id": "wc_g8_e_67",
        "availableLetters": [
          "W",
          "A",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "WASH",
            "turkishMeaning": "Yıkamak"
          },
          {
            "word": "SAW",
            "turkishMeaning": "Gördü"
          }
        ],
        "category": "Chores",
        "theme": "Cleanliness",
        "explanation": "Connect letters W, A, S, H to form: WASH, SAW."
      },
      {
        "id": "wc_g8_e_68",
        "availableLetters": [
          "I",
          "R",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "IRON",
            "turkishMeaning": "Ütülemek"
          },
          {
            "word": "NOR",
            "turkishMeaning": "Ne de"
          }
        ],
        "category": "Chores",
        "theme": "Garment Care",
        "explanation": "Connect letters I, R, O, N to form: IRON, NOR."
      },
      {
        "id": "wc_g8_e_69",
        "availableLetters": [
          "M",
          "E",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "MEND",
            "turkishMeaning": "Onarmak"
          },
          {
            "word": "MEN",
            "turkishMeaning": "Erkekler"
          },
          {
            "word": "END",
            "turkishMeaning": "Son"
          }
        ],
        "category": "Chores",
        "theme": "Repairs",
        "explanation": "Connect letters M, E, N, D to form: MEND, MEN, END."
      },
      {
        "id": "wc_g8_e_70",
        "availableLetters": [
          "A",
          "T",
          "O",
          "M"
        ],
        "targetWords": [
          {
            "word": "ATOM",
            "turkishMeaning": "Atom"
          },
          {
            "word": "MAT",
            "turkishMeaning": "Paspas"
          },
          {
            "word": "OAT",
            "turkishMeaning": "Yulaf"
          }
        ],
        "category": "Science",
        "theme": "Microscopic Physics",
        "explanation": "Connect letters A, T, O, M to form: ATOM, MAT, OAT."
      },
      {
        "id": "wc_g8_e_71",
        "availableLetters": [
          "C",
          "E",
          "L",
          "L"
        ],
        "targetWords": [
          {
            "word": "CELL",
            "turkishMeaning": "Hücre"
          }
        ],
        "category": "Science",
        "theme": "Biology Units",
        "explanation": "Connect letters C, E, L, L to form: CELL."
      },
      {
        "id": "wc_g8_e_72",
        "availableLetters": [
          "T",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "TEST",
            "turkishMeaning": "Test, deney"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          }
        ],
        "category": "Science",
        "theme": "Laboratory Trials",
        "explanation": "Connect letters T, E, S, T to form: TEST, SET."
      },
      {
        "id": "wc_g8_e_73",
        "availableLetters": [
          "M",
          "I",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "MIND",
            "turkishMeaning": "Zihin"
          },
          {
            "word": "DIM",
            "turkishMeaning": "Loş"
          }
        ],
        "category": "Science",
        "theme": "Cognitive Power",
        "explanation": "Connect letters M, I, N, D to form: MIND, DIM."
      },
      {
        "id": "wc_g8_e_74",
        "availableLetters": [
          "W",
          "A",
          "V",
          "E"
        ],
        "targetWords": [
          {
            "word": "WAVE",
            "turkishMeaning": "Dalga"
          }
        ],
        "category": "Natural Forces",
        "theme": "Ocean Currents",
        "explanation": "Connect letters W, A, V, E to form: WAVE."
      },
      {
        "id": "wc_g8_e_75",
        "availableLetters": [
          "W",
          "I",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "WIND",
            "turkishMeaning": "Rüzgar"
          },
          {
            "word": "WIN",
            "turkishMeaning": "Kazanmak"
          }
        ],
        "category": "Natural Forces",
        "theme": "Atmospheric Drafts",
        "explanation": "Connect letters W, I, N, D to form: WIND, WIN."
      },
      {
        "id": "wc_g8_e_76",
        "availableLetters": [
          "R",
          "A",
          "I",
          "N"
        ],
        "targetWords": [
          {
            "word": "RAIN",
            "turkishMeaning": "Yağmur"
          },
          {
            "word": "RAN",
            "turkishMeaning": "Koştu"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          }
        ],
        "category": "Natural Forces",
        "theme": "Precipitation",
        "explanation": "Connect letters R, A, I, N to form: RAIN, RAN, AIR."
      },
      {
        "id": "wc_g8_e_77",
        "availableLetters": [
          "S",
          "N",
          "O",
          "W"
        ],
        "targetWords": [
          {
            "word": "SNOW",
            "turkishMeaning": "Kar"
          },
          {
            "word": "NOW",
            "turkishMeaning": "Şimdi"
          },
          {
            "word": "SON",
            "turkishMeaning": "Oğul"
          },
          {
            "word": "WON",
            "turkishMeaning": "Kazandı"
          }
        ],
        "category": "Natural Forces",
        "theme": "Winter Flurries",
        "explanation": "Connect letters S, N, O, W to form: SNOW, NOW, SON, WON."
      },
      {
        "id": "wc_g8_e_78",
        "availableLetters": [
          "R",
          "O",
          "C",
          "K"
        ],
        "targetWords": [
          {
            "word": "ROCK",
            "turkishMeaning": "Kaya"
          },
          {
            "word": "CORK",
            "turkishMeaning": "Mantar"
          }
        ],
        "category": "Natural Forces",
        "theme": "Tectonic Geology",
        "explanation": "Connect letters R, O, C, K to form: ROCK, CORK."
      },
      {
        "id": "wc_g8_e_79",
        "availableLetters": [
          "F",
          "I",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "FIRE",
            "turkishMeaning": "Ateş"
          },
          {
            "word": "RIFE",
            "turkishMeaning": "Yaygın"
          },
          {
            "word": "REF",
            "turkishMeaning": "Hakem"
          },
          {
            "word": "FIR",
            "turkishMeaning": "Köknar"
          }
        ],
        "category": "Natural Forces",
        "theme": "Combustion",
        "explanation": "Connect letters F, I, R, E to form: FIRE, RIFE, REF, FIR."
      },
      {
        "id": "wc_g8_e_80",
        "availableLetters": [
          "L",
          "A",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "LAND",
            "turkishMeaning": "Kara"
          },
          {
            "word": "AND",
            "turkishMeaning": "Ve"
          },
          {
            "word": "LAD",
            "turkishMeaning": "Delikanlı"
          }
        ],
        "category": "Natural Forces",
        "theme": "Terrestrial Grounds",
        "explanation": "Connect letters L, A, N, D to form: LAND, AND, LAD."
      }
    ],
    "medium": [
      {
        "id": "wc_g8_m_01",
        "availableLetters": [
          "T",
          "R",
          "U",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "TRUST",
            "turkishMeaning": "Güven"
          },
          {
            "word": "RUST",
            "turkishMeaning": "Pas"
          },
          {
            "word": "RUTS",
            "turkishMeaning": "İzler"
          },
          {
            "word": "RUT",
            "turkishMeaning": "İz"
          }
        ],
        "category": "Friendship",
        "theme": "Trust",
        "explanation": "Connect letters T, R, U, S, T to form: TRUST, RUST, RUTS, RUT."
      },
      {
        "id": "wc_g8_m_02",
        "availableLetters": [
          "S",
          "H",
          "A",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "SHARE",
            "turkishMeaning": "Paylaşmak"
          },
          {
            "word": "HARE",
            "turkishMeaning": "Tavşan"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "ERA",
            "turkishMeaning": "Çağ"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Friendship",
        "theme": "Sharing",
        "explanation": "Connect letters S, H, A, R, E to form: SHARE, HARE, HEAR, ERA, EAR."
      },
      {
        "id": "wc_g8_m_03",
        "availableLetters": [
          "L",
          "O",
          "Y",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "LOYAL",
            "turkishMeaning": "Sadık"
          },
          {
            "word": "ALLOY",
            "turkishMeaning": "Alaşım"
          },
          {
            "word": "ALLY",
            "turkishMeaning": "Müttefik"
          },
          {
            "word": "ALL",
            "turkishMeaning": "Hepsi"
          }
        ],
        "category": "Friendship",
        "theme": "Fidelity",
        "explanation": "Connect letters L, O, Y, A, L to form: LOYAL, ALLOY, ALLY, ALL."
      },
      {
        "id": "wc_g8_m_04",
        "availableLetters": [
          "V",
          "O",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "VOICE",
            "turkishMeaning": "Ses"
          },
          {
            "word": "VICE",
            "turkishMeaning": "Kusur"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          },
          {
            "word": "VIE",
            "turkishMeaning": "Yarışmak"
          }
        ],
        "category": "On The Phone",
        "theme": "Call Voice",
        "explanation": "Connect letters V, O, I, C, E to form: VOICE, VICE, ICE, VIE."
      },
      {
        "id": "wc_g8_m_05",
        "availableLetters": [
          "S",
          "L",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "SLICE",
            "turkishMeaning": "Dilimlemek"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          },
          {
            "word": "LIE",
            "turkishMeaning": "Yalan"
          },
          {
            "word": "SIC",
            "turkishMeaning": "Aynen"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Cutting",
        "explanation": "Connect letters S, L, I, C, E to form: SLICE, ICE, LIE, SIC."
      },
      {
        "id": "wc_g8_m_06",
        "availableLetters": [
          "R",
          "O",
          "A",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "ROAST",
            "turkishMeaning": "Kızartmak"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Sıralamak"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "OAR",
            "turkishMeaning": "Kürek"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Roasting",
        "explanation": "Connect letters R, O, A, S, T to form: ROAST, SORT, STAR, OAR, ROT."
      },
      {
        "id": "wc_g8_m_07",
        "availableLetters": [
          "G",
          "R",
          "I",
          "L",
          "L"
        ],
        "targetWords": [
          {
            "word": "GRILL",
            "turkishMeaning": "Izgara"
          },
          {
            "word": "GIRL",
            "turkishMeaning": "Kız"
          },
          {
            "word": "RIG",
            "turkishMeaning": "Donatmak"
          },
          {
            "word": "ILL",
            "turkishMeaning": "Hasta"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Grilling",
        "explanation": "Connect letters G, R, I, L, L to form: GRILL, GIRL, RIG, ILL."
      },
      {
        "id": "wc_g8_m_08",
        "availableLetters": [
          "S",
          "P",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "SPICE",
            "turkishMeaning": "Baharat"
          },
          {
            "word": "EPIC",
            "turkishMeaning": "Destansı"
          },
          {
            "word": "PIE",
            "turkishMeaning": "Turta"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          },
          {
            "word": "SIP",
            "turkishMeaning": "Yudumlamak"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Spices",
        "explanation": "Connect letters S, P, I, C, E to form: SPICE, EPIC, PIE, ICE, SIP."
      },
      {
        "id": "wc_g8_m_09",
        "availableLetters": [
          "F",
          "L",
          "O",
          "U",
          "R"
        ],
        "targetWords": [
          {
            "word": "FLOUR",
            "turkishMeaning": "Un"
          },
          {
            "word": "FOUR",
            "turkishMeaning": "Dört"
          },
          {
            "word": "FOUL",
            "turkishMeaning": "Kötü"
          },
          {
            "word": "FOR",
            "turkishMeaning": "İçin"
          },
          {
            "word": "OUR",
            "turkishMeaning": "Bizim"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Pastry",
        "explanation": "Connect letters F, L, O, U, R to form: FLOUR, FOUR, FOUL, FOR, OUR."
      },
      {
        "id": "wc_g8_m_10",
        "availableLetters": [
          "D",
          "O",
          "U",
          "G",
          "H"
        ],
        "targetWords": [
          {
            "word": "DOUGH",
            "turkishMeaning": "Hamur"
          },
          {
            "word": "HUG",
            "turkishMeaning": "Kucaklamak"
          },
          {
            "word": "DUG",
            "turkishMeaning": "Kazdı"
          },
          {
            "word": "GOD",
            "turkishMeaning": "Tanrı"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Kneading Dough",
        "explanation": "Connect letters D, O, U, G, H to form: DOUGH, HUG, DUG, GOD."
      },
      {
        "id": "wc_g8_m_11",
        "availableLetters": [
          "S",
          "P",
          "E",
          "A",
          "K"
        ],
        "targetWords": [
          {
            "word": "SPEAK",
            "turkishMeaning": "Konuşmak"
          },
          {
            "word": "PEAK",
            "turkishMeaning": "Zirve"
          },
          {
            "word": "PEA",
            "turkishMeaning": "Bezelye"
          },
          {
            "word": "APE",
            "turkishMeaning": "Maymun"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          }
        ],
        "category": "On The Phone",
        "theme": "Speech",
        "explanation": "Connect letters S, P, E, A, K to form: SPEAK, PEAK, PEA, APE, SEA."
      },
      {
        "id": "wc_g8_m_12",
        "availableLetters": [
          "P",
          "H",
          "O",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "PHONE",
            "turkishMeaning": "Telefon"
          },
          {
            "word": "HOPE",
            "turkishMeaning": "Umut"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "HEN",
            "turkishMeaning": "Tavuk"
          },
          {
            "word": "PEN",
            "turkishMeaning": "Kalem"
          }
        ],
        "category": "On The Phone",
        "theme": "Mobile",
        "explanation": "Connect letters P, H, O, N, E to form: PHONE, HOPE, ONE, HEN, PEN."
      },
      {
        "id": "wc_g8_m_13",
        "availableLetters": [
          "C",
          "L",
          "I",
          "C",
          "K",
          "S"
        ],
        "targetWords": [
          {
            "word": "CLICK",
            "turkishMeaning": "Tıklamak"
          },
          {
            "word": "CLICKS",
            "turkishMeaning": "Tıklamalar"
          },
          {
            "word": "LICK",
            "turkishMeaning": "Yalamak"
          },
          {
            "word": "SICK",
            "turkishMeaning": "Hasta"
          }
        ],
        "category": "The Internet",
        "theme": "Web Click",
        "explanation": "Connect letters C, L, I, C, K, S to form: CLICK, CLICKS, LICK, SICK."
      },
      {
        "id": "wc_g8_m_14",
        "availableLetters": [
          "C",
          "L",
          "I",
          "M",
          "B",
          "S"
        ],
        "targetWords": [
          {
            "word": "CLIMB",
            "turkishMeaning": "Tırmanmak"
          },
          {
            "word": "CLIMBS",
            "turkishMeaning": "Tırmanışlar"
          },
          {
            "word": "LIMB",
            "turkishMeaning": "Uzuv"
          },
          {
            "word": "SLIM",
            "turkishMeaning": "İnce"
          }
        ],
        "category": "Adventures",
        "theme": "Cliffs",
        "explanation": "Connect letters C, L, I, M, B, S to form: CLIMB, CLIMBS, LIMB, SLIM."
      },
      {
        "id": "wc_g8_m_15",
        "availableLetters": [
          "S",
          "C",
          "U",
          "B",
          "A"
        ],
        "targetWords": [
          {
            "word": "SCUBA",
            "turkishMeaning": "Tüplü dalış"
          },
          {
            "word": "CUBA",
            "turkishMeaning": "Küba"
          },
          {
            "word": "CAB",
            "turkishMeaning": "Taksi"
          },
          {
            "word": "BUS",
            "turkishMeaning": "Otobüs"
          }
        ],
        "category": "Adventures",
        "theme": "Reefs",
        "explanation": "Connect letters S, C, U, B, A to form: SCUBA, CUBA, CAB, BUS."
      },
      {
        "id": "wc_g8_m_16",
        "availableLetters": [
          "B",
          "E",
          "A",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "BEACH",
            "turkishMeaning": "Plaj"
          },
          {
            "word": "EACH",
            "turkishMeaning": "Her biri"
          },
          {
            "word": "ACHE",
            "turkishMeaning": "Ağrı"
          },
          {
            "word": "CAB",
            "turkishMeaning": "Taksi"
          }
        ],
        "category": "Tourism",
        "theme": "Coastline",
        "explanation": "Connect letters B, E, A, C, H to form: BEACH, EACH, ACHE, CAB."
      },
      {
        "id": "wc_g8_m_17",
        "availableLetters": [
          "G",
          "U",
          "I",
          "D",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "GUIDES",
            "turkishMeaning": "Rehberler"
          },
          {
            "word": "GUIDE",
            "turkishMeaning": "Rehber"
          },
          {
            "word": "SIDE",
            "turkishMeaning": "Taraf, yan"
          },
          {
            "word": "DIG",
            "turkishMeaning": "Kazmak"
          },
          {
            "word": "DUE",
            "turkishMeaning": "Vadesi gelen / bağlı"
          }
        ],
        "category": "Tourism",
        "theme": "Tour Guides",
        "explanation": "Connect letters G, U, I, D, E, S to form: GUIDES, GUIDE, SIDE, DIG, DUE.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_m_18",
        "availableLetters": [
          "C",
          "O",
          "A",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "COAST",
            "turkishMeaning": "Sahil"
          },
          {
            "word": "COAT",
            "turkishMeaning": "Palto"
          },
          {
            "word": "CAST",
            "turkishMeaning": "Kadro"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          },
          {
            "word": "ACT",
            "turkishMeaning": "Eylem"
          }
        ],
        "category": "Tourism",
        "theme": "Shore",
        "explanation": "Connect letters C, O, A, S, T to form: COAST, COAT, CAST, CAT, ACT."
      },
      {
        "id": "wc_g8_m_19",
        "availableLetters": [
          "R",
          "E",
          "C",
          "I",
          "P",
          "E"
        ],
        "targetWords": [
          {
            "word": "RECIPE",
            "turkishMeaning": "Yemek tarifi"
          },
          {
            "word": "PIECE",
            "turkishMeaning": "Parça, dilim"
          },
          {
            "word": "RIPE",
            "turkishMeaning": "Olgun meyve"
          },
          {
            "word": "PRICE",
            "turkishMeaning": "Fiyat"
          },
          {
            "word": "PIE",
            "turkishMeaning": "Turta"
          }
        ],
        "category": "In the Kitchen",
        "theme": "Secret Recipe",
        "explanation": "Connect letters R, E, C, I, P, E to form: RECIPE, PIECE, RIPE, PRICE, PIE.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_m_20",
        "availableLetters": [
          "S",
          "I",
          "G",
          "H",
          "T"
        ],
        "targetWords": [
          {
            "word": "SIGHT",
            "turkishMeaning": "Görüş"
          },
          {
            "word": "THIS",
            "turkishMeaning": "Bu"
          },
          {
            "word": "HIT",
            "turkishMeaning": "Vurmak"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          }
        ],
        "category": "Tourism",
        "theme": "Attractions",
        "explanation": "Connect letters S, I, G, H, T to form: SIGHT, THIS, HIT, SIT."
      },
      {
        "id": "wc_g8_m_21",
        "availableLetters": [
          "V",
          "I",
          "S",
          "I",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "VISIT",
            "turkishMeaning": "Ziyaret"
          },
          {
            "word": "VISITS",
            "turkishMeaning": "Ziyaretler"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          },
          {
            "word": "ITS",
            "turkishMeaning": "Onun"
          }
        ],
        "category": "Tourism",
        "theme": "Ruins",
        "explanation": "Connect letters V, I, S, I, T, S to form: VISIT, VISITS, SIT, ITS."
      },
      {
        "id": "wc_g8_m_22",
        "availableLetters": [
          "S",
          "W",
          "E",
          "E",
          "P"
        ],
        "targetWords": [
          {
            "word": "SWEEP",
            "turkishMeaning": "Süpürmek"
          },
          {
            "word": "WEEP",
            "turkishMeaning": "Ağlamak"
          },
          {
            "word": "SEEP",
            "turkishMeaning": "Sızmak"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Chores",
        "theme": "Broom Sweep",
        "explanation": "Connect letters S, W, E, E, P to form: SWEEP, WEEP, SEEP, SEE."
      },
      {
        "id": "wc_g8_m_23",
        "availableLetters": [
          "C",
          "H",
          "O",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "CHORE",
            "turkishMeaning": "Ev işi"
          },
          {
            "word": "ECHO",
            "turkishMeaning": "Yankı"
          },
          {
            "word": "HERO",
            "turkishMeaning": "Kahraman"
          },
          {
            "word": "CORE",
            "turkishMeaning": "Çekirdek"
          },
          {
            "word": "HER",
            "turkishMeaning": "Onun"
          }
        ],
        "category": "Chores",
        "theme": "Tasks",
        "explanation": "Connect letters C, H, O, R, E to form: CHORE, ECHO, HERO, CORE, HER."
      },
      {
        "id": "wc_g8_m_24",
        "availableLetters": [
          "R",
          "O",
          "B",
          "O",
          "T"
        ],
        "targetWords": [
          {
            "word": "ROBOT",
            "turkishMeaning": "Robot"
          },
          {
            "word": "BOOT",
            "turkishMeaning": "Çizme"
          },
          {
            "word": "ROOT",
            "turkishMeaning": "Kök"
          },
          {
            "word": "TOO",
            "turkishMeaning": "Aşırı"
          },
          {
            "word": "ROT",
            "turkishMeaning": "Çürümek"
          }
        ],
        "category": "Science",
        "theme": "Robotics",
        "explanation": "Connect letters R, O, B, O, T to form: ROBOT, BOOT, ROOT, TOO, ROT."
      },
      {
        "id": "wc_g8_m_25",
        "availableLetters": [
          "L",
          "A",
          "S",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "LASER",
            "turkishMeaning": "Lazer"
          },
          {
            "word": "EARL",
            "turkishMeaning": "Kont"
          },
          {
            "word": "REAL",
            "turkishMeaning": "Gerçek"
          },
          {
            "word": "SALE",
            "turkishMeaning": "Satış"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Science",
        "theme": "Optics",
        "explanation": "Connect letters L, A, S, E, R to form: LASER, EARL, REAL, SALE, EAR."
      },
      {
        "id": "wc_g8_m_26",
        "availableLetters": [
          "S",
          "T",
          "O",
          "R",
          "M",
          "Y"
        ],
        "targetWords": [
          {
            "word": "STORMY",
            "turkishMeaning": "Fırtınalı"
          },
          {
            "word": "STORM",
            "turkishMeaning": "Fırtına"
          },
          {
            "word": "STORY",
            "turkishMeaning": "Hikaye"
          },
          {
            "word": "MOST",
            "turkishMeaning": "En çok"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Sıralamak / tür"
          }
        ],
        "category": "Natural Forces",
        "theme": "Stormy Weather",
        "explanation": "Connect letters S, T, O, R, M, Y to form: STORMY, STORM, STORY, MOST, SORT.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_m_27",
        "availableLetters": [
          "Q",
          "U",
          "A",
          "K",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "QUAKE",
            "turkishMeaning": "Deprem"
          },
          {
            "word": "QUAKES",
            "turkishMeaning": "Depremler"
          },
          {
            "word": "SAKE",
            "turkishMeaning": "Uğruna"
          },
          {
            "word": "ASK",
            "turkishMeaning": "Sormak"
          }
        ],
        "category": "Natural Forces",
        "theme": "Earthquakes",
        "explanation": "Connect letters Q, U, A, K, E, S to form: QUAKE, QUAKES, SAKE, ASK."
      },
      {
        "id": "wc_g8_m_28",
        "availableLetters": [
          "A",
          "S",
          "H",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "ASHES",
            "turkishMeaning": "Küller"
          },
          {
            "word": "SHE",
            "turkishMeaning": "O kadın"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          }
        ],
        "category": "Natural Forces",
        "theme": "Volcano",
        "explanation": "Connect letters A, S, H, E, S to form: ASHES, SHE, SEA, ASH."
      },
      {
        "id": "wc_g8_m_29",
        "availableLetters": [
          "R",
          "A",
          "D",
          "A",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "RADAR",
            "turkishMeaning": "Radar"
          },
          {
            "word": "RADARS",
            "turkishMeaning": "Radarlar"
          },
          {
            "word": "SAD",
            "turkishMeaning": "Üzgün"
          },
          {
            "word": "RAD",
            "turkishMeaning": "Harika"
          }
        ],
        "category": "Natural Forces",
        "theme": "Doppler",
        "explanation": "Connect letters R, A, D, A, R, S to form: RADAR, RADARS, SAD, RAD."
      },
      {
        "id": "wc_g8_m_30",
        "availableLetters": [
          "S",
          "P",
          "E",
          "E",
          "D"
        ],
        "targetWords": [
          {
            "word": "SPEED",
            "turkishMeaning": "Hız"
          },
          {
            "word": "DEEP",
            "turkishMeaning": "Derin"
          },
          {
            "word": "SEED",
            "turkishMeaning": "Tohum"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Natural Forces",
        "theme": "Gale",
        "explanation": "Connect letters S, P, E, E, D to form: SPEED, DEEP, SEED, SEE."
      },
      {
        "id": "wc_g8_m_31",
        "availableLetters": [
          "C",
          "R",
          "A",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "CRASH",
            "turkishMeaning": "Çarpışma"
          },
          {
            "word": "CASH",
            "turkishMeaning": "Nakit"
          },
          {
            "word": "ARCH",
            "turkishMeaning": "Kemer"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          }
        ],
        "category": "Natural Forces",
        "theme": "Collision",
        "explanation": "Connect letters C, R, A, S, H to form: CRASH, CASH, ARCH, CAR, ASH."
      },
      {
        "id": "wc_g8_m_32",
        "availableLetters": [
          "F",
          "O",
          "R",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "FORCE",
            "turkishMeaning": "Kuvvet"
          },
          {
            "word": "CORE",
            "turkishMeaning": "Çekirdek"
          },
          {
            "word": "FORE",
            "turkishMeaning": "Ön"
          },
          {
            "word": "FOR",
            "turkishMeaning": "İçin"
          }
        ],
        "category": "Natural Forces",
        "theme": "Power",
        "explanation": "Connect letters F, O, R, C, E to form: FORCE, CORE, FORE, FOR."
      },
      {
        "id": "wc_g8_m_33",
        "availableLetters": [
          "A",
          "L",
          "I",
          "E",
          "N"
        ],
        "targetWords": [
          {
            "word": "ALIEN",
            "turkishMeaning": "Uzaylı"
          },
          {
            "word": "LINE",
            "turkishMeaning": "Çizgi"
          },
          {
            "word": "LANE",
            "turkishMeaning": "Şerit"
          },
          {
            "word": "LIE",
            "turkishMeaning": "Yalan"
          },
          {
            "word": "ALE",
            "turkishMeaning": "Bira"
          }
        ],
        "category": "Science",
        "theme": "Alien",
        "explanation": "Connect letters A, L, I, E, N to form: ALIEN, LINE, LANE, LIE, ALE."
      },
      {
        "id": "wc_g8_m_34",
        "availableLetters": [
          "S",
          "C",
          "A",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "SCALE",
            "turkishMeaning": "Ölçek"
          },
          {
            "word": "SALE",
            "turkishMeaning": "Satış"
          },
          {
            "word": "CASE",
            "turkishMeaning": "Dava"
          },
          {
            "word": "LACE",
            "turkishMeaning": "Dantel"
          },
          {
            "word": "ALE",
            "turkishMeaning": "Bira"
          }
        ],
        "category": "Science",
        "theme": "Magnitude",
        "explanation": "Connect letters S, C, A, L, E to form: SCALE, SALE, CASE, LACE, ALE."
      },
      {
        "id": "wc_g8_m_35",
        "availableLetters": [
          "P",
          "R",
          "E",
          "S",
          "S",
          "Y"
        ],
        "targetWords": [
          {
            "word": "PRESS",
            "turkishMeaning": "Basmak"
          },
          {
            "word": "PREY",
            "turkishMeaning": "Av"
          },
          {
            "word": "SPY",
            "turkishMeaning": "Casus"
          },
          {
            "word": "YES",
            "turkishMeaning": "Evet"
          }
        ],
        "category": "Science",
        "theme": "Press",
        "explanation": "Connect letters P, R, E, S, S, Y to form: PRESS, PREY, SPY, YES."
      },
      {
        "id": "wc_g8_m_36",
        "availableLetters": [
          "T",
          "E",
          "N",
          "S",
          "E"
        ],
        "targetWords": [
          {
            "word": "TENSE",
            "turkishMeaning": "Zaman kipi"
          },
          {
            "word": "SEEN",
            "turkishMeaning": "Görülmüş"
          },
          {
            "word": "SENT",
            "turkishMeaning": "Gönderdi"
          },
          {
            "word": "NET",
            "turkishMeaning": "File"
          },
          {
            "word": "SET",
            "turkishMeaning": "Kurmak"
          }
        ],
        "category": "Teen Life",
        "theme": "Grammar",
        "explanation": "Connect letters T, E, N, S, E to form: TENSE, SEEN, SENT, NET, SET."
      },
      {
        "id": "wc_g8_m_37",
        "availableLetters": [
          "P",
          "L",
          "A",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "PLATE",
            "turkishMeaning": "Levha"
          },
          {
            "word": "PLEAT",
            "turkishMeaning": "Pile"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "TALE",
            "turkishMeaning": "Masal"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "Natural Forces",
        "theme": "Tectonics",
        "explanation": "Connect letters P, L, A, T, E to form: PLATE, PLEAT, LATE, TALE, TEA."
      },
      {
        "id": "wc_g8_m_38",
        "availableLetters": [
          "C",
          "L",
          "O",
          "T",
          "H"
        ],
        "targetWords": [
          {
            "word": "CLOTH",
            "turkishMeaning": "Kumaş"
          },
          {
            "word": "COLT",
            "turkishMeaning": "Tay"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          },
          {
            "word": "LOT",
            "turkishMeaning": "Çok"
          }
        ],
        "category": "Chores",
        "theme": "Dust Cloth",
        "explanation": "Connect letters C, L, O, T, H to form: CLOTH, COLT, HOT, LOT."
      },
      {
        "id": "wc_g8_m_39",
        "availableLetters": [
          "T",
          "R",
          "U",
          "T",
          "H",
          "S"
        ],
        "targetWords": [
          {
            "word": "TRUTH",
            "turkishMeaning": "Hakikat"
          },
          {
            "word": "TRUTHS",
            "turkishMeaning": "Hakikatler"
          },
          {
            "word": "HURT",
            "turkishMeaning": "İncitmek"
          },
          {
            "word": "HUT",
            "turkishMeaning": "Kulübe"
          }
        ],
        "category": "Friendship",
        "theme": "Sincerity",
        "explanation": "Connect letters T, R, U, T, H, S to form: TRUTH, TRUTHS, HURT, HUT."
      },
      {
        "id": "wc_g8_m_40",
        "availableLetters": [
          "S",
          "P",
          "O",
          "O",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "SPOON",
            "turkishMeaning": "Kaşık"
          },
          {
            "word": "SPOONS",
            "turkishMeaning": "Kaşıklar"
          },
          {
            "word": "SOON",
            "turkishMeaning": "Yakında"
          },
          {
            "word": "SON",
            "turkishMeaning": "Oğul"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Silverware",
        "explanation": "Connect letters S, P, O, O, N, S to form: SPOON, SPOONS, SOON, SON."
      },
      {
        "id": "wc_g8_m_41",
        "availableLetters": [
          "L",
          "O",
          "Y",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "LOYAL",
            "turkishMeaning": "Sadık"
          },
          {
            "word": "ALLOY",
            "turkishMeaning": "Alaşım"
          },
          {
            "word": "LAY",
            "turkishMeaning": "Sermek"
          }
        ],
        "category": "Friendship",
        "theme": "Steadfast Friends",
        "explanation": "Connect letters L, O, Y, A, L to form: LOYAL, ALLOY, LAY."
      },
      {
        "id": "wc_g8_m_42",
        "availableLetters": [
          "S",
          "H",
          "A",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "SHARE",
            "turkishMeaning": "Paylaşmak"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "HARE",
            "turkishMeaning": "Tavşan"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          }
        ],
        "category": "Friendship",
        "theme": "Open Dialogue",
        "explanation": "Connect letters S, H, A, R, E to form: SHARE, HEAR, HARE, EAR, ASH."
      },
      {
        "id": "wc_g8_m_43",
        "availableLetters": [
          "T",
          "R",
          "U",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "TRUST",
            "turkishMeaning": "Güven"
          },
          {
            "word": "RUST",
            "turkishMeaning": "Pas"
          }
        ],
        "category": "Friendship",
        "theme": "Honesty",
        "explanation": "Connect letters T, R, U, S, T to form: TRUST, RUST."
      },
      {
        "id": "wc_g8_m_44",
        "availableLetters": [
          "T",
          "R",
          "E",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "TREND",
            "turkishMeaning": "Akım"
          },
          {
            "word": "RENT",
            "turkishMeaning": "Kira"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          },
          {
            "word": "END",
            "turkishMeaning": "Son"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Teen Life",
        "theme": "Fashion Directions",
        "explanation": "Connect letters T, R, E, N, D to form: TREND, RENT, RED, END, NET."
      },
      {
        "id": "wc_g8_m_45",
        "availableLetters": [
          "H",
          "A",
          "B",
          "I",
          "T"
        ],
        "targetWords": [
          {
            "word": "HABIT",
            "turkishMeaning": "Alışkanlık"
          },
          {
            "word": "BAIT",
            "turkishMeaning": "Yem"
          },
          {
            "word": "BATH",
            "turkishMeaning": "Banyo"
          },
          {
            "word": "BAT",
            "turkishMeaning": "Yarasa"
          },
          {
            "word": "HAT",
            "turkishMeaning": "Şapka"
          },
          {
            "word": "BIT",
            "turkishMeaning": "Parça"
          }
        ],
        "category": "Teen Life",
        "theme": "Daily Routines",
        "explanation": "Connect letters H, A, B, I, T to form: HABIT, BAIT, BATH, BAT, HAT, BIT."
      },
      {
        "id": "wc_g8_m_46",
        "availableLetters": [
          "P",
          "H",
          "O",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "PHONE",
            "turkishMeaning": "Telefon"
          },
          {
            "word": "HOPE",
            "turkishMeaning": "Umut"
          },
          {
            "word": "OPEN",
            "turkishMeaning": "Açık"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "HEN",
            "turkishMeaning": "Tavuk"
          },
          {
            "word": "PEN",
            "turkishMeaning": "Kalem"
          }
        ],
        "category": "Phone",
        "theme": "Voice Relays",
        "explanation": "Connect letters P, H, O, N, E to form: PHONE, HOPE, OPEN, ONE, HEN, PEN."
      },
      {
        "id": "wc_g8_m_47",
        "availableLetters": [
          "R",
          "E",
          "P",
          "L",
          "Y"
        ],
        "targetWords": [
          {
            "word": "REPLY",
            "turkishMeaning": "Cevap"
          },
          {
            "word": "PLY",
            "turkishMeaning": "Kat"
          }
        ],
        "category": "Phone",
        "theme": "Text Answers",
        "explanation": "Connect letters R, E, P, L, Y to form: REPLY, PLY."
      },
      {
        "id": "wc_g8_m_48",
        "availableLetters": [
          "V",
          "O",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "VOICE",
            "turkishMeaning": "Ses"
          },
          {
            "word": "VICE",
            "turkishMeaning": "Kusur"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          }
        ],
        "category": "Phone",
        "theme": "Spoken Tone",
        "explanation": "Connect letters V, O, I, C, E to form: VOICE, VICE, ICE."
      },
      {
        "id": "wc_g8_m_49",
        "availableLetters": [
          "I",
          "N",
          "B",
          "O",
          "X"
        ],
        "targetWords": [
          {
            "word": "INBOX",
            "turkishMeaning": "Gelen kutusu"
          },
          {
            "word": "BOX",
            "turkishMeaning": "Kutu"
          },
          {
            "word": "NIX",
            "turkishMeaning": "İptal"
          }
        ],
        "category": "Internet",
        "theme": "Email Inboxes",
        "explanation": "Connect letters I, N, B, O, X to form: INBOX, BOX, NIX."
      },
      {
        "id": "wc_g8_m_50",
        "availableLetters": [
          "S",
          "P",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "SPICE",
            "turkishMeaning": "Baharat"
          },
          {
            "word": "EPIC",
            "turkishMeaning": "Destansı"
          },
          {
            "word": "PIES",
            "turkishMeaning": "Turtalar"
          },
          {
            "word": "PIE",
            "turkishMeaning": "Turta"
          },
          {
            "word": "SIP",
            "turkishMeaning": "Yudum"
          }
        ],
        "category": "Kitchen",
        "theme": "Culinary Seasoning",
        "explanation": "Connect letters S, P, I, C, E to form: SPICE, EPIC, PIES, PIE, SIP."
      },
      {
        "id": "wc_g8_m_51",
        "availableLetters": [
          "G",
          "R",
          "I",
          "L",
          "L"
        ],
        "targetWords": [
          {
            "word": "GRILL",
            "turkishMeaning": "Izgara"
          },
          {
            "word": "GIRL",
            "turkishMeaning": "Kız"
          },
          {
            "word": "ILL",
            "turkishMeaning": "Hasta"
          }
        ],
        "category": "Kitchen",
        "theme": "Charcoal Grilling",
        "explanation": "Connect letters G, R, I, L, L to form: GRILL, GIRL, ILL."
      },
      {
        "id": "wc_g8_m_52",
        "availableLetters": [
          "R",
          "O",
          "A",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "ROAST",
            "turkishMeaning": "Fırın kızartma"
          },
          {
            "word": "STAR",
            "turkishMeaning": "Yıldız"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Tür"
          },
          {
            "word": "OATS",
            "turkishMeaning": "Yulaf"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          },
          {
            "word": "OAT",
            "turkishMeaning": "Yulaf"
          }
        ],
        "category": "Kitchen",
        "theme": "Oven Roasting",
        "explanation": "Connect letters R, O, A, S, T to form: ROAST, STAR, SORT, OATS, ART, OAT."
      },
      {
        "id": "wc_g8_m_53",
        "availableLetters": [
          "S",
          "L",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "SLICE",
            "turkishMeaning": "Dilim"
          },
          {
            "word": "LICE",
            "turkishMeaning": "Bitler"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          }
        ],
        "category": "Kitchen",
        "theme": "Bread Slices",
        "explanation": "Connect letters S, L, I, C, E to form: SLICE, LICE, ICE."
      },
      {
        "id": "wc_g8_m_54",
        "availableLetters": [
          "D",
          "R",
          "A",
          "I",
          "N"
        ],
        "targetWords": [
          {
            "word": "DRAIN",
            "turkishMeaning": "Süzmek"
          },
          {
            "word": "RAIN",
            "turkishMeaning": "Yağmur"
          },
          {
            "word": "RAID",
            "turkishMeaning": "Baskın"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          },
          {
            "word": "AID",
            "turkishMeaning": "Yardım"
          }
        ],
        "category": "Kitchen",
        "theme": "Colander Draining",
        "explanation": "Connect letters D, R, A, I, N to form: DRAIN, RAIN, RAID, AIR, AID."
      },
      {
        "id": "wc_g8_m_55",
        "availableLetters": [
          "T",
          "A",
          "S",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "TASTE",
            "turkishMeaning": "Tat"
          },
          {
            "word": "STATE",
            "turkishMeaning": "Durum"
          },
          {
            "word": "SEAT",
            "turkishMeaning": "Koltuk"
          },
          {
            "word": "EAST",
            "turkishMeaning": "Doğu"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "Kitchen",
        "theme": "Flavor Profiles",
        "explanation": "Connect letters T, A, S, T, E to form: TASTE, STATE, SEAT, EAST, SET, TEA."
      },
      {
        "id": "wc_g8_m_56",
        "availableLetters": [
          "S",
          "P",
          "O",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "SPOON",
            "turkishMeaning": "Kaşık"
          },
          {
            "word": "SOON",
            "turkishMeaning": "Yakında"
          }
        ],
        "category": "Kitchen",
        "theme": "Soup Spoons",
        "explanation": "Connect letters S, P, O, O, N to form: SPOON, SOON."
      },
      {
        "id": "wc_g8_m_57",
        "availableLetters": [
          "P",
          "L",
          "A",
          "T",
          "E"
        ],
        "targetWords": [
          {
            "word": "PLATE",
            "turkishMeaning": "Tabak"
          },
          {
            "word": "PLEAT",
            "turkishMeaning": "Pile"
          },
          {
            "word": "LEAP",
            "turkishMeaning": "Sıçramak"
          },
          {
            "word": "PALE",
            "turkishMeaning": "Solgun"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "TAP",
            "turkishMeaning": "Musluk"
          }
        ],
        "category": "Kitchen",
        "theme": "Dinnerware",
        "explanation": "Connect letters P, L, A, T, E to form: PLATE, PLEAT, LEAP, PALE, LATE, TAP."
      },
      {
        "id": "wc_g8_m_58",
        "availableLetters": [
          "K",
          "N",
          "I",
          "F",
          "E"
        ],
        "targetWords": [
          {
            "word": "KNIFE",
            "turkishMeaning": "Bıçak"
          },
          {
            "word": "FINE",
            "turkishMeaning": "Güzel"
          },
          {
            "word": "INK",
            "turkishMeaning": "Mürekkep"
          }
        ],
        "category": "Kitchen",
        "theme": "Cutlery",
        "explanation": "Connect letters K, N, I, F, E to form: KNIFE, FINE, INK."
      },
      {
        "id": "wc_g8_m_59",
        "availableLetters": [
          "C",
          "A",
          "B",
          "I",
          "N"
        ],
        "targetWords": [
          {
            "word": "CABIN",
            "turkishMeaning": "Kulübe"
          },
          {
            "word": "CAN",
            "turkishMeaning": "Kutu"
          },
          {
            "word": "BAN",
            "turkishMeaning": "Yasak"
          }
        ],
        "category": "Adventures",
        "theme": "Forest Shelters",
        "explanation": "Connect letters C, A, B, I, N to form: CABIN, CAN, BAN."
      },
      {
        "id": "wc_g8_m_60",
        "availableLetters": [
          "K",
          "A",
          "Y",
          "A",
          "K"
        ],
        "targetWords": [
          {
            "word": "KAYAK",
            "turkishMeaning": "Kano"
          },
          {
            "word": "YAK",
            "turkishMeaning": "Tibet öküzü"
          }
        ],
        "category": "Adventures",
        "theme": "River Watercraft",
        "explanation": "Connect letters K, A, Y, A, K to form: KAYAK, YAK."
      },
      {
        "id": "wc_g8_m_61",
        "availableLetters": [
          "C",
          "L",
          "I",
          "M",
          "B"
        ],
        "targetWords": [
          {
            "word": "CLIMB",
            "turkishMeaning": "Tırmanmak"
          }
        ],
        "category": "Adventures",
        "theme": "Rock Ascent",
        "explanation": "Connect letters C, L, I, M, B to form: CLIMB."
      },
      {
        "id": "wc_g8_m_62",
        "availableLetters": [
          "B",
          "E",
          "A",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "BEACH",
            "turkishMeaning": "Plaj"
          },
          {
            "word": "EACH",
            "turkishMeaning": "Her biri"
          },
          {
            "word": "ACHE",
            "turkishMeaning": "Ağrı"
          }
        ],
        "category": "Tourism",
        "theme": "Coastal Shores",
        "explanation": "Connect letters B, E, A, C, H to form: BEACH, EACH, ACHE."
      },
      {
        "id": "wc_g8_m_63",
        "availableLetters": [
          "G",
          "U",
          "I",
          "D",
          "E"
        ],
        "targetWords": [
          {
            "word": "GUIDE",
            "turkishMeaning": "Rehber"
          },
          {
            "word": "DIG",
            "turkishMeaning": "Kazmak"
          },
          {
            "word": "DUE",
            "turkishMeaning": "Vadesi gelmiş"
          }
        ],
        "category": "Tourism",
        "theme": "Tour Leaders",
        "explanation": "Connect letters G, U, I, D, E to form: GUIDE, DIG, DUE."
      },
      {
        "id": "wc_g8_m_64",
        "availableLetters": [
          "R",
          "E",
          "S",
          "O",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "RESORT",
            "turkishMeaning": "Tatil yeri"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenme"
          },
          {
            "word": "SORE",
            "turkishMeaning": "Yara"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          }
        ],
        "category": "Tourism",
        "theme": "Holiday Centres",
        "explanation": "Connect letters R, E, S, O, R, T to form: RESORT, ROSE, REST, SORE, SET."
      },
      {
        "id": "wc_g8_m_65",
        "availableLetters": [
          "C",
          "H",
          "O",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "CHORE",
            "turkishMeaning": "Ev işi"
          },
          {
            "word": "HERO",
            "turkishMeaning": "Kahraman"
          },
          {
            "word": "ECHO",
            "turkishMeaning": "Yankı"
          },
          {
            "word": "CORE",
            "turkishMeaning": "Çekirdek"
          }
        ],
        "category": "Chores",
        "theme": "Household Tasks",
        "explanation": "Connect letters C, H, O, R, E to form: CHORE, HERO, ECHO, CORE."
      },
      {
        "id": "wc_g8_m_66",
        "availableLetters": [
          "S",
          "W",
          "E",
          "E",
          "P"
        ],
        "targetWords": [
          {
            "word": "SWEEP",
            "turkishMeaning": "Süpürmek"
          },
          {
            "word": "WEEP",
            "turkishMeaning": "Ağlamak"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Chores",
        "theme": "Floor Cleaning",
        "explanation": "Connect letters S, W, E, E, P to form: SWEEP, WEEP, SEE."
      },
      {
        "id": "wc_g8_m_67",
        "availableLetters": [
          "S",
          "C",
          "R",
          "U",
          "B"
        ],
        "targetWords": [
          {
            "word": "SCRUB",
            "turkishMeaning": "Ovalamak"
          },
          {
            "word": "CURB",
            "turkishMeaning": "Kaldırım kenarı"
          },
          {
            "word": "RUB",
            "turkishMeaning": "Ovmak"
          }
        ],
        "category": "Chores",
        "theme": "Pot Cleaning",
        "explanation": "Connect letters S, C, R, U, B to form: SCRUB, CURB, RUB."
      },
      {
        "id": "wc_g8_m_68",
        "availableLetters": [
          "F",
          "O",
          "R",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "FORCE",
            "turkishMeaning": "Kuvvet"
          },
          {
            "word": "CORE",
            "turkishMeaning": "Çekirdek"
          },
          {
            "word": "FORE",
            "turkishMeaning": "Ön"
          }
        ],
        "category": "Science",
        "theme": "Physical Mechanics",
        "explanation": "Connect letters F, O, R, C, E to form: FORCE, CORE, FORE."
      },
      {
        "id": "wc_g8_m_69",
        "availableLetters": [
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        "targetWords": [
          {
            "word": "LIGHT",
            "turkishMeaning": "Işık"
          },
          {
            "word": "HIT",
            "turkishMeaning": "Vurmak"
          },
          {
            "word": "LIT",
            "turkishMeaning": "Aydınlandı"
          }
        ],
        "category": "Science",
        "theme": "Optics",
        "explanation": "Connect letters L, I, G, H, T to form: LIGHT, HIT, LIT."
      },
      {
        "id": "wc_g8_m_70",
        "availableLetters": [
          "R",
          "A",
          "D",
          "A",
          "R"
        ],
        "targetWords": [
          {
            "word": "RADAR",
            "turkishMeaning": "Radar"
          }
        ],
        "category": "Science",
        "theme": "Radio Detection",
        "explanation": "Connect letters R, A, D, A, R to form: RADAR."
      },
      {
        "id": "wc_g8_m_71",
        "availableLetters": [
          "S",
          "T",
          "E",
          "A",
          "M"
        ],
        "targetWords": [
          {
            "word": "STEAM",
            "turkishMeaning": "Buhar"
          },
          {
            "word": "MEAT",
            "turkishMeaning": "Et"
          },
          {
            "word": "TEAM",
            "turkishMeaning": "Takım"
          },
          {
            "word": "MATE",
            "turkishMeaning": "Dost"
          },
          {
            "word": "EAT",
            "turkishMeaning": "Yemek"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "Science",
        "theme": "Thermodynamics",
        "explanation": "Connect letters S, T, E, A, M to form: STEAM, MEAT, TEAM, MATE, EAT, TEA."
      },
      {
        "id": "wc_g8_m_72",
        "availableLetters": [
          "F",
          "L",
          "O",
          "O",
          "D"
        ],
        "targetWords": [
          {
            "word": "FLOOD",
            "turkishMeaning": "Sel"
          }
        ],
        "category": "Natural Forces",
        "theme": "Water Inundation",
        "explanation": "Connect letters F, L, O, O, D to form: FLOOD."
      },
      {
        "id": "wc_g8_m_73",
        "availableLetters": [
          "C",
          "R",
          "U",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "CRUST",
            "turkishMeaning": "Yer kabuğu"
          },
          {
            "word": "RUST",
            "turkishMeaning": "Pas"
          },
          {
            "word": "CUT",
            "turkishMeaning": "Kesmek"
          }
        ],
        "category": "Natural Forces",
        "theme": "Earth Layers",
        "explanation": "Connect letters C, R, U, S, T to form: CRUST, RUST, CUT."
      },
      {
        "id": "wc_g8_m_74",
        "availableLetters": [
          "F",
          "A",
          "U",
          "L",
          "T"
        ],
        "targetWords": [
          {
            "word": "FAULT",
            "turkishMeaning": "Fay hattı"
          },
          {
            "word": "FAT",
            "turkishMeaning": "Şişman"
          }
        ],
        "category": "Natural Forces",
        "theme": "Tectonic Breaks",
        "explanation": "Connect letters F, A, U, L, T to form: FAULT, FAT."
      },
      {
        "id": "wc_g8_m_75",
        "availableLetters": [
          "S",
          "M",
          "O",
          "K",
          "E"
        ],
        "targetWords": [
          {
            "word": "SMOKE",
            "turkishMeaning": "Duman"
          },
          {
            "word": "SOME",
            "turkishMeaning": "Bazı"
          }
        ],
        "category": "Natural Forces",
        "theme": "Volcanic Ash",
        "explanation": "Connect letters S, M, O, K, E to form: SMOKE, SOME."
      },
      {
        "id": "wc_g8_m_76",
        "availableLetters": [
          "S",
          "H",
          "A",
          "K",
          "E"
        ],
        "targetWords": [
          {
            "word": "SHAKE",
            "turkishMeaning": "Sallamak"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          },
          {
            "word": "ASK",
            "turkishMeaning": "Sormak"
          }
        ],
        "category": "Natural Forces",
        "theme": "Seismic Motion",
        "explanation": "Connect letters S, H, A, K, E to form: SHAKE, ASH, ASK."
      },
      {
        "id": "wc_g8_m_77",
        "availableLetters": [
          "Q",
          "U",
          "A",
          "K",
          "E"
        ],
        "targetWords": [
          {
            "word": "QUAKE",
            "turkishMeaning": "Deprem"
          }
        ],
        "category": "Natural Forces",
        "theme": "Ground Tremors",
        "explanation": "Connect letters Q, U, A, K, E to form: QUAKE."
      },
      {
        "id": "wc_g8_m_78",
        "availableLetters": [
          "G",
          "L",
          "O",
          "V",
          "E"
        ],
        "targetWords": [
          {
            "word": "GLOVE",
            "turkishMeaning": "Eldiven"
          },
          {
            "word": "LOVE",
            "turkishMeaning": "Sevgi"
          },
          {
            "word": "LOG",
            "turkishMeaning": "Kütük"
          }
        ],
        "category": "Chores & Safety",
        "theme": "Protective Gear",
        "explanation": "Connect letters G, L, O, V, E to form: GLOVE, LOVE, LOG."
      },
      {
        "id": "wc_g8_m_79",
        "availableLetters": [
          "P",
          "A",
          "S",
          "T",
          "A"
        ],
        "targetWords": [
          {
            "word": "PASTA",
            "turkishMeaning": "Makarna"
          },
          {
            "word": "PAST",
            "turkishMeaning": "Geçmiş"
          },
          {
            "word": "TAP",
            "turkishMeaning": "Musluk"
          },
          {
            "word": "PAT",
            "turkishMeaning": "Okşamak"
          }
        ],
        "category": "Kitchen",
        "theme": "Italian Cuisine",
        "explanation": "Connect letters P, A, S, T, A to form: PASTA, PAST, TAP, PAT."
      },
      {
        "id": "wc_g8_m_80",
        "availableLetters": [
          "F",
          "L",
          "A",
          "S",
          "H"
        ],
        "targetWords": [
          {
            "word": "FLASH",
            "turkishMeaning": "Şimşek / Flaş"
          },
          {
            "word": "HALF",
            "turkishMeaning": "Yarım"
          },
          {
            "word": "ASH",
            "turkishMeaning": "Kül"
          }
        ],
        "category": "Natural Forces",
        "theme": "Lightning",
        "explanation": "Connect letters F, L, A, S, H to form: FLASH, HALF, ASH."
      }
    ],
    "hard": [
      {
        "id": "wc_g8_h_01",
        "availableLetters": [
          "F",
          "R",
          "I",
          "E",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "FRIEND",
            "turkishMeaning": "Arkadaş"
          },
          {
            "word": "FINDER",
            "turkishMeaning": "Bulan"
          },
          {
            "word": "FIEND",
            "turkishMeaning": "Düşman"
          },
          {
            "word": "RIDE",
            "turkishMeaning": "Binmek"
          },
          {
            "word": "FIND",
            "turkishMeaning": "Bulmak"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Friendship",
        "theme": "True Companions",
        "explanation": "Connect letters F, R, I, E, N, D to form: FRIEND, FINDER, FIEND, RIDE, FIND, RED."
      },
      {
        "id": "wc_g8_h_02",
        "availableLetters": [
          "S",
          "E",
          "C",
          "R",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "SECRET",
            "turkishMeaning": "Sır"
          },
          {
            "word": "ERECT",
            "turkishMeaning": "Dik"
          },
          {
            "word": "TREE",
            "turkishMeaning": "Ağaç"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Friendship",
        "theme": "Secrets",
        "explanation": "Connect letters S, E, C, R, E, T to form: SECRET, ERECT, TREE, REST, SEE."
      },
      {
        "id": "wc_g8_h_03",
        "availableLetters": [
          "B",
          "A",
          "C",
          "K",
          "U",
          "P"
        ],
        "targetWords": [
          {
            "word": "BACKUP",
            "turkishMeaning": "Desteklemek"
          },
          {
            "word": "PACK",
            "turkishMeaning": "Paket"
          },
          {
            "word": "BACK",
            "turkishMeaning": "Geri"
          },
          {
            "word": "CAP",
            "turkishMeaning": "Şapka"
          },
          {
            "word": "CUP",
            "turkishMeaning": "Fincan"
          }
        ],
        "category": "Friendship",
        "theme": "Support",
        "explanation": "Connect letters B, A, C, K, U, P to form: BACKUP, PACK, BACK, CAP, CUP."
      },
      {
        "id": "wc_g8_h_04",
        "availableLetters": [
          "T",
          "R",
          "E",
          "N",
          "D",
          "Y"
        ],
        "targetWords": [
          {
            "word": "TRENDY",
            "turkishMeaning": "Modaya uygun"
          },
          {
            "word": "TREND",
            "turkishMeaning": "Akım"
          },
          {
            "word": "DYE",
            "turkishMeaning": "Boya"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          },
          {
            "word": "TRY",
            "turkishMeaning": "Denemek"
          }
        ],
        "category": "Teen Life",
        "theme": "Styles",
        "explanation": "Connect letters T, R, E, N, D, Y to form: TRENDY, TREND, DYE, RED, TRY."
      },
      {
        "id": "wc_g8_h_05",
        "availableLetters": [
          "R",
          "E",
          "C",
          "I",
          "P",
          "E"
        ],
        "targetWords": [
          {
            "word": "RECIPE",
            "turkishMeaning": "Tarif"
          },
          {
            "word": "PIECE",
            "turkishMeaning": "Parça"
          },
          {
            "word": "CREEP",
            "turkishMeaning": "Sürünmek"
          },
          {
            "word": "RIPE",
            "turkishMeaning": "Olgun"
          },
          {
            "word": "PIE",
            "turkishMeaning": "Turta"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Culinary",
        "explanation": "Connect letters R, E, C, I, P, E to form: RECIPE, PIECE, CREEP, RIPE, PIE, ICE."
      },
      {
        "id": "wc_g8_h_06",
        "availableLetters": [
          "G",
          "A",
          "R",
          "L",
          "I",
          "C"
        ],
        "targetWords": [
          {
            "word": "GARLIC",
            "turkishMeaning": "Sarımsak"
          },
          {
            "word": "GIRL",
            "turkishMeaning": "Kız"
          },
          {
            "word": "LIAR",
            "turkishMeaning": "Yalancı"
          },
          {
            "word": "RAIL",
            "turkishMeaning": "Ray"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Garlic Cloves",
        "explanation": "Connect letters G, A, R, L, I, C to form: GARLIC, GIRL, LIAR, RAIL."
      },
      {
        "id": "wc_g8_h_07",
        "availableLetters": [
          "P",
          "E",
          "P",
          "P",
          "E",
          "R",
          "S"
        ],
        "targetWords": [
          {
            "word": "PEPPER",
            "turkishMeaning": "Biber"
          },
          {
            "word": "PEPPERS",
            "turkishMeaning": "Biberler"
          },
          {
            "word": "PREP",
            "turkishMeaning": "Hazırlık"
          },
          {
            "word": "PEER",
            "turkishMeaning": "Akran"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Black Pepper",
        "explanation": "Connect letters P, E, P, P, E, R, S to form: PEPPER, PEPPERS, PREP, PEER, SEE."
      },
      {
        "id": "wc_g8_h_08",
        "availableLetters": [
          "B",
          "U",
          "T",
          "T",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "BUTTER",
            "turkishMeaning": "Tereyağı"
          },
          {
            "word": "TRUE",
            "turkishMeaning": "Doğru"
          },
          {
            "word": "TUBE",
            "turkishMeaning": "Tüp"
          },
          {
            "word": "RUT",
            "turkishMeaning": "İz"
          },
          {
            "word": "TUB",
            "turkishMeaning": "Küvet"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Butter Block",
        "explanation": "Connect letters B, U, T, T, E, R to form: BUTTER, TRUE, TUBE, RUT, TUB."
      },
      {
        "id": "wc_g8_h_09",
        "availableLetters": [
          "E",
          "N",
          "G",
          "A",
          "G",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "ENGAGE",
            "turkishMeaning": "Katılmak"
          },
          {
            "word": "ENGAGES",
            "turkishMeaning": "Katılır"
          },
          {
            "word": "GANG",
            "turkishMeaning": "Çete"
          },
          {
            "word": "GAGE",
            "turkishMeaning": "Rehin"
          },
          {
            "word": "AGE",
            "turkishMeaning": "Yaş"
          }
        ],
        "category": "On The Phone",
        "theme": "Dialogue",
        "explanation": "Connect letters E, N, G, A, G, E, S to form: ENGAGE, ENGAGES, GANG, GAGE, AGE."
      },
      {
        "id": "wc_g8_h_10",
        "availableLetters": [
          "P",
          "H",
          "O",
          "N",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "PHONES",
            "turkishMeaning": "Telefonlar"
          },
          {
            "word": "PHONE",
            "turkishMeaning": "Telefon"
          },
          {
            "word": "HOPE",
            "turkishMeaning": "Umut etmek"
          },
          {
            "word": "NOSE",
            "turkishMeaning": "Burun"
          },
          {
            "word": "OPEN",
            "turkishMeaning": "Açık, açmak"
          },
          {
            "word": "SHOP",
            "turkishMeaning": "Dükkan, alışveriş"
          }
        ],
        "category": "On the Phone",
        "theme": "Phone Connection",
        "explanation": "Connect letters P, H, O, N, E, S to form: PHONES, PHONE, HOPE, NOSE, OPEN, SHOP.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_h_11",
        "availableLetters": [
          "S",
          "E",
          "A",
          "R",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "SEARCH",
            "turkishMeaning": "Aramak"
          },
          {
            "word": "CHASE",
            "turkishMeaning": "Kovalamak"
          },
          {
            "word": "SHARE",
            "turkishMeaning": "Paylaşmak"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "RACE",
            "turkishMeaning": "Yarış"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          }
        ],
        "category": "The Internet",
        "theme": "Query",
        "explanation": "Connect letters S, E, A, R, C, H to form: SEARCH, CHASE, SHARE, HEAR, RACE, CAR."
      },
      {
        "id": "wc_g8_h_12",
        "availableLetters": [
          "S",
          "C",
          "R",
          "E",
          "E",
          "N"
        ],
        "targetWords": [
          {
            "word": "SCREEN",
            "turkishMeaning": "Ekran"
          },
          {
            "word": "SCENE",
            "turkishMeaning": "Sahne"
          },
          {
            "word": "SEEN",
            "turkishMeaning": "Görülmüş"
          },
          {
            "word": "SEER",
            "turkishMeaning": "Kahin"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "The Internet",
        "theme": "Monitor",
        "explanation": "Connect letters S, C, R, E, E, N to form: SCREEN, SCENE, SEEN, SEER, SEE."
      },
      {
        "id": "wc_g8_h_13",
        "availableLetters": [
          "S",
          "O",
          "C",
          "I",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "SOCIAL",
            "turkishMeaning": "Sosyal"
          },
          {
            "word": "COAL",
            "turkishMeaning": "Kömür"
          },
          {
            "word": "COIL",
            "turkishMeaning": "Bobin"
          },
          {
            "word": "SOIL",
            "turkishMeaning": "Toprak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          }
        ],
        "category": "The Internet",
        "theme": "Societies",
        "explanation": "Connect letters S, O, C, I, A, L to form: SOCIAL, COAL, COIL, SOIL, OIL."
      },
      {
        "id": "wc_g8_h_14",
        "availableLetters": [
          "D",
          "E",
          "V",
          "I",
          "C",
          "E"
        ],
        "targetWords": [
          {
            "word": "DEVICE",
            "turkishMeaning": "Cihaz"
          },
          {
            "word": "DICE",
            "turkishMeaning": "Zar"
          },
          {
            "word": "VICE",
            "turkishMeaning": "Kusur"
          },
          {
            "word": "CEDE",
            "turkishMeaning": "Bırakmak"
          },
          {
            "word": "ICE",
            "turkishMeaning": "Buz"
          }
        ],
        "category": "The Internet",
        "theme": "Gadget",
        "explanation": "Connect letters D, E, V, I, C, E to form: DEVICE, DICE, VICE, CEDE, ICE."
      },
      {
        "id": "wc_g8_h_15",
        "availableLetters": [
          "D",
          "A",
          "N",
          "G",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "DANGER",
            "turkishMeaning": "Tehlike"
          },
          {
            "word": "GARDEN",
            "turkishMeaning": "Bahçe"
          },
          {
            "word": "RANG",
            "turkishMeaning": "Çaldı"
          },
          {
            "word": "READ",
            "turkishMeaning": "Okumak"
          },
          {
            "word": "DEAR",
            "turkishMeaning": "Sevgili"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Adventures",
        "theme": "Risk Taking",
        "explanation": "Connect letters D, A, N, G, E, R to form: DANGER, GARDEN, RANG, READ, DEAR, RED."
      },
      {
        "id": "wc_g8_h_16",
        "availableLetters": [
          "S",
          "A",
          "F",
          "A",
          "R",
          "I",
          "S"
        ],
        "targetWords": [
          {
            "word": "SAFARI",
            "turkishMeaning": "Safari"
          },
          {
            "word": "SAFARIS",
            "turkishMeaning": "Safariler"
          },
          {
            "word": "FAIR",
            "turkishMeaning": "Adil"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          },
          {
            "word": "FAR",
            "turkishMeaning": "Uzak"
          }
        ],
        "category": "Adventures",
        "theme": "Expeditions",
        "explanation": "Connect letters S, A, F, A, R, I, S to form: SAFARI, SAFARIS, FAIR, AIR, FAR."
      },
      {
        "id": "wc_g8_h_17",
        "availableLetters": [
          "R",
          "E",
          "S",
          "O",
          "R",
          "T"
        ],
        "targetWords": [
          {
            "word": "RESORT",
            "turkishMeaning": "Tatil yeri"
          },
          {
            "word": "STORE",
            "turkishMeaning": "Mağaza"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "SORT",
            "turkishMeaning": "Sıralamak"
          },
          {
            "word": "TORE",
            "turkishMeaning": "Yırttı"
          }
        ],
        "category": "Tourism",
        "theme": "Beach Resort",
        "explanation": "Connect letters R, E, S, O, R, T to form: RESORT, STORE, ROSE, REST, SORT, TORE."
      },
      {
        "id": "wc_g8_h_18",
        "availableLetters": [
          "T",
          "R",
          "A",
          "V",
          "E",
          "L"
        ],
        "targetWords": [
          {
            "word": "TRAVEL",
            "turkishMeaning": "Seyahat"
          },
          {
            "word": "ALERT",
            "turkishMeaning": "Uyanık"
          },
          {
            "word": "ALTER",
            "turkishMeaning": "Değiştirmek"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          }
        ],
        "category": "Tourism",
        "theme": "Journeys",
        "explanation": "Connect letters T, R, A, V, E, L to form: TRAVEL, ALERT, ALTER, LATE, RATE, EAR."
      },
      {
        "id": "wc_g8_h_19",
        "availableLetters": [
          "T",
          "E",
          "M",
          "P",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "TEMPLE",
            "turkishMeaning": "Tapınak"
          },
          {
            "word": "MELT",
            "turkishMeaning": "Erimak"
          },
          {
            "word": "MEET",
            "turkishMeaning": "Buluşmak"
          },
          {
            "word": "PEEL",
            "turkishMeaning": "Soymak"
          },
          {
            "word": "PET",
            "turkishMeaning": "Evcil"
          }
        ],
        "category": "Tourism",
        "theme": "Monuments",
        "explanation": "Connect letters T, E, M, P, L, E to form: TEMPLE, MELT, MEET, PEEL, PET."
      },
      {
        "id": "wc_g8_h_20",
        "availableLetters": [
          "C",
          "A",
          "S",
          "T",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "CASTLE",
            "turkishMeaning": "Kale"
          },
          {
            "word": "SCALE",
            "turkishMeaning": "Ölçek"
          },
          {
            "word": "STALE",
            "turkishMeaning": "Bayat"
          },
          {
            "word": "SALE",
            "turkishMeaning": "Satış"
          },
          {
            "word": "LATE",
            "turkishMeaning": "Geç"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          }
        ],
        "category": "Tourism",
        "theme": "Citadels",
        "explanation": "Connect letters C, A, S, T, L, E to form: CASTLE, SCALE, STALE, SALE, LATE, CAT."
      },
      {
        "id": "wc_g8_h_21",
        "availableLetters": [
          "V",
          "A",
          "C",
          "U",
          "U",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "VACUUM",
            "turkishMeaning": "Süpürmek"
          },
          {
            "word": "SCUM",
            "turkishMeaning": "Köpük"
          },
          {
            "word": "SUM",
            "turkishMeaning": "Toplam"
          },
          {
            "word": "CAM",
            "turkishMeaning": "Kamera"
          },
          {
            "word": "MACS",
            "turkishMeaning": "Macler"
          }
        ],
        "category": "Chores",
        "theme": "Vacuum",
        "explanation": "Connect letters V, A, C, U, U, M, S to form: VACUUM, SCUM, SUM, CAM, MACS."
      },
      {
        "id": "wc_g8_h_22",
        "availableLetters": [
          "E",
          "R",
          "R",
          "A",
          "N",
          "D"
        ],
        "targetWords": [
          {
            "word": "ERRAND",
            "turkishMeaning": "Ayak işi"
          },
          {
            "word": "REAR",
            "turkishMeaning": "Arka"
          },
          {
            "word": "READ",
            "turkishMeaning": "Okumak"
          },
          {
            "word": "DARE",
            "turkishMeaning": "Cesaret"
          },
          {
            "word": "EAR",
            "turkishMeaning": "Kulak"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Chores",
        "theme": "House Errands",
        "explanation": "Connect letters E, R, R, A, N, D to form: ERRAND, REAR, READ, DARE, EAR, RED."
      },
      {
        "id": "wc_g8_h_23",
        "availableLetters": [
          "D",
          "I",
          "S",
          "H",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "DISHES",
            "turkishMeaning": "Bulaşıklar"
          },
          {
            "word": "DISH",
            "turkishMeaning": "Tabak"
          },
          {
            "word": "SHED",
            "turkishMeaning": "Kulübe"
          },
          {
            "word": "SIDE",
            "turkishMeaning": "Taraf"
          },
          {
            "word": "HIDE",
            "turkishMeaning": "Gizlemek"
          }
        ],
        "category": "Chores",
        "theme": "Sink Cleaning",
        "explanation": "Connect letters D, I, S, H, E, S to form: DISHES, DISH, SHED, SIDE, HIDE."
      },
      {
        "id": "wc_g8_h_24",
        "availableLetters": [
          "S",
          "P",
          "R",
          "E",
          "A",
          "D"
        ],
        "targetWords": [
          {
            "word": "SPREAD",
            "turkishMeaning": "Sürmek"
          },
          {
            "word": "SPEAR",
            "turkishMeaning": "Mızrak"
          },
          {
            "word": "READ",
            "turkishMeaning": "Okumak"
          },
          {
            "word": "DEAR",
            "turkishMeaning": "Sevgili"
          },
          {
            "word": "PEAR",
            "turkishMeaning": "Armut"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "In The Kitchen",
        "theme": "Spreading Jam",
        "explanation": "Connect letters S, P, R, E, A, D to form: SPREAD, SPEAR, READ, DEAR, PEAR, RED."
      },
      {
        "id": "wc_g8_h_25",
        "availableLetters": [
          "I",
          "N",
          "V",
          "E",
          "N",
          "T"
        ],
        "targetWords": [
          {
            "word": "INVENT",
            "turkishMeaning": "İcat etmek"
          },
          {
            "word": "NINE",
            "turkishMeaning": "Dokuz"
          },
          {
            "word": "VENT",
            "turkishMeaning": "Havalandırma"
          },
          {
            "word": "VINE",
            "turkishMeaning": "Asma"
          },
          {
            "word": "TIE",
            "turkishMeaning": "Bağlamak"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Science",
        "theme": "Invention",
        "explanation": "Connect letters I, N, V, E, N, T to form: INVENT, NINE, VENT, VINE, TIE, NET."
      },
      {
        "id": "wc_g8_h_26",
        "availableLetters": [
          "F",
          "O",
          "S",
          "S",
          "I",
          "L"
        ],
        "targetWords": [
          {
            "word": "FOSSIL",
            "turkishMeaning": "Fosil"
          },
          {
            "word": "SOIL",
            "turkishMeaning": "Toprak"
          },
          {
            "word": "FOIL",
            "turkishMeaning": "Folyo"
          },
          {
            "word": "LOSS",
            "turkishMeaning": "Kayıp"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          }
        ],
        "category": "Science",
        "theme": "Paleontology",
        "explanation": "Connect letters F, O, S, S, I, L to form: FOSSIL, SOIL, FOIL, LOSS, OIL."
      },
      {
        "id": "wc_g8_h_27",
        "availableLetters": [
          "G",
          "E",
          "N",
          "O",
          "M",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "GENOME",
            "turkishMeaning": "Genom"
          },
          {
            "word": "GENOMES",
            "turkishMeaning": "Genomlar"
          },
          {
            "word": "GONE",
            "turkishMeaning": "Gitmiş"
          },
          {
            "word": "MEN",
            "turkishMeaning": "Erkekler"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          }
        ],
        "category": "Science",
        "theme": "Genome",
        "explanation": "Connect letters G, E, N, O, M, E, S to form: GENOME, GENOMES, GONE, MEN, ONE."
      },
      {
        "id": "wc_g8_h_28",
        "availableLetters": [
          "H",
          "E",
          "A",
          "T",
          "E",
          "D"
        ],
        "targetWords": [
          {
            "word": "HEATED",
            "turkishMeaning": "Isıtılmış"
          },
          {
            "word": "HEAT",
            "turkishMeaning": "Isı, ısıtmak"
          },
          {
            "word": "DATE",
            "turkishMeaning": "Tarih / hurma"
          },
          {
            "word": "HEAD",
            "turkishMeaning": "Baş, kafa"
          },
          {
            "word": "HAT",
            "turkishMeaning": "Şapka"
          },
          {
            "word": "TEA",
            "turkishMeaning": "Çay"
          }
        ],
        "category": "In the Kitchen",
        "theme": "Heated Oven",
        "explanation": "Connect letters H, E, A, T, E, D to form: HEATED, HEAT, DATE, HEAD, HAT, TEA.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_h_29",
        "availableLetters": [
          "D",
          "A",
          "M",
          "A",
          "G",
          "E"
        ],
        "targetWords": [
          {
            "word": "DAMAGE",
            "turkishMeaning": "Hasar, zarar"
          },
          {
            "word": "GAME",
            "turkishMeaning": "Oyun"
          },
          {
            "word": "MADE",
            "turkishMeaning": "Yapılmış"
          },
          {
            "word": "AGED",
            "turkishMeaning": "Yaşlı"
          },
          {
            "word": "AGE",
            "turkishMeaning": "Yaş, çağ"
          }
        ],
        "category": "Natural Forces",
        "theme": "Disaster Damage",
        "explanation": "Connect letters D, A, M, A, G, E to form: DAMAGE, GAME, MADE, AGED, AGE.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_h_30",
        "availableLetters": [
          "D",
          "A",
          "M",
          "A",
          "G",
          "E"
        ],
        "targetWords": [
          {
            "word": "DAMAGE",
            "turkishMeaning": "Hasar, zarar"
          },
          {
            "word": "GAME",
            "turkishMeaning": "Oyun"
          },
          {
            "word": "MADE",
            "turkishMeaning": "Yapılmış"
          },
          {
            "word": "AGED",
            "turkishMeaning": "Yaşlı"
          },
          {
            "word": "AGE",
            "turkishMeaning": "Yaş, çağ"
          }
        ],
        "category": "Natural Forces",
        "theme": "Earthquake Aftermath",
        "explanation": "Connect letters D, A, M, A, G, E to form: DAMAGE, GAME, MADE, AGED, AGE.",
        "contentVersion": 2
      },
      {
        "id": "wc_g8_h_31",
        "availableLetters": [
          "V",
          "I",
          "C",
          "T",
          "I",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "VICTIM",
            "turkishMeaning": "Mağdur"
          },
          {
            "word": "VICTIMS",
            "turkishMeaning": "Mağdurlar"
          },
          {
            "word": "MIST",
            "turkishMeaning": "Sis"
          },
          {
            "word": "SIT",
            "turkishMeaning": "Oturmak"
          },
          {
            "word": "ITS",
            "turkishMeaning": "Onun"
          }
        ],
        "category": "Natural Forces",
        "theme": "Victim Care",
        "explanation": "Connect letters V, I, C, T, I, M, S to form: VICTIM, VICTIMS, MIST, SIT, ITS."
      },
      {
        "id": "wc_g8_h_32",
        "availableLetters": [
          "I",
          "M",
          "P",
          "A",
          "C",
          "T"
        ],
        "targetWords": [
          {
            "word": "IMPACT",
            "turkishMeaning": "Etki"
          },
          {
            "word": "CAMP",
            "turkishMeaning": "Kamp"
          },
          {
            "word": "PACT",
            "turkishMeaning": "Pakt"
          },
          {
            "word": "MAP",
            "turkishMeaning": "Harita"
          },
          {
            "word": "CAT",
            "turkishMeaning": "Kedi"
          }
        ],
        "category": "Natural Forces",
        "theme": "Crater Strike",
        "explanation": "Connect letters I, M, P, A, C, T to form: IMPACT, CAMP, PACT, MAP, CAT."
      },
      {
        "id": "wc_g8_h_33",
        "availableLetters": [
          "W",
          "I",
          "N",
          "T",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "WINTER",
            "turkishMeaning": "Kış"
          },
          {
            "word": "WRITE",
            "turkishMeaning": "Yazmak"
          },
          {
            "word": "TWIN",
            "turkishMeaning": "İkiz"
          },
          {
            "word": "WIRE",
            "turkishMeaning": "Tel"
          },
          {
            "word": "RENT",
            "turkishMeaning": "Kira"
          },
          {
            "word": "WIN",
            "turkishMeaning": "Kazanmak"
          }
        ],
        "category": "Natural Forces",
        "theme": "Cold Storm",
        "explanation": "Connect letters W, I, N, T, E, R to form: WINTER, WRITE, TWIN, WIRE, RENT, WIN."
      },
      {
        "id": "wc_g8_h_34",
        "availableLetters": [
          "G",
          "L",
          "O",
          "B",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "GLOBAL",
            "turkishMeaning": "Küresel"
          },
          {
            "word": "BALL",
            "turkishMeaning": "Top"
          },
          {
            "word": "GOAL",
            "turkishMeaning": "Hedef"
          },
          {
            "word": "LOG",
            "turkishMeaning": "Kütük"
          },
          {
            "word": "BAG",
            "turkishMeaning": "Çanta"
          }
        ],
        "category": "Natural Forces",
        "theme": "World Atmosphere",
        "explanation": "Connect letters G, L, O, B, A, L to form: GLOBAL, BALL, GOAL, LOG, BAG."
      },
      {
        "id": "wc_g8_h_35",
        "availableLetters": [
          "O",
          "X",
          "Y",
          "G",
          "E",
          "N",
          "S"
        ],
        "targetWords": [
          {
            "word": "OXYGEN",
            "turkishMeaning": "Oksijen"
          },
          {
            "word": "GONE",
            "turkishMeaning": "Gitmiş"
          },
          {
            "word": "NOSE",
            "turkishMeaning": "Burun"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "EGO",
            "turkishMeaning": "Ego"
          }
        ],
        "category": "Science",
        "theme": "Gas Air",
        "explanation": "Connect letters O, X, Y, G, E, N, S to form: OXYGEN, GONE, NOSE, ONE, EGO."
      },
      {
        "id": "wc_g8_h_36",
        "availableLetters": [
          "N",
          "A",
          "T",
          "U",
          "R",
          "E"
        ],
        "targetWords": [
          {
            "word": "NATURE",
            "turkishMeaning": "Doğa"
          },
          {
            "word": "TUNE",
            "turkishMeaning": "Melodi"
          },
          {
            "word": "NEAR",
            "turkishMeaning": "Yakın"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "RUN",
            "turkishMeaning": "Koşmak"
          },
          {
            "word": "NUT",
            "turkishMeaning": "Fındık"
          }
        ],
        "category": "Adventures",
        "theme": "Ecosystems",
        "explanation": "Connect letters N, A, T, U, R, E to form: NATURE, TUNE, NEAR, RATE, RUN, NUT."
      },
      {
        "id": "wc_g8_h_37",
        "availableLetters": [
          "C",
          "O",
          "P",
          "I",
          "N",
          "G"
        ],
        "targetWords": [
          {
            "word": "COPING",
            "turkishMeaning": "Başa çıkma"
          },
          {
            "word": "COIN",
            "turkishMeaning": "Madeni para"
          },
          {
            "word": "PIG",
            "turkishMeaning": "Domuz"
          },
          {
            "word": "PIN",
            "turkishMeaning": "İğne"
          }
        ],
        "category": "Friendship",
        "theme": "Resilience",
        "explanation": "Connect letters C, O, P, I, N, G to form: COPING, COIN, PIG, PIN."
      },
      {
        "id": "wc_g8_h_38",
        "availableLetters": [
          "F",
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        "targetWords": [
          {
            "word": "FLIGHT",
            "turkishMeaning": "Uçuş"
          },
          {
            "word": "LIGHT",
            "turkishMeaning": "Işık"
          },
          {
            "word": "GIFT",
            "turkishMeaning": "Hediye"
          },
          {
            "word": "HIT",
            "turkishMeaning": "Vurmak"
          },
          {
            "word": "FIT",
            "turkishMeaning": "Uygun"
          }
        ],
        "category": "Tourism",
        "theme": "Air Travel",
        "explanation": "Connect letters F, L, I, G, H, T to form: FLIGHT, LIGHT, GIFT, HIT, FIT."
      },
      {
        "id": "wc_g8_h_39",
        "availableLetters": [
          "S",
          "A",
          "M",
          "P",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "SAMPLE",
            "turkishMeaning": "Numune"
          },
          {
            "word": "MAPLE",
            "turkishMeaning": "Akçaağaç"
          },
          {
            "word": "LEAP",
            "turkishMeaning": "Sıçramak"
          },
          {
            "word": "PALE",
            "turkishMeaning": "Solgun"
          },
          {
            "word": "MAP",
            "turkishMeaning": "Harita"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          }
        ],
        "category": "Science",
        "theme": "Lab Specimen",
        "explanation": "Connect letters S, A, M, P, L, E to form: SAMPLE, MAPLE, LEAP, PALE, MAP, SEA."
      },
      {
        "id": "wc_g8_h_40",
        "availableLetters": [
          "T",
          "H",
          "E",
          "O",
          "R",
          "Y"
        ],
        "targetWords": [
          {
            "word": "THEORY",
            "turkishMeaning": "Teori"
          },
          {
            "word": "OTHER",
            "turkishMeaning": "Diğer"
          },
          {
            "word": "HERO",
            "turkishMeaning": "Kahraman"
          },
          {
            "word": "THEY",
            "turkishMeaning": "Onlar"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          }
        ],
        "category": "Science",
        "theme": "Scientific Theory",
        "explanation": "Connect letters T, H, E, O, R, Y to form: THEORY, OTHER, HERO, THEY, HOT."
      },
      {
        "id": "wc_g8_h_41",
        "availableLetters": [
          "S",
          "E",
          "C",
          "R",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "SECRET",
            "turkishMeaning": "Sır"
          },
          {
            "word": "ERECT",
            "turkishMeaning": "Dikmek"
          },
          {
            "word": "RESET",
            "turkishMeaning": "Sıfırlamak"
          },
          {
            "word": "TREE",
            "turkishMeaning": "Ağaç"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          },
          {
            "word": "SET",
            "turkishMeaning": "Set"
          }
        ],
        "category": "Friendship",
        "theme": "Confidentiality",
        "explanation": "Connect letters S, E, C, R, E, T to form: SECRET, ERECT, RESET, TREE, SEE, SET."
      },
      {
        "id": "wc_g8_h_42",
        "availableLetters": [
          "C",
          "A",
          "R",
          "I",
          "N",
          "G"
        ],
        "targetWords": [
          {
            "word": "CARING",
            "turkishMeaning": "İlgili, şefkatli"
          },
          {
            "word": "GRAIN",
            "turkishMeaning": "Tahıl"
          },
          {
            "word": "RAIN",
            "turkishMeaning": "Yağmur"
          },
          {
            "word": "RING",
            "turkishMeaning": "Halka"
          },
          {
            "word": "GAIN",
            "turkishMeaning": "Kazanmak"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          }
        ],
        "category": "Friendship",
        "theme": "Empathy",
        "explanation": "Connect letters C, A, R, I, N, G to form: CARING, GRAIN, RAIN, RING, GAIN, AIR."
      },
      {
        "id": "wc_g8_h_43",
        "availableLetters": [
          "L",
          "I",
          "S",
          "T",
          "E",
          "N"
        ],
        "targetWords": [
          {
            "word": "LISTEN",
            "turkishMeaning": "Dinlemek"
          },
          {
            "word": "SILENT",
            "turkishMeaning": "Sessiz"
          },
          {
            "word": "INLET",
            "turkishMeaning": "Koy"
          },
          {
            "word": "NEST",
            "turkishMeaning": "Yuva"
          },
          {
            "word": "LINE",
            "turkishMeaning": "Çizgi"
          },
          {
            "word": "NET",
            "turkishMeaning": "Ağ"
          }
        ],
        "category": "Friendship",
        "theme": "Active Listening",
        "explanation": "Connect letters L, I, S, T, E, N to form: LISTEN, SILENT, INLET, NEST, LINE, NET."
      },
      {
        "id": "wc_g8_h_44",
        "availableLetters": [
          "S",
          "O",
          "C",
          "I",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "SOCIAL",
            "turkishMeaning": "Sosyal"
          },
          {
            "word": "COAL",
            "turkishMeaning": "Kömür"
          },
          {
            "word": "SAIL",
            "turkishMeaning": "Yelken"
          },
          {
            "word": "SOIL",
            "turkishMeaning": "Toprak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          }
        ],
        "category": "Teen Life",
        "theme": "Youth Community",
        "explanation": "Connect letters S, O, C, I, A, L to form: SOCIAL, COAL, SAIL, SOIL, OIL."
      },
      {
        "id": "wc_g8_h_45",
        "availableLetters": [
          "T",
          "R",
          "E",
          "N",
          "D",
          "Y"
        ],
        "targetWords": [
          {
            "word": "TRENDY",
            "turkishMeaning": "Moda"
          },
          {
            "word": "TREND",
            "turkishMeaning": "Akım"
          },
          {
            "word": "RENT",
            "turkishMeaning": "Kira"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          },
          {
            "word": "DRY",
            "turkishMeaning": "Kuru"
          }
        ],
        "category": "Teen Life",
        "theme": "Style Choices",
        "explanation": "Connect letters T, R, E, N, D, Y to form: TRENDY, TREND, RENT, RED, DRY."
      },
      {
        "id": "wc_g8_h_46",
        "availableLetters": [
          "M",
          "O",
          "B",
          "I",
          "L",
          "E"
        ],
        "targetWords": [
          {
            "word": "MOBILE",
            "turkishMeaning": "Taşınabilir"
          },
          {
            "word": "BOIL",
            "turkishMeaning": "Kaynamak"
          },
          {
            "word": "LOBE",
            "turkishMeaning": "Lob"
          },
          {
            "word": "MILE",
            "turkishMeaning": "Mil"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          }
        ],
        "category": "Phone",
        "theme": "Cellular Devices",
        "explanation": "Connect letters M, O, B, I, L, E to form: MOBILE, BOIL, LOBE, MILE, OIL."
      },
      {
        "id": "wc_g8_h_47",
        "availableLetters": [
          "S",
          "I",
          "G",
          "N",
          "A",
          "L"
        ],
        "targetWords": [
          {
            "word": "SIGNAL",
            "turkishMeaning": "Sinyal"
          },
          {
            "word": "ALIGN",
            "turkishMeaning": "Hizalamak"
          },
          {
            "word": "SLAIN",
            "turkishMeaning": "Öldürülmüş"
          },
          {
            "word": "GAIN",
            "turkishMeaning": "Kazanım"
          },
          {
            "word": "SIGN",
            "turkishMeaning": "İşaret"
          },
          {
            "word": "SAIL",
            "turkishMeaning": "Yelken"
          }
        ],
        "category": "Phone",
        "theme": "Telecommunication",
        "explanation": "Connect letters S, I, G, N, A, L to form: SIGNAL, ALIGN, SLAIN, GAIN, SIGN, SAIL."
      },
      {
        "id": "wc_g8_h_48",
        "availableLetters": [
          "R",
          "E",
          "P",
          "E",
          "A",
          "T"
        ],
        "targetWords": [
          {
            "word": "REPEAT",
            "turkishMeaning": "Tekrarlamak"
          },
          {
            "word": "PEAR",
            "turkishMeaning": "Armut"
          },
          {
            "word": "TEAR",
            "turkishMeaning": "Yırtmak"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "EAT",
            "turkishMeaning": "Yemek"
          }
        ],
        "category": "Phone",
        "theme": "Clarity in Speech",
        "explanation": "Connect letters R, E, P, E, A, T to form: REPEAT, PEAR, TEAR, RATE, EAT."
      },
      {
        "id": "wc_g8_h_49",
        "availableLetters": [
          "U",
          "P",
          "L",
          "O",
          "A",
          "D"
        ],
        "targetWords": [
          {
            "word": "UPLOAD",
            "turkishMeaning": "Yüklemek"
          },
          {
            "word": "LOAD",
            "turkishMeaning": "Yük"
          },
          {
            "word": "LOUD",
            "turkishMeaning": "Yüksek sesli"
          },
          {
            "word": "PAD",
            "turkishMeaning": "Ped"
          },
          {
            "word": "LAD",
            "turkishMeaning": "Delikanlı"
          }
        ],
        "category": "Internet",
        "theme": "File Sharing",
        "explanation": "Connect letters U, P, L, O, A, D to form: UPLOAD, LOAD, LOUD, PAD, LAD."
      },
      {
        "id": "wc_g8_h_50",
        "availableLetters": [
          "S",
          "E",
          "A",
          "R",
          "C",
          "H"
        ],
        "targetWords": [
          {
            "word": "SEARCH",
            "turkishMeaning": "Aramak"
          },
          {
            "word": "CHASE",
            "turkishMeaning": "Kovalamak"
          },
          {
            "word": "SHARE",
            "turkishMeaning": "Paylaşmak"
          },
          {
            "word": "HEAR",
            "turkishMeaning": "Duymak"
          },
          {
            "word": "EACH",
            "turkishMeaning": "Her biri"
          },
          {
            "word": "CAR",
            "turkishMeaning": "Araba"
          }
        ],
        "category": "Internet",
        "theme": "Web Inquiries",
        "explanation": "Connect letters S, E, A, R, C, H to form: SEARCH, CHASE, SHARE, HEAR, EACH, CAR."
      },
      {
        "id": "wc_g8_h_51",
        "availableLetters": [
          "R",
          "E",
          "C",
          "I",
          "P",
          "E"
        ],
        "targetWords": [
          {
            "word": "RECIPE",
            "turkishMeaning": "Tarif"
          },
          {
            "word": "PIECE",
            "turkishMeaning": "Parça"
          },
          {
            "word": "PRICE",
            "turkishMeaning": "Fiyat"
          },
          {
            "word": "PIER",
            "turkishMeaning": "İskele"
          },
          {
            "word": "RIPE",
            "turkishMeaning": "Olgun"
          },
          {
            "word": "PIE",
            "turkishMeaning": "Turta"
          }
        ],
        "category": "Kitchen",
        "theme": "Cooking Directions",
        "explanation": "Connect letters R, E, C, I, P, E to form: RECIPE, PIECE, PRICE, PIER, RIPE, PIE."
      },
      {
        "id": "wc_g8_h_52",
        "availableLetters": [
          "S",
          "E",
          "A",
          "S",
          "O",
          "N"
        ],
        "targetWords": [
          {
            "word": "SEASON",
            "turkishMeaning": "Baharatlamak / Mevsim"
          },
          {
            "word": "NOSE",
            "turkishMeaning": "Burun"
          },
          {
            "word": "SONS",
            "turkishMeaning": "Oğullar"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          },
          {
            "word": "SON",
            "turkishMeaning": "Oğul"
          }
        ],
        "category": "Kitchen",
        "theme": "Flavoring Meals",
        "explanation": "Connect letters S, E, A, S, O, N to form: SEASON, NOSE, SONS, SEA, ONE, SON."
      },
      {
        "id": "wc_g8_h_53",
        "availableLetters": [
          "B",
          "A",
          "K",
          "I",
          "N",
          "G"
        ],
        "targetWords": [
          {
            "word": "BAKING",
            "turkishMeaning": "Fırınlama"
          },
          {
            "word": "BANK",
            "turkishMeaning": "Banka"
          },
          {
            "word": "GAIN",
            "turkishMeaning": "Kazanmak"
          },
          {
            "word": "BIG",
            "turkishMeaning": "Büyük"
          },
          {
            "word": "BAG",
            "turkishMeaning": "Çanta"
          }
        ],
        "category": "Kitchen",
        "theme": "Artisanal Breads",
        "explanation": "Connect letters B, A, K, I, N, G to form: BAKING, BANK, GAIN, BIG, BAG."
      },
      {
        "id": "wc_g8_h_54",
        "availableLetters": [
          "B",
          "O",
          "I",
          "L",
          "E",
          "D"
        ],
        "targetWords": [
          {
            "word": "BOILED",
            "turkishMeaning": "Haşlanmış"
          },
          {
            "word": "BOIL",
            "turkishMeaning": "Kaynatmak"
          },
          {
            "word": "IDLE",
            "turkishMeaning": "Boşta"
          },
          {
            "word": "BOLD",
            "turkishMeaning": "Cesur"
          },
          {
            "word": "BED",
            "turkishMeaning": "Yatak"
          },
          {
            "word": "OIL",
            "turkishMeaning": "Yağ"
          },
          {
            "word": "LID",
            "turkishMeaning": "Kapak"
          }
        ],
        "category": "Kitchen",
        "theme": "Boiling Food",
        "explanation": "Connect letters B, O, I, L, E, D to form: BOILED, BOIL, IDLE, BOLD, BED, OIL, LID."
      },
      {
        "id": "wc_g8_h_55",
        "availableLetters": [
          "P",
          "A",
          "N",
          "T",
          "R",
          "Y"
        ],
        "targetWords": [
          {
            "word": "PANTRY",
            "turkishMeaning": "Kiler"
          },
          {
            "word": "PARTY",
            "turkishMeaning": "Parti"
          },
          {
            "word": "PRAY",
            "turkishMeaning": "Dua etmek"
          },
          {
            "word": "TRAY",
            "turkishMeaning": "Tepsi"
          },
          {
            "word": "YARN",
            "turkishMeaning": "İplik"
          },
          {
            "word": "PAY",
            "turkishMeaning": "Ödemek"
          }
        ],
        "category": "Kitchen",
        "theme": "Food Storage",
        "explanation": "Connect letters P, A, N, T, R, Y to form: PANTRY, PARTY, PRAY, TRAY, YARN, PAY."
      },
      {
        "id": "wc_g8_h_56",
        "availableLetters": [
          "A",
          "L",
          "P",
          "I",
          "N",
          "E"
        ],
        "targetWords": [
          {
            "word": "ALPINE",
            "turkishMeaning": "Dağlık"
          },
          {
            "word": "PLANE",
            "turkishMeaning": "Uçak"
          },
          {
            "word": "PANEL",
            "turkishMeaning": "Panel"
          },
          {
            "word": "LINE",
            "turkishMeaning": "Hat"
          },
          {
            "word": "PALE",
            "turkishMeaning": "Solgun"
          },
          {
            "word": "PEN",
            "turkishMeaning": "Kalem"
          }
        ],
        "category": "Adventures",
        "theme": "Mountain Climbs",
        "explanation": "Connect letters A, L, P, I, N, E to form: ALPINE, PLANE, PANEL, LINE, PALE, PEN."
      },
      {
        "id": "wc_g8_h_57",
        "availableLetters": [
          "H",
          "E",
          "L",
          "M",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "HELMET",
            "turkishMeaning": "Kask"
          },
          {
            "word": "MEET",
            "turkishMeaning": "Buluşmak"
          },
          {
            "word": "MELT",
            "turkishMeaning": "Erimak"
          },
          {
            "word": "THEME",
            "turkishMeaning": "Tema"
          },
          {
            "word": "HEEL",
            "turkishMeaning": "Topuk"
          },
          {
            "word": "LET",
            "turkishMeaning": "İzin vermek"
          }
        ],
        "category": "Adventures",
        "theme": "Safety Gear",
        "explanation": "Connect letters H, E, L, M, E, T to form: HELMET, MEET, MELT, THEME, HEEL, LET."
      },
      {
        "id": "wc_g8_h_58",
        "availableLetters": [
          "F",
          "L",
          "I",
          "G",
          "H",
          "T"
        ],
        "targetWords": [
          {
            "word": "FLIGHT",
            "turkishMeaning": "Uçuş"
          },
          {
            "word": "LIGHT",
            "turkishMeaning": "Işık"
          },
          {
            "word": "GIFT",
            "turkishMeaning": "Hediye"
          },
          {
            "word": "LIFT",
            "turkishMeaning": "Kaldırmak"
          },
          {
            "word": "HIT",
            "turkishMeaning": "Vurmak"
          },
          {
            "word": "FIG",
            "turkishMeaning": "İncir"
          }
        ],
        "category": "Adventures",
        "theme": "Aero Sports",
        "explanation": "Connect letters F, L, I, G, H, T to form: FLIGHT, LIGHT, GIFT, LIFT, HIT, FIG."
      },
      {
        "id": "wc_g8_h_59",
        "availableLetters": [
          "T",
          "R",
          "A",
          "V",
          "E",
          "L"
        ],
        "targetWords": [
          {
            "word": "TRAVEL",
            "turkishMeaning": "Seyahat"
          },
          {
            "word": "ALERT",
            "turkishMeaning": "Alarm"
          },
          {
            "word": "LATER",
            "turkishMeaning": "Sonra"
          },
          {
            "word": "RATE",
            "turkishMeaning": "Oran"
          },
          {
            "word": "TEAR",
            "turkishMeaning": "Gözyaşı"
          },
          {
            "word": "ART",
            "turkishMeaning": "Sanat"
          }
        ],
        "category": "Tourism",
        "theme": "Journeys",
        "explanation": "Connect letters T, R, A, V, E, L to form: TRAVEL, ALERT, LATER, RATE, TEAR, ART."
      },
      {
        "id": "wc_g8_h_60",
        "availableLetters": [
          "T",
          "I",
          "C",
          "K",
          "E",
          "T"
        ],
        "targetWords": [
          {
            "word": "TICKET",
            "turkishMeaning": "Bilet"
          },
          {
            "word": "KITE",
            "turkishMeaning": "Uçurtma"
          }
        ],
        "category": "Tourism",
        "theme": "Boarding Passes",
        "explanation": "Connect letters T, I, C, K, E, T to form: TICKET, KITE."
      },
      {
        "id": "wc_g8_h_61",
        "availableLetters": [
          "C",
          "H",
          "O",
          "R",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "CHORES",
            "turkishMeaning": "Ev işleri"
          },
          {
            "word": "SHORE",
            "turkishMeaning": "Sahil"
          },
          {
            "word": "SCORE",
            "turkishMeaning": "Skor"
          },
          {
            "word": "HORSE",
            "turkishMeaning": "At"
          },
          {
            "word": "ROSE",
            "turkishMeaning": "Gül"
          },
          {
            "word": "HERO",
            "turkishMeaning": "Kahraman"
          },
          {
            "word": "CORE",
            "turkishMeaning": "Çekirdek"
          }
        ],
        "category": "Chores",
        "theme": "Household Duty",
        "explanation": "Connect letters C, H, O, R, E, S to form: CHORES, SHORE, SCORE, HORSE, ROSE, HERO, CORE."
      },
      {
        "id": "wc_g8_h_62",
        "availableLetters": [
          "V",
          "A",
          "C",
          "U",
          "U",
          "M"
        ],
        "targetWords": [
          {
            "word": "VACUUM",
            "turkishMeaning": "Elektrikli süpürge"
          }
        ],
        "category": "Chores",
        "theme": "Carpet Cleaning",
        "explanation": "Connect letters V, A, C, U, U, M to form: VACUUM."
      },
      {
        "id": "wc_g8_h_63",
        "availableLetters": [
          "M",
          "E",
          "T",
          "H",
          "O",
          "D"
        ],
        "targetWords": [
          {
            "word": "METHOD",
            "turkishMeaning": "Yöntem"
          },
          {
            "word": "HOME",
            "turkishMeaning": "Ev"
          },
          {
            "word": "MOTE",
            "turkishMeaning": "Zerre"
          },
          {
            "word": "THEM",
            "turkishMeaning": "Onları"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          }
        ],
        "category": "Science",
        "theme": "Scientific Inquiries",
        "explanation": "Connect letters M, E, T, H, O, D to form: METHOD, HOME, MOTE, THEM, HOT."
      },
      {
        "id": "wc_g8_h_64",
        "availableLetters": [
          "T",
          "H",
          "E",
          "O",
          "R",
          "Y"
        ],
        "targetWords": [
          {
            "word": "THEORY",
            "turkishMeaning": "Teori"
          },
          {
            "word": "HERO",
            "turkishMeaning": "Kahraman"
          },
          {
            "word": "THEY",
            "turkishMeaning": "Onlar"
          },
          {
            "word": "HOT",
            "turkishMeaning": "Sıcak"
          }
        ],
        "category": "Science",
        "theme": "Explanations",
        "explanation": "Connect letters T, H, E, O, R, Y to form: THEORY, HERO, THEY, HOT."
      },
      {
        "id": "wc_g8_h_65",
        "availableLetters": [
          "R",
          "E",
          "S",
          "U",
          "L",
          "T"
        ],
        "targetWords": [
          {
            "word": "RESULT",
            "turkishMeaning": "Sonuç"
          },
          {
            "word": "RUSTLE",
            "turkishMeaning": "Hışırtı"
          },
          {
            "word": "LUSTER",
            "turkishMeaning": "Parlaklık"
          },
          {
            "word": "RULE",
            "turkishMeaning": "Kural"
          },
          {
            "word": "RUST",
            "turkishMeaning": "Pas"
          },
          {
            "word": "SURE",
            "turkishMeaning": "Emin"
          }
        ],
        "category": "Science",
        "theme": "Data Findings",
        "explanation": "Connect letters R, E, S, U, L, T to form: RESULT, RUSTLE, LUSTER, RULE, RUST, SURE."
      },
      {
        "id": "wc_g8_h_66",
        "availableLetters": [
          "T",
          "R",
          "E",
          "M",
          "O",
          "R"
        ],
        "targetWords": [
          {
            "word": "TREMOR",
            "turkishMeaning": "Sarsıntı"
          },
          {
            "word": "TERM",
            "turkishMeaning": "Dönem"
          },
          {
            "word": "MORE",
            "turkishMeaning": "Daha fazla"
          },
          {
            "word": "ROTE",
            "turkishMeaning": "Ezber"
          }
        ],
        "category": "Natural Forces",
        "theme": "Seismic Shakes",
        "explanation": "Connect letters T, R, E, M, O, R to form: TREMOR, TERM, MORE, ROTE."
      },
      {
        "id": "wc_g8_h_67",
        "availableLetters": [
          "D",
          "A",
          "M",
          "A",
          "G",
          "E"
        ],
        "targetWords": [
          {
            "word": "DAMAGE",
            "turkishMeaning": "Hasar"
          },
          {
            "word": "AGED",
            "turkishMeaning": "Yaşlı"
          },
          {
            "word": "GAME",
            "turkishMeaning": "Oyun"
          },
          {
            "word": "MADE",
            "turkishMeaning": "Yaptı"
          },
          {
            "word": "MAD",
            "turkishMeaning": "Kızgın"
          }
        ],
        "category": "Natural Forces",
        "theme": "Destruction",
        "explanation": "Connect letters D, A, M, A, G, E to form: DAMAGE, AGED, GAME, MADE, MAD."
      },
      {
        "id": "wc_g8_h_68",
        "availableLetters": [
          "R",
          "E",
          "S",
          "C",
          "U",
          "E"
        ],
        "targetWords": [
          {
            "word": "RESCUE",
            "turkishMeaning": "Kurtarmak"
          },
          {
            "word": "CURE",
            "turkishMeaning": "Tedavi"
          },
          {
            "word": "SUE",
            "turkishMeaning": "Dava açmak"
          },
          {
            "word": "SEE",
            "turkishMeaning": "Görmek"
          }
        ],
        "category": "Natural Forces",
        "theme": "Relief Missions",
        "explanation": "Connect letters R, E, S, C, U, E to form: RESCUE, CURE, SUE, SEE."
      },
      {
        "id": "wc_g8_h_69",
        "availableLetters": [
          "D",
          "E",
          "B",
          "R",
          "I",
          "S"
        ],
        "targetWords": [
          {
            "word": "DEBRIS",
            "turkishMeaning": "Enkaz"
          },
          {
            "word": "BRIDE",
            "turkishMeaning": "Gelin"
          },
          {
            "word": "BIRDS",
            "turkishMeaning": "Kuşlar"
          },
          {
            "word": "BIRD",
            "turkishMeaning": "Kuş"
          },
          {
            "word": "RIDE",
            "turkishMeaning": "Binmek"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          }
        ],
        "category": "Natural Forces",
        "theme": "Rubble",
        "explanation": "Connect letters D, E, B, R, I, S to form: DEBRIS, BRIDE, BIRDS, BIRD, RIDE, RED."
      },
      {
        "id": "wc_g8_h_70",
        "availableLetters": [
          "C",
          "O",
          "U",
          "N",
          "T",
          "S"
        ],
        "targetWords": [
          {
            "word": "COUNTS",
            "turkishMeaning": "Sayar"
          },
          {
            "word": "SNOUT",
            "turkishMeaning": "Burun"
          },
          {
            "word": "NUT",
            "turkishMeaning": "Fındık"
          },
          {
            "word": "SUN",
            "turkishMeaning": "Güneş"
          },
          {
            "word": "OUT",
            "turkishMeaning": "Dışarı"
          }
        ],
        "category": "Friendship",
        "theme": "Dependability",
        "explanation": "Connect letters C, O, U, N, T, S to form: COUNTS, SNOUT, NUT, SUN, OUT."
      },
      {
        "id": "wc_g8_h_71",
        "availableLetters": [
          "C",
          "O",
          "O",
          "K",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "COOKER",
            "turkishMeaning": "Ocak"
          },
          {
            "word": "COOK",
            "turkishMeaning": "Pişirmek"
          },
          {
            "word": "CORE",
            "turkishMeaning": "Çekirdek"
          }
        ],
        "category": "Kitchen",
        "theme": "Cooking Appliances",
        "explanation": "Connect letters C, O, O, K, E, R to form: COOKER, COOK, CORE."
      },
      {
        "id": "wc_g8_h_72",
        "availableLetters": [
          "B",
          "U",
          "T",
          "T",
          "E",
          "R"
        ],
        "targetWords": [
          {
            "word": "BUTTER",
            "turkishMeaning": "Tereyağı"
          },
          {
            "word": "TRUE",
            "turkishMeaning": "Doğru"
          },
          {
            "word": "TUBE",
            "turkishMeaning": "Tüp"
          },
          {
            "word": "TUB",
            "turkishMeaning": "Küvet"
          }
        ],
        "category": "Kitchen",
        "theme": "Dairy Ingredients",
        "explanation": "Connect letters B, U, T, T, E, R to form: BUTTER, TRUE, TUBE, TUB."
      },
      {
        "id": "wc_g8_h_73",
        "availableLetters": [
          "B",
          "L",
          "E",
          "N",
          "D",
          "S"
        ],
        "targetWords": [
          {
            "word": "BLENDS",
            "turkishMeaning": "Karıştırır"
          },
          {
            "word": "BEND",
            "turkishMeaning": "Bükmek"
          },
          {
            "word": "LEND",
            "turkishMeaning": "Ödünç vermek"
          },
          {
            "word": "SEND",
            "turkishMeaning": "Göndermek"
          },
          {
            "word": "BED",
            "turkishMeaning": "Yatak"
          }
        ],
        "category": "Kitchen",
        "theme": "Smoothie Blends",
        "explanation": "Connect letters B, L, E, N, D, S to form: BLENDS, BEND, LEND, SEND, BED."
      },
      {
        "id": "wc_g8_h_74",
        "availableLetters": [
          "S",
          "A",
          "U",
          "C",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "SAUCES",
            "turkishMeaning": "Soslar"
          },
          {
            "word": "CAUSE",
            "turkishMeaning": "Sebep"
          },
          {
            "word": "CASE",
            "turkishMeaning": "Kasa"
          },
          {
            "word": "SEA",
            "turkishMeaning": "Deniz"
          }
        ],
        "category": "Kitchen",
        "theme": "Savory Dressings",
        "explanation": "Connect letters S, A, U, C, E, S to form: SAUCES, CAUSE, CASE, SEA."
      },
      {
        "id": "wc_g8_h_75",
        "availableLetters": [
          "F",
          "O",
          "R",
          "U",
          "M",
          "S"
        ],
        "targetWords": [
          {
            "word": "FORUMS",
            "turkishMeaning": "Forumlar"
          },
          {
            "word": "FROM",
            "turkishMeaning": "-den"
          },
          {
            "word": "SOUR",
            "turkishMeaning": "Ekşi"
          },
          {
            "word": "SUM",
            "turkishMeaning": "Toplam"
          },
          {
            "word": "FOR",
            "turkishMeaning": "İçin"
          }
        ],
        "category": "Internet",
        "theme": "Online Discussions",
        "explanation": "Connect letters F, O, R, U, M, S to form: FORUMS, FROM, SOUR, SUM, FOR."
      },
      {
        "id": "wc_g8_h_76",
        "availableLetters": [
          "C",
          "Y",
          "C",
          "L",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "CYCLES",
            "turkishMeaning": "Döngüler"
          }
        ],
        "category": "Science",
        "theme": "Earth Cycles",
        "explanation": "Connect letters C, Y, C, L, E, S to form: CYCLES."
      },
      {
        "id": "wc_g8_h_77",
        "availableLetters": [
          "P",
          "L",
          "A",
          "T",
          "E",
          "S"
        ],
        "targetWords": [
          {
            "word": "PLATES",
            "turkishMeaning": "Tabaklar / Levhalar"
          },
          {
            "word": "PASTEL",
            "turkishMeaning": "Pastel"
          },
          {
            "word": "PETAL",
            "turkishMeaning": "Taçyaprak"
          },
          {
            "word": "LEAST",
            "turkishMeaning": "En az"
          },
          {
            "word": "TALE",
            "turkishMeaning": "Masal"
          },
          {
            "word": "SALT",
            "turkishMeaning": "Tuz"
          }
        ],
        "category": "Natural Forces",
        "theme": "Tectonic Plates",
        "explanation": "Connect letters P, L, A, T, E, S to form: PLATES, PASTEL, PETAL, LEAST, TALE, SALT."
      },
      {
        "id": "wc_g8_h_78",
        "availableLetters": [
          "F",
          "O",
          "R",
          "E",
          "S",
          "T"
        ],
        "targetWords": [
          {
            "word": "FOREST",
            "turkishMeaning": "Orman"
          },
          {
            "word": "FROST",
            "turkishMeaning": "Don"
          },
          {
            "word": "STORE",
            "turkishMeaning": "Mağaza"
          },
          {
            "word": "REST",
            "turkishMeaning": "Dinlenmek"
          },
          {
            "word": "FORT",
            "turkishMeaning": "Hisar"
          }
        ],
        "category": "Environment",
        "theme": "Canopy Habitats",
        "explanation": "Connect letters F, O, R, E, S, T to form: FOREST, FROST, STORE, REST, FORT."
      },
      {
        "id": "wc_g8_h_79",
        "availableLetters": [
          "M",
          "O",
          "D",
          "E",
          "R",
          "N"
        ],
        "targetWords": [
          {
            "word": "MODERN",
            "turkishMeaning": "Modern"
          },
          {
            "word": "DRONE",
            "turkishMeaning": "Dron"
          },
          {
            "word": "NODE",
            "turkishMeaning": "Düğüm"
          },
          {
            "word": "RED",
            "turkishMeaning": "Kırmızı"
          },
          {
            "word": "ONE",
            "turkishMeaning": "Bir"
          }
        ],
        "category": "Tourism",
        "theme": "City Architecture",
        "explanation": "Connect letters M, O, D, E, R, N to form: MODERN, DRONE, NODE, RED, ONE."
      },
      {
        "id": "wc_g8_h_80",
        "availableLetters": [
          "G",
          "A",
          "R",
          "L",
          "I",
          "C"
        ],
        "targetWords": [
          {
            "word": "GARLIC",
            "turkishMeaning": "Sarımsak"
          },
          {
            "word": "CIGAR",
            "turkishMeaning": "Puro"
          },
          {
            "word": "GIRL",
            "turkishMeaning": "Kız"
          },
          {
            "word": "AIR",
            "turkishMeaning": "Hava"
          }
        ],
        "category": "Kitchen",
        "theme": "Aromatic Flavors",
        "explanation": "Connect letters G, A, R, L, I, C to form: GARLIC, CIGAR, GIRL, AIR."
      }
    ]
  }
};
