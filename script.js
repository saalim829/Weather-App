const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryText = document.querySelector('.country-text')
const tempText = document.querySelector('.temp-text')
const conditionText = document.querySelector('.condition-text')
const humidityValueText = document.querySelector('.humidity-value-text')
const windValueText = document.querySelector('.wind-value-text')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateText = document.querySelector('.current-date-txt')

const forecastItemContainer = document.querySelector('.forecast-items-container')

const apiKey = '27375cba8917e2a14d9da1d979787d7a'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
    updateWeatherInfo(cityInput.value)
    cityInput.value = ''
    cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
   
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'

}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',

    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    
    const weatherData = await getFetchData('weather', city);

    if(weatherData.cod != 200) {
        showDisplaySections(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    countryText.textContent = country
    tempText.textContent = Math.round(temp) + ' °C'
    conditionText.textContent = main
    humidityValueText.textContent = humidity + '%'
    windValueText.textContent = speed + ' M/s'

    currentDateText.textContent = getCurrentDate()
    weatherSummaryImg.src = `ASSETS/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySections(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemContainer.innerHTML =''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
           updateForecastsItems(forecastWeather)
        }
    })
}

function updateForecastsItems(weatherData) {
    console.log(weatherData)
    const  {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img src="ASSETS/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySections(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}