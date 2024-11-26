// routes/rutaspedidos.js
const express = require('express');
const mainController = require('../controllers/mainController');
const { ensureAuthenticated } = require('../middleware/auth'); // Middleware para autenticación

module.exports = function(router, params) {
    // Ruta para la vista "index"
    router.get(`${params.route}/index`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_index, params.model, params.title).catch(next);
    });

    // Ruta para la vista "Menu1"
    router.get(`${params.route}/Menu1`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_Menu1, params.model, params.title).catch(next);
    });

    // Ruta para la vista "Restaurantes"
    router.get(`${params.route}/Restaurantes`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_Restaurantes, params.model, params.title).catch(next);
    });
};
