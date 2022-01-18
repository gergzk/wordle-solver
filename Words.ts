import { legalGuess } from "./legalGuesses";
import { legalWordles } from "./legalWords";

export function getLegalWords() {
    return legalWordles;
}

export function getLegalGuesses() {
    return legalGuess;
}

