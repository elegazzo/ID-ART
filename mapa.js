// Variable para almacenar los datos del archivo GeoJSON
let geojsonFeature;

// Crear el mapa centrado en unas coordenadas específicas
var map = L.map('mapa').setView([19.2906, -99.4985], 17);

// Cargar el mapa con un estilo oscuro
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: false,
  ext: 'png'
}).addTo(map);

// Crear íconos personalizados para las categorías
const icons = {
  clubes: L.icon({
    iconUrl: 'star.png',
    iconSize: [45, 45],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  }),
  repositorios: L.icon({
    iconUrl: 'repositorios.png',
    iconSize: [20, 20],
    iconAnchor: [15, 25],
    popupAnchor: [0, -50]
  }),
  actividades: L.icon({
    iconUrl: 'actividades.png',
    iconSize: [20, 20],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  }),
  eventos: L.icon({
    iconUrl: 'eventos.png',
    iconSize: [20, 20],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  })
};

function generatePopupContent(title, description, clubLink, markerId) {
  return `
    <div class="popup-content" style="width: 90%; max-width: 600px; margin: auto; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
      <h2 style="font-size: 1.5em; margin-bottom: 10px; text-align: center;">
        <a href="${clubLink}" target="_blank" style="text-decoration: none; color: blue;">${title}</a>
      </h2>
      <p style="font-size: 1em; line-height: 1.5; margin-bottom: 15px; overflow-wrap: break-word;">${description}</p>
      <textarea id="comment-box-${markerId}" placeholder="Añadir comentarios..." style="width: 100%; height: 80px; margin-bottom: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
      <div class="file-input" style="margin-bottom: 10px;">
        <label for="file-image-${markerId}" style="display: block; margin-bottom: 5px;">Adjuntar imagen (JPG o PNG):</label>
        <input id="file-image-${markerId}" type="file" accept="image/jpeg, image/png" style="display: block;" />
      </div>
      <button id="submit-comment-${markerId}" style="width: 100%; padding: 10px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer;">Subir comentario</button>
      <div class="comments-section" id="comments-section-${markerId}" style="margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px; max-height: 300px; overflow-y: auto;">
        <!-- Aquí aparecerán los comentarios -->
        <p id="no-comments-${markerId}"><em>No hay comentarios aún.</em></p>
      </div>
    </div>
  `;
}
// Función para añadir comentarios
function addComment(markerId) {
  const commentInput = document.getElementById(`comment-input-${markerId}`);
  const commentList = document.getElementById(`comment-list-${markerId}`);
  const comment = commentInput.value;

  if (comment.trim()) {
      // Crear un nuevo elemento de comentario
      const li = document.createElement("li");
      li.textContent = comment;

      // Agregar el comentario al listado
      commentList.appendChild(li);

      // Limpiar el campo de texto
      commentInput.value = "";
  } else {
      alert("Por favor, escribe un comentario antes de enviarlo.");
  }
}

function customFunctionToAdd() {
  console.log("Función personalizada agregada correctamente.");
}

// Marcadores fijos dentro de la zona delimitada
const fixedMarkers = [
  // Clubes existentes
  { id: "club-Musica", coords: [19.292504016680454, -99.49608286920562], title: "Club Música", description: "¡Únete para explorar nuevos ritmos y crear música juntos!", clubLink: "https://clubmusica.uam.mx", category: "clubes" },
  { id: "club-Produccion-musical", coords: [19.291409012628606, -99.50202650570077], title: "Club Producción Musical", description: "Aprende a producir, mezclar y masterizar música profesionalmente.", clubLink: "https://clubproduccionmusical.uam.mx", category: "clubes" },
  { id: "club-Acuarela", coords: [19.29132813189652, -99.50138960352898], title: "Club Acuarela", description: "Desarrolla tus habilidades artísticas en acuarela.", clubLink: "https://clubacuarela.uam.mx", category: "clubes" },
  { id:"club-ilustracion-digital", coords: [19.29145491789164, -99.50167447250024], title: "Club Ilustración Digital", description: "Explora el arte digital y mejora tus habilidades en ilustración.", clubLink: "https://clubilustraciondigital.uam.mx", category: "clubes" },
  { id:"club-programacion en hydra", coords: [19.29133250382837, -99.50133865135552], title: "Club Programación en Hydra", description: "Crea experiencias visuales interactivas con Hydra.", clubLink: "https://clubprogramacionhydra.uam.mx", category: "clubes" },
  { id:"club-robotica", coords: [19.291684443064455, -99.50042871497148], title: "Club Robótica", description: "Construye y programa robots para el futuro.", clubLink: "https://clubrobotica.uam.mx", category: "clubes" },
  { id:"club-fotografia", coords: [19.29162105016259, -99.50158439927475], title: "Club Fotografía", description: "Captura momentos y perfecciona tus habilidades fotográficas.", clubLink: "https://clubfotografia.uam.mx", category: "clubes" },
  { id:"club-modelado-360", coords: [19.291540169535253, -99.50204528484628], title: "Club Modelado 360", description: "Aprende a modelar en 3D y crea experiencias inmersivas.", clubLink: "https://clubmodelado360.uam.mx", category: "clubes" },
  { id:"club-salsa", coords: [19.291703775479363, -99.50122906479815], title: "Club Salsa", description: "Baila salsa y disfruta de la cultura del ritmo.", clubLink: "https://clubsalsa.uam.mx", category: "clubes" },
  { id:"club-teatro", coords: [19.291672642451417, -99.50117134072846], title: "Club Teatro", description: "Actúa y participa en producciones teatrales.", clubLink: "https://clubteatro.uam.mx", category: "clubes" },

  // Repositorios
  { id:"repositorio-1", coords: [19.291772871938534, -99.50182948489868], title: "Repositorio 1", description: "Contenido del repositorio 1.", clubLink: "#", category: "repositorios" },
  { id:"repositorio-2", coords: [19.292596108618795, -99.49675141981997], title: "Repositorio 2", description: "Contenido del repositorio 2.", clubLink: "#", category: "repositorios" },

  // Actividades
  { id:"actividad-1", coords: [19.291416475147784, -99.50017527919266], title: "Actividad 1", description: "Participa en esta actividad.", clubLink: "#", category: "actividades" },
  { id:"actividad-2", coords: [19.291501315309347, -99.49967923437758], title: "Actividad 2", description: "Únete a esta actividad.", clubLink: "#", category: "actividades" },

  // Eventos
  { id:"evento-1", coords: [19.291654293002722, -99.50121549391568], title: "Evento 1", description: "¡No te pierdas este evento!", clubLink: "#", category: "eventos" },
  { id:"evento-2",      coords: [19.292326372589997, -99.49604478179369], title: "Evento 2", description: "Un evento imperdible.", clubLink: "#", category: "eventos" },
  { id:"evento-3",   coords: [19.292398643439697, -99.49549214126148], title: "Evento 3", description: "Detalles de este evento.", clubLink: "#", category: "eventos" }
];

