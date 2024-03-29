// OpenWeather "Current weather data" API from https://openweathermap.org/current
const apiKey = "576b7150a9477b8171e12f98b0eb0d99";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-button");
const deleteBtn = document.querySelector(".delete-img");
let weatherIcon = document.querySelector(".weather-icon");
let weatherStattxt = document.querySelector(".weather-status");
let weatherTime = document.querySelector(".weather-time")
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getDirection(degrees) {
    let min  = Number.POSITIVE_INFINITY;
    let directionDegrees;
    let direction;

    for(let i = 0; i < 360; i+=22.5) {
        if (Math.abs(i - degrees) < min) {
            min = Math.abs(i - degrees);
            directionDegrees = i;
        }
    }

    // console.log(directionDegrees)
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

// show time in "real time"
function showTime(data) {
    setInterval(() => {
        // UTC
        let date = new Date();
        let time = date.toLocaleString("en-GB", {timeZone: "Europe/London"})
            .split(",")[1].split(":");

        // console.log(time)
        let addHoursList = (data.timezone/3600).toString().split(".");
        // console.log(addHoursList)
        let negativeTimeZone = false;
        if (parseInt(addHoursList[0]) < 0) {
            negativeTimeZone = true;
        }
        let sumHours = (parseInt(time[0]) + parseInt(addHoursList[0]));
        // console.log(sumHours)
        let day = days[date.getUTCDay()];
        let indexOfDay = date.getUTCDay();
        if (sumHours < 0) {
            if (indexOfDay === 0) {
                indexOfDay = 7;
            }
            day = days[indexOfDay - 1];
        }
        if (sumHours >= 24) {
            if (indexOfDay === 6) {
                indexOfDay = -1;
            }
            day = days[indexOfDay + 1];
        }

        let hour = (((sumHours % 24) + 24) % 24);
        // console.log(hour)
        let minute = parseInt(time[1]);
        // console.log(minute)
        if (addHoursList.length > 1) {
            if (negativeTimeZone) {
                minute = parseInt(time[1]) - (parseFloat("0." + addHoursList[1]) * 60);
            }
            else {
                minute = parseInt(time[1]) + (parseFloat("0." + addHoursList[1]) * 60);
            }
        }
        // console.log(minute)
        if (minute < 0) {
            hour = hour - 1;
            if (hour < 0) {
                if (indexOfDay === 0) {
                    indexOfDay = 7;
                }
                day = days[indexOfDay + 1];
            }
        }
        if (minute >= 60) {
            hour = hour + 1;
            if (hour >= 24) {
                if (indexOfDay === 6) {
                    indexOfDay = -1;
                }
                day = days[indexOfDay + 1];
            }
        }
        hour = (((hour % 24) + 24) % 24);
        minute = (((minute % 60) + 60) % 60);

        // add prefix '0'
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }

        // format time
        weatherTime.innerHTML = `${day}, ` + hour + ":" + minute + ":" + time[2];

    }, 100);
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
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        
        let data = await response.json();

        // print response
        console.log(data);

        const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });

        weatherStattxt.innerHTML = data.weather[0].description.at(0).toUpperCase() +
            data.weather[0].description.substring(1, data.weather[0].description.length);


        showTime(data);

        document.querySelector(".city").innerHTML = data.name + ", " +
            regionNamesInEnglish.of(data.sys.country);
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind-speed").innerHTML = data.wind.speed + " km/h";
        document.querySelector(".wind-direction").innerHTML = getDirection(data.wind.deg);


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
        else if (weatherStatusIcon === "Haze") {
            weatherIcon.src = "images/haze.png";
        }


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

deleteBtn.addEventListener("click", () => {
    if (searchBox.value.length > 0) {
        searchBox.value = "";
        document.querySelector(".disc").style.display = "block";
        document.querySelector(".error").style.display = "none";
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
document.querySelector(".blank").style.display = "block";

setInterval(() => {
    // console.log("checktextinput")
    if (searchBox.value.length > 0) {
        document.querySelector(".blank").style.display = "none";
        document.querySelector(".delete-img").style.display = "block";
        }
    else if (searchBox.value.length === 0) {
        document.querySelector(".disc").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".blank").style.display = "block";
        document.querySelector(".delete-img").style.display = "none";
    }
});
