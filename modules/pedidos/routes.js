// routes/userRoutes.js
const express = require('express');
const Ventas = require('./Ventas/models'); // Asegúrate de que este modelo esté correctamente definido.
const configbaseRoutes = require('../../routes/rutaspedidos'); // Ruta del archivo que gestiona las rutas de Ventas

const router = express.Router();

module.exports = function(app) {
    // Rutas para otros módulos, como Alumnos, Profesores, etc.
    configbaseRoutes(router, {
        moduleName: 'pedidos/Ventas', // Especifica correctamente el módulo de Ventas
        view_index: 'index',         // Vista inicial
        view_Menu1: 'Menu1',         // Vista para Menu1
        view_perfil: 'perfil',      //Vista para Perfil
        view_Restaurantes: 'Restaurantes', // Vista para Restaurantes
        model: Ventas,               // Modelo de Ventas
        route: '/Ventas',            // Ruta base para este módulo
        title: 'Ventas'              // Título para este módulo
    });

    app.use('/pedidos', router);  // Establece la ruta base para este módulo
};
