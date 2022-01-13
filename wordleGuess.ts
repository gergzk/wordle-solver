import { getLegalWords } from "./Words";
import { Rules } from "./src/Rules";

const words = getLegalWords(5);
console.log(`Loaded ${words.length} words`);
const goal = process.argv[3] || words[Math.floor(Math.random() * words.length)];
const rules = Rules.create(process.argv[2], goal);
console.log(`Goal word is ${goal}`);
const matches = words.filter(word => rules.matches(word));
console.log(`Matches ${matches.length} words: ${matches.join(", ")}`);