/**
 * A simple logger utility class.
 */
export default class Logger {
  private name: string;

  /**
   * Creates an instance of Logger.
   * @param name - The name of the logger instance, used as a prefix in log messages.
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Logs general messages.
   * @param args - The arguments to log.
   */
  log(...args: unknown[]) {
    console.log(`[${this.name}]`, ...args);
  }

  /**
   * Logs informational messages.
   * @param args - The arguments to log.
   */
  info(...args: unknown[]) {
    console.info(`[${this.name}]`, ...args);
  }

  /**
   * Logs warning messages.
   * @param args - The arguments to log.
   */
  warn(...args: unknown[]) {
    console.warn(`[${this.name}]`, ...args);
  }

  /**
   * Logs error messages.
   * @param args - The arguments to log.
   */
  error(...args: unknown[]) {
    console.error(`[${this.name}]`, ...args);
  }
}
