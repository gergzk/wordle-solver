import { getLegalWords } from "./Words";
import { Rules } from "./src/Rules";

interface Entry {
    max: number;
    min: number;
    average: number;
}
// for every legal word, see how many words are left in the second round against every goal word

const words = getLegalWords(5);
const verbose = process.argv[2] === "verbose";
let bestResult: Entry = {
    min: 0,
    max: 0, 
    average: words.length,
}
const guesses = verbose ? words : ([process.argv[2]] || words);
guesses.forEach((guessWord, i) => {
    // for every word that is not myself, how many words are left?
    const e: Entry = {
        max: 0,
        min: words.length,
        average: 0
    }
    words.forEach(goalWord => {
        if (goalWord !== guessWord) {
            const r = Rules.create(guessWord, goalWord);
            const matches = getMatches(r);
            e.average += matches;
            e.min = Math.min(e.min, matches);
            e.max = Math.max(e.max, matches);
        }
    });
    e.average = 1.0 * e.average / words.length;
    if (verbose) {
        console.log(`Processed ${guessWord}: ${JSON.stringify(e)}`);
    }
    if (e.average < bestResult.average) {
        bestResult = e;
        console.log(`${i}. ${guessWord} improved average to ${e.average}`);
    }
});

function getMatches(rules: Rules) {
    return words.filter(w => rules.matches(w)).length;
}
