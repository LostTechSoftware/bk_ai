module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send("No token provided");

  if (authHeader !== process.env.AUTH_MS) {
    return res.status(401).send("Token invalid");
  }

  return next();
};
