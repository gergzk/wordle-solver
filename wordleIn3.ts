// this script used to find out how often a 1st guess will narrow down to a single legal word by 3rd round
import { getLegalGuesses, getLegalWords } from "./Words";
import { firstGuesses } from "./firstGuesses";
import { Rule } from "./src/Rule";
import { MatchCache } from "./src/MatchCache";

const legalWords = getLegalWords();
const legalGuesses = getLegalGuesses();
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

const entries: Entry[] = [];
wordsToTry.forEach(wordToTry => {
    let runningCount = 0;
    legalWords.forEach((legalWord) => {
        const rule1 = Rule.create(wordToTry, legalWord);
        // and then what is the 2nd word? 
        const nextWord = findBestWord(wordToTry, rule1);
        const rule2 = Rule.create(nextWord, legalWord);
        const rules = rule1.merge(rule2);        
        runningCount += matchCache.matchCount(rules);
    });
    entries.push({ word: wordToTry, guessesLeft: runningCount});
});

entries.sort((e1,e2) => e1.guessesLeft - e2.guessesLeft);
entries.forEach(e => console.log(`${e.word}: ${1.0*legalWords.length/e.guessesLeft}`));

function findBestWord(firstWord: string, resultingRule: Rule): string {
    // strategy is to pick another high-match word that shares matched letters
    const validChoices = legalGuesses.filter(guess => {
        const isMatch = resultingRule.matches(guess);
        /*
        if (!isMatch) { return false; }
        const counts: { [x: string]: boolean } = {};
        guess.split("").forEach(letter => { counts[letter] = true; });
        return Object.keys(counts).length === 5;
        */
       return isMatch;
    });
    // then pick the one earliest on the legal list
    validChoices.sort((a,b) => (firstGuesses as any)[a] - (firstGuesses as any)[b]);
    console.log(`${firstWord}: ${validChoices.length}, returning ${validChoices[0]}`);
    return validChoices[0];
}
