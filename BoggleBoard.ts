import { Board, Dice, Deck } from "./index";

export const allTheDice = [
    new Dice("soiste".split("")),
    new Dice("ngeeaa".split("")),
    new Dice("ueesni".split("")),
    new Dice("hrvtew".split("")),
    new Dice("wtoota".split("")),
    new Dice("cmuoit".split("")),
    new Dice("eehnwg".split("")),
    new Dice("obbajo".split("")),
    new Dice("zhrlnn".split("")),
    new Dice("eltytr".split("")),
    new Dice("pshaco".split("")),
    new Dice("dryvle".split("")),
    new Dice("rliexd".split("")),
    new Dice("ytdtsi".split("")),
    new Dice(["m","u","h","n","i","qu"]),
    new Dice("aspfkf".split("")),
];

export function getBoard() {
    const deck = new Deck(allTheDice).shuffle();
    const rolls = deck.elements.map(dice => dice.roll());
    return getBoardFromRolls(rolls);
}

export function getBoardFromRolls(rolls: any[]) {
    const sq: string[][] = [];
    for (let i = 0; i < 4; i++) {
        const r = [];
        for (let j = 0; j < 4; j++) {
            r.push(rolls[i*4+j]);
        }
        sq.push(r);
    }
    return new Board(sq);
}

