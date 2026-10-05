# DEPENDENCIAS.md — OpenDesk

Registro de tecnologías open source incorporadas al proyecto, en el orden en que se instalaron.

---

## Bootstrap

- **Versión:** 5.3.8
- **Función dentro del proyecto:** interfaz, navegación, formularios, tablas, estructura visual del modal de usuarios.
- **Licencia:** MIT
- **Fuente oficial:** https://getbootstrap.com/
- **Método de instalación:** descarga directa del `.zip` compilado (sin npm), copiado en `vendor/bootstrap/`.
- **Dependencias relacionadas:** el paquete `bootstrap.bundle.min.js` incluye Popper.js. No se usa el JavaScript de Bootstrap para el modal (se controla con JS propio mediante la clase `open`); se conservó el bundle por si se necesita para otro componente más adelante (por ejemplo, dropdowns).
- **Estado:** adoptada
- **Evidencia principal:** `vendor/bootstrap/LICENSE` (descargado desde el repositorio oficial en GitHub, no viene incluido en el `.zip` de descarga compilada).
- **Riesgos identificados:** se carga el JS completo de Bootstrap (con Popper.js) sin usarlo en el modal actual, lo que representa peso adicional. Combinar `display: flex` propio con la clase `modal-dialog-centered` de Bootstrap causó un conflicto de ancho (el hijo flex se encogía a 202px en vez de usar el `max-width` de `modal-lg`); se resolvió centrando el contenedor con `display: block` y dejando que la clase de Bootstrap centrara por dentro.

---

## jQuery

- **Versión:** 3.7.1 (minified)
- **Función dentro del proyecto:** dependencia obligatoria de DataTables; no se usa directamente en el código propio del proyecto (usuarios.js e incidencias.js están escritos en JavaScript nativo).
- **Licencia:** MIT
- **Fuente oficial:** https://jquery.com/download/
- **Método de instalación:** descarga directa del archivo `jquery-3.7.1.min.js` (variante "minified", no "slim", para conservar los módulos de AJAX y efectos que DataTables puede necesitar), copiado en `vendor/jquery/`.
- **Dependencias relacionadas:** ninguna propia; es dependencia de DataTables.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/jquery/LICENSE.TXT`.
- **Riesgos identificados:** se evaluó inicialmente la versión 4.0.0 (la más reciente ofrecida por defecto), pero se descartó por riesgo de incompatibilidad: jQuery 4.0 elimina métodos antiguos que aún usan varias librerías del ecosistema DataTables, sin confirmación oficial de compatibilidad plena. Se optó por la serie 3.x (3.7.1), mejor probada con DataTables, y funcionó sin problemas en la práctica.

---

## DataTables (+ Buttons y Responsive)

- **Versión:** 3.1.2 (verificar de nuevo en la fecha de entrega final, ya que el sitio oficial actualiza versiones)
- **Función dentro del proyecto:** búsqueda, ordenamiento, paginación, adaptación responsive y exportación (CSV, Excel, PDF, copiar, imprimir) de la tabla de usuarios.
- **Licencia:** MIT
- **Fuente oficial:** https://datatables.net/
- **Método de instalación:** descarga mediante el "download builder" oficial (datatables.net/download), con styling framework **Bootstrap 5** y extensiones **Buttons** y **Responsive** incluidas en un solo paquete combinado, copiado en `vendor/datatables/`.
- **Dependencias relacionadas:** requiere **jQuery** para funcionar; las extensiones Buttons para Excel y PDF requieren además **JSZip** y **pdfmake**, respectivamente.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/datatables/LICENSE.txt`.
- **Riesgos identificados:**
  - Dependencia dura de jQuery: obliga a mantener dos librerías sincronizadas en vez de una.
  - Al inicializar `DataTable()` sobre el `<tbody>` en vez de la `<table>` completa apareció el error *"Non-table node initialisation (TBODY)"*; se corrigió apuntando el selector a un `id` puesto en la etiqueta `<table>`.
  - Reinicializar DataTables sobre una tabla ya inicializada (al editar/eliminar un usuario) provocaba conflicto; se resolvió con el patrón `isDataTable()` → `destroy()` → reconstruir filas → reinicializar, dentro de la misma función `mostrarUsuarios()`.
  - Las opciones `exportOptions.columns`, `title` y `filename` deben ir en el mismo nivel que `extend` y `text` dentro de cada botón (no anidadas dentro de `exportOptions.modifier` ni en la configuración global `Buttons.defaults`), porque la configuración específica de cada tipo de botón tiene más prioridad que la configuración general y la sobreescribe silenciosamente.

