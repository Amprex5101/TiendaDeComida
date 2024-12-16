function toggleSeccion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    content.classList.toggle('active');
    icon.classList.toggle('rotate');
}

function editarProducto(seccionId, productoId) {
    const seccion = recomendaciones.find(s => s.seccionId === seccionId);
    if (!seccion) {
        console.error('Sección no encontrada');
        return;
    }

    const producto = seccion.restaurantes[productoId];
    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }
    
    // Llenar el formulario con los datos actuales
    document.getElementById('edit_seccionId').value = seccionId;
    document.getElementById('edit_productoId').value = productoId;
    document.getElementById('edit_nombre').value = producto.nombre;
    document.getElementById('edit_costoEnvio').value = producto.costoEnvio;
    document.getElementById('edit_preview-imagen').src = `/images/${producto.imagen}`;
    document.getElementById('edit_preview-imagen').style.display = 'block';
    
    // Mostrar el modal
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
                const response = await fetch(`/pedidos/Ventas/eliminarProducto/${seccionId}/${productoId}`, {
                    method: 'DELETE'
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

function mostrarFormularioNuevoProducto(seccionId, nombreSeccion) {
    document.getElementById('seccionId').value = seccionId;
    document.getElementById('nombreSeccion').value = nombreSeccion;
    $('#nuevoProductoModal').modal('show');
}

function eliminarSeccion(seccionId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará toda la sección con sus productos. Esta acción no se puede revertir.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/pedidos/Ventas/eliminarSeccion/${seccionId}`, {
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

// Cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Previsualización de imagen para nuevo producto
    document.querySelector('input[name="imagen"]').addEventListener('change', function(e) {
        const preview = document.getElementById('preview-imagen');
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Previsualización de imagen para editar producto
    document.querySelector('#editarProductoModal input[name="imagen"]').addEventListener('change', function(e) {
        const preview = document.getElementById('edit_preview-imagen');
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Manejar el envío del formulario nuevo producto
    document.getElementById('formNuevoProducto').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch('/pedidos/Ventas/agregarProducto', {
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
            const response = await fetch(`/pedidos/Ventas/actualizarProducto/${seccionId}/${productoId}`, {
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
