'use strict';

const Auth = require('../../model/auth');
const faker = require('faker');
const Gallery = require('../../model/gallery');
const Photo = require('../../model/photo');

const mocks = module.exports = {};
mocks.auth = {};

mocks.auth.createOne = () => {
  let result = {};
  result.password = faker.internet.password();

  return new Auth({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .generatePasswordHash(result.password)
    .then(user => result.user = user)
    .then(user => user.generateToken())
    .then(token => result.token = token)
    .then(() => {
      // console.log(result);
      return result;
    });
};

mocks.gallery = {};
mocks.gallery.createOne = () => {
  let resultMock = null;

  return mocks.auth.createOne()
    .then(createdUserMock => resultMock = createdUserMock)
    .then(createdUserMock => {
      return new Gallery({
        name: faker.internet.domainWord(),
        description: faker.random.words(15),
        userId: createdUserMock.user._id,
      }).save();
    })
    .then(gallery => {
      resultMock.gallery = gallery;
      return resultMock;
    });
};

mocks.photo = {};
// mocks.photo.createOne = () => {
//   let req = {};
//   req.file = {
//     originalname: 'krappa.jpg',
//     filename: 'a3c870bb13270e1b96f1f0697847b7b8',
//     path: '/Users/billodell/codefellows/401/18-asset-management/lab-bill/temp/a3c870bb13270e1b96f1f0697847b7b8',
//   };
//   req.body = {
//     name:
//     description:
//     galleryId:
//   }
//   req.user = {
//     _id:
//   }
//   return mocks.gallery.createOne()
//     .then(createdGallery => {
//       Photo.upload(req);
//     });
// };
mocks.auth.removeAll = () => Promise.all([Auth.remove()]);
mocks.gallery.removeAll = () => Promise.all([Gallery.remove()]);