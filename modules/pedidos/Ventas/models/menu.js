const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    seccionId: {
        type: String,
        required: true
    },
    nombreSeccion: {
        type: String,
        required: true
    },
    productos: [{
        nombre: String,
        precio: Number,
        imagen: String
    }]
});

module.exports = mongoose.model('Menu', menuSchema);
