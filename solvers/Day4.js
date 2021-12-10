import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/4
 */
export default class Day4 extends BaseSolver {
    day = 4;

    rowSplit = /\r?\n\r?\n/g;
    columnSplit = /\s+/g;
    columnCount = 5;
    rowCount = 5;

    challenges = [
        {
            method: 'getFinalScoreForWinningBoard',
            expectedTestResult: 4512
        },
        {
            method: 'getFinalScoreForLastWinningBoard',
            expectedTestResult: 1924
        }
    ];

    parseFile(content) {
        let [numbersToCall, ...boards] = super.parseFile(content);

        return { numbersToCall, boards };
    }

    parseRow(r, i) {
        if (i === 0) {
            return r.split(',').map((d) => this.parseDataPoint(d));
        }

        return this.parseBoard(super.parseRow(r, i));
    }

    parseBoard(numbers) {
        const rows = Array.from({ length: this.rowCount }, (_v, i) =>
            numbers.slice(i * this.columnCount, (i + 1) * this.columnCount)
        );
        const columns = Array.from({ length: this.columnCount }, (_v, i) =>
            Array.from({ length: this.rowCount }, (_v, j) => numbers[j * this.columnCount + i])
        );

        return {
            numbers,
            rows,
            columns,
            rowsAndColumns: rows.concat(columns)
        };
    }

    parseDataPoint(d) {
        return parseInt(d, 10);
    }

    getFinalScoreForWinningBoard({ numbersToCall, boards }) {
        const { winningBoard, calledNumbers } = this.getWinningBoardAndNumbers(
            boards,
            numbersToCall
        );

        return this.calculateScore(winningBoard, calledNumbers);
    }

    getFinalScoreForLastWinningBoard({ numbersToCall, boards }) {
        const { lastWinningBoard, calledNumbers } = this.getLastWinningBoardAndNumbers(
            boards,
            numbersToCall
        );

        return this.calculateScore(lastWinningBoard, calledNumbers);
    }

    calculateScore(board, calledNumbers) {
        const unmarkedNumbers = board.numbers.filter((n) => !calledNumbers.includes(n));
        const sumOfUnMarkedNumbers = unmarkedNumbers.reduce((t, n) => t + n, 0);
        const lastNumber = calledNumbers[calledNumbers.length - 1];
        console.log(`Sum of unmarked numbers: ${sumOfUnMarkedNumbers}, last number: ${lastNumber}`);

        return sumOfUnMarkedNumbers * lastNumber;
    }

    getWinningBoardAndNumbers(boards, numbers) {
        let winningBoard, calledNumbers;
        for (let i = 5; i < numbers.length; i++) {
            calledNumbers = numbers.slice(0, i + 1);
            winningBoard = this.getWinningBoard(boards, calledNumbers);

            if (winningBoard) {
                break;
            }
        }

        return { winningBoard, calledNumbers };
    }

    getLastWinningBoardAndNumbers(boards, numbers) {
        let calledNumbers;
        let boardsToConsider = [].concat(boards);
        let winningBoards = [];
        for (let i = 5; i < numbers.length; i++) {
            calledNumbers = numbers.slice(0, i + 1);
            winningBoards = winningBoards.concat(
                boardsToConsider.filter((b) => this.isWinningBoard(b, calledNumbers))
            );
            boardsToConsider = boardsToConsider.filter((b) => !winningBoards.includes(b));

            if (boardsToConsider.length === 0) {
                break;
            }
        }

        const lastWinningBoard = winningBoards[winningBoards.length - 1];

        return { lastWinningBoard, calledNumbers };
    }

    getWinningBoard(boards, numbers) {
        return boards.find((b) => this.isWinningBoard(b, numbers));
    }

    isWinningBoard(board, numbers) {
        return !!this.getWinningRowOrColumn(board, numbers);
    }

    getWinningRowOrColumn(board, numbers) {
        return board.rowsAndColumns.find(
            (r) => r.filter((n) => numbers.includes(n)).length === r.length
        );
    }
}
