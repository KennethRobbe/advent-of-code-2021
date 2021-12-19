import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/8
 */
export default class Day8 extends BaseSolver {
    day = 8;
    columnSplit = ' | ';

    challenges = [
        {
            method: 'getUniqueDigitCount',
            expectedTestResult: 26
        },
        {
            method: 'getOutputCount',
            expectedTestResult: 61229
        }
    ];

    digitMap = [
        [0, 1, 2, 4, 5, 6],
        [2, 5],
        [0, 2, 3, 4, 6],
        [0, 2, 3, 5, 6],
        [1, 2, 3, 5],
        [0, 1, 3, 5, 6],
        [0, 1, 3, 4, 5, 6],
        [0, 2, 5],
        [0, 1, 2, 3, 4, 5, 6],
        [0, 1, 2, 3, 5, 6]
    ];

    solveChallenges() {
        this.prepareMaps();
        super.solveChallenges();
    }

    prepareMaps() {
        this.segmentCountMap = [];
        this.segmentMap = [];

        this.digitMap.forEach((segments, digit) => {
            const count = segments.length;
            this.segmentCountMap[count] = this.segmentCountMap[count] || [];
            this.segmentCountMap[count].push(digit);

            segments.forEach((s) => {
                this.segmentMap[s] = this.segmentMap[s] || [];
                this.segmentMap[s].push(digit);
            });
        });
    }

    parseRow(r) {
        const [signals, outputs] = super.parseRow(r);

        return { signals, outputs };
    }

    parseDataPoint(d) {
        return d.split(/\s/).map((v) => {
            const letters = v.split('').sort();

            return {
                letters,
                possibleDigits: this.segmentCountMap[letters.length]
            };
        });
    }

    getUniqueDigitCount(rows) {
        const uniqueDigits = rows.flatMap(({ outputs }) =>
            outputs.filter((o) => o.possibleDigits.length === 1)
        );

        return uniqueDigits.length;
    }

    getOutputCount(rows) {
        const outputNumbers = rows.map(({ signals, outputs }) => {
            const digitsMap = this.processSignals(signals);
            const outputNumber = this.getOutputNumber(outputs, digitsMap);

            return outputNumber;
        });

        return outputNumbers.reduce((t, o) => t + o, 0);
    }

    processSignals(signals) {
        const possibleSignals = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const segments = new Array(7).fill(undefined);
        let digits = new Array(10).fill(undefined);
        const segmentCountMap = [];

        signals.forEach(({ letters, possibleDigits }) => {
            // Group signals by number of letters
            segmentCountMap[letters.length] = segmentCountMap[letters.length] || [];
            segmentCountMap[letters.length].push(letters);

            // Determine letters for digits with unique number of segments
            if (possibleDigits.length === 1) {
                const digit = possibleDigits[0];
                digits[digit] = letters;
            }
        });

        // Determine shared segments between 2, 3 & 5 (all using 5 segments).
        // Those correspond to positions 0, 3 & 6
        const shared036 = this.determineSharedSegments(segmentCountMap[5]);

        // Determine shared segments between 0, 5, 9 (all using 6 segments).
        // Those correspond to positions 0, 1, 5 & 6
        const shared0156 = this.determineSharedSegments(segmentCountMap[6]);

        // Top segment is segment that's part of 7, but not of 1
        segments[0] = digits[7].find((s) => !digits[1].includes(s));

        // Other 2 shared segments are right segments.
        // Use other shared segments to determine correct segment
        const possibilities25 = this.determineSharedSegments([digits[7], digits[1]]);
        segments[2] = possibilities25.find((s) => !shared0156.includes(s));
        segments[5] = possibilities25.find((s) => shared0156.includes(s));

        // Top-left & middle segment are segments that aren't shared between 1 & 4
        // Use other shared segments to determine correct segment
        const possibilities13 = digits[4].filter((s) => !digits[1].includes(s));
        segments[1] = possibilities13.find((s) => shared0156.includes(s));
        segments[3] = possibilities13.find((s) => shared036.includes(s));

        // Bottom-left & bottom segment are segments that haven't been assigned yet
        // Use other shared segments to determine correct segment
        const alreadyAssignedSignals = segments.filter(Boolean);
        const possibilities46 = possibleSignals.filter((s) => !alreadyAssignedSignals.includes(s));
        segments[4] = possibilities46.find((s) => !shared036.includes(s));
        segments[6] = possibilities46.find((s) => shared036.includes(s));

        // Map digits to signal combination
        const digitsMap = digits.map((letters, d) => {
            if (!letters) {
                return this.digitMap[d]
                    .map((s) => segments[s])
                    .sort()
                    .join('');
            }

            return letters.sort().join('');
        });

        return digitsMap;
    }

    determineSharedSegments(segmentOptions) {
        return segmentOptions
            .flat()
            .filter(
                (letter, i, arr) => arr.filter((l) => l === letter).length === segmentOptions.length
            )
            .filter((letter, i, arr) => arr.indexOf(letter) === i);
    }

    getOutputNumber(outputs, digitsMap) {
        const digits = outputs.map((o) => this.getOutputDigit(o, digitsMap)).join('');
        return parseInt(digits, 10);
    }

    getOutputDigit(output, digitsMap) {
        const letters = output.letters.join('');
        return digitsMap.findIndex((digitLetters) => digitLetters === letters);
    }
}
