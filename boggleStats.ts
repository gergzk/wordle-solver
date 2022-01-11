import { getBoard } from "./BoggleBoard";
import { getLegalWords } from "./BoggleWords";
import { Algo1 } from "./src/algorithms/Algo1";

const samples = parseInt(process.argv[2]) || 1000;
const stats: { sum: number, count: number}[] = [];
const sampleWords: { [x: number]: string} = {};
for (let s = 0; s < 17; s++) {
    stats.push({ sum: 0, count: 0 });
}
const legalWords = getLegalWords();
const algo = new Algo1(legalWords);
for (let i = 0; i < samples; i++) {
    const words = algo.findWords(getBoard());
    for (let s = 0; s < 17; s++) {
        const wordsOfLength = words.filter(w => w.length === s);
        stats[s].sum += wordsOfLength.length;
        stats[s].count += wordsOfLength.length > 0 ? 1 : 0
        if (wordsOfLength.length > 0) {
            sampleWords[s] = wordsOfLength[0];
        }
    }
}

for (let s = 3; s < 17; s++) {
    if (stats[s].count > 0) {
        console.log(`${s}: Odds: ${stats[s].count / samples}, Average: ${stats[s].sum / samples} Example: ${sampleWords[s]}`);
    }
}