/**
 * catalog.js
 * Gestiona el renderizado del catálogo de libros:
 *  - Filtrado por texto (título / autor)
 *  - Filtrado por categoría (género)
 *  - Paginación
 *  - Caso sin resultados
 */

/* ===== ESTADO DEL CATÁLOGO ===== */
let paginaActual = 1;       // Página activa en la paginación
let librosFiltrados = [];   // Subconjunto de libros según filtros activos

/* ------------------------------------------------------------------
   poblarCategorias()
   Lee las categorías únicas del arreglo `libros` y las agrega como
   <option> al selector de filtrado.
------------------------------------------------------------------ */
function poblarCategorias() {
    const select = document.getElementById("categoryFilter");

    // Obtener categorías únicas usando un Set
    const categorias = [...new Set(libros.map(libro => libro.categoria))].sort();

    categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

/* ------------------------------------------------------------------
   aplicarFiltros()
   Combina búsqueda por texto y filtrado por categoría.
   Reinicia la paginación a la página 1 y actualiza la vista.
------------------------------------------------------------------ */
function aplicarFiltros() {
    const textoBusqueda = document.getElementById("searchInput").value.trim().toLowerCase();
    const categoriaSeleccionada = document.getElementById("categoryFilter").value;

    // Filtrar con base en texto (título o autor) y categoría
    librosFiltrados = libros.filter(libro => {
        const coincideTexto =
            libro.titulo.toLowerCase().includes(textoBusqueda) ||
            libro.autor.toLowerCase().includes(textoBusqueda);

        const coincideCategoria =
            categoriaSeleccionada === "todas" || libro.categoria === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

    // Volver a la primera página tras aplicar filtros
    paginaActual = 1;
    renderizarPagina();
}

/* ------------------------------------------------------------------
   renderizarPagina()
   Calcula el slice de libros para la página actual y los renderiza.
   También actualiza los controles de paginación y el carrito.
------------------------------------------------------------------ */
function renderizarPagina() {
    const inicio = (paginaActual - 1) * LIBROS_POR_PAGINA;
    const fin = inicio + LIBROS_POR_PAGINA;
    const librosPagina = librosFiltrados.slice(inicio, fin);

    renderizarLibros(librosPagina);
    renderizarPaginacion();
}

/* ------------------------------------------------------------------
   renderizarLibros(lista)
   Construye las tarjetas HTML para cada libro recibido e inyecta
   el HTML resultante en el grid del catálogo.
   Si la lista está vacía, muestra el mensaje de sin resultados.
------------------------------------------------------------------ */
function renderizarLibros(lista) {
    const grid = document.getElementById("booksGrid");
    const noResults = document.getElementById("noResults");

    // Limpiar contenido previo
    grid.innerHTML = "";

    if (lista.length === 0) {
        // Mostrar aviso de sin coincidencias
        noResults.style.display = "flex";
        return;
    }

    noResults.style.display = "none";

    // Construir una tarjeta por cada libro
    lista.forEach(libro => {
        const stockAgotado = libro.stock === 0;

        // Obtener cantidad ya en carrito para calcular stock disponible real
        const carrito = obtenerCarrito();
        const itemEnCarrito = carrito.find(item => item.id === libro.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
        const stockDisponible = libro.stock - cantidadEnCarrito;

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("book-card");
        if (stockAgotado) tarjeta.classList.add("agotado");

        tarjeta.innerHTML = `
            <div class="book-image-wrapper">
                <img
                    src="${libro.imagen}"
                    alt="Portada de ${libro.titulo}"
                    class="book-cover"
                    onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'><i class=\\'fas fa-book\\'></i><p>Agregar imagen aquí</p></div>'"
                >
                ${stockAgotado ? '<span class="badge-agotado">Sin existencia</span>' : ""}
            </div>
            <div class="book-info">
                <h3 class="book-title">${libro.titulo}</h3>
                <p class="book-author">${libro.autor}</p>
                <p class="book-price">$${libro.precio.toFixed(2)}</p>
                <button
                    class="btn-add-cart"
                    onclick="agregarAlCarrito(${libro.id})"
                    ${stockAgotado || stockDisponible <= 0 ? "disabled" : ""}
                    aria-label="Agregar ${libro.titulo} al carrito"
                >
                    ${stockDisponible <= 0 && !stockAgotado
                        ? '<i class="fas fa-check"></i> En carrito'
                        : '<i class="fas fa-cart-plus"></i> Agregar al carrito'}
                </button>
            </div>
        `;

        grid.appendChild(tarjeta);
    });
}

/* ------------------------------------------------------------------
   renderizarPaginacion()
   Genera los botones de paginación basándose en el total de páginas
   calculado a partir de `librosFiltrados`.
------------------------------------------------------------------ */
function renderizarPaginacion() {
    const contenedor = document.getElementById("pagination");
    contenedor.innerHTML = "";

    const totalPaginas = Math.ceil(librosFiltrados.length / LIBROS_POR_PAGINA);

    // No mostrar paginación si solo hay una página o no hay resultados
    if (totalPaginas <= 1) return;

    // Botón "anterior"
    const btnAnterior = document.createElement("button");
    btnAnterior.innerHTML = '<i class="fas fa-chevron-left"></i>';
    btnAnterior.classList.add("page-btn", "page-prev");
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.setAttribute("aria-label", "Página anterior");
    btnAnterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
    contenedor.appendChild(btnAnterior);

    // Botones numerados
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.add("page-btn");
        if (i === paginaActual) btn.classList.add("active");
        btn.setAttribute("aria-label", `Página ${i}`);
        btn.addEventListener("click", () => cambiarPagina(i));
        contenedor.appendChild(btn);
    }

    // Botón "siguiente"
    const btnSiguiente = document.createElement("button");
    btnSiguiente.innerHTML = '<i class="fas fa-chevron-right"></i>';
    btnSiguiente.classList.add("page-btn", "page-next");
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.setAttribute("aria-label", "Página siguiente");
    btnSiguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));
    contenedor.appendChild(btnSiguiente);
}

/* ------------------------------------------------------------------
   cambiarPagina(numeroPagina)
   Actualiza la página activa y vuelve a renderizar.
------------------------------------------------------------------ */
function cambiarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    renderizarPagina();
    // Hacer scroll suave al inicio del catálogo
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
}

/* ------------------------------------------------------------------
   inicializarCatalogo()
   Punto de entrada: carga categorías, inicializa librosFiltrados
   con todo el catálogo y renderiza la primera página.
------------------------------------------------------------------ */
function inicializarCatalogo() {
    poblarCategorias();
    librosFiltrados = [...libros]; // copia del arreglo completo
    renderizarPagina();
}
