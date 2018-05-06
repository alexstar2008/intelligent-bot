const router = require('express').Router();
//
const { connector } = require('./bot');

router.post('/messages', connector.listen());

module.exports = router;
