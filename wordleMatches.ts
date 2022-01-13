import { getLegalWords } from "./Words";
import { Rules } from "./src/Rules";

const contains = process.argv[2]?.split("") || [];
const notContains = process.argv[3]?.split("") || [];
const placesAsString = process.argv[4] || ".....";
const words = getLegalWords(5);
console.log(`Loaded ${words.length} words`);
//console.log(`Read args ${contains}, ${notContains}, ${placesAsString}`);

const places = placesAsString.split("").map((c,i) => { return { index: i, char: c }}).filter(e => e.char != ".");
const rules = new Rules(5, contains, notContains, places);
const matches = words.filter(word => rules.matches(word));
matches.sort();
console.log(`Matches ${matches.length} words: ${matches.join(", ")}`);
