'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('POST api/v1/gallery', function() {
  beforeAll(server.start);
  beforeAll(() => mocks.auth.createOne().then(mock => {
    this.mockUser = mock;
    return superagent.post(`:${process.env.PORT}/api/v1/gallery`)
      .set('Authorization', `Bearer ${this.mockUser.token}`)
      .send({
        name: faker.lorem.word(),
        description: faker.lorem.words(4),
      })
      .then((res) => this.res = res);
  }));
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.gallery.removeAll);
  describe('Valid request', () => {
    it('should return a 201 CREATED status code', () => {
      expect(this.res.status).toEqual(201);
    });
    it('should return a userId that matches the mock user', () => {
      expect(this.res.body.userId).toEqual(this.mockUser.user._id.toString());
    });
  });

  describe('invalid request', () => {
    it('should return a 401 not authorized given back token', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 400 bad request on improperly formatted body', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', `Bearer ${this.mockUser.token}` )
        .send({})
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});