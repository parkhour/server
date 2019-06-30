const admin = require('firebase-admin');
const serviceAccount = require('../keyfile.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://parkhour2019.firebaseio.com"
});

exports.adminAuth =  admin.auth();

