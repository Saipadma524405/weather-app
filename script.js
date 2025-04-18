const temp = document.getElementById("temp");
date = document.getElementById("date-time");
currentLocation = document.getElementById("location");

condition = document.getElementById("condition");
rain = document.getElementById("id");
mainIcon = document.getElementById("icon");
uvIndex = document.querySelector(".uv-index");
uvText = document.querySelector(".uv-text");
windSpeed = document.querySelector(".wind-speed");
sunRise = document.querySelector(".sunrise");
sunSet = document.querySelector(".sunset");
humidity = document.querySelector(".humidity");
visibility = document.querySelector(".visibility");
humidityStatus = document.querySelector(".humidity-status");
airQuality = document.querySelector(".air-quality");
airQualityStatus = document.querySelector(".air-quality-status");
visibilityStatus = document.querySelector(".visibility-status");

weatherCards = document.querySelector("#weather-cards");
celciousBtn = document.querySelector(".celcious");
fahrenheitBtn = document.querySelector(".fahrenheit");
hourlyBtn = document.querySelector(".hourly");
weekBtn = document.querySelector(".week");
let tempUnitElements = document.querySelectorAll(".temp-unit");

const unitLabel = document.getElementById("unit-label");

searchForm = document.querySelector("#search");
search = document.querySelector("#query")





let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week"
// update time and Date
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();


    let days = [
        "Sunday",
        "Tuesday",
        "Wendnesday",
        "Thursday",
        "Friday",
        "Saturday"

    ];
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;

    } if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return ` ${dayString},${hour}:${minute}`;

}
date.innerText = getDateTime();

// update time for every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

// function to get public ip with fetch

function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        })



}
getPublicIp();
//  function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey = "XXLVUHNL25LG85RGEWRCXR5WF";

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;

            if (temp) {
                temp.innerText = unit === "c"
                    ? today.temp
                    : celciousToFahreheit(today.temp);
            }

            if (unitLabel) {
                unitLabel.innerText = unit === "c" ? "°C" : "°F";
            }

            if (currentLocation) currentLocation.innerText = data.resolvedAddress;
            if (condition) condition.innerText = today.conditions;
            if (rain) rain.innerText = "Perc - " + today.precip + "%";
            if (uvIndex) uvIndex.innerText = today.uvindex;
            if (windSpeed) windSpeed.innerText = today.windspeed;
            if (humidity) humidity.innerText = today.humidity + "%";
            if (visibility) visibility.innerText = today.visibility;
            if (airQuality) airQuality.innerText = today.winddir;

            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQualityStatus(today.winddir);
            if (sunRise) sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
            if (sunSet) sunSet.innerText = convertTimeTo12HourFormat(today.sunset);

            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);

            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day")
            } else {
                updateForecast(data.days, unit, "week")
            }



        })
        .catch((error) => {
            alert("City not found in our database");
        })



}

// covert celcious to fahrenheit
function celciousToFahreheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);

}

//   function to get uv index status 
function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Extreme";
    }
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        updateHumidityStatus.innerText = "Low";

    } else if (humidity <= 60) {
        updateHumidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }

}


function updateVisibilityStatus(visibility) {
    if (visibility <= 0.3) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.26) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air"
    }
}


function updateAirQualityStatus(airQuality) {
    if (airQuality <= 50) {
        airQualityStatus.innerText = "Good";
    } else if (airQuality <= 100) {
        airQualityStatus.innerText = "Moderate";
    } else if (airQuality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    } else if (airQuality <= 200) {
        airQualityStatus.innerText = "Unhealthy";
    } else if (airQuality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy";
    } else {
        airQualityStatus.innerText = "Hazardous"
    }

}



function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;    // the zero hour should be 12
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime

}


function getIcon(condition) {
    if (condition === "Partly-cloudy-day") {
        return "./images/sun.png";
    } else if (condition === "partly-cloudy-night") {
        return "./images/sun-cloudy.png";
    } else if (condition === "rain") {
        return "./images/rainy.png";
    } else if (condition === "clear-day") {
        return "./images/clear-sky.png";
    } else if (condition === "clear-night") {
        return "./images/clear-night.png";
    } else {
        return "./images/sun.png";
    }


}



function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}: ${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }

}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday ",
        "Wednsday",
        "Thursday",
        "Friday",
        "Saturday"

    ]
    return days[day.getDay()];
}


function updateForecast(data, unit, type) {
    weatherCards.innerText = " ";
    let day = 0;
    let numCards = 0;
    //  24 cards if  hourly weather and 7 for weekly
    if (type === "day") {
        numCards = 24;

    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        //  hour if hourly time and day name if weekly
        let dayName = getHour(data[day].datetime);
        if (type == "week") {
            dayName = getDayName(data[day].datetime);;
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciousToFahreheit(data[day].temp);

        }

        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let unitSymbol = "°C";
        if (unit === "f") {
            unitSymbol = "°F";
        }
        card.innerHTML = ` <h2 class="day-name">${dayName}</h2>
                        <div class="card-icon">
                            <img src="${iconSrc}" alt="">
                        </div>
                        <div class="day-temp">
                            <h2 class="temp">${dayTemp}</h2>
                            <span class="temp-unit">${unitSymbol}</span>
                        </div>`;

        weatherCards.appendChild(card);
        day++;
        tempUnitElements = document.querySelectorAll(".temp-unit");
    }



}



function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "Partly-cloudy-day") {
        bg = "./images/pc.webp";
    } else if (condition === "partly-cloudy-night") {
        bg = "./images/pcn.jpg";
    } else if (condition === "rain") {
        bg = "./images/rain.webp";
    } else if (condition === "clear-day") {
        bg = "./images/cd.jpg";
    } else if (condition === "clear-night") {
        bg = "./images/cn.jpg";
    } else {
        return "./images/pc.webp";
    }

    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${bg})`




}










fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");

});
celciousBtn.addEventListener("click", () => {
    changeUnit("c");
});


function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        {
            tempUnitElements.forEach((elem) => {
                elem.innerHTML = `°${unit.toUpperCase()}`
            });
            if (unit === "c") {
                celciousBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            } else {
                celciousBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            getWeatherData(currentCity, currentUnit, hourlyorWeek);

        }
    }

}


hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
})
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week")
})

function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }

}


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
        removeSuggestions();
    }
})

cities = [
    "Abbottabad",
    "Multan",
    "Peshawar",
    "Islamabad",
    "Mehdipatnam"
];

var currentFocus;
search.addEventListener("input", function (e) {

    removeSuggestions();
    var a,
        b,
        i,
        val = this.value;
    if (!val) {
        return false;
    }
    currentFocus = -1;
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");
    this.parentNode.appendChild(a);
    for (i = 0; i < cities.length; i++) {
        if (cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("li");
            b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>"
            b.innerHTML += cities[i].substr(val.length);

            b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

            b.addEventListener("click", function (e) {
                search.value = this.getElementsByTagName("input")[0].value;
                currentCity = search.value;
                getWeatherData(currentCity, currentUnit, hourlyorWeek);

            });

            a.appendChild(b);


        }
    }
});



function removeSuggestions() {
    var x = document.getElementById("suggestions");
    if (x) x.parentNode.removeChild(x);

}
