export const setPlaceholderText = () =>{
  const input = document.getElementById('searchBar__text');
  window.innerWidth < 400 ? (input.placeholder = "City, State, Country") : (input.placeholder = "City, State, Country or Zip Code");

}

export const addSpinner = (element) =>{
  animateButton(element);
  setTimeout(animateButton, 1000, element);
}


const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
}

export const displayError = (headerMess, scReaderMess) =>{
  UpdateWeatherLocationHeader(headerMess);
  UpadateScreenReaderConfirmation(scReaderMess);


}
export const dispalyApiError = (statusCode)=>{
  const properMsg = toProperCase(statusCode.message);
  UpdateWeatherLocationHeader(properMsg);
  UpadateScreenReaderConfirmation(`${properMsg}. Please try again`);

}
const toProperCase= (text) => {
  
  const words = text.split(' ');
  const properWords = words.map((word) =>{
    return word.charAt(0).toUpperCase() + word.slice(1);
  })
  return properWords.join(" ");
}
const UpdateWeatherLocationHeader = (message) =>{
  const h1 = document.getElementById("currentForescast__Location")
  if (message.indexOf("Lat")!== -1 && message.indexOf("Long")!== -1 ){
    const messgeArray = message.split(" ");
    const mapMessageArray = messgeArray.map(msg => {return msg.replace(":",": ")});
    const lat= mapMessageArray[0].indexOf("-")===-1 ? mapMessageArray[0].slice(0,10) : mapMessageArray.slice(0,11);
const long= mapMessageArray[1].indexOf("-")===-1 ? mapMessageArray[1].slice(0,11) : mapMessageArray.slice(0,12);
h1.textContent = `${lat} • ${long}`;

  }
  else h1.textContent = message;

};
export const UpadateScreenReaderConfirmation = (message) => {

  document.getElementById("confirmation").textContent = message;
}

export const updateDisplay = (weatherJson, locationObj) =>{
  fadeDisplay();
  clearDisplay();
  const weatherClass = getWeatherClass(weatherJson.current.condition.code,weatherJson.current.is_day);

  setBckGrdImage(weatherClass,weatherJson.current.is_day);
  const screenReaderWeatherMsg = buildScreenReaderWeather(weatherJson, locationObj);
  UpadateScreenReaderConfirmation(screenReaderWeatherMsg);
  UpdateWeatherLocationHeader(locationObj.getName());
  //current condition

const currentConditionArray = createCurrentCdtDivs(weatherJson,locationObj.getUnit());

displayCurrentCdt(currentConditionArray);


  // Three days forecast
displayThreeForecastCdt(weatherJson);
setFocusOnSearch();
fadeDisplay();


}

const fadeDisplay = () =>{

  const currentCdt = document.getElementById("currentForescast");
  currentCdt.classList.toggle("zero-vis");
  currentCdt.classList.toggle("fadeIn");
  const ThreeDaysFrscast = document.getElementById("dailyForecast");
  ThreeDaysFrscast.classList.toggle("zero-vis");
  ThreeDaysFrscast.classList.toggle("fadeIn");
}

const clearDisplay = () => {
  const currentCdt = document.getElementById("currentForescast__Conditions");
  deleteContents(currentCdt);
  const ThreeDaysFrscast = document.getElementById("dailyForecast__contents");
  deleteContents(ThreeDaysFrscast);

}

const deleteContents = (parentElement) =>{
  let child = parentElement.lastElementChild;
  while(child){
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;

  }
};

const getWeatherClass = (code, is_day) => {
  
  const is_day_true = is_day === 1 ? true : false;
  let weatherLookUp = []
   if(is_day_true) weatherLookUp = [{"clear-sky": [1000]},
    {"cloudy_day": [1003,1006,1009]},
  {"fog_day": [1030,1135,1147]},
  {"pellet":[1069, 1204, 1207, 1237, 1249, 1252, 1261, 1264]},
  {"rainy_day": [1063,1072,1150,1153, 1168, 1171,1180, 1183, 1186, 1189,1198, 1201, 1240]},
  {"rainstorm": [1192, 1195,1243, 1246]},
  {"snow": [1066,1210, 1213, 1216, 1219, 1255, 1279]},
  {"snowstorm": [1114, 1117, 1222, 1225, 1258, 1282]},
  {"thunder": [1087, 1273,1276]
}];
else weatherLookUp = [{"night": [1000]},
{"cloudy_night": [1003,1006,1009]},
{"fog_night": [1030,1135,1147]},
{"pellet":[1069, 1204, 1207, 1237, 1249, 1252, 1261, 1264]},
{"rainy_night": [1063,1072,1150,1153, 1168, 1171,1180, 1183, 1186, 1189,1198, 1201, 1240]},
{"rainstorm": [1192, 1195,1243, 1246]},
{"snow_nigth": [1066,1210, 1213, 1216, 1219, 1255, 1279]},
{"snowtorm_night": [1114, 1117, 1222, 1225, 1258, 1282]},
{"thunder": [1087, 1273,1276]
}];
let CurrentweatherCdt = weatherLookUp.filter(weather => {
  let codeWeatherCdtArray = Object.values(weather);
  
  return codeWeatherCdtArray[0].includes(code);
})
return Object.keys(CurrentweatherCdt[0])[0];


}

