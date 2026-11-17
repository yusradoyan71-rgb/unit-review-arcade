import json
import re

print("Starting pedagogical refinement audit across Games Zone...")

# Load and review vocabularyInvadersData.ts
with open('src/data/gamesZone/vocabularyInvadersData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

prefix = "export const VOCABULARY_INVADERS_BANK: VocabularyInvadersBank = "
bank = json.loads(text.split(prefix)[1].strip().rstrip(';'))

modified_count = 0

for grade in bank:
    for diff in bank[grade]:
        for item in bank[grade][diff]:
            old_prompt = item['prompt']
            old_exp = item.get('explanation', '')
            changed = False

            # Rule 1: Orbit prompt simplification
            if item['id'] == 'vi_g7_e_19':
                item['prompt'] = "Blast the curved path a planet takes around the Sun"
                item['explanation'] = "An orbit is the curved path of a planet moving around the Sun."
                item['contentVersion'] = 2
                changed = True

            # Rule 2: Poachers prompt softening
            if item['id'] == 'vi_g7_e_37':
                item['prompt'] = "Blast illegal hunters who catch protected wild animals"
                item['explanation'] = "Poachers are illegal hunters who harm and catch endangered wildlife."
                item['contentVersion'] = 2
                changed = True

            # Rule 3: Supernova explanation simplification
            if item['id'] == 'vi_g7_h_22':
                item['prompt'] = "Target the huge, bright explosion of a dying giant star in space"
                item['explanation'] = "A supernova is when a giant star explodes with bright light in space."
                item['contentVersion'] = 2
                changed = True

            # Rule 4: Self-Centered distractors and prompt
            if item['id'] == 'vi_g8_h_12':
                item['prompt'] = "Target someone who thinks only about themselves and ignores others"
                item['distractorWords'] = ["Generous", "Helpful", "Thoughtful"]
                item['explanation'] = "Self-centered people think only about themselves and rarely care about others."
                item['contentVersion'] = 2
                changed = True

            # Rule 5: Unbearable prompt
            if item['id'] == 'vi_g8_m_02':
                item['prompt'] = "Blast the word for something so bad or unpleasant that you cannot stand it"
                item['explanation'] = "Unbearable means something is too bad or unpleasant to stand."
                item['contentVersion'] = 2
                changed = True

            # Rule 6: Can't Stand prompt & distractors
            if item['id'] == 'vi_g8_h_22' or 'aversion' in item['prompt'].lower():
                item['prompt'] = "Target the expression that means you strongly dislike something"
                item['distractorWords'] = ["Fond of", "Keen on", "Crazy about"]
                item['explanation'] = "'Can't stand' means to strongly dislike something (e.g. 'I can't stand loud noise')."
                item['contentVersion'] = 2
                changed = True

            # General checks on overly complex vocabulary in explanations
            if 'catastrophic' in item.get('explanation', '').lower():
                item['explanation'] = item['explanation'].replace('catastrophic, luminous stellar explosion', 'bright explosion of a dying giant star')
                item['contentVersion'] = 2
                changed = True

            if 'slaughter' in item.get('explanation', '').lower():
                item['explanation'] = item['explanation'].replace('slaughter', 'harm and catch')
                item['contentVersion'] = 2
                changed = True

            if changed:
                modified_count += 1

print(f"Refined {modified_count} items in Vocabulary Invaders.")

out_text = prefix + json.dumps(bank, indent=2, ensure_ascii=False) + ";\n"
with open('src/data/gamesZone/vocabularyInvadersData.ts', 'w', encoding='utf-8') as f:
    f.write(out_text)

print("Saved vocabularyInvadersData.ts.")

