# EVALUACION.md — OpenDesk


## Ficha 1: Bootstrap

| Campo | Registro |
| Tecnología y versión | Bootstrap 5.3.8 |
| Necesidad que resuelve | Interfaz visual, navegación, formularios, estructura del modal |
| Sitio o repositorio oficial | https://getbootstrap.com/ |
| Licencia | MIT |
| Método de instalación | Descarga directa (.zip compilado), sin npm |
| Archivos incorporados | `css/bootstrap.min.css`, `js/bootstrap.bundle.min.js`|
| Tamaño aproximado | 8.24 mb|
| Dependencias adicionales | Popper.js (incluido en el bundle; no se usa activamente en el modal, que se controla con JS propio) |
| Tiempo de integración | 30 minutos |
| Calidad de documentación (1 a 5) | 5 — documentación oficial clara, con ejemplos de cada componente |
| Compatibilidad con el proyecto | Alta; único ajuste necesario fue resolver el conflicto entre `display: flex` propio y el centrado de `modal-dialog-centered` |
| Funcionamiento responsive | Confirmado: el modal, la tabla y el sidebar se probaron en escritorio y en modo responsive del navegador |
| Evidencia de mantenimiento | Proyecto activo en GitHub, versión 5.3.8 reciente dentro de la serie 5.x |
| Riesgos encontrados | Se carga el JS completo del framework sin usar su plugin de modales; el ancho del modal se rompía al mezclar `flex` propio con las clases de tamaño de Bootstrap, por convertir a `modal-dialog` en un hijo flex que se encogía a su contenido |
| Decisión | [x] Adoptar |
| Justificación | Tecnología obligatoria del reto; resolvió estructura visual, formularios y tablas con poco código propio adicional una vez entendido el conflicto de `display` |

---

## Ficha 2: jQuery

| Campo | Registro |
| Tecnología y versión | jQuery 3.7.1 (minified) |
| Necesidad que resuelve | Dependencia obligatoria de DataTables |
| Sitio o repositorio oficial | https://jquery.com/ |
| Licencia | MIT |
| Método de instalación | Descarga directa del archivo minificado (variante completa, no "slim") |
| Archivos incorporados | `jquery-3.7.1.min.js` |
| Tamaño aproximado |86,5 KB |
| Dependencias adicionales | Ninguna |
| Tiempo de integración | Rápido: un solo archivo, sin configuración |
| Calidad de documentación (1 a 5) |  |
| Compatibilidad con el proyecto | Alta, confirmada al funcionar sin errores junto con DataTables 3.1.2 |
| Funcionamiento responsive | No aplica (es una librería de lógica, no de estilos) |
| Evidencia de mantenimiento | Proyecto con actualizaciones activas (existe ya una versión 4.0.0), aunque se prefirió la serie 3.x por compatibilidad |
| Riesgos encontrados | Se descartó la versión 4.0.0 por eliminar métodos que el ecosistema de DataTables podría usar, sin confirmación oficial de compatibilidad; se prefirió la 3.7.1, que funcionó sin inconvenientes |
| Decisión | [x] Adoptar |
| Justificación | Dependencia obligatoria de DataTables; se eligió la versión más segura dentro de las compatibles conocidas, y el resultado confirmó que fue la decisión correcta |

---

## Ficha 3: DataTables (+ Buttons y Responsive)

| Campo | Registro |
| Tecnología y versión | DataTables 3.1.2, con extensiones Buttons y Responsive |
| Necesidad que resuelve | Búsqueda, ordenamiento, paginación, adaptación responsive y exportación de la tabla de usuarios |
| Sitio o repositorio oficial | https://datatables.net/ |
| Licencia | MIT |
| Método de instalación | Download builder oficial, con styling framework Bootstrap 5 |
| Archivos incorporados | `css/datatables.min.css`, `js/datatables.min.js`, `es-ES.json` (idioma) |
| Tamaño aproximado | 926 KB|
| Dependencias adicionales | jQuery (obligatoria); JSZip (para Excel); pdfmake y vfs_fonts (para PDF) |
| Tiempo de integración | Moderado: la inicialización simple fue rápida, pero el ciclo de destruir/reinicializar en cada actualización y la configuración correcta de Buttons (anidación de `exportOptions`, `title`, `filename`) tomaron varias iteraciones |
| Calidad de documentación (1 a 5) | 4 — la documentación cubre todos los casos usados, pero la relación de prioridad entre configuración general (`Buttons.defaults`) y configuración específica por tipo de botón no quedó clara a la primera lectura |
| Compatibilidad con el proyecto | Alta, una vez resuelto el ciclo de reinicialización |
| Funcionamiento responsive | Confirmado en 360px: columnas menos prioritarias (correo, departamento, rol, activo, id) se ocultan primero, con botón de expansión; nombre y acciones quedan siempre visibles |
| Evidencia de mantenimiento | Proyecto con historial largo y actualizaciones recientes según el download builder |
| Riesgos encontrados | Depende de jQuery; inicializar sobre un `<tbody>` en vez de la `<table>` genera error; reinicializar sin destruir primero genera conflicto; la configuración de `exportOptions`, `title` y `filename` debe ir en el nivel correcto del objeto de cada botón, o la configuración interna de la librería la sobreescribe sin avisar |
| Decisión | [x] Adoptar |
| Justificación | Tecnología obligatoria del reto; una vez resueltos los conflictos de inicialización y configuración de Buttons, cumplió todos los requisitos de la guía: idioma, tamaños de página, responsive y exportación completa |

