import json
from collections import Counter

with open('src/data/gamesZone/wordConnectData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "export const WORD_CONNECT_BANK: WordConnectBank = "
bank = json.loads(text.split(prefix)[1].strip().rstrip(';'))

extra_redesigns = {
    "wc_g7_e_19": {
        "id": "wc_g7_e_19",
        "availableLetters": ["B", "E", "A", "R"],
        "targetWords": [
            {"word": "BEAR", "turkishMeaning": "Ayı"},
            {"word": "BARE", "turkishMeaning": "Çıplak, yalın"},
            {"word": "EAR", "turkishMeaning": "Kulak"},
            {"word": "ERA", "turkishMeaning": "Dönem, çağ"}
        ],
        "category": "Wild Animals",
        "theme": "Forest Bear",
        "explanation": "Connect letters B, E, A, R to form: BEAR, BARE, EAR, ERA.",
        "contentVersion": 2
    },
    "wc_g7_m_04": {
        "id": "wc_g7_m_04",
        "availableLetters": ["B", "R", "A", "V", "E"],
        "targetWords": [
            {"word": "BRAVE", "turkishMeaning": "Cesur"},
            {"word": "BEAR", "turkishMeaning": "Ayı"},
            {"word": "BARE", "turkishMeaning": "Yalın, sade"},
            {"word": "RAVE", "turkishMeaning": "Övgüyle bahsetmek"},
            {"word": "EAR", "turkishMeaning": "Kulak"}
        ],
        "category": "Personality",
        "theme": "Courageous Friends",
        "explanation": "Connect letters B, R, A, V, E to form: BRAVE, BEAR, BARE, RAVE, EAR.",
        "contentVersion": 2
    },
    "wc_g7_m_10": {
        "id": "wc_g7_m_10",
        "availableLetters": ["A", "W", "A", "R", "D", "S"],
        "targetWords": [
            {"word": "AWARDS", "turkishMeaning": "Ödüller"},
            {"word": "AWARD", "turkishMeaning": "Ödül"},
            {"word": "DRAW", "turkishMeaning": "Çizmek / berabere"},
            {"word": "RAW", "turkishMeaning": "Ham, çiğ"},
            {"word": "SAD", "turkishMeaning": "Üzgün"}
        ],
        "category": "Biographies",
        "theme": "Honors & Achievements",
        "explanation": "Connect letters A, W, A, R, D, S to form: AWARDS, AWARD, DRAW, RAW, SAD.",
        "contentVersion": 2
    },
    "wc_g7_m_28": {
        "id": "wc_g7_m_28",
        "availableLetters": ["W", "A", "T", "E", "R", "S"],
        "targetWords": [
            {"word": "WATERS", "turkishMeaning": "Sular"},
            {"word": "WATER", "turkishMeaning": "Su"},
            {"word": "SWEAT", "turkishMeaning": "Ter"},
            {"word": "WASTE", "turkishMeaning": "Atık / israf"},
            {"word": "STAR", "turkishMeaning": "Yıldız"}
        ],
        "category": "Environment",
        "theme": "Water Conservation",
        "explanation": "Connect letters W, A, T, E, R, S to form: WATERS, WATER, SWEAT, WASTE, STAR.",
        "contentVersion": 2
    },
    "wc_g7_h_09": {
        "id": "wc_g7_h_09",
        "availableLetters": ["R", "A", "B", "B", "I", "T", "S"],
        "targetWords": [
            {"word": "RABBITS", "turkishMeaning": "Tavşanlar"},
            {"word": "RABBIT", "turkishMeaning": "Tavşan"},
            {"word": "BAIT", "turkishMeaning": "Yem"},
            {"word": "BATS", "turkishMeaning": "Yarasalar"},
            {"word": "STAR", "turkishMeaning": "Yıldız"}
        ],
        "category": "Wild Animals",
        "theme": "Forest Rabbits",
        "explanation": "Connect letters R, A, B, B, I, T, S to form: RABBITS, RABBIT, BAIT, BATS, STAR.",
        "contentVersion": 2
    },
    "wc_g7_h_25": {
        "id": "wc_g7_h_25",
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
        "theme": "Environmental Damage",
        "explanation": "Connect letters D, A, M, A, G, E, S to form: DAMAGES, DAMAGE, GAMES, GAME, MADE, AGED.",
        "contentVersion": 2
    },
    "wc_g8_e_19": {
        "id": "wc_g8_e_19",
        "availableLetters": ["R", "A", "F", "T", "S"],
        "targetWords": [
            {"word": "RAFTS", "turkishMeaning": "Botlar"},
            {"word": "RAFT", "turkishMeaning": "Sal / bot"},
            {"word": "FAST", "turkishMeaning": "Hızlı"},
            {"word": "STAR", "turkishMeaning": "Yıldız"}
        ],
        "category": "Adventures",
        "theme": "River Raft",
        "explanation": "Connect letters R, A, F, T, S to form: RAFTS, RAFT, FAST, STAR.",
        "contentVersion": 2
    },
    "wc_g8_e_36": {
        "id": "wc_g8_e_36",
        "availableLetters": ["D", "I", "V", "E", "R"],
        "targetWords": [
            {"word": "DIVER", "turkishMeaning": "Dalgıç"},
            {"word": "DIVE", "turkishMeaning": "Dalmak"},
            {"word": "RIDE", "turkishMeaning": "Binmek / sürüş"},
            {"word": "RED", "turkishMeaning": "Kırmızı"}
        ],
        "category": "Adventures",
        "theme": "Scuba Diving",
        "explanation": "Connect letters D, I, V, E, R to form: DIVER, DIVE, RIDE, RED.",
        "contentVersion": 2
    },
    "wc_g8_m_17": {
        "id": "wc_g8_m_17",
        "availableLetters": ["G", "U", "I", "D", "E", "S"],
        "targetWords": [
            {"word": "GUIDES", "turkishMeaning": "Rehberler"},
            {"word": "GUIDE", "turkishMeaning": "Rehber"},
            {"word": "SIDE", "turkishMeaning": "Taraf, yan"},
            {"word": "DIG", "turkishMeaning": "Kazmak"},
            {"word": "DUE", "turkishMeaning": "Vadesi gelen / bağlı"}
        ],
        "category": "Tourism",
        "theme": "Tour Guides",
        "explanation": "Connect letters G, U, I, D, E, S to form: GUIDES, GUIDE, SIDE, DIG, DUE.",
        "contentVersion": 2
    },
    "wc_g8_h_29": {
        "id": "wc_g8_h_29",
        "availableLetters": ["D", "A", "M", "A", "G", "E"],
        "targetWords": [
            {"word": "DAMAGE", "turkishMeaning": "Hasar, zarar"},
            {"word": "GAME", "turkishMeaning": "Oyun"},
            {"word": "MADE", "turkishMeaning": "Yapılmış"},
            {"word": "AGED", "turkishMeaning": "Yaşlı"},
            {"word": "AGE", "turkishMeaning": "Yaş, çağ"}
        ],
        "category": "Natural Forces",
        "theme": "Disaster Damage",
        "explanation": "Connect letters D, A, M, A, G, E to form: DAMAGE, GAME, MADE, AGED, AGE.",
        "contentVersion": 2
    }
}

# Strictly multiset validate all 10
for pid, pdata in extra_redesigns.items():
    letters = pdata["availableLetters"]
    let_counter = Counter(letters)
    for tw in pdata["targetWords"]:
        w = tw["word"]
        w_counter = Counter(w)
        for char, count in w_counter.items():
            assert let_counter[char] >= count, f"Word {w} in {pid} cannot be formed from {letters} (needs {count} '{char}', has {let_counter[char]})"

print("All 10 extra puzzles strictly multiset verified!")

for grade in bank:
    for diff in bank[grade]:
        for i, p in enumerate(bank[grade][diff]):
            if p["id"] in extra_redesigns:
                bank[grade][diff][i] = extra_redesigns[p["id"]]

out_text = prefix + json.dumps(bank, indent=2, ensure_ascii=False) + ";\n"
with open('src/data/gamesZone/wordConnectData.ts', 'w', encoding='utf-8') as f:
    f.write(out_text)

print("Saved updated src/data/gamesZone/wordConnectData.ts.")
