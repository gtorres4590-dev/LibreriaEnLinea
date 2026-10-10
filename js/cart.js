/**
 * cart.js
 * Gestiona toda la lógica del carrito de compras:
 *  - Lectura / escritura en localStorage
 *  - Agregar, eliminar y vaciar productos
 *  - Render del modal del carrito
 *  - Apertura / cierre del modal
 *  - Proceso de pago
 */

/* ===== CLAVE DE LOCALSTROAGE =====
   Todas las operaciones de persistencia usan esta clave.
*/
const STORAGE_KEY = "carrito_el_tunel";

/* ------------------------------------------------------------------
   obtenerCarrito()
   Lee el carrito desde localStorage y lo devuelve como arreglo.
   Si no existe ningún carrito guardado, devuelve un arreglo vacío.
------------------------------------------------------------------ */
function obtenerCarrito() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
}

/* ------------------------------------------------------------------
   guardarCarrito(carrito)
   Serializa el arreglo recibido y lo persiste en localStorage.
------------------------------------------------------------------ */
function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

/* ------------------------------------------------------------------
   actualizarContadorCarrito()
   Calcula la cantidad total de artículos en el carrito y actualiza
   el badge visible en el ícono del header.
------------------------------------------------------------------ */
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();

    // Sumar todas las cantidades de los items
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const contador = document.getElementById("cartCounter");
    contador.textContent = total;

    // Mostrar/ocultar el badge según si hay artículos
    contador.style.display = total > 0 ? "flex" : "none";
}

/* ------------------------------------------------------------------
   agregarAlCarrito(idLibro)
   Busca el libro por su id, verifica stock disponible y lo agrega
   al carrito (o incrementa la cantidad si ya existe).
   Guarda el carrito actualizado y refresca la vista.
------------------------------------------------------------------ */
function agregarAlCarrito(idLibro) {
    // Buscar el libro en el catálogo
    const libro = libros.find(l => l.id === idLibro);
    if (!libro) return;

    const carrito = obtenerCarrito();
    const indexExistente = carrito.findIndex(item => item.id === idLibro);

    if (indexExistente !== -1) {
        // El libro ya está en el carrito: verificar si hay más stock
        const cantidadActual = carrito[indexExistente].cantidad;
        if (cantidadActual >= libro.stock) {
            alert(`Lo sentimos, solo hay ${libro.stock} ejemplar(es) disponibles de "${libro.titulo}".`);
            return;
        }
        carrito[indexExistente].cantidad++;
    } else {
        // Libro nuevo en el carrito
        if (libro.stock === 0) {
            alert(`"${libro.titulo}" no tiene existencia disponible.`);
            return;
        }
        carrito.push({
            id: libro.id,
            titulo: libro.titulo,
            autor: libro.autor,
            precio: libro.precio,
            imagen: libro.imagen,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();

    // Re-renderizar las tarjetas para reflejar el stock actualizado
    renderizarPagina();
}

/* ------------------------------------------------------------------
   eliminarDelCarrito(idLibro)
   Remueve completamente un libro del carrito por su id.
------------------------------------------------------------------ */
function eliminarDelCarrito(idLibro) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== idLibro);
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    renderizarModalCarrito();
    renderizarPagina(); // Actualizar botones en el catálogo
}

/* ------------------------------------------------------------------
   vaciarCarrito()
   Elimina todos los artículos del carrito con confirmación previa.
------------------------------------------------------------------ */
function vaciarCarrito() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    const confirmar = confirm("¿Deseas vaciar todo el carrito de compras?");
    if (!confirmar) return;

    guardarCarrito([]);
    actualizarContadorCarrito();
    renderizarModalCarrito();
    renderizarPagina();
}

