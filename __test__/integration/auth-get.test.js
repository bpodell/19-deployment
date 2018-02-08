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
        .then((res) => {
          this.response = res;
          return superagent.get(`:${process.env.PORT}/api/v1/signin`)
            .auth('octavius', 'sdf')
            .then(res => this.getRes = res);
        }
        );});
    it('should return a status of 200', () => {
      expect(this.getRes.status).toEqual(200);
    });
    it('should return an auth token', () => {
      expect(this.getRes.body.split('.').length).toEqual(3);
    });
  });

  describe('inValid requests', () => {
    beforeAll(() => {
      return superagent.post(`:${process.env.PORT}/api/v1/signup`)
        .send({
          username: 'blair',
          password: '456',
          email: '123',
        })
        .then((res) => {
          this.response = res;
          return superagent.get(`:${process.env.PORT}/api/v1/signin`)
            .auth('blair', 'wrong')
            .then(res => this.wrongRes = res)
            .catch(err => this.errRes = err);
        }
        );});
    it('should return a status 400 given no request body', () => {
      expect(this.errRes.status).toEqual(401);
    });
    it('should return a status 404 on an invalid path', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/animal`)
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});
