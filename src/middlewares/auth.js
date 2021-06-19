module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send("No token provided");

  if (authHeader !== process.env.AUTH_MS) {
    return res.status(401).send("Token invalid");
  }

  const Origin = req.headers.origin;

  if (Origin !== process.env.ORIGIN) {
    return res.status(401).send("Not authorized");
  }

  return next();
};
