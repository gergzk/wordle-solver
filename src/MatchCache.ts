import { Rule } from "./Rule";


export class MatchCache {
    readonly dictionary: string[];
    readonly matchList: { [x: string]: number };
    constructor(legalWords: string[]) {
        this.dictionary = legalWords;
        this.matchList = {};
    }

    matchCount(rule: Rule): number {
        const hash = rule.hash();
        if (this.matchList[hash] === undefined) {
            this.matchList[hash] = this.dictionary.filter(w => rule.matches(w)).length;
        }
        return this.matchList[hash];
    }
}