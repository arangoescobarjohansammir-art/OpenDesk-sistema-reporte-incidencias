var usuarios = [];
var incidencias = [];

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
    var cargarUsuarios;

    if (datosUsuarios !== null) {
      usuarios = datosUsuarios;
      cargarUsuarios = Promise.resolve();
    } else {
      cargarUsuarios = leerJson("data/usuarios.json").then(function (datos) {
        usuarios = datos;
        return localforage.setItem("usuarios", usuarios);
      });
    }

    var cargarIncidencias;

    if (datosIncidencias !== null) {
      incidencias = datosIncidencias;
      cargarIncidencias = Promise.resolve();
    } else {
      cargarIncidencias = leerJson("data/incidencias.json").then(
        function (datos) {
          incidencias = datos;
          return localforage.setItem("incidencias", incidencias);
        },
      );
    }

    return Promise.all([cargarUsuarios, cargarIncidencias]);
  })
  .then(function () {
    calcularIndicadores();
  })
  .catch(function (error) {
    console.error("No se pudieron cargar los datos:", error);
  });

function calcularIndicadores() {
  var totalUsuarios = usuarios.length;
  document.getElementById("tarjetaTotalUsuarios").textContent = totalUsuarios;

  var usuariosActivos = usuarios.filter(function (usuario) {
    return usuario.activo;
  }).length;
  document.getElementById("tarjetaUsuariosActivos").textContent =
    usuariosActivos;

  var usuariosInactivos = usuarios.filter(function (usuario) {
    return !usuario.activo;
  }).length;
  document.getElementById("tarjetaUsuariosInactivos").textContent =
    usuariosInactivos;

  var incidenciasTotales = incidencias.length;
  document.getElementById("tarjetaIncidenciasTotales").textContent =
    incidenciasTotales;

  var incidenciasAbiertas = incidencias.filter(function (incidencia) {
    return incidencia.estado === "Abierta";
  }).length;
  document.getElementById("tarjetaIncidenciasAbiertas").textContent =
    incidenciasAbiertas;

  var incidenciasResueltas = incidencias.filter(function (incidencia) {
    return incidencia.estado === "Resuelta";
  }).length;
  document.getElementById("tarjetaIncidenciasResueltas").textContent =
    incidenciasResueltas;

  //grafico
  var categorias = ["Hardware", "Software", "Conectividad", "Acceso", "Otro"];

  var cantidades = [];

  for (var i = 0; i < categorias.length; i++) {
    var cantidad = incidencias.filter(function (incidencia) {
      return incidencia.categoria == categorias[i];
    }).length;

    cantidades.push(cantidad);
  }

  var canvaGraficoCategoria = document.getElementById("graficoCategorias");
  var contextoGraficoCategoria = canvaGraficoCategoria.getContext("2d");
  var graficoCategoria = new Chart(contextoGraficoCategoria, {
    type: "bar",
    data: {
      labels: categorias,
      datasets: [
        {
          data: cantidades,
          label: "Incidencias",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  //grafico 2
  var estados = ["Abierta", "En proceso", "Resuelta", "Cerrada"];

  var cantidades = [];

  for (var i = 0; i < estados.length; i++) {
    var cantidad = incidencias.filter(function (incidencia) {
      return incidencia.estado == estados[i];
    }).length;

    cantidades.push(cantidad);
  }

  var canvaGraficoEstado = document.getElementById("graficoEstado");
  var contextoGraficoEstado = canvaGraficoEstado.getContext("2d");
  var graficoEstado = new Chart(contextoGraficoEstado, {
    type: "bar",
    data: {
      labels: estados,
      datasets: [
        {
          data: cantidades,
          label: "estado",
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}
