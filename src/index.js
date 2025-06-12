
let apiKey = `79c10854b8bbfdaa4tfa826305864ob5`;
let geoNamesUsername = "mariabdelaserna";


function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector(".search-input");
  let city = searchInputElement.value.trim().toLowerCase();



  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

 
  axios.get(apiUrl).then(displayTemperature);
}

function getLocalTimeFromGeoNames(lat, lng, callback) {
  let geoUrl = `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${geoNamesUsername}`;

  axios.get(geoUrl)
    .then(function(response) {
      if (response.data && response.data.time) {
        callback(response.data.time);
      } else {
        console.error("GeoNames API Error:", response.data);
        callback(null);
      }
    })
    .catch(function(error) {
      console.error("GeoNames API request failed:", error);
      callback(null);
    });
}
function formatGeoTime(geoTimeString) {
  let date = new Date(geoTimeString);
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}


function displayTemperature(response) {

  let description = response.data.condition.description;
  let humidity = response.data.temperature.humidity;
  let windSpeed = response.data.wind.speed;

  let temperature = Math.round(response.data.temperature.current);
  let temperatureElement = document.querySelector("#weather-temperature-value");
  temperatureElement.innerHTML = temperature;

  let cityElement = document.querySelector("#city-name");
  let city = response.data.city;
  cityElement.innerHTML = city;

  let iconElement = document.querySelector("#weather-icon");
  let iconUrl = response.data.condition.icon_url.replace("http://", "https://");
  iconElement.setAttribute("src", iconUrl);
  iconElement.setAttribute("alt", description);

  let lat = response.data.coordinates.latitude;
  let lng = response.data.coordinates.longitude;

  getLocalTimeFromGeoNames(lat, lng, function(localTimeString) {
    let timeString;

    if (localTimeString) {
  timeString = formatGeoTime(localTimeString);
} else {
  timeString = "Time unavailable";
}

    document.querySelector(".weather-conditions").innerHTML = `
      ${timeString}, ${response.data.condition.description} <br>
      Humidity: <span id="humidity">${response.data.temperature.humidity}%,</span>
      Wind: <span id="wind-speed">${response.data.wind.speed}km/h</span>
    `;
  });
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search);
