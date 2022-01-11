import { Rules } from "./Rules";

describe("Rules", () => {
    const empty = (s: any[]) => expect(s).toStrictEqual([]);
    describe("constructor", () => {
        test("throws for mismatched inputs", () => {
            expect(() => Rules.create("short", "long")).toThrowError();
        });
        test("No overlap", () => {
            const r = Rules.create("dog", "cat");
            empty(r.contains);
            expect(r.notContains).toStrictEqual("dog".split(""));
            empty(r.places);
        });
        test("Perfect match", () => {
            const r = Rules.create("cat", "cat");
            expect(r.contains).toStrictEqual("cat".split(""));
            empty(r.notContains);
            expect(r.places).toStrictEqual([{index:0, char: "c"}, {index:1, char: "a"}, {index:2, char: "t"}]);
        });
        test("Same letters, none in same spot", () => {
            const r = Rules.create("cat", "toe");
            expect(r.contains).toStrictEqual(["t"]);
            expect(r.notContains).toStrictEqual("ca".split(""));
            empty(r.places);
        });
        test("Letter in same spot", () => {
            const r = Rules.create("cat", "far");
            expect(r.contains).toStrictEqual(["a"]);
            expect(r.notContains).toStrictEqual("ct".split(""));
            expect(r.places).toStrictEqual([{index:1, char:"a"}]);
        });
        test("Letter in the same spot, and another match", () => {
            const r = Rules.create("cat", "tap");
            expect(r.contains).toStrictEqual("at".split(""));
            expect(r.notContains).toStrictEqual(["c"]);
            expect(r.places).toStrictEqual([{index:1, char:"a"}]);
        });
    });
    describe("matches", () => {
        const rNone = Rules.create("dog", "cat");
        const rSome = Rules.create("cat", "toe");
        const rSpot = Rules.create("cat", "far");
        const rSpotAndSome = Rules.create("cat", "tap");
        describe("false", () => {
            test("No match for rNone", () => {
                ["dog", "lag"].forEach(w => {
                    expect(rNone.matches(w)).toBe(false);
                })
            });
            test("No match for rSome", () => {
                ["rid", "cop"].forEach(w => {
                    expect(rSome.matches(w)).toBe(false);
                })
            });
            test("No match for rSpot", () => {
                ["ape", "cap"].forEach(w => {
                    expect(rSpot.matches(w)).toBe(false);
                })
            });
            test("No match for rSpotAndSome", () => {
                ["the", "rap"].forEach(w => {
                    expect(rSpotAndSome.matches(w)).toBe(false);
                })
            });
        });
        describe("true", () => {
            test("Match for rNone", () => {
                ["hat", "urn"].forEach(w => {
                    expect(rNone.matches(w)).toBe(true);
                })
            });
            test("Match for rSome", () => {
                ["rut", "pot"].forEach(w => {
                    expect(rSome.matches(w)).toBe(true);
                })
            });
            test("Match for rSpot", () => {
                ["rap", "max"].forEach(w => {
                    expect(rSpot.matches(w)).toBe(true);
                })
            });
            test("Match for rSpotAndSome", () => {
                ["tag", "bat"].forEach(w => {
                    expect(rSpotAndSome.matches(w)).toBe(true);
                })
            });
        });
    });
});