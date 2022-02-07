// this script used to find out how often a 1st guess will narrow down to a single legal word by 3rd round
import { getLegalWords } from "./Words";
import { firstGuesses } from "./firstGuesses";
import { Rule } from "./src/Rule";
//import { MatchCache } from "./src/MatchCache";
//import { legalGuess } from "./legalGuesses";


const legalWords = getLegalWords();
//const matchCache = new MatchCache(legalWords);

// find the input in args[2] - it's either the top N choices, or a word
let firstWord = process.argv[2] || Object.keys(firstGuesses)[0];

// how many different rules are generated after the input word
const rules: { [x:string]: { rule: Rule, words: string[] }} = {};
// for every legal word, make the rule, and add the word there
legalWords.forEach(word => {
    const r = Rule.create(firstWord, word);
    const h = r.hash();
    if (rules[h] === undefined) {
        rules[h] = { rule: r, words: [] };
    }
    rules[h].words.push(word);
});

console.log(`Found ${Object.keys(rules).length} different rules for ${legalWords.length} goal words`);
const lengths = Object.keys(rules).map(key => rules[key].words.length);
lengths.sort((a,b) => a-b);
console.log(JSON.stringify(lengths));


/*

const entries: Entry[] = [];
wordsToTry.forEach(firstWord => {
    // for every second guess, see how it does
    legalWords.forEach((secondWord) => {
        const odds = tryTwo(firstWord, secondWord);
        entries.push({ secondWord, odds });
        console.log(`${firstWord}, ${secondWord}: ${odds}`);
    });
    entries.push({ word: wordToTry, guessesLeft: runningCount, optimalGuessesLeft: runningOptimalCount});
});

function tryTwo(firstWord: string, secondWord: string): number {
    let sum = 0;
    legalWords.forEach((goalWord, i) => {
        const rule = Rule.create(firstWord, goalWord).merge(Rule.create(secondWord, goalWord));
        sum += matchCache.matchCount(rule);
    });
    return 1.0 * legalWords.length / sum;
};

entries.sort((e1,e2) => e2.odds - e1.odds);
entries.forEach(e => console.log(`${e.secondWord}: ${e.odds}`));

*/