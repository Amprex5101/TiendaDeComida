const Menu = require('../modules/pedidos/Ventas/models/menu');
const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const session = require('express-session');

// Conectar a MongoDB
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))  // Mensaje si la conexión es exitosa
  .catch(err => console.log('Error al conectar con MongoDB:', err)); // M
// Datos del menú
const menuData = [
    {
        seccionId: 'articulos-destacados',
        nombreSeccion: 'Artículos destacados',
        productos: [
            {
                nombre: '½ L. Frijoles charros',
                precio: 55.00,
                imagen: 'Frijolescharros.jpg'
            },
            {
                nombre: 'Con queso',
                precio: 100.00,
                imagen: 'Pure.jpg'
            },
            {
                nombre: '½ L. Arroz',
                precio: 45.00,
                imagen: 'Arroz.jpg'
            },
            {
                nombre: 'Ensalada mixta',
                precio: 48.00,
                imagen: 'Ensalada.jpg'
            }
        ]
    },
    {
        seccionId: 'estilos-pollo',
        nombreSeccion: 'Estilos de Pollo',
        productos: [
            {
                nombre: 'Pollo a la parrilla',
                precio: 110.00,
                imagen: 'polloparrilla.jpg'
            },
            {
                nombre: 'Pollo Asado',
                precio: 150.00,
                imagen: 'polloasado.jpg'
            },
            {
                nombre: 'Pollo salteado',
                precio: 80.00,
                imagen: 'pollosalteado.jpg'
            },
            {
                nombre: 'Pollo estilo teriyaki',
                precio: 90.00,
                imagen: 'polloteriyaki.jpg'
            }
        ]
    }
];

// Función para insertar los datos
async function insertarMenu() {
    try {
        await Menu.deleteMany({}); // Limpiar datos existentes
        await Menu.insertMany(menuData);
        console.log('Datos insertados correctamente');
    } catch (error) {
        console.error('Error al insertar datos:', error);
    } finally {
        mongoose.connection.close();
    }
}

insertarMenu();
