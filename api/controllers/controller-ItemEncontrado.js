const ItemEncontrado = require('./../models/model-ItemEncontrado');
const log = require('./../configs/logger.config');

exports.BuscarTodosItensEncontrados = async (req, res) => {
    try {
        const descricao = req.body.descricao || req.params.descricao || req.query.descricao || null ;
        const data_encontro = req.body.data_encontro || req.params.data_encontro || req.query.data_encontro || null ;
        const local_encontro = req.body.local_encontro || req.params.local_encontro || req.query.local_encontro || null ;
        const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;
        const status = req.body.status || req.params.status || req.query.status || 1 ;

        const itensEncontrados = await ItemEncontrado.find({descricao, data_encontro, local_encontro, categoria, status})

        if(itensEncontrados.length <= 0) return res.status(404).json({ error: 'Sem Itens Encontrados' });

        return res.status(200).json({count: itensEncontrados.length, results: itensEncontrados});
    } catch (error) {
        log.error(`Erro ao buscar itens Encontrados: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao buscar itens Encontrados 1' });
    }
};

exports.BuscarMeusItensEncontrados = async (req, res) => {
    try {
        const usuario = req.usuario.id ;
        const descricao = req.body.descricao || req.params.descricao || req.query.descricao || null ;
        const data_encontro = req.body.data_encontro || req.params.data_encontro || req.query.data_encontro || null ;
        const local_encontro = req.body.local_encontro || req.params.local_encontro || req.query.local_encontro || null ;
        const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

        const itensEncontrados = await ItemEncontrado.find({usuario, descricao, data_encontro, local_encontro, categoria})

        if(itensEncontrados.length <= 0) return res.status(404).json({ error: 'Sem Itens meus Encontrados' });

        return res.status(200).json({count: itensEncontrados.length, results: itensEncontrados});
    } catch (error) {
        log.error(`Erro ao buscar meus itens Encontrados: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao buscar meus itens Encontrados' });
    }
};

exports.BuscarItemEncontradoID = async (req, res) => {
    try {
        const id = req.body.id || req.params.id || req.query.id || null ;
        const itemEncontrado = await ItemEncontrado.findID( id );

        if (!itemEncontrado || itemEncontrado.length <= 0) return res.status(404).json({ error: 'Item não Encontrado' });

        return res.status(200).json({count: itemEncontrado.length, results: itemEncontrado});
    } catch (error) {
        log.error(`Erro ao buscar item Encontrado por ID: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao buscar item Encontrado por ID' });
    }
};

exports.createItemEncontrado = async (req, res) => {
    const descricao = req.body.descricao || req.params.descricao || req.query.descricao || "";
    const data_encontro = req.body.data_encontro || req.params.data_encontro || req.query.data_encontro || "" ;
    const local_encontro = req.body.local_encontro || req.params.local_encontro || req.query.local_encontro || "" ;
    const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

    try {

        const criarNovoItem = await ItemEncontrado.create({
            usuario: req.usuario.id,
            descricao,
            data_encontro,
            local_encontro,
            categoria
        });

        if(!criarNovoItem) return res.status(500).json({ error: 'Erro ao criar item Encontrado' });
        
        const novoItem = [{ id_item_Encontrado: criarNovoItem, id_usuario: req.usuario.id, descricao, data_encontro, local_encontro, id_categoria: categoria, status: 1 }]

        return res.status(201).json({count: novoItem.length, results: novoItem, mensagem: "Item Encontrado publicado com sucesso"});
    } catch (error) {
        log.error(`Erro ao criar item Encontrado: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao criar item Encontrado' });
    }
};

exports.updateItemEncontrado = async (req, res) => {
    const id = req.body.id || req.params.id || req.query.id || "";
    const descricao = req.body.descricao || req.params.descricao || req.query.descricao || "";
    const data_encontro = req.body.data_encontro || req.params.data_encontro || req.query.data_encontro || "" ;
    const local_encontro = req.body.local_encontro || req.params.local_encontro || req.query.local_encontro || "" ;
    const categoria = req.body.categoria || req.params.categoria || req.query.categoria || 0 ;

    try {
        const itemEncontrado = await ItemEncontrado.findID(id);

        if (!itemEncontrado)  return res.status(404).json({ error: 'Item não Encontrado' });

        if( itemEncontrado[0].id_usuario != req.usuario.id ) return res.status(500).json({ error: 'Sem permissão para alterar este Item Encontrado' });

        if (descricao) itemEncontrado[0].descricao = descricao;
        if (data_encontro) itemEncontrado[0].data_encontro = data_encontro;
        if (local_encontro) itemEncontrado[0].local_encontro = local_encontro;
        if (categoria) itemEncontrado[0].id_categoria = categoria;

        const salvarAlteracao = await ItemEncontrado.update(id, req.usuario.id, { descricao, data_encontro, local_encontro, categoria})
        
        if (!salvarAlteracao) return res.status(400).json({ error: 'Item Encontrado não actualizado' });

        return res.status(201).json({count: itemEncontrado.length,  affected: salvarAlteracao, results: itemEncontrado, mensagem: "Item Encontrado actualizado com sucesso"});
    } catch (error) {
        log.error(`Erro ao atualizar item Encontrado: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao atualizar item Encontrado' });
    }
};

exports.deleteItemEncontrado = async (req, res) => {
    try {
        
        const id = req.body.id || req.params.id || req.query.id || "";
        
        const itemEncontrado = await ItemEncontrado.findID(id);

        if (!itemEncontrado) return res.status(404).json({ error: 'Item não Encontrado' });

        if( itemEncontrado[0].id_usuario != req.usuario.id ) return res.status(500).json({ error: 'Sem permissão para eliminar este Item Encontrado' });

        const removerItem = await ItemEncontrado.remove(id, req.usuario.id)
        
        if (!removerItem)  return res.status(400).json({ error: 'Item Encontrado não eliminado' });

        return res.status(200).json({count: 0, affected: removerItem, results: [], mensagem: "Item Encontrado eliminado com sucesso"});
    } catch (error) {
        log.error(`Erro ao eliminar item Encontrado: ${error.message}`);
        return res.status(500).json({ error: 'Erro ao eliminar item Encontrado' });
    }
};
