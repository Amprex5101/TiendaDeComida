function generarSeccionId(nombre) {
    const seccionId = nombre
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[áéíóú]/g, match => {
            return {
                'á': 'a',
                'é': 'e',
                'í': 'i',
                'ó': 'o',
                'ú': 'u'
            }[match];
        })
        .replace(/[^a-z0-9-]/g, '');
    
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
    }
}

function agregarProducto() {
    const container = document.getElementById('productos-container');
    const index = container.children.length;
    
    const nuevoProducto = document.createElement('div');
    nuevoProducto.className = 'producto-item border p-3 mb-3';
    nuevoProducto.innerHTML = `
        <div class="form-group">
            <label>Nombre del Producto:</label>
            <input type="text" class="form-control" name="productos[${index}][nombre]" required>
        </div>
        
        <div class="form-group">
            <label>Precio:</label>
            <input type="number" class="form-control" name="productos[${index}][precio]" required>
        </div>
        
        <div class="form-group">
            <label>Imagen del Producto:</label>
            <input type="file" class="form-control imagen-input" name="imagenes" 
                   accept="image/*" required 
                   onchange="previsualizarImagen(this, ${index})">
            <div class="mt-2">
                <img id="preview-${index}" src="#" alt="Vista previa" 
                     style="max-width: 200px; max-height: 200px; display: none;">
            </div>
        </div>
    `;
    
    container.appendChild(nuevoProducto);
}

document.getElementById('menuSeccionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const response = await fetch('/pedidos/Ventas/agregarSeccionMenu', {
            method: 'POST',
            body: new FormData(this)
        });
        
        if (response.ok) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Sección agregada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '/pedidos/Ventas/productos';
            });
        } else {
            throw new Error('Error al guardar la sección');
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo guardar la sección',
            icon: 'error'
        });
    }
});
