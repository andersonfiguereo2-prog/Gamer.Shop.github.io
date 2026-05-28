// VARIABLES
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

// Cargar todos los event listeners
cargarEventListeners();

function cargarEventListeners() {
    // Al usar document directamente, escuchamos los clicks en TODA la página
    document.addEventListener('click', agregarProducto);

    // Elimina productos del carrito
    carrito.addEventListener('click', eliminarProducto);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; 
        limpiarHTML(); 
    });
}

// FUNCIONES

// Función para añadir el producto al bloque del carrito
function agregarProducto(e) {
    // Verificamos si el elemento clickeado tiene la clase para agregar al carrito
    if(e.target.classList.contains('agregar-carrito')) {
        e.preventDefault();
        
        // Buscamos el contenedor '.blog-1' más cercano hacia arriba
        const tarjetaProducto = e.target.closest('.blog-1');
        
        if (tarjetaProducto) {
            leerDatosProducto(tarjetaProducto);
        }
    }
}

// Elimina un producto del carrito en el HTML
function eliminarProducto(e) {
    if(e.target.classList.contains('borrar-producto')) {
        e.preventDefault();
        const productoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
        carritoHTML(); 
    }
}

// Lee el contenido del producto y extrae la información exacta
function leerDatosProducto(tarjeta) {
    // Extraemos la imagen que está directo en la tarjeta
    const imagenSrc = tarjeta.querySelector('img') ? tarjeta.querySelector('img').src : '';
    
    // Obtenemos el ID del botón de esa tarjeta
    const boton = tarjeta.querySelector('.agregar-carrito');
    const id = boton.getAttribute('data-id');

    // Procesamos el título y precio según la estructura de la tarjeta
    let titulo = "PC GAMER ARMADA";
    let precio = "$0";

    if (tarjeta.querySelector('h3')) {
        // Estructura de las 3 primeras (Productos)
        titulo = tarjeta.querySelector('h3').textContent;
        precio = tarjeta.querySelector('.price').textContent;
    } else {
        // Estructura de las 3 últimas (Servicios con etiquetas <p>)
        const textoParrafo = tarjeta.querySelector('.blog-txt p');
        if (textoParrafo) {
            // Dividimos el texto del primer párrafo roto por el <br>
            const lineas = textoParrafo.innerHTML.split('<br>');
            if (lineas.length >= 2) {
                titulo = lineas[0].trim();
                precio = lineas[1].trim();
            }
        }
    }

    // Crear el objeto con la información limpia
    const infoProducto = {
        imagen: imagenSrc,
        titulo: titulo,
        precio: precio,
        id: id,
        cantidad: 1
    }

    // Revisa si el elemento ya existe en el carrito
    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if(existe) {
        articulosCarrito = articulosCarrito.map(producto => {
            if(producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto; 
            } else {
                return producto; 
            }
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    carritoHTML();
}

// Muestra el carrito de compras en la tabla
function carritoHTML() {
    limpiarHTML();

    articulosCarrito.forEach(producto => {
        const { imagen, titulo, precio, cantidad, id } = producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="60" style="border-radius: 4px; object-fit: cover;">
            </td>
            <td style="color: #fff; padding: 10px 5px; font-size: 14px;">${titulo}</td>
            <td style="color: #00ffcc; font-weight: bold;">${precio}</td>
            <td style="color: #fff; text-align: center;">${cantidad}</td>
            <td>
                <a href="#" class="borrar-producto" data-id="${id}" style="color: #ff4a4a; font-weight: bold; text-decoration: none; margin-left: 10px;"> X </a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });
}

// Limpiar el contenedor
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}