const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configurar multer para el manejo de archivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
        // Usar el nombre del restaurante para nombrar la imagen
        const restaurantName = req.body.nombre || 'restaurante';
        cb(null, `${restaurantName}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.post('/pedidos/Ventas/recomendaciones', upload.array('restaurantes[][imagen]'), async (req, res) => {
    try {
        const { seccionId, nombreSeccion, restaurantes } = req.body;
        const files = req.files;
        
        // Procesar los restaurantes y sus imágenes
        const restaurantesProcesados = restaurantes.map((rest, index) => ({
            nombre: rest.nombre,
            costoEnvio: parseInt(rest.costoEnvio),
            imagen: files[index].filename
        }));

        const nuevaRecomendacion = new Recomendacion({
            seccionId,
            nombreSeccion,
            restaurantes: restaurantesProcesados
        });

        await nuevaRecomendacion.save();
        
        req.flash('success_msg', 'Recomendación agregada exitosamente');
        res.redirect('/pedidos/Ventas/recomendaciones');
    } catch (error) {
        console.error('Error al guardar la recomendación:', error);
        req.flash('error_msg', 'Error al guardar la recomendación');
        res.redirect('/pedidos/Ventas/recomendaciones');
    }
});

module.exports = router;
