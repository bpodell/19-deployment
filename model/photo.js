'use strict';

const fs = require('fs');
const del = require('del');
const path = require('path');
const Gallery = require('./gallery');
const mongoose = require('mongoose');
const tempDir = `${__dirname}../temp`;
const awsS3 = require('../lib/aws-s3');

const Photo = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'auth', required: true},
  galleryId: {type: mongoose.Schema.Types.ObjectId, ref: 'gallery', required: true},
  objectKey: {type: String, required: true, unique: true},
  imageURI: {type: String, required: true, unique: true},
});

Photo.statics.upload = function(req) {
  // console.log(req.file);
  return new Promise((resolve, reject) => {
    if(!req.file) return reject(new Error('multi-part form data error. file not present on request.'));
    if(!req.file.path) return reject(new Error('multi-part form data error. file path not present on request.'));
    // console.log(req.file);
    let params = {
      ACL: 'public-read', 
      Bucket: process.env.AWS_BUCKET,
      Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
      Body: fs.createReadStream(req.file.path),
    };
    // console.log(params);
    return awsS3.uploadProm(params)
      .then(data => {
        // console.log(data);
        del([`${tempDir}/${req.file.filename}`]);

        let photoData = {
          name: req.body.name,
          description: req.body.description,
          userId: req.user._id,
          galleryId: req.body.galleryId,
          imageURI: data.Location,
          objectKey: data.Key,
        };
        // console.log(photoData);
        resolve(photoData);
      })
      .catch(reject);
  });

};

// Photo.methods.delete = function()


module.exports = mongoose.model('photo', Photo);