const router = require('express').Router();
const {
  createDog,
  getDogs,
  getDog,
  updateDog,
  deleteDog,
  uploadDogImage,
  getSingleUserDogs,
} = require('../controllers/dogController');
const { authenticateUser } = require('../middleWare/authentication');

router.route('/').post(authenticateUser, createDog).get(getDogs);
router.route('/upload-dog-image').post(authenticateUser, uploadDogImage);
router
  .route('/:id')
  .get(getDog)
  .delete(authenticateUser, deleteDog)
  .patch(authenticateUser, updateDog);
router.route('/:id/get-single-user-dogs').get(getSingleUserDogs);

module.exports = router;