/* ------------------------------------------------------------------
   calcularTotal(carrito)
   Devuelve el precio total sumando precio × cantidad de cada item.
------------------------------------------------------------------ */
function calcularTotal(carrito) {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

/* ------------------------------------------------------------------
   renderizarModalCarrito()
   Actualiza el contenido del modal con los libros en el carrito,
   la cantidad de cada uno y el precio total.
------------------------------------------------------------------ */
function renderizarModalCarrito() {
    const body = document.getElementById("cartModalBody");
    const totalSpan = document.getElementById("cartTotal");
    const carrito = obtenerCarrito();

    // Limpiar contenido anterior
    body.innerHTML = "";

    if (carrito.length === 0) {
        // Carrito vacío: mostrar mensaje
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío. ¡Agrega algunos libros!</p>
            </div>
        `;
        totalSpan.textContent = "$0.00";
        return;
    }

    // Renderizar cada item del carrito
    carrito.forEach(item => {
        const fila = document.createElement("div");
        fila.classList.add("cart-item");

        fila.innerHTML = `
            <div class="cart-item-image">
                <img
                    src="${item.imagen}"
                    alt="Portada de ${item.titulo}"
                    onerror="this.parentElement.innerHTML='<div class=\\'cart-img-placeholder\\'><i class=\\'fas fa-book\\'></i></div>'"
                >
            </div>
            <div class="cart-item-info">
                <p class="cart-item-title">${item.titulo}</p>
                <p class="cart-item-price">$${item.precio.toFixed(2)}</p>
                <p class="cart-item-qty">Cantidad: ${item.cantidad}</p>
            </div>
            <button
                class="cart-item-remove"
                onclick="eliminarDelCarrito(${item.id})"
                aria-label="Eliminar ${item.titulo} del carrito"
                title="Eliminar del carrito"
            >
                <i class="fas fa-times"></i>
            </button>
        `;

        body.appendChild(fila);
    });

    // Mostrar el total calculado
    const total = calcularTotal(carrito);
    totalSpan.textContent = `$${total.toFixed(2)}`;
}

/* ------------------------------------------------------------------
   abrirCarrito()
   Renderiza el contenido actualizado y muestra el modal del carrito.
------------------------------------------------------------------ */
function abrirCarrito() {
    renderizarModalCarrito();
    const overlay = document.getElementById("cartModalOverlay");
    overlay.classList.add("visible");
    document.body.classList.add("modal-open"); // Bloquear scroll del body
}

/* ------------------------------------------------------------------
   cerrarCarrito()
   Oculta el modal del carrito.
------------------------------------------------------------------ */
function cerrarCarrito() {
    const overlay = document.getElementById("cartModalOverlay");
    overlay.classList.remove("visible");
    document.body.classList.remove("modal-open");
}

/* ------------------------------------------------------------------
   procesarPago()
   Verifica que el carrito no esté vacío antes de proceder al pago.
   Si está vacío, notifica al usuario.
   Si tiene artículos, simula el proceso de pago y limpia el carrito.
------------------------------------------------------------------ */
function procesarPago() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega libros antes de proceder al pago.");
        return;
    }

    const total = calcularTotal(carrito);
    const confirmar = confirm(
        `¿Confirmas tu compra por un total de $${total.toFixed(2)}?\n\nGracias por comprar en El Túnel.`
    );

    if (confirmar) {
        // Descontar el stock de los libros comprados
        carrito.forEach(item => {
            const libro = libros.find(l => l.id === item.id);
            if (libro) {
                libro.stock = Math.max(0, libro.stock - item.cantidad);
            }
        });

        // Vaciar el carrito tras el pago
        guardarCarrito([]);
        actualizarContadorCarrito();
        cerrarCarrito();
        renderizarPagina();

        alert("¡Compra realizada con éxito! Gracias por tu preferencia. 📚");
    }
}

/* ------------------------------------------------------------------
   handleNewsletter(event)
   Maneja el envío del formulario del newsletter en el footer.
------------------------------------------------------------------ */
function handleNewsletter(event) {
    event.preventDefault();
    const input = event.target.querySelector("input[type='email']");
    alert(`¡Gracias por suscribirte con ${input.value}! Te mantendremos al tanto de nuestras novedades.`);
    input.value = "";
}

/* ------------------------------------------------------------------
   inicializarCarrito()
   Registra los eventos del carrito: abrir, cerrar, vaciar y pagar.
   También actualiza el contador al cargar la página.
------------------------------------------------------------------ */
function inicializarCarrito() {
    // Abrir modal al clic en el ícono del carrito
    document.getElementById("cartIconWrapper").addEventListener("click", abrirCarrito);

    // Cerrar modal con el botón X
    document.getElementById("cartCloseBtn").addEventListener("click", cerrarCarrito);

    // Cerrar modal al clic fuera del cuadro (en el overlay)
    document.getElementById("cartModalOverlay").addEventListener("click", function (e) {
        if (e.target === this) cerrarCarrito();
    });

    // Vaciar carrito
    document.getElementById("emptyCartBtn").addEventListener("click", vaciarCarrito);

    // Proceder al pago
    document.getElementById("checkoutBtn").addEventListener("click", procesarPago);

    // Actualizar el contador con los datos persistidos en localStorage
    actualizarContadorCarrito();
}
