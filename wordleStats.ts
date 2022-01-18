import { getLegalGuesses, getLegalWords } from "./Words";
import { Rule } from "./src/Rule";
import { MatchCache } from "./src/MatchCache";

interface Entry {
    min: number,
    max: number,
    average: number;
}
// for every legal word, see how many words are left in the second round against every goal word
// optionally, see how many words on average are left for a specific input
// npm run stats [word]


const words = getLegalWords();
const matchCache = new MatchCache(words);
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
            const r = Rule.create(guessWord, goalWord);
            const matches = matchCache.matchCount(r);
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
        console.log(`${i}. ${guessWord} improved average to ${e.average}.`);
    }
});

