# scripts/build_memory_match.py
import json
import os

print("=== STARTING MEMORY MATCH DATA BANK BUILDER ===")

# --- GRADE 7 MEB CURRICULUM DATA POOLS ---
G7_MODE_A_TOPICS = [
    {
        "topic": "Appearance & Personality",
        "pairs": [
            ("honest", "dürüst"), ("generous", "cömert"), ("punctual", "dakik"), ("stubborn", "inatçı"),
            ("outgoing", "cana yakın"), ("clumsy", "sakar"), ("selfish", "bencil"), ("easy-going", "uyumlu"),
            ("cheerful", "neşeli"), ("smart", "akıllı"), ("patient", "sabırlı"), ("polite", "kibar"),
            ("fair", "adil"), ("shy", "utangaç"), ("tall", "uzun boylu"), ("slim", "zayıf, ince")
        ]
    },
    {
        "topic": "Sports",
        "pairs": [
            ("spectator", "seyirci"), ("achieve", "başarmak"), ("draw", "berabere"), ("equipment", "ekipman"),
            ("indoor", "kapalı alan"), ("outdoor", "açık hava"), ("medal", "madalya"), ("defeat", "yenmek"),
            ("train", "antrenman"), ("injury", "sakatlık"), ("champion", "şampiyon"), ("referee", "hakem"),
            ("court", "kort / saha"), ("success", "başarı"), ("win", "kazanmak"), ("lose", "kaybetmek")
        ]
    },
    {
        "topic": "Biographies",
        "pairs": [
            ("grow up", "büyümek"), ("graduate", "mezun olmak"), ("award", "ödül"), ("invent", "icat etmek"),
            ("brilliant", "dahi, parlak"), ("marry", "evlenmek"), ("discover", "keşfetmek"), ("career", "kariyer"),
            ("scientist", "bilim insanı"), ("born", "doğmak"), ("die", "vefat etmek"), ("experience", "deneyim"),
            ("prize", "mükafat"), ("author", "yazar"), ("achievement", "başarı"), ("college", "yüksekokul")
        ]
    },
    {
        "topic": "Wild Animals",
        "pairs": [
            ("carnivore", "etobur"), ("herbivore", "otobur"), ("reptile", "sürüngen"), ("mammal", "memeli"),
            ("extinct", "nesli tükenmiş"), ("habitat", "yaşam alanı"), ("endangered", "nesli tehlikede"), ("prey", "av"),
            ("survive", "hayatta kalmak"), ("poisonous", "zehirli"), ("jungle", "baltalanmamış orman"), ("cage", "kafes"),
            ("protect", "korumak"), ("hunt", "avlamak"), ("wing", "kanat"), ("sharp", "keskin")
        ]
    },
    {
        "topic": "Television",
        "pairs": [
            ("documentary", "belgesel"), ("soap opera", "pembe dizi"), ("sitcom", "durum komedisi"), ("commercials", "reklamlar"),
            ("director", "yönetmen"), ("educational", "eğitici"), ("channel", "kanal"), ("viewer", "izleyici"),
            ("series", "dizi"), ("remote control", "uzaktan kumanda"), ("quiz show", "bilgi yarışması"), ("recommend", "tavsiye etmek"),
            ("prefer", "tercih etmek"), ("boring", "sıkıcı"), ("exciting", "heyecan verici"), ("actor", "oyuncu")
        ]
    },
    {
        "topic": "Celebrations",
        "pairs": [
            ("invitation", "davetiye"), ("decorate", "süslemek"), ("guest", "misafir"), ("beverage", "içecek"),
            ("wrap", "paketlemek"), ("celebrate", "kutlamak"), ("candle", "mum"), ("host", "ev sahibi"),
            ("balloon", "balon"), ("costume", "kostüm"), ("present", "hediye"), ("party", "parti"),
            ("music", "müzik"), ("confetti", "konfeti"), ("prepare", "hazırlamak"), ("organize", "düzenlemek")
        ]
    },
    {
        "topic": "Dreams",
        "pairs": [
            ("predict", "tahmin etmek"), ("imagine", "hayal etmek"), ("peaceful", "huzurlu"), ("receive", "teslim almak"),
            ("robot", "robot"), ("universe", "evren"), ("future", "gelecek"), ("flying car", "uçan araba"),
            ("space trip", "uzay yolculuğu"), ("wealthy", "zengin"), ("health", "sağlık"), ("dream", "rüya"),
            ("hope", "umut etmek"), ("believe", "inanmak"), ("world", "dünya"), ("travel", "seyahat etmek")
        ]
    },
    {
        "topic": "Public Buildings",
        "pairs": [
            ("bakery", "fırın"), ("chemist", "eczane"), ("police station", "polis karakolu"), ("art gallery", "sanat galerisi"),
            ("post office", "postane"), ("fire station", "itfaiye"), ("library", "kütüphane"), ("museum", "müze"),
            ("city hall", "belediye"), ("theatre", "tiyatro"), ("hospital", "hastane"), ("bookshop", "kitapçı"),
            ("cinema", "sinema"), ("bank", "banka"), ("pharmacy", "eczane deposu"), ("shopping mall", "alışveriş merkezi")
        ]
    },
    {
        "topic": "Environment",
        "pairs": [
            ("pollute", "kirletmek"), ("recycle", "geri dönüştürmek"), ("solar energy", "güneş enerjisi"), ("waste", "atık"),
            ("eco-friendly", "çevre dostu"), ("deforestation", "ormansızlaşma"), ("global warming", "küresel ısınma"), ("rubbish", "çöp"),
            ("clean air", "temiz hava"), ("save", "tasarruf etmek"), ("plant trees", "ağaç dikmek"), ("public transport", "toplu taşıma"),
            ("plastic", "plastik"), ("nature", "doğa"), ("planet", "gezegen"), ("threat", "tehdit")
        ]
    },
    {
        "topic": "Planets",
        "pairs": [
            ("orbit", "yörünge"), ("solar system", "güneş sistemi"), ("telescope", "teleskop"), ("gravity", "yerçekimi"),
            ("satellite", "uydu"), ("surface", "yüzey"), ("asteroid", "asteroit"), ("space shuttle", "uzay mekiği"),
            ("planet", "gezegen"), ("meteor", "göktaşı"), ("distance", "mesafe"), ("mission", "uzay görevi"),
            ("sun", "güneş"), ("moon", "ay"), ("star", "yıldız"), ("space", "uzay")
        ]
    }
]

