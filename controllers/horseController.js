const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors');
const helper = require('../helper');
const Horse = require('../models/Horse');

const createHorse = async (req, res) => {
  const { userID } = req.user;
  req.body.user = userID;
  const horse = await Horse.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ msg: 'Horse added', horse });
};

const getHorses = async (req, res) => {
  const horses = await Horse.find({});
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Success', horses, count: horses.length });
};

const getHorse = async (req, res) => {
  const { id: horseID } = req.params;
  const horse = await Horse.findOne({ _id: horseID });
  if (!horseID) {
    throw new CustomApiError.BadRequestError(
      `No dog exists with id:${horseID}`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Success', horse });
};

const updateHorse = async (req, res) => {
  const { name, breed, location, type, gender, size, age } = req.body;
  const properties = { name, breed, location, type, gender, size, age };
  const { id: horseID } = req.params;
  const horse = await Horse.findOne({ _id: horseID });
  if (!horse) {
    throw new CustomApiError.NotFoundError(
      `No horse exists with id : ${horseID}`
    );
  }
  helper.authorizedPermissions(req.user, horse.user);
  helper.updateDocument(horse._doc, properties);
  await horse.save();
  res.status(StatusCodes.OK).json({ msg: 'Horse updated', horse });
};

const deleteHorse = async (req, res) => {
  const { id: horseID } = req.params;
  const horse = await Horse.findOne({ _id: horseID });
  if (!horse) {
    throw new CustomApiError.BadRequestError(
      `No dog exists with id:${horseID}`
    );
  }
  helper.authorizedPermissions(req.user, horse.user);
  await horse.remove();
  res.status(StatusCodes.OK).json({ msg: 'Horse removed' });
};

const uploadHorseImage = async (req, res) => {
  if (!req.files) {
    throw new CustomApiError.BadRequestError('No File Uploaded');
  }
  const horseImage = req.files.image;
  if (!horseImage.mimetype.startsWith('image')) {
    throw new CustomApiError.BadRequestError('Please Upload Image');
  }
  const maxSize = 5 * 1024 * 1024;
  if (horseImage.size > maxSize) {
    throw new CustomApiError.BadRequestError('Please upload image smaller 1MB');
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${horseImage.name}`
  );
  await horseImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({
    msg: 'Image uploaded',
    image: { src: `/uploads/${horseImage.name}` },
  });
};

const getSingleUserHorses = async (req, res) => {
  const { id: userID } = req.params;
  const horses = await Horse.find({ user: userID });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Success', horses, count: horses.length });
};

module.exports = {
  createHorse,
  getHorses,
  getHorse,
  deleteHorse,
  updateHorse,
  uploadHorseImage,
  getSingleUserHorses,
};
