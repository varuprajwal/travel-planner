// weather.js - Handles Weather API integration

const API_KEY = "61132e22699bf848e15bd11b2383b565"; // Replace with your actual API key

// Fetch weather data for a city
async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`City not found: ${city}`);
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById("weather-info").innerHTML =
            `<p class="error">${error.message}</p>`;
    }
}

// Display weather data
function displayWeather(data) {
    const weatherDiv = document.getElementById("weather-info");
    const { name, main, weather } = data;
    weatherDiv.innerHTML = `
        <h3>Weather in ${name}</h3>
        <p>Temperature: ${main.temp}°C</p>
        <p>Feels Like: ${main.feels_like}°C</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
}

// Event listener for the weather button
document.getElementById("get-weather").addEventListener("click", () => {
    const city = document.getElementById("city-name").value;
    if (city.trim() !== "") {
        fetchWeather(city);
    } else {
        document.getElementById("weather-info").innerHTML =
            `<p class="error">Please enter a valid city name.</p>`;
    }
});
