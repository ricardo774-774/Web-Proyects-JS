import {
    criptoSelected,
    currencySelected,
    form,
    result,
} from './selectors.js'
import { dataSelected } from "./vars.js";

// Controll Request Promise
const controllReq = criptos => new Promise((resolve, reject) => {
    resolve(criptos);
});

// Get cripto name
const getCriptoName = (criptos) => {
    criptos.forEach((cripto) => {
        const { FullName, Name } = cripto.CoinInfo;

        // Creating elements option 
        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        // Insert option in Html
        criptoSelected.appendChild(option)
    });
}

// Show Alert Error
const showAlert = (message) => {
    // Call Clear html
    cleanHtml();

    // Select Alert
    const alert = document.querySelector('.error');

    // Do not Repeat Alert
    if (!alert) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('error');
        alertDiv.textContent = message;

        // Insert alert in Html
        form.appendChild(alertDiv);

        // Delete Alert
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

//  Get quote from api
const criptoResults = () => {
    // Spinner time Loading 
    showSpinner();

    const { currency, cripto } = dataSelected;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${currency}`;

    fetch(url)
        .then(response => response.json())
        .then(result => controllReq(result))
        .then(criptos => showQuote(criptos.DISPLAY[cripto][currency]));
}

// Create and Show Results In Html
const showQuote = (quote) => {
    // Call Clear Html
    cleanHtml();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quote;

    // Creating html elements
    const price = document.createElement('P');
    price.classList.add('precio');
    price.innerHTML = `Precio Actual: <span>${PRICE}</span>`;

    const highday = document.createElement('P');
    highday.innerHTML = `Precio más Alto del Día: <span>${HIGHDAY}</span>`;

    const lowday = document.createElement('P');
    lowday.innerHTML = `Precio más Bajo del Día: <span>${LOWDAY}</span>`;

    const changepct24hour = document.createElement('P');
    changepct24hour.innerHTML = `Variación Últimas 24 horas: <span>${CHANGEPCT24HOUR}</span> %`;

    const lastupdate = document.createElement('P');
    lastupdate.innerHTML = `Última Actualización: <span>${LASTUPDATE}</span>`;

    // Insert Elements In Html
    result.appendChild(price);
    result.appendChild(highday);
    result.appendChild(lowday);
    result.appendChild(changepct24hour);
    result.appendChild(lastupdate);
}


// Clean Html Result
const cleanHtml = () => {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

// Show Spinner
const showSpinner = () => {
    // Call clean html
    cleanHtml();

    const spinner = document.createElement('DIV');
    spinner.classList.add('sk-chase');
    spinner.innerHTML = `
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;

    result.appendChild(spinner);
}

// Get Value Selected
export const getValue = () => {
    dataSelected.cripto = criptoSelected.value;
    dataSelected.currency = currencySelected.value;
}

// Submit form
export const submitForm = (e) => {
    e.preventDefault();

    // Validation form
    const { currency, cripto } = dataSelected;
    if (currency === '' || cripto === '') {
        showAlert('Selecciona todos los valores');
    }

    // Cosult api with values selected
    criptoResults();
}

// Consult Cripto API
export const criptoConsult = () => {
    const url = 'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD';

    fetch(url)
        .then(response => response.json())
        .then(result => controllReq(result.Data))
        .then(criptos => getCriptoName(criptos));
}