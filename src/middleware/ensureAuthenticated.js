export function ensureAuthenticated(req, res, next) {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.set("Access-Control-Allow-Credentials", "true");

  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).end();
}
