const temp = document.getElementById("temp");
  date = document.getElementById("date-time");
 currentLocation =document.getElementById(".location");
    
condition =document.getElementById("condition");
rain = document.getElementById("id");
mainIcon =document.getElementById("icon");
uvIndex =document.querySelector(".uv-index");
uvText =document.querySelector(".uv-text");
windSpeed =document.querySelector(".wind-speed");
sunRise=document.querySelector(".sunrise");
sunSet =document.querySelector(".sunset");
humidity=document.querySelector(".humidity");
visibility =document.querySelector(".visibility");
humidityStatus = document.querySelector(".humidity-status");
airQuality =document.querySelector(".air-quality");
airQualityStatus = document.querySelector(".air-quality-status");
visibilityStatus = document.querySelector(".visibility-status");






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
    if (hour < 10 ){
        hour = "0" + hour;

    }if(minute <10){
        minute ="0" + minute;
    }
    let dayString =days[now.getDay()];
     return ` ${dayString},${hour}:${minute}`;

}
date.innerText=getDateTime();

// update time for every second
setInterval(() => {
    date.innerText=getDateTime();
},1000);

// function to get public ip with fetch

function getPublicIp(){
    fetch("https://geolocation-db.com/json/",{
        method:"GET",
    })
    .then(response => response.json())
    .then((data) =>{
        console.log(data);
        currentCity =data.currentCity
        getWeatherData(data.city, currentUnit,hourlyorWeek);
    });
       

}
getPublicIp();
//  function to get weather data
function getWeatherData(city,unit,hourlyorWeek){
  const apiKey="XXLVUHNL25LG85RGEWRCXR5WF";

    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
        method :"GET",
    }
) 
    .then((response) =>response.json())
    .then( (data) => {
        let today = data.currentConditions;
        
        if (temp) {
            temp.innerText = unit === "c" ? today.temp : celciousToFahreheit(today.temp);
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

    });



}

// covert celcious to fahrenheit
function celciousToFahreheit(temp){
    return ((temp *9)  / 5 + 32).toFixed(1);

}

//   function to get uv index status 
function measureUvIndex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText ="Low";
    }else if (uvIndex <= 5){
        uvText.innerText ="Moderate";
    }else if (uvIndex <= 7){
        uvText.innerText ="High";
    }else if (uvIndex <= 10){
        uvText.innerText ="Very High";
    }else {
        uvText.innerText ="Extreme";
    }
}




