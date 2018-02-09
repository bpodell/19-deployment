'use strict';

const errorHandler = require('./error-handler');
const Auth = require('../model/auth');
const jsonWebToken = require('jsonwebtoken');

const ERROR_MESSAGE = 'Authorization Failed';

module.exports = function(request,response,next){
  // console.log(request.headers);
  let authHeader = request.headers.authorization;

  if(!authHeader)
    return errorHandler(new Error(ERROR_MESSAGE),response);
  
  let token = authHeader.split(' ')[1];
  // console.log(token);
  if(!token)
    return errorHandler(new Error(ERROR_MESSAGE),response);

  jsonWebToken.verify(token,process.env.APP_SECRET,(error,decodedValue) => {
    if(error){
      error.message = ERROR_MESSAGE;
      return errorHandler(error,response);
    }

    Auth.findOne({compareHash: decodedValue.token})
      .then(user => {
        // console.log(user);
        if(!user)
          return errorHandler(new Error(ERROR_MESSAGE),response);
        request.user = user;
        next();
      })
      .catch(error => errorHandler(error,response));
  });
};