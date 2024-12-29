import { logger } from "./logger";

describe("Logger unite tests", () => {
  test("logger info", () => {
    const testMessage = "this is a log test message";
    const logSpy = vitest.spyOn(console, "log");
    logger.info(testMessage);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toBeCalledWith(expect.stringContaining(testMessage));
  });
  test("logger error", () => {
    const testMessage = "this is a log test message";
    const logSpy = vitest.spyOn(console, "error");
    logger.error(testMessage);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toBeCalledWith(expect.stringContaining(testMessage));
  });
});
