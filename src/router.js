const router = require('express').Router();
//
const { connector } = require('./bot');

router.post('/messages', connector.listen());
router.get('/', function (req, res) {
    res.send('All is ok!');
});

module.exports = router;

