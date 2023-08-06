// handle the data for the current state of the app
export default class current_location {
  constructor() {
    this._name = "current Location"; // le "_" indique que c'est une variable privée
    this._latitude = null;
    this._longitude = null;
    this._unit = "imperial";
  }

  getName() {
    return this._name;
  }

  setName(name){
     this._name = name;
  }
  getLatitude() {
    return this._latitude;
  }

  setLatitude(latitude){
     this._latitude = latitude;
  }
  getLongitude() {
    return this._longitude;
  }

  setLongitude(longitude){
     this._longitude = longitude;
  }
  getUnit() {
    return this._unit;
  }

  setUnit(unit){
     this._unit = unit;
  }
  toggleUnit(){
    this._unit = this._unit ==="imperial" ? "metric" : "imperial";
  }
}