// ********** Constructors ********** //
function Insurance(brand, year, type) {
    this.brand = brand;
    this.year = year;
    this.type = type;
}

// Does quoted with data
Insurance.prototype.quotedInsurance = function() {
    /*
     1 = Americano 1.15
     2 = Asiatico 1.05
     3 = Europeo 1.35 
    */

    let amount;
    const base = 2000;

    switch (this.brand) {
        case '1':
            amount = base * 1.15;
            break;
        case '2':
            amount = base * 1.05;
            break;
        case '3':
            amount = base * 1.35;
            break;
        default:
            break;
    }

    // Read year
    const difference = new Date().getFullYear() - this.year;

    // Each year that the difference is greater, 
    // the cost will be reduced by 3%
    amount -= ((difference * 3) / 100);  

    /*
      If the insurance is basic, it is multiplied by 30% more
      If the insurance is complete, it is multiplied by 50% more
    */

    if (this.type === 'basico') {
        amount *= 1.3;
    } else {
        amount *= 1.5;
    }

    return amount;
}

function UserInterface() {}

// Fill Options Of Year
UserInterface.prototype.fillOptions = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Show error alerts
UserInterface.showMessage = function(message, type) {
    const div = document.createElement('div');

    if (type === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('message', 'mt-10');
    div.textContent = message;

    // Insert in HTML
    const form = document.querySelector('#cotizar-seguro');
    form.insertBefore(div, document.querySelector('#resultado'));

    // Delete error message
    setTimeout(() => {
        div.remove();
    }, 2000);
}

UserInterface.prototype.showResult = function(total, insurance) {

    const { brand, year, type } = insurance;

    let textBrand;

    switch (brand) {
        case '1':
            textBrand = 'Americano';
            break;
        case '2':
            textBrand = 'Asiatico';
            break;
        case '3':
            textBrand = 'Europeo';
            break;
        default:
            break;
    }

    // Create result 
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textBrand} </span> </p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span> </p>
        <p class="font-bold">Seguro: <span class="font-normal capitalize"> ${type} </span> </p>
        <p class="font-bold">Total: <span class="font-normal"> $${total} </span> </p>
    `;

    const resultDiv = document.querySelector('#resultado');

    // Show the spinner
    const spinner = document.querySelector('#cargando')
    spinner.style.display = 'block';

    setTimeout(() => {

        // Delete spinner
        spinner.style.display = 'none';

        // Insert result invoice
        resultDiv.appendChild(div);
    }, 3000)
}

// Instantiate UserInterface
const ui = new UserInterface();

// ********** Events ********** //
document.addEventListener('DOMContentLoaded', () => {
    ui.fillOptions();
})

eventListeners();
function eventListeners() {
    const form = document.querySelector('#cotizar-seguro');
    form.addEventListener('submit', quoteInsurance);
}

function quoteInsurance(e) {
    e.preventDefault();

    // Read selected brand
    const brand = document.querySelector('#marca').value;

    // Read selected year
    const year = document.querySelector('#year').value;

    // Read selected type
    const type = document.querySelector('input[name="tipo"]:checked').value;

    if (brand === '' || year === '' || type === '') {
        UserInterface.showMessage('Todos los campos son obligatorios', 'error');
        return;
    }

    UserInterface.showMessage('Cotizando...', 'exito');

    // Hide previous quotes
    const results = document.querySelector('#resultado div');
    if (results != null) {
        results.remove();
    }

    // Instantiate Insurance
    const insurance = new Insurance(brand, year, type);
    const total = insurance.quotedInsurance();

    // Use the prototype what is going to be quoted
    ui.showResult(total, insurance);
}


