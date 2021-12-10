import BaseSolver from './BaseSolver.js';

/**
 * Solver for https://adventofcode.com/2021/day/5
 */
export default class Day5 extends BaseSolver {
    day = 5;
    columnSplit = ' -> ';

    challenges = [
        {
            method: 'getOverlappingLines',
            expectedTestResult: 5,
            params: {
                considerDiagonalLines: false
            }
        },
        {
            method: 'getOverlappingLines',
            expectedTestResult: 12,
            params: {
                considerDiagonalLines: true
            }
        }
    ];

    parseDataPoint(d) {
        return d.split(',').map((n) => parseInt(n, 10));
    }

    getOverlappingLines(lines, { considerDiagonalLines }) {
        let linesToConsider = [].concat(lines);
        if (!considerDiagonalLines) {
            linesToConsider = this.getHorizontalAndVerticalLines(linesToConsider);
        }
        const grid = this.buildGrid(linesToConsider);
        this.drawLines(grid, linesToConsider);
        const overlaps = this.countOverlaps(grid);

        return overlaps;
    }

    getHorizontalAndVerticalLines(lines) {
        return lines.filter(
            ([[startX, startY], [endX, endY]]) => startX === endX || startY === endY
        );
    }

    buildGrid(lines) {
        const [xMin, xMax] = this.getMinMax(lines, 0);
        const [yMin, yMax] = this.getMinMax(lines, 1);

        return Array.from({ length: yMax + 1 }, () => new Array(xMax + 1).fill(0));
    }

    getMinMax(lines, axis) {
        return [
            Math.min(...lines.flatMap((c) => c[axis])),
            Math.max(...lines.flatMap((c) => c[axis]))
        ];
    }

    drawLines(grid, lines) {
        lines.forEach((l) => this.drawLine(grid, l));
    }

    drawLine(grid, line) {
        const [[startX, startY], [endX, endY]] = line;
        const xDiff = endX - startX;
        const xDirection = xDiff > 0 ? 1 : xDiff < 0 ? -1 : 0;
        const yDiff = endY - startY;
        const yDirection = yDiff > 0 ? 1 : yDiff < 0 ? -1 : 0;

        let xStep = 0,
            yStep = 0;
        while (xStep <= Math.abs(xDiff) && yStep <= Math.abs(yDiff)) {
            const currentX = startX + xStep * xDirection;
            const currentY = startY + yStep * yDirection;
            grid[currentY][currentX] += 1;
            xStep += Math.abs(xDirection);
            yStep += Math.abs(yDirection);
        }
    }

    countOverlaps(grid) {
        return grid.flat().filter((n) => n > 1).length;
    }
}
