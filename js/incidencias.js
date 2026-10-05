var usuarios = [];
var incidencias = [];
var posicionEditar = -1;

const validator = new JustValidate("#incidenciasForm");

validator
  .addField("#SelectUsuarios", [
    {
      validator: (value) => {
        return value !== "-1";
      },
      errorMessage: "Debe seleccionar un usuario",
    },
  ])
  .addField("#asunto", [
    { rule: "required", errorMessage: "El asunto es obligatorio" },
    {
      rule: "minLength",
      value: 5,
      errorMessage: "El asunto debe tener al menos 5 caracteres",
    },
  ])
  .addField("#selectCategoria", [
    { rule: "required", errorMessage: "Debe elegir una categoría" },
  ])
  .addField("#selectPrioridad", [
    { rule: "required", errorMessage: "Debe elegir una prioridad" },
  ])
  .addField("#fecha", [
    { rule: "required", errorMessage: "La fecha es obligatoria" },
  ])
  .addField("#descripcion", [
    { rule: "required", errorMessage: "La descripción es obligatoria" },
    {
      rule: "minLength",
      value: 20,
      errorMessage: "La descripción debe tener al menos 20 caracteres",
    },
  ])
  .onSuccess(function () {
    var usuarioId = Number(document.getElementById("SelectUsuarios").value);
    var asunto = document.getElementById("asunto").value;
    var categoria = document.getElementById("selectCategoria").value;
    var prioridad = document.getElementById("selectPrioridad").value;
    var estado = document.getElementById("selectEstado").value;
    var fecha = document.getElementById("fecha").value;
    var descripcion = document.getElementById("descripcion").value;

    var mayorId = 0;

    for (var i = 0; i < incidencias.length; i++) {
      if (incidencias[i].id > mayorId) {
        mayorId = incidencias[i].id;
      }
    }

    if (posicionEditar == -1) {
      var incidencia = {
        id: mayorId + 1,
        usuarioId: usuarioId,
        asunto: asunto,
        categoria: categoria,
        prioridad: prioridad,
        estado: estado,
        fecha: fecha,
        descripcion: descripcion,
      };
      incidencias.push(incidencia);

      Swal.fire({
        title: "Incidencia creada",
        icon: "success",
      });
    } else {
      incidencias[posicionEditar].usuarioId = usuarioId;
      incidencias[posicionEditar].asunto = asunto;
      incidencias[posicionEditar].categoria = categoria;
      incidencias[posicionEditar].prioridad = prioridad;
      incidencias[posicionEditar].estado = estado;
      incidencias[posicionEditar].fecha = fecha;
      incidencias[posicionEditar].descripcion = descripcion;
      Swal.fire({
        title: "Incidencia actualizada",
        icon: "success",
      });
    }
    localforage.setItem("incidencias", incidencias);
    mostrarIncidencias();
    cerrarFormulario();
  });

function cargarIncidencias() {
  Promise.all([
    localforage.getItem("usuarios"),
    localforage.getItem("incidencias"),
  ]).then(function ([datosUsuarios, datosIncidencias]) {
    if (datosUsuarios !== null) {
      usuarios = datosUsuarios;
      continuarCargaIncidencias();
    } else {
      var archivoUsuarios = new XMLHttpRequest();
      archivoUsuarios.open("GET", "data/usuarios.json", true);

      archivoUsuarios.onload = function () {
        usuarios = JSON.parse(archivoUsuarios.responseText);

        localforage.setItem("usuarios", usuarios).then(function () {
          continuarCargaIncidencias();
        });
      };

      archivoUsuarios.send();
    }

    function continuarCargaIncidencias() {
      llenarSelectUsuarios();

      if (datosIncidencias !== null) {
        incidencias = datosIncidencias;
        mostrarIncidencias();
        return;
      }

      var archivoIncidencias = new XMLHttpRequest();
      archivoIncidencias.open("GET", "data/incidencias.json", true);

      archivoIncidencias.onload = function () {
        incidencias = JSON.parse(archivoIncidencias.responseText);

        localforage.setItem("incidencias", incidencias).then(function () {
          mostrarIncidencias();
        });
      };

      archivoIncidencias.send();
    }
  });
}