---

## Ficha 4: JSZip

| Campo | Registro |
| Tecnología y versión | JSZip 3.10.2 |
| Necesidad que resuelve | Generación del archivo `.xlsx` para el botón "Excel" de DataTables Buttons |
| Sitio o repositorio oficial | https://stuk.github.io/jszip/ |
| Licencia | Doble licencia: MIT o GPLv3 (se adopta MIT para este proyecto) |
| Método de instalación | Descarga directa |
| Archivos incorporados | `jszip.js`, `jszip.min.js` |
| Tamaño aproximado | 494 KB |
| Dependencias adicionales | Ninguna propia |
| Tiempo de integración | Bajo: no requiere configuración propia, DataTables Buttons la usa internamente |
| Calidad de documentación (1 a 5) |  |
| Compatibilidad con el proyecto | Confirmada: el botón "Excel" genera el archivo correctamente |
| Funcionamiento responsive | No aplica |
| Evidencia de mantenimiento | Repositorio activo en GitHub |
| Riesgos encontrados | Doble licencia: es necesario elegir y documentar explícitamente cuál se aplica (MIT), a diferencia de otras librerías del proyecto con licencia única |
| Decisión | [x] Adoptar |
| Justificación | Requisito técnico obligatorio para que funcione la exportación a Excel pedida por la guía |

---

## Ficha 5: pdfmake (+ vfs_fonts)

| Campo | Registro |
| Tecnología y versión | pdfmake 0.2.21 |
| Necesidad que resuelve | Generación del PDF para el botón "PDF" de DataTables Buttons y la vista de impresión |
| Sitio o repositorio oficial | https://github.com/bpampuch/pdfmake |
| Licencia | MIT |
| Método de instalación | Descarga directa |
| Archivos incorporados | `pdfmake.js`, `vfs_fonts.js` |
| Tamaño aproximado | 3,52 MB |
| Dependencias adicionales | Ninguna propia |
| Tiempo de integración | Bajo, una vez identificada la versión estable correcta |
| Calidad de documentación (1 a 5) |  |
| Compatibilidad con el proyecto | Confirmada: el botón "PDF" y la vista de impresión funcionan con el título "Reporte de usuarios" |
| Funcionamiento responsive | No aplica |
| Evidencia de mantenimiento | Repositorio activo; la propia documentación advierte cuál rama es estable y cuál no |
| Riesgos encontrados | La rama de desarrollo (0.3.x) está marcada como inestable por los propios mantenedores; se evitó instalarla y se usó la serie estable 0.2.x |
| Decisión | [x] Adoptar |
| Justificación | Requisito técnico obligatorio para la exportación a PDF pedida por la guía; se prefirió la versión estable sobre la más reciente por menor riesgo |

---

## Ficha 6: Chart.js

| Campo | Registro |
| Tecnología y versión | Chart.js 4.5.0 |
| Necesidad que resuelve | Gráficos del dashboard: incidencias por categoría e incidencias por estado |
| Sitio o repositorio oficial | https://www.chartjs.org/ |
| Licencia | MIT |
| Método de instalación | Descarga directa |
| Archivos incorporados | Librería principal en `vendor/chartjs/` |
| Tamaño aproximado | 204 KB  |
| Dependencias adicionales | Ninguna |
| Tiempo de integración | Menor que ECharts; la sintaxis de `type`/`data`/`labels`/`datasets`/`options` resultó más directa de entender |
| Calidad de documentación (1 a 5) | 4 — resultó más fácil de seguir que la de ECharts para este caso de uso concreto |
| Compatibilidad con el proyecto | Alta; se integró sobre un `<canvas>` sin conflicto con Bootstrap ni DataTables |
| Funcionamiento responsive | Sí, mediante `options: { responsive: true }` |
| Evidencia de mantenimiento | Proyecto activo y ampliamente usado |
| Riesgos encontrados | Requiere trabajo adicional propio para accesibilidad (no trae soporte ARIA integrado, a diferencia de ECharts) |
| Decisión | [x] Adoptar |
| Justificación | Menor tiempo de instalación e integración, menor tamaño de archivo, y documentación que resultó más clara en la prueba directa; la hipótesis inicial se confirmó con evidencia |

