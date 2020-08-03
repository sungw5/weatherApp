const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const cityQuery = req.body.cityName;
  const apiKey = "774b19e72498dd003129d196be510b19";
  const unit = "metric";
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${apiKey}&units=${unit}`;

  https.get(weatherURL, (response) => {
    console.log(response.statusCode);
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const weatherDesc = weatherData.weather[0].description;
      const iconURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

      res.write(
        `<h1>The temperature in ${cityQuery} is ${temperature} degrees</h1>`
      );
      res.write(`<p>The weather is currently ${weatherDesc}.</p>`);
      res.write(`<img src="${iconURL}" />`);
      res.send();
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
