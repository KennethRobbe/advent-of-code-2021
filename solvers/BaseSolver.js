import fs from 'node:fs';

export default class BaseSolver {
    rowSplit = /\r?\n/g;
    testData = 'test';
    inputData = 'input';

    async exec() {
        console.log(`Solving Day ${this.day}`);
        await this.solveChallenges();
    }

    async solveChallenges() {
        if (!Array.isArray(this.challenges)) {
            throw new Error('Missing Challenge Input!');
        }

        for (const [i, challenge] of this.challenges.entries()) {
            console.log(`Solving challenge ${i + 1}`);
            await this.solveChallenge(challenge);
        }
    }

    async solveChallenge(challenge) {
        // Check test result first
        const testResult = await this.getResult(this.testData, challenge);
        if (testResult !== challenge.expectedTestResult) {
            throw new Error(
                `Test result doesn't match expected test result: ${testResult} vs. ${challenge.expectedTestResult}`
            );
        } else {
            console.log(`Test result matches expected result.`);
        }

        // Continue with actual data if test result is correct
        const result = await this.getResult(this.inputData, challenge);
        console.log(`Result for input: ${result}`);
    }

    async getResult(inputFile, challenge) {
        if (typeof this[challenge.method] !== 'function') {
            throw new Error(`Method ${challenge.method} is unknown!`);
        }

        const data = await this.readFile(inputFile);
        return this[challenge.method](data, challenge.params);
    }

    async readFile(fileName) {
        const fileContents = await fs.promises.readFile(
            `./data/day-${this.day}/${fileName}.txt`,
            'utf8'
        );
        const output = this.parseFile(fileContents);

        return output;
    }

    parseFile(content) {
        if (typeof this.rowSplit !== 'undefined') {
            return content
                .split(this.rowSplit)
                .filter(Boolean)
                .map((r) => this.parseRow(r));
        }

        return content;
    }

    parseRow(row) {
        if (typeof this.columnSplit !== 'undefined') {
            return row.split(this.columnSplit).map((d) => this.parseDataPoint(d));
        }

        return this.parseDataPoint(row);
    }

    parseDataPoint(data) {
        return data;
    }
}