---

## Ficha 7: Apache ECharts (evaluada, no adoptada)

| Campo | Registro |
| Tecnología y versión | Apache ECharts 5.6.0 |
| Necesidad que resuelve | Se evaluó como alternativa a Chart.js para los mismos dos gráficos del dashboard |
| Sitio o repositorio oficial | https://echarts.apache.org/ |
| Licencia | Apache License 2.0 |
| Método de instalación | Descarga directa |
| Archivos incorporados | Librería principal en `vendor/echarts/`  |
| Tamaño aproximado | 984 KB |
| Dependencias adicionales | Ninguna |
| Tiempo de integración | Mayor que Chart.js; requirió investigar conceptos propios de su API no vistos antes |
| Calidad de documentación (1 a 5) | 3 — generó más dudas durante la integración que la de Chart.js |
| Compatibilidad con el proyecto | Confirmada mediante prueba, pero no se adoptó por los criterios de la matriz |
| Funcionamiento responsive | Sí |
| Evidencia de mantenimiento | Proyecto de la Apache Software Foundation, activo |
| Riesgos encontrados | Archivo considerablemente más pesado; mayor curva de aprendizaje para este proyecto puntual |
| Decisión | [ ] Descartar |
| Justificación | Aunque tiene mejor soporte de accesibilidad (ARIA) de fábrica, Chart.js resultó más simple, liviana y rápida de integrar para el alcance de este dashboard. Se conserva como evidencia de la comparación exigida por la guía (sección 12.1) |

---

## Matriz comparativa: Chart.js vs Apache ECharts

| Criterio | Chart.js | ECharts |
| Tiempo de instalación | Menor | Mayor |
| Tiempo de integración | Menor | Mayor |
| Código aproximado | ~25 líneas | ~24 líneas |
| Tamaño de archivo | 204 KB | 984 KB |
| Claridad de documentación | Más clara para este caso | Generó más dudas |
| Responsive | Sí (`responsive: true`) | Sí |
| Personalización básica | Similar | Similar |
| Accesibilidad | Requiere trabajo adicional propio | Soporte ARIA de fábrica |
| Licencia | MIT | Apache License 2.0 |

**Hipótesis previa:** se consideró que Chart.js sería más adecuada por su integración aparentemente más simple.

**Resultado:** la evidencia **confirmó** la hipótesis. Chart.js resultó más fácil de integrar, con menor tiempo de instalación e investigación adicional necesaria, y un archivo considerablemente más liviano. ECharts ofrece mejor soporte de accesibilidad de fábrica, pero ese beneficio no compensó, para el alcance de este proyecto, el mayor tiempo de integración y peso del archivo.

---

## Ficha 8: JustValidate

| Campo | Registro |
| Tecnología y versión | JustValidate 4.3.0 |
| Necesidad que resuelve | Validación de los formularios de usuarios e incidencias (campos requeridos, longitud mínima, formato de correo, selects obligatorios) |
| Sitio o repositorio oficial | https://github.com/horprogs/Just-validate |
| Licencia | MIT |
| Método de instalación | Descarga directa del archivo minificado de producción |
| Archivos incorporados | `just-validate.production.min.js` |
| Tamaño aproximado | 32 KB |
| Dependencias adicionales | Ninguna |
| Tiempo de integración | Moderado: la API declarativa (`addField`/`onSuccess`) es sencilla, pero migrar la lógica de guardado que antes estaba en una función aparte hacia dentro de `.onSuccess()`, y cambiar el botón de `button`+`onclick` a `submit`, tomó varias iteraciones y repaso de conceptos (evento `submit` nativo) |
| Calidad de documentación (1 a 5) | 4 — ejemplos claros de reglas básicas, aunque las reglas personalizadas (`validator`) requirieron revisar el código fuente para confirmar la forma correcta |
| Compatibilidad con el proyecto | Alta; no depende de jQuery ni de ninguna otra librería del proyecto |
| Funcionamiento responsive | No aplica (es lógica de validación, no de estilos); los mensajes de error se probaron visibles en 360px |
| Evidencia de mantenimiento | Repositorio activo en GitHub |
| Riesgos encontrados | Exige que el botón de envío sea de tipo `submit` para interceptar el evento; cambiar ese tipo rompe cualquier `onclick` que llamara directamente a la función de guardado anterior |
| Decisión | [x] Adoptar |
| Justificación | Reemplaza validaciones manuales con `if`/`alert()` por una solución declarativa, reduce código propio repetido y da mensajes de error visibles junto a cada campo, cumpliendo el criterio de accesibilidad de no depender solo de una alerta genérica |

