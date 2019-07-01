const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

const { 
  createUserToken,
  dropAll,
} = require('../helpers/testHelper');

const expect = chai.expect;
chai.use(chaiHttp);

let testToken;
let testRes;
let testUserId;

describe('Reservation test suite', () => {

before(done => {
  createUserToken()
    .then(([token, userId]) => {
      testToken = token;
      testUserId = userId;
      done();
    })
    .catch(error => {
      console.log(error);
      done();
    });
});

after(done => {
  dropAll(done, testUserId, testRes);
});

  describe('GET /reservation test', () => {
    describe('Get all user\'s reservations', () => {
      it('should return reservations Array with Status Code: 200', done => {
        chai
          .request(app)
          .get('/reservations')
          .set('authorization', testToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.above(-1);

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

    describe('Invalid authorization', () => {
      it('should return error Object with Status Code: 400', done => {
        chai
          .request(app)
          .get('/reservations')
          .set('authorization', 'fakeToken')
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Bad request, please login again)/g);

            done();
          });
      });
    });
  });

  describe('POST /reservation test', () => {
    describe('Create a parking reservation', () => {
      it('should return an Object with a Status Code: 201', done => {
        const testReservation = {
          mallId: '01',
          parkId: 1,
          uid: testUserId,
          status: 'waiting',
          licensePlate: 'AB 123 CD',
          mallName: 'sunflower'
        };

        chai
          .request(app)
          .post('/reservations')
          .send(testReservation)
          .set('authorization', testToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.all.keys(
              '_id',
              'mallId',
              'parkId',
              'mallName',
              'uid',
              'status',
              'licensePlate',
              'createdAt',
            );
            testRes = res.body._id;
              setTimeout(() => {
                done();

              }, 1800)
          });
      });
    });

    describe('Empty license plate', () => { 
      it('should return error Object with Status Code: 400', done => {
        const testReservation = {
          mallId: '01',
          parkId: 1,
          uid: testUserId,
          status: 'waiting',
          licensePlate: ''
        };

        chai
          .request(app)
          .post('/reservations')
          .set('authorization', testToken)
          .send(testReservation)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(License plate cannot be empty)/g);

            done();
          });
        });
    });
    // REGEX TEST
    // describe('Invalid license plate', () => {

    // });

    describe('Invalid authentication', () => {
      it('should return error Object with Status Code: 401', done => {
        const testReservation = {
          mallId: '01',
          parkId: 1,
          uid: 'noId',
          status: 'waiting',
          licensePlate: 'AB 123 CD'
        };

        chai
          .request(app)
          .post('/reservations')
          .send(testReservation)
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

    describe('Invalid authorization', () => {
      it('should return error Object with Status Code: 400', done => {
        const testReservation = {
          mallId: '01',
          parkId: 1,
          uid: 'wrongUid',
          status: 'waiting',
          licensePlate: 'AB 123 CD'
        };

        chai
          .request(app)
          .post('/reservations')
          .send(testReservation)
          .set('authorization', 'fakeToken')
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Bad request, please login again)/g);

            done();
          });
      });
    });
  });

});
