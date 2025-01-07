// routes/userRoutes.js
const express = require('express');
//const router = express.Router();
const mainController = require('../controllers/mainController');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth'); // Importar los middlewares de autenticació
const User = require('../modules//base/users/models'); // Importa el modelo User
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const router = express.Router();
const fs = require('fs');
const path = require('path');

const upload = require('../config/multer');

module.exports = function(router, params) {
  
    // Rutas para usuarios
    router.get(`${params.route}/list`, ensureAuthenticated, isAdmin,  (req, res, next) => {  
        mainController.getItemsPaginated(req,res,params.moduleName,params.view_list,params.model,params.title).catch(next) 
    }); 

    
    router.post(`${params.route}/form/new`, ensureAuthenticated, isAdmin, upload.single('profileImage'), (req, res, next) => mainController.createItem(req,res,params.moduleName,params.model).catch(next));
    
    
    router.post(`${params.route}/form/edit/:id`, ensureAuthenticated, isAdmin, upload.single('profileImage'), (req, res, next) => mainController.updateItem(req,res,params.moduleName,params.model).catch(next)); // 
    
    router.post(`${params.route}/form/delete/:id`, ensureAuthenticated, isAdmin, (req, res, next) => mainController.deleteItem(req,res,params.moduleName,params.model).catch(next)); // Eliminar un usuario

    router.get(`${params.route}/export`, async (req, res) => {
        try {
            const users = await User.find();
    
            const csvWriter = createCsvWriter({
                path: 'users.csv',
                header: [
                    { id: '_id', title: 'ID' },
                    { id: 'name', title: 'Nombre' },
                    { id: 'email', title: 'Email' },
                    { id: 'role', title: 'Rol' }
                ]
            });
    
            await csvWriter.writeRecords(users);
    
            res.download('users.csv', 'users.csv', err => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).send('Error al exportar usuarios.');
                } else {
                    console.log('Archivo descargado con éxito.');
                }
            });
        } catch (err) {
            console.error('Error al exportar usuarios:', err);
            res.status(500).send('Error al exportar usuarios.');
        }
    });
};
