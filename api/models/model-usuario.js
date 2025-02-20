const { info } = require('winston');
const mysql = require('./../database/mysql');
const codificarSenha =  require('./../middlewares/codificarSenha')


const find = async ({ 
    nome = null, 
    identidade = null,
    email = null,
    telefone = null, 
    senha = null,
    status = 1
}) => {
        try{
            const query = "SELECT * FROM tb_usuario "
            let where = " WHERE 1 = 1 "
            let params = []

            
            if(nome) {
                where += " AND nome LIKE ?"
                params.push(`%${nome}%`)
            }

            if(telefone) {
                where += " AND telefone LIKE ?"
                params.push(`%${telefone}%`)
            }
            
            if(identidade && email) {
                where += " AND identidade = ? OR email = ?"
                params.push(identidade)
                params.push(email)
            } else {
                if(identidade) {
                    where += " AND identidade = ?"
                    params.push(identidade)
                }
                
                if(email) {
                    where += " AND email = ?"
                    params.push(email)
                }
            }
            
            if(senha) {
                senha = await codificarSenha.codificarSenha(senha);
                where += " AND senha = ?"
                params.push(senha)
            }

            
            if( status != -1 ) { where += " AND status = ?"; params.push(status) }

            if(identidade || email) var limit = " LIMIT 1"

            const buscar = await mysql.execute( query + where + limit, params )

            return buscar 
        } catch ( error ) {
            return []
        }
}

const findID = async (id = null, status = 1) => {
    try{
        if(!id) return 0

        let where = ""
        let params = [id]
        
        if( status != -1 ) { where += " AND status = ?"; params.push(status) }

        const buscar = await mysql.execute( `SELECT * FROM tb_usuario WHERE id_usuario = ? ${where} LIMIT 1`, params )

        if(buscar.length <= 0) return 0

        return buscar 
    } catch ( error ) {
        return 0
    }
}

const create = async ({ 
    nome = null, 
    identidade = null,
    email = null,
    senha = null,
    telefone = null
}) => {
    try{
        if(!nome || !identidade || !email || !senha) return 0

        const verificarIdentidade = await find( {identidade } )
        if(verificarIdentidade.length >= 1) { return -1 } 

        const verificarEmail = await find( {email } )
        if(verificarEmail.length >= 1) { return -2 } 

        senha = await codificarSenha.codificarSenha(senha);
        
        const inserir = await mysql.execute(
            "INSERT INTO tb_usuario (nome,identidade,email,senha,telefone) VALUES (?,?,?,?,?)",
            [nome, identidade, email, senha, telefone]
        )

        if( inserir.affectedRows <= 0 ) { return 0 }

        return inserir.insertId 
        
    } catch (error) {
        return 0
    }
}

module.exports = {
    find,
    findID,
    create
}
