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
    describe("merge", () => {
        test.skip("Put merge tests here", () => {});
        test.skip("Swap boggle stuff for wordle stuff - session with updating rules", () => {});
    });
    describe("statics", () => {
        describe("mergeArrays", () => {
            test("no overlap", () => {
                const a1 = "hat".split("");
                const a2 = "box".split("");
                expect(Rules.mergeArrays(a1, a2)).toStrictEqual("hatbox".split(""));
            });
            test("some overlap", () => {
                const a1 = "hat".split("");
                const a2 = "bot".split("");
                expect(Rules.mergeArrays(a1, a2)).toStrictEqual("hatbo".split(""));
            });
            test("all overlap", () => {
                const a1 = "hat".split("");
                const a2 = "hat".split("");
                expect(Rules.mergeArrays(a1, a2)).toStrictEqual("hat".split(""));
            });
        });
        describe("placesContains", () => {
            const places = [{ index: 1, char: "g" }, { index: 3, char: "x" }];
            test("contains", () => {
                const p = { index: 3, char: "x" };
                expect(Rules.placesContains(p, places)).toBe(true);
            });
            test("not contains", () => {
                const p = { index: 2, char: "a" };
                expect(Rules.placesContains(p, places)).toBe(false);
            });
            test("collision with mismatching char throws", () => {
                const p = { index: 3, char: "a" };
                expect(() => Rules.placesContains(p, places)).toThrowError();
            })
        });
    });
});