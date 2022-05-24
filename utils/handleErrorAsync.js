const handleError = require('./handleError');

const handleErrorAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next)
      .catch(err => handleError(res, next, err));
  };
};

module.exports = handleErrorAsync;