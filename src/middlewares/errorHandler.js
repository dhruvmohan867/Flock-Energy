export default function errorHandler(err, req, res, next) {
  const status = err.response?.status || err.status || 500;
  const message = err.response?.data?.message || err.message || 'Internal Server Error';
  res.status(status).json({
    error: {
      message,
      status
    }
  });
}
