import * as solvers from './solvers/index.js';
const solverName = 'Day1';

(async () => {
    const solver = new solvers[solverName]();
    await solver.exec();
})();
