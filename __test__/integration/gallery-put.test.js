'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('PUT api/v1/gallery', function() {
  beforeAll(server.start);
  beforeAll(() => mocks.gallery.createOne().then(mock => {
    this.mockUser = mock;
    // console.log(this.mockUser);
    return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockUser.gallery._id}`)
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
    it('should return a 204 success status code on a proper request', () => {
      expect(this.res.status).toEqual(204);
    //   expect(this.res.body.name).to
    });
  });

  describe('invalid request', () => {
    it('should return a 401 not authorized given back token', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockUser.gallery._id}`)
        .send({
          name: faker.lorem.word(),
          description: faker.lorem.words(4),
        })
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 valid request with an id not found', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/kappa123`)
        .set('Authorization', `Bearer ${this.mockUser.token}` )
        .send({
          name: faker.lorem.word(),
          description: faker.lorem.words(4),
        })
        .catch(err => expect(err.status).toEqual(404));
    });
    it('should return a 400 if the body was invalid', () => {
      return superagent.put(`:${process.env.PORT}/api/v1/gallery/${this.mockUser.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}` )
        .send({
        })
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});