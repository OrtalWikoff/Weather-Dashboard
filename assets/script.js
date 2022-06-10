//  global variables
var mainCity = "";
var lastSearch = "";

var myAPI = "962435ef3bd63c2c118e361ff306ea67";

var Err = (response) => {
    if (!response.ok) {
    }
    return response;
}

// event listener
$('#search-button').on("click", (event) => {
    event.preventDefault();
    mainCity = $('#search-city').val();
    conditions(event);
    });
    
    // Old searched event listener
    $('#city-results').on("click", (event) => {
        event.preventDefault();
        $('#search-city').val(event.target.textContent);
        mainCity=$('#search-city').val();
        conditions(event);
    });

//current city
var conditions = (event) => {

    // city name (under the search box)
    let city = $('#search-city').val();
    mainCity= $('#search-city').val();

    // fetch Api
    let urlApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + myAPI;
    fetch(urlApi)
    .then(Err)
    .then((response) => {
        return response.json();
    })
    .then((response) => {
// Save city to local storage
saveCity(city);
$('#search-error').text("");
//  icon for the current weather 
let icon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
// timezone - using moment.js
let currentTimeUTC = response.dt;
let currentTimeZoneOffset = response.timezone;
let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
// Render cities list
randCity();
// Obtain the 5day forecast for the searched city
fiveDays(event);
// HTML for the results of search
let currentWeatherHTML = `
    <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${icon}"></h3>
    <ul class="list-unstyled">
        <li>Temperature: ${response.main.temp}&#8457;</li>
        <li>Humidity: ${response.main.humidity}%</li>
        <li>Wind Speed: ${response.wind.speed} mph</li>
        <li id="uvIndex">UV Index:</li>
    </ul>`;
// Append the results to the DOM
$('#current-weather').html(currentWeatherHTML);
// Get the latitude and longitude for the UV search from Open Weather Maps API
let latitude = response.coord.lat;
let longitude = response.coord.lon;
let uvQueryURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + myAPI;
// Fetch the UV information and build the color display for the UV index
fetch(uvQueryURL)
.then(Err)
.then((response) => {
    return response.json();
})
.then((response) => {
    let uvIndex = response.value;
    $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
    if (uvIndex>=0 && uvIndex<3){
        $('#uvVal').attr("class", "uv-favorable");
    } else if (uvIndex>=3 && uvIndex<8){
        $('#uvVal').attr("class", "uv-moderate");
    } else if (uvIndex>=8){
        $('#uvVal').attr("class", "uv-severe");
    }
});
})
}

//  display to HTML
var fiveDays = (event) => {
let city = $('#search-city').val();

//Fetch Api

let urlApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + myAPI;
fetch(urlApi)
.then (Err)
.then((response) => {
    return response.json();
})
.then((response) => {

    let fiveInHtml = `
<h2>Five days forecast:</h2>
<div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
// Loop over the 5 day 
for (let i = 0; i < response.list.length; i++) {
    let dayData = response.list[i];
    let dayTimeUTC = dayData.dt;
    let timeZoneOffset = response.city.timezone;
    let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
    let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
    let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
    //  displaying mid-day forecasts
    if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
        fiveInHtml += `
        <div class="weather-card card m-2 p0">
            <ul class="list-unstyled p-3">
                <li>${thisMoment.format("MM/DD/YY")}</li>
                <li class="weather-icon"><img src="${iconURL}"></li>
                <li>Temp: ${dayData.main.temp}&#8457;</li>
                <br>
                <li>Humidity: ${dayData.main.humidity}%</li>
            </ul>
        </div>`;
    }
}
//  HTML template
fiveInHtml += `</div>`;
// Append the five-day 
$('#five-day-forecast').html(fiveInHtml);
})
}

// Save the city to localStorage
var saveCity = (newCity) => {
let cityExists = false;
for (let i = 0; i < localStorage.length; i++) {
if (localStorage["cities" + i] === newCity) {
    cityExists = true;
    break;
}
}
if (cityExists === false) {
localStorage.setItem('cities' + localStorage.length, newCity);
}
}

// Render the list of searched cities
var randCity = () => {
$('#city-results').empty();
if (localStorage.length===0){
if (lastSearch){
    $('#search-city').attr("value", lastSearch);
} else {
    $('#search-city').attr("value", "Tel Aviv");
}
} else {
let lastCityKey="cities"+(localStorage.length-1);
lastSearch=localStorage.getItem(lastCityKey);
// Set search input to last city searched
$('#search-city').attr("value", lastSearch);
// Append 
for (let i = 0; i < localStorage.length; i++) {
    let city = localStorage.getItem("cities" + i);
    let cityEl;
    if (mainCity===""){
        mainCity=lastSearch;
    }
    if (city === mainCity) {
        cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
    } else {
        cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
    } 
    // Append
    $('#city-results').prepend(cityEl);
}
//  "clear" button to page 
if (localStorage.length>0){
    $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
} else {
    $('#clear-storage').html('');
    }
}

}

// Clear old searched 
$("#clear-storage").on("click", (event) => {
localStorage.clear();
randCity();
});

randCity();

// calls the five day forecast
conditions();