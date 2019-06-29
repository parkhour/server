const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const testHelper = require('../helpers/testHelper');

const { createUserToken, dropUsers } = testHelper;

const expect = chai.expect;
chai.use(chaiHttp);

let testToken;
let testUserId;

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
  dropUsers(done);
});

describe('Reservation test suite', () => {
  describe('POST /reservation test', () => {
    describe('Create a parking reservation', () => {
      it('should return an Object with a Status Code: 201', done => {
        const testReservation = {
          mallId: '01',
          parkId: 1,
          uid: testUserId,
          status: 'waiting'
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
              'uid',
              'status',
              'createdAt',
            );

            done();
          });
      });
    });

    describe('Invalid authentication', () => {
      it('should return error Object with Status Code: 401', done => {
        const testReservation = {
          mallId: '01',
          parkId: 1,
          uid: 'noId',
          status: 'waiting'
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
          status: 'waiting'
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
