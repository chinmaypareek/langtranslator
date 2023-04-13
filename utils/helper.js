require('dotenv').config();
const { Farmer, Translation } = require("../models/farmerDetails"); // importing the farming model
const connectDB = require('../db/connect');
const { Translate } = require("@google-cloud/translate").v2;
const translate_API_KEY = process.env.TRANSLATION_API_KEY;

// This function will save the farmer data from csv file into db
async function saveFarmerData(name, phoneNo, village, district, state) {
  try {
    await connectDB();
    const savedFarmer = await Farmer.create({
      name: name,
      phoneNo: phoneNo,
      state: state,
      district: district,
      village: village
    });
    //console.log("Data saved successfully:", savedFarmer);
    translateLanguage(name, phoneNo, village, district, state, savedFarmer._id).then(results => saveTranslations(results)).catch(err => console.log(err));
     return savedFarmer;
  } catch (error) {
    console.error("Error saving farmer data:", error);
    throw error;
  }
}

// Creating an instance of the google translate api
const translate = new Translate({ key: translate_API_KEY});

// This function will call the translateText method to translate the text into each language
const translateLanguage = async (name, phoneNo, village, district, state, farmerId) => {
  const languages = ["hi", "mr", "pa", "te"];
  let results = [];
  for (let i = 0; i < languages.length; i++) {
    let translated_name = await translateText(name, languages[i]);
    let translated_phoneNo = await translateText(phoneNo, languages[i]);
    let translated_village = await translateText(village, languages[i]);
    let translated_district = await translateText(district, languages[i]);
    let translated_state = await translateText(state, languages[i]);
    results.push({
      name: translated_name[0],
      phoneNo: translated_phoneNo[0],
      village: translated_village[0],
      district: translated_district[0],
      state: translated_state[0],
      language: languages[i],
      farmerId: farmerId
    });
  }
  return results;
};

//This function will translate a particular text into target language 
const translateText = async (text, targetLanguage) => {
  let translation = [];
  try {
    const [response] = await translate.translate(text, targetLanguage);
    translation = [response];
  } catch (err) {
    console.error("ERROR:", err);
  }
  return translation;
};

//This function will save the translation into db
const saveTranslations = async (translationObj) => {
  for(let i=0;i<translationObj.length;i++) {
    await connectDB();
    const savedTranslation = await Translation.create(translationObj[i]);
    //console.log('Translation saved successfully', savedTranslation);
  }
}

module.exports = saveFarmerData;




