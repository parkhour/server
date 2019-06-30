const nodeError = [
  'Error',
  'EvalError',
  'InternalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError'
];
const mongooseClientError = ['CastError', 'ValidatorError', 'ValidationError'];
const jwtError = ['JsonWebTokenError'];

const errorCode = errorMessage => {
  switch (errorMessage) {
    case 'Email/password cannot be empty':
      return 400;
    default:
      return 500;
  }
};

const handler = error => {
  let code;
  const errorObj = {};
 /* istanbul ignore else  */
  if (typeof error.code === 'string') {
    errorObj.message = error.message;
    if (
      error.message.match(/The email address is already in use by another account/g)
    ) {
      code = 409;
    } else code = 400;
  }
   else if (nodeError.includes(error.name)) {
    errorObj.message = error.message;
    code = errorCode(error.message);
  }
  else if (jwtError.includes(error.name)) {
    if(error.message === 'jwt malformed') {
      errorObj.message = 'Bad request, please login again'
    } else errorObj.message = error.message;
    code = 400;
  }
   else if (mongooseClientError.includes(error.name)) {
    errorObj.message = error.message
      ? error.message
      : 'We can\'t process your request';
    code = 400;
  }
  else {
    errorObj.message = error.message
    // errorObj.message = 'There\'s something wrong with the server, please try again later' ;
    code = 500;
  }
  errorObj.code = code;
  return errorObj;
};

module.exports = { handler };
