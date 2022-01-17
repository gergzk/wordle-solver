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
const guessTestSubsetCount = process.argv[2] ? Math.min(Number.parseInt(process.argv[2]), legalGuesses.length) : legalGuesses.length;
console.log(`Using ${guessTestSubsetCount} words`)
// grab subset of random words from the legal guess list, and see which guess produces best reduction
const guessTestSubset: string[] = [];
while (guessTestSubset.length < guessTestSubsetCount) {
    const word = legalGuesses.splice(Math.floor(legalWords.length * Math.random()), 1)[0];
    guessTestSubset.push(word);
}
console.log(`Running stats on ${guessTestSubsetCount} of ${legalWords.length} words`);
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
entries.forEach(e => console.log(e));

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
