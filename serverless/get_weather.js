
require('dotenv').config();

const {WEATHER_API_KEY} = process.env
console.log(WEATHER_API_KEY);
const fetch = require('node-fetch');


exports.handler = async (event, context) =>{
  const params = JSON.parse(event.body);
  const {latitude, longitude} = params;
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=3&aqi=yes&alerts=yes`;
  try{
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    console.log(JSON.stringify(weatherJson));
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson)
    };
  }
    catch(err){
      return {statusCode: 422,
      body: err.stack};
    }
  }

