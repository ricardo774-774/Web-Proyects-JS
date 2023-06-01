const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');
const paginationDiv = document.querySelector('#paginacion');
const records = 40;
let totalPages;
let iterator;
let currentPage = 1;

window.onload = () => {
    form.addEventListener('submit', validateForm);
}

// Validation
function validateForm(e){
    e.preventDefault();

    // Not empty
    const searchTerm = document.querySelector('#termino').value;
    if (searchTerm === '') {
        // Do not pass validtaion
        showAlert('Busqueda Vacía');
        return;
    }

    // Pass validtaion
    searchImages();
}

// Show Alerts
function showAlert(message){
    // Do not repeat alert
    const alert = document.querySelector('.bg-red-100');

    if (!alert) {
        // Alert Body
        const alert = document.createElement('DIV');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'px-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alert.innerHTML = `
            <strong class="font-bold">ERROR</strong>
            <span class="block">${message}</span>
        `;

        // Insert Alert
        form.appendChild(alert);

        // Delete Alert
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Search images
function searchImages(){
    const term = document.querySelector('#termino').value;

    const key = '36922610-9f8fdd75efb03b6f7725255cb';
    const url =`https://pixabay.com/api/?key=${key}&q=${term}&per_page=${records}&page=${currentPage}`;

    fetch(url)
        .then((data) => data.json() )
        .then((result) => {
            // Call pagination number
            totalPages = pagination(result.totalHits);
            // Call for show images
            showImage(result.hits);
        });
    
    // Gettin new value
    iterator = createPaginator(totalPages);
}

// Show Images
function showImage(images){
    // Clear result
    clearHtml(result);

    // Iteration image[]
    images.forEach(image => {
        // Destructuring
        const { previewURL, likes, views, largeImageURL } = image;

        // Creating body card and put in html
        result.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light">Me Gusta</span> </p>
                        <p class="font-bold"> ${views} <span class="font-light">Vistas</span> </p>
                        <a 
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded hover:font-bold p-1 mt-5" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        href=${largeImageURL}>
                            Ver Imagen HD
                        </a>
                    </div>
                </div>
            </div>
        `;
    })

    printPaginator();
}

// Pagination
function pagination(total){
    return parseInt(Math.ceil(total / records));
}

// Generator
function *createPaginator(total){
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

// Print paginator
function printPaginator(){
    // Clear pagination html
    clearHtml(paginationDiv);

    iterator = createPaginator(totalPages);
    while(true){
        const { value, done } = iterator.next();
        if (done) return;

        const button = document.createElement('A');
        button.href = '#';
        button.dataset.pagina = value;
        button.textContent = value;
        button.classList.add('siguiente','bg-yellow-400', 'px-4','py-1', 'mx-3', 'font-bold', 'mb-4', 'rounded', 'hover:bg-yellow-500');
        
        button.onclick = () => {
            currentPage = value;
            searchImages();
        }
        
        paginationDiv.appendChild(button);
    }
}

// Clear Html
function clearHtml(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}