G7_MODE_B_TOPICS = [
    {
        "topic": "Appearance & Personality",
        "pairs": [
            ("honest", "always telling the truth"),
            ("generous", "sharing and helping others"),
            ("punctual", "never arriving late"),
            ("stubborn", "not changing your mind"),
            ("outgoing", "friendly and energetic"),
            ("clumsy", "often dropping things"),
            ("selfish", "caring only about yourself"),
            ("easy-going", "relaxed and peaceful"),
            ("cheerful", "smiling and full of joy"),
            ("smart", "clever and quick to learn"),
            ("patient", "able to wait calmly"),
            ("polite", "having good manners")
        ]
    },
    {
        "topic": "Sports",
        "pairs": [
            ("spectator", "a person watching a match"),
            ("achieve", "reaching a goal with success"),
            ("draw", "ending a game with equal scores"),
            ("equipment", "tools and items for sport"),
            ("indoor", "taking place inside a hall"),
            ("outdoor", "taking place in open air"),
            ("medal", "a metal prize for winners"),
            ("defeat", "beating an opponent in game"),
            ("train", "practicing to get better"),
            ("injury", "physical harm to the body"),
            ("champion", "the winner of a tournament"),
            ("referee", "official who enforces rules")
        ]
    },
    {
        "topic": "Biographies",
        "pairs": [
            ("grow up", "developing from child to adult"),
            ("graduate", "finishing school or university"),
            ("award", "a prize for great success"),
            ("invent", "creating something totally new"),
            ("brilliant", "exceptionally clever and gifted"),
            ("discover", "finding something first time"),
            ("career", "a person's profession or job"),
            ("author", "a person who writes books"),
            ("scientist", "person doing research in science"),
            ("experience", "knowledge gained over time"),
            ("prize", "something won in competition"),
            ("famous", "known by many people")
        ]
    },
    {
        "topic": "Wild Animals",
        "pairs": [
            ("carnivore", "an animal that eats meat"),
            ("herbivore", "an animal that eats plants"),
            ("reptile", "a cold-blooded crawling creature"),
            ("mammal", "animal that gives milk to young"),
            ("extinct", "no longer living on Earth"),
            ("habitat", "natural living home of species"),
            ("endangered", "at serious risk of dying out"),
            ("prey", "an animal hunted for food"),
            ("survive", "staying alive in danger"),
            ("poisonous", "causing sickness with venom"),
            ("jungle", "a dense tropical forest"),
            ("protect", "keeping safe from harm")
        ]
    },
    {
        "topic": "Television & Celebrations",
        "pairs": [
            ("documentary", "film showing facts about reality"),
            ("soap opera", "drama series about daily lives"),
            ("sitcom", "a funny show about daily life"),
            ("commercials", "video advertisements on screen"),
            ("director", "person guiding actors in films"),
            ("educational", "giving helpful knowledge"),
            ("invitation", "written card inviting a guest"),
            ("decorate", "making a room look festive"),
            ("beverage", "any liquid for drinking"),
            ("celebrate", "marking a special happy day"),
            ("guest", "visitor welcomed to an event"),
            ("candle", "wax stick that gives light")
        ]
    },
    {
        "topic": "Environment & Planets",
        "pairs": [
            ("pollute", "making nature dirty with waste"),
            ("recycle", "turning used trash into new items"),
            ("solar energy", "power produced by sunlight"),
            ("deforestation", "cutting down whole forests"),
            ("orbit", "curved path around a planet"),
            ("telescope", "tool for looking at stars"),
            ("gravity", "force pulling things down"),
            ("satellite", "machine orbiting around Earth"),
            ("eco-friendly", "safe for nature and wildlife"),
            ("solar system", "sun and planets moving around it"),
            ("surface", "the outer layer of a planet"),
            ("asteroid", "rock moving through outer space")
        ]
    }
]

