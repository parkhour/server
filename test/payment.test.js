const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { calculateParkingCharge } = require('../helpers/timeHelper');

const {
  createUserToken,
  createTestAdmin,
  createTestReservation,
  dropAll
} = require('../helpers/testHelper');

const expect = chai.expect;
chai.use(chaiHttp);

let testReservation;
let testUserId;
let testUserToken;
let testAdminToken;
let testPaymentId;

describe('Payment test suite', () => {
  before(done => {
    createTestAdmin()
      .then(admin => {
        [testAdminToken, testAdminId] = admin;
        // console.log(testAdminToken, testAdminId)
        return createUserToken();
      })
      .then(user  => {
        [testUserToken, testUserId] = [...user];
        return createTestReservation(testUserId);
      })
      .then(reservation => {
        testReservation = reservation;
        done();
      })
      .catch(() => {
        done();
      });
  });
  
  after((done) => {
    dropAll(done, testUserId, testReservation._id)
  });
  
  describe('GET /payments', () => {
    describe('Get all payments', () => {
      it('should return reservations Array with Status Code: 200', done => {
        chai
          .request(app)
          .get('/payments')
          .set('authorization', testAdminToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.above(-1);
            done();
          });
      });
    });

    describe('Invalid authorization', () => {
      it('should return error Object with Status Code: 401', done => {
        chai
          .request(app)
          .get('/payments')
          .set('authorization', testUserToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Unauthorized request)/g);

            done();
          });
      });
    });
  });

  describe('POST /payments', () => {
    describe('Create a payment', () => {
      it('should return payment Object and Status Code: 201', done => {
        const testLicensePlate = {
          licensePlate: testReservation.licensePlate
        };

        chai
          .request(app)
          .post('/payments')
          .send(testLicensePlate)
          .set('authorization', testAdminToken)
          .end(function(err, res) {
            expect(err).to.be.null;
            
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.all.keys(
              '_id',
              'mallId',
              'parkId',
              'reservationId',
              'totalCharge'
            );
            expect(res.body.licensePlate).to.equal(
              testLicensePlate.licensePlate
            );
            testPaymentId = res.body._id;

            done();
          });
      });
    });

    describe('Invalid licence plate', () => {
      it('should return error Object with Status Code: 400', done => {
        const testLicensePlate = {
          licensePlate: 'AB WRONG CD'
        };

        chai
          .request(app)
          .post('/payments')
          .send(testLicensePlate)
          .set('authorization', testAdminToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Reservation not found)/g);

            done();
          });
      });
    });

    describe('Invalid authorization', () => {
      it('should return error Object with Status Code: 401', done => {
        const testLicensePlate = {
          licensePlate: testReservation.licensePlate
        };

        chai
          .request(app)
          .post('/payments')
          .send(testLicensePlate)
          .set('authorization', testUserToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Unauthorized request)/g);

            done();
          });
      });
    });
  });

  describe('PATCH /payments', () => {
    describe('Complete a payment', () => {
      it('should return payment Object and Status Code: 200', done => {
        const data = {
          status: 'completed'
        }

        chai
          .request(app)
          .patch(`/payments/${testPaymentId}`)
          .send(data)
          .set('authorization', testAdminToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.status).to.equal('completed');

            done();
          })
      });
    });

    describe('Invalid authorization', () => {
      it('should return error Object with Status Code: 401', done => {
        const data = {
          status: 'completed'
        };

        chai
          .request(app)
          .patch(`/payments/${testPaymentId}`)
          .send(data)
          .set('authorization', testUserToken)
          .end(function(err, res) {
            expect(err).to.be.null;

            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.be.a('string');
            expect(res.body.message).to.match(/(Unauthorized request)/g);

            done();
          });
      });
    });
  })
});
