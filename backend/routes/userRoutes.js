const express = require('express');
const { createUser, getAllUsers, claimPoints, getAllClaimHistories, resetAllPoints } = require('../controller/userController');

const router = express.Router();

router.route('/create').post(createUser)
router.route('/getUser').get(getAllUsers)
router.route('/claim').post(claimPoints)
router.route('/getHistory').get(getAllClaimHistories)
router.route('/reset').post(resetAllPoints)

module.exports = router;