const fetch = require('node-fetch');

const {WEATHER_API_KEY} = process.env;

exports.handler = async(event, context) =>{
  const params = JSON.parse(event.body);
  const {text, air_quality_data} = params;
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${text}&days=3&aqi=${air_quality_data}&alerts=yes`;
  const encodeUrl = encodeURI(url);
  try {
    const datastream = await fetch(encodeUrl);
    const Jsondata = await datastream.json();
    return {
      statusCode: 200,
      body: JSON.stringify(weatherJson)
    };
  } catch(err){
    return {statusCode: 422,
    body: err.stack};
  }
}