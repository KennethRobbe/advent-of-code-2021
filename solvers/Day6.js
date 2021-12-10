import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/6
 */
export default class Day6 extends BaseSolver {
    day = 6;
    rowSplit = ',';

    challenges = [
        {
            method: 'getNumberOfFishes',
            expectedTestResult: 5934,
            params: {
                iterations: 80,
                initialAge: 8,
                resetAge: 6
            }
        },
        {
            method: 'getNumberOfFishes',
            expectedTestResult: 26984457539,
            params: {
                iterations: 256,
                initialAge: 8,
                resetAge: 6
            }
        }
    ];

    parseDataPoint(d) {
        return parseInt(d, 10);
    }

    getNumberOfFishes(fishes, params) {
        let ageDistribution = this.getAgeDistribution(fishes, params);
        let fishCount;
        for (var i = 0; i < params.iterations; i++) {
            ageDistribution = this.runCycle(ageDistribution, params);
            fishCount = this.getFishCount(ageDistribution);
            console.log(`Cycle ${i + 1}: ${fishCount} fishes`);
        }

        return fishCount;
    }

    getAgeDistribution(fishes, params) {
        return Array.from(
            { length: params.initialAge + 1 },
            (_v, i) => fishes.filter((f) => f === i).length
        );
    }

    runCycle(ageDistribution, params) {
        let resetFishes = 0;
        const newAgeDistribution = ageDistribution.map((count, i) => {
            if (i === 0) {
                resetFishes = count;
            }

            return ageDistribution[i === params.initialAge ? 0 : i + 1];
        });
        newAgeDistribution[params.resetAge] += resetFishes;

        return newAgeDistribution;
    }

    getFishCount(ageDistribution) {
        return ageDistribution.reduce((t, c) => t + c, 0);
    }
}
