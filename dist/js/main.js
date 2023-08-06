import current_location from "./current_location.js"
import { setPlaceholderText,addSpinner, displayError, UpadateScreenReaderConfirmation, dispalyApiError, updateDisplay } from "./DomFunctions.js";
import { setLocationObj,getHomeLocation, cleanText,getCoordsFromApi,getWeatherFromCoords } from "./dataFunctions.js";
const currentLoc = new current_location();
const initApp = () =>{
  // Add listeners here
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener('click', getGeoWeather);
  const homeButton = document.getElementById('home');
  homeButton.addEventListener('click',loadWeather);
  const saveButton =  document.getElementById('saveLocation');
  saveButton.addEventListener('click',saveLocation)
  const unitButton = document.getElementById("unit");
  unitButton.addEventListener('click',setUnitPref);
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener('click', refreshWeather);
  const locationEntry = document.getElementById("searchBar__form");
  locationEntry.addEventListener('submit',submitNewLocation);

  //set up 
setPlaceholderText();
  // load weather
  loadWeather();
  
}

document.addEventListener("DOMContentLoaded",initApp);

const getGeoWeather = (event) =>{
  if (event){
    if (event.type === 'click'){
      const mapIcon = document.querySelector(".fa-map-marker");
      addSpinner(mapIcon);
    }

  }
  if(!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSucess,geoError);


}
const geoError = (errObj) =>{
  const errMessge = errObj ? errObj.message : "geolocation not supported";
  displayError(errMessge ,errMessge );

}

const geoSucess = (position) =>{
  const myCoordonneesObj = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
  };
  // set location object
  setLocationObj(currentLoc, myCoordonneesObj);
  updateDataAndDisplay(currentLoc);

  // update data and display
}
const loadWeather = (event) =>{
  const savedLocation = getHomeLocation();
  if(!savedLocation && !event) return getGeoWeather();
  if(!savedLocation && event.type === 'click') {
    displayError('No Home Location Saved.','Sorry, please save your Home Location first.')
  } 
  else if(savedLocation && !event) displayHomeLocationWeather(savedLocation);
  else {
    const homeIcon = document.querySelector('.fa-home');
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }


}

const displayHomeLocationWeather = (savedLocation) => {
if (typeof savedLocation === 'string') {
  const locationJSON = JSON.parse(savedLocation);
  const myCoordonneesObj = {
    latitude : locationJSON.latitude,
    longitude : locationJSON.longitude,
name : locationJSON.name,
unit : locationJSON.unit

  }
  setLocationObj(currentLoc,myCoordonneesObj);
  
  updateDataAndDisplay(currentLoc);
}
}
const saveLocation = () => {
  
  if (currentLoc.getLatitude() && currentLoc.getLongitude()){
    
    const saveIcon = document.querySelector('.fa-save');
    addSpinner(saveIcon);
    const location = {
      name:currentLoc.getName(),
      latitude:currentLoc.getLatitude(),
      longitude: currentLoc.getLongitude(),
      unit: currentLoc.getUnit()
    }
    localStorage.setItem('defaultWeatherLocation',JSON.stringify(location));
    UpadateScreenReaderConfirmation(`Saved ${currentLoc.getName()} as home location.`)
  }
}

const setUnitPref  = () =>{
  const unitIcon = document.querySelector(('.fa-chart-bar '));
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay(currentLoc);
}
const refreshWeather = () =>{
  
  const refreshIcon = document.querySelector(('.fa-sync-alt'));
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);

}
const submitNewLocation = async(event) =>{
  event.preventDefault();
  const text = document.getElementById('searchBar__text').value;
  const entryText = cleanText(text);
  if(!entryText.length) return;
  const locationIcon = document.querySelector(".fa-search ");
  addSpinner(locationIcon);
  const coordsData = await getCoordsFromApi(entryText,'yes');
  if(coordsData){
    
    if(!coordsData.error){
      const myCoordonneesObj ={latitude : coordsData.location.lat,
        longitude : coordsData.location.lon,
        name : coordsData.location.country ? `${coordsData.location.name}, ${coordsData.location.country}`: coordsData.location.name
      };
      setLocationObj(currentLoc,myCoordonneesObj);
      updateDataAndDisplay(currentLoc);

    }
    else{
      dispalyApiError(coordsData.error);
    }
  } else{
    displayError("Connextion Error, Connextion Error")
  }
}

const updateDataAndDisplay = async(locationObj) => {
  
  const weatherJson = await getWeatherFromCoords(locationObj);
  if(weatherJson) updateDisplay(weatherJson, locationObj);
}