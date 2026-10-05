var usuarios = [];

var posicionEditar = -1;

const validator = new JustValidate("#userForm");

validator

  .addField("#nombre", [
    { rule: "required", errorMessage: "El nombre es obligatorio" },
  ])
  .addField("#correo", [
    { rule: "required", errorMessage: "el correo es obligatorio" },
    { rule: "email", errorMessage: "El formato del correo no es válido" },
  ])
  .addField("#rol", [{ rule: "required", errorMessage: "Debe elegir un rol" }])
  .addField("#departamento", [
    { rule: "required", errorMessage: "Debe elegir un departamento" },
  ])
  .addField("#activo", [
    { rule: "required", errorMessage: "Debe elegir un estado" },
  ])

  .onSuccess(function () {
    var nombre = document.getElementById("nombre").value;

    var correo = document.getElementById("correo").value;

    var rol = document.getElementById("rol").value;

    var departamento = document.getElementById("departamento").value;

    var activo = document.getElementById("activo").value === "true";

    if (posicionEditar == -1) {
      var mayorId = 0;

      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id > mayorId) {
          mayorId = usuarios[i].id;
        }
      }

      var usuario = {
        id: mayorId + 1,
        nombre: nombre,
        correo: correo,
        rol: rol,
        departamento: departamento,
        activo: activo,
      };

      usuarios.push(usuario);

      Swal.fire({
        title: "Usuario creado",
        icon: "success",
      });
    } else {
      usuarios[posicionEditar].nombre = nombre;

      usuarios[posicionEditar].correo = correo;

      usuarios[posicionEditar].rol = rol;

      usuarios[posicionEditar].departamento = departamento;

      usuarios[posicionEditar].activo = activo;
      Swal.fire({
        title: "Usuario actualizado",
        icon: "success",
      });
    }
    localforage.setItem("usuarios", usuarios);

    mostrarUsuarios();

    cerrarFormulario();
  });

function cargarUsuarios() {
  localforage.getItem("usuarios").then(function (datosGuardados) {
    if (datosGuardados) {
      usuarios = datosGuardados;
      mostrarUsuarios();
    } else {
      var archivo = new XMLHttpRequest();
      archivo.open("GET", "data/usuarios.json", true);
      archivo.onload = function () {
        usuarios = JSON.parse(archivo.responseText);

        localforage.setItem("usuarios", usuarios);

        mostrarUsuarios();
      };
      archivo.send();
    }
  });
}

function mostrarUsuarios() {
  var tabla = document.getElementById("usersBody");

  if ($.fn.DataTable.isDataTable("#usersTable") == true) {
    $("#usersTable").DataTable().destroy();
  }

  tabla.innerHTML = "";

  for (var i = 0; i < usuarios.length; i++) {
    var textoActivo = "";
    var fila = document.createElement("tr");

    if (usuarios[i].activo) {
      textoActivo = '<span class="insignia activo">Activo</span>';
    } else {
      textoActivo = '<span class="insignia inactivo">Inactivo</span>';
    }

    fila.innerHTML =
      "<td>" +
      usuarios[i].id +
      "</td>" +
      "<td>" +
      usuarios[i].nombre +
      "</td>" +
      "<td>" +
      usuarios[i].correo +
      "</td>" +
      "<td>" +
      usuarios[i].rol +
      "</td>" +
      "<td>" +
      usuarios[i].departamento +
      "</td>" +
      "<td>" +
      textoActivo +
      "</td>" +
      "<td>" +
      "<button class='btn btn-primary' onclick='editarUsuario(" +
      i +
      ")'>Editar</button> " +
      "<button class='btn btn-danger' onclick='eliminarUsuario(" +
      i +
      ")'>Eliminar</button>" +
      "</td>";

    tabla.appendChild(fila);
  }

  $("#usersTable").DataTable({
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
                title: "reporte de usuarios",
                filename: function () {
                  return nameArchivo("Usuarios");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "copyHtml5",
                text: "copiar",
                title: "reporte de usuarios",
                filename: function () {
                  return nameArchivo("Usuarios");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "print",
                text: "Imprimir",
                title: "reporte de usuarios",
                filename: function () {
                  return nameArchivo("Usuarios");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "excelHtml5",
                text: "Excel",
                title: "reporte de usuarios",
                filename: function () {
                  return nameArchivo("Usuarios");
                },
                exportOptions: {
                  modifier: { search: "applied" },
                  columns: ":not(.no-export)",
                },
              },
              {
                extend: "pdfHtml5",
                text: "PDF",
                title: "reporte de usuarios",
                filename: function () {
                  return nameArchivo("Usuarios");
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

function nuevoUsuario() {
  posicionEditar = -1;

  document.getElementById("userForm").reset();

  document.getElementById("userModalTitle").innerHTML = "Nuevo usuario";

  document.getElementById("userModal").classList.add("open");
}

function editarUsuario(posicion) {
  posicionEditar = posicion;

  document.getElementById("nombre").value = usuarios[posicion].nombre;

  document.getElementById("correo").value = usuarios[posicion].correo;

  document.getElementById("rol").value = usuarios[posicion].rol;

  document.getElementById("departamento").value =
    usuarios[posicion].departamento;

  document.getElementById("activo").value = usuarios[posicion].activo;

  document.getElementById("userModalTitle").innerHTML = "Editar usuario";

  document.getElementById("userModal").classList.add("open");
}

function eliminarUsuario(posicion) {
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
      usuarios.splice(posicion, 1);

      localforage.setItem("usuarios", usuarios);
      mostrarUsuarios();
      Swal.fire({
        title: "Eliminado!",
        text: "El Usuario ha sido eliminado.",
        icon: "success",
      });
    }
  });
}

function cerrarFormulario() {
  document.getElementById("userModal").classList.remove("open");

  document.getElementById("userForm").reset();

  posicionEditar = -1;
}

function recargarUsuarios() {
  Swal.fire({
    title: "¿Estas Seguro?",
    text: "¡No podras revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Restauralo!",
  }).then((result) => {
    if (result.isConfirmed) {
      localforage.removeItem("usuarios").then(() => {
        Swal.fire({
          title: "Restaurado!",
          text: "Se han restaurado los datos por defecto.",
          icon: "success",
        });
        cargarUsuarios();
      });
    }
  });
}

cargarUsuarios();
