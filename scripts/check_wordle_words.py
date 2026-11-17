import json

# Inspect wordle English targets
with open('audit_results.json', 'r', encoding='utf-8') as f:
    audit = json.load(f)

# Let's inspect all target words in Wordle English from src/data/gamesZone/wordleEnglishData.ts
import re

wordle_words = []
with open('src/data/gamesZone/wordleEnglishData.ts', 'r', encoding='utf-8') as f:
    content = f.read()
    # find all "word": "XXXX"
    for m in re.finditer(r'["\']word["\']\s*:\s*["\']([A-Z]+)["\']', content):
        wordle_words.append(m.group(1))

print(f"Total Wordle target words: {len(wordle_words)}")
print("Sample Wordle target words:", wordle_words[:30])

# Check lengths
len_counts = {}
for w in wordle_words:
    l = len(w)
    len_counts[l] = len_counts.get(l, 0) + 1
print("Length distribution:", len_counts)

