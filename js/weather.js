'use strict';

const currentWeather = document.querySelector('#current-weather');
const closeWeatherAsideBtn = document.querySelector('#close-weather-btn');
const weatherAside = document.querySelector('#weather-aside');

// Show weather aside when clicking the current weather
currentWeather.addEventListener('click', function() {
  weatherAside.classList.replace('hidden', 'visible');
})

// Hide weather aside when clicking the arrow button in it
closeWeatherAsideBtn.addEventListener('click', function() {
  weatherAside.classList.replace('visible', 'hidden');
});

//Weather api with private api key. Condition: ignore air quality data, no weather alerts, 7 day forecast and weather conditions are in finnish
//note for future self: enable weather alerts and integrate that into the code
const weatherAPIURL = 'https://api.weatherapi.com/v1/forecast.json?key='+weatherApiKey+'&q=Helsinki&days=7&aqi=no&alerts=no&lang=fi';

async function getWeather() {
  try { // Try
    // Start fetch from WeatherAPI
    const response = await fetch(weatherAPIURL);
    // If error occurs, give error message
    if (!response.ok) throw new Error('Jotain meni pieleen.');
    // JSON to JavaScript object/array
    const weather = await response.json();

    //Current weather stats (temperature and condition)
    const cImg1 = document.createElement('img');
    const temperatureNode1 = document.createTextNode(weather.current.temp_c.toString());
    cImg1.src = 'https:' + weather.current.condition.icon;

    const cImg2 = document.createElement('img');
    const temperatureNode2 = document.createTextNode(weather.current.temp_c.toString());
    cImg2.src = 'https:' + weather.current.condition.icon;

    //Daily forecast (chance of snow/rain and min/max temps)
    const forecastRain = document.createTextNode(weather.forecast.forecastday[0].day.daily_chance_of_rain.toString());
    const forecastMaxTemp_c = document.createTextNode(weather.forecast.forecastday[0].day.maxtemp_c.toString());
    const forecastMinTemp_c = document.createTextNode(weather.forecast.forecastday[0].day.mintemp_c.toString());

    //Current Weather condition in plain text
    const conditionNode = document.createTextNode(weather.current.condition.text.toString());

    //Current Condition icon and temperature
    document.querySelector('.c-img').appendChild(cImg1);
    document.querySelector('.c-temp').appendChild(temperatureNode1).textContent += " °C";
    document.querySelector('.current-img').appendChild(cImg2);
    document.querySelector('.current_temp').appendChild(temperatureNode2).textContent += " °C";

    //Current Condition in plain text
    document.querySelector('.c-cond').appendChild(conditionNode);

    //Current forecast
    document.querySelector('.c-mintemp').appendChild(forecastMinTemp_c).textContent += " °C";
    document.querySelector('.c-maxtemp').appendChild(forecastMaxTemp_c).textContent += " °C";
    document.querySelector('.c-rain').appendChild(forecastRain).textContent += "%";

    //Start of 7̶ 2-day forecast
    //day 1
    const day1MinTemp = document.createTextNode(weather.forecast.forecastday[1].day.mintemp_c.toString());
    const day1MaxTemp = document.createTextNode(weather.forecast.forecastday[1].day.maxtemp_c.toString());
    const day1Rain = document.createTextNode(weather.forecast.forecastday[1].day.daily_chance_of_rain.toString());
    const day1Cond = document.createTextNode(weather.forecast.forecastday[1].day.condition.text.toString());
    const day1Img = document.createElement('img');
    day1Img.src = 'https:' + weather.forecast.forecastday[1].day.condition.icon;

    //day2
    const day2MinTemp = document.createTextNode(weather.forecast.forecastday[2].day.mintemp_c.toString());
    const day2MaxTemp = document.createTextNode(weather.forecast.forecastday[2].day.maxtemp_c.toString());
    const day2Rain = document.createTextNode(weather.forecast.forecastday[2].day.daily_chance_of_rain.toString());
    const day2Cond = document.createTextNode(weather.forecast.forecastday[2].day.condition.text.toString());
    const day2Img = document.createElement('img');
    day2Img.src = 'https:' + weather.forecast.forecastday[2].day.condition.icon;

    //time to print all of this cancer
    document.querySelector('.d1-mintemp').appendChild(day1MinTemp).textContent += " °C";
    document.querySelector('.d1-maxtemp').appendChild(day1MaxTemp).textContent += " °C";
    document.querySelector('.d1-rain').appendChild(day1Rain).textContent += "%";
    document.querySelector('.d1-cond').appendChild(day1Cond);
    document.querySelector('.d1-img').appendChild(day1Img);

    document.querySelector('.d2-mintemp').appendChild(day2MinTemp).textContent += " °C";
    document.querySelector('.d2-maxtemp').appendChild(day2MaxTemp).textContent += " °C";
    document.querySelector('.d2-rain').appendChild(day2Rain).textContent += "%";
    document.querySelector('.d2-cond').appendChild(day2Cond);
    document.querySelector('.d2-img').appendChild(day2Img);
  } catch (error) {
    console.log(error.message);
  }
}

getWeather();