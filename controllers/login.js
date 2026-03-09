const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Admin = require("../models/admin");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const admin = await Admin.findOne({ username });
  const passwordCorrect =
    admin === null ? false : await bcrypt.compare(password, admin.passwordHash);

  if (!(admin && passwordCorrect)) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  const adminForToken = {
    username: admin.username,
    id: admin._id,
  };

  const token = jwt.sign(
    adminForToken, 
    process.env.SECRET, 
    { expiresIn: 60 * 60 }
  );

  response
    .status(200)
    .send({ token, username: admin.username, name: admin.name });
});

module.exports = loginRouter;
