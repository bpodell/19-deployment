This is an application to mimic a webpage login/signup/ To create a new account you need to send a POST request to your localhost:3000/api/v1/signup with a request body containint a username, password, and email address. To retreive you authentication token simply make a GET request to localhost:3000/api/v1/signin and enter your credentials, which if they match the database will send you an authentication token. 

We have now added a new Gallery feature, so that upon successful login a user can post a new gallery with a name and description. The user can then make GET/PUT/POST/DELETE methonds on their new gallery, as well as see the galleries of others. 

The tests in our test suite test for proper responses on both valid paths and invalid requests. 