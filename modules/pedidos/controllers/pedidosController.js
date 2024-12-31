const Pedido = require('../models/Pedido');

exports.realizarPedido = async (req, res) => {
    try {
        console.log('Body completo recibido:', req.body); // Debug
        const { productos, total } = req.body;
        
        // Verificar si el usuario está autenticado
        if (!req.user) {
            console.log('Usuario no autenticado'); // Debug
            return res.status(401).json({ 
                success: false, 
                message: 'Debes iniciar sesión para realizar un pedido' 
            });
        }

        console.log('Usuario autenticado:', req.user.email); // Debug
        console.log('Productos recibidos:', productos); // Debug
        console.log('Total recibido:', total); // Debug

        // Crear el nuevo pedido
        const nuevoPedido = new Pedido({
            usuario: req.user.email,
            productos: productos.map(p => ({
                nombre_producto: p.nombre_producto,
                precio_base_producto: p.precio_base_producto,
                cantidad_producto: p.cantidad_producto
            })),
            total: total
        });

        console.log('Pedido a guardar:', nuevoPedido); // Debug

        // Guardar el pedido
        const pedidoGuardado = await nuevoPedido.save();
        console.log('Pedido guardado:', pedidoGuardado); // Debug

        res.json({ 
            success: true, 
            message: 'Pedido realizado con éxito',
            pedido: pedidoGuardado
        });

    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar el pedido',
            error: error.message
        });
    }
};

exports.obtenerPedidosUsuario = async (req, res) => {
    try {
        // Verificar si el usuario está autenticado
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const pedidos = await Pedido.find({ usuario: req.user.email })
                                  .sort({ fecha: -1 });
        
        // Pasar tanto los pedidos como la información del usuario
        res.renderModuleView('pedidos/Ventas', 'pedidos', { 
            title: 'Mis Pedidos',
            pedidos: pedidos,
            user: req.user, // Agregar la información del usuario
            navbarPath: 'partials/navbar',
            bodyContent: 'modules/pedidos/Ventas/views/pedidos'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al obtener los pedidos');
    }
};

exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
};
