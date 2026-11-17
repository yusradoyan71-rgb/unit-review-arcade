import json
from collections import defaultdict

with open('audit_results.json', 'r', encoding='utf-8') as f:
    audit = json.load(f)

# Group by Grade and Game/Unit
matrix = defaultdict(lambda: defaultdict(int))
unit_review_matrix = defaultdict(lambda: defaultdict(int))
games_zone_matrix = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))

for item in audit['breakdownBySource'].items():
    source_name, count = item
    print(f"{source_name}: {count}")

