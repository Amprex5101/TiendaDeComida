const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    seccionId: String,
    nombreSeccion: String,
    productos: [{
        nombre: String,
        precio: mongoose.Schema.Types.Mixed,
        imagen: String,
        _id: mongoose.Schema.Types.ObjectId
    }]
}, {
    collection: 'menus'
});

module.exports = mongoose.model('Menu', menuSchema);
