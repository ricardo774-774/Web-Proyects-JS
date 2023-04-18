const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

function cargarEventListeners() {
    // evento generado al precionar dentro del div
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos  del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Muestra los cursos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];
        carritoEnPantalla(articulosCarrito);
    })

    // Vaciar cursos  del carrito
    // En este mismo espacio ya que es poco codigo
    vaciarCarritoBtn.addEventListener('click', () => {
        // Seting el carrito
        articulosCarrito = [];

        // Eliminamos el HTML
        limpiarHTML();
    });
}
cargarEventListeners();

function agregarCurso(e) {
    // no mandarme a ningun enlace despues de presionar
    // en enlace que contiene a "agregarCurso"
    e.preventDefault();

    // limitar del div completo al a "agregarCurso"
    if(e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito 
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id')

        // Elimina del arreglo (articulosCarrito) por el id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
        
        // Iterar sobre el carrito y mostrar su html
        carritoEnPantalla(articulosCarrito);
    }
}

// Lee el contenido del HTML al que le damos click
// y extrae  la informacion del curso
function leerDatosCurso(curso) {

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisar si un producto ya esta en carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe) {
        // Actualizando elementos al carrito 
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; //retorna objeto actualizado
            } else {
                return curso; //retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [ ...cursos ];
    } else {
        // Agregando elementos al carrito 
        articulosCarrito = [ ...articulosCarrito, infoCurso ];
    }

    carritoEnPantalla(articulosCarrito);
}

// Mostrar carrito en el HTML
function carritoEnPantalla(cursos) {

    // Limpiar el Html,
    // ya que el contenedorCarrito.appendChild(row)
    // añadirá nuevamente los ya seleccionados
    limpiarHTML();
    // Recorriendo el carrito y generando el Html
    cursos.forEach(curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}">
            </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        // Agregando HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Agregar al storage
    synchronizeStorage();
}

function synchronizeStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML() {
    // Forma lenta:
    // contenedorCarrito.innerHTML = '';

    // Forma rapida:
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}



