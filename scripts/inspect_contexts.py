import glob
import re

SUSPECTS = ['bar', 'smoke', 'war', 'knife', 'die', 'death', 'kill', 'gun', 'fat', 'fool', 'mad', 'hate', 'drunk', 'rum', 'stupid', 'ugly']

results = []

for filepath in glob.glob('src/data/**/*.ts', recursive=True):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        for line_no, line in enumerate(lines, 1):
            for word in SUSPECTS:
                if re.search(r'\b' + word + r'\b', line, re.IGNORECASE):
                    results.append({
                        'word': word,
                        'file': filepath,
                        'line': line_no,
                        'text': line.strip()
                    })

print(f"Total contextual matches: {len(results)}")

by_word = {}
for r in results:
    by_word.setdefault(r['word'], []).append(r)

for w, occurrences in sorted(by_word.items()):
    print(f"\n==================== WORD: {w.upper()} ({len(occurrences)}) ====================")
    for occ in occurrences[:6]:
        print(f"[{occ['file']}:{occ['line']}] {occ['text'][:120]}")

