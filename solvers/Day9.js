import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/9
 */
export default class Day9 extends BaseSolver {
    day = 9;
    columnSplit = '';

    challenges = [
        {
            method: 'getRiskLevelSum',
            expectedTestResult: 15
        },
        {
            method: 'getBasinSizeMultiplication',
            expectedTestResult: 1134
        }
    ];

    parseDataPoint(d) {
        return parseInt(d, 10);
    }

    getRiskLevelSum(heightMap) {
        const lowestPoints = this.findLowestPoints(heightMap);
        const riskLevels = lowestPoints.map(({ height }) => height + 1);
        const sum = riskLevels.reduce((t, c) => t + c, 0);

        return sum;
    }

    getBasinSizeMultiplication(heightMap) {
        const basins = this.findBasins(heightMap);
        const threeLargestBasins = basins.sort((a, b) => b.length - a.length).slice(0, 3);
        const multiplication = threeLargestBasins.reduce((t, c) => t * c.length, 1);

        return multiplication;
    }

    findBasins(heightMap) {
        const lowestPoints = this.findLowestPoints(heightMap);
        return this.getBasinsForLowestPoints(lowestPoints, heightMap);
    }

    getBasinsForLowestPoints(lowestPoints, heightMap) {
        return lowestPoints
            .map((p) => this.findBasinPoints(heightMap, p))
            .map((basinPoints) => {
                const coords = basinPoints.map(({ x, y }) => `${x}|${y}`);
                const uniquePoints = basinPoints.filter(
                    ({ x, y }, i) => coords.indexOf(`${x}|${y}`) === i
                );

                return uniquePoints;
            });
    }

    findBasinPoints(heightMap, point) {
        const { x, y, height } = point;
        const surroundingPoints = this.getSurroundingPoints(heightMap, x, y)
            .filter((p) => p.height > height && p.height < 9)
            .flatMap((p) => this.findBasinPoints(heightMap, p));

        return [point].concat(surroundingPoints);
    }

    findLowestPoints(heightMap) {
        let lowestPoints = [];

        for (let y = 0; y < heightMap.length; y++) {
            for (let x = 0; x < heightMap[y].length; x++) {
                const point = this.getPointAtCoordinates(heightMap, x, y);
                const lowerPoints = this.getSurroundingPoints(heightMap, x, y).filter(
                    (p) => p.height <= point.height
                );

                if (lowerPoints.length === 0) {
                    lowestPoints.push(point);
                }
            }
        }

        return lowestPoints;
    }

    getSurroundingPoints(heightMap, x, y) {
        return [
            this.getPointAtCoordinates(heightMap, x - 1, y), // left
            this.getPointAtCoordinates(heightMap, x + 1, y), // right
            this.getPointAtCoordinates(heightMap, x, y - 1), // top
            this.getPointAtCoordinates(heightMap, x, y + 1) // bottom
        ].filter((p) => p !== null);
    }

    getPointAtCoordinates(heightMap, x, y) {
        if (heightMap[y] && typeof heightMap[y][x] === 'number') {
            return { x, y, height: heightMap[y][x] };
        }

        return null;
    }
}
