const { Task, Either } = require("types");

Task.of(2)
  .map((two) => two + 1)
  .fork(console.error, console.log);
