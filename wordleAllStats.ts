import { getLegalWords } from "./Words";
import { Rules } from "./src/Rules";

interface Entry {
    word: string;
    avg: number;
}

const matchList: { [x: string ]: number} = {};

const entries: Entry[] = [];
const words = getLegalWords(5);
const loops = process.argv[2] ? Number.parseInt(process.argv[2]) : words.length;
words.forEach((guess, i) => {
    if (i >= loops) {
        return;
    }
    const e: Entry = {
        word: guess,
        avg: 0,
    };
    words.forEach(goal => {
        const r = Rules.create(guess, goal);
        const matches = getMatches(r);
        e.avg += matches;
    });
    e.avg = Math.round(e.avg / words.length);
    entries.push(e);
});
entries.sort((e1, e2) => e1.avg - e2.avg);
entries.forEach(e => console.log(e));

function getMatches(rules: Rules) {
    const hash = hashRule(rules);
    if (matchList[hash] === undefined) {
        matchList[hash] = words.filter(w => rules.matches(w)).length
    }
    return matchList[hash];
}

function hashRule(rules: Rules): string {
    rules.contains.sort();
    rules.notContains.sort();
    rules.places.sort((e1,e2) => e1.index-e2.index);
    return rules.contains.join() + "," + rules.notContains.join() + "," + rules.places.map(e => e.index + e.char)
}