# --- GRADE 8 MEB CURRICULUM DATA POOLS ---
G8_MODE_A_TOPICS = [
    {
        "topic": "Friendship",
        "pairs": [
            ("count on", "güvenmek"), ("back up", "desteklemek"), ("honest", "dürüst"), ("trustworthy", "güvenilir"),
            ("keep secret", "sır saklamak"), ("support", "destek olmak"), ("laid-back", "rahat, tasasız"), ("mate", "yakın arkadaş"),
            ("argue", "tartışmak"), ("share", "paylaşmak"), ("get on well", "iyi geçinmek"), ("loyal", "sadık"),
            ("buddy", "kanka"), ("truth", "gerçek"), ("promise", "söz"), ("true friend", "gerçek dost")
        ]
    },
    {
        "topic": "Teen Life",
        "pairs": [
            ("snob", "züppe"), ("unbearable", "katlanılmaz"), ("trendy", "modaya uygun"), ("prefer", "tercih etmek"),
            ("casual", "günlük, rahat"), ("pitch a tent", "çadır kurmak"), ("fond of", "düşkün olmak"), ("impressive", "etkileyici"),
            ("energetic", "enerjik"), ("keen on", "meraklı olmak"), ("fashionable", "şık, popüler"), ("campfire", "kamp ateşi"),
            ("regular", "düzenli"), ("lifestyle", "yaşam tarzı"), ("music band", "müzik grubu"), ("daily routine", "günlük rutin")
        ]
    },
    {
        "topic": "In the Kitchen",
        "pairs": [
            ("chop", "doğramak"), ("peel", "kabuk soymak"), ("grate", "rendelemek"), ("sprinkle", "serpmek"),
            ("boil", "kaynatmak"), ("bake", "fırında pişirmek"), ("knead", "yoğurmak"), ("ingredient", "yemek malzemesi"),
            ("recipe", "yemek tarifi"), ("fry", "kızartmak"), ("slice", "dilimlemek"), ("mix", "karıştırmak"),
            ("roast", "fırında kızartmak"), ("pour", "dökmek"), ("pan", "tava"), ("bowl", "kase")
        ]
    },
    {
        "topic": "On the Phone",
        "pairs": [
            ("connect", "bağlamak"), ("hold on", "hatta beklemek"), ("memo", "kısa not"), ("available", "müsait"),
            ("dial", "numara çevirmek"), ("leave message", "mesaj bırakmak"), ("engaged", "meşgul hat"), ("communicate", "iletişim kurmak"),
            ("hang up", "telefonu kapatmak"), ("call back", "geri aramak"), ("pick up", "telefonu açmak"), ("line", "telefon hattı"),
            ("extension", "dahili numara"), ("contact", "irtibat kurmak"), ("conversation", "telefon sohbeti"), ("voicemail", "sesli mesaj")
        ]
    },
    {
        "topic": "The Internet",
        "pairs": [
            ("download", "indirmek"), ("upload", "yüklemek"), ("browser", "internet tarayıcısı"), ("attachment", "e-posta eki"),
            ("confirm", "onaylamak"), ("password", "şifre"), ("wireless", "kablosuz"), ("log in", "giriş yapmak"),
            ("search engine", "arama motoru"), ("account", "hesap"), ("comment", "yorum yapmak"), ("social network", "sosyal ağ"),
            ("screen", "ekran"), ("safe", "güvenli"), ("click", "tıklamak"), ("website", "web sitesi")
        ]
    },
    {
        "topic": "Adventures",
        "pairs": [
            ("challenging", "zorlu"), ("extreme", "sıra dışı, uç"), ("adrenaline", "adrenalin"), ("risk", "risk"),
            ("dangerous", "tehlikeli"), ("paragliding", "yamaç paraşütü"), ("breathtaking", "nefes kesici"), ("equipment", "ekipman"),
            ("courage", "cesaret"), ("rafting", "rafting"), ("caving", "mağaracılık"), ("scuba diving", "tüplü dalış"),
            ("helmet", "kask"), ("bungee jumping", "bungee jumping"), ("expert", "uzman"), ("thrilling", "heyecan dolu")
        ]
    },
    {
        "topic": "Tourism",
        "pairs": [
            ("historic site", "tarihi alan"), ("ancient", "antik, çok eski"), ("destination", "varış yeri"), ("accommodation", "konaklama"),
            ("local cuisine", "yerel mutfak"), ("architecture", "mimari"), ("attraction", "turistik yer"), ("souvenir", "hediyelik eşya"),
            ("sightseeing", "şehir turu"), ("all-inclusive", "her şey dahil"), ("culture", "kültür"), ("guide", "rehber"),
            ("temple", "tapınak"), ("castle", "kale"), ("monument", "anıt"), ("scenery", "manzara")
        ]
    },
    {
        "topic": "Chores",
        "pairs": [
            ("do the laundry", "çamaşır yıkamak"), ("vacuum the floor", "yerleri süpürmek"), ("dust the shelves", "toz almak"), ("take out trash", "çöpü çıkarmak"),
            ("tidy up", "toparlamak"), ("load dishwasher", "bulaşık makinesini doldurmak"), ("iron clothes", "ütü yapmak"), ("clean bathroom", "banyoyu temizlemek"),
            ("make the bed", "yatağı toplamak"), ("set the table", "masayı kurmak"), ("wash dishes", "bulaşık yıkamak"), ("feed pet", "evcil hayvanı beslemek"),
            ("chore", "ev işi"), ("responsibility", "sorumluluk"), ("sweep", "süpürmek"), ("mop", "paspaslamak")
        ]
    },
    {
        "topic": "Science",
        "pairs": [
            ("discover", "keşfetmek"), ("invent", "icat etmek"), ("experiment", "deney yapmak"), ("laboratory", "laboratuvar"),
            ("test tube", "deney tüpü"), ("vaccine", "aşı"), ("cure", "tedavi"), ("scientific", "bilimsel"),
            ("microscope", "mikroskop"), ("cell", "hücre"), ("chemical", "kimyasal madde"), ("research", "araştırma"),
            ("gravity", "yerçekimi"), ("inventor", "mucit"), ("disease", "hastalık"), ("development", "gelişme")
        ]
    },
    {
        "topic": "Natural Forces",
        "pairs": [
            ("earthquake", "deprem"), ("flood", "sel"), ("tsunami", "tsunami"), ("landslide", "heyelan"),
            ("avalanche", "çığ"), ("drought", "kuraklık"), ("volcanic eruption", "volkanik patlama"), ("rescue team", "kurtarma ekibi"),
            ("disaster", "doğal afet"), ("magnitude", "büyüklük"), ("damage", "hasar"), ("survivor", "kurtulan kişi"),
            ("casualty", "kayıp"), ("emergency", "acil durum"), ("warning", "uyarı"), ("destroy", "yıkmak")
        ]
    }
]

