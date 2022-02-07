import { getLegalWords } from "./Words";
import { Rule } from ".";

process.argv.shift();
process.argv.shift();

const goalWord = process.argv.shift() as string;
const guessWords = process.argv;
console.log(`Processing: ${JSON.stringify(guessWords)}`);
const legalWords = getLegalWords();

let rule = new Rule();
guessWords.forEach(w => {
    const r = Rule.create(w, goalWord);
    rule = rule.merge(r);
});
// we now have the aggregate goal, how many words still match?
const wordsLeft = legalWords.filter(word => rule.matches(word));
console.log(`Possible words: ${wordsLeft}`);


