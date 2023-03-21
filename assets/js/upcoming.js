// URL de la API
const urlApi = "https://mindhub-xj03.onrender.com/api/amazing";

let infoEvents;
let currentDate;

// Función asíncrona para obtener la información de la API y llamar a la función upcomingInitializer()
async function getInfo() {

    try {
        const info = await fetch(urlApi)
            .then(response => response.json())
            .then(data => data);

        infoEvents = info.events;
        currentDate = info.currentDate;
        upcomingInitializer();

    } catch (error) {
        console.log(error);
    }
}

// Llamando a la función getInfo() para obtener la información de la API
getInfo();

// Función que se encarga de procesar la información obtenida y mostrarla
function upcomingInitializer () {

  // Obteniendo elementos del DOM
  const cardEvent = document.getElementById("cardEvent");
  const categoriesCheckBox = document.getElementById("categoryEvent");
  const searchEvent = document.getElementById("searchEvent");
//   const btnClear = document.getElementById("btnClear");

  categoriesCheckBox.innerHTML = createCategories(categoryEvent(infoEvents));

  const checkboxes = document.querySelectorAll(".form-check-input");


  // Creando las tarjetas de los eventos
  function createNewCards(data) {
      let newCards = "";
      for (const event of data) {
        if(currentDate < event.date){
          newCards += `
          <div class="col">
            <div class="card h-100 p-3">
              <img src="${event.image}" class="card-img-top" alt="${event.name}">
              <div class="card-body">
                <h5 class="card-title">${event.name}</h5>
                <p class="card-text">${event.description}</p>
              </div>
              <div class="card-footer d-inline-flex justify-content-around">
                <div class="d-flex align-items-center">
                  <span><i class="bi bi-tags"></i> Price: $${event.price}</span>
                </div>
                <a href="./details.html?id=${event._id}" class="btn text-white">More Info</a>
              </div>
            </div>
          </div>
          `;
        }
      }
      return newCards;

  }

  cardEvent.innerHTML = createNewCards(infoEvents);

  // Obteniendo las categorías de los eventos
  function categoryEvent(events) {
      let categories = [];
      for (const item of events) {
          if (!categories.includes(item.category)) {
              categories.push(item.category);
          }
      }
      return categories;
  }

  // Crear los elementos de categoría con sus respectivos checkboxes
  function createCategories(categories) {
      return categories.map((category, index) => `
        <div>
          <input class="form-check-input" type="checkbox" name="category${index + 1}" id="category${index + 1}" value="${category}">
          <label for="category${index + 1}">${category}</label>
        </div>
      `).join("");
    }

  function checkedCategoriesClick() {
      const paramSearched = document.getElementById("searchEvent");
      const checkedCategories = getCheckedCategories(checkboxes);
      let cardsHtml;
    
      const filteredCards = getFilter(checkedCategories, paramSearched.value);
    
      cardsHtml = createNewCards(filteredCards);
      
      cardEvent.innerHTML = cardsHtml;
  }
    
  categoriesCheckBox.addEventListener("click", checkedCategoriesClick);
    
  function searchBar() {
    const paramSearched = document.getElementById("searchEvent");
    const checkedCategories = getCheckedCategories(checkboxes);
    
    const filteredCards = getFilter(checkedCategories, paramSearched.value);
    
    let cardsHtml;
    
    if (filteredCards.length === 0) {
      alert("Sorry, we couldn't find events matching your search");
    } else {
      cardsHtml = createNewCards(filteredCards);
      cardEvent.innerHTML = cardsHtml;
    }
  }

  searchEvent.addEventListener("keyup", searchBar);
    
  // Obteniendo las categorías seleccionadas
  function getCheckedCategories(checkboxes) {
      let categories = [];
      checkboxes.forEach(item => {
          if (item.checked) {
              categories.push(item.value);
          }
      })
      return categories;
  }

  // Filtrando los eventos por categorías y por nombre
  function getFilter(checkedCategories, searchParams) {
      let cardsFiltered = infoEvents;
    
      if (checkedCategories.length > 0) {
        cardsFiltered = infoEvents.filter(function(event) {
          return checkedCategories.includes(event.category);
        });
      }
    
      if (searchParams.value !== "") {
        cardsFiltered = cardsFiltered.filter(function(event) {
          return event.name.toLowerCase().indexOf(searchParams.trim().toLowerCase()) !== -1;
        });
      }
    
      return cardsFiltered;
  }
}


// *************************************  IMPORTANTE  *************************************
// LA IDEA ES CREAR UN BOTON PARA RESETEAR LOS PARAMETROS DE BUSQUEDA A CERO, PERO ME QUEDÉ
// A MEDIO CAMINO (funciona pero a la vez "ROMPE") LO DESARROLLARÉ MÁS ADELANTE...
//
//    // Función "borrar parámetros de búsqueda completa"
//    function clearSearchAll() {
//     if (categoriesCheckBox != 0 && searchEvent != 0) {
//         cardEvent.innerHTML = createNewCards(infoEvents);
//         categoriesCheckBox.innerHTML = createCategories(categoryEvent(infoEvents));
//         searchEvent.value = "";
//     }
//   }

//   btnClear.addEventListener("click", clearSearchAll);