---

## JSZip

- **Versión:** 3.10.2
- **Función dentro del proyecto:** soporte interno necesario para que el botón "Excel" de DataTables Buttons genere el archivo `.xlsx`.
- **Licencia:** doble licencia — MIT o GPLv3, a elección del usuario de la librería. Para este proyecto se adopta **MIT**, por ser la más permisiva y adecuada para un trabajo académico (GPLv3 exigiría publicar el código fuente bajo la misma licencia).
- **Fuente oficial:** https://stuk.github.io/jszip/ (repositorio: github.com/Stuk/jszip)
- **Método de instalación:** descarga directa de los archivos `jszip.js` / `jszip.min.js`, copiados en `vendor/jszip/`.
- **Dependencias relacionadas:** ninguna propia; es dependencia de DataTables Buttons para la exportación a Excel.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/jszip/LICENSE.markdown`.
- **Riesgos identificados:** la doble licencia obliga a documentar explícitamente cuál de las dos se está aplicando, en vez de asumir "MIT" sin más, como sí es directo en otras librerías del proyecto.

---

## pdfmake (+ vfs_fonts)

- **Versión:** 0.2.21 (rama estable)
- **Función dentro del proyecto:** soporte interno necesario para que el botón "PDF" de DataTables Buttons genere el documento, y para la vista de impresión.
- **Licencia:** MIT
- **Fuente oficial:** https://github.com/bpampuch/pdfmake
- **Método de instalación:** descarga directa de `pdfmake.js` y `vfs_fonts.js` (fuentes necesarias para renderizar texto en el PDF), copiados en `vendor/pdfmake/`.
- **Dependencias relacionadas:** ninguna propia; es dependencia de DataTables Buttons para la exportación a PDF.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/pdfmake/LICENSE.txt`.
- **Riesgos identificados:** la rama `master` del repositorio oficial (versión 0.3.x) está marcada explícitamente como **inestable** por sus propios mantenedores. Se identificó este riesgo antes de instalar y se optó, en cambio, por la última versión estable de la serie 0.2.x (0.2.21).

---

## Chart.js

- **Versión:** 4.5.0 (verificado en la fuente oficial; confirmar de nuevo en la fecha de entrega si vuelve a descargarse)
- **Función dentro del proyecto:** dibuja los dos gráficos del dashboard (incidencias por categoría, incidencias por estado), a partir de los arreglos `usuarios` e `incidencias` ya cargados.
- **Licencia:** MIT
- **Fuente oficial:** https://www.chartjs.org/
- **Método de instalación:** descarga directa, copiada en `vendor/chartjs/`.
- **Dependencias relacionadas:** ninguna.
- **Estado:** adoptada, tras comparación directa con Apache ECharts (ver ficha de evaluación y matriz comparativa en `EVALUACION.md`).
- **Evidencia principal:** archivo de prueba con el gráfico de incidencias por categoría, construido antes de decidir; licencia guardada en `vendor/chartjs/`.
- **Riesgos identificados:** ninguno grave detectado en la prueba; la accesibilidad (lectores de pantalla) requeriría trabajo adicional propio, ya que Chart.js no ofrece soporte ARIA integrado como sí lo hace ECharts.

---

## Apache ECharts (evaluada, no adoptada)

