const temp = document.getElementById("temp");
  date = document.getElementById("date-time");


let currentCity = "";
let currentUnit = "C";
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
        if( unit === "c"){
            temp.innerText = today.temp;

        }else {
            temp.innerText == celciousToFahreheit(today.temp)
        }
    });



}

// covert celcious to fahrenheit
function celciousToFahrehei(){
    
}