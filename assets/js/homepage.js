//API required to run the weather which include the provided key
var apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=1ddad8e7393c2c3270aeeebc69b22d77";

var listEl = document.querySelector("my.data");
//function to retrieve the API's data for a specific city
function searchCity(event, givenCity) {
  event.preventDefault();
  var city;
  if (givenCity === undefined) {
    city = document.getElementById("city").value;
  } else {
    city = givenCity;
  }
  console.log(city);
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=1ddad8e7393c2c3270aeeebc69b22d77`;
  console.log(apiUrl);
  var fiveDay = "";
  fetch(apiUrl)
    .then(function (response) {
      //convert into JSON object
      return response.json(); 
    })
    .then(function (data) {
      console.log(data);
      //display in HTML here 
      //use the data fetch for city name-date-temp-wind-wind-humidity-uv-index
      const retrievedDate = new Date(data.dt * 1000);
      document.getElementById("city-name").innerHTML = data.name;
      document.getElementById("date").innerHTML =
        retrievedDate.getMonth() +
        "/" +
        retrievedDate.getDate() +
        "/" +
        retrievedDate.getFullYear();
      tempNum = parseFloat(data.main.temp);
      document.getElementById("temp").innerHTML = (
        (tempNum - 273.15) * 1.8 +
        32
      ).toFixed(2);
      document.getElementById("wind").innerHTML = data.wind.speed;
      document.getElementById("humidity").innerHTML = data.main.humidity;
      document.getElementById("uv-index").innerHTML = data;

      fiveDayForecast(data.coord.lat, data.coord.lon);
    })
    .catch(function (error) {
      //In case there is an error
      console.log(error);
    });
}
// using lat and lon create the correct daily weather for the city.Use API for lat and lon
function fiveDayForecast(lat, lon) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&APPID=1ddad8e7393c2c3270aeeebc69b22d77`;

  fetch(apiUrl)
    .then(function (response) {
      //convert into JSON object
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      document.getElementById(`uv-index`).innerHTML = data.current.uvi;
      data.daily.forEach((day, index) => {
        // 0, 1, 2, 3, 4
        if (index < 5) {
          const retrievedDate = new Date(day.dt * 1000);
          document.getElementById(`date-${index + 1}`).innerHTML =
            retrievedDate.getMonth() +
            "/" +
            retrievedDate.getDate() +
            "/" +
            retrievedDate.getFullYear();
          tempNum = parseFloat(day.temp.day);
          document.getElementById(`temp-${index + 1}`).innerHTML = (
            (tempNum - 273.15) * 1.8 +
            32
          ).toFixed(2);

          var dayType = day.weather[0].main;
          var iconSpan = document.getElementById(`weather-icon-${index + 1}`);
          
          //display the weather with icons for the 5 days forcast 
          iconSpan.innerText = dayType;

          if (dayType == "Clouds") {
            // use cloud icon
            iconSpan.innerHTML =
              '<i class="wi wi-day-cloudy" title="clouds"></i>';
          } else if (dayType == "Rain") {
            // use rain icon
            iconSpan.innerHTML = '<i class="wi wi-rain" title="rain"></i>';
          } else if (dayType == "Clear") {
            // use sunny icon
            iconSpan.innerHTML =
              '<i class="wi wi-day-sunny" title="clear"></i>';
          } else if (dayType == "Snow") {
            iconSpan.innerHTML = '<i class="wi wi-day-snow"></i>';
          } else {
            iconSpan.innerText = dayType;
          }

          document.getElementById(`wind-${index + 1}`).innerHTML =
            day.wind_speed;
          document.getElementById(`humidity-${index + 1}`).innerHTML =
            day.humidity;
        }
      });
    });
}
