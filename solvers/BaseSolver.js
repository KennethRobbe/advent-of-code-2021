import fs from 'node:fs';

export default class BaseSolver {
    rowSplitRegex = /\r?\n/g;

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
        const testResult = await this.getResult(challenge.testData, challenge.method);
        if (testResult !== challenge.expectedTestResult) {
            throw new Error(
                `Test result doesn't match expected test result: ${testResult} vs. ${challenge.expectedTestResult}`
            );
        } else {
            console.log(`Test result matches expected result.`);
        }

        // Continue with actual data if test result is correct
        const result = await this.getResult(challenge.inputData, challenge.method);
        console.log(`Result: ${result}`);
    }

    async getResult(inputFile, method) {
        if (typeof this[method] !== 'function') {
            throw new Error(`Method ${method} is unknown!`);
        }

        const data = await this.readFile(inputFile);
        return this[method](data);
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
        if (this.rowSplitRegex) {
            return content.split(this.rowSplitRegex).map((r) => this.parseRow(r));
        }

        return content;
    }

    parseRow(row) {
        if (this.columnSplitRegex) {
            return row.split(this.columnSplitRegex).map((d) => this.parseDataPoint(d));
        }

        return this.parseDataPoint(row);
    }

    parseDataPoint(data) {
        return data;
    }
}
