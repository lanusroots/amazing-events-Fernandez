// URL de la API
const urlApi = "https://mindhub-xj03.onrender.com/api/amazing";

let infoEvents;
let currentDate;

// Función asíncrona para obtener la información de la API y llamar a la función statsInitializer()
async function getInfo() {

    try {
        const info = await fetch(urlApi)
            .then(response => response.json())
            .then(data => data);

        infoEvents = info.events;
        currentDate = info.currentDate;
        statsInitializer();

    } catch (error) {
        console.log(error);
    }
}

// Llamando a la función getInfo() para obtener la información de la API
getInfo();

// Función que se encarga de procesar la información obtenida y mostrarla
function statsInitializer() {

    // Obteniendo elementos del DOM
    const eventStats = document.getElementById("eventStats");
    const upcomingStats = document.getElementById("upcomingStats");
    const pastStats = document.getElementById("pastStats");

    // Ordenando eventos por % (asistencia - estimado - capacidad)
    let orderByPercentageAssistance = infoEvents
        .filter(e => e.assistance != undefined)
        .sort((a, b) =>  (b.assistance / b.capacity) - (a.assistance / a.capacity));

    let orderByPercentageEstimate = infoEvents
        .filter(e => e.estimate != undefined)
        .sort((a, b) => (a.estimate / a.capacity) - (b.estimate / b.capacity));

    let orderByCapacity = infoEvents
        .filter(e => e.assistance != undefined)
        .sort((a, b) =>  b.capacity - a.capacity);

    // Creando dos arrays, uno para eventos pasados y otro para eventos futuros
    let pastEventsArray = [];
    let upcomingEventsArray =[];

    orderByPercentageAssistance.forEach(ev => {
        // Si el evento no se encuentra en el array de eventos pasados, lo agrega
        if (!pastEventsArray.some((item) => ev.category == item.category)) {
            pastEventsArray.push({
                category: ev.category,
                revenues: ev.price * ev.assistance,
                capacity: ev.capacity,
                assistance: ev.assistance
            });
        } else if (pastEventsArray.some((item) => ev.category == item.category)) {
            // Si el evento ya se encuentra en el array de eventos pasados, actualiza los datos
            pastEventsArray.forEach(e => {
                if (e.category == ev.category) {
                    e.capacity += ev.capacity;
                    e.revenues += ev.price * ev.assistance;
                    e.assistance += ev.assistance;
                }
            })
        }
    });

    orderByPercentageEstimate.forEach(ev => {
        // Si el evento no se encuentra en el array de eventos futuros, lo agrega
        if (!upcomingEventsArray.some((item) => ev.category == item.category)) {
            upcomingEventsArray.push({
                category: ev.category,
                revenues: ev.price * ev.estimate,
                capacity: ev.capacity,
                estimate: ev.estimate
            });
        } else if (upcomingEventsArray.some((item) => ev.category == item.category)) {
            // Si el evento ya se encuentra en el array de eventos futuros, actualiza los datos
            upcomingEventsArray.forEach(e => {
                if (e.category == ev.category) {
                    e.capacity += ev.capacity;
                    e.revenues += ev.price * ev.estimate;
                    e.estimate += ev.estimate;
                }
            })
        }
    });

    eventStats.innerHTML = eventsStatistics(orderByPercentageAssistance,orderByCapacity);
    pastStats.innerHTML = pastEventsStatistics(pastEventsArray);
    upcomingStats.innerHTML = upcomingEventsStatistics(upcomingEventsArray);

    // Función para generar la tabla "Events Statistics"
    function eventsStatistics(eventsAttendance, eventsCapacity) {
        let rows = '';
        
        rows = `<tr>
                    <td class="fw-semibold">Events with the highest percentage of attendance</td>
                    <td class="fw-semibold">Events with the lowest percentage of attendance</td>
                    <td class="fw-semibold">Event with larger capacity</td>
                </tr>
                `;
        for (let i = 0; i < 3; i++) {
            rows +=`<tr>
                    <td>${eventsAttendance[i].name} : ${((eventsAttendance[i].assistance/eventsAttendance[i].capacity)*100).toFixed(2)} %</td >
                    <td>${eventsAttendance[eventsAttendance.length-i-1].name} : ${((eventsAttendance[eventsAttendance.length-i-1].assistance/eventsAttendance[eventsAttendance.length-i-1].capacity)*100).toFixed(2)} %</td >
                    <td>${eventsCapacity[i].name} : ${eventsCapacity[i].capacity}</td >
                </tr>`;
        }   

        return rows;
    }

    // Función para generar la tabla "Upcoming Events Statistics by Category"
    function upcomingEventsStatistics(array){
        let rows = `<tr>
                        <td class="fw-semibold">Categories</td>
                        <td class="fw-semibold">Revenues</td>
                        <td class="fw-semibold">Percentage of estimate</td>
                    </tr>`;

        for (const item of array) {
            rows += `<tr>
                        <td>${item.category}</td>
                        <td>$ ${item.revenues}</td>
                        <td>${((item.estimate)/(item.capacity)*100).toFixed(2)} %</td>
                    </tr>`
        }
        return rows;
    }

    // Función para generar la tabla "Past Events Statistics by Category"
    function pastEventsStatistics(array){
        let rows = `<tr>
                        <td class="fw-semibold">Categories</td>
                        <td class="fw-semibold">Revenues</td>
                        <td class="fw-semibold">Percentage of attendance</td>
                    </tr>`;

        for (const item of array) {
            rows += `<tr>
                        <td>${item.category}</td>
                        <td>$ ${item.revenues}</td>
                        <td>${((item.assistance)/(item.capacity)*100).toFixed(2)} %</td>
                    </tr>`
        }
        return rows;
    }
}