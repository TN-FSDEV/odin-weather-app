import "./style.css";
import { weatherAPIKey } from "./components/publicAPI.js";
import { processData, showNotification, setWeatherBlock } from "./components/utils.js";

const displayedLocations = [];

const form = document.querySelector("#search-form");
const searchBox = document.querySelector("#search-box");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const location = searchBox.value;
    getWeatherByLocation(location);
    searchBox.value = "";
})

async function getWeatherByLocation(location) {
    const filteredLocation = location.toLowerCase().trim().replace(" ", "-");
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${filteredLocation}?unitGroup=metric&key=${weatherAPIKey}`, { mode: "cors" });
        showNotification("Retrieved Successfully");

        if (!response.ok) {
            showNotification("Location Not Found");
            throw new Error("Location Not Found");
        }
        const weatherData = await response.json();
        const weatherAddress = weatherData.address;

        if (displayedLocations.includes(weatherAddress)) {
            showNotification("Location Already Added");
            throw new Error("Location Already Added.");
        }
        displayedLocations.push(weatherData.address);

        const processedWeather = await processData(weatherData);

        setWeatherBlock(weatherAddress, processedWeather);
    } catch (error) {
        console.error(error.message);
    }
}

export { displayedLocations };