
try{
    const express = require('express');
    var router = express.Router();
    const verificacaoToken = require('../middlewares/verificacaoToken');
    const controllerItemPerdido = require('./../controllers/controller-ItemPerdido');

    router.get('/', controllerItemPerdido.BuscarTodosItensPerdidos);
    router.get('/id/:id/', controllerItemPerdido.BuscarItemPerdidoID);
    router.get('/meus', verificacaoToken, controllerItemPerdido.BuscarMeusItensPerdidos);

    router.post('/', verificacaoToken, controllerItemPerdido.createItemPerdido);

    router.put('/', verificacaoToken, controllerItemPerdido.updateItemPerdido);
    router.put('/:id', verificacaoToken, controllerItemPerdido.updateItemPerdido);
    
    router.delete('/', verificacaoToken, controllerItemPerdido.deleteItemPerdido);
    router.delete('/:id', verificacaoToken, controllerItemPerdido.deleteItemPerdido);

    
}  catch (error) {
    throw  new Error(`Erro em Route-Autenticacao: ${error.message}`);
} finally {
    module.exports = router;
}
