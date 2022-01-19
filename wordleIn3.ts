// this script used to find out how often a 1st guess will narrow down to a single legal word by 3rd round
import { getLegalWords } from "./Words";
import { firstGuesses } from "./firstGuesses";
import { Rule } from "./src/Rule";
import { MatchCache } from "./src/MatchCache";
import { MarisaStrategy } from "./Strategy";

const legalWords = getLegalWords();
const matchCache = new MatchCache(legalWords);

// find the input in args[2] - it's either the top N choices, or a word
let wordsToTry = [process.argv[2]];
const count = Number.parseInt(process.argv[2]);
if (Number.isInteger(count)) {
    wordsToTry = Object.keys(firstGuesses).slice(0, count);
}
console.log(`Testing words: ${wordsToTry}`);

// now the meat of it
// for each tested word - 
// 1. try it, get a Rule
// 2. for each legal guess, merge its Rule with the already existing one
// 3. see how many legal words match the Rule
// 4. add [3] to a running total. The final odds of getting it in 3 will be sum / nLegalWords
// store all the words and then output them in odds order

interface Entry {
    word: string,
    guessesLeft: number;
};

const s = new MarisaStrategy();

const entries: Entry[] = [];
wordsToTry.forEach(wordToTry => {
    let runningCount = 0;
    legalWords.forEach((legalWord) => {
        const rule1 = Rule.create(wordToTry, legalWord);
        // and then what is the 2nd word? 
        const nextWord = s.secondGuess(wordToTry, rule1);
        const rule2 = Rule.create(nextWord, legalWord);
        const rules = rule1.merge(rule2);
        const counts = matchCache.matchCount(rules);
        console.log(`${legalWord}: ${wordToTry} -> ${nextWord}. Left: ${counts}`);
        runningCount += counts;
    });
    entries.push({ word: wordToTry, guessesLeft: runningCount});
});

entries.sort((e1,e2) => e1.guessesLeft - e2.guessesLeft);
entries.forEach(e => console.log(`${e.word}: ${1.0*legalWords.length/e.guessesLeft}`));

