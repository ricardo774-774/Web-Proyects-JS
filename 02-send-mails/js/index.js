// DOMContentLoaded: Se ejecuta cuando el html ha 
// sido descargado
document.addEventListener('DOMContentLoaded', function() {

    const email = {
        email: '',
        asunto: '',
        mensaje: '',
    }

    // Seleccionar los elementos //
    const inputEmail = document.querySelector('#email');
    const inputCC = document.querySelector('#CC');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const formulario = document.querySelector('#formulario');
    const btnSubmit = document.querySelector('#formulario button[type="submit');
    const btnReset = document.querySelector('#formulario button[type="reset');
    const spinner = document.querySelector('#spinner');

    // Eventos con callbacks//
    /* 
    Evento blur detecta que cuando el mause 
    esta dentro y se sale del input precionando en
    otro lado. (Ideal para validaciones al salir del input). 
    */

    // Eventos con funciones//
    /*
    La funcion validar se pone sin () para que se mande a llamar 
    solo caundo suceda el evento y no antes.
    */
    inputEmail.addEventListener('blur', validar);
    inputCC.addEventListener('blur', aplicarCC);
    inputAsunto.addEventListener('blur',  validar);
    inputMensaje.addEventListener('blur',  validar);

    formulario.addEventListener('submit', enviarMensaje);

    btnReset.addEventListener('click', function(e) {
        e.preventDefault();
        confimarEliminar();
        comprobarInfo();
    });

    function enviarMensaje(e) {
        e.preventDefault();

        spinner.classList.add('flex');
        spinner.classList.remove('hidden');

        setTimeout(() => {
            spinner.classList.remove('flex');
            spinner.classList.add('hidden');

            resetFormulario();
            comprobarInfo();

            const alertaExito = document.createElement('p');
            alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'font-bold', 'text-sm', 'uppercase',);
            alertaExito.textContent = 'Mensaje enviado correctamente';

            formulario.appendChild(alertaExito);

            setTimeout(() => {
               alertaExito.remove(); 
            }, 3000)

        }, 3000);
    }

    function validar (e) {
        // trim() para eliminar los espacios en blanco
        if(e.target.value.trim() === "") {
            // e.target.id contiene cual es el campo con el error
            // e.target.parentElement contiene la ubicacion 
            // donde insertaremos el error
            // el return detendra el codigo para que impida la ejecucion
            // si es que existe error, sino pasara a la funcion : limpiarAlerta();
            mostrarAlerta(`Campo ${e.target.id} es obligatorio`, e.target.parentElement);
            email[e.target.name] = "";
            comprobarInfo();
            return;
        } 
        if (e.target.id === 'email' && !validarEmail(e)) {
            mostrarAlerta(`${e.target.id} invalido`, e.target.parentElement);
            email[e.target.name] = "";
            comprobarInfo();
            return;
        }

        limpiarAlerta(e.target.parentElement);

        // Asignar los valores despues de las validaciones.
        email[e.target.name] = e.target.value.trim().toLowerCase();

        // Activar boton y color
        comprobarInfo(); 
    }

    function aplicarCC (e) {
        if(e.target.value.trim() !== "") {
            if (!validarEmail(e)) {
                mostrarAlerta(`${e.target.id} invalido`, e.target.parentElement);
                email[e.target.name] = "";
                comprobarInfo();
                return;
            }

            limpiarAlerta(e.target.parentElement);
            email[e.target.name] = e.target.value.trim().toLowerCase();
            comprobarInfo(); 
            console.log(email);
        }
    }

    function mostrarAlerta(alert, reference) {
        // Mostrar solo 1 alerta de error
        // Llamar a limpiarAlerta
        limpiarAlerta(reference);

        // Generando alerta con HTML
        const error = document.createElement('P');
        error.textContent = `${alert}`;
        error.classList.add('error-validation');

        // Insertar error en el form
        reference.appendChild(error);
    }

    // limpiador de alertas
    function limpiarAlerta(reference) {
        const alert = reference.querySelector('.error-validation');
        if(alert) alert.remove();
    }

    function validarEmail(email) {
        // Esto es una expresion regular, buscará que se 
        // cumplan las caracteristicas de un mail.
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(email.target.value)
    }

    function comprobarInfo() {
        if(Object.values(email).includes('')) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            return;
        } 
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
        console.log(email);
    }

    function confimarEliminar() {
        const eliminar = confirm('¿Seguro de apliacar reset?');
        if (eliminar) {
            resetFormulario();
            return;
        } 
    }

    function resetFormulario() {
        email.email = '';
        email.asunto = '';
        email.mensaje = '';

        formulario.reset();
    }

});