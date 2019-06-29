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
  //  else if (mongooseClientError.includes(error.name)) {
  //   errorObj.message = error.message
  //     ? error.message
  //     : 'We can\'t process your request';
  //   code = 400;
  // } 
  else {
    errorObj.message = 'There\'s something wrong in the system';
    code = 500;
  }
  errorObj.code = code;
  return errorObj;
};

module.exports = { handler };
