import glob
import re

print("Scanning for overly academic or complicated definition words...")

# Words typical of dictionary definitions but too hard for 12-14yo Turkish EFL students
HARD_VOCAB = [
    'aversion', 'tolerate', 'indiscriminately', 'consecutive', 'celestial',
    'luminous', 'stellar', 'supernova', 'precaution', 'correlative', 'tactless',
    'subjugate', 'tedious', 'monotonous', 'diminish', 'counterproductive',
    'detrimental', 'paramount', 'fluctuate', 'ubiquitous', 'subsequent',
    'simultaneously', 'predominantly', 'consequently', 'furthermore', 'henceforth'
]

findings = []

for fp in glob.glob('src/data/**/*.ts', recursive=True):
    with open(fp, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for idx, line in enumerate(lines, 1):
            for hw in HARD_VOCAB:
                if re.search(r'\b' + hw + r'\b', line, re.IGNORECASE):
                    findings.append({
                        'word': hw,
                        'file': fp,
                        'line': idx,
                        'text': line.strip()
                    })

print(f"Total occurrences of academic/hard vocabulary: {len(findings)}")
by_hw = {}
for f in findings:
    by_hw.setdefault(f['word'], []).append(f)

for hw, occs in sorted(by_hw.items(), key=lambda x: -len(x[1])):
    print(f"\nHard word: '{hw.upper()}' ({len(occs)} matches)")
    for o in occs[:4]:
        print(f"   [{o['file']}:{o['line']}] {o['text'][:120]}")

