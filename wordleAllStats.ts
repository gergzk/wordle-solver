import { getLegalWords, getLegalGuesses } from "./Words";
import { Rules } from "./src/Rules";

interface Entry {
    word: string;
    avg: number;
}

const matchList: { [x: string ]: number} = {};

const entries: Entry[] = [];
const legalWords = getLegalWords();
const legalGuesses = getLegalGuesses();
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
    console.log(`Running stats on ${guessTestSubsetCount} of ${legalWords.length} words`);
}
guessTestSubset.forEach((guess, i) => {
    const e: Entry = {
        word: guess,
        avg: 0,
    };
    legalWords.forEach(goal => {
        const r = Rules.create(guess, goal);
        const matches = getMatches(r);
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


function getMatches(rules: Rules) {
    const hash = hashRule(rules);
    if (matchList[hash] === undefined) {
        matchList[hash] = legalWords.filter(w => rules.matches(w)).length
    }
    return matchList[hash];
}

function hashRule(rules: Rules): string {
    rules.contains.sort();
    rules.notContains.sort();
    rules.places.sort((e1,e2) => e1.index-e2.index);
    return rules.contains.join() + "," + rules.notContains.join() + "," + rules.places.map(e => e.index + e.char)
}
