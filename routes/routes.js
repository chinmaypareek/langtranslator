const express = require('express');
const router = express.Router();
const { uploadCSV, getTranslation } = require('../controllers/controller');
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post('/upload-csv', upload.single('file'), uploadCSV);

router.get('/translation', getTranslation);

module.exports = router;