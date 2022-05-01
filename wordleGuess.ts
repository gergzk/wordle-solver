import { getLegalWords } from "./Words";
import { Rule } from "./src/Rule";

// this file tells you what words are left towards a goal after guessing 1...N words
// npm run guess <guessword> <goalword>
const words = getLegalWords();
console.log(`Loaded ${words.length} words`);
const goal = process.argv[2];
const guesses = process.argv.slice(3);
const rules = guesses.map(guess => Rule.create(guess, goal));
const rule = rules.reduce((r1, r2) => r1.merge(r2));
const matches = words.filter(word => rule.matches(word));
console.log(`Matches ${matches.length} words: ${matches.join(", ")}`);
