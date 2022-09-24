export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("not authenticated");
  res.redirect("http://localhost:3000/");
}
