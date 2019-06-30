const cron = require('cron');
const moment = require('moment');
const { CronJob } = cron;

exports.setCronTimer = ( time ) => {
  const doDate = new Date(time)
  doDate.setSeconds(doDate.getSeconds()+5);
  return doDate;
} 

// exports.cronJobReservation = ( time, callback ) => {
// new CronJob(time, callback, function() {
//       console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), 'job\'s done');
//   }, true, 'Asia/Jakarta');
// };
