const router = require('express').Router();

const {
  createHorse,
  getHorses,
  getHorse,
  deleteHorse,
  updateHorse,
  uploadHorseImage,
  getSingleUserHorses,
} = require('../controllers/horseController');

const { authenticateUser } = require('../middleWare/authentication');

router.route('/').post(authenticateUser, createHorse).get(getHorses);
router.route('/upload-horse-image').post(authenticateUser, uploadHorseImage);
router
  .route('/:id')
  .get(getHorse)
  .delete(authenticateUser, deleteHorse)
  .patch(authenticateUser, updateHorse);
router
  .route('/:id/get-single-user-horses')
  .get(authenticateUser, getSingleUserHorses);

module.exports = router;
