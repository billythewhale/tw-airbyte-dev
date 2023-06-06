import chalk from "chalk";

const colors = {
  workflow: "#f0f",
  activity: "#0ff",
  execution: "#ff0",
  results: "#0f0",
  error: "#f00",
};

const buildLogger = (prefix: string, color: string) => ({
  info: (msg: string) =>
    process.stdout.write(
        msg
          .toString()
          .split("\n")
          .map((line) => `${chalk.hex(color)(prefix)}|  ${line}`)
          .join(`\n`) + "\n"
    ),
  error: (msg: string) =>
    process.stdout.write(
      msg
        .toString()
        .split("\n")
        .map((line) => `${chalk.hex(color)(prefix)} ${chalk.hex(colors.error)("ERROR: ")}|  ${line}`)
        .join(`\n`) + "\n"
    ),
});

export const workflowLogger = buildLogger("Workflow", colors.workflow);
export const activityLogger = buildLogger("Activity", colors.activity);
export const executionLogger = buildLogger("Execution", colors.execution);
export const resultsLogger = buildLogger("Results", colors.results);