const setBckGrdImage = (weatherClass) =>{
  document.documentElement.classList.add(weatherClass);
  document.documentElement.classList.forEach(
    bckgrdClassImg => {if(bckgrdClassImg !== weatherClass) document.documentElement.classList.remove(bckgrdClassImg)}
  )


}

const buildScreenReaderWeather = (weatherJson, locationObj) =>{
  const location = locationObj.getName();
  const unit = locationObj.getUnit();
  const tempsUnit = unit === "imperial" ? "C" : "F";
  return `${weatherJson.current.condition.text} and ${Math.round(Number(weatherJson.current.temp_c))}°${tempsUnit} in ${location}`;

};
const setFocusOnSearch = () =>{
  document.getElementById("searchBar__text").focus();

}

const createCurrentCdtDivs = (weatherObject,unit) =>{
  const tempsUnit = unit === 'imperial' ? "C" : "F";
  const windUnit = unit === "imperial" ? "kph" : "mph";
  const icon = createMainImageDiv(weatherObject.current.condition.code, weatherObject.current.condition.text,weatherObject.current.is_day);
  const temp = createElem("div","temp",`${Math.round(Number(weatherObject.current.temp_c))}°`,`${tempsUnit}`);
  const properDescpt = toProperCase(weatherObject.current.condition.text);
  const descript = createElem("div","des",properDescpt);
  const feelslike = createElem("div","feels",`Feels like ${Math.round(Number(weatherObject.current.temp_c))}°`,`${tempsUnit}`);
  const maxTemp = createElem("div","maxtemp",`High ${Math.round(Number(weatherObject.forecast.forecastday[0].day.maxtemp_c))}°`,`${tempsUnit}`);
  const minTemp = createElem("div","mintemp",`Low ${Math.round(Number(weatherObject.forecast.forecastday[0].day.mintemp_c))}°`,`${tempsUnit}`);
  const humidity = createElem("div","humidity",`humidity ${Math.round(Number(weatherObject.current.humidity))}%`);
  const wind = createElem("div","wind",`wind speed ${Math.round(Number(weatherObject.current.wind_kph))}${windUnit}`);
  return [icon,temp,descript,feelslike,maxTemp,minTemp,humidity,wind];

}

const createMainImageDiv = (code, altText, is_day) =>{ 
  const iconDiv = createElem("div","icon")
  iconDiv.id = "icon";
  const faIcon = translateIconIntoFontAwesome(code,is_day);
  faIcon.ariaHidden = true;
  faIcon.title = altText;
  iconDiv.appendChild(faIcon);
  return iconDiv;
}
const translateIconIntoFontAwesome = (code, is_day) => {
  
  const i= is_day === 1 ? DayWeatherCurrentCdtIcon(code,is_day) : nightWeatherCurrentCdtIcon(code,is_day);
  return i;
}
const DayWeatherCurrentCdtIcon = (code, is_day) =>{
  const i= document.createElement('i');
  const weatherClass = getWeatherClass(code, is_day);
    if (weatherClass === "clear-sky") i.classList.add("fas", "fa-sun" ); 
    else if (weatherClass === "cloudy_day") i.classList.add("fas", "fa-cloud-sun"); 
    else if (weatherClass === "fog_day") i.classList.add("fas", "fa-smog");
    else if (weatherClass === "rainy_day") i.classList.add("fas","fa-cloud-showers-heavy");
    else if (weatherClass === "pellet" ||weatherClass === "snow" || weatherClass === "snowstorm"){ i.classList.add("fas","fa-snowflake");
    }
    else i.classList.add("fas","fa-poo-storm");
    console.log
    return i;

}

