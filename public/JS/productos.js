function toggleSeccion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    content.classList.toggle('active');
    icon.classList.toggle('rotate');
}

function editarProducto(seccionId, productoId) {
    const seccion = menu.find(s => s.seccionId === seccionId);
    if (!seccion) {
        console.error('Sección no encontrada');
        return;
    }

    const producto = seccion.productos[productoId];
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }
    
    document.getElementById('edit_seccionId').value = seccionId;
    document.getElementById('edit_productoId').value = productoId;
    document.getElementById('edit_nombre').value = producto.nombre;
    document.getElementById('edit_precio').value = producto.precio.$numberInt || producto.precio;
    document.getElementById('edit_preview-imagen').src = `/images/${producto.imagen}`;
    document.getElementById('edit_preview-imagen').style.display = 'block';
    
    $('#editarProductoModal').modal('show');
}

function eliminarProducto(seccionId, productoId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/pedidos/Ventas/productos/eliminar/${seccionId}/${productoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El producto ha sido eliminado correctamente',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al eliminar el producto');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar el producto',
                    icon: 'error'
                });
            }
        }
    });
}

function eliminarSeccion(seccionId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminarán todos los productos de esta sección",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/pedidos/Ventas/productos/eliminarSeccion/${seccionId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'La sección ha sido eliminada correctamente',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        location.reload();
                    });
                } else {
                    throw new Error('Error al eliminar la sección');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar la sección',
                    icon: 'error'
                });
            }
        }
    });
}

function mostrarFormularioNuevoProducto(seccionId, nombreSeccion) {
    document.getElementById('seccionId').value = seccionId;
    document.getElementById('nombreSeccion').value = nombreSeccion;
    $('#nuevoProductoModal').modal('show');
}

// Cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Preview de imagen para nuevo producto
    document.querySelector('#formNuevoProducto input[name="imagen"]').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('preview-imagen');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Preview de imagen para editar producto
    document.querySelector('#formEditarProducto input[name="imagen"]').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('edit_preview-imagen');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // Manejar el envío del formulario nuevo producto
    document.getElementById('formNuevoProducto').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch('/pedidos/Ventas/productos/agregar', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                $('#nuevoProductoModal').modal('hide');
                
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Producto agregado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            } else {
                throw new Error('Error al guardar el producto');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar el producto',
                icon: 'error'
            });
        }
    });

    // Manejar el envío del formulario editar producto
    document.getElementById('formEditarProducto').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const seccionId = document.getElementById('edit_seccionId').value;
        const productoId = document.getElementById('edit_productoId').value;
        
        try {
            const response = await fetch(`/pedidos/Ventas/productos/actualizar/${seccionId}/${productoId}`, {
                method: 'PUT',
                body: formData
            });
            
            if (response.ok) {
                $('#editarProductoModal').modal('hide');
                
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Producto actualizado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    location.reload();
                });
            } else {
                throw new Error('Error al actualizar el producto');
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el producto',
                icon: 'error'
            });
        }
    });
});
