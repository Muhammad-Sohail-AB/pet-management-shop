const router = require('express').Router();

const helper = require('../helper');

const {
  getUsers,
  getUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require('../controllers/userController');

const { authenticateUser } = require('../middleWare/authentication');

router
  .route('/')
  .get(authenticateUser, helper.checkPermissions('admin'), getUsers);
router.route('/showCurrentUser').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updatePassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getUser);

module.exports = router;
