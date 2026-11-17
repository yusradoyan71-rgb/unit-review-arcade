import json

with open('audit_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total Educational Items Scanned: {data['totalItems']}")
print(f"Safety Flags: {len(data['safetyFlags'])}")
print(f"Pedagogical Flags: {len(data['pedagogicalFlags'])}")

print("\n--- SAFETY FLAGS BREAKDOWN ---")
cat_counts = {}
for flag in data['safetyFlags']:
    cat = flag['category']
    cat_counts[cat] = cat_counts.get(cat, 0) + 1

for cat, count in sorted(cat_counts.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {count}")

print("\n--- ALL SAFETY FLAGS DETAILS ---")
for idx, flag in enumerate(data['safetyFlags'], 1):
    print(f"[{idx}] Category: {flag['category']} | Matched Word: '{flag['matchedWord']}'")
    print(f"     Source: {flag['source']} | Unit/Game: {flag['unitOrGame']} | ID: {flag['id']} | Field: {flag['field']}")
    print(f"     Snippet: {flag['fullSnippet']}")
    print()

print("\n--- PEDAGOGICAL COMPLEXITY FLAGS SAMPLE ---")
# Group by issue
ped_issues = {}
for flag in data['pedagogicalFlags']:
    issue = flag['issue']
    ped_issues[issue] = ped_issues.get(issue, 0) + 1

for issue, count in ped_issues.items():
    print(f"  {issue}: {count}")

print("\nSample 'Definition Harder Than Target Concept' flags:")
complex_def_samples = [f for f in data['pedagogicalFlags'] if f['issue'] == 'Definition Harder Than Target Concept']
for idx, f in enumerate(complex_def_samples[:15], 1):
    print(f"  [{idx}] {f['source']} | {f['unitOrGame']} | ID: {f['id']}")
    print(f"       Detail: {f['detail']}")

