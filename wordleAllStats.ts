import { getLegalWords, getLegalGuesses } from "./Words";
import { Rule } from "./src/Rule";
import { MatchCache } from "./src/MatchCache";

interface Entry {
    word: string;
    avg: number;
}

// this file generates the number of possible words left after each first guess
// ts param outputs a valid ts file
// npm run list [nRandomWords] [ts]
const entries: Entry[] = [];
const legalWords = getLegalWords();
const legalGuesses = getLegalGuesses();
const cacheMatch = new MatchCache(legalWords);
const tsOutput = process.argv[2] === "ts" || process.argv[3] === "ts";
const guessTestSubsetCount = process.argv[2] && process.argv[2] !== "ts" ? Math.min(Number.parseInt(process.argv[2]), legalGuesses.length) : legalGuesses.length;
if (!tsOutput) {
    console.log(`Using ${guessTestSubsetCount} words`);
}
// grab subset of random words from the legal guess list, and see which guess produces best reduction
const guessTestSubset: string[] = [];
while (guessTestSubset.length < guessTestSubsetCount) {
    const word = legalGuesses.splice(Math.floor(legalGuesses.length * Math.random()), 1)[0];
    if (word === undefined) {
        throw new Error(`Whoops! Undefined found at ${guessTestSubset.length}`);
    }
    guessTestSubset.push(word);
}
if (!tsOutput) {
    console.log(`Running stats on ${guessTestSubsetCount} of ${legalGuesses.length} words`);
}
guessTestSubset.forEach((guess, i) => {
    const e: Entry = {
        word: guess,
        avg: 0,
    };
    legalWords.forEach(goal => {
        const r = Rule.create(guess, goal);
        const matches = cacheMatch.matchCount(r);
        e.avg += matches;
    });
    e.avg = Math.round(e.avg / legalWords.length);
    entries.push(e);
});
entries.sort((e1, e2) => e1.avg - e2.avg);
if (tsOutput) {
    console.log("export const firstGuesses = {");
    entries.forEach(e => console.log(`\t${e.word}: ${e.avg},`));
    console.log("};");
} else {
    entries.forEach(e => console.log(e));
}