G8_MODE_B_TOPICS = [
    {
        "topic": "Friendship",
        "pairs": [
            ("count on", "trusting and depending on someone"),
            ("back up", "supporting and helping a friend"),
            ("honest", "always telling the truth directly"),
            ("trustworthy", "worthy of full trust and respect"),
            ("keep secret", "never telling private information"),
            ("support", "giving encouragement and help"),
            ("laid-back", "relaxed and not easily worried"),
            ("mate", "a loyal friend you spend time with"),
            ("argue", "speaking angrily with someone"),
            ("share", "giving a portion to someone else"),
            ("loyal", "faithful and devoted to friends"),
            ("truth", "facts that are completely real")
        ]
    },
    {
        "topic": "Teen Life & Kitchen",
        "pairs": [
            ("unbearable", "too painful or unpleasant to tolerate"),
            ("snob", "acting superior to other people"),
            ("trendy", "following modern popular fashion"),
            ("chop", "cutting food into small pieces with knife"),
            ("peel", "taking off outer skin of vegetables"),
            ("grate", "rubbing cheese or food into shreds"),
            ("sprinkle", "dropping spices or sugar lightly"),
            ("boil", "heating liquid until it bubbles"),
            ("bake", "cooking dough in a heated oven"),
            ("knead", "pressing dough firmly with your hands"),
            ("recipe", "instructions for cooking a meal"),
            ("ingredient", "a food item needed in a recipe")
        ]
    },
    {
        "topic": "Phone & Internet",
        "pairs": [
            ("connect", "joining two callers together on line"),
            ("hold on", "waiting for a short time on call"),
            ("available", "free to speak or join a meeting"),
            ("engaged", "busy talking to another person"),
            ("download", "saving online data onto your device"),
            ("upload", "sending files from device to internet"),
            ("browser", "software used for viewing web pages"),
            ("attachment", "a document file added to an email"),
            ("password", "secret characters protecting an account"),
            ("search engine", "tool for looking up info online"),
            ("confirm", "verifying that an action is valid"),
            ("wireless", "connecting with signals not wires")
        ]
    },
    {
        "topic": "Adventures & Tourism",
        "pairs": [
            ("challenging", "demanding great effort and skill"),
            ("extreme", "very high or intense in degree"),
            ("adrenaline", "body chemical caused by high excitement"),
            ("breathtaking", "amazingly beautiful and exciting"),
            ("paragliding", "flying through the air with parachute"),
            ("historic site", "ancient place with history significance"),
            ("destination", "place someone is traveling toward"),
            ("accommodation", "a place to sleep while on travel"),
            ("local cuisine", "typical regional cooking and dishes"),
            ("souvenir", "gift bought to remember a trip"),
            ("architecture", "the artistic design of buildings"),
            ("attraction", "famous sight people love visiting")
        ]
    },
    {
        "topic": "Chores & Responsibilities",
        "pairs": [
            ("do the laundry", "washing dirty clothing and towels"),
            ("vacuum the floor", "cleaning carpet using vacuum suction"),
            ("dust the shelves", "wiping away powder from furniture"),
            ("take out trash", "carrying bags of waste outside"),
            ("tidy up", "making a messy room clean and neat"),
            ("load dishwasher", "placing dirty dishes into machine"),
            ("iron clothes", "smoothing wrinkled fabric with heat"),
            ("clean bathroom", "scrubbing sink and tiles thoroughly"),
            ("make the bed", "straightening sheets and blankets"),
            ("responsibility", "a duty someone is expected to do"),
            ("chore", "regular routine task around home"),
            ("set the table", "laying plates and forks for a meal")
        ]
    },
    {
        "topic": "Science & Natural Forces",
        "pairs": [
            ("discover", "finding something completely new"),
            ("invent", "creating a machine never made before"),
            ("experiment", "scientific test to prove an idea"),
            ("laboratory", "room built for scientific testing"),
            ("vaccine", "medicine that protects from disease"),
            ("earthquake", "sudden violent shaking of the earth"),
            ("flood", "huge amount of water covering land"),
            ("tsunami", "giant ocean wave from undersea quake"),
            ("avalanche", "huge mass of snow falling rapidly"),
            ("drought", "long period with zero rain and water"),
            ("rescue team", "group saving people from disaster"),
            ("disaster", "terrible event causing great damage")
        ]
    }
]

