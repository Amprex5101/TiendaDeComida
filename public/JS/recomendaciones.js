// Verificar si hay un mensaje de éxito en la URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        Swal.fire({
            title: '¡Éxito!',
            text: 'Recomendación agregada correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }

    // Función para hacer que los mensajes desaparezcan automáticamente
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            // Crear una instancia de bootstrap alert y ocultarla
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 3000);
});

let restauranteCount = 1;

function agregarRestaurante() {
    const container = document.getElementById('restaurantes-container');
    const nuevoRestaurante = `
        <div class="restaurante-item border p-3 mb-3">
            <div class="form-group">
                <label>Nombre de la comida:</label>
                <input type="text" class="form-control restaurante-nombre" 
                       name="restaurantes[${restauranteCount}].nombre" 
                       data-index="${restauranteCount}"
                       required>
            </div>
            
            <div class="form-group">
                <label>Costo de la comida:</label>
                <input type="number" class="form-control" 
                       name="restaurantes[${restauranteCount}].costoEnvio" required>
            </div>
            
            <div class="form-group">
                <label>Imagen de la comida:</label>
                <input type="file" class="form-control imagen-input" 
                       name="imagen" 
                       accept="image/*" 
                       onchange="previsualizarImagen(this, ${restauranteCount})" required>
                <div class="mt-2">
                    <img id="preview-${restauranteCount}" src="#" alt="Vista previa" 
                         style="max-width: 200px; max-height: 200px; display: none;">
                </div>
            </div>
            
            <button type="button" class="btn btn-danger mt-2" onclick="eliminarRestaurante(this)">
                Eliminar Comida
            </button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', nuevoRestaurante);
    restauranteCount++;
}

function generarSeccionId(nombre) {
    // Convertir a minúsculas y reemplazar espacios por guiones
    const seccionId = nombre.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Reemplaza espacios por guiones
        .replace(/[^a-z0-9-]/g, '')  // Elimina caracteres especiales
        .replace(/-+/g, '-');        // Evita guiones múltiples

    document.getElementById('seccionId').value = seccionId;
}

function previsualizarImagen(input, index) {
    const preview = document.getElementById(`preview-${index}`);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}

function eliminarRestaurante(button) {
    const restauranteItem = button.parentElement;
    restauranteItem.remove();
}
