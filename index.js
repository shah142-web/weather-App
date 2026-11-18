async function getWeather() {

    let city = document.getElementById("cityInput").value;

    let error = document.getElementById("error");

    if (city.trim() === "") {
        error.innerText = "Please enter a city name!";
        return;
    }

    error.innerText = "";

    try {

        // Find city coordinates
        let locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        let locationData = await locationResponse.json();

        if (!locationData.results) {
            throw new Error("City not found!");
        }

        let location = locationData.results[0];

        let latitude = location.latitude;
        let longitude = location.longitude;

        // Get weather information
        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
        );

        let weatherData = await weatherResponse.json();

        let current = weatherData.current;

        // Display information
        document.getElementById("city").innerText =
            location.name;

        document.getElementById("temp").innerText =
            current.temperature_2m + "°C";

        document.getElementById("humidity").innerText =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").innerText =
            current.wind_speed_10m + " km/h";

        document.getElementById("feels").innerText =
            current.apparent_temperature + "°C";

        // Weather conditions
        let code = current.weather_code;

        let condition = "Clear";
        let icon = "☀️";

        if (code === 0) {
            condition = "Clear Sky";
            icon = "☀️";
        }
        else if (code <= 3) {
            condition = "Cloudy";
            icon = "⛅";
        }
        else if (code <= 48) {
            condition = "Foggy";
            icon = "🌫️";
        }
        else if (code <= 67) {
            condition = "Rainy";
            icon = "🌧️";
        }
        else if (code <= 77) {
            condition = "Snowy";
            icon = "❄️";
        }
        else if (code <= 82) {
            condition = "Rain Showers";
            icon = "🌦️";
        }
        else if (code <= 86) {
            condition = "Snow Showers";
            icon = "🌨️";
        }
        else {
            condition = "Thunderstorm";
            icon = "⛈️";
        }

        document.getElementById("condition").innerText =
            condition;

        document.getElementById("icon").innerText = icon;

    }
    catch (err) {

        error.innerText = err.message;

    }

}
Displaying weatherApp.js.
