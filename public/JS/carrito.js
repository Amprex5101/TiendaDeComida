// Variable global para controlar si se acaba de realizar un pedido
let pedidoRealizado = false;

document.addEventListener('DOMContentLoaded', function() {
    // Si se acaba de realizar un pedido, no cargar productos
    if (pedidoRealizado) {
        return;
    }

    // Cargar productos del localStorage
    const listaProductos = JSON.parse(localStorage.getItem('listaProductos')) || [];
    const contenedorProductos = document.getElementById('lista-productos');
    let subtotal = 0;

    // Mostrar cada producto en la lista
    listaProductos.forEach((producto, index) => {
        const precioNumerico = parseFloat(producto.precio.replace('$', ''));
        subtotal += precioNumerico * parseInt(producto.cantidad);

        const productoElement = document.createElement('div');
        productoElement.classList.add('producto-item');
        productoElement.innerHTML = `
            <div class="producto-info">
                <span class="producto-nombre">${producto.nombre}</span>
                <span class="producto-cantidad">Cantidad: ${producto.cantidad}</span>
                <span class="producto-precio">${producto.precio}</span>
            </div>
            <button class="btn-eliminar" onclick="eliminarProducto(${index})">
                Eliminar
            </button>
        `;
        contenedorProductos.appendChild(productoElement);
    });

    // Actualizar totales
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${(subtotal + 17).toFixed(2)}`;

    // Agregar evento click al botón realizar pedido
    document.getElementById('btn-realizar-pedido').addEventListener('click', async function() {
        try {
            const listaProductos = JSON.parse(localStorage.getItem('listaProductos')) || [];
            
            if (listaProductos.length === 0) {
                await Swal.fire({
                    title: 'Carrito vacío',
                    text: 'Agrega productos antes de realizar el pedido',
                    icon: 'warning'
                });
                return;
            }

            // Calcular el total correctamente
            const productos = listaProductos.map(producto => {
                const precioNumerico = parseFloat(producto.precio.replace('$', ''));
                return {
                    nombre_producto: producto.nombre,
                    precio_base_producto: precioNumerico,
                    cantidad_producto: parseInt(producto.cantidad)
                };
            });

            const subtotal = productos.reduce((sum, producto) => 
                sum + (producto.precio_base_producto * producto.cantidad_producto), 0);
            
            const total = subtotal + 17;

            const pedido = {
                productos: productos,
                total: total
            };

            const response = await fetch('/pedidos/Ventas/realizar-pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pedido)
            });

            const result = await response.json();

            if (result.success) {
                // Limpiar localStorage
                localStorage.removeItem('listaProductos');
                
                // Limpiar el contenedor de productos
                contenedorProductos.innerHTML = '';
                
                // Resetear los totales
                document.getElementById('subtotal').textContent = '$0.00';
                document.getElementById('total').textContent = '$0.00';
                
                // Actualizar el contador del carrito
                const contador = document.getElementById('contador-carrito');
                if (contador) {
                    contador.textContent = '0';
                }

                await Swal.fire({
                    title: '¡Pedido realizado!',
                    text: 'Tu pedido se ha registrado correctamente',
                    icon: 'success'
                });

                // Redirigir al menú
                window.location.href = '/pedidos/Ventas/Menu1';
            } else {
                throw new Error(result.message || 'Error al procesar el pedido');
            }

        } catch (error) {
            console.error('Error:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al procesar tu pedido',
                icon: 'error'
            });
        }
    });
});

function eliminarProducto(index) {
    let listaProductos = JSON.parse(localStorage.getItem('listaProductos')) || [];
    listaProductos.splice(index, 1);
    localStorage.setItem('listaProductos', JSON.stringify(listaProductos));
    location.reload();
}

function cerrarSesion() {
    // Limpiar todos los datos relacionados con el carrito
    localStorage.removeItem('carrito');
    localStorage.removeItem('listaProductos');
    
    // Actualizar el contador del carrito a 0
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = '0';
    }
    
    // Redirigir a la página de logout
    window.location.href = '/auth/logout';
}

