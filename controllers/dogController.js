const path = require('path');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors');
const helper = require('../helper');
const Dog = require('../models/Dog');

const createDog = async (req, res) => {
  const { userID } = req.user;
  req.body.user = userID;
  const dog = await Dog.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ msg: 'Dog added', dog });
};

const getDogs = async (req, res) => {
  const dogs = await Dog.find({});
  res.status(StatusCodes.OK).json({ msg: 'Success', dogs, count: dogs.length });
};

const getDog = async (req, res) => {
  const { id: dogID } = req.params;
  const dog = await Dog.findOne({ _id: dogID });
  if (!dog) {
    throw new CustomApiError.BadRequestError(`No dog exists with id:${dogID}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success', dog });
};

const updateDog = async (req, res) => {
  const { name, breed, location, type, gender, size, age } = req.body;
  const properties = { name, breed, location, type, gender, size, age };
  const { id: dogID } = req.params;
  const dog = await Dog.findOne({ _id: dogID });
  if (!dog) {
    throw new CustomApiError.NotFoundError(`No dog exists with id : ${dogID}`);
  }
  helper.authorizedPermissions(req.user, dog.user);
  helper.updateDocument(dog._doc, properties);
  await dog.save();
  res.status(StatusCodes.OK).json({ msg: 'Dog updated', dog });
};

const deleteDog = async (req, res) => {
  const { id: dogID } = req.params;
  const dog = await Dog.findOne({ _id: dogID });
  if (!dog) {
    throw new CustomApiError.BadRequestError(`No dog exists with id:${dogID}`);
  }
  helper.authorizedPermissions(req.user, dog.user);
  await dog.remove();
  res.status(StatusCodes.OK).json({ msg: 'Dog removed' });
};

const uploadDogImage = async (req, res) => {
  if (!req.files) {
    throw new CustomApiError.BadRequestError('No File Uploaded');
  }
  const dogImage = req.files.image;
  if (!dogImage.mimetype.startsWith('image')) {
    throw new CustomApiError.BadRequestError('Please Upload Image');
  }
  const maxSize = 1024 * 1024;
  if (dogImage.size > maxSize) {
    throw new CustomApiError.BadRequestError('Please upload image smaller 1MB');
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${dogImage.name}`
  );
  await dogImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({
    msg: 'Image uploaded',
    image: { src: `/uploads/${dogImage.name}` },
  });
};

const getSingleUserDogs = async (req, res) => {
  const { id: userID } = req.params;
  const dogs = await Dog.find({ user: userID });
  res.status(StatusCodes.OK).json({ msg: 'Success', dogs, count: dogs.length });
};

module.exports = {
  createDog,
  getDogs,
  getDog,
  updateDog,
  deleteDog,
  uploadDogImage,
  getSingleUserDogs,
};
