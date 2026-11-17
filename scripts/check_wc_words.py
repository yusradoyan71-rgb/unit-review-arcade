import re

wc_words = []
with open('src/data/gamesZone/wordConnectData.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    for m in re.finditer(r'["\']word["\']\s*:\s*["\']([A-Z]+)["\']', content):
        wc_words.append(m.group(1))

print(f"Total Word Connect target words: {len(wc_words)}")
print("Sample Word Connect target words:", wc_words[:30])
print(f"Unique words: {len(set(wc_words))}")

# Check if any sensitive words are among target words
SENSITIVE = ['GUN', 'WAR', 'RUM', 'FAT', 'BAR', 'FOOL', 'MAD', 'DIE', 'DEAD', 'KILL', 'HATE', 'BEER', 'WINE']
found_sens = [w for w in wc_words if w in SENSITIVE]
print("Sensitive words found in Word Connect:", set(found_sens))
for w in set(found_sens):
    print(f"  {w}: {found_sens.count(w)} times")

