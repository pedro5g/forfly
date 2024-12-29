import util from "node:util";

const stringTeg = "[object String]";
const isString = (value: unknown) =>
  typeof value === "string" ||
  (!Array.isArray(value) &&
    Object.prototype.toString.call(value) === stringTeg);

/**
 * @description generate current timestamp from when called
 * @returns string with this format (ex: 2024-10-03T12:34:56.789Z ~)
 */
const timestamp = () => `${new Date().toISOString()} ~ `;
/**
 * @param msg string
 * @description covert msg in a string
 * @returns string
 */
const output = (msg: string) => (isString(msg) ? msg : util.inspect(msg));

// checks whether the terminal supports interactive commands such as colors and styles.
const isTTYout = Boolean(process.stdout.isTTY);
const isTTYerr = Boolean(process.stderr.isTTY);

// set some colors to logger messages
const labelInfo = isTTYout ? "\x1b[32m[Info]\x1b[0m" : "";
const labelError = isTTYerr ? "\x1b[31m[Error!]\x1b[0m" : "";

function formatError(error: Error | string): Error {
  if (error instanceof Error) return error;

  const message = output(error);
  return new Error(message);
}

function info(msg: string, context?: object): void {
  const params = [labelInfo + timestamp() + output(msg)];

  if (context) params.push(util.inspect(context));

  params.push("");
  console.log(params.join("\n"));
}

function error(error: Error | string, context?: object): void {
  const formattedError = formatError(error);
  const { stack } = formattedError;
  let { message } = formattedError;

  message = labelError + timestamp() + message;
  const params = [message, stack];

  if (context) params.push(util.inspect(context));

  params.push("");
  console.error(params.join("\n"));
}

export const logger = {
  info,
  error,
};
