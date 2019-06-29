const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

const app = require('../server');
const testHelper = require('../helpers/testHelper');

const { dropUsers } = testHelper;

before(done => {
  dropUsers(done);
});

after(done => {
  dropUsers(done);
});

describe('User test', () => {

  describe('POST /register route test', () => {
    describe('User registration', () => {

      it('should return an user Object and Status Code: 201', done => {
        const testUser = {
          email: 'john@mail.com',
          password: '123456'
        };

        chai
          .request(app)
          .post('/register')
          .send(testUser)
          .end(function(err, res) {
            expect(err).to.be.null;
            
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
            expect(res.body).to.have.property('currentUser');
            expect(res.body.token).to.be.a('string');
            expect(res.body.currentUser).to.be.an('object');
            expect(res.body.currentUser).to.have.property('userId');
            expect(res.body.currentUser).to.have.property('email');
            expect(res.body.currentUser.email).to.equal('john@mail.com');
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
            // expect(res.body.message).to.match(/(Invalid email format)/g);
            expect(res.body.message).to.match(/(The email address is badly formatted)/g);
            done();
          });
      });
    });

    describe('Duplicate email', () => {
      it('should return error Object with a message and Status Code: 409', done => {
        const testUser = {
          email: 'john@mail.com',
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
            expect(res.body.message).to.match(/(The email address is already in use by another account)/g);
            // expect(res.body.message).to.match(/(Email is already in use)/g);
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
            // expect(res.body.message).to.match(/(Invalid password length)/g);
            expect(res.body.message).to.match(/(Password should be at least 6 characters)/g);
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

        const check = message => {
          const emailReg = /Email cannot be empty/g;
          const passReg = /Password cannot be empty/g;

          return emailReg.test(message) || passReg.test(message);
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
            // expect(res.body.message).to.match(/(Email cannot be empty)/g);
            expect(res.body.message).to.match(/(Email\/password cannot be empty)/g);
            // expect(check(res.body.message)).to.equal(true);
            done();
          });
      });
    });
  });

  describe('POST /login route test', () => {

    describe('User login', () => {
      it('should return an user Object and Status Code 200', done => {
        const credentials = {
          email: 'john@mail.com',
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
            expect(res.body).to.have.property('currentUser');
            expect(res.body.token).to.be.a('string');
            expect(res.body.currentUser).to.be.an('object');
            expect(res.body.currentUser).to.have.property('userId');
            expect(res.body.currentUser).to.have.property('email');
            expect(res.body.currentUser.email).to.equal('john@mail.com');
            done();
          });
      })
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
            // expect(res.body.message).to.match(/(Email\/password cannot be empty)/g);
            expect(res.body.message).to.match(/(Email\/password cannot be empty)/g);
            done();
          });
      });
    });
  
    describe('Invalid email and/or password', () => {
      it('should return error Object with a message and Status Code: 400', done => {
        const credentials = {
          email: 'john@mail.com',
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
            // expect(res.body.message).to.match(/(Wrong email\/password)/g);
            expect(res.body.message).to.match(/(The password is invalid or the user does not have a password)/g);
            done();
          });
      });
    });
  });

  
});