function mostrarIncidencias() {
  var tabla = document.getElementById("incidenciasBody");

  if ($.fn.DataTable.isDataTable("#incidenciasTable") == true) {
    $("#incidenciasTable").DataTable().destroy();
  }

  tabla.innerHTML = "";

  for (var i = 0; i < incidencias.length; i++) {
    var nombreUsuario = "";
    var textoPrioridad = "";
    var textoEstado = "";
    var usuarioEncontrado = usuarios.find(function (u) {
      return u.id === incidencias[i].usuarioId;
    });

    if (usuarioEncontrado) {
      nombreUsuario = usuarioEncontrado.nombre;
    } else {
      nombreUsuario = "usuario no encontrado";
    }

    if (incidencias[i].prioridad === "Alta") {
      textoPrioridad = '<span class="prioridad alta">Alta</span>';
    }
    if (incidencias[i].prioridad === "Media") {
      textoPrioridad = '<span class="prioridad media">Media</span>';
    }
    if (incidencias[i].prioridad === "Critica") {
      textoPrioridad = '<span class="prioridad critica">Critica</span>';
    }
    if (incidencias[i].prioridad === "Baja") {
      textoPrioridad = '<span class="prioridad baja">Baja</span>';
    }

    if (incidencias[i].estado === "Abierta") {
      textoEstado = '<span class="estado abierta">Abierta</span>';
    }
    if (incidencias[i].estado === "En proceso") {
      textoEstado = '<span class="estado proceso">En proceso</span>';
    }
    if (incidencias[i].estado === "Resuelta") {
      textoEstado = '<span class="estado resuelta">Resuelta</span>';
    }
    if (incidencias[i].estado === "Cerrada") {
      textoEstado = '<span class="estado cerrada">Cerrada</span>';
    }

    var fila = document.createElement("tr");

    var celdaId = document.createElement("td");
    celdaId.textContent = incidencias[i].id;
    fila.appendChild(celdaId);

    var celdaUsuario = document.createElement("td");
    celdaUsuario.textContent = nombreUsuario;
    fila.appendChild(celdaUsuario);

    var celdaAsunto = document.createElement("td");
    celdaAsunto.textContent = incidencias[i].asunto;
    fila.appendChild(celdaAsunto);

    var celdaCategoria = document.createElement("td");
    celdaCategoria.textContent = incidencias[i].categoria;
    fila.appendChild(celdaCategoria);

    var celdaPrioridad = document.createElement("td");
    celdaPrioridad.innerHTML = textoPrioridad;
    fila.appendChild(celdaPrioridad);

    var celdaEstado = document.createElement("td");
    celdaEstado.innerHTML = textoEstado;
    fila.appendChild(celdaEstado);

    var celdaFecha = document.createElement("td");
    celdaFecha.textContent = incidencias[i].fecha;
    fila.appendChild(celdaFecha);

    var celdaAcciones = document.createElement("td");
    var botonEditar = document.createElement("button");
    botonEditar.classList.add("btn", "btn-primary", "me-2");
    botonEditar.textContent = "Editar";
    celdaAcciones.appendChild(botonEditar);

    var botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.classList.add("btn", "btn-danger");
    celdaAcciones.appendChild(botonEliminar);
    fila.appendChild(celdaAcciones);

    let posicion = i;

    botonEditar.onclick = function () {
      editarIncidencia(posicion);
    };

    botonEliminar.onclick = function () {
      eliminarIncidencia(posicion);
    };
    tabla.appendChild(fila);
  }

  $("#incidenciasTable").DataTable({
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
                  return nameArchivo("Incidencias");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "copyHtml5",
                text: "copiar",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Incidencias");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "print",
                text: "Imprimir",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Incidencias");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "excelHtml5",
                text: "Excel",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Incidencias");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "pdfHtml5",
                text: "PDF",
                title: "reporte de incidencias",
                filename: function () {
                  return nameArchivo("Incidencias");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
            ],
          },
        ],
      },
    },
  });
}

function llenarSelectUsuarios() {
  var select = document.getElementById("SelectUsuarios");

  select.options.length = 1;

  for (var i = 0; i < usuarios.length; i++) {
    var opcion = document.createElement("option");
    opcion.value = usuarios[i].id;
    opcion.textContent = usuarios[i].nombre;
    select.appendChild(opcion);
  }
}

function nuevaIncidencia() {
  posicionEditar = -1;
  var selectEstado = document.getElementById("selectEstado");

  document.getElementById("incidenciasForm").reset();
  selectEstado.value = "Abierta";
  selectEstado.disabled = true;

  document.getElementById("incidenciasModal").classList.add("open");
}

function cerrarFormulario() {
  document.getElementById("incidenciasModal").classList.remove("open");
  document.getElementById("incidenciasForm").reset();
  posicionEditar = -1;
}

function editarIncidencia(posicion) {
  posicionEditar = posicion;

  document.getElementById("SelectUsuarios").value =
    incidencias[posicion].usuarioId;

  document.getElementById("asunto").value = incidencias[posicion].asunto;

  document.getElementById("selectCategoria").value =
    incidencias[posicion].categoria;

  document.getElementById("selectPrioridad").value =
    incidencias[posicion].prioridad;

  document.getElementById("selectEstado").value = incidencias[posicion].estado;
  document.getElementById("selectEstado").disabled = false;

  document.getElementById("fecha").value = incidencias[posicion].fecha;

  document.getElementById("descripcion").value =
    incidencias[posicion].descripcion;

  document.getElementById("incidenciaModalTitle").innerHTML =
    "Editar Incidencia";

  document.getElementById("incidenciasModal").classList.add("open");
}

function eliminarIncidencia(posicion) {
  Swal.fire({
    title: "¿Estas Seguro?",
    text: "¡No podras revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Borralo!",
  }).then((result) => {
    if (result.isConfirmed) {
      incidencias.splice(posicion, 1);
      localforage.setItem("incidencias", incidencias);
      mostrarIncidencias();
      Swal.fire({
        title: "Eliminado!",
        text: "La incidencias ha sido eliminada.",
        icon: "success",
      });
    }
  });
}

function recargarIncidencias() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Se restaurarán las incidencias originales. Los usuarios no cambiarán.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, restaurar",
  }).then(function (result) {
    if (!result.isConfirmed) return;

    localforage.getItem("usuarios").then(function (usuariosGuardados) {
      if (usuariosGuardados) {
        usuarios = usuariosGuardados;
      }

      localforage.removeItem("incidencias").then(function () {
        cargarIncidencias();

        Swal.fire({
          title: "Restaurado",
          text: "Las incidencias volvieron a los datos originales.",
          icon: "success",
        });
      });
    });
  });
}

cargarIncidencias();
