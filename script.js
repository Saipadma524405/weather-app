const temp = document.getElementById("temp");
  date = document.getElementById("date-time");


let currentCity = "";
let currentUnit = "";
let hourlyorWeek = "";
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
