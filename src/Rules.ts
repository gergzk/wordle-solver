// This represents what letters are in place, not included, included
// Also able to merge with another Rules to create a new Rules

interface Place {
    index: number;
    char: string;
}

export class Rules {
    readonly length: number;
    readonly contains: string[];
    readonly notContains: string[];
    readonly places: Place[];

    static create(guess: string, actual: string): Rules {
        if (guess.length !== actual.length) {
            throw new Error(`Incompatible string lengths: ${guess}, ${actual}`);
        }
        const g = guess.split("");
        const a = actual.split("");
        const contains = g.filter(c => a.indexOf(c) >= 0);
        const notContains = g.filter(c => a.indexOf(c) < 0);
        const places: Place[] = [];
        g.forEach((c, i) => { if (a[i] === c) places.push({ index: i, char: c})});
        return new Rules(actual.length, contains, notContains, places);
    }
    constructor(length: number, contains: string[], notContains: string[], places: Place[]) {
        this.length = length;
        this.contains = contains;
        this.notContains = notContains;
        this.places = places;
    }
    matches(testString: string): boolean {
        // check all three tests
        const testAsArray = testString.split("");
        let allFound = true;
        this.contains.forEach(c => {
            allFound = allFound && testAsArray.indexOf(c) >= 0
        });
        if (!allFound) {
            return false;
        }
        const notFound = testAsArray.filter(c => this.notContains.indexOf(c) >= 0);
        if (notFound.length > 0) {
            return false;
        }
        let ret = true;
        this.places.forEach(e => {
                ret = ret && (testAsArray[e.index] === e.char);
            }
        );
        return ret;
    }
    mergeRules(rules: Rules): Rules {
        if (this.length !== rules.length) {
            throw new Error("Mismatched length rules encountered");
        }
        // merge the next rule object to create a sum of the argument and this Rules
        const contains = Rules.mergeArrays(this.contains, rules.contains);
        const notContains = Rules.mergeArrays(this.notContains, rules.notContains);
        const placesToAdd = rules.places.filter(e => !Rules.placesContains(e, this.places));
        const places = this.places.map(p => p).concat(placesToAdd);
        return new Rules(this.length, contains, notContains, places);
    }
    static mergeArrays(arr1: string[], arr2: string[]): string[] {
        const arr = arr1.map(s => s);
        arr2.filter(s => arr1.indexOf(s) < 0).forEach(s => arr.push(s));
        return arr;
    }
    static placesContains(p: Place, places: Place[]): boolean {
        let ret = false;
        places.forEach(place => { 
            ret = ret || place.index === p.index
            if (place.index === p.index && place.char !== p.char) {
                throw new Error(`Incompatible chars found at index ${place.index}`);
            }
        });
        return ret;
    }
}