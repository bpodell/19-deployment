'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('DELETE api/v1/gallery', function() {
  beforeAll(server.start);
  beforeAll(() => mocks.gallery.createOne().then(mock => {
    this.mockUser = mock;
    // console.log(this.mockUser);
    return superagent.delete(`:${process.env.PORT}/api/v1/gallery/${this.mockUser.gallery._id}`)
      .set('Authorization', `Bearer ${this.mockUser.token}`)
      .then((res) => {
        this.res = res;
      });
  }));
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.gallery.removeAll);
  describe('Valid request', () => {
    it('should return a 204 success status code on a proper request', () => {
      expect(this.res.status).toEqual(204);
    });
  });

  describe('invalid request', () => {
    it('should return a 401 not authorized given no token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 valid request with an id not found', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery/kappa123`)
        .set('Authorization', `Bearer ${this.mockUser.token}` )
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});