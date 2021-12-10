import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/1
 */
export default class Day1 extends BaseSolver {
    columnSplitRegex = /\s/g;
    day = 2;
    challenges = [
        {
            method: 'navigate',
            expectedTestResult: 150,
            params: {
                handlers: {
                    forward: (pos, amount) => {
                        pos[0] += amount;
                        return pos;
                    },
                    down: (pos, amount) => {
                        pos[1] += amount;
                        return pos;
                    },
                    up: (pos, amount) => {
                        pos[1] -= amount;
                        return pos;
                    }
                }
            }
        },
        {
            method: 'navigate',
            expectedTestResult: 900,
            params: {
                handlers: {
                    forward: (pos, amount) => {
                        pos[0] += amount;
                        pos[1] += pos[2] * amount;
                        return pos;
                    },
                    down: (pos, amount) => {
                        pos[2] += amount;
                        return pos;
                    },
                    up: (pos, amount) => {
                        pos[2] -= amount;
                        return pos;
                    }
                }
            }
        }
    ];

    parseRow(r) {
        const [dir, number] = super.parseRow(r);
        return [dir, parseInt(number, 10)];
    }

    navigate(data, params) {
        const finalPosition = data.reduce(
            (pos, [dir, amount]) => params.handlers[dir](pos, amount),
            [0, 0, 0]
        );
        console.log(`Final position is ${finalPosition}`);

        return finalPosition[0] * finalPosition[1];
    }
}
