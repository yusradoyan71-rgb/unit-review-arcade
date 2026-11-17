import json
import glob
import re

# Inspect all items in GamesZone and UnitReview for prompt / clue / explanation lengths
results = []

def audit_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

# Let's write a python script to inspect prompt lengths and explanation lengths directly
import os

print("Running deep prompt and clue analysis...")

files = glob.glob('src/data/**/*.ts', recursive=True)
all_prompts = []

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for idx, line in enumerate(lines):
            line_str = line.strip()
            # check prompt or clue
            m = re.search(r'["\'](prompt|clue|cluePrompt|sentencePrompt)["\']\s*:\s*["\']([^"\']+)["\']', line_str)
            if m:
                field_name = m.group(1)
                text = m.group(2)
                words = text.split()
                if len(words) > 12:
                    all_prompts.append({
                        'file': fp,
                        'line': idx + 1,
                        'field': field_name,
                        'words': len(words),
                        'text': text
                    })

print(f"Total Prompts/Clues with > 12 words: {len(all_prompts)}")
all_prompts.sort(key=lambda x: -x['words'])
for p in all_prompts[:15]:
    print(f"[{p['file']}:{p['line']}] ({p['words']} words) {p['field']}: {p['text']}")

