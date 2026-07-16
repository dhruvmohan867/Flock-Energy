export function validatePage(req, res, next) {
  if (req.query.page && isNaN(parseInt(req.query.page, 10))) {
    return res.status(400).json({ error: { message: 'Page must be a number', status: 400 } });
  }
  next();
}
export function validateMeterId(req, res, next) {
  if (!req.params.meterId) {
    return res.status(400).json({ error: { message: 'Meter ID is required', status: 400 } });
  }
  next();
}