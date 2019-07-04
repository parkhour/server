const moment = require('moment');

exports.setCronTimer = ( time, delay ) => {
  const doDate = new Date(time)
  doDate.setSeconds(doDate.getSeconds() + delay);
  return doDate;
}

exports.calculateParkingCharge = (startTime) => {
  const diff = moment(new Date).diff(moment(startTime), 'minutes');
  const rate = 5000;
  
  if(diff < 60 ) {
    return (rate).toLocaleString('id',{ style: 'currency', currency: 'IDR' });
  } else {
    return ((diff/60).toFixed(1) * rate | 0).toLocaleString('id',{ style: 'currency', currency: 'IDR' });
  };
};
