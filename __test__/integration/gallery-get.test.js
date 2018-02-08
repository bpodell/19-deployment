'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('GET api/v1/gallery', function() {
  beforeAll(server.start);
  beforeAll(() => mocks.gallery.createOne().then(mock => {
    this.mockUser = mock;
    return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
      .set('Authorization', `Bearer ${this.mockUser.token}`)
      .then((res) => this.res = res);
  }));
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.gallery.removeAll);
  describe('Valid request', () => {
    it('should return a 200 success status code on a request without params', () => {
      expect(this.res.status).toEqual(200);
    });
    it('should return a 200 success code on a request with params', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery/${this.mockUser.gallery._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then((res) => expect(res.status).toEqual(200));
    });
  });

  describe('invalid request', () => {
    it('should return a 401 not authorized given back token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 404 valid request with an id not found', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/gallery/kappa123`)
        .set('Authorization', `Bearer ${this.mockUser.token}` )
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});