const nightWeatherCurrentCdtIcon = (code, is_day) =>{
  const i= document.createElement('i');
  const weatherClass = getWeatherClass(code, is_day);
  if (weatherClass === "night") i.classList.add("fas" ,"fa-moon");
    else if(weatherClass === "cloudy_night") i.classList.add("fas", "fa-cloud-moon");
    else if (weatherClass === "fog_night") i.classList.add("fas", "fa-smog");
    else if (weatherClass === "rainy_night") i.classList.add("fas","fa-cloud-showers-heavy");
    else if (weatherClass === "pellet" || weatherClass === "snow" || weatherClass === "snowstorm") i.classList.add("fas","fa-snowflake");
    else i.classList.add("fas","fa-poo-storm");
    return i;

}
const createElem = (elemType, divClassName, divText, unit) =>{
  const div = document.createElement(elemType);
  div.classList.add(divClassName);
  if(divText) div.textContent = divText;
  if(divClassName ="temp") {
    const unitDiv = document.createElement("div");
    unitDiv.classList.add("unit");
    unitDiv.textContent = unit;
    div.appendChild(unitDiv);
  }
  return div;



}
const displayCurrentCdt = (weatherConditionArray) =>{
  const currentCdtContainer = document.getElementById("currentForescast__Conditions");
  weatherConditionArray.forEach(currentCdtdiv => currentCdtContainer.appendChild(currentCdtdiv));

}
 const displayThreeForecastCdt = (weatherJson) => {

  for (let i = 0; i <= 2; i++){
    const dailyForecastArray = createDailyForecastDiv(weatherJson, weatherJson.forecast.forecastday[i]);
    displayDailyForecastCdt(dailyForecastArray);

  }
 };
 const createDailyForecastDiv = (weatherJson, dayWeather) =>{
  const dayAbbreviationText = getDayAbbreviation(dayWeather.date);
  const dayAbbreviation = createElem("p","dayAbbreviation",dayAbbreviationText);
  const weatherClass = getWeatherClass(weatherJson.current.condition.code, weatherJson.current.is_day);
  const dayIcon = createDailyForecastIcon(weatherClass, weatherJson.current.is_day);
  const dayHigh = createElem("p","DayHigh",`${Math.round(Number(dayWeather.day.maxtemp_c))}°`);
  const dayLow = createElem("p","DayLow",`${Math.round(Number(dayWeather.day.mintemp_c))}°`);

  return [dayAbbreviation, dayIcon, dayHigh,dayLow];

 }
 const getDayAbbreviation = (dataDate) =>{
  const DatadateArray = dataDate.split("-");
  const ComasDataDate = DatadateArray.join(", ");
  
  const dateObj = new Date(ComasDataDate);
  const utcString = dateObj.toUTCString();
  return utcString.slice(0,3).toUpperCase();
 }
 const createDailyForecastIcon = (weatherClass, is_day, altText) =>{
  const codeIconWeather = getWeatherIcon(weatherClass, is_day);
  const img = document.createElement("img");
  img.src = is_day ===1 ? `day/${codeIconWeather}.png` : `night/${codeIconWeather}.png` ;
  img.alt = altText;
  return img;

 }

 const getWeatherIcon = (weatherClass, is_day) => {
  
  const is_day_true = is_day === 1 ? true : false;
  let weatherLookUp = []
   if(is_day_true) weatherLookUp = [{"clear-sky": 113},
    {"cloudy_day": 119},
  {"fog_day": 248},
  {"pellet":350},
  {"rainy_day": 296},
  {"rainstorm": 308},
  {"snow": 332},
  {"snowstorm": 227},
  {"thunder": 389
}];
else weatherLookUp = [{"night": 113},
{"cloudy_night": 119},
{"fog_night": 248},
{"pellet": 350},
{"rainy_night": 296},
{"rainstorm": 308},
{"snow_nigth": 332},
{"snowtorm_night": 227},
{"thunder": 389
}];
let CurrentweatherCdt = weatherLookUp.filter(weather => {
  let ClassWeatherkey = Object.keys(weather)[0];
  return ClassWeatherkey === weatherClass;
});
return Object.values(CurrentweatherCdt[0])[0];


}
const displayDailyForecastCdt = ( dailyForecastArray) =>{
  const dayDiv = createElem("div","dailyForecast");
  dailyForecastArray.forEach(el => dayDiv.appendChild(el) );
  document.getElementById("dailyForecast__contents").append(dayDiv);


}