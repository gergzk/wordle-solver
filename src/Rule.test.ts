import { getLegalGuesses } from "../Words";
import { ALLLETERS, Rule } from "./Rule";

describe("Rule", () => {
    const allLetters = ALLLETERS.split("");
    describe("synthetic", () => {
        test("sanity check", () => {
            expect(allLetters).toHaveLength(26);
        });
        test("constructor", () => {
            const r = new Rule();
            expect(r.contains).toStrictEqual([]);
            expect(r.places).toStrictEqual([allLetters, allLetters, allLetters, allLetters, allLetters]);
        });
    });
    describe("addContains", () => {
        test("Adds new", () => {
            const r = new Rule();
            r.addContains("a");
            expect(r.contains).toStrictEqual(["a"]);
        });
        test("Adds multiple", () => {
            const r = new Rule();
            r.addContains("a");
            r.addContains("b");
            expect(r.contains).toStrictEqual(["a", "b"]);
        });
        test("Does not re-add", () => {
            const r = new Rule();
            r.addContains("a");
            r.addContains("b");
            r.addContains("a");
            expect(r.contains).toStrictEqual(["a", "b"]);
        })
    });
    describe("removeFromPosition", () => {
        test("removes", () => {
            const r = new Rule();
            r.removeFromPosition(2, "j");
            expect(r.places).toStrictEqual([allLetters, allLetters, "abcdefghiklmnopqrstuvwxyz".split(""), allLetters, allLetters]);
        });
        test("removes second", () => {
            const r = new Rule();
            r.removeFromPosition(2, "j");
            r.removeFromPosition(2, "f");
            expect(r.places).toStrictEqual([allLetters, allLetters, "abcdeghiklmnopqrstuvwxyz".split(""), allLetters, allLetters]);
        });
        test("removes from other index", () => {
            const r = new Rule();
            r.removeFromPosition(2, "j");
            r.removeFromPosition(1, "f");
            expect(r.places).toStrictEqual([allLetters, "abcdeghijklmnopqrstuvwxyz".split(""), "abcdefghiklmnopqrstuvwxyz".split(""), allLetters, allLetters]);
        });
        test("does not re-remove", () => {
            const r = new Rule();
            r.removeFromPosition(2, "j");
            r.removeFromPosition(2, "f");
            r.removeFromPosition(2, "j");
            expect(r.places).toStrictEqual([allLetters, allLetters, "abcdeghiklmnopqrstuvwxyz".split(""), allLetters, allLetters]);
        });
    });
    describe("remove", () => {
        test("removes one from all", () => {
            const r = new Rule();
            r.remove("s");
            const letters = "abcdefghijklmnopqrtuvwxyz".split("");
            expect(r.places).toStrictEqual([letters, letters, letters, letters, letters]);
        });
        test("removes many from all", () => {
            const r = new Rule();
            r.remove("s");
            r.remove("a");
            const letters = "bcdefghijklmnopqrtuvwxyz".split("");
            expect(r.places).toStrictEqual([letters, letters, letters, letters, letters]);
        });
        test("does not re-remove", () => {
            const r = new Rule();
            r.remove("s");
            r.remove("a");
            r.remove("s");
            const letters = "bcdefghijklmnopqrtuvwxyz".split("");
            expect(r.places).toStrictEqual([letters, letters, letters, letters, letters]);
        });
    });
    describe("setPosition", () => {
        test("sets index", () => {
            const r = new Rule();
            r.setPosition(2, "t");
            expect(r.places).toStrictEqual([allLetters, allLetters, ["t"], allLetters, allLetters]);
        });
        test("sets 2nd index", () => {
            const r = new Rule();
            r.setPosition(2, "t");
            r.setPosition(0, "a");
            expect(r.places).toStrictEqual([["a"], allLetters, ["t"], allLetters, allLetters]);
        });     
    });
    describe("clone", () => {
        test("same", () => {
            const r = new Rule();
            r.setPosition(2, "t");
            r.remove("a");
            r.addContains("t");
            r.addContains("i");
            const r2 = r.clone();
            expect(r.contains).toStrictEqual(r2.contains);
            expect(r.places).toStrictEqual(r2.places);
        })
    });
    describe("hash", () => {
        test("sanity check", () => {
            const r1 = new Rule();
            const r2 = new Rule();
            r2.setPosition(1, "t");
            r1.setPosition(1, "s");
            expect(r1.hash()).not.toBe(r2.hash());
        });
    });
    describe("matches", () => {
        test("Blank matches all", () => {
            const words = getLegalGuesses();
            const r = new Rule();
            words.forEach(word => {
                expect(r.matches(word)).toBe(true);
            });
        });
        test("Missing contained letter", () => {
            const r = new Rule();
            r.addContains("t");
            expect(r.matches("nurse")).toBe(false);
        });
        test("Unexpected letter at index", () => {
            const r = new Rule();
            r.removeFromPosition(0, "a");
            expect(r.matches("anise")).toBe(false);
        });
        test("Unexpected letter", () => {
            const r = new Rule();
            r.remove("a");
            expect(r.matches("tears")).toBe(false);
        });
        test("Real scenario 1", () => {
            const r = new Rule();
            r.removeFromPosition(0, "i");
            r.removeFromPosition(1, "r");
            r.addContains("i");
            r.addContains("r");
            r.remove("a");
            r.remove("t");
            r.setPosition(4, "e");
            r.removeFromPosition(0, "r");
            r.removeFromPosition(1, "i");
            r.remove("f");
            r.remove("l");
            expect(r.matches("shire")).toBe(true);
        })
    });
    describe("merge", () => {
        const blank = new Rule();
        test("two blanks make blank", () => {
            const r = blank.merge(blank);
            getLegalGuesses().forEach(guess => {
                expect(r.matches(guess)).toBe(blank.matches(guess));
            });
        });
        test("blank and something is something", () => {
            const r1 = new Rule();
            r1.setPosition(2, "t");
            r1.addContains("t");
            r1.remove("b");
            const r = blank.merge(r1);
            getLegalGuesses().forEach(guess => {
                expect(r.matches(guess)).toBe(r1.matches(guess));
            });
        });
        test("two sets merge as expected", () => {
            const r1 = new Rule();
            r1.setPosition(0, "a");
            r1.addContains("a");
            r1.removeFromPosition(3, "z");
            const r2 = new Rule();
            r2.setPosition(1, "b");
            r2.addContains("b");
            r2.addContains("c");
            r2.removeFromPosition(3, "y");
            const r = r1.merge(r2);
            expect(r.contains).toStrictEqual(["a", "b", "c"]);
            expect(r.places).toStrictEqual([["a"], ["b"], allLetters, "abcdefghijklmnopqrstuvwx".split(""), allLetters]);

        })
    });
    describe("create", () => {
        test("Sanity check", () => {
            const r = Rule.create("irate", "shire");
            expect(r.contains).toStrictEqual(["e", "i", "r"]);
            const noIAT = "bcdefghjklmnopqrsuvwxyz".split("");
            const noRAT = "bcdefghijklmnopqsuvwxyz".split("");
            const noAT = "bcdefghijklmnopqrsuvwxyz".split("");
            expect(r.places).toStrictEqual([noIAT, noRAT, noAT, noAT, ["e"]]);
        });
    });
});