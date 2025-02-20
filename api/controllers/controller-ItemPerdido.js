const ItemPerdido = require('./../models/model-ItemPerdido');
const log = require('./../configs/logger.config');

exports.BuscarTodosItensPerdidos = async (req, res) => {
    try {
        const descricao = req.body.descricao || req.params.descricao || req.query.descricao || null ;
        const data_perda = req.body.data_perda || req.params.data_perda || req.query.data_perda || null ;
        const local_perda = req.body.local_perda || req.params.local_perda || req.query.local_perda || null ;
        const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

        const itensPerdidos = await ItemPerdido.find({descricao, data_perda, local_perda, categoria})

        if(itensPerdidos.length <= 0) return res.status(404).json({ error: 'Sem Itens perdidos' });

        return res.status(200).json({count: itensPerdidos.length, result: itensPerdidos});
    } catch (error) {
        log.error(`Erro ao buscar itens perdidos: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao buscar itens perdidos' });
    }
};

exports.BuscarMeusItensPerdidos = async (req, res) => {
    try {
        const usuario = req.usuario.id ;
        const descricao = req.body.descricao || req.params.descricao || req.query.descricao || null ;
        const data_perda = req.body.data_perda || req.params.data_perda || req.query.data_perda || null ;
        const local_perda = req.body.local_perda || req.params.local_perda || req.query.local_perda || null ;
        const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

        const itensPerdidos = await ItemPerdido.find({usuario, descricao, data_perda, local_perda, categoria})

        if(itensPerdidos.length <= 0) return res.status(404).json({ error: 'Sem Itens meus perdidos' });

        return res.status(200).json({count: itensPerdidos.length, result: itensPerdidos});
    } catch (error) {
        log.error(`Erro ao buscar meus itens perdidos: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao buscar meus itens perdidos' });
    }
};

exports.BuscarItemPerdidoID = async (req, res) => {
    try {
        const id = req.body.id || req.params.id || req.query.id || null ;
        const itemPerdido = await ItemPerdido.findID( id );
        if (!itemPerdido || itemPerdido.length <= 0) {
            return res.status(404).json({ error: 'Item perdido não encontrado' });
        }
        return res.status(200).json({count: itemPerdido.length, result: itemPerdido});
    } catch (error) {
        log.error(`Erro ao buscar item perdido por ID: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao buscar item perdido por ID' });
    }
};

exports.createItemPerdido = async (req, res) => {
    const descricao = req.body.descricao || req.params.descricao || req.query.descricao || "";
    const data_perda = req.body.data_perda || req.params.data_perda || req.query.data_perda || "" ;
    const local_perda = req.body.local_perda || req.params.local_perda || req.query.local_perda || "" ;
    const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

    try {

        const criarNovoItem = await ItemPerdido.create({
            usuario: req.usuario.id,
            descricao,
            data_perda,
            local_perda,
            categoria
        });

        if(!criarNovoItem) return res.status(500).json({ error: 'Erro ao criar item perdido' });
        
        const novoItem = [{ id_item_perdido: criarNovoItem, id_usuario: req.usuario.id, descricao, data_perda, local_perda, id_categoria: categoria, status: 1 }]

        return res.status(201).json({count: novoItem.length, result: novoItem, mensagem: "Item Perdido publicado com sucesso"});
    } catch (error) {
        log.error(`Erro ao criar item perdido: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao criar item perdido' });
    }
};

exports.updateItemPerdido = async (req, res) => {
    const id = req.body.id || req.params.id || req.query.id || "";
    const descricao = req.body.descricao || req.params.descricao || req.query.descricao || "";
    const data_perda = req.body.data_perda || req.params.data_perda || req.query.data_perda || "" ;
    const local_perda = req.body.local_perda || req.params.local_perda || req.query.local_perda || "" ;
    const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

    try {
        const itemPerdido = await ItemPerdido.findID(id);

        if (!itemPerdido)  return res.status(404).json({ error: 'Item perdido não encontrado' });

        if( itemPerdido[0].id_usuario != req.usuario.id ) return res.status(500).json({ error: 'Sem permissão para alterar este Item Perdido' });

        if (descricao) itemPerdido[0].descricao = descricao;
        if (data_perda) itemPerdido[0].data_perda = data_perda;
        if (local_perda) itemPerdido[0].local_perda = local_perda;
        if (categoria) itemPerdido[0].id_categoria = categoria;

        const salvarAlteracao = await ItemPerdido.update(id, req.usuario.id, { descricao, data_perda, local_perda, categoria})
        
        if (!salvarAlteracao)  return res.status(400).json({ error: 'Item perdido não actualizado' });

        return res.status(201).json({count: itemPerdido.length,  affected: salvarAlteracao, result: itemPerdido, mensagem: "Item Perdido actualizado com sucesso"});
    } catch (error) {
        log.error(`Erro ao atualizar item perdido: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao atualizar item perdido' });
    }
};

exports.deleteItemPerdido = async (req, res) => {
    try {
        
        const id = req.body.id || req.params.id || req.query.id || "";
        
        const itemPerdido = await ItemPerdido.findID(id);

        if (!itemPerdido) return res.status(404).json({ error: 'Item perdido não encontrado' });

        if( itemPerdido[0].id_usuario != req.usuario.id ) return res.status(500).json({ error: 'Sem permissão para eliminar este Item Perdido' });

        const removerItem = await ItemPerdido.remove(id, req.usuario.id)
        
        if (!removerItem) return res.status(400).json({ error: 'Item perdido não eliminado' });

        return res.status(200).json({count: 0, affected: removerItem, result: [], mensagem: "Item Perdido eliminado com sucesso"});
    } catch (error) {
        log.error(`Erro ao eliminar item perdido: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao eliminar item perdido' });
    }
};
