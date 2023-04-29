const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors');
const User = require('../models/User');
const helper = require('../helper');

const getUsers = async (req, res) => {
  const users = await User.find({});
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Success', users, count: User.length });
};

const getUser = async (req, res) => {
  const requestUser = req.user;
  const { id } = req.params;
  helper.authorizedPermissions(requestUser, id);
  const user = await User.findOne({ userID: id });
  if (!user) {
    throw new CustomApiError.BadRequestError(`no user exists with id:${id}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success', user });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomApiError.BadRequestError(
      'Please provide the name and email'
    );
  }
  const user = await User.findOne({ _id: req.user.userID });
  if (!user) {
    throw new CustomApiError.BadRequestError(
      `No user exist with email:${email}`
    );
  }
  user.name = name;
  user.email = email;
  await user.save();
  const tokenUser = helper.createTokenUser(user);
  const token = helper.createJWT(tokenUser);
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomApiError.BadRequestError(
      `please provide old password and new password`
    );
  }
  const user = await User.findOne({ _id: req.user.userID });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomApiError.UnauthenticatedError('authentication invalid');
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Password updated' });
};

const showCurrentUser = async (req, res) => {
  const { userID, name, role } = req.user;
  console.log({ userID, name, role });
  console.log(`req.user:${Object.keys(req.user)}`);
  const user = await User.findOne({ _id: req.user.userID });
  const tokenUser = helper.createTokenUser(user);
  res.status(StatusCodes.OK).json({ currentUser: tokenUser });
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};
