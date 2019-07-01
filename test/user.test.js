const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const {
   dropUsers, 
   randomEmail
  } = require('../helpers/testHelper');

const expect = chai.expect;
chai.use(chaiHttp);

let testEmail =  randomEmail();
let testUserId;
let testToken;

after(done => {
  dropUsers(done, testUserId);
});

describe('User test suite', () => {
  describe('GET /test', () => {
    describe('Route error', () => {
      it('should return error Object with Status Code: 500', done => {
        chai
          .request(app)
          .get('/test')
          .end(function(err, res){
            expect(err).to.be.null;

            expect(res).to.have.status(500);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(There\'s something wrong with the server, please try again later)/g
            );

            done();
          });
          
      })
    })
  });

  describe('POST /register', () => {
    describe('User registration', () => {
      it('should return an user Object and Status Code: 201', done => {
        const testUser = {
          email: testEmail,
          password: '123456'
        };

        chai
          .request(app)
          .post('/register')
          .send(testUser)
          .end(function(err, res) {
            expect(err).to.be.null;
            // console.log(res.body.uid);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
            expect(res.body.token).to.be.a('string');
            expect(res.body).to.have.property('uid');
            expect(res.body.token).to.be.a('string');
            testToken = res.body.token;
            testUserId = res.body.uid;

            done();
          });
      });
    });

    describe('Invalid email format', () => {
      it('should return error Object with a message and Status Code: 400', done => {
        const testUser = {
          email: 'johnmail.com',
          password: '123456'
        };

        chai
          .request(app)
          .post('/register')
          .send(testUser)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(The email address is badly formatted)/g
            );

            done();
          });
      });
    });

    describe('Duplicate email', () => {
      it('should return error Object with a message and Status Code: 409', done => {
        const testUser = {
          email: testEmail,
          password: '123456'
        };

        chai
          .request(app)
          .post('/register')
          .send(testUser)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(409);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(The email address is already in use by another account)/g
            );

            done();
          });
      });
    });

    describe('Invalid password length', () => {
      it('should return error Object with a message and Status Code: 400', done => {
        const testUser = {
          email: 'johny@mail.com',
          password: '1'
        };

        chai
          .request(app)
          .post('/register')
          .send(testUser)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(Password should be at least 6 characters)/g
            );

            done();
          });
      });
    });

    describe('Empty email and/or empty password', () => {
      it('should return error Object with a message and Status Code: 400', done => {
        const testUser = {
          email: '',
          password: ''
        };

        chai
          .request(app)
          .post('/register')
          .send(testUser)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(Email\/password cannot be empty)/g
            );

            done();
          });
      });
    });
  });

  describe('POST /login', () => {
    describe('User login', () => {
      it('should return an user Object and Status Code 200', done => {
        const credentials = {
          email: testEmail,
          password: '123456'
        };

        chai
          .request(app)
          .post('/login')
          .send(credentials)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
            expect(res.body).to.have.property('uid');
            expect(res.body.token).to.be.a('string');
            expect(res.body.token).to.be.a('string');

            done();
          });
      });
    });

    describe('Empty email and/or empty password', () => {
      it('should return error Object with a message and Status Code: 400', done => {
        const credentials = {
          email: '',
          password: ''
        };

        chai
          .request(app)
          .post('/login')
          .send(credentials)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(Email\/password cannot be empty)/g
            );

            done();
          });
      });
    });

    describe('Invalid email and/or password', () => {
      it('should return error Object with a message and Status Code: 400', done => {
        const credentials = {
          email: testEmail,
          password: 'wrongpass'
        };

        chai
          .request(app)
          .post('/login')
          .send(credentials)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(
              /(The password is invalid or the user does not have a password)/g
            );

            done();
          });
      });
    });
  });

  describe ('/POST /logout', () => {
    describe('User logout', () => {
      it('should return message Object and Status Code: 200', done => {
        chai
          .request(app)
          .post('/logout')
          .set('authorization', testToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Logged out)/g);

            done();
          });
      });
    });

    describe('Invalid authentication', () => {
      it('should return error Object with Status Code: 401', done => {
        chai
          .request(app)
          .get('/reservations')
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Unauthenticated request)/g);

            done();
          });
      });
    });
  });
});
