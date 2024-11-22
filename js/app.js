let carrito = [];
let productos = [];

// Referencias a los elementos del DOM
const contenedorProductos = document.getElementById('contenedor-productos');
const itemsCarrito = document.getElementById('items-carrito');
const contadorCarrito = document.getElementById('contador-carrito');
const precioTotal = document.getElementById('precio-total');
const carritoSeccion = document.getElementById('carrito');
const fondoOpaco = document.getElementById('fondo-opaco');

async function getProductosJson(categoria) {
  try {
    // Ocultar las secciones de home si es necesario
    document.getElementById('contenedor-video-iphone').style.display = 'none';
    document.getElementById('contenedor-video-mac').style.display = 'none';
    document.getElementById('contenedorWatchHome').style.display = 'none';

    // Obtener los productos desde el archivo JSON
    const response = await fetch('/productos.json');
    const productosJson = await response.json();
    productos = productosJson.productos;

    // Cargar carrito desde localStorage al cargar la página
    cargarCarrito();

    // Filtrar los productos según la categoría
    const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    
    // Mostrar los productos en el contenedor
    contenedorProductos.innerHTML = '';
    const listaProductos = document.createElement('div');
    listaProductos.classList.add('lista-productos');
    
    productosFiltrados.forEach(producto => {
      const div = document.createElement('div');
      div.classList.add('productos');
      div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" />
        <h3>${producto.nombre}</h3>
        <p>USD$${producto.precio}</p>
        <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        <br><br>
      `;
      listaProductos.appendChild(div);
    });

    contenedorProductos.appendChild(listaProductos);
    
  } catch (error) {
    console.error('Error al cargar los productos: ', error);
  }
}

// Cargar carrito desde localStorage
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarContador();
    actualizarTotal();
  }
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(item => item.id === id);
  if (producto) {
    // Buscar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(prod => prod.id === id);
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({...producto, cantidad: 1});
    }

    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar mensaje de confirmación
    Toastify({
      text: `${producto.nombre}, agregado al carrito`,
      duration: 1500,
      gravity: "top",
      position: "right",
      textColor: "#000000",
      backgroundColor: "#000000"
    }).showToast();

    // Actualizar el carrito visualmente
    actualizarCarrito();
  }
}

// Eliminar producto del carrito
function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  actualizarCarrito();
}

// Renderizar los productos en el carrito
function renderizarCarrito() {
  itemsCarrito.innerHTML = '';
  
  if (carrito.length === 0) {
    itemsCarrito.innerHTML = '<p>TU CARRITO ESTA VACÍO</p>';
    return;
  }

  carrito.forEach((item, indice) => {
    const li = document.createElement('li');
    li.classList.add('item-carrito');
    li.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      ${item.nombre} - USD$${item.precio} x ${item.cantidad}
      <button onclick="eliminarDelCarrito(${indice})"><i class="fas fa-trash"></i></button>
    `;
    itemsCarrito.appendChild(li);
  });
}

// Actualizar el total del carrito
function actualizarTotal() {
  const total = carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);
  precioTotal.textContent = `TOTAL: USD$${total}`;
}

// Actualizar el contador de productos en el carrito
function actualizarContador() {
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  contadorCarrito.textContent = totalItems;
}

// Actualizar el carrito visualmente (después de agregar o eliminar productos)
function actualizarCarrito() {
  renderizarCarrito();
  actualizarTotal();
  actualizarContador();

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Alternar la visibilidad del carrito
function alternarCarrito() {
  if (carritoSeccion.style.display === 'none' || carritoSeccion.style.display === '') {
    carritoSeccion.style.display = 'flex';
    fondoOpaco.style.display = 'block';
  } else {
    carritoSeccion.style.display = 'none';
    fondoOpaco.style.display = 'none';
  }
}

// Finalizar la compra
function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'No existen productos todavía.'
    });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Compra exitosa',
      text: 'Gracias por su compra.'
    }).then(() => {
      carrito.length = 0;
      actualizarCarrito();
    });
  }
}

// Llamada inicial para cargar productos y carrito
// document.addEventListener('DOMContentLoaded', () => {
// 
// });
