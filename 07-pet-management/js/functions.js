import  UI  from "./classes/UI.js";
import Appointments from "./classes/Appointments.js";

import { 
    petInput,
    ownerInput,
    celInput,
    dateInput,
    hourInput,
    symptomsInput,
    form
} from "./selectors.js";

const ui = new UI();
const appointmentsManage = new Appointments();

// Variable "modo editando"
let updating;

// Objeto con la información de la cita
const appointmentObj = {
    pet: '',
    owner: '',
    celphone: '',
    date: '',
    hour: '',
    symptoms: ''
}

// Agrega los datos de la cita html al appointmentObj
// Para que esto funcione el input del html seleccionado
// tiene que tener la propiedad "name"
export  function appointmentData(e) {
    appointmentObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de citas
export function newAppointment(e) {
    e.preventDefault();

    // Extrae info del objeto de cita
    const { pet, owner, celphone, date, hour, symptoms } = appointmentObj;

    // Validar
    if ( pet === '' || owner === '' || celphone === '' || date === '' || hour === '' || symptoms === '' ) {
        ui.printAlert('Todos los campos son obligatorios', 'error');

        return;
    }

    if (updating) {
        // Mensaje de actualizado 
        ui.printAlert('Actualizado correctamente');

        // Pasa el objeto de la cita a edición
        appointmentsManage.updateAppointment({...appointmentObj});

        // Regresando boton "crear" a la normalidad
        form.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        // Desactivando modo edición
        updating = false;

    } else {
        // Generando un id unico
        appointmentObj.id = Date.now();

        // Creando una nueva cita
        appointmentsManage.addAppointment({...appointmentObj});

        // Mensaje de agregado 
        ui.printAlert('Se agregó correctamente');
    }

    cleanObject();

    // Limpiando formulario
    form.reset();

    // Mostrar HTML de las citas
    ui.printAppointment(appointmentsManage);
}

// Limpia {} appointmentObj
export function cleanObject() {
    appointmentObj.pet = '';
    appointmentObj.owner = '';
    appointmentObj.celphone = '';
    appointmentObj.date = '';
    appointmentObj.hour = '';
    appointmentObj.symptoms = '';
}


export function deleteAppointment(id){
    // Elimina una cita
    appointmentsManage.deleteAppointment(id);

    // Mensaje de eliminado
    ui.printAlert('Cita eliminada exitosamente');

    // Refresca las citas
    ui.printAppointment(appointmentsManage);
}

// Carga los datos y modo edicion
export function updateAppointment(appointment) {
    const { pet, owner, celphone, date, hour, symptoms, id } = appointment;

    // Llena los inputs
    petInput.value = pet;
    ownerInput.value = owner;
    celInput.value = celphone;
    dateInput.value = date;
    hourInput.value = hour;
    symptomsInput.value = symptoms;

    // Llenar el objeto
    appointmentObj.pet = pet;
    appointmentObj.owner = owner;
    appointmentObj.celphone = celphone;
    appointmentObj.date = date;
    appointmentObj.hour = hour;
    appointmentObj.symptoms = symptoms;
    appointmentObj.id = id;


    // Cambiar texto del boton "crear cita"
    form.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    // Activando modo edicion
    updating = true;
}