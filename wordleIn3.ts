// this script used to find out how often a 1st guess will narrow down to a single legal word by 3rd round
import { getLegalGuesses, getLegalWords } from "./Words";
import { firstGuesses } from "./firstGuesses";
import { Rules } from "./src/Rules";

const matchList: { [x: string]: number } = {};
const legalWords = getLegalWords();
const legalGuesses = getLegalGuesses();

function getMatches(rules: Rules) {
    const hash = hashRule(rules);
    if (matchList[hash] === undefined) {
        matchList[hash] = legalWords.filter(w => rules.matches(w)).length;
    }
    return matchList[hash];
}

function hashRule(rules: Rules): string {
    rules.contains.sort();
    rules.notContains.sort();
    rules.places.sort((e1,e2) => e1.index-e2.index);
    return rules.contains.join() + "," + rules.notContains.join() + "," + rules.places.map(e => e.index + e.char)
}

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
    legalWords.forEach(legalWord => {
        const rule1 = Rules.create(wordToTry, legalWord);
        legalGuesses.forEach(legalGuess => {
            const rule2 = Rules.create(legalGuess, legalWord);
            const finalRule = rule1.mergeRules(rule2);
            const matches = getMatches(finalRule);
            runningCount += matches;
        });
    });
    entries.push({ word: wordToTry, guessesLeft: runningCount});
});

entries.sort((e1,e2) => e1.guessesLeft - e2.guessesLeft);
entries.forEach(e => console.log(`${e.word}: ${1.0*legalWords.length/e.guessesLeft}`));
