const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).send({
      message: 'Invalid credentials',
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH,
  );

  if (!isMatch) {
    return res.status(401).send({
      message: 'Invalid credentials',
    });
  }

  const token = jwt.sign(
    {
      admin: true,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );

  return res.send({ token });
};

module.exports = {
  login,
};
