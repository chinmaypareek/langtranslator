const { Translation, Farmer } = require('../models/farmerDetails');
const csv = require('csv-parser');
const saveFarmerData = require('../utils/helper');
const fs = require('fs');

// This function will fetch the translated data from db
const getTranslation = async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    const myData = await Farmer.find({});
    res.status(200).json({ myData });
  }
  let languages = [];
  if(req.query && req.query.lang) {
    languages = req.query.lang;
 }
  try {
    const myData = await Translation.find({
      language: languages 
    });
    res.status(200).json(myData);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// This function will read the uploaded CSV file
 const uploadCSV = (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) =>
      saveFarmerData(
        data.farmer_name,
        data.phone_number,
        data.village_name,
        data.district_name,
        data.state_name
      )
    )
    .on("end", () => {
      // delete the temporary file created by multer
      fs.unlinkSync(req.file.path);
      res.send(results);
    });
};

module.exports = { getTranslation, uploadCSV };

