const bcrypt = require('bcryptjs');
// Función reutilizable para obtener resultados paginados y filtrados
exports.getItemsPaginated = async(req, res, moduleName, view, Model, title) => {
    if (req.user.role !== 'admin') {
      req.flash('error_msg', 'Acceso denegado');
      return res.redirect('/');
    }
    const searchFields = Object.keys(Model.schema.paths).filter(path => {
      const schemaType = Model.schema.paths[path];
      return (
        schemaType.instance === 'String' ||
        (schemaType.instance === 'Array' && schemaType.caster.instance === 'String')
      ) && !path.startsWith('_');
    });
    let searchQuery = req.query.search || ''; // Obtener la consulta de búsqueda
    let page = parseInt(req.query.page) || 1; // Obtener el número de página
    let limit = parseInt(req.query.limit) || 5; // Número de registros por página
    let skip = (page - 1) * limit; // Calcular cuántos registros saltar
    // Asegurarse de que los valores de página y límite sean válidos
    if (page < 1) page = 1;
    if (limit < 1) limit = 5;
    let results, totalResults;
    try {
      // Construir el filtro de búsqueda en base a los campos indicados
      const searchRegex = searchQuery 
        ? { $or: 
              searchFields.map(field => ({ 
                [field]: { $regex: searchQuery, $options: 'i' } }))
          } 
        : {};
      // Obtener los resultados con paginación y búsqueda
      results = await Model.find(searchRegex)
        .skip(skip)
        .limit(limit);
      // Contar el total de resultados
      totalResults = await Model.countDocuments(searchRegex);
      // Calcular total de páginas
      let totalPages = Math.ceil(totalResults / limit);
      // Asegurarse de que la página no exceda el número total de páginas
      if (page > totalPages) page = totalPages;
      // Renderizar la vista, pasando los resultados, búsqueda y paginación
      res.renderModuleView(moduleName, view, {
        results,
        user: req.user,  // Usuario autenticado
        searchQuery,
        currentPage: page,
        totalPages,
        limit,
        title: `${Model.modelName}`,
        moduleName: moduleName,
        modules:req.modules,
      });
      
    } catch (err) {
      console.error('Error al obtener los resultados:', err);
      req.flash('error_msg', 'Error al cargar los resultados.');
      res.redirect('/');
    }
};

exports.createItem = async (req, res, moduleName, Model) => {
    try {
        const { name, email, password, password2, role } = req.body;
        let errors = [];

        // Validaciones
        if (!name || !email || !password || !password2) {
            errors.push({ msg: 'Por favor llena todos los campos' });
        }

        if (password !== password2) {
            errors.push({ msg: 'Las contraseñas no coinciden' });
        }

        if (password.length < 6) {
            errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
        }

        if (errors.length > 0) {
            req.flash('error_msg', errors.map(error => error.msg).join('. '));
            return res.redirect(`/${moduleName}/list`);
        }

        // Verificar si el email ya existe
        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'El correo electrónico ya está registrado');
            return res.redirect(`/${moduleName}/list`);
        }

        // Preparar los datos del usuario
        const fields = Object.keys(Model.schema.paths).filter(path => !path.startsWith('_'));
        let data = {};
        fields.forEach(field => {
            if (req.body[field] !== undefined && field !== 'password') {
                data[field] = req.body[field];
            }
        });

        // Establecer imagen por defecto si no se subió una nueva
        data.profileImage = req.file ? req.file.filename : 'user-default.png';

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(password, salt);

        // Crear y guardar el nuevo usuario
        const newItem = new Model(data);
        await newItem.save();

        req.flash('success_msg', `${Model.modelName} creado correctamente`);
        res.redirect(`/${moduleName}/list`);

    } catch (err) {
        console.error(`Error al crear ${Model.modelName}:`, err);
        req.flash('error_msg', `Error al crear el ${Model.modelName}`);
        res.redirect(`/${moduleName}/list`);
    }
};

exports.updateItem = async (req, res, moduleName, Model) => {
    try {
        const fields = Object.keys(Model.schema.paths).filter(path => !path.startsWith('_'));
        let data = {};
        
        // Copiar campos excepto la contraseña
        fields.forEach(field => {
            if (req.body[field] !== undefined && field !== 'password') {
                data[field] = req.body[field];
            }
        });

        // Manejar la imagen si se subió una nueva
        if (req.file) {
            data.profileImage = req.file.filename;
        }

        // Si se proporcionó una nueva contraseña, encriptarla
        if (req.body.password && req.body.password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(req.body.password, salt);
        }

        await Model.findByIdAndUpdate(req.params.id, data);
        req.flash('success_msg', `${Model.modelName} actualizado correctamente`);
        res.redirect(`/${moduleName}/list`);
    } catch (err) {
        console.error(`Error al actualizar ${Model.modelName}:`, err);
        req.flash('error_msg', `Error al actualizar el ${Model.modelName}`);
        res.redirect(`/${moduleName}/form/edit/${req.params.id}`);
    }
};

// Eliminar un usuario
exports.deleteItem = async (req, res, moduleName, Model) => {
    try {
      await Model.findByIdAndDelete(req.params.id); // Eliminar el usuario por ID
      req.flash('success_msg', `${Model.modelName} eliminado correctamente.`);
      res.redirect(`/${moduleName}/list`);
    } catch (err) {
      console.error(`Error al eliminar ${Model.modelName}:`, err);
      req.flash('error_msg', `Error al eliminar el ${Model.modelName}.`);
      res.redirect(`/${moduleName}/list`);
    }
};


exports.showPedidos = async (req, res, moduleName, view, Model, title) => {

    res.renderModuleView(moduleName, view, {
      title: title,
      moduleName: moduleName,
      user: req.user,  // Usuario autenticado
      modules: req.modules
    });
    // Renderiza el formulario de edición
};

