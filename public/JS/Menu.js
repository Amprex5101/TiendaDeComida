let listaProductos = [];

document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.card');
        let counterDiv = card.querySelector('.counter');
        const precioBase = parseFloat(card.querySelector('.precio-base').textContent);
        const precioTotalSpan = card.querySelector('.precio-total');

        if (!counterDiv) {
            counterDiv = document.createElement('div');
            counterDiv.classList.add('counter');

            const minusButton = document.createElement('button');
            minusButton.textContent = '-';
            minusButton.classList.add('counter-button');

            const counterValue = document.createElement('span');
            counterValue.textContent = '1';
            counterValue.classList.add('counter-value');

            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.classList.add('counter-button');

            // Actualizar precio cuando se aumenta la cantidad
            plusButton.addEventListener('click', function () {
                const newValue = parseInt(counterValue.textContent) + 1;
                counterValue.textContent = newValue;
                precioTotalSpan.textContent = `$${(precioBase * newValue).toFixed(2)}`;
            });

            // Actualizar precio cuando se disminuye la cantidad
            minusButton.addEventListener('click', function () {
                const currentValue = parseInt(counterValue.textContent);
                if (currentValue > 1) {
                    const newValue = currentValue - 1;
                    counterValue.textContent = newValue;
                    precioTotalSpan.textContent = `$${(precioBase * newValue).toFixed(2)}`;
                } else {
                    counterDiv.remove();
                    button.style.display = 'block';
                    card.querySelector('.agregar-carrito-container').style.display = 'none';
                    precioTotalSpan.textContent = `$${precioBase.toFixed(2)}`;
                }
            });

            counterDiv.appendChild(minusButton);
            counterDiv.appendChild(counterValue);
            counterDiv.appendChild(plusButton);

            card.appendChild(counterDiv);
            this.style.display = 'none';
            card.querySelector('.agregar-carrito-container').style.display = 'block';
        }
    });
});
// Agregar esto al final de tu archivo Menu.js
function actualizarContadorCarrito() {
    const listaProductos = JSON.parse(localStorage.getItem('listaProductos')) || [];
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = listaProductos.length;
    }
}

// Llamar a la función cuando se carga la página y cuando se modifica el carrito
document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);
function mostrarDatosProducto(boton) {
    const card = boton.closest('.card');
    const nombreProducto = card.querySelector('.nombre-producto').textContent;
    const precioTotal = card.querySelector('.precio-total').textContent;
    const cantidad = card.querySelector('.counter-value').textContent;
    
    // Crear objeto con los datos del producto
    const producto = {
        nombre: nombreProducto,
        precio: precioTotal,
        cantidad: cantidad
    };
    
    // Obtener la lista actual del localStorage
    let listaProductos = JSON.parse(localStorage.getItem('listaProductos')) || [];
    
    // Agregar el nuevo producto
    listaProductos.push(producto);
    
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('listaProductos', JSON.stringify(listaProductos));
    
    // Actualizar el contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar confirmación
    Swal.fire({
        title: '¡Producto agregado!',
        text: 'El producto se agregó al carrito correctamente',
        icon: 'success',
        timer: 1500
    });
}

// Agregar evento para mostrar la lista cuando se cambia de página
window.addEventListener('beforeunload', function() {
    if (listaProductos.length > 0) {
        console.log('Productos seleccionados antes de salir:');
        listaProductos.forEach((prod, index) => {
            console.log(`${index + 1}. ${prod.nombre} - Cantidad: ${prod.cantidad} - ${prod.precio}`);
        });
    }
});

// Para persistir los datos entre páginas, puedes usar localStorage
function guardarListaEnStorage() {
    localStorage.setItem('listaProductos', JSON.stringify(listaProductos));
}

function cargarListaDeStorage() {
    const listaGuardada = localStorage.getItem('listaProductos');
    if (listaGuardada) {
        listaProductos = JSON.parse(listaGuardada);
    }
}

// Cargar la lista al iniciar la página
cargarListaDeStorage();
