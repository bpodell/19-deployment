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
        .attach('image', `${__dirname}/../../temp/krappa.jpg`)
        .then(res => this.resBody = res.body);
    }));
    it('should return a 200 success status code and an array of ids', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
        });
    });
    it('should return a 200 success status code', () => {
      return superagent.get(`:${process.env.PORT}/api/v1/photo/${this.resBody._id}`)
        .set('Authorization', `Bearer ${this.mockUser.token}`)
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
        });
    });

  });
//   describe('invalid request', () => {
//     it('should return a 401 not authorized given back token', () => {
//       return superagent.get(`:${process.env.PORT}/api/v1/photo`)
//         .set('Authorization', `Bearer BADTOKEN`)
//         .field('name', 'stan')
//         .field('description', 'this is stan')
//         .field('galleryId', `${this.mockUser.gallery._id}`)
//         .attach('image', `${__dirname}/../../temp/krappa.jpg`)
//         .catch(err => expect(err.status).toEqual(401));
//     });
//     it('should return a 400 bad request on improperly formatted body', () => {
//       return superagent.get(`:${process.env.PORT}/api/v1/photo`)
//         .set('Authorization', `Bearer ${this.mockUser.token}`)
//         .field('galleryId', `${this.mockUser.gallery._id}`)
//         .attach('image', `${__dirname}/../../temp/krappa.jpg`)
//         .catch(err => expect(err.status).toEqual(400));
//     });
//   });
});