import json

with open('audit_results.json', 'r', encoding='utf-8') as f:
    audit = json.load(f)

print("Analyzing Prompt and Clue Lengths vs Explanation Lengths...")

# Let's inspect long PROMPTS or CLUES (which students must read under time limits)
long_prompts = []
long_clues = []
long_explanations = []

for flag in audit['pedagogicalFlags']:
    detail = flag['detail']
    if 'prompt' in detail.lower() or 'clue' in detail.lower():
        long_prompts.append(flag)
    elif 'explanation' in detail.lower():
        long_explanations.append(flag)

print(f"Long Prompts / Clues: {len(long_prompts)}")
print(f"Long Explanations: {len(long_explanations)}")

# Inspect the long prompts
print("\n--- SAMPLE LONG PROMPTS / CLUES (Student facing during gameplay) ---")
for idx, f in enumerate(long_prompts[:20], 1):
    print(f"[{idx}] {f['source']} | {f['unitOrGame']} | ID: {f['id']}")
    print(f"     Detail: {f['detail']}")