- **Versión:** 5.6.0 (verificado en la fuente oficial)
- **Función dentro del proyecto:** ninguna en la versión final; se instaló únicamente para la comparación obligatoria de la sección 12.1 de la guía.
- **Licencia:** Apache License 2.0
- **Fuente oficial:** https://echarts.apache.org/
- **Método de instalación:** descarga directa, copiada en `vendor/echarts/` (carpeta de prueba).
- **Dependencias relacionadas:** ninguna.
- **Estado:** descartada para la versión final, conservada como evidencia de la comparación.
- **Evidencia principal:** archivo de prueba con el mismo gráfico de incidencias por categoría hecho con ECharts; licencia guardada en `vendor/echarts/`.
- **Riesgos identificados:** mayor tiempo de instalación e integración que Chart.js; el archivo de la librería es considerablemente más pesado (984 KB frente a 204 KB de Chart.js); requirió investigar más conceptos propios de su API antes de lograr el mismo resultado. A favor suyo: soporte de accesibilidad (ARIA) más completo de fábrica.

---

## JustValidate

- **Versión:** 4.3.0 (verificado en la fuente oficial)
- **Función dentro del proyecto:** validación declarativa de los formularios de usuarios e incidencias (campos requeridos, longitud mínima, formato de correo, selects no vacíos), reemplazando los `if` manuales que lanzaban `alert()`.
- **Licencia:** MIT
- **Fuente oficial:** https://github.com/horprogs/Just-validate (paquete npm: `just-validate`)
- **Método de instalación:** descarga directa del archivo `just-validate.production.min.js`, copiado en `vendor/just-validate/`.
- **Dependencias relacionadas:** ninguna; funciona con JavaScript nativo, sin necesitar jQuery.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/just-validate/LICENSE.md`.
- **Riesgos identificados:** requiere que el botón del formulario sea de tipo `submit` (no `button` con `onclick`) para poder interceptar el evento `submit` nativo; cambiar ese tipo obligó a mover toda la lógica de guardado que antes estaba en una función aparte hacia dentro de `.onSuccess()`.

---

## SweetAlert2

- **Versión:** 11.26.25 (verificado en la fuente oficial)
- **Función dentro del proyecto:** reemplaza todos los `alert()` y `confirm()` nativos del navegador: mensajes de éxito al crear/editar, y confirmación antes de eliminar o restaurar datos.
- **Licencia:** MIT
- **Fuente oficial:** https://sweetalert2.github.io/ (paquete npm: `sweetalert2`)
- **Método de instalación:** descarga directa de `sweetalert2.all.min.js` y `sweetalert2.min.css`, copiados en `vendor/sweetalert2/`.
- **Dependencias relacionadas:** ninguna.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/sweetalert2/LICENSE.txt`.
- **Riesgos identificados:** a diferencia de `confirm()`, que es síncrono, `Swal.fire(...)` es asíncrono y devuelve una promesa: el código que depende de la respuesta del usuario debe ir dentro del `.then()`, no después de la llamada.

---

## localForage

- **Versión:** 1.10.0 (verificado en la fuente oficial)
- **Función dentro del proyecto:** persiste los datos de usuarios e incidencias en el navegador (sobre IndexedDB) para que los cambios (crear, editar, eliminar) sobrevivan a un refresco de página (F5).
- **Licencia:** Apache License 2.0
- **Fuente oficial:** https://localforage.github.io/localForage/ (paquete npm: `localforage`)
- **Método de instalación:** descarga directa de `localforage.min.js`, copiado en `vendor/localforage/`.
- **Dependencias relacionadas:** ninguna.
- **Estado:** adoptada
- **Evidencia principal:** `vendor/localforage/LICENSE.txt`.
- **Riesgos identificados:**
  - El almacenamiento es un único "pool" por origen compartido entre todas las claves (`usuarios`, `incidencias`); `localforage.clear()` borraría ambas a la vez, por lo que se usó `localforage.removeItem(clave)` para que "restaurar datos" afecte solo su propia clave.
  - Cada operación de guardar o leer es asíncrona (devuelve una promesa). Olvidar llamar a `setItem` después de `push()`/`splice()` hace que el cambio solo exista en memoria y se pierda al recargar la página.

---

