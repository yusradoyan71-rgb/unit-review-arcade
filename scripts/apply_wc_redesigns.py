import json
from collections import Counter

with open('src/data/gamesZone/wordConnectData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "export const WORD_CONNECT_BANK: WordConnectBank = "
json_str = text.split(prefix)[1].strip().rstrip(';')
bank = json.loads(json_str)

redesigned = {
    "wc_g7_e_02": {
        "id": "wc_g7_e_02",
        "availableLetters": ["S", "T", "E", "P"],
        "targetWords": [
            {"word": "STEP", "turkishMeaning": "Adım"},
            {"word": "PETS", "turkishMeaning": "Evcil hayvanlar"},
            {"word": "PET", "turkishMeaning": "Evcil hayvan"},
            {"word": "SET", "turkishMeaning": "Ayar / set"}
        ],
        "category": "Sports & Health",
        "theme": "Fitness & Activity",
        "explanation": "Connect letters S, T, E, P to form: STEP, PETS, PET, SET.",
        "contentVersion": 2
    },
    "wc_g7_e_16": {
        "id": "wc_g7_e_16",
        "availableLetters": ["B", "E", "A", "R", "S"],
        "targetWords": [
            {"word": "BEARS", "turkishMeaning": "Ayılar"},
            {"word": "BEAR", "turkishMeaning": "Ayı"},
            {"word": "EARS", "turkishMeaning": "Kulaklar"},
            {"word": "SEA", "turkishMeaning": "Deniz"}
        ],
        "category": "Wild Animals",
        "theme": "Forest Bears",
        "explanation": "Connect letters B, E, A, R, S to form: BEARS, BEAR, EARS, SEA.",
        "contentVersion": 2
    },
    "wc_g7_e_37": {
        "id": "wc_g7_e_37",
        "availableLetters": ["M", "E", "D", "A", "L"],
        "targetWords": [
            {"word": "MEDAL", "turkishMeaning": "Madalya"},
            {"word": "DEAL", "turkishMeaning": "Anlaşma"},
            {"word": "MALE", "turkishMeaning": "Erkek"},
            {"word": "LEAD", "turkishMeaning": "Öncülük etmek"}
        ],
        "category": "Sports & Awards",
        "theme": "Medals & Honors",
        "explanation": "Connect letters M, E, D, A, L to form: MEDAL, DEAL, MALE, LEAD.",
        "contentVersion": 2
    },
    "wc_g7_m_13": {
        "id": "wc_g7_m_13",
        "availableLetters": ["W", "A", "T", "E", "R", "S"],
        "targetWords": [
            {"word": "WATERS", "turkishMeaning": "Sular"},
            {"word": "WATER", "turkishMeaning": "Su"},
            {"word": "SWEAT", "turkishMeaning": "Ter, terlemek"},
            {"word": "WASTE", "turkishMeaning": "Atık / israf"},
            {"word": "STAR", "turkishMeaning": "Yıldız"}
        ],
        "category": "Environment",
        "theme": "Fresh Water",
        "explanation": "Connect letters W, A, T, E, R, S to form: WATERS, WATER, SWEAT, WASTE, STAR.",
        "contentVersion": 2
    },
    "wc_g7_m_22": {
        "id": "wc_g7_m_22",
        "availableLetters": ["B", "R", "A", "V", "E", "S"],
        "targetWords": [
            {"word": "BRAVES", "turkishMeaning": "Cesurlar"},
            {"word": "BRAVE", "turkishMeaning": "Cesur"},
            {"word": "BEARS", "turkishMeaning": "Ayılar"},
            {"word": "SAVE", "turkishMeaning": "Kurtarmak"},
            {"word": "BASE", "turkishMeaning": "Temel / üs"}
        ],
        "category": "Personality",
        "theme": "Heroic Courage",
        "explanation": "Connect letters B, R, A, V, E, S to form: BRAVES, BRAVE, BEARS, SAVE, BASE.",
        "contentVersion": 2
    },
    "wc_g7_m_38": {
        "id": "wc_g7_m_38",
        "availableLetters": ["R", "A", "F", "T", "S"],
        "targetWords": [
            {"word": "RAFTS", "turkishMeaning": "Rafting botları"},
            {"word": "RAFT", "turkishMeaning": "Sal / bot"},
            {"word": "FAST", "turkishMeaning": "Hızlı"},
            {"word": "STAR", "turkishMeaning": "Yıldız"},
            {"word": "ARTS", "turkishMeaning": "Sanatlar"}
        ],
        "category": "Sports",
        "theme": "River Rafting",
        "explanation": "Connect letters R, A, F, T, S to form: RAFTS, RAFT, FAST, STAR, ARTS.",
        "contentVersion": 2
    },
    "wc_g7_h_10": {
        "id": "wc_g7_h_10",
        "availableLetters": ["F", "O", "R", "E", "S", "T"],
        "targetWords": [
            {"word": "FOREST", "turkishMeaning": "Orman"},
            {"word": "REST", "turkishMeaning": "Dinlenmek"},
            {"word": "SOFT", "turkishMeaning": "Yumuşak"},
            {"word": "ROSE", "turkishMeaning": "Gül"},
            {"word": "SORT", "turkishMeaning": "Tür, çeşit"}
        ],
        "category": "Wild Animals",
        "theme": "Forest Wildlife",
        "explanation": "Connect letters F, O, R, E, S, T to form: FOREST, REST, SOFT, ROSE, SORT.",
        "contentVersion": 2
    },
    "wc_g7_h_24": {
        "id": "wc_g7_h_24",
        "availableLetters": ["D", "A", "M", "A", "G", "E", "S"],
        "targetWords": [
            {"word": "DAMAGES", "turkishMeaning": "Zararlar"},
            {"word": "DAMAGE", "turkishMeaning": "Zarar, hasar"},
            {"word": "GAMES", "turkishMeaning": "Oyunlar"},
            {"word": "GAME", "turkishMeaning": "Oyun"},
            {"word": "MADE", "turkishMeaning": "Yapılmış"},
            {"word": "AGED", "turkishMeaning": "Yaşlı"}
        ],
        "category": "Environment",
        "theme": "Nature Protection",
        "explanation": "Connect letters D, A, M, A, G, E, S to form: DAMAGES, DAMAGE, GAMES, GAME, MADE, AGED.",
        "contentVersion": 2
    },
    "wc_g7_h_31": {
        "id": "wc_g7_h_31",
        "availableLetters": ["H", "E", "A", "L", "T", "H", "Y"],
        "targetWords": [
            {"word": "HEALTHY", "turkishMeaning": "Sağlıklı"},
            {"word": "HEALTH", "turkishMeaning": "Sağlık"},
            {"word": "HEAL", "turkishMeaning": "İyileşmek"},
            {"word": "HEAT", "turkishMeaning": "Isı, sıcaklık"},
            {"word": "LATE", "turkishMeaning": "Geç"},
            {"word": "THEY", "turkishMeaning": "Onlar"}
        ],
        "category": "Sports & Health",
        "theme": "Healthy Living",
        "explanation": "Connect letters H, E, A, L, T, H, Y to form: HEALTHY, HEALTH, HEAL, HEAT, LATE, THEY.",
        "contentVersion": 2
    },
    "wc_g7_h_33": {
        "id": "wc_g7_h_33",
        "availableLetters": ["B", "E", "A", "C", "H", "E", "S"],
        "targetWords": [
            {"word": "BEACHES", "turkishMeaning": "Kumsallar"},
            {"word": "BEACH", "turkishMeaning": "Kumsal, plaj"},
            {"word": "EACH", "turkishMeaning": "Her biri"},
            {"word": "CHASE", "turkishMeaning": "Kovalamak"},
            {"word": "BASE", "turkishMeaning": "Taban, üs"}
        ],
        "category": "Celebrations & Weather",
        "theme": "Summer Seaside",
        "explanation": "Connect letters B, E, A, C, H, E, S to form: BEACHES, BEACH, EACH, CHASE, BASE.",
        "contentVersion": 2
    },
    "wc_g8_e_38": {
        "id": "wc_g8_e_38",
        "availableLetters": ["F", "L", "A", "T", "S"],
        "targetWords": [
            {"word": "FLATS", "turkishMeaning": "Düzlükler"},
            {"word": "FLAT", "turkishMeaning": "Düz"},
            {"word": "FAST", "turkishMeaning": "Hızlı"},
            {"word": "LAST", "turkishMeaning": "Son"}
        ],
        "category": "Tourism & Geography",
        "theme": "Plateaus & Nature",
        "explanation": "Connect letters F, L, A, T, S to form: FLATS, FLAT, FAST, LAST.",
        "contentVersion": 2
    },
    "wc_g8_m_19": {
        "id": "wc_g8_m_19",
        "availableLetters": ["R", "E", "C", "I", "P", "E"],
        "targetWords": [
            {"word": "RECIPE", "turkishMeaning": "Yemek tarifi"},
            {"word": "PIECE", "turkishMeaning": "Parça, dilim"},
            {"word": "RIPE", "turkishMeaning": "Olgun meyve"},
            {"word": "PRICE", "turkishMeaning": "Fiyat"},
            {"word": "PIE", "turkishMeaning": "Turta"}
        ],
        "category": "In the Kitchen",
        "theme": "Secret Recipe",
        "explanation": "Connect letters R, E, C, I, P, E to form: RECIPE, PIECE, RIPE, PRICE, PIE.",
        "contentVersion": 2
    },
    "wc_g8_m_26": {
        "id": "wc_g8_m_26",
        "availableLetters": ["S", "T", "O", "R", "M", "Y"],
        "targetWords": [
            {"word": "STORMY", "turkishMeaning": "Fırtınalı"},
            {"word": "STORM", "turkishMeaning": "Fırtına"},
            {"word": "STORY", "turkishMeaning": "Hikaye"},
            {"word": "MOST", "turkishMeaning": "En çok"},
            {"word": "SORT", "turkishMeaning": "Sıralamak / tür"}
        ],
        "category": "Natural Forces",
        "theme": "Stormy Weather",
        "explanation": "Connect letters S, T, O, R, M, Y to form: STORMY, STORM, STORY, MOST, SORT.",
        "contentVersion": 2
    },
    "wc_g8_h_10": {
        "id": "wc_g8_h_10",
        "availableLetters": ["P", "H", "O", "N", "E", "S"],
        "targetWords": [
            {"word": "PHONES", "turkishMeaning": "Telefonlar"},
            {"word": "PHONE", "turkishMeaning": "Telefon"},
            {"word": "HOPE", "turkishMeaning": "Umut etmek"},
            {"word": "NOSE", "turkishMeaning": "Burun"},
            {"word": "OPEN", "turkishMeaning": "Açık, açmak"},
            {"word": "SHOP", "turkishMeaning": "Dükkan, alışveriş"}
        ],
        "category": "On the Phone",
        "theme": "Phone Connection",
        "explanation": "Connect letters P, H, O, N, E, S to form: PHONES, PHONE, HOPE, NOSE, OPEN, SHOP.",
        "contentVersion": 2
    },
    "wc_g8_h_28": {
        "id": "wc_g8_h_28",
        "availableLetters": ["H", "E", "A", "T", "E", "D"],
        "targetWords": [
            {"word": "HEATED", "turkishMeaning": "Isıtılmış"},
            {"word": "HEAT", "turkishMeaning": "Isı, ısıtmak"},
            {"word": "DATE", "turkishMeaning": "Tarih / hurma"},
            {"word": "HEAD", "turkishMeaning": "Baş, kafa"},
            {"word": "HAT", "turkishMeaning": "Şapka"},
            {"word": "TEA", "turkishMeaning": "Çay"}
        ],
        "category": "In the Kitchen",
        "theme": "Heated Oven",
        "explanation": "Connect letters H, E, A, T, E, D to form: HEATED, HEAT, DATE, HEAD, HAT, TEA.",
        "contentVersion": 2
    },
    "wc_g8_h_30": {
        "id": "wc_g8_h_30",
        "availableLetters": ["D", "A", "M", "A", "G", "E"],
        "targetWords": [
            {"word": "DAMAGE", "turkishMeaning": "Hasar, zarar"},
            {"word": "GAME", "turkishMeaning": "Oyun"},
            {"word": "MADE", "turkishMeaning": "Yapılmış"},
            {"word": "AGED", "turkishMeaning": "Yaşlı"},
            {"word": "AGE", "turkishMeaning": "Yaş, çağ"}
        ],
        "category": "Natural Forces",
        "theme": "Earthquake Aftermath",
        "explanation": "Connect letters D, A, M, A, G, E to form: DAMAGE, GAME, MADE, AGED, AGE.",
        "contentVersion": 2
    }
}

# Validate every single redesigned puzzle strictly
for pid, pdata in redesigned.items():
    letters = pdata["availableLetters"]
    let_counter = Counter(letters)
    for tw in pdata["targetWords"]:
        w = tw["word"]
        w_counter = Counter(w)
        for char, count in w_counter.items():
            assert let_counter[char] >= count, f"Word {w} in {pid} cannot be formed from {letters} (needs {count} '{char}', has {let_counter[char]})"

print("All 16 redesigned puzzles strictly multiset verified!")

# Apply to bank
updated_count = 0
for grade in ["grade-7", "grade-8"]:
    for diff in ["easy", "medium", "hard"]:
        puzzle_list = bank[grade][diff]
        for i, p in enumerate(puzzle_list):
            if p["id"] in redesigned:
                puzzle_list[i] = redesigned[p["id"]]
                updated_count += 1

print(f"Applied {updated_count} puzzle redesigns to Word Connect bank.")

# Write back
out_text = prefix + json.dumps(bank, indent=2, ensure_ascii=False) + ";\n"
with open('src/data/gamesZone/wordConnectData.ts', 'w', encoding='utf-8') as f:
    f.write(out_text)

print("Saved updated src/data/gamesZone/wordConnectData.ts.")
