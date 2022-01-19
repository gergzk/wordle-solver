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

// pick the best eliminator of the remaining matches
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

// pick the remaining words with the most vowels
export class Strategy2 implements IStrategy {
    matches = new MatchWordsCache(getLegalGuesses());
    firstGuess(): string {
        return Object.keys(firstGuesses)[0];
    }
    secondGuess(firstWord: string, rule: Rule): string {
        const guesses = this.matches.getMatches(rule);
        // sort by most vowels
        guesses.sort((a,b) => this.vowels(b)-this.vowels(a));
        return guesses[0];
    }
    vs = "aeiou".split("");
    vowels(s: string): number {
        const obj: any = {};
        this.vs.forEach(v => { if(s.indexOf(v) >= 0){
            obj[v] = true;
        }});
        return Object.keys(obj).length;
    }
}

export class MarisaStrategy implements IStrategy {
    matches = new MatchWordsCache(getLegalGuesses());
    firstGuess(): string {
        return Object.keys(firstGuesses)[0];
    }
    secondGuess(firstWord: string, rule: Rule): string {
        const guesses = this.matches.getMatches(rule);
        // pick a random one
        return guesses[Math.floor(Math.random() * guesses.length)];
    }
}