const express = require('express');
const router = express.Router();
const { getPublicSuppliers } = require('../controllers/publicController');

router.get('/suppliers', getPublicSuppliers);

module.exports = router;