# --- CURATED MODE C ICON PAIRS (100% verified against MEMORY_MATCH_ICON_REGISTRY) ---
# Verified icon keys:
# dog, cat, bird, fish, sun, moon, star, cloud, flower, tree, book, computer, camera,
# phone, car, bus, bicycle, plane, train, rocket, apple, pizza, coffee, utensils,
# home, bed, key, trophy, music, gift, umbrella, heart, microscope, telescope,
# compass, globe, map, flame, flag, shield, scissors, wifi, download, mail, smile

ICON_ITEMS_POOL = [
    ("dog", "dog", "A faithful domestic dog"),
    ("cat", "cat", "A cute pet cat"),
    ("bird", "bird", "A flying wild bird"),
    ("fish", "fish", "A swimming aquatic fish"),
    ("sun", "sun", "The bright shining sun"),
    ("moon", "moon", "The glowing night moon"),
    ("star", "star", "A bright shining star"),
    ("cloud", "cloud", "A fluffy sky cloud"),
    ("flower", "flower", "A colorful blooming flower"),
    ("tree", "tree", "A tall green tree"),
    ("book", "book", "An educational reading book"),
    ("computer", "computer", "A modern desktop computer"),
    ("camera", "camera", "A photography camera"),
    ("phone", "phone", "A smart mobile phone"),
    ("car", "car", "A four-wheel motor car"),
    ("bus", "bus", "A public city bus"),
    ("bicycle", "bicycle", "A two-wheel pedal bicycle"),
    ("plane", "plane", "A passenger flight airplane"),
    ("train", "train", "A passenger railway train"),
    ("rocket", "rocket", "A space exploration rocket"),
    ("apple", "apple", "A fresh red apple"),
    ("pizza", "pizza", "A hot slice of pizza"),
    ("coffee", "coffee", "A warm cup of coffee"),
    ("utensils", "utensils", "Kitchen fork and knife"),
    ("home", "home", "A comfortable family house"),
    ("bed", "bed", "A cozy bedroom bed"),
    ("key", "key", "A metal door lock key"),
    ("trophy", "trophy", "A gold championship trophy"),
    ("music", "music", "Melodic musical notes"),
    ("gift", "gift", "A wrapped birthday gift"),
    ("umbrella", "umbrella", "A rainy day umbrella"),
    ("heart", "heart", "A warm loving heart"),
    ("microscope", "microscope", "A science laboratory microscope"),
    ("telescope", "telescope", "An astronomy star telescope"),
    ("compass", "compass", "A direction finding compass"),
    ("globe", "globe", "A world planet globe"),
    ("map", "map", "A travel geographical map"),
    ("flame", "flame", "A warm camping fire flame"),
    ("flag", "flag", "A national country flag"),
    ("shield", "shield", "A protective defense shield"),
    ("scissors", "scissors", "A pair of cutting scissors"),
    ("wifi", "wifi", "A wireless internet connection"),
    ("download", "download", "A digital data download"),
    ("mail", "mail", "A written postal mail letter"),
    ("smile", "smile", "A friendly smiling face")
]

