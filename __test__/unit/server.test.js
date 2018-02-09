const server = require('../../lib/server');
require('jest');

describe('Server Unit Test', () => {
  beforeEach(server.start);
  afterEach(server.stop);

  it('should return a promise rejection if the server is already running when started', () => {
    server.start().catch(err => expect(err.message).toMatch(/Server error/i));
    //   .then(expect(() => server.start()).toThrowError());
  });

//   it('should return a promise rejection if the server is stopped when stopped', () => {
//     // server.start().then(server.stop()).then(server.stop()).catch(console.log);
//     // expect(() => server.stop()).toThrow();
//   });
});