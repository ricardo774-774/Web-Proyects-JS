import { 
    criptoConsult,
    submitForm,
    getValue
 } from './functions.js';
import { 
    criptoSelected,
    currencySelected,
    form,
 } from "./selectors.js";

document.addEventListener('DOMContentLoaded', () => {
    criptoConsult();

    form.addEventListener('submit', submitForm);

    currencySelected.addEventListener('change', getValue);

    criptoSelected.addEventListener('change', getValue);

});