import * as solvers from './solvers/index.js';
const solverName = process.argv.slice(2)[0];

async function solveDay(solverName) {
    const solver = new solvers[solverName]();
    await solver.exec();
}

(async () => {
    if (solverName) {
        await solveDay(solverName);
    } else {
        for (let name of Object.keys(solvers)) {
            await solveDay(name);
        }
    }
})();
