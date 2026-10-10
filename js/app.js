/**
 * app.js
 * Punto de entrada principal de la aplicación.
 * Inicializa el catálogo, el carrito y los eventos globales
 * una vez que el DOM está completamente cargado.
 */

document.addEventListener("DOMContentLoaded", function () {

    /* ===== INICIALIZAR MÓDULOS ===== */
    inicializarCarrito();   // Registra eventos del carrito (cart.js)
    inicializarCatalogo();  // Carga libros y paginación  (catalog.js)
    registrarEventosBusqueda();

    /* ===== CERRAR MODAL CON TECLA ESCAPE ===== */
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") cerrarCarrito();
    });
});

/* ------------------------------------------------------------------
   registrarEventosBusqueda()
   Asocia los eventos de búsqueda y filtrado por categoría para que
   se ejecuten de forma reactiva conforme el usuario escribe o cambia
   la categoría seleccionada.
------------------------------------------------------------------ */
function registrarEventosBusqueda() {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryFilter = document.getElementById("categoryFilter");

    // Búsqueda al presionar el botón
    searchBtn.addEventListener("click", aplicarFiltros);

    // Búsqueda en tiempo real mientras se escribe (con debounce)
    let debounceTimer;
    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(aplicarFiltros, 300);
    });

    // Búsqueda al presionar Enter en el campo de texto
    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            clearTimeout(debounceTimer);
            aplicarFiltros();
        }
    });

    // Filtrado reactivo al cambiar de categoría
    categoryFilter.addEventListener("change", aplicarFiltros);
}
