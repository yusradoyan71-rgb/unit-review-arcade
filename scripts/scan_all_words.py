import json
import re

with open('audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Inspect Wordle target words
from collections import Counter

# Let's inspect all items in inventory
print("Analyzing full inventory of 5,016 items...")
games_zone_items = [i for i in data['breakdownBySource'].items()]
for name, count in sorted(games_zone_items, key=lambda x: -x[1])[:25]:
    print(f"  {name}: {count}")

# Check any other potential sensitive words
SUSPECT_WORDS = [
  'kill', 'die', 'dead', 'death', 'blood', 'gun', 'knife', 'bomb', 'war', 'fight',
  'beer', 'wine', 'alcohol', 'drunk', 'bar', 'smoke', 'cigar', 'vape',
  'hate', 'ugly', 'stupid', 'idiot', 'fat', 'fool', 'lazy', 'crazy', 'mad',
  'kiss', 'sexy', 'naked', 'love', 'marry', 'boyfriend', 'girlfriend'
]

print("\n--- OCCURRENCES OF SUSPECT WORDS ---")
suspect_findings = {}
# Read raw ts files in gamesZone and grade7/8 to find exact occurrences
import glob

ts_files = glob.glob('src/data/**/*.ts', recursive=True)
for filepath in ts_files:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        for sw in SUSPECT_WORDS:
            matches = list(re.finditer(r'\b' + sw + r'\b', content, re.IGNORECASE))
            if matches:
                if sw not in suspect_findings:
                    suspect_findings[sw] = []
                suspect_findings[sw].append((filepath, len(matches)))

for sw, files in sorted(suspect_findings.items(), key=lambda x: -sum(f[1] for f in x[1])):
    total_m = sum(f[1] for f in files)
    print(f"Word: '{sw}' (Total: {total_m} matches across {len(files)} files)")
    for fp, count in files[:3]:
        print(f"   {fp}: {count}")

