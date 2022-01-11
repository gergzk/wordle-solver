import { Algo1 } from "./index";
import { getBoard, getBoardFromRolls } from "./BoggleBoard";
import { getLegalWords } from "./BoggleWords";
const wordArray = getLegalWords();
console.log(`Loading dictionary with ${wordArray.length} words`);


function printWords(wordList: string[]) {
    console.log(`Found ${wordList.length} words:`);

    for (let len = 16; len > 0; len--) {
        const match = wordList.filter(w => w.length === len);
        let out = `${len} (${match.length}):\t`;
        while (match.length > 0) {
            while (out.length < outWidth - len - 1 && match.length > 0) {
                out += match.shift();
                if (match.length > 0) {
                    out += ", ";
                }
            }
            console.log(out);
            out = "\t";
        }
    }
}

const outWidth = 80;
const boardLetters = process.argv[2];
let board;
if (boardLetters) {
    const splitQU = boardLetters.split("qu");
    let rolls: string[];
    if (splitQU.length === 1) {
        rolls = boardLetters.split("");
    } else {
        rolls = splitQU[0].split("");
        rolls.push("qu");
        rolls = rolls.concat(splitQU[1].split(""));
    }
    board = getBoardFromRolls(rolls);
} else {
    board = getBoard();
}
console.log(board.squares);
const algo = new Algo1(wordArray);
const found = algo.findWords(board);
const sortedFound = found.sort((a,b) => b.length - a.length);

printWords(sortedFound);


