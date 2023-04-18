// Variables
const brand = document.querySelector('#marca');
const year = document.querySelector('#year');
const minPrice = document.querySelector('#minimo');
const maxPrice = document.querySelector('#maximo');
const doors = document.querySelector('#puertas');
const color = document.querySelector('#color');
const transmision = document.querySelector('#transmision');

const result = document.querySelector('#resultado');

const maxYear = new Date().getFullYear();
const minYear = maxYear - 10;

const searchData = {
    brand: '',
    maxPrice: '',
    minPrice: '',
    year:'',
    doors: '', 
    color: '',
    transmission: ''
}

// Events
document.addEventListener('DOMContentLoaded', () => {
    // show cars when website is ready
    showCars(cars);

    // Fill the options with years
    fillSelect();
});

brand.addEventListener('change', (e) => {
    searchData.brand = e.target.value;
    filterCars();
});

year.addEventListener('change', (e) => {
    searchData.year = e.target.value;
    filterCars();
});

minPrice.addEventListener('change', (e) => {
    searchData.minPrice = e.target.value;
    filterCars();
});

maxPrice.addEventListener('change', (e) => {
    searchData.maxPrice = e.target.value;
    filterCars();
});

doors.addEventListener('change', (e) => {
    searchData.doors = e.target.value;
    filterCars();
});

transmision.addEventListener('change', (e) => {
    searchData.transmission = e.target.value;
    filterCars();
});

color.addEventListener('change', (e) => {
    searchData.color = e.target.value;
    filterCars();
});

// Functions
function showCars(cars) {
    cleanHtml();

    cars.forEach(car => {
        const { brand, model, year, price, doors, color, transmission } =  car;
        const carHTML = document.createElement('p');

        carHTML.textContent = `
            ${brand} ${model} - ${year} - ${price} - Color: ${color} -  Puertas: ${doors} -  Transmision: ${transmission}
        `;

        // Insert into Html
        result.appendChild(carHTML);
    });
}

function cleanHtml() {
    while(result.firstChild){
        result.removeChild(result.firstChild);
        console.log('removing')
    }
}

function fillSelect() {
    for (let i = maxYear; i >= minYear; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        year.appendChild(option);
    }
}

function filterCars() {
    const result = cars
      .filter(filterBrand)
      .filter(filterYear)
      .filter(filterMinPrice)
      .filter(filterMaxPrice)
      .filter(filterDoors)
      .filter(filterTransmission)
      .filter(filterColor);

    showCars(result);

    carsNotFound(result);
}

function filterBrand(car) {
    const { brand } = searchData;
    if( brand ) {
        return car.brand === brand;
    }
    return car;
}

function filterYear(car) {
    const { year } = searchData;
    if( year ) {
        return car.year === Number(year);
    }
    return car;
}

function filterMinPrice(car) {
    const { minPrice } = searchData;
    if( minPrice ) {
        return car.price >= minPrice;
    }
    return car;
}

function filterMaxPrice(car) {
    const { maxPrice } = searchData;
    if( maxPrice ) {
        return car.price <= maxPrice;
    }
    return car;
}

function filterDoors(car) {
    const { doors } = searchData;
    if( doors ) {
        return car.doors === Number(doors);
    }
    return car;
}

function filterTransmission(car) {
    const { transmission } = searchData;
    if( transmission ) {
        return car.transmission === transmission;
    }
    return car;
}

function filterColor(car) {
    const { color } = searchData;
    if( color ) {
        return car.color === color;
    }
    return car;
}

function carsNotFound(cars) {
    if(cars.length == 0) {
        const NotFound = document.createElement('p');
        NotFound.textContent = 'Por el momento no hay carros con esas características';
        NotFound.classList.add('alerta', 'error');

        // Insert into Html
        result.appendChild(NotFound);
    }
}