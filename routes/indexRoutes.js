// routes/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const Recomendacion = require('../modules/pedidos/Ventas/models/recomendacion');

const router = express.Router();

// Home Page
module.exports = function(modules) {
    router.get('/', async (req, res) => {
        try {
            // Obtener las recomendaciones de la base de datos
            const recomendaciones = await Recomendacion.find({});

            // Renderizar la vista con las recomendaciones
            res.render(req.layout_view, { 
                user: req.user, 
                modules: modules, 
                title: 'Home', 
                bodyContent: './Restaurantes.ejs',
                loadingPath: req.loadingPath,
                navbarPath: req.navbarPath,
                recomendaciones: recomendaciones // Pasar las recomendaciones a la vista
            });
        } catch (error) {
            console.error('Error al cargar las recomendaciones:', error);
            res.render(req.layout_view, { 
                user: req.user, 
                modules: modules, 
                title: 'Home', 
                bodyContent: './Restaurantes.ejs',
                loadingPath: req.loadingPath,
                navbarPath: req.navbarPath,
                recomendaciones: [] // Array vacío en caso de error
            });
        }
    });

    return router;
};
