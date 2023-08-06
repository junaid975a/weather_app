// fetch required elements from html file
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// current tab
let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
// if latitude and longitude are present in storage,
//  fetch them, and show the weather of that place
getFromSessionStorage();


// changing the tab---------------------->>>>
// switch tab------>
function switchTab(clickedTab) {

    // if clicked tab is not the current tab.
    if(currentTab != clickedTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        // console.log("color changed");

        // if search tab is not active--->>>
        // this means we need to jump to search tab.
        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        // search se dusre pr jana h 
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // display weather, find local coordinates
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    // pass clicked tab
    switchTab(searchTab);
});


//check if cordinates are already present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    // if found, then render the weather of that location
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


// getting the weather details
async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    // show loader.
    // and remove grant-container.
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // call api
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        // showing info to screen
        renderWeatherInfo(data);
    }catch(err) {
        loadingScreen.classList.remove("active");
    }
}

// render the deatils got from previous function.
function renderWeatherInfo(weatherInfo) {
    // first we fetch the elements.
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");


    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;   
}



// getting current location.
function getLocation() {
    // if location found
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    // location not found
    else {
        alert("geolocation support not available");
        //HW - show an alert for no gelolocation support available
    }
}
// position mil jane pr, coords ko storage me set krdo.
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


// listener to grant access button
const grantAccessButton = document.querySelector("[data-grantAccess]");
// click krne pr, getLocation function pr jana h.
grantAccessButton.addEventListener("click", getLocation);




let searchInput = document.querySelector("[data-searchInput]")
// search function -------------------->>>>>>
searchForm.addEventListener("submit",(e)=> {
    e.preventDefault();
    let cityName = searchInput.value;

    // city nameis null.
    if(cityName === "")
        return;
    else 
        fetchSearchWeahterInfo(cityName);
});


// fetching from city name.
async function fetchSearchWeahterInfo(city) {
    // jab tak fetch na ho jaye.
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        // fetch ho jane ke baad
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}