const { isAuthenticated } = require('../middleware/auth');

const router = require('express').Router();

router.route("/order/new").post(isAuthenticated)

module.exports = router;