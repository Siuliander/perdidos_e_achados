const mysql = require('./../database/mysql');

exports.find = async ({
    usuario = 0 ,
    descricao = null ,
    data_encontro = null,
    local_encontro = null,
    categoria = 0 ,
    status = 1
}) => {
    try{
        
        const query = "SELECT * FROM tb_item_encontrado "
        let where = " WHERE 1 = 1 "
        let params = []

        if(descricao) { where += " AND descricao LIKE ?"; params.push(`%${descricao}%`) }

        if(data_encontro) { where += " AND data_encontro LIKE ?"; params.push(`%${data_encontro}%`) }
        
        if(local_encontro) { where += " AND local_encontro LIKE ?"; params.push(`%${local_encontro}%`) }

        if(categoria) { where += " AND id_categoria = ?"; params.push(categoria) }

        if(usuario) { where += " AND id_usuario = ?"; params.push(usuario) }
        
        if( status != -1 ) { where += " AND status = ?"; params.push(status) }
    
        const buscar = await mysql.execute( query + where, params )

        return buscar 
    } catch ( error ) {
        return []
    }
}

exports.findID = async ( id = null , status = 1 ) => {
    try{
        if( id == null ) return 0
        const params = [id]
        let where = ""

        if( status != -1 ) { where += " AND status = ?"; params.push(status) }

        const buscar = await mysql.execute( `SELECT * FROM tb_item_encontrado WHERE id_item_encontrado = ? ${where} LIMIT 1`, params )

        if(buscar.length <= 0) return 0

        return buscar 
    } catch ( error ) {
        return 0
    }
}

exports.create = async ({
    usuario = 0 ,
    descricao = null ,
    data_encontro = null,
    local_encontro = null,
    categoria = 0
}) => {
    try{
        if ( !usuario || !categoria ) return 0

        const inserir = await mysql.execute(
            "INSERT INTO tb_item_encontrado ( id_usuario, descricao, data_encontro, local_encontro, id_categoria) VALUES (?,?,?,?,?)",
            [usuario , descricao  , data_encontro , local_encontro , categoria]
        )

        if(!inserir.insertId ) { return 0 }
        
        return inserir.insertId 
    } catch (error) {
        return 0
    }
}

exports.update = async ( id = 0 , usuario = 0 , {
    descricao = null ,
    data_encontro = null,
    local_encontro = null,
    categoria = 0
}) => {
    try{
        
        if ( !id || !usuario ) return 0

        let set = "SET data_edicao = NOW()"
        let params = []

        if(descricao) { set += (set == '') ? "SET descricao=?" : ",descricao=?" ; params.push(descricao) }

        if(data_encontro) { set += (set == '') ? "SET data_encontro=?" : ",data_encontro=?"; params.push(data_encontro) }
        
        if(local_encontro) { set += (set == '') ? "SET local_encontro=?" : ",local_encontro=?"; params.push(local_encontro) }

        if(categoria) { set += (set == '') ? "SET id_categoria=?" : ",id_categoria=?"; params.push(categoria) }

        if ( !descricao && !data_encontro && !local_encontro && !categoria ) return 0
        
        params.push(id)
        params.push(usuario)

        const actualizar = await mysql.execute(
            `UPDATE tb_item_encontrado ${set} WHERE status = 1 AND id_item_encontrado = ? AND id_usuario = ? LIMIT 1 `,
            params
        )

        if(!actualizar.affectedRows ) return 0 
        
        return actualizar.affectedRows 
    } catch (error) {
        return 0
    }
}

exports.remove = async ( id = 0 , usuario = 0 ) => {
    try{
        
        if ( !id || !usuario ) return 0

        const remover = await mysql.execute(
            `UPDATE tb_item_encontrado SET status = -1 WHERE 1 = 1 AND id_item_encontrado = ? AND id_usuario = ? LIMIT 1 `,
            [id, usuario]
        )

        if(!remover.affectedRows ) return 0 
        
        return remover.affectedRows 
    } catch (error) {
        return 0
    }
}