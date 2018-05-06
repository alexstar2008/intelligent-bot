const express = require('express');
//
const router = require('./src/router');
const { port } = require('./config');

const app = express();
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
