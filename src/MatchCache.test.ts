import { getLegalWords } from "../Words"
import { MatchCache } from "./MatchCache"
import { Rule } from "./Rule";

describe("MatchCache", () => {
    test("Constructs", () => {
        const m = new MatchCache(getLegalWords());
        expect(m).toBeDefined();
    });
    test("Returns matches", () => {
        const m = new MatchCache(["tears", "raise"]);
        const r = new Rule();
        r.remove("t");
        const mCount = m.matchCount(r);
        expect(mCount).toBe(1);
    });
    test("Returns matches again", () => { // implicitly tests cache hit via coverage requirement
        const m = new MatchCache(["tears", "raise"]);
        const r = new Rule();
        r.remove("t");
        m.matchCount(r);
        // try a clone, hash should match
        const mCount = m.matchCount(r.clone());
        expect(mCount).toBe(1);
    });
});
