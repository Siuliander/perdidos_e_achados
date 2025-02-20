
try{
    const express = require('express');
    var router = express.Router();
    const controllerAutenticacao = require('./../controllers/controller-Autenticacao');

    router.post('/registrar/', controllerAutenticacao.registrar);
    router.post('/login/', controllerAutenticacao.login);

    
}  catch (error) {
    throw  new Error(`Erro em Route-Autenticacao: ${error.message}`);
} finally {
    module.exports = router;
}
