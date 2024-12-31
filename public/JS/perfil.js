function toggleEditMode() {
    const viewMode = document.getElementById('viewMode');
    const editForm = document.getElementById('editForm');
    
    if (viewMode.style.display !== 'none') {
        viewMode.style.display = 'none';
        editForm.style.display = 'block';
    } else {
        viewMode.style.display = 'block';
        editForm.style.display = 'none';
    }
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('profilePreview');
        preview.src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
}

// Agregar log cuando el script se carga
console.log('Script de perfil cargado');

document.getElementById('editForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Verificar tamaño del archivo antes de enviarlo
    const fileInput = document.getElementById('profileImage');
    if (fileInput.files.length > 0) {
        const fileSize = fileInput.files[0].size;
        const maxSize = 10 * 1024 * 1024; // 10MB en bytes
        
        if (fileSize > maxSize) {
            Swal.fire({
                title: 'Error',
                text: 'La imagen es demasiado grande. El tamaño máximo permitido es 10MB',
                icon: 'error'
            });
            return;
        }
    }
    
    try {
        const formData = new FormData(this);
        
        const response = await fetch('/pedidos/Ventas/actualizarPerfil', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            Swal.fire({
                title: '¡Éxito!',
                text: data.message,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
        } else {
            throw new Error(data.message || 'Error al actualizar el perfil');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: error.message || 'No se pudo actualizar el perfil',
            icon: 'error'
        });
    }
});