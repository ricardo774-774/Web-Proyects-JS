const container = document.querySelector('.container');
const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');

window.addEventListener('load', () => {
    form.addEventListener('submit', searchWeather);
});

function searchWeather(e) {
    e.preventDefault();

    // Validation
    const city = document.querySelector('#ciudad').value;
    const country = document.querySelector('#pais').value;
    if (city.trim() === '' || country.trim() === '') {
        showError('Ambos campos son obligatorios');
        result;
    }

    // API Consult
    getLatLng(city, country);
}

function showError(message) {
    // Do not repeat alert
    const alert = document.querySelector('.bg-red-100');

    if (!alert) {
        // Alert Body
        const alert = document.createElement('div');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'px-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alert.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${message}</span>
        `;

        // Insert Alert
        container.appendChild(alert);

        // Delete Alert
        setTimeout(() => {
            alert.remove();
        }, 2000);
    }
}

// Consult Api OpenWeather By Coords
function consultApi(lng, lat) {
    const appId = '5b69a4fd3d9fa41a7daf9d6722f94c40';

    const url = `
        https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${appId}
    `;

    // Calling by show spinner
    spinner();

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // Calling by clean html
            cleanHtml();

            // Error Validation "not found"
            if (data.cod == "404") {
                showError('Ciudad no encontrada');
                return;
            }
            // Calling by show data
            showWeather(data);
        })
        .catch(err => console.log('OpenWeather Request Failed', err));
}

// Consult Api MapBox By Name
function getLatLng(city= '', country= '') {
    const appId = 'pk.eyJ1IjoicmljYXJkb3ZjIiwiYSI6ImNsZ2JmdDAydTAzY2IzcWxpaWliYXVlYnIifQ.8UbmFE7Wgi7ZWDa91TH3DQ';

    const url = `
        https://api.mapbox.com/geocoding/v5/mapbox.places/${city},${country}.json?access_token=${appId}
    `;

    fetch(url)
        .then(res => res.json())
        .then(data => consultApi(data.features[0].center[0], data.features[0].center[1]))
        .catch(err => console.log('MapBox Request Failed', err));
}

// Show Weather In Html
function showWeather(data){
    const { name, main: {temp, temp_max, temp_min} } = data;
    
    const celsius = kelvinToCelsius(temp);
    const max = kelvinToCelsius(temp_max);
    const min = kelvinToCelsius(temp_min);

    // Creating cityName 
    const cityName = document.createElement('p');
    cityName.textContent = `Clima desde ${name}`;
    cityName.classList.add('font-bold', 'text-2xl');

    // Creating current 
    const current = document.createElement('p');
    current.innerHTML = `${celsius} &#8451`;
    current.classList.add('font-bold', 'text-6xl');

    // Creating tempMax 
    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451`;
    tempMax.classList.add('text-xl');

    // Creating tempMin 
    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451`;
    tempMin.classList.add('text-xl');

    // Insert Elements In Div
    const divResult = document.createElement('div');
    divResult.classList.add('text-center', 'text-white');
    divResult.appendChild(cityName);
    divResult.appendChild(current);
    divResult.appendChild(tempMax);
    divResult.appendChild(tempMin);

    // Insert Div In Html
    result.appendChild(divResult);
}

// Convert Kelvin to Celsius
const kelvinToCelsius = temp => Math.round(temp - 273.15);

// Clear Html
function cleanHtml(){
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function spinner() {
    // Calling by clean html
    cleanHtml();
    
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    result.appendChild(divSpinner);
}