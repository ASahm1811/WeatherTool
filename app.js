// OpenWeather "Current weather data" API from https://openweathermap.org/current
const apiKey = "576b7150a9477b8171e12f98b0eb0d99";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
let weatherIcon = document.querySelector(".weather-icon");
let weatherStattxt = document.querySelector(".weather-status");
let weatherTime = document.querySelector(".weather-time")

function getDirection(degrees) {
    let min = Number.POSITIVE_INFINITY;
    let directionDegrees;
    let direction;

    for(let i = 0; i < 360; i+=22.5) {
        if (Math.abs(i - degrees) < min) {
            min = Math.abs(i - degrees);
            directionDegrees = i;
        }
    }

    console.log(directionDegrees)
    if (directionDegrees === 0) {
        direction = "N";
    }
    else if (directionDegrees === 22.5) {
        direction = "NNE";
    }
    else if (directionDegrees === 45) {
        direction = "NE";
    }
    else if (directionDegrees === 67.5) {
        direction = "ENE";
    }
    else if (directionDegrees === 90) {
        direction = "E";
    }
    else if (directionDegrees === 112.5) {
        direction = "ESE";
    }
    else if (directionDegrees === 135) {
        direction = "SE";
    }
    else if (directionDegrees === 157.5) {
        direction = "SSE";
    }
    else if (directionDegrees === 180) {
        direction = "S";
    }
    else if (directionDegrees === 202.5) {
        direction = "SSW";
    }
    else if (directionDegrees === 225) {
        direction = "SW";
    }
    else if (directionDegrees === 247.5) {
        direction = "WSW";
    }
    else if (directionDegrees === 270) {
        direction = "W";
    }
    else if (directionDegrees === 292.5) {
        direction = "WNW";
    }
    else if (directionDegrees === 315) {
        direction = "NW";
    }
    else if (directionDegrees === 337.5) {
        direction = "NNW";
    }

    return direction;
}
async function getWeatherInfo(city) {
    const response = await fetch(apiUrl + `${city}&appid=${apiKey}`);

    if (response.status === 404) {
        document.querySelector(".disc").style.display = "none";
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
    else if (response.status === 200) {
        document.querySelector(".disc").style.display = "none";
        let data = await response.json();

        // print response
        console.log(data);

        const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });

        weatherStattxt.innerHTML = data.weather[0].description.at(0).toUpperCase() +
            data.weather[0].description.substring(1, data.weather[0].description.length);

        // show time in "real time"
        setInterval(() => {
            let date = new Date();
            let time = date.toLocaleString("en-GB", {timeZone: "Europe/London"})
                .split(",")[1].split(":")
            let hour = ((parseInt(time[0]) + (data.timezone/3600)) % 24).toString();
            weatherTime.innerHTML = `${date.toDateString().split(" ")[0]}, ` +
                hour + ":" + time[1] + ":" + time[2];
        });

        document.querySelector(".city").innerHTML = data.name + ", " +
            regionNamesInEnglish.of(data.sys.country);
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".direction").innerHTML = "Direction: " + getDirection(data.wind.deg);


        let weatherStatusIcon = data.weather[0].main;

        if (weatherStatusIcon === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        }
        else if (weatherStatusIcon === "Rain") {
            weatherIcon.src = "images/rain.png";
        }
        else if (weatherStatusIcon === "Clear") {
            weatherIcon.src = "images/clear.png";
        }
        else if (weatherStatusIcon === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }
        else if (weatherStatusIcon === "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        else if (weatherStatusIcon === "Snow") {
            weatherIcon.src = "images/snow.png";
        }


        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }

}
searchBtn.addEventListener("click", () => {
    if (searchBox.value === "") {
        document.querySelector(".disc").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
    else {
        getWeatherInfo(searchBox.value);
    }
})

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (searchBox.value === "") {
            document.querySelector(".disc").style.display = "block";
            document.querySelector(".error").style.display = "none";
        }
        else {
            getWeatherInfo(searchBox.value);
        }
    }
})

if (performance.getEntriesByType("navigation")[0].type === "reload") {
    searchBox.value = "";
}

document.querySelector(".disc").style.display = "block";