import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/3
 */
export default class Day3 extends BaseSolver {
    columnSplit = '';
    day = 3;
    challenges = [
        {
            method: 'calculatePowerConsumption',
            expectedTestResult: 198
        },
        {
            method: 'calculateLifeSupportRating',
            expectedTestResult: 230
        }
    ];

    parseDataPoint(d) {
        return parseInt(d, 10);
    }

    calculatePowerConsumption(data) {
        const bitCount = this.getBitCount(data);

        // Calculate Gamma rate
        const mostCommonBits = this.getMostCommonBits(bitCount);
        const gammaRate = this.binaryToDecimal(mostCommonBits);

        // Calculate epsilon rate
        const leastCommonBits = this.getLeastCommonBits(bitCount);
        const epsilonRate = this.binaryToDecimal(leastCommonBits);

        console.log(`Gamma rate: ${gammaRate}, epsilon rate: ${epsilonRate}`);

        return gammaRate * epsilonRate;
    }

    calculateLifeSupportRating(data) {
        const oxygenGeneratorRatingBinary = this.getBestMatchingValue(data, true);
        const oxygenGeneratorRating = this.binaryToDecimal(oxygenGeneratorRatingBinary);

        const co2ScrubberRatingBinary = this.getBestMatchingValue(data, false);
        const co2ScrubberRating = this.binaryToDecimal(co2ScrubberRatingBinary);

        console.log(
            `Oxygen Generator Rating: ${oxygenGeneratorRating}, CO2 Scrubber Rating: ${co2ScrubberRating}`
        );

        return oxygenGeneratorRating * co2ScrubberRating;
    }

    binaryToDecimal(bits) {
        return parseInt(bits.join(''), 2);
    }

    getBitCount(data, length) {
        length = typeof length === 'number' ? length : data[0].length;
        return Array.from({ length }, (_v, i) => this.getBitCountAtPosition(data, i));
    }

    getBitCountAtPosition(data, i) {
        return [this.countBitsAtPosition(data, i, 0), this.countBitsAtPosition(data, i, 1)];
    }

    countBitsAtPosition(data, i, bit) {
        return data.filter((d) => d[i] === bit).length;
    }

    getMostCommonBits(bitCount) {
        return bitCount.map((counts) => this.getMostCommonBit(counts));
    }

    getMostCommonBit([zeroCount, oneCount]) {
        return zeroCount > oneCount ? 0 : 1;
    }

    getLeastCommonBits(bitCount) {
        return bitCount.map((counts) => this.getLeastCommonBit(counts));
    }

    getLeastCommonBit(counts) {
        return 1 - this.getMostCommonBit(counts);
    }

    getBestMatchingValue(data, mostCommon) {
        let values = [].concat(data);

        for (let i = 0; i < values[0].length; i++) {
            const bitCount = this.getBitCountAtPosition(values, i);
            const bitToMatch = mostCommon
                ? this.getMostCommonBit(bitCount)
                : this.getLeastCommonBit(bitCount);

            values = values.filter((v) => v[i] === bitToMatch);

            if (values.length === 1) {
                return values[0];
            }
        }
    }
}
