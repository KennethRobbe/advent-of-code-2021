import * as solvers from './solvers/index.js';
const solverName = process.argv[process.argv.length - 1];

(async () => {
    const solver = new solvers[solverName]();
    await solver.exec();
})();
