const mongoose = require('mongoose');

const ProductoPedidoSchema = new mongoose.Schema({
    nombre_producto: {
        type: String,
        required: true
    },
    precio_base_producto: {
        type: Number,
        required: true
    },
    cantidad_producto: {
        type: Number,
        required: true
    }
});

const PedidoSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },
    productos: [ProductoPedidoSchema],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'],
        default: 'pendiente'
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pedido', PedidoSchema);
