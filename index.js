
const API = "https://6afc4bd3892984c4494b584d.mockapi.io/weather";

async function getWeather() {

    let city = document.getElementById("cityInput").value;
    let error = document.getElementById("error");

    if (city.trim() === "") {
        error.innerText = "Please enter a city!";
        return;
    }

    error.innerText = "";

    try {

        // Get city location
        let res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        let locationData = await res.json();

        if (!locationData.results) {
            throw new Error("City not found!");
        }

        let location = locationData.results[0];

        // Get weather
        let weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`
        );

        let data = await weatherRes.json();
        let current = data.current;

        // Weather condition
        let code = current.weather_code;
        let condition = "Clear Sky";
        let icon = "☀️";

        if (code >= 1 && code <= 3) {
            condition = "Cloudy";
            icon = "⛅";
        }
        else if (code >= 45 && code <= 48) {
            condition = "Foggy";
            icon = "🌫️";
        }
        else if (code >= 51 && code <= 67) {
            condition = "Rainy";
            icon = "🌧️";
        }
        else if (code >= 71 && code <= 77) {
            condition = "Snowy";
            icon = "❄️";
        }
        else if (code >= 80 && code <= 82) {
            condition = "Rain Showers";
            icon = "🌦️";
        }
        else if (code >= 85 && code <= 86) {
            condition = "Snow Showers";
            icon = "🌨️";
        }
        else if (code >= 95) {
            condition = "Thunderstorm";
            icon = "⛈️";
        }

        // Display weather
        document.getElementById("city").innerText = location.name;
        document.getElementById("temp").innerText = current.temperature_2m + "°C";
        document.getElementById("humidity").innerText = current.relative_humidity_2m + "%";
        document.getElementById("wind").innerText = current.wind_speed_10m + " km/h";
        document.getElementById("feels").innerText = current.apparent_temperature + "°C";
        document.getElementById("condition").innerText = condition;
        document.getElementById("icon").innerText = icon;

        // Save in MockAPI
        let save = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                city: location.name,
                temperature: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                wind: current.wind_speed_10m,
                feels: current.apparent_temperature,
                condition: condition,
                icon: icon
            })
        });

        if (!save.ok) {
            throw new Error("Could not save weather!");
        }

        console.log("Weather Saved Successfully!");

    }
    catch (err) {
        error.innerText = err.message;
        console.log(err);
    }

}