---

## Ficha 9: SweetAlert2

| Campo | Registro |
| Tecnología y versión | SweetAlert2 11.26.25 |
| Necesidad que resuelve | Reemplazar `alert()` y `confirm()` nativos por mensajes de éxito y confirmaciones antes de eliminar o restaurar datos |
| Sitio o repositorio oficial | https://sweetalert2.github.io/ |
| Licencia | MIT |
| Método de instalación | Descarga directa |
| Archivos incorporados | `sweetalert2.all.min.js`, `sweetalert2.min.css` |
| Tamaño aproximado | 112 KB (JS + CSS) |
| Dependencias adicionales | Ninguna |
| Tiempo de integración | Moderado: la sintaxis de `Swal.fire({...})` es simple, pero entender que es asíncrona (`.then()`) y que el código de confirmación debe ir dentro de esa promesa, no después, generó confusión inicial y un bug donde el mensaje de éxito se mostraba incluso si se cancelaba |
| Calidad de documentación (1 a 5) | 5 — ejemplos oficiales cubren exactamente los casos usados (confirmación con íconos, alertas simples) |
| Compatibilidad con el proyecto | Alta; no depende de ninguna otra librería del proyecto |
| Funcionamiento responsive | Confirmado en 360, 768 y 1440 px; los diálogos se adaptan al ancho de pantalla |
| Evidencia de mantenimiento | Repositorio muy activo, con versiones frecuentes |
| Riesgos encontrados | Ser asíncrona es un cambio de paradigma frente a `confirm()`; cualquier código que dependa de la respuesta del usuario debe ir dentro del `.then()` |
| Decisión | [x] Adoptar |
| Justificación | Mejora la accesibilidad y la experiencia frente a los diálogos nativos del navegador, y permite mensajes más claros de confirmación antes de acciones irreversibles (eliminar, restaurar) |

---

## Ficha 10: localForage

| Campo | Registro |
| Tecnología y versión | localForage 1.10.0 |
| Necesidad que resuelve | Persistir los datos de usuarios e incidencias en el navegador para que los cambios sobrevivan a un refresco de página (F5) |
| Sitio o repositorio oficial | https://localforage.github.io/localForage/ |
| Licencia | Apache License 2.0 |
| Método de instalación | Descarga directa |
| Archivos incorporados | `localforage.min.js` |
| Tamaño aproximado | 32 KB |
| Dependencias adicionales | Ninguna |
| Tiempo de integración | Alto en comparación con las demás: requirió entender promesas (`.then()`), la diferencia entre `undefined` y `null` como valor de retorno de `getItem()`, y rediseñar el flujo de carga original (XHR síncrono en la práctica) para que esperara primero a localForage |
| Calidad de documentación (1 a 5) | 4 — la API es muy simple (`getItem`/`setItem`/`removeItem`/`clear`), aunque no advierte explícitamente que el almacenamiento es compartido por origen hasta que se lee con atención |
| Compatibilidad con el proyecto | Alta; funciona con JavaScript nativo, sin depender de otra librería del proyecto |
| Funcionamiento responsive | No aplica (es almacenamiento, no interfaz) |
| Evidencia de mantenimiento | Repositorio con historial largo, aunque de menor actividad reciente que otras librerías del proyecto; se mantiene estable y ampliamente usado |
| Riesgos encontrados | El almacenamiento es un único pool por origen: `clear()` borraría las claves de usuarios e incidencias a la vez, por lo que se usó `removeItem(clave)` para que cada módulo restaure solo sus propios datos. Olvidar llamar a `setItem` tras modificar el arreglo en memoria causa pérdida de datos al recargar, error detectado y corregido durante el desarrollo |
| Decisión | [x] Adoptar |
| Justificación | Cumple el requisito de persistencia local sin backend ni base de datos, manteniéndose dentro de las reglas técnicas del proyecto (solo HTML/CSS/JS/JSON) |