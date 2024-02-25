const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD operations
router.post('/create-user', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.get('/login/:id', userController.getUserByEmail);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;    