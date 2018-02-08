'use strict';

const server = require('../../lib/server');
const superagent = require('superagent');
const mocks = require('../lib/mocks');
// const faker = require('faker');
require('jest');



describe('POST /api/v1/auth', function() {
  beforeAll(() => this.base = `:${process.env.PORT}/api/v1/`);
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(mocks.auth.removeAll);
  describe('Valid requests', () => {
    beforeAll(() => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send({
          username: 'octavius',
          password: 'sdf',
          email: '123',
        })
        .then(res => this.response = res);

    });
    it('should return a status of 201', () => {
      expect(this.response.status).toEqual(201);
    });
    it('should return a new authorization token', () => {
      expect(this.response.body.split('.').length).toEqual(3);
    });
  });

  describe('inValid requests', () => {
    it('should return a status 401 given no password', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send()
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a status 400 given no username', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send({
          password: 'sdf',
          email: '123',
        })
        .catch(err => expect(err.status).toEqual(400));
    });
    it('should return a status 404 on an invalid path', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/animal`)
        .send({
          username: 'stu',
          password: 'aye',
          email: '123445',
        })
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});
