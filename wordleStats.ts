import { getLegalGuesses, getLegalWords } from "./Words";
import { Rules } from "./src/Rules";

interface Entry {
    min: number,
    max: number,
    average: number;
}
// for every legal word, see how many words are left in the second round against every goal word

const matchList: { [x: string ]: number} = {};
let listSize = 0;
let cacheHits = 0;


const words = getLegalWords();
const verbose = process.argv[2] === "verbose";
let bestResult: Entry = {
    min: 0,
    max: 0, 
    average: words.length,
}
const guesses = verbose ? getLegalGuesses() : (process.argv[2] ? [process.argv[2]] : getLegalGuesses());
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
        console.log(`${i}. ${guessWord} improved average to ${e.average}. ${verbose ? `(Stats: cache hits ${cacheHits} vs misses ${listSize})`: ""}`);
    }
});

function getMatches(rules: Rules) {
    const hash = hashRule(rules);
    if (matchList[hash] === undefined) {
        listSize++;
        matchList[hash] = words.filter(w => rules.matches(w)).length
    } else {
        cacheHits++;
    }
    return matchList[hash];
}

function hashRule(rules: Rules): string {
    rules.contains.sort();
    rules.notContains.sort();
    rules.places.sort((e1,e2) => e1.index-e2.index);
    return rules.contains.join() + "," + rules.notContains.join() + "," + rules.places.map(e => e.index + e.char)
}
