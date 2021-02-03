    
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    const userController= require('../controllers/user');
    const checkAuth = require('../middleware/checkAuth');
    
    router.post('/signup', userController.usersSignUp);
    router.post("/login", userController.usersLogin);
        
    router.delete('/:userId',checkAuth, userController.userDelete);
    router.get('/',userController.userAll);
    router.post('/forgot',userController.forgotpassword);
    module.exports = router;