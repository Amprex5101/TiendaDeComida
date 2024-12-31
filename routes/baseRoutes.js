// routes/userRoutes.js
const express = require('express');
//const router = express.Router();
const mainController = require('../controllers/mainController');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth'); // Importar los middlewares de autenticació

const upload = require('../config/multer');

module.exports = function(router, params) {
  
    // Rutas para usuarios
    router.get(`${params.route}/list`, ensureAuthenticated, isAdmin,  (req, res, next) => {  
        mainController.getItemsPaginated(req,res,params.moduleName,params.view_list,params.model,params.title).catch(next) 
    }); 

    
    router.post(`${params.route}/form/new`, ensureAuthenticated, isAdmin, upload.single('profileImage'), (req, res, next) => mainController.createItem(req,res,params.moduleName,params.model).catch(next));
    
    
    router.post(`${params.route}/form/edit/:id`, ensureAuthenticated, isAdmin, upload.single('profileImage'), (req, res, next) => mainController.updateItem(req,res,params.moduleName,params.model).catch(next)); // 
    
    router.post(`${params.route}/form/delete/:id`, ensureAuthenticated, isAdmin, (req, res, next) => mainController.deleteItem(req,res,params.moduleName,params.model).catch(next)); // Eliminar un usuario
};
