/**
 * data.js
 * Contiene el catálogo de libros de la tienda El Túnel.
 * Cada libro es un objeto con las propiedades necesarias para
 * renderizar su tarjeta y gestionar el carrito y el stock.
 */

/* ===== CATÁLOGO DE LIBROS =====
   Estructura de cada libro:
   - id        : identificador único (number)
   - titulo    : título del libro (string)
   - autor     : nombre del autor (string)
   - precio    : precio en pesos (number)
   - categoria : género literario (string)
   - stock     : ejemplares disponibles (number)
   - imagen    : ruta relativa a la imagen de portada (string)
*/
const libros = [
    {
        id: 1,
        titulo: "El Gran Gatsby",
        autor: "Francis Scott Fitzgerald",
        precio: 547.90,
        categoria: "Clásico",
        stock: 3,
        imagen: "img/portadas/gran-gatsby.jpg"
    },
    {
        id: 2,
        titulo: "Como agua para chocolate",
        autor: "Laura Esquivel",
        precio: 319.00,
        categoria: "Novela",
        stock: 5,
        imagen: "img/portadas/agua-chocolate.jpg"
    },
    {
        id: 3,
        titulo: "Una habitación propia",
        autor: "Virginia Woolf",
        precio: 199.00,
        categoria: "Ensayo",
        stock: 4,
        imagen: "img/portadas/habitacion-propia.jpg"
    },
    {
        id: 4,
        titulo: "Los recuerdos del porvenir",
        autor: "Elena Garro",
        precio: 429.00,
        categoria: "Novela",
        stock: 2,
        imagen: "img/portadas/recuerdos-porvenir.jpg"
    },
    {
        id: 5,
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        precio: 389.00,
        categoria: "Realismo mágico",
        stock: 6,
        imagen: "img/portadas/cien-anos.jpg"
    },
    {
        id: 6,
        titulo: "Pedro Páramo",
        autor: "Juan Rulfo",
        precio: 249.00,
        categoria: "Novela",
        stock: 7,
        imagen: "img/portadas/pedro-paramo.jpg"
    },
    {
        id: 7,
        titulo: "La sombra del viento",
        autor: "Carlos Ruiz Zafón",
        precio: 459.00,
        categoria: "Misterio",
        stock: 3,
        imagen: "img/portadas/sombra-viento.jpg"
    },
    {
        id: 8,
        titulo: "El amor en los tiempos del cólera",
        autor: "Gabriel García Márquez",
        precio: 369.00,
        categoria: "Realismo mágico",
        stock: 4,
        imagen: "img/portadas/amor-colera.jpg"
    },
    {
        id: 9,
        titulo: "Mujercitas",
        autor: "Louisa May Alcott",
        precio: 289.00,
        categoria: "Clásico",
        stock: 5,
        imagen: "img/portadas/mujercitas.jpg"
    },
    {
        id: 10,
        titulo: "Fahrenheit 451",
        autor: "Ray Bradbury",
        precio: 329.00,
        categoria: "Ciencia ficción",
        stock: 2,
        imagen: "img/portadas/fahrenheit.jpg"
    },
    {
        id: 11,
        titulo: "El principito",
        autor: "Antoine de Saint-Exupéry",
        precio: 179.00,
        categoria: "Fábula",
        stock: 8,
        imagen: "img/portadas/principito.jpg"
    },
    {
        id: 12,
        titulo: "1984",
        autor: "George Orwell",
        precio: 349.00,
        categoria: "Ciencia ficción",
        stock: 4,
        imagen: "img/portadas/1984.jpg"
    },
    {
        id: 13,
        titulo: "Don Quijote de la Mancha",
        autor: "Miguel de Cervantes",
        precio: 499.00,
        categoria: "Clásico",
        stock: 3,
        imagen: "img/portadas/quijote.jpg"
    },
    {
        id: 14,
        titulo: "Rayuela",
        autor: "Julio Cortázar",
        precio: 379.00,
        categoria: "Novela",
        stock: 0,
        imagen: "img/portadas/rayuela.jpg"
    },
    {
        id: 15,
        titulo: "El túnel",
        autor: "Ernesto Sábato",
        precio: 259.00,
        categoria: "Novela",
        stock: 6,
        imagen: "img/portadas/el-tunel.jpg"
    },
    {
        id: 16,
        titulo: "Orgullo y prejuicio",
        autor: "Jane Austen",
        precio: 319.00,
        categoria: "Clásico",
        stock: 5,
        imagen: "img/portadas/orgullo-prejuicio.jpg"
    },
    {
        id: 17,
        titulo: "La metamorfosis",
        autor: "Franz Kafka",
        precio: 219.00,
        categoria: "Clásico",
        stock: 7,
        imagen: "img/portadas/metamorfosis.jpg"
    },
    {
        id: 18,
        titulo: "Sapiens",
        autor: "Yuval Noah Harari",
        precio: 489.00,
        categoria: "No ficción",
        stock: 4,
        imagen: "img/portadas/sapiens.jpg"
    },
    {
        id: 19,
        titulo: "El alquimista",
        autor: "Paulo Coelho",
        precio: 279.00,
        categoria: "Novela",
        stock: 9,
        imagen: "img/portadas/alquimista.jpg"
    },
    {
        id: 20,
        titulo: "Ficciones",
        autor: "Jorge Luis Borges",
        precio: 339.00,
        categoria: "Cuentos",
        stock: 3,
        imagen: "img/portadas/ficciones.jpg"
    }
];

/* ===== CONFIGURACIÓN DE PAGINACIÓN =====
   Número de libros que se muestran por página en el catálogo.
*/
const LIBROS_POR_PAGINA = 4;
