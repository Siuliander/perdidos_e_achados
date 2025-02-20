const jwt = require('jsonwebtoken');
const modelUsuario = require('./../models/model-usuario')
const log = require('./../configs/logger.config')

const verificarToken = async (req, res, next) => {
    // const token = req.header('Authorization') .replace('Bearer ', '');
    
    const token = ( 
            req.headers.authorization 
         || req.authorization
         || req.cookie.auth_token
         || req.cookie.token
         || req.token
         || req.header.token 
         || req.body.token  
         || req.param.token  
         || req.query.token || ""
        ).replace('Bearer ', '');

    if (!token) return res.status(401).json({ error: "Acesso negado" });

    try {
        const decodificar = jwt.verify(token, process.env.JWT_SECRET);
        
        const buscarUsuario = await modelUsuario.findID(decodificar.id,-1)

        if(!buscarUsuario) return res.status(401).json({ error: "Token inválido: Conta não encontrada" });
        
        if(buscarUsuario[0].status != 1) return res.status(401).json({ error: "Token inválido: Conta indiponível" });

        req.usuario = decodificar;
        next();
    } catch (error) {
        log.error(`Erro Token inválido: ${error.message}`)
        return res.status(401).json({ error: "Token inválido" });
    }
};

module.exports = verificarToken;
