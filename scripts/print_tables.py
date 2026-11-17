import json

# Let's verify all counts precisely
games_zone_catalog = [
    ("Word Ninja", 240, "Fast-paced vocabulary slicing"),
    ("Grammar Runner", 240, "3-lane grammar sprint"),
    ("Word Fishing", 240, "Pond clue hooking"),
    ("Sentence Tower", 240, "Syntax block stacking"),
    ("Grammar Basketball", 240, "Grammar questions with 2D physics shot"),
    ("Vocabulary Invaders", 240, "Fast space arcade vocabulary shooter"),
    ("Wordle English", 240, "6-guess curriculum word detective"),
    ("Word Connect", 240, "Wheel letter connection puzzles (1,088 target words)"),
    ("Memory Match", 240, "Curriculum pair-matching (1,440 pairs)"),
]

print("=== GAMES ZONE BREAKDOWN ===")
total_gz = 0
for name, count, desc in games_zone_catalog:
    total_gz += count
    print(f"| {name} | Grade 7: 120 (40E/40M/40H) | Grade 8: 120 (40E/40M/40H) | **{count}** | {desc} |")
print(f"Total Games Zone: {total_gz}")

print("\n=== UNIT REVIEW BREAKDOWN ===")
unit_reviews = [
    # Grade 7
    ("Grade 7", "Unit 1: Digital Life & Personal Traits", 8, 250, "Vocab(30), Match(30), Grammar(30), Sentence(30), Dialogue(30), TrueFalse(30), Reading(30), Ultimate(40)"),
    ("Grade 7", "Unit 2: Past Events & Wild Nature", 10, 280, "Vocab(30), Match(30), PastTense(30), Sentence(30), Wildlife(30), Emergency(20), TrueFalse(30), Reading(20), UsedTo(20), Ultimate(40)"),
    # Grade 8
    ("Grade 8", "Unit 1: Friendship", 7, 170, "Vocab(25), Match(25), Sentence(20), TrueFalse(25), SayItRight(25), Reading(20), Ultimate(30)"),
    ("Grade 8", "Unit 2: Teen Life", 8, 240, "Vocab(30), Match(30), Grammar(30), Sentence(30), Troubles(30), TrueFalse(30), Reading(20), Ultimate(40)"),
    ("Grade 8", "Unit 3: In the Kitchen", 8, 230, "Vocab(30), Match(30), Suggestions(30), Station(20), Sentence(30), TrueFalse(30), Reading(20), Ultimate(40)"),
    ("Grade 8", "Unit 4: On the Phone", 8, 210, "Vocab(30), Match(30), Grammar(30), Sentence(20), Troubles(20), TrueFalse(30), Reading(20), Ultimate(30)"),
]

total_ur = 0
for grade, unit, acts, items, breakdown in unit_reviews:
    total_ur += items
    print(f"| {grade} | {unit} | {acts} | **{items}** | {breakdown} |")
print(f"Total Unit Review: {total_ur}")
print(f"Total Platform Items: {total_gz + total_ur}")

