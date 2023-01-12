const express = require("express");
const https = require("node:https");
const app = express();

app.set("views", __dirname + "/view");
app.set("view engine", "pug");
app.use(express.static("static"));

function getCardinalDirection(angle) {
  if (typeof angle === "string") angle = parseInt(angle);
  if (angle <= 0 || angle > 360 || typeof angle === "undefined") return "☈";
  const arrows = {
    north: "↑ N",
    north_east: "↗ NE",
    east: "→ E",
    south_east: "↘ SE",
    south: "↓ S",
    south_west: "↙ SW",
    west: "← W",
    north_west: "↖ NW",
  };
  const directions = Object.keys(arrows);
  const degree = 360 / directions.length;
  angle = angle + degree / 2;
  for (let i = 0; i < directions.length; i++) {
    if (angle >= i * degree && angle < (i + 1) * degree)
      return arrows[directions[i]];
  }
  return arrows["north"];
}

app.get("/", (req, res) => {
  const apiKEY = "c26cdb50a5c0475188695305231201";
  let cityName = "Bokaro Steel City";
  let query_URL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKEY}&q=${cityName}&days=3&aqi=yes&alerts=no`;
  let weatherParam;
  https.get(query_URL, (respond) => {
    let weatherData = "";
    respond.setEncoding("utf-8");
    respond.on("data", (d1) => {
      weatherData += d1;
    });
    respond.on("end", () => {
      let val = JSON.parse(weatherData);
      weatherParam = {
        citiName: cityName,
        aqi: 138,
        todayTemp: val.current.temp_c.toFixed(0),
        todayText: val.current.condition.text,
        iconURL: "https:" + val.current.condition.icon,
        todayWeather: [
          val.forecast.forecastday[0].day.condition.text,
          val.forecast.forecastday[0].day.maxtemp_c.toFixed(0),
          val.forecast.forecastday[0].day.mintemp_c.toFixed(0),
        ],
        tommWeather: [
          val.forecast.forecastday[1].day.condition.text,
          val.forecast.forecastday[1].day.maxtemp_c.toFixed(0),
          val.forecast.forecastday[1].day.mintemp_c.toFixed(0),
        ],
        nextWeather: [
          val.forecast.forecastday[2].day.condition.text,
          val.forecast.forecastday[2].day.maxtemp_c.toFixed(0),
          val.forecast.forecastday[2].day.mintemp_c.toFixed(0),
        ],
        weatherDetail: [
          val.current.feelslike_c.toFixed(0),
          val.forecast.forecastday[0].day.maxtemp_c.toFixed(0),
          val.forecast.forecastday[0].day.mintemp_c.toFixed(0),
          val.current.cloud,
          val.current.humidity,
          `${val.current.vis_km.toFixed(1)}km/h ${getCardinalDirection(
            val.current.wind_degree
          )}`,
          val.current.pressure_mb,
        ],
      };

      res.render("index.pug", weatherParam);
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
