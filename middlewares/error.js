const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const { message } = err;
  res.status(status).json({ message } || 'На сервере произошла ошибка');
  return next();
};

module.exports = errorHandler;
