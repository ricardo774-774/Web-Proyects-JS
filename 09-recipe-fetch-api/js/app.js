function main() {
    const result = document.querySelector('#resultado');
    const modal = new bootstrap.Modal('#modal',{});

    const selectCategories = document.querySelector('#categorias');

    if (selectCategories) {   
        selectCategories.addEventListener('change', getRecipes);
        getCategories();
    }
    const favDiv = document.querySelector('.favoritos');
    if (favDiv) {
        getFavorites();
    }

    // Geting Categories By Api
    function getCategories(){
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php'
        fetch(url)
            .then(response => response.json())
            .then(result => showCategories(result.categories))
            .catch(err => console.log('Error loading external api', err));
    }


    function showCategories(categories = []){
        // Iterating response from api
        categories.forEach(category => {
            // Create Elements OPTION
            const { strCategory } = category;
            const option = document.createElement('OPTION');
            option.value = strCategory;
            option.textContent = strCategory;

            // Insert in Html Option
            selectCategories.appendChild(option);
        });
    }

    // Geting Recipes By Api
    function getRecipes(e){
       const category = e.target.value;
       const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
       fetch(url)
            .then(response => response.json())
            .then(result => showRecipes(result.meals))
            .catch(err => console.log('Error loading external api', err));
    }


    function showRecipes(recipes = []) {
        // Clean Html
        cleanHtml(result);

        // Heading Result Element H2
        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recipes.length ? 'Results' : 'No Results'
        result.appendChild(heading);

        // Iterating response from api
        recipes.forEach(recipe => {
            const { idMeal, strMeal, strMealThumb} = recipe;

            // Create Element Container
            const containerRecipe = document.createElement('DIV');
            containerRecipe.classList.add('col-md-4');

            // Create Element Card
            const recipeCard = document.createElement('DIV');
            recipeCard.classList.add('card', 'mb-4');

            // Create Element Img
            const recipeImg = document.createElement('IMG');
            recipeImg.classList.add('card-img-top');
            recipeImg.alt = `Imagen de la receta ${strMeal}`;
            recipeImg.src = strMealThumb ?? recipe.img;

            // Create Element Card Body
            const recipeCardBody = document.createElement('DIV');
            recipeCardBody.classList.add('card-body');

            // Create Element Heading
            const recipeHeading = document.createElement('H3');
            recipeHeading.classList.add('card-title', 'mb-3');
            recipeHeading.textContent = strMeal ?? recipe.title;

            // Create Element Button
            const recipeButton = document.createElement('BUTTON');
            recipeButton.classList.add('btn', 'btn-danger', 'w-100');
            recipeButton.textContent = 'Get Recipe';
            recipeButton.onclick = () => {
                selectedRecipe(idMeal ?? recipe.id);
            }

            // Struct of Card
            recipeCardBody.appendChild(recipeHeading);
            recipeCardBody.appendChild(recipeButton);
            recipeCard.appendChild(recipeImg);
            recipeCard.appendChild(recipeCardBody);
            containerRecipe.appendChild(recipeCard);

            // Insert in Html
            result.appendChild(containerRecipe);
        });
    }

    function selectedRecipe(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch(url)
            .then(response => response.json())
            .then(result => showRecipeModal(result.meals[0]))
            .catch(err => console.log('Error loading external api', err));
    }

    function showRecipeModal(recipe) {
        const { idMeal, strInstructions, strMeal, strMealThumb } = recipe;

        // Add content to Modal
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
            <h3 class="my-3">Instructions</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredients & Quantities</h3>
        `;

        // Creating list ul
        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group');

        // Filter Ingredients
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                const ingredient = recipe[`strIngredient${i}`];
                const quantitie = recipe[`strMeasure${i}`];

                const ingredientList = document.createElement('LI');
                ingredientList.classList.add('list-group-item');
                ingredientList.textContent = `${ingredient} - ${quantitie}`;

                // Add li to ul
                listGroup.appendChild(ingredientList);
            }
        }
        // Add ul to html
        modalBody.appendChild(listGroup);

        // Getting modal footer
        const modalFooter = document.querySelector('.modal-footer');

        // Cleaning html buttons 
        cleanHtml(modalFooter);

        // Button save fav ...
        const btnFav = document.createElement('BUTTON');
        btnFav.classList.add('btn', 'btn-danger', 'col');
        // textContent depends of storage
        btnFav.textContent = existStorage(idMeal) ? 'Delete Favorite' : 'Save Favorite';

        // localstorage 
        btnFav.onclick = () => {

            // Call not repeat storage
            if (existStorage(idMeal)) {
                // If repeat, call to delete
                deleteFavorite(idMeal);
                // Change text button in "real time"
                btnFav.textContent = 'Save Favorite';
                showToast('Deleted Correctly');
                return;
            }

            // Body localstorage {}
            addFavorite({
                id: idMeal,
                title: strMeal,
                img: strMealThumb
            });

            // Change text button in "real time"
            btnFav.textContent = 'Delete Favorite';
            showToast('Added Correctly');
        }

        // Button close 
        const btnClose = document.createElement('BUTTON');
        btnClose.classList.add('btn', 'btn-secondary','col');
        btnClose.textContent = 'Close';

        // Closing Modal
        btnClose.onclick = () => {
            modal.hide();
        }

        // Adding html buttons
        modalFooter.appendChild(btnFav);
        modalFooter.appendChild(btnClose);

        // Muestra el modal
        modal.show();
    }

    // Add Fav to LocalStorage 
    function addFavorite(recipe){
        // If not exist favotites, use []
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]));
    }

    // Delete Fav to LocalStorage 
    function deleteFavorite(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        const favUpdated = favorites.filter(fav => fav.id !== id);
        localStorage.setItem('favorites', JSON.stringify(favUpdated));
    }

    // Do not repeat objects in storage
    function existStorage(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        return favorites.some(fav => fav.id == id);
    }

    // Alert Message
    function showToast(message) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = message;
        toast.show();
    }

    // Get from localstorage
    function  getFavorites(){
        const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
        if(favorites.length){
            showRecipes(favorites);
            return;
        } 
        const notFavorites = document.createElement('P');
        notFavorites.textContent = 'Not Favorites Yet'
        notFavorites.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        favDiv.appendChild(notFavorites);
    }

    // Clean Html
    function cleanHtml(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

}

// Start Project
document.addEventListener('DOMContentLoaded', main);