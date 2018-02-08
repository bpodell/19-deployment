'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('POST api/v1/photo', function() {
  beforeAll(server.start);
  beforeAll(() => mocks.gallery.createOne().then(mock => {
    this.mockUser = mock;

    return superagent.post(`:${process.env.PORT}/api/v1/photo`)
      .set('Authorization', `Bearer ${this.mockUser.token}`)
      .field('name', 'stan')
      .field('description', 'this is stan')
      .field('galleryId', `${this.mockUser.gallery._id}`)
      .attach('image', `${__dirname}/../../temp/krappa.jpg`)
      .then((res) => this.res = res);
  }));
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.gallery.removeAll);
  describe('Valid request', () => {
    it('should return a 201 CREATED status code', () => {
      expect(this.res.status).toEqual(201);
    });
  });

  describe('invalid request', () => {
    it('should return a 401 not authorized given back token', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer BADTOKEN`)
        .field('name', 'stan')
        .field('description', 'this is stan')
        .field('galleryId', `${this.mockUser.gallery._id}`)
        .attach('image', `${__dirname}/../../temp/krappa.jpg`)
        .catch(err => expect(err.status).toEqual(401));
    });
    it('should return a 400 bad request on improperly formatted body', () => {
      return superagent.post(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .field('galleryId', `${this.mockUser.gallery._id}`)
        .attach('image', `${__dirname}/../../temp/krappa.jpg`)
        .catch(err => expect(err.status).toEqual(400));
    });
  });
});