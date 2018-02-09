'use strict';

let errorHandler = require('../../lib/error-handler');
require('jest');


class Res {
  constructor (err) {
    this.error = err;
    this.code = null;
    this.message = null;
  }
  
  status (code) {
    this.code = code;
    return this;
  }
  
  send (message) {
    this.message = message;
    return this;
  }
}


let validation = new Res(new Error('Validation Error'));
let path = new Res(new Error('Path Error'));
let generic = new Res(new Error('Generic'));
let objectid = new Res(new Error('ObjectId failed'));
let duplicate = new Res(new Error('duplicate key'));

describe('Error Handler', () => {
  it('should return an error 404 for any error containing Path Error', () => {
    expect(errorHandler(path.error, path).code).toBe(404);
  });
  it('should return an error 400 for any error containing Validation Error', () => {
    expect(errorHandler(validation.error, validation).code).toBe(400);
  });
  it('should return an error 404 for any error containing ObjectId', () => {
    expect(errorHandler(objectid.error, path).code).toBe(404);
  });
  it('should return an error 409 for any error containing duplicate', () => {
    expect(errorHandler(duplicate.error, path).code).toBe(409);
  });
  it('should return an error 500 for any other errors that occur', () => {
    expect(errorHandler(generic.error, generic).code).toBe(500);
  });
});