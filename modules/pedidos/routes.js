// routes/userRoutes.js
const express = require('express');
const Ventas = require('./Ventas/models'); // Asegúrate de que este modelo esté correctamente definido.
const configbaseRoutes = require('../../routes/rutaspedidos'); // Ruta del archivo que gestiona las rutas de Ventas
const pedidosController = require('./controllers/pedidosController');

const router = express.Router();

module.exports = function(app) {
    // Rutas para otros módulos, como Alumnos, Profesores, etc.
    configbaseRoutes(router, {
        moduleName: 'pedidos/Ventas', // Especifica correctamente el módulo de Ventas
        view_index: 'index',         // Vista inicial
        view_Menu1: 'Menu1',         // Vista para Menu1
        view_perfil: 'perfil',      //Vista para Perfil
        view_Restaurantes: 'Restaurantes', // Vista para Restaurantes
        view_recomendaciones: 'recomendaciones', // Vista para recomendaciones
        view_modificaciones: 'modificaciones', // Vista para modificaciones
        view_carrito: 'carrito', // Vista para carrito
        view_productos: 'productos',
        model: Ventas,               // Modelo de Ventas
        route: '/Ventas',            // Ruta base para este módulo
        title: 'Ventas'              // Título para este módulo
    });

    app.post('/pedidos/Ventas/realizar-pedido', (req, res, next) => {
        console.log('Ruta de realizar pedido alcanzada'); // Debug
        next();
    }, pedidosController.realizarPedido);

    app.use('/pedidos', router);  // Establece la ruta base para este módulo

    app.get('/pedidos/Ventas/pedidos', pedidosController.obtenerPedidosUsuario);
    app.get('/pedidos/Ventas/pedido/:id', pedidosController.obtenerPedidoPorId);
};
