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
  const longitude = locationObj.getLongitude();
  const params = JSON.stringify({
    latitude: latitude,
    longitude: longitude
  });
  /*const urlDataObj = {
    latitude : locationObj.getLatitude(),
    longitude : locationObj.getLongitude(),
    

  }

  const urlDataObJson = JSON.stringify(urlDataObj);*/
  try{
    const weatherstream = await fetch("./.netlify/functions/get_weather", {method: 'POST', body: params });
    if (!weatherstream.ok) {
      // Gère l'erreur ici
      throw new Error('Erreur de réseau lors de la demande à l\'API météo');
    }
    
    const weatherJson = await weatherstream.json();
   
    return weatherJson;
  }
  catch(err) {
    console.error(err);

  }


}
export const getCoordsFromApi = async(entryText, air_quality_data = 'no') =>{
const urlDataObj ={
  text : entryText,
  air_quality_data : air_quality_data
}
try{
  const datastream = await fetch('./.netlify/functions/get_coords', {
    method: "POST",
    body : JSON.stringify(urlDataObj)
  });
  const Jsondata = await datastream.json();
  return Jsondata;
}catch(err){
  console.log('dans catch');
  console.error(err);

}

}
export const cleanText = (text) =>{
  const regex = / {2,}/g;
  const entryText = text.replaceAll(regex," ").trim();
  return entryText
}