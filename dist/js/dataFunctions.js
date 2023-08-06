export const setLocationObj = (locationObj, myCoordonneesObj)=>{
  const {latitude, longitude, name, unit} = myCoordonneesObj;
  locationObj.setLatitude(latitude);
  locationObj.setLongitude(longitude);
  locationObj.setName(name);
  if(unit) locationObj.setUnit(unit);
}
export const getHomeLocation = () => {
  return localStorage.getItem('defaultWeatherLocation');
}
export const getWeatherFromCoords = async(locationObj)=>{
  const latitude = locationObj.getLatitude();
  const  longitude = locationObj.getLongitude();
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&days=3&aqi=yes&alerts=yes`;
  try{
    const weatherstream = await fetch(url);
    const weatherJson = await weatherstream.json();
    return weatherJson;
  }
  catch(err) {
    console.error(err);
  }

  /*const urlDataObj = {
    latitude : locationObj.getLatitude(),
    longitude : locationObj.getLongitude(),
    

  }

  const urlDataObJson = JSON.stringify(urlDataObj);
  try{
    const weatherstream = await fetch("/.netlify/functions/get_weather", {method: "POST", body: urlDataObJson });
    if (!weatherstream.ok) {
      // Gère l'erreur ici
      throw new Error('Erreur de réseau lors de la demande à l\'API météo');
    }
    
    const weatherJson = await weatherstream.json();
    
    console.log(weatherJson);
    return weatherJson;
  }
  catch(err) {
    console.log('dans catch');
    console.error(err);

  }*/


}
export const getCoordsFromApi = async(entryText, air_quality_data = 'no') =>{
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${entryText}&days=3&aqi=${air_quality_data}&alerts=yes`
  const encodeUrl = encodeURI(url);
  try {
    const datastream = await fetch(encodeUrl);
    const Jsondata = await datastream.json();
    
  
    return Jsondata;


  } catch (err) {
    console.error(err.stack);
  }
/*const urlDataObj ={
  text : entryText,
  air_quality_data : air_quality_data
}
try{
  const datastream = await fetch('/.netlify/functions/get_coords', {
    method: "POST",
    body : JSON.stringify(urlDataObj)
  });
  const Jsondata = await datastream.json();
  return Jsondata;
}catch(err){
  console.error(err);

}*/

}
export const cleanText = (text) =>{
  const regex = / {2,}/g;
  const entryText = text.replaceAll(regex," ").trim();
  return entryText
}