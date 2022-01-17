import { legalGuess } from "./legalGuesses";
import { legalWordles } from "./wordleWords";

export function getLegalWords() {
    return legalWordles;
}

export function getLegalGuesses() {
    return legalGuess;
}

