const auth = (req, res, next) => {
  switch (req.body.email) {
    case "yvan@organicstart.com":
    case "isaiah@organicstart.com":
    case "peter@organicstart.com":
      req.user = "admin";
      return next();
    default:
      res.status(401).send({ error: "not authorized" });
  }
};

module.exports = auth;
