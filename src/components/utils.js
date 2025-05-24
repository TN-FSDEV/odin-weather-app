import { displayedLocations } from "..";

function processData(weatherData) {
  const {
    resolvedAddress,
    days: [day0, day1, day2, day3]
  } = weatherData;

  return { resolvedAddress, day0, day1, day2, day3 };
}

function getWeekdayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function showNotification(message) {
  const notification = document.querySelector("#notification-panel");
  notification.textContent = message;
  notification.classList.add("displayed");

  setTimeout(() => {
    notification.classList.remove("displayed");
  }, 3000);
}

function removeFromArray(arr, valueToRemove) {
  const index = arr.findIndex(item => item === valueToRemove);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}

async function setWeatherBlock(weatherAddress, processedWeather) {
  const weatherPanel = document.querySelector("#weather-panel");
  const { weatherIconURL, closeIconURL } = await getIconURLs(processedWeather);

  const weatherBlock = document.createElement("article");
  weatherBlock.setAttribute("class", "weather-block");
  weatherBlock.setAttribute("id", `${weatherAddress}`);
  weatherBlock.setAttribute("aria-label", `Weather information for ${weatherAddress}`);
  weatherBlock.innerHTML = addHTMLText(processedWeather, weatherIconURL, closeIconURL);
  weatherPanel.appendChild(weatherBlock);

  const closeBtn = weatherBlock.querySelector(".close-button");
  closeBtn.addEventListener("click", () => {
    removeFromArray(displayedLocations, weatherBlock.id);
    weatherBlock.remove();
    showNotification("Removed Successfully")
  })
}

async function getIconURLs(processedWeather) {
  const weatherIcon = await import(`../assets/${processedWeather.day0.icon}.svg`);
  const closeIcon = await import(`../assets/x-close.svg`);

  return { weatherIconURL: weatherIcon.default, closeIconURL: closeIcon.default }
}

function addHTMLText(processedWeather, weatherIconURL, closeIconURL) {
  return `
        <header class="location-name">
          <h2 class="location">${processedWeather.resolvedAddress}</h2>
          <img class="weather-header" src=${weatherIconURL} alt="${processedWeather.day0.conditions}" />
          <img class="close-button" src=${closeIconURL} alt="close" />
        </header>

        <section class="current-conditions">
          <div class="weather-data temperature" aria-label="Temperature"><span>Temperature:</span> ${processedWeather.day0.temp}°C</div>
          <div class="weather-data humidity" aria-label="Humidity"><span>Humidity:</span> ${processedWeather.day0.humidity}%</div>
          <div class="weather-data windspeed" aria-label="Wind Speed"><span>Wind Speed:</span> ${processedWeather.day0.windspeed} km/h</div>
          <div class="weather-data uvindex" aria-label="UV Index"><span>UV Index:</span> ${processedWeather.day0.uvindex}</div>
          <div
            class="weather-data description"
            aria-label="Weather Description"
          ><span>Description:</span> ${processedWeather.day0.description}</div>
        </section>

        <section class="forecast" aria-label="3-Day Forecast">
          <article
            class="forecast weather-data temperature day-1"
            aria-label="Day 1 Forecast"
          >
            <h3 class="weekday-name">${getWeekdayName(processedWeather.day1.datetime)}</h3>
            <div class="day-1 tempmax" aria-label="Max Temp Day 1"><span>${processedWeather.day1.tempmax}°C</span></div>
            <div class="day-1 tempmin" aria-label="Min Temp Day 1">${processedWeather.day1.tempmin}°C</div>
          </article>
          <article
            class="forecast weather-data temperature day-2"
            aria-label="Day 2 Forecast"
          >
            <h3 class="weekday-name">${getWeekdayName(processedWeather.day2.datetime)}</h3>
            <div class="day-2 tempmax" aria-label="Max Temp Day 2"><span>${processedWeather.day2.tempmax}°C</span></div>
            <div class="day-2 tempmin" aria-label="Min Temp Day 2">${processedWeather.day2.tempmin}°C</div>
          </article>
          <article
            class="forecast weather-data temperature day-3"
            aria-label="Day 3 Forecast"
          >
            <h3 class="weekday-name">${getWeekdayName(processedWeather.day3.datetime)}</h3>
            <div class="day-3 tempmax" aria-label="Max Temp Day 3"><span>${processedWeather.day3.tempmax}°C</span></div>
            <div class="day-3 tempmin" aria-label="Min Temp Day 3">${processedWeather.day3.tempmin}°C</div>
          </article>
        </section>
        `;
}

export { processData, showNotification, setWeatherBlock };