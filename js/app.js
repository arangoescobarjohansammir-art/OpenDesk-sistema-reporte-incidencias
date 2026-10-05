function mostrarMenu() {
  document.getElementById("sidebar").classList.toggle("open");
}

function nameArchivo(nombreReporte) {
  const hoy = new Date();
  const fechaFormateada = hoy.toISOString().split("T")[0];
  return nombreReporte + "_" + fechaFormateada;
}
