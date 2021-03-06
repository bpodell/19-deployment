'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('GET api/v1/photo', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mocks.auth.removeAll);
  afterAll(mocks.gallery.removeAll);
  describe('Valid request', () => {
    beforeAll(() => mocks.gallery.createOne().then(mock => {
      this.mockUser = mock;
      // console.log(this.mockUser);
      return superagent.post(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .field('name', 'stan')
        .field('description', 'this is stan')
        .field('galleryId', `${this.mockUser.gallery._id}`)
        .attach('image', `${__dirname}/../assets/krappa.jpg`)
        .then(res => this.resBody = res.body);
    }));
    it('should return a 200 success status code and an array of ids', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          expect(res.body[0]).not.toBeNull();
          expect(res.status).toEqual(200);
        });
    });
    it('should return a 200 success status code', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo/${this.resBody._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          expect(res.body._id).toEqual(`${this.resBody._id}`);
          expect(res.status).toEqual(200);
        });
    });

  });
  describe('invalid request', () => {
    it('should return a 401 not authorized given back token', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer BADTOKEN`)
        .catch(err => expect(err.status).toEqual(401));
    })
    it('should return a 404 on a request that doenst exist', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo/DOESNTEXIST`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .catch(err => expect(err.status).toEqual(404));
    });
  });
});