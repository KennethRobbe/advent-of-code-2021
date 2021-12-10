import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/7
 */
export default class Day7 extends BaseSolver {
    day = 7;
    rowSplit = ',';

    challenges = [
        {
            method: 'getOptimalCost',
            expectedTestResult: 37,
            params: {
                costFn: (p, fp) => Math.abs(fp - p)
            }
        },
        {
            method: 'getOptimalCost',
            expectedTestResult: 168,
            params: {
                costFn: (p, fp) => {
                    const n = Math.abs(fp - p);

                    let total = 0;
                    for (let i = 1; i <= n; i++) {
                        total += i;
                    }

                    return total;
                }
            }
        }
    ];

    parseDataPoint(d) {
        return parseInt(d, 10);
    }

    getOptimalCost(positions, { costFn }) {
        const maxPosition = Math.max(...positions);
        const possibleFinalPositions = Array.from({ length: maxPosition + 1 }, (_v, i) => i);
        const costsPerFinalPosition = possibleFinalPositions.map((p) =>
            this.getTotalFuelCostForPosition(positions, p, costFn)
        );
        const optimalCost = Math.min(...costsPerFinalPosition);

        return optimalCost;
    }

    getTotalFuelCostForPosition(initialPositions, finalPosition, costFn) {
        const costsPerPosition = initialPositions.map((p) => costFn(p, finalPosition));
        const totalCost = costsPerPosition.reduce((t, c) => t + c, 0);

        return totalCost;
    }
}
