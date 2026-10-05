var usuarios = [];
var incidencias = [];
var usuariosCargados = false;
var incidenciasCargadas = false;

function leerJson(ruta) {
  return new Promise(function (resolve, reject) {
    var archivo = new XMLHttpRequest();

    archivo.open("GET", ruta, true);

    archivo.onload = function () {
      if (archivo.status >= 200 && archivo.status < 300) {
        resolve(JSON.parse(archivo.responseText));
      } else {
        reject(new Error("No se pudo cargar " + ruta));
      }
    };

    archivo.onerror = function () {
      reject(new Error("Error al leer " + ruta));
    };

    archivo.send();
  });
}

Promise.all([
  localforage.getItem("usuarios"),
  localforage.getItem("incidencias"),
])
  .then(function ([datosUsuarios, datosIncidencias]) {
    var cargaUsuarios;

    if (datosUsuarios !== null) {
      usuarios = datosUsuarios;
      cargaUsuarios = Promise.resolve();
    } else {
      cargaUsuarios = leerJson("data/usuarios.json").then(function (datos) {
        usuarios = datos;
        return localforage.setItem("usuarios", usuarios);
      });
    }

    var cargaIncidencias;

    if (datosIncidencias !== null) {
      incidencias = datosIncidencias;
      cargaIncidencias = Promise.resolve();
    } else {
      cargaIncidencias = leerJson("data/incidencias.json").then(
        function (datos) {
          incidencias = datos;
          return localforage.setItem("incidencias", incidencias);
        },
      );
    }

    return Promise.all([cargaUsuarios, cargaIncidencias]);
  })
  .then(function () {
    usuariosCargados = true;
    incidenciasCargadas = true;
    mostrarReporte();
  })
  .catch(function (error) {
    console.error("No se pudo cargar el reporte:", error);
  });

function nombreUsuario(id) {
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id == id) {
      return usuarios[i].nombre;
    }
  }

  return "";
}

function mostrarReporte() {
  if (!usuariosCargados || !incidenciasCargadas) {
    return;
  }

  var tabla = document.getElementById("repBody");

  if ($.fn.DataTable.isDataTable("#reportesTable")) {
    $("#reportesTable").DataTable().destroy();
  }

  tabla.innerHTML = "";

  for (var i = 0; i < incidencias.length; i++) {
    var usuario = nombreUsuario(incidencias[i].usuarioId);
    var fila = document.createElement("tr");
    var valores = [
      incidencias[i].id,
      usuario,
      incidencias[i].asunto,
      incidencias[i].categoria,
      incidencias[i].prioridad,
      incidencias[i].estado,
      incidencias[i].fecha,
    ];

    for (var j = 0; j < valores.length; j++) {
      var celda = document.createElement("td");
      celda.textContent = valores[j];
      fila.appendChild(celda);
    }

    tabla.appendChild(fila);
  }

  $("#reportesTable").DataTable({
    responsive: true,
    lengthMenu: [5, 10, 25, 50],
    pageLength: 5,
    language: {
      url: "vendor/datatables/es-ES.json",
    },
    layout: {
      topStart: {
        features: [
          "pageLength",
          {
            buttons: [
              {
                extend: "csvHtml5",
                text: "csv",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Reportes");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                },
              },
              {
                extend: "copyHtml5",
                text: "copiar",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Reportes");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                },
              },
              {
                extend: "print",
                text: "Imprimir",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Reportes");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                },
              },
              {
                extend: "excelHtml5",
                text: "Excel",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Reportes");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                },
              },
              {
                extend: "pdfHtml5",
                text: "PDF",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Reportes");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                },
              },
            ],
          },
        ],
      },
    },
  });
}
