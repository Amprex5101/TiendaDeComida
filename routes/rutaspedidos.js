// routes/rutaspedidos.js
const express = require('express');
const mainController = require('../controllers/mainController');
const pedidosController = require('../controllers/pedidosController');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth'); // Middleware para autenticación
const multer = require('multer');
const path = require('path');

// Configurar multer para el manejo de archivos
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = function(router, params) {
    // Ruta para la vista "index"
    router.get(`${params.route}/index`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_index, params.model, params.title).catch(next);
    });

    // Ruta para la vista "Menu1"
    router.get(`${params.route}/Menu1`, (req, res, next) => {
        pedidosController.showMenu(req, res, params.moduleName, 'Menu1', params.model, 'Menú').catch(next);
    });

    router.get(`${params.route}/perfil`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_perfil, params.model, params.title).catch(next);
    });

    // Ruta para la vista "Restaurantes"
    router.get(`${params.route}/Restaurantes`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_Restaurantes, params.model, params.title).catch(next);
    });

    // Ruta para recomendaciones (solo admin)
    router.get(`${params.route}/recomendaciones`, ensureAuthenticated, isAdmin, (req, res, next) => {  
        pedidosController.showRecomendacionesForm(req, res, params.moduleName, params.view_recomendaciones, params.model, params.title).catch(next);
    });

    // Ruta POST para procesar el formulario
    router.post(`${params.route}/recomendaciones`, ensureAuthenticated, isAdmin, upload.array('imagen'), (req, res, next) => {
        pedidosController.createRecomendacion(req, res, params.moduleName).catch(next);
    });

    // Ruta para modificaciones (solo admin)
    router.get(`${params.route}/modificaciones`, ensureAuthenticated, isAdmin, (req, res, next) => {
        pedidosController.showModificacionesForm(req, res, params.moduleName, params.view_modificaciones, params.model, params.title).catch(next);
    });

    // Agregar esta nueva ruta
    router.post(`${params.route}/agregarProducto`, ensureAuthenticated, isAdmin, upload.single('imagen'), (req, res, next) => {
        pedidosController.agregarProductoASeccion(req, res, params.moduleName).catch(next);
    });

    // Agregar esta nueva ruta para eliminar productos
    router.delete(`${params.route}/eliminarProducto/:seccionId/:productoId`, ensureAuthenticated, isAdmin, (req, res, next) => {
        pedidosController.eliminarProducto(req, res, params.moduleName).catch(next);
    });

    // Agregar esta nueva ruta para actualizar productos
    router.put(`${params.route}/actualizarProducto/:seccionId/:productoId`, ensureAuthenticated, isAdmin, upload.single('imagen'), (req, res, next) => {
        pedidosController.actualizarProducto(req, res, params.moduleName).catch(next);
    });

    // Agregar esta nueva ruta para eliminar secciones completas
    router.delete(`${params.route}/eliminarSeccion/:seccionId`, ensureAuthenticated, isAdmin, (req, res, next) => {
        pedidosController.eliminarSeccion(req, res, params.moduleName).catch(next);
    });
    
    
};
