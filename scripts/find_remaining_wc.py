import json

with open('src/data/gamesZone/wordConnectData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

bank = json.loads(text.split('export const WORD_CONNECT_BANK: WordConnectBank = ')[1].strip().rstrip(';'))

target_words_to_check = ['FAT', 'BAR', 'WAR', 'DIE', 'MAD']
for grade in bank:
    for diff in bank[grade]:
        for p in bank[grade][diff]:
            for tw in p['targetWords']:
                if tw['word'] in target_words_to_check:
                    print(f"{p['id']} ({grade} {diff}) - {tw['word']}: available {p['availableLetters']}")
