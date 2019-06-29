const { handler } = require('../helpers/errorHelper');

exports.errorHandler = (err, req, res, next) => {
  const error = handler(err);
  
  const {
    code,
    message,
  } = error;

  res.status(code).json({ message });
};
