#!/usr/bin/env python3
"""
Full Generation Script for Milestone 3.5: 320 General English Starter Questions
Generates:
  - src/data/generalEnglish/grade7/grammar.ts
  - src/data/generalEnglish/grade7/vocabulary.ts
  - src/data/generalEnglish/grade7/reading.ts
  - src/data/generalEnglish/grade7/listening.ts
  - src/data/generalEnglish/grade8/grammar.ts
  - src/data/generalEnglish/grade8/vocabulary.ts
  - src/data/generalEnglish/grade8/reading.ts
  - src/data/generalEnglish/grade8/listening.ts
  - src/data/generalEnglish/index.ts
  - src/data/generalEnglish/allQuestions.json
  - src/data/generalEnglish/allQuestions.csv
"""

import os
import json
import csv

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data", "generalEnglish")
os.makedirs(os.path.join(BASE_DIR, "grade7"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "grade8"), exist_ok=True)

print("Starting generation of 320 General English questions...")

