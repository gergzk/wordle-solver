import { dictionary } from "./dictionary";

export function getLegalWords(length: number = 5) {
    const wordArray: string[] = Object.keys(dictionary);
    return wordArray.filter(word => word.length === length && word.indexOf("-") < 0);
}

