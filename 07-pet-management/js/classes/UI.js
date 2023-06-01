import { deleteAppointment, updateAppointment } from "../functions.js";
import { containerAppointments } from "../selectors.js";

class UI {

    printAlert(message, type){
        // Crear div alerta
        const divMessage = document.createElement('div');
        divMessage.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if (type === 'error') {
            divMessage.classList.add('alert-danger');
        } else {
            divMessage.classList.add('alert-success');
        }

        // Mensaje de error 
        divMessage.textContent = message;

        // Agregar al DOM
        document.querySelector('#contenido')
            .insertBefore(divMessage, document
            .querySelector('.agregar-cita'));
        
        // Quitar alerta
        setTimeout(() => {
            divMessage.remove();
        }, 3000);
    }

    printAppointment({appointments}){
        this.clearHTML();

        appointments.forEach(appointment => {
            const { pet, owner, celphone, date, hour, symptoms, id } = appointment;

            const divAppointment = document.createElement('div');
            divAppointment.classList.add('cita', 'p-3');
            divAppointment.dataset.id = id;

            // Scripting de los elementos de la cita
            const petElement = document.createElement('h2');
            petElement.classList.add('card-title', 'font-weight-bolder');
            petElement.textContent = pet;

            const ownerElement = document.createElement('p');
            ownerElement.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${owner}
            `;

            const celElement = document.createElement('p');
            celElement.innerHTML = `
                <span class="font-weight-bolder">Telefono: </span> ${celphone}
            `;

            const dateElement = document.createElement('p');
            dateElement.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${date}
            `;

            const hourElement = document.createElement('p');
            hourElement.innerHTML = `
                <span class="font-weight-bolder">Hour: </span> ${hour}
            `;

            const symptomsElement = document.createElement('p');
            symptomsElement.innerHTML = `
                <span class="font-weight-bolder">Sintomas: </span> ${symptoms}
            `;

            // Boton para eliminar la cita
            // svg añade un icono de x
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'mr-2');
            btnDelete.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
            btnDelete.onclick = () => deleteAppointment(id);

            // Boton para actualizar la cita
            const btnUpdate = document.createElement('button');
            btnUpdate.classList.add('btn', 'btn-info');
            btnUpdate.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>'
            btnUpdate.onclick = () => updateAppointment(appointment);


            // Agregar scripts a la cita
            divAppointment.appendChild(petElement);
            divAppointment.appendChild(ownerElement);
            divAppointment.appendChild(celElement);
            divAppointment.appendChild(dateElement);
            divAppointment.appendChild(hourElement);
            divAppointment.appendChild(symptomsElement);
            divAppointment.appendChild(btnDelete);
            divAppointment.appendChild(btnUpdate);

            // Agregar la cita al html
            containerAppointments.appendChild(divAppointment);
        })
    }

    // Hace que no se dupliquen las citas al añadir una nueva
    clearHTML(){
        while (containerAppointments.firstChild) {
            containerAppointments.removeChild(containerAppointments.firstChild);
        }
    }
}

export default UI;