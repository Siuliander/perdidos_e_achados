
try{
    const log = require('./../configs/logger.config');
    const express = require('express');
    var router = express.Router();
    const verificacaoToken = require('../middlewares/verificacaoToken');
    const controllerItemEncontrado = require('./../controllers/controller-ItemEncontrado');

    router.get('/', controllerItemEncontrado.BuscarTodosItensEncontrados);
    router.get('/id/:id/', controllerItemEncontrado.BuscarItemEncontradoID);
    router.get('/meus', verificacaoToken, controllerItemEncontrado.BuscarMeusItensEncontrados);

    router.post('/', verificacaoToken, controllerItemEncontrado.createItemEncontrado);

    router.put('/', verificacaoToken, controllerItemEncontrado.updateItemEncontrado);
    router.put('/:id', verificacaoToken, controllerItemEncontrado.updateItemEncontrado);
    
    router.delete('/', verificacaoToken, controllerItemEncontrado.deleteItemEncontrado);
    router.delete('/:id', verificacaoToken, controllerItemEncontrado.deleteItemEncontrado);

    
}  catch (error) {
    log.error(`Erro em Route-ItemEncontrado: ${error.message}`);
} finally {
    module.exports = router;
}
