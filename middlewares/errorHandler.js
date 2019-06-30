const { handler } = require('../helpers/errorHelper');

exports.errorHandler = (err, req, res, next) => {
  // console.trace(err, 'pre-handler')
  const error = handler(err);
  // console.trace(error, 'post-handler');
  const {
    code,
    message,
  } = error;

  res.status(code).json({ message });
};