// Variable para almacenar el marcador fijado
let fixedMarker = null;

// Almacenar los marcadores por categorías
const categoryMarkers = {
  clubes: [],
  repositorios: [],
  actividades: [],
  eventos: []
};

// Añadir marcadores al mapa según su categoría
fixedMarkers.forEach(markerData => {
  const marker = L.marker(markerData.coords, { icon: icons[markerData.category] }).addTo(map);
  marker.bindPopup(generatePopupContent(markerData.title, markerData.description, markerData.clubLink));

  // Añadir el marcador a su categoría
  categoryMarkers[markerData.category].push(marker);

  // Evento al abrir el popup
  marker.on('popupopen', function () {
    const markerId = markerData.id;

    // Manejar comentarios
    const commentBox = document.getElementById(`comment-box-${markerId}`);
    const submitComment = document.getElementById(`submit-comment-${markerId}`);
    const commentsSection = document.getElementById(`comments-section-${markerId}`);

    submitComment.addEventListener('click', () => {
      const comment = commentBox.value;
      if (comment.trim()) {
        fetch('/guardarComentario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ markerId, comment }),
        })
          .then(response => response.json())
          .then(data => {
            const commentElement = document.createElement('p');
            commentElement.textContent = comment;
            commentsSection.appendChild(commentElement);
            commentBox.value = "";
            document.getElementById(`no-comments-${markerId}`).style.display = "none";
          })
          .catch(error => console.error('Error al guardar el comentario:', error));
      }
    });

    // Manejar archivos
    const fileInput = document.getElementById(`file-image-${markerId}`);
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('markerId', markerId);

        if (file.size > 2 * 1024 * 1024) { // Limitar tamaño a 2 MB
          alert('El archivo es demasiado grande. Máximo permitido: 2 MB.');
          return;
        }

        fetch('/subirImagen', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log('Imagen subida:', data);
          })
          .catch(error => console.error('Error al subir la imagen:', error));
      }
    });
  }); // Fin del popupopen

  // Mostrar popup al pasar el cursor
  marker.on('mouseover', function () {
    if (fixedMarker !== marker) {
      this.openPopup();
    }
  });

  // Ocultar popup al salir del cursor si no está fijado
  marker.on('mouseout', function () {
    if (fixedMarker !== marker) {
      this.closePopup();
    }
  });

  // Fijar o quitar el popup al hacer clic
  marker.on('click', function () {
    if (fixedMarker === marker) {
      fixedMarker = null;
      this.closePopup();
    } else {
      if (fixedMarker) {
        fixedMarker.closePopup();
      }
      fixedMarker = marker;
      this.openPopup();
    }
  });
}); // Fin del forEach

// Función para mostrar/ocultar marcadores de una categoría
function toggleCategoryMarkers(category) {
  const markers = categoryMarkers[category];
  if (!markers) return;

  const areVisible = markers.some(marker => map.hasLayer(marker));
  markers.forEach(marker => {
    if (areVisible) {
      map.removeLayer(marker);
    } else {
      map.addLayer(marker);
    }
  });
}

// Manejar el clic de los botones para alternar categorías
document.getElementById('toggle-clubes').addEventListener('click', () => {
  toggleCategoryMarkers('clubes');
});

document.getElementById('toggle-repositorios').addEventListener('click', () => {
  toggleCategoryMarkers('repositorios');
});

document.getElementById('toggle-actividades').addEventListener('click', () => {
  toggleCategoryMarkers('actividades');
});

document.getElementById('toggle-eventos').addEventListener('click', () => {
  toggleCategoryMarkers('eventos');
});

// Cargar datos desde GeoJSON
fetch('map.geojson')
  .then(response => response.json())
  .then(data => {
    geojsonFeature = data;
    L.geoJSON(geojsonFeature, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: customIcon });
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.title) {
          layer.bindPopup(generatePopupContent(feature.properties.title, feature.properties.description, feature.properties.link));
        }
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error al cargar GeoJSON:', error));
