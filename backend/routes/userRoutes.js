const express = require('express');
const { createUser, getAllUsers } = require('../controller/userController');

const router = express.Router();

router.route('/create').post(createUser)
router.route('/getUser').get(getAllUsers)


module.exports = router;