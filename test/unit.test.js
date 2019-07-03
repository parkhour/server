const moment = require('moment');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const helper = require('../helpers/timeHelper');

chai.use(sinonChai);

describe('Unit test suite', () => {
  describe('Calculate total charge', () => {
    it('should calculate total charge of a reservation', () => {
      const duration = new Date();
      duration.setHours(duration.getHours() - 5);
  
      let spyThis = sinon.spy(helper, 'calculateParkingCharge');
  
      helper.calculateParkingCharge(duration);
  
      expect(spyThis).to.have.been.calledOnce;
      expect(spyThis).to.have.been.calledWith(duration);
  
      spyThis.restore()
  
    })
  });
  
})