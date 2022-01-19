import { Rule } from ".";
import { firstGuesses } from "./firstGuesses";
import { getLegalGuesses } from "./Words";

export interface IStrategy {
    firstGuess(): string;
    secondGuess(firstWord: string, rule: Rule): string;
}

class MatchWordsCache {
    legalWords: string[];
    matches: { [x: string]: string[] } = {};
    constructor(words: string[]) {
        this.legalWords = words;
    }
    getMatches(rule:Rule): string[] {
        const h = rule.hash();
        if (this.matches[h] === undefined) {
            this.matches[h] = this.legalWords.filter(w => rule.matches(w));
        }
        return this.matches[h];
    }
}

export class Strategy1 implements IStrategy {
    matches = new MatchWordsCache(getLegalGuesses());
    firstGuess(): string {
        return Object.keys(firstGuesses)[0];
    }
    secondGuess(first: string, rule: Rule): string {
        const guesses = this.matches.getMatches(rule);
        guesses.sort((a,b) => (firstGuesses as any)[a] - (firstGuesses as any)[b]);
        return guesses[0];
    }
}