def generate_sets():
    bank = {
        "grade-7": {"easy": [], "medium": [], "hard": []},
        "grade-8": {"easy": [], "medium": [], "hard": []}
    }

    diff_pairs_count = {
        "easy": 4,
        "medium": 6,
        "hard": 8
    }

    all_set_ids = set()
    all_pair_ids = set()

    for grade_id, g_prefix, mode_a_pools, mode_b_pools in [
        ("grade-7", "g7", G7_MODE_A_TOPICS, G7_MODE_B_TOPICS),
        ("grade-8", "g8", G8_MODE_A_TOPICS, G8_MODE_B_TOPICS)
    ]:
        for diff in ["easy", "medium", "hard"]:
            pair_target = diff_pairs_count[diff]
            diff_code = diff[0] # e, m, h

            # We need 40 sets per difficulty:
            # Sets 01-16: Mode A (16 sets)
            # Sets 17-30: Mode B (14 sets)
            # Sets 31-40: Mode C (10 sets)

            # --- MODE A (16 sets) ---
            for s_idx in range(1, 17):
                set_num = f"{s_idx:02d}"
                set_id = f"mm_{g_prefix}_{diff_code}_{set_num}"
                assert set_id not in all_set_ids
                all_set_ids.add(set_id)

                topic_obj = mode_a_pools[(s_idx - 1) % len(mode_a_pools)]
                topic_name = topic_obj["topic"]
                topic_pairs = topic_obj["pairs"]

                # Pick offset based on difficulty and set_num to ensure rich variety
                offset = ((s_idx - 1) * 3 + (0 if diff == 'easy' else 2 if diff == 'medium' else 4)) % len(topic_pairs)
                selected_raw_pairs = []
                for p_i in range(pair_target):
                    item = topic_pairs[(offset + p_i) % len(topic_pairs)]
                    selected_raw_pairs.append(item)

                # Ensure no duplicate words inside set
                seen_left = set()
                seen_right = set()
                clean_pairs = []
                for left, right in selected_raw_pairs:
                    if left in seen_left or right in seen_right:
                        # Find alternative from topic_pairs
                        for alt_l, alt_r in topic_pairs:
                            if alt_l not in seen_left and alt_r not in seen_right:
                                left, right = alt_l, alt_r
                                break
                    seen_left.add(left)
                    seen_right.add(right)
                    clean_pairs.append((left, right))

                pairs = []
                for p_num, (left, right) in enumerate(clean_pairs, 1):
                    pair_id = f"p_{g_prefix}_{diff_code}_{set_num}_{p_num}"
                    assert pair_id not in all_pair_ids
                    all_pair_ids.add(pair_id)
                    pairs.append({
                        "pairId": pair_id,
                        "leftText": left,
                        "rightText": right,
                        "mode": "word_meaning",
                        "grade": grade_id,
                        "difficulty": diff,
                        "topic": topic_name,
                        "explanation": f"\"{left}\" translates to \"{right}\" in Turkish ({topic_name})."
                    })

                bank[grade_id][diff].append({
                    "id": set_id,
                    "grade": grade_id,
                    "difficulty": diff,
                    "mode": "word_meaning",
                    "topic": topic_name,
                    "pairs": pairs,
                    "contentVersion": 1
                })

            # --- MODE B (14 sets, indices 17 to 30) ---
            for s_idx in range(17, 31):
                set_num = f"{s_idx:02d}"
                set_id = f"mm_{g_prefix}_{diff_code}_{set_num}"
                assert set_id not in all_set_ids
                all_set_ids.add(set_id)

                topic_obj = mode_b_pools[(s_idx - 17) % len(mode_b_pools)]
                topic_name = topic_obj["topic"]
                topic_pairs = topic_obj["pairs"]

                offset = ((s_idx - 17) * 2 + (0 if diff == 'easy' else 1 if diff == 'medium' else 3)) % len(topic_pairs)
                selected_raw_pairs = []
                for p_i in range(pair_target):
                    item = topic_pairs[(offset + p_i) % len(topic_pairs)]
                    selected_raw_pairs.append(item)

                seen_left = set()
                seen_right = set()
                clean_pairs = []
                for left, right in selected_raw_pairs:
                    if left in seen_left or right in seen_right:
                        for alt_l, alt_r in topic_pairs:
                            if alt_l not in seen_left and alt_r not in seen_right:
                                left, right = alt_l, alt_r
                                break
                    seen_left.add(left)
                    seen_right.add(right)
                    clean_pairs.append((left, right))

                pairs = []
                for p_num, (left, right) in enumerate(clean_pairs, 1):
                    pair_id = f"p_{g_prefix}_{diff_code}_{set_num}_{p_num}"
                    assert pair_id not in all_pair_ids
                    all_pair_ids.add(pair_id)
                    pairs.append({
                        "pairId": pair_id,
                        "leftText": left,
                        "rightText": right,
                        "mode": "word_definition",
                        "grade": grade_id,
                        "difficulty": diff,
                        "topic": topic_name,
                        "explanation": f"\"{left}\" is defined as: {right}."
                    })

                bank[grade_id][diff].append({
                    "id": set_id,
                    "grade": grade_id,
                    "difficulty": diff,
                    "mode": "word_definition",
                    "topic": topic_name,
                    "pairs": pairs,
                    "contentVersion": 1
                })

            # --- MODE C (10 sets, indices 31 to 40) ---
            for s_idx in range(31, 41):
                set_num = f"{s_idx:02d}"
                set_id = f"mm_{g_prefix}_{diff_code}_{set_num}"
                assert set_id not in all_set_ids
                all_set_ids.add(set_id)

                topic_name = "Visual Vocabulary & Icons"
                # Select distinct icons from ICON_ITEMS_POOL
                offset = ((s_idx - 31) * pair_target + (0 if diff == 'easy' else 3 if diff == 'medium' else 7)) % len(ICON_ITEMS_POOL)
                selected_icons = []
                for p_i in range(pair_target):
                    item = ICON_ITEMS_POOL[(offset + p_i) % len(ICON_ITEMS_POOL)]
                    selected_icons.append(item)

                seen_words = set()
                clean_icons = []
                for word, icon_key, desc in selected_icons:
                    if word in seen_words:
                        for alt_w, alt_k, alt_d in ICON_ITEMS_POOL:
                            if alt_w not in seen_words:
                                word, icon_key, desc = alt_w, alt_k, alt_d
                                break
                    seen_words.add(word)
                    clean_icons.append((word, icon_key, desc))

                pairs = []
                for p_num, (word, icon_key, desc) in enumerate(clean_icons, 1):
                    pair_id = f"p_{g_prefix}_{diff_code}_{set_num}_{p_num}"
                    assert pair_id not in all_pair_ids
                    all_pair_ids.add(pair_id)
                    pairs.append({
                        "pairId": pair_id,
                        "leftText": word,
                        "rightText": desc,
                        "mode": "word_picture",
                        "grade": grade_id,
                        "difficulty": diff,
                        "topic": topic_name,
                        "imageRef": icon_key,
                        "explanation": f"\"{word}\" matches the {icon_key} illustration ({desc})."
                    })

                bank[grade_id][diff].append({
                    "id": set_id,
                    "grade": grade_id,
                    "difficulty": diff,
                    "mode": "word_picture",
                    "topic": topic_name,
                    "pairs": pairs,
                    "contentVersion": 1
                })

    return bank

