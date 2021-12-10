import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/1
 */
export default class Day1 extends BaseSolver {
    day = 1;
    challenges = [
        {
            method: 'countIncreases',
            expectedTestResult: 7
        },
        {
            method: 'countSlidingWindowIncreases',
            params: {
                slidingWindowWidth: 3
            },
            expectedTestResult: 5
        }
    ];

    parseDataPoint(d) {
        return parseInt(d, 10);
    }

    // count the number of times a depth measurement increases from the previous measurement
    countIncreases(data) {
        return data.filter((d, i, arr) => i > 0 && arr[i - 1] < d).length;
    }

    // Considering sums of a three-measurement sliding window,
    // count the number of times the sum of measurements in this sliding window
    // increases from the previous sum
    countSlidingWindowIncreases(data, params) {
        const slidingWindowWidth = params.slidingWindowWidth;
        const slidingWindowSums = data
            .map((d, i, arr) => {
                if (i + slidingWindowWidth > arr.length) {
                    return;
                }

                const slidingWindow = arr.slice(i, i + slidingWindowWidth);
                const sum = slidingWindow.reduce((total, n) => total + n, 0);

                return sum;
            })
            .filter((w) => typeof w !== 'undefined');

        return this.countIncreases(slidingWindowSums);
    }
}
