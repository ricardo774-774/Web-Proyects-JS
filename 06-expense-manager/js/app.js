// ******** Variables And Selectors ******** //
const form = document.querySelector('#agregar-gasto');
const expenseList = document.querySelector('#gastos ul');


// ******** Events ******** //
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget);

    form.addEventListener('submit', addBudget);
}

// ******** Classes ******** //
class Budget {
    constructor(budget){
        this.budget = Number(budget);
        this.available = Number(budget);
        this.expenses = [];
    }

    newExpense(expense) {
        this.expenses = [...this.expenses ,expense];
        this.calculateRemaining();
    }

    calculateRemaining() {
        const spent = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        this.available = this.budget - spent;
    }

    deleteSpent(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id );
        this.calculateRemaining();
    }
}

class UI {
    insertBudget( amount ) {
        const { budget, available } = amount;

        // Adding HTML
        document.querySelector('#total').textContent = budget;
        document.querySelector('#restante').textContent = available;
    }

    printAlert(message, type) {
        // Create div 
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert');

        if (type === 'error') {
            divMessage.classList.add('alert-danger');
        } else {
            divMessage.classList.add('alert-success');
        }

        // Error Message
        divMessage.textContent = message;

        // Insert in HTML Error
        document.querySelector('.primario').insertBefore( divMessage, form );

        // Clear HTML Error
        setTimeout(() => {
            divMessage.remove();
        }, 2000)
    }

    showExpenseList(expenses){
        // Cleaning Html Li
        this.clearHTML();

        // Iterate over expenses
        expenses.forEach((expense) => {
            const { amount, name, id } = (expense);

            // Create Li
            const newExpense = document.createElement('li');
            newExpense.className = 'list-group-item d-flex justify-content-between aling-items-center';
            newExpense.dataset.id = id;

            // Add the html of the expense
            newExpense.innerHTML = `
                ${name} <span class="badge badge-primary badge-pill">$ ${amount} </span>
            `;

            // Create Button for Delete Expense
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnDelete.innerHTML = 'Borrar &times;';
            btnDelete.onclick = () => {
                deleteSpent(id);
            }
            newExpense.appendChild(btnDelete);

            // Add to HTML
            expenseList.appendChild(newExpense);
        })
    }

    clearHTML() {
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }

    updateAvailable(available) {
        document.querySelector('#restante').textContent = available;
    }

    checkBudget(budgetObj) {
        const { budget, available } = budgetObj;
        const availableDiv = document.querySelector('.restante');

        // Check available > 75%
        if ( (budget/4) > available ) {
            availableDiv.classList.remove('alert-success');
            availableDiv.classList.add('alert-danger');
        } 
        // Check available > 50%
        else if( (budget/2) > available ) {
            availableDiv.classList.remove('alert-success');
            availableDiv.classList.add('alert-warning');
        }
        // Revert danger or warning by success
        else {
            availableDiv.classList.remove('alert-danger', 'alert-warning');
            availableDiv.classList.add('alert-success');
        }
        // Check available > 100%
        if (available <= 0) {
            ui.printAlert('Presupuesto agotado', 'error');

            form.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// Instantiate
const ui = new UI();
let budget;

// ******** Functions ******** //
function askBudget() {
    const userBudget = prompt('¿Cual es el presupuesto de esta semana?');

    // Reload the page if data was incorrect.
    if (userBudget === '' || userBudget === null || isNaN(userBudget) || userBudget <= 0) {
        window.location.reload();
    }

    // Working with a valid budget
    budget = new Budget(userBudget);

    ui.insertBudget(budget);
}

function addBudget(e) {
    e.preventDefault();

    // Read data form
    const name = document.querySelector('#gasto').value;
    const amount = Number(document.querySelector('#cantidad').value);

    // Validations 
    if (name === '' || amount === '') {
        ui.printAlert('Ambos campos son obligatorios', 'error');
        return;
    } else if(amount <= 0 || isNaN(amount)) {
        ui.printAlert('Cantidad debe ser un número mayor a 0', 'error');
        return;
    }

    // Generate an object of type expenses
    const expense = { name, amount, id: Date.now() };

    // Add a new expense
    budget.newExpense(expense);

    // Add a message of successful process
    ui.printAlert('Agregado Correctamente');

    // Print expenses and available
    const { expenses, available } = budget;
    ui.showExpenseList(expenses);
    ui.updateAvailable(available);
    ui.checkBudget(budget);

    // Cleaning input form
    form.reset();
}

function deleteSpent(id) {
    // Delete expenses of class
    budget.deleteSpent(id);

    // Delete expenses of Html
    const { expenses, available } = budget;
    ui.showExpenseList(expenses);

    // Update available
    ui.updateAvailable(available);
    ui.checkBudget(budget);
}