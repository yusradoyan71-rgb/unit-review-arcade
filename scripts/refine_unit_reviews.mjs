import fs from 'fs';

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let count = 0;
  for (const { target, replacement } of replacements) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      count++;
    } else {
      console.warn(`Target not found in ${filePath}: "${target.slice(0, 40)}..."`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath} (${count} replacements)`);
}

// 1. Grade 7 Unit 1 Game 3 Grammar
updateFile('./src/data/grade7/unit1/game3Grammar.ts', [
  {
    target: "explanation: \"'Prefer' is a stative verb expressing a preference; it is used in the Present Simple.\",",
    replacement: "explanation: \"'Prefer' expresses a preference and is not used with -ing. Use the Present Simple ('prefers').\","
  },
  {
    target: "explanation: \"'Understand' is a stative verb of mental state and is not used in continuous tenses here.\",",
    replacement: "explanation: \"We do not use -ing with 'understand'. Use the Present Simple ('understands').\","
  },
  {
    target: "explanation: \"'Need' is a stative verb expressing necessity; use Present Simple third-person singular ('needs').\",",
    replacement: "explanation: \"'Need' is not used with -ing. Use Present Simple third-person singular ('needs').\","
  },
  {
    target: "explanation: \"'Believe' is a stative verb expressing an opinion; use Present Simple ('believe').\",",
    replacement: "explanation: \"'Believe' expresses opinion and is not used with -ing. Use the Present Simple ('believe').\","
  },
  {
    target: "explanation: \"'Know' is a stative verb of knowledge; use Present Simple negative 'doesn't know'.\",",
    replacement: "explanation: \"We do not use -ing with 'know'. Use the Present Simple negative 'doesn't know'.\","
  },
  {
    target: "explanation: \"'Love' is a stative verb expressing emotion and takes the Present Simple form.\",",
    replacement: "explanation: \"Verbs of emotion like 'love' take the Present Simple ('loves'), not continuous.\""
  },
  {
    target: "explanation: \"Use an infinitive of purpose ('to improve') to explain why someone performs an action.\",",
    replacement: "explanation: \"Use 'to + verb' ('to improve') to explain why someone performs an action.\""
  },
  {
    target: "explanation: \"An infinitive of purpose ('to find') explains the objective of an action ('She opened Maps to find...').\",",
    replacement: "explanation: \"Use 'to + verb' ('to find') to explain why she opened Maps.\""
  }
]);

// 2. Grade 7 Unit 1 Game 4 Sentence
updateFile('./src/data/grade7/unit1/game4Sentence.ts', [
  {
    target: "explanation: 'Infinitive of purpose (\"to find places\") explains the reason for using the app.',",
    replacement: "explanation: 'Use \"to + verb\" (\"to find places\") to explain why we use the app.',"
  },
  {
    target: "explanation: '\"Believe\" is a stative verb followed by a that-clause.',",
    replacement: "explanation: 'Use \"believe\" in the present simple to express what you think.',"
  }
]);

// 3. Grade 7 Unit 1 Game 6 True/False
updateFile('./src/data/grade7/unit1/game6TrueFalse.ts', [
  {
    target: "prompt: 'Stative verbs like \"know\", \"believe\", and \"prefer\" are normally used in the Present Continuous form (\"I am knowing\").',",
    replacement: "prompt: 'Verbs of thought and feeling like \"know\", \"believe\", and \"prefer\" are normally used in the Present Continuous form (\"I am knowing\").',"
  },
  {
    target: "explanation: 'False. Stative verbs express mental states and preferences; they are usually used in Present Simple (\"I know\", \"I prefer\").',",
    replacement: "explanation: 'False. Verbs of thought and feeling are used in the Present Simple (\"I know\", \"I prefer\"), not with -ing.',"
  },
  {
    target: "explanation: 'True. A to-infinitive of purpose explains the objective or reason behind an action.',",
    replacement: "explanation: 'True. Use \"to + verb\" (to find, to learn) to explain the purpose or reason for an action.',"
  }
]);

// 4. Grade 7 Unit 1 Game 8 Ultimate
updateFile('./src/data/grade7/unit1/game8Ultimate.ts', [
  {
    target: "explanation: \"'Like' is a stative verb expressing preference; third-person singular negative is 'doesn't like'.\",",
    replacement: "explanation: \"Verbs of preference like 'like' use Present Simple negative 'doesn't like', not continuous.\""
  },
  {
    target: "explanation: \"'Prefer' is a stative verb used in the simple form, not continuous.\",",
    replacement: "explanation: \"'Prefer' is used in the Present Simple, not with -ing.\""
  },
  {
    target: "explanation: \"A to-infinitive of purpose ('to find') explains why she uses the app.\",",
    replacement: "explanation: \"Use 'to + verb' ('to find') to explain why she uses the app.\""
  }
]);

// 5. Grade 7 Unit 1 Index
updateFile('./src/data/grade7/unit1/index.ts', [
  {
    target: "stative verbs,",
    replacement: "verbs of feeling & preference,"
  },
  {
    target: "stative verbs,",
    replacement: "verbs of feeling & preference,"
  }
]);

// 6. Grade 7 Unit 2 Game 10 Ultimate
updateFile('./src/data/grade7/unit2/game10Ultimate.ts', [
  {
    target: "explanation: 'An avalanche is a catastrophic snow and ice slide occurring on steep mountain slopes.',",
    replacement: "explanation: 'An avalanche is a dangerous snow and ice slide occurring on steep mountain slopes.',"
  }
]);

// 7. Grade 7 Unit 2 Game 4 Sentence
updateFile('./src/data/grade7/unit2/game4Sentence.ts', [
  {
    target: "explanation: 'Infinitive of purpose \"to save lives\" expresses the goal of the rescue effort.',",
    replacement: "explanation: 'Use \"to + verb\" (\"to save lives\") to explain the purpose of the rescue effort.',"
  }
]);

// 8. Grade 7 Unit 2 Game 5 Wildlife
updateFile('./src/data/grade7/unit2/game5Wildlife.ts', [
  {
    target: "prompt: 'Why do forest fires represent a catastrophic threat to slow-moving tree-dwelling animals like young sun bears?',",
    replacement: "prompt: 'Why do forest fires represent a severe danger to slow-moving tree-dwelling animals like young sun bears?',"
  }
]);

// 9. Grade 8 Unit 1 Game 3 Sentence
updateFile('./src/data/grade8/unit1/game3Sentence.ts', [
  {
    target: "explanation: '\"Would rather\" is followed by base bare infinitives: \"attend ... than watch\".',",
    replacement: "explanation: '\"Would rather\" is followed by the base verb without \"to\": \"attend ... than watch\".',"
  }
]);

// 10. Grade 8 Unit 1 Game 4 True/False
updateFile('./src/data/grade8/unit1/game4TrueFalse.ts', [
  {
    target: "explanation: 'False. \"Would rather\" is followed by a bare infinitive without \"to\" (correct: \"I would rather listen to jazz\").',",
    replacement: "explanation: 'False. \"Would rather\" is followed by the base verb without \"to\" (correct: \"I would rather listen to jazz\").',"
  }
]);

// 11. Grade 8 Unit 1 Game 5 Say It Right
updateFile('./src/data/grade8/unit1/game5SayItRight.ts', [
  {
    target: "explanation: '\"Would rather\" must be followed by a bare infinitive (\"learn\").',",
    replacement: "explanation: '\"Would rather\" must be followed by the base verb without \"to\" (\"learn\").',"
  },
  {
    target: "explanation: 'Correlative conjunction structure: \"Not only ... but (also) ...\".',",
    replacement: "explanation: 'Paired sentence pattern: \"Not only ... but also ...\".',"
  }
]);

// 12. Grade 8 Unit 1 Game 6 Reading
updateFile('./src/data/grade8/unit1/game6Reading.ts', [
  {
    target: "'Singing in twenty different languages simultaneously',",
    replacement: "'Singing in twenty different languages at the same time',"
  }
]);

// 13. Grade 8 Unit 1 Game 7 Ultimate
updateFile('./src/data/grade8/unit1/game7Ultimate.ts', [
  {
    target: "explanation: '\"Would rather\" takes a bare infinitive without \"to\" (\"attend\").',",
    replacement: "explanation: '\"Would rather\" takes the base verb without \"to\" (\"attend\").',"
  }
]);

// 14. Grade 8 Unit 2 Game 6 True/False
updateFile('./src/data/grade8/unit2/game6TrueFalse.ts', [
  {
    target: "explanation: 'True. Public transport carries many people simultaneously, reducing carbon emissions per person.',",
    replacement: "explanation: 'True. Public transport carries many people at the same time, reducing carbon emissions per person.',"
  }
]);

// 15. Grade 8 Unit 3 Game 3 Suggestions
updateFile('./src/data/grade8/unit3/game3Suggestions.ts', [
  {
    target: "explanation: '\"Let\\'s\" is followed directly by the base bare infinitive of the verb (\"visit\").',",
    replacement: "explanation: '\"Let\\'s\" is followed directly by the base verb without \"to\" (\"visit\").',"
  },
  {
    target: "explanation: '\"I suggest we [base verb]\" uses the subjunctive base form: \"I suggest we go...\".',",
    replacement: "explanation: 'After \"I suggest we...\", use the base form of the verb: \"I suggest we go...\".',"
  },
  {
    target: "explanation: 'Modal verb \"should\" is followed by a bare infinitive without \"to\": \"should watch\".',",
    replacement: "explanation: 'After modal verb \"should\", use the base verb without \"to\": \"should watch\".',"
  },
  {
    target: "explanation: '\"Would rather\" takes a bare infinitive: \"would rather relax\".',",
    replacement: "explanation: '\"Would rather\" takes the base verb without \"to\": \"would rather relax\".',"
  },
  {
    target: "explanation: '\"Would rather\" takes a bare infinitive: \"I\\'d rather see\".',",
    replacement: "explanation: '\"Would rather\" takes the base verb without \"to\": \"I\\'d rather see\".',"
  }
]);

// 16. Grade 8 Unit 3 Game 5 Sentence
updateFile('./src/data/grade8/unit3/game5Sentence.ts', [
  {
    target: "explanation: '\"Let\\'s\" is followed by the bare infinitive \"take\".',",
    replacement: "explanation: '\"Let\\'s\" is followed by the base verb \"take\".',"
  },
  {
    target: "explanation: 'Infinitive of purpose (\"to see the view\") can follow the action or introduce the sentence.',",
    replacement: "explanation: 'The phrase \"to see the view\" explains why and can go at the end or start of the sentence.',"
  }
]);

// 17. Grade 8 Unit 3 Game 6 True/False
updateFile('./src/data/grade8/unit3/game6TrueFalse.ts', [
  {
    target: "explanation: \"False. 'Let's' is followed directly by the bare infinitive without 'to': 'Let's visit the museum'.\",",
    replacement: "explanation: \"False. 'Let's' is followed directly by the base verb without 'to': 'Let's visit the museum'.\","
  },
  {
    target: "explanation: \"False. 'Would rather' takes a bare infinitive without 'to': 'I would rather stay home'.\",",
    replacement: "explanation: \"False. 'Would rather' takes the base verb without 'to': 'I would rather stay home'.\","
  }
]);

// 18. Fix distractors in Word Ninja & Vocabulary Invaders
updateFile('./src/data/gamesZone/wordNinjaData.ts', [
  {
    target: `"distractorWords": [
                  "Dull",
                  "Tedious",
                  "Tiring"
            ]`,
    replacement: `"distractorWords": [
                  "Dull",
                  "Slow",
                  "Tiring"
            ]`
  },
  {
    target: `"distractorWords": [
                  "Monotonous",
                  "Tedious",
                  "Dull"
            ]`,
    replacement: `"distractorWords": [
                  "Boring",
                  "Ordinary",
                  "Dull"
            ]`
  }
]);

updateFile('./src/data/gamesZone/vocabularyInvadersData.ts', [
  {
    target: `"distractorWords": [
          "Boring",
          "Monotonous",
          "Tedious"
        ],`,
    replacement: `"distractorWords": [
          "Boring",
          "Dull",
          "Ordinary"
        ],`
  }
]);

console.log("ALL UNIT REVIEW & DISTRACTOR REFINEMENTS APPLIED SUCCESSFULLY.");
