import json
import glob
import re

print("Analyzing pedagogical complexity across all files...")

# Let's inspect Vocabulary Invaders prompts:
# They should be quickly readable during fast gameplay!
invaders_long_prompts = []
for filepath in glob.glob('src/data/gamesZone/vocabularyInvadersData.ts'):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f) if filepath.endswith('.json') else None

# Let's read audit_results.json
with open('audit_results.json', 'r', encoding='utf-8') as f:
    audit = json.load(f)

# Sort long clues/definitions by word count
long_flags = [f for f in audit['pedagogicalFlags'] if f['issue'] == 'Excessively Long Clue/Definition']
print(f"Total excessively long clues/definitions: {len(long_flags)}")

# Let's see some top examples
print("\nTop 15 Most Complex / Longest Clues in Games Zone:")
gz_long = [f for f in long_flags if 'GamesZone' in f['source']]
for idx, f in enumerate(gz_long[:15], 1):
    print(f"[{idx}] {f['source']} | {f['unitOrGame']} | ID: {f['id']}")
    print(f"     Detail: {f['detail']}")
    print()

print("\nTop 15 Most Complex / Longest Clues in Unit Review:")
ur_long = [f for f in long_flags if 'UnitReview' in f['source']]
for idx, f in enumerate(ur_long[:15], 1):
    print(f"[{idx}] {f['source']} | {f['unitOrGame']} | ID: {f['id']}")
    print(f"     Detail: {f['detail']}")
    print()

