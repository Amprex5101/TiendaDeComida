// modules/pedidos/Ventas/models/recomendacion.js
const mongoose = require('mongoose');

const restauranteSchema = new mongoose.Schema({
    imagen: String,
    nombre: String,
    costoEnvio: Number
}, { _id: false });

const recomendacionSchema = new mongoose.Schema({
    seccionId: String,
    nombreSeccion: String,
    restaurantes: [restauranteSchema]
}, { collection: 'recomendaciones' });

module.exports = mongoose.model('Recomendacion', recomendacionSchema);