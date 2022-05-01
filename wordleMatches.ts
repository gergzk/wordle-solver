import { getLegalWords } from "./Words";
import { Rule } from "./src/Rule";
import { firstGuesses } from "./firstGuesses";

// this file tells you what words match a Rule
// npm run match (contained letters) (not contained letters) (layout, eg: ..r.s) (not at position, eg: a:2,c:3,...)
const contains = process.argv[2]?.split("") || [];
const notContains = process.argv[3]?.split("") || [];
const placesAsString = process.argv[4] || ".....";
const notAtAsString = process.argv[5] || "";
const words = getLegalWords();
console.log(`Loaded ${words.length} words`);

const rule = new Rule();
contains.forEach(c => rule.addContains(c));
notContains.forEach(c => rule.remove(c));
placesAsString.split("").forEach((c,i) => { 
    if (c !== ".") {
        rule.setPosition(i, c);
    }
});
notAtAsString.length > 0 && notAtAsString.split(",").forEach(pair => {
    const ps = pair.split(":");
    const c = ps[0];
    const i = Number.parseInt(ps[1]);
    rule.removeFromPosition(i, c);
});
const matches = words.filter(word => rule.matches(word));
matches.sort((a,b) => (firstGuesses as any)[a] - (firstGuesses as any)[b]);
console.log(`Matches ${matches.length} words: ${matches.join(", ")}`);
