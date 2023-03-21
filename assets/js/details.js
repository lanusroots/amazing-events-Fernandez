const queryString = location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

// URL de la API
const urlApi = "https://mindhub-xj03.onrender.com/api/amazing";

let infoEvents;
let currentDate;

// Función asíncrona para obtener la información de la API y llamar a la función detailsInitializer()
async function getInfo() {

    try {
        const info = await fetch(urlApi)
            .then(response => response.json())
            .then(data => data);

        infoEvents = info.events;
        currentDate = info.currentDate;
        detailsInitializer();

    } catch (error) {
        console.log(error);
    }
}

// Llamando a la función getInfo() para obtener la información de la API
getInfo();

// Función que se encarga de procesar la información obtenida y mostrarla
function detailsInitializer () {

  const eventDetail = infoEvents.find((event) => event._id == id);

  const cardDetails = document.getElementById("cardDetails");

  card = `
  <div class="col-md-6">
    <img src="${eventDetail.image}" class="img-fluid w-100 rounded-start" alt="..." />
  </div>
  <div class="col-md-6">
    <div class="card-body text-center">
      <h5 class="card-title fs-1">${eventDetail.name}</h5>
      <p class="card-text pb-5">${eventDetail.description}!</p>
      <div class="d-flex flex-wrap flex-column flex-sm-row">
        <div class="d-flex text-center justify-content-center align-items-center card-text col-sm-6">
          <i class="bi bi-star-fill text-customized fs-1 pe-2"></i>
          <span class="col-7">Category: ${eventDetail.category}</span>
        </div>
        <div class="d-flex text-center justify-content-center align-items-center card-text col-sm-6">
          <i class="bi bi-geo-alt-fill text-customized fs-1 pe-2"></i>
          <span class="col-7">Place: ${eventDetail.place}</span>
        </div>
        <div class="d-flex text-center justify-content-center align-items-center card-text col-sm-6">
          <i class="bi bi-calendar2-event text-customized fs-1 pe-2"></i>
          <span class="col-7">Date: ${eventDetail.date}</span>
        </div>
        <div class="d-flex text-center justify-content-center align-items-center card-text col-sm-6">
          <i class="bi bi-person-circle text-customized fs-1 pe-2"></i>
          <span class="col-7">Capacity: ${eventDetail.capacity}</span>
        </div>
        <div class="d-flex text-center justify-content-center align-items-center card-text col-sm-6">
          <i class="bi bi-coin text-customized fs-1 pe-2"></i>
          <span class="col-7">Price: ${eventDetail.price}</span>
        </div>
        <div class="d-flex text-center justify-content-center align-items-center card-text col-sm-6">
          <i class="bi bi-person-check-fill text-customized fs-1 pe-2"></i>
          <span class="col-7">${getAssistanceOrEstimate(eventDetail)}</span>
        </div>
      </div>
    </div>
  </div>
  `;

  cardDetails.innerHTML = card;

  // Función para obtener valores de asistencia o estimado
  function getAssistanceOrEstimate(eventDetail) {
    if (eventDetail.assistance !== undefined) {
      return `Assistance: ${eventDetail.assistance}`;
    } else {
      return `Estimate: ${eventDetail.estimate}`;
    }
  }

}