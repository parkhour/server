const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

const app = require('../server');
const { db } = require('../config/firebase');
const testHelper = require('../helpers/testHelper');



describe('Reservation test', () => {




});
