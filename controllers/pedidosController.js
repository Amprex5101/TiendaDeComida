const Recomendacion = require('../modules/pedidos/Ventas/models/recomendacion');
const Menu = require('../modules/pedidos/Ventas/models/menu');
const path = require('path');

// Mostrar el formulario de recomendaciones
exports.showRecomendacionesForm = async (req, res, moduleName, view, model, title) => {
    try {
        if (req.user.role !== 'admin') {
            req.flash('error_msg', 'Acceso denegado');
            return res.redirect('/');
        }

        res.renderModuleView(moduleName, view, {
            title: title,
            moduleName: moduleName,
            user: req.user,
            modules: req.modules,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Error al mostrar el formulario:', error);
        req.flash('error_msg', 'Error al cargar el formulario');
        res.redirect('/');
    }
};

// Procesar la creación de una nueva recomendación
exports.createRecomendacion = async (req, res, moduleName) => {
    try {
        console.log('Datos recibidos:', req.body);
        console.log('Archivos recibidos:', req.files);

        const { seccionId, nombreSeccion } = req.body;
        const files = req.files;

        // Procesar los datos de los restaurantes del formulario
        let restaurantes = [];
        let index = 0;
        
        while (req.body[`restaurantes[${index}].nombre`]) {
            restaurantes.push({
                nombre: req.body[`restaurantes[${index}].nombre`],
                costoEnvio: parseInt(req.body[`restaurantes[${index}].costoEnvio`]),
                imagen: files[index].filename
            });
            index++;
        }

        const nuevaRecomendacion = new Recomendacion({
            seccionId,
            nombreSeccion,
            restaurantes: restaurantes
        });

        await nuevaRecomendacion.save();
        
        console.log('Recomendación guardada:', nuevaRecomendacion);
        
        res.redirect(`/${moduleName}/recomendaciones?success=true`);
    } catch (error) {
        console.error('Error al guardar la recomendación:', error);
        console.error('Detalles del error:', error.message);
        res.redirect(`/${moduleName}/recomendaciones?error=true`);
    }
};

// Mostrar el formulario de modificaciones
exports.showModificacionesForm = async (req, res, moduleName, view, model, title) => {
    try {
        if (req.user.role !== 'admin') {
            req.flash('error_msg', 'Acceso denegado');
            return res.redirect('/');
        }

        const recomendaciones = await Recomendacion.find();
        
        res.renderModuleView(moduleName, view, {
            title: title,
            moduleName: moduleName,
            user: req.user,
            modules: req.modules,
            recomendaciones: recomendaciones
        });
    } catch (error) {
        console.error('Error al cargar las recomendaciones:', error);
        req.flash('error_msg', 'Error al cargar las recomendaciones');
        res.redirect('/');
    }
};

exports.agregarProductoASeccion = async (req, res, moduleName) => {
    try {
        const { seccionId, nombreSeccion, nombre, costoEnvio } = req.body;
        const imagen = req.file.filename;

        const seccion = await Recomendacion.findOne({ seccionId: seccionId });
        
        if (!seccion) {
            throw new Error('Sección no encontrada');
        }

        seccion.restaurantes.push({
            nombre: nombre,
            costoEnvio: parseInt(costoEnvio),
            imagen: imagen
        });

        await seccion.save();
        res.status(200).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

exports.eliminarProducto = async (req, res, moduleName) => {
    try {
        const { seccionId, productoId } = req.params;
        const seccion = await Recomendacion.findOne({ seccionId: seccionId });
        
        if (!seccion) {
            throw new Error('Sección no encontrada');
        }

        seccion.restaurantes.splice(parseInt(productoId), 1);
        await seccion.save();

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

exports.actualizarProducto = async (req, res, moduleName) => {
    try {
        const { seccionId, productoId } = req.params;
        const { nombre, costoEnvio } = req.body;

        const seccion = await Recomendacion.findOne({ seccionId: seccionId });
        
        if (!seccion) {
            throw new Error('Sección no encontrada');
        }

        // Obtener el producto actual
        const productoActual = seccion.restaurantes[productoId];

        // Actualizar el producto manteniendo la imagen original si no se sube una nueva
        seccion.restaurantes[productoId] = {
            nombre: nombre,
            costoEnvio: parseInt(costoEnvio),
            imagen: req.file ? req.file.filename : productoActual.imagen // Mantener imagen original si no hay nueva
        };

        await seccion.save();
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

exports.eliminarSeccion = async (req, res, moduleName) => {
    try {
        const { seccionId } = req.params;
        const resultado = await Recomendacion.deleteOne({ seccionId: seccionId });
        
        if (resultado.deletedCount === 0) {
            throw new Error('Sección no encontrada');
        }

        res.status(200).json({ message: 'Sección eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar sección:', error);
        res.status(500).json({ error: 'Error al eliminar la sección' });
    }
};

exports.showMenu = async (req, res, moduleName, view, model, title) => {
    try {
        // Obtener todos los datos del menú
        const menu = await Menu.find();
        
        res.renderModuleView(moduleName, view, {
            title: title,
            moduleName: moduleName,
            user: req.user,
            modules: req.modules,
            menu: menu // Pasar los datos del menú a la vista
        });
    } catch (error) {
        console.error('Error al cargar el menú:', error);
        req.flash('error_msg', 'Error al cargar el menú');
        res.redirect('/');
    }
};

exports.showCarrito = async (req, res, moduleName, view, model, title) => {
    try {
        // Verificar si existe el carrito en la sesión
        console.log('Sesión actual:', req.session); // Para debugging
        console.log('Carrito en sesión:', req.session.carrito); // Para debugging

        const carrito = req.session.carrito || { productos: [], total: 0 };
        
        res.renderModuleView(moduleName, view, {
            title: title,
            moduleName: moduleName,
            user: req.user,
            modules: req.modules,
            carrito: carrito
        });
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        req.flash('error_msg', 'Error al cargar el carrito');
        res.redirect('/');
    }
};
