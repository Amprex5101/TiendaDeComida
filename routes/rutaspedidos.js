// routes/rutaspedidos.js
const express = require('express');
const mainController = require('../controllers/mainController');
const pedidosController = require('../controllers/pedidosController');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth'); // Middleware para autenticación
const multer = require('multer');
const path = require('path');
const Menu = require('../modules/pedidos/Ventas/models/menu'); // Importa el modelo Menu
const User = require('../modules//base/users/models'); // Importa el modelo User
const fs = require('fs');

// Primero, definimos la ruta absoluta correcta para las imágenes
const uploadDirectory = path.join(__dirname, '../public/images');

// Nos aseguramos de que la carpeta exista
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configuración común para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDirectory); // Usamos la ruta absoluta
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configuración de multer
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'El archivo es demasiado grande. El tamaño máximo permitido es 10MB'
            });
        }
        return res.status(400).json({
            message: 'Error al subir el archivo'
        });
    }
    next(error);
};

// Configuración específica de multer para imágenes de perfil
const profileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/images');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadProfile = multer({ 
    storage: profileStorage,
    fileFilter: function(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Configuración para la subida de imágenes de usuario
const userStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../public/images');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadUser = multer({ 
    storage: userStorage,
    fileFilter: function(req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

module.exports = function(router, params) {
    // Ruta para la vista "index"
    router.get(`${params.route}/index`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_index, params.model, params.title).catch(next);
    });

    // Ruta para la vista "Menu1"
    router.get(`${params.route}/Menu1`, (req, res, next) => {
        pedidosController.showMenu(req, res, params.moduleName, 'Menu1', params.model, 'Menú').catch(next);
    });

    router.get(`${params.route}/perfil`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_perfil, params.model, params.title).catch(next);
    });

    // Ruta para la vista "Restaurantes"
    router.get(`${params.route}/Restaurantes`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_Restaurantes, params.model, params.title).catch(next);
    });

    // Ruta para recomendaciones (solo admin)
    router.get(`${params.route}/recomendaciones`, ensureAuthenticated, isAdmin, (req, res, next) => {  
        pedidosController.showRecomendacionesForm(req, res, params.moduleName, params.view_recomendaciones, params.model, params.title).catch(next);
    });

    // Ruta POST para procesar el formulario
    router.post(`${params.route}/recomendaciones`, 
        ensureAuthenticated, 
        isAdmin, 
        upload.array('imagen'), 
        async (req, res) => {
            try {
                console.log('Ruta de guardado:', uploadDirectory);
                console.log('Archivos recibidos:', req.files);
                
                const result = await pedidosController.createRecomendacion(req, res, params.moduleName);
                
                if (result.success) {
                    return res.redirect(`/${params.moduleName}/recomendaciones?success=true`);
                }
            } catch (error) {
                console.error('Error completo:', error);
                // Solo enviar respuesta si no se ha enviado ya
                if (!res.headersSent) {
                    return res.redirect(`/${params.moduleName}/recomendaciones?error=true`);
                }
            }
        }
    );

    // Ruta para modificaciones (solo admin)
    router.get(`${params.route}/modificaciones`, ensureAuthenticated, isAdmin, (req, res, next) => {
        pedidosController.showModificacionesForm(req, res, params.moduleName, params.view_modificaciones, params.model, params.title).catch(next);
    });

    // Agregar esta nueva ruta
    router.post(`${params.route}/agregarProducto`, ensureAuthenticated, isAdmin, upload.single('imagen'), (req, res, next) => {
        pedidosController.agregarProductoASeccion(req, res, params.moduleName).catch(next);
    });

    // Agregar esta nueva ruta para eliminar productos
    router.delete(`${params.route}/eliminarProducto/:seccionId/:productoId`, ensureAuthenticated, isAdmin, (req, res, next) => {
        pedidosController.eliminarProducto(req, res, params.moduleName).catch(next);
    });

    // Agregar esta nueva ruta para actualizar productos
    router.put(`${params.route}/actualizarProducto/:seccionId/:productoId`, ensureAuthenticated, isAdmin, upload.single('imagen'), (req, res, next) => {
        pedidosController.actualizarProducto(req, res, params.moduleName).catch(next);
    });

    // Agregar esta nueva ruta para eliminar secciones completas
    router.delete(`${params.route}/eliminarSeccion/:seccionId`, ensureAuthenticated, isAdmin, (req, res, next) => {
        pedidosController.eliminarSeccion(req, res, params.moduleName).catch(next);
    });

    router.get(`${params.route}/carrito`, ensureAuthenticated, (req, res, next) => {  
        mainController.showPedidos(req, res, params.moduleName, params.view_carrito, params.model, params.title).catch(next);
    });

    router.get(`${params.route}/productos`, ensureAuthenticated, isAdmin, async (req, res, next) => {  
        try {
            const menu = await Menu.find().lean();            
            res.renderModuleView('pedidos/Ventas', 'productos', {
                menu,
                user: req.user,
                title: 'Gestión de Productos',
                layout_view: 'layout'
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            next(error);
        }
    });
    
    // Rutas para productos
    router.post(`${params.route}/productos/agregar`, ensureAuthenticated, isAdmin, upload.single('imagen'), async (req, res) => {
        try {
            const { seccionId, nombre, precio } = req.body;
            const imagen = req.file ? req.file.filename : null;

            const result = await Menu.findOneAndUpdate(
                { seccionId: seccionId },
                { 
                    $push: { 
                        productos: {
                            nombre,
                            precio: parseInt(precio),
                            imagen
                        }
                    }
                },
                { new: true }
            );

            if (!result) {
                return res.status(404).json({ message: 'Sección no encontrada' });
            }

            res.status(200).json({ message: 'Producto agregado correctamente' });
        } catch (error) {
            console.error('Error al agregar producto:', error);
            res.status(500).json({ message: 'Error al agregar el producto' });
        }
    });

    router.put(`${params.route}/productos/actualizar/:seccionId/:productoId`, ensureAuthenticated, isAdmin, upload.single('imagen'), async (req, res) => {
        try {
            const { seccionId, productoId } = req.params;
            const { nombre, precio } = req.body;
            const imagen = req.file ? req.file.filename : undefined;

            const seccion = await Menu.findOne({ seccionId: seccionId });
            if (!seccion) {
                return res.status(404).json({ message: 'Sección no encontrada' });
            }

            const producto = seccion.productos[productoId];
            if (!producto) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            producto.nombre = nombre;
            producto.precio = parseInt(precio);
            if (imagen) {
                producto.imagen = imagen;
            }

            await seccion.save();
            res.status(200).json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    });

    router.delete(`${params.route}/productos/eliminar/:seccionId/:productoId`, ensureAuthenticated, isAdmin, async (req, res) => {
        try {
            const { seccionId, productoId } = req.params;
            console.log('Parámetros recibidos:', { seccionId, productoId }); // Debug log

            // Encuentra la sección por seccionId
            const seccion = await Menu.findOne({ seccionId: seccionId });
            
            if (!seccion) {
                console.log('Sección no encontrada'); // Debug log
                return res.status(404).json({ message: 'Sección no encontrada' });
            }

            // Encuentra el producto por su índice
            const productoIndex = parseInt(productoId);
            if (productoIndex < 0 || productoIndex >= seccion.productos.length) {
                console.log('Producto no encontrado'); // Debug log
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Elimina el producto usando el índice
            seccion.productos.splice(productoIndex, 1);
            
            // Guarda los cambios
            await seccion.save();

            console.log('Producto eliminado correctamente'); // Debug log
            res.status(200).json({ 
                message: 'Producto eliminado correctamente',
                seccionId,
                productoId
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error); // Debug log
            res.status(500).json({ 
                message: 'Error al eliminar el producto',
                error: error.message
            });
        }
    });

    router.delete(`${params.route}/productos/eliminarSeccion/:seccionId`, ensureAuthenticated, isAdmin, async (req, res) => {
        try {
            const { seccionId } = req.params;

            const result = await Menu.findOneAndDelete({ seccionId: seccionId });

            if (!result) {
                return res.status(404).json({ message: 'Sección no encontrada' });
            }

            res.status(200).json({ message: 'Sección eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar sección:', error);
            res.status(500).json({ message: 'Error al eliminar la sección' });
        }
    });

    // Ruta para mostrar el formulario de agregar sección al menú
    router.get(`${params.route}/agregarSeccionMenu`, ensureAuthenticated, isAdmin, (req, res) => {
        res.renderModuleView('pedidos/Ventas', 'agregarSeccionMenu', {
            user: req.user,
            title: 'Agregar Sección al Menú',
            layout_view: 'layout'
        });
    });

    // Ruta para procesar el formulario de nueva sección
    router.post(`${params.route}/agregarSeccionMenu`, ensureAuthenticated, isAdmin, upload.array('imagenes'), async (req, res) => {
        try {
            const { nombreSeccion, seccionId, productos } = req.body;
            const imagenes = req.files;

            // Verifica que productos sea un array
            if (!Array.isArray(productos)) {
                // Si productos es un objeto, conviértelo en array
                const productosArray = Object.keys(productos).map(index => ({
                    nombre: productos[index].nombre,
                    precio: productos[index].precio
                }));

                // Crear nueva sección con productos
                const nuevaSeccion = {
                    nombreSeccion,
                    seccionId,
                    productos: productosArray.map((producto, index) => ({
                        nombre: producto.nombre,
                        precio: parseInt(producto.precio),
                        imagen: imagenes[index].filename
                    }))
                };

                await Menu.create(nuevaSeccion);
                res.status(200).json({ message: 'Sección agregada correctamente' });
            } else {
                // Si ya es un array, procede normalmente
                const nuevaSeccion = {
                    nombreSeccion,
                    seccionId,
                    productos: productos.map((producto, index) => ({
                        nombre: producto.nombre,
                        precio: parseInt(producto.precio),
                        imagen: imagenes[index].filename
                    }))
                };

                await Menu.create(nuevaSeccion);
                res.status(200).json({ message: 'Sección agregada correctamente' });
            }
        } catch (error) {
            console.error('Error al agregar sección:', error);
            res.status(500).json({ message: 'Error al agregar la sección' });
        }
    });

    router.post(
        `${params.route}/actualizarPerfil`, 
        ensureAuthenticated, 
        upload.single('profileImage'),
        async (req, res) => {
            try {
                console.log('Ruta de guardado:', uploadDirectory);
                console.log('Archivo recibido:', req.file);
                
                const { name } = req.body;
                const updateData = { name };

                if (req.file) {
                    // Eliminar la imagen anterior si existe
                    if (req.user.profileImage && req.user.profileImage !== 'default-profile.png') {
                        const oldImagePath = path.join(__dirname, '../public/images', req.user.profileImage);
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                        }
                    }
                    updateData.profileImage = req.file.filename;
                    console.log('Nombre del archivo:', req.file.filename);
                }

                console.log('ID del usuario:', req.user._id);
                console.log('Datos a actualizar:', updateData);

                const updatedUser = await User.findByIdAndUpdate(
                    req.user._id, 
                    updateData,
                    { new: true }
                ).exec();

                if (!updatedUser) {
                    throw new Error('Usuario no encontrado');
                }

                console.log('Usuario actualizado:', updatedUser);

                return res.status(200).json({ 
                    message: 'Perfil actualizado correctamente',
                    user: updatedUser
                });
            } catch (error) {
                console.error('Error al actualizar perfil:', error);
                return res.status(500).json({ 
                    message: 'Error al actualizar el perfil',
                    error: error.message 
                });
            }
        }
    );

    // Ruta para editar usuario
    router.post('/base/users/form/edit/:id', uploadUser.single('profileImage'), async (req, res) => {
        try {
            const { name, email, password, role } = req.body;
            const updateData = { name, email, role };
            
            if (password) {
                updateData.password = password;
            }
            
            if (req.file) {
                // Eliminar la imagen anterior si existe
                const user = await User.findById(req.params.id);
                if (user && user.profileImage && user.profileImage !== 'default-profile.png') {
                    const oldImagePath = path.join(__dirname, '../public/images', user.profileImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updateData.profileImage = req.file.filename;
            }
            
            await User.findByIdAndUpdate(req.params.id, updateData);
            res.redirect('/base/users/list');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send('Error al actualizar usuario');
        }
    });

    // Ruta para listar usuarios con paginación
    router.get('/base/users/list', ensureAuthenticated, async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const searchQuery = req.query.search || '';
            
            // Crear el objeto de búsqueda
            const searchObj = {};
            if (searchQuery) {
                searchObj.$or = [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } }
                ];
            }

            // Contar total de documentos para la paginación
            const totalDocs = await User.countDocuments(searchObj);
            const totalPages = Math.ceil(totalDocs / limit);

            // Obtener usuarios con paginación
            const users = await User.find(searchObj)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            res.renderModuleView('base/users', 'users_list', {
                users,
                currentPage: page,
                totalPages,
                limit,
                searchQuery,
                user: req.user,
                modules: req.modules,
                modelView: 'base/users/list',
                title: 'Lista de Usuarios'
            });

        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            req.flash('error_msg', 'Error al cargar la lista de usuarios');
            res.redirect('/');
        }
    });
};