bank = generate_sets()

# --- VALIDATION ---
total_sets = 0
total_pairs = 0
for grade in ["grade-7", "grade-8"]:
    for diff in ["easy", "medium", "hard"]:
        sets = bank[grade][diff]
        print(f"[{grade}] [{diff}] Count: {len(sets)} sets")
        assert len(sets) == 40, f"Expected 40 sets for {grade} {diff}, got {len(sets)}"
        total_sets += len(sets)

        expected_pairs = 4 if diff == "easy" else 6 if diff == "medium" else 8
        for s in sets:
            assert len(s["pairs"]) == expected_pairs, f"Set {s['id']} has {len(s['pairs'])} pairs, expected {expected_pairs}"
            total_pairs += len(s["pairs"])

            # Verify all leftText unique
            lefts = [p["leftText"].lower() for p in s["pairs"]]
            assert len(lefts) == len(set(lefts)), f"Duplicate leftText in {s['id']}: {lefts}"

            # Verify all rightText unique
            rights = [p["rightText"].lower() for p in s["pairs"]]
            assert len(rights) == len(set(rights)), f"Duplicate rightText in {s['id']}: {rights}"

            # Verify mode consistency
            for p in s["pairs"]:
                assert p["mode"] == s["mode"]
                if p["mode"] == "word_picture":
                    assert p.get("imageRef"), f"Missing imageRef in {p['pairId']}"

