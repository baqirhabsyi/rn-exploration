import Logger from '.';

describe('Logger', () => {
  it('should log messages', () => {
    const logger = new Logger('TestLogger');
    logger.log('Hello, world!');
  });
});
