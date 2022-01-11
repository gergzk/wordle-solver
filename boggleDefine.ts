import { getWordDefinition } from "./BoggleWords";

const word = process.argv[2];
console.log(getWordDefinition(word));