print(f"\n✓ VALIDATION PASSED!")
print(f"Total Sets: {total_sets} (Expected: 240)")
print(f"Total Pairs: {total_pairs} (Expected: 1440)")

# Write to src/data/gamesZone/memoryMatchData.ts
out_path = os.path.join(r"c:\Users\FATİH\.gemini\antigravity-ide\scratch\english-taboo-game\unit-review-arcade", "src", "data", "gamesZone", "memoryMatchData.ts")

header = """/**
 * UNIT REVIEW ARCADE — MEMORY MATCH DATA BANK (PHASE 11)
 * Version: 11.0.0
 * 
 * 240 validated curriculum-aligned memory matching challenges:
 * - Grade 7: Easy (40 sets x 4 pairs), Medium (40 sets x 6 pairs), Hard (40 sets x 8 pairs)
 * - Grade 8: Easy (40 sets x 4 pairs), Medium (40 sets x 6 pairs), Hard (40 sets x 8 pairs)
 * 
 * Covering 3 Educational Matching Modes:
 * - Mode A: Word & Meaning (English word <-> Turkish translation)
 * - Mode B: Word & Definition (English word <-> English definition)
 * - Mode C: Word & Picture (English word <-> Reusable offline vector asset)
 * 
 * Aligned strictly to Turkish MEB English Curriculum & LGS outcomes.
 * Structured for direct compatibility with upcoming Activity Creator.
 */

import type { MemoryMatchBank } from '../../types/gamesZone';

export const MEMORY_MATCH_BANK: MemoryMatchBank = """

with open(out_path, "w", encoding="utf-8") as f:
    f.write(header)
    json.dump(bank, f, indent=2, ensure_ascii=False)
    f.write(";\n")

print(f"Successfully generated {out_path} ({os.path.getsize(out_path)} bytes).")

