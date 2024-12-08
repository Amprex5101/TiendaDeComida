function toggleEditMode() {
    const viewMode = document.querySelector('.view-mode');
    const editMode = document.querySelector('.edit-mode');

    // Alternar visibilidad
    if (viewMode && editMode) {
        const isEditing = editMode.style.display === 'block';
        viewMode.style.display = isEditing ? 'block' : 'none';
        editMode.style.display = isEditing ? 'none' : 'block';
    }
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('profilePreview');
        if (output) {
            output.src = reader.result;
        }
    };
    reader.readAsDataURL(event.target.files[0]);
}