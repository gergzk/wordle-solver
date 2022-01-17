// in-place edit, clone, create
// assume length of 5 always


const WORDLENGTH = 5;
export const ALLLETERS = "abcdefghijklmnopqrstuvwxyz";
export class Rule {
    contains: string[];
    places: string[][];
    constructor() {
        // creates a default Rule object
        this.contains = [];
        this.places = [];
        for (let i = 0; i < WORDLENGTH; i++) {
            this.places.push(ALLLETERS.split(""));
        }
    }
    addContains(char: string) {
        if(this.contains.indexOf(char) < 0) {
            this.contains.push(char);
            this.contains.sort();
        }
    }
    setPosition(index: number, char: string) {
        this.places[index] = [char];
    }
    removeFromPosition(index: number, char: string) {
        const arr = this.places[index];
        const foundIndex = arr.indexOf(char);
        if (foundIndex >= 0) {
            arr.splice(foundIndex, 1);
        }
    }
    remove(char: string) {
        for (let i = 0; i < WORDLENGTH; i++) {
            this.removeFromPosition(i, char);
        }
    }
    matches(word: string): boolean {
        try {
            const wordAsLetters = word.split("");
            this.contains.forEach(char => {
                if (wordAsLetters.indexOf(char) < 0) {
                    throw new Error(`${word} does not contain expected ${char}`);
                }
            });
            this.places.forEach((validLetters, index) => {
                if (validLetters.indexOf(wordAsLetters[index]) < 0) {
                    throw new Error(`${word} has unexpected letter at index ${index}`);
                }
            });
            return true;
        } catch {
            return false;
        }
    }
    merge(rule: Rule): Rule {
        const r = this.clone();
        // merge the includes
        rule.contains.forEach(char => r.addContains(char));
        // for each of my values that's not also in the other set, remove it
        r.places.forEach((values, index) => {
            r.places[index] = values.filter(val => rule.places[index].indexOf(val) >= 0);
        });
        return r;
    }
    clone(): Rule {
        const r = new Rule();
        r.contains = JSON.parse(JSON.stringify(this.contains));
        r.places = JSON.parse(JSON.stringify(this.places));
        return r;
    }
    hash(): string {
        return `${this.contains};${this.places}`;
    }
    static create(guessWord: string, goalWord:string): Rule {
        const r = new Rule();
        const guessAsLetters = guessWord.split("");
        const goalAsLetters = goalWord.split("");
        // if there's a match, setPosition
        for (let i = 0; i < WORDLENGTH; i++) {
            if (guessAsLetters[i] === goalAsLetters[i]) {
                r.setPosition(i, guessWord[i]);
                r.addContains(guessWord[i]);
            }
        }
        // if the letter is in the goal word, addContains
        guessAsLetters.forEach((char, i) => {
            if (goalAsLetters.indexOf(char) >= 0) {
                if (goalAsLetters[i] !== char) {
                    r.removeFromPosition(i, char);
                }
                r.addContains(char);
            } else {
                r.remove(char);
            }
        })
        return r;
    }
}