const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors');
const User = require('../models/User');
const helper = require('../helper');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomApiError.BadRequestError(
      'Please provide name,email and password'
    );
  }
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new CustomApiError.BadRequestError(`email:${email} already exists`);
  }
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? 'admin' : 'user';
  const reqUser = { name, email, password, role };
  const user = await User.create({ ...reqUser });
  const tokenUser = helper.createTokenUser(user);

  const token = helper.createJWT(tokenUser);

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomApiError.BadRequestError(
      'Please provide email and password'
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomApiError.UnauthenticatedError(
      `No user exists with email:${email} `
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomApiError.UnauthenticatedError('invalid credentials');
  }
  const tokenUser = helper.createTokenUser(user);
  const token = helper.createJWT(tokenUser);
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

module.exports = { register, login };
