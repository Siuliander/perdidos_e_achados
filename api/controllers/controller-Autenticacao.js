const Usuario = require('./../models/model-usuario');
const log = require('./../configs/logger.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registrar = async (req, res) => {
    const nome = req.body.nome || req.param.nome || req.query.nome || null ;
    const identidade = req.body.identidade || req.param.identidade || req.query.identidade || null ;
    const email = req.body.email || req.param.email || req.query.email || null ;
    const senha = req.body.senha || req.param.senha || req.query.senha || null ;
    const telefone  = req.body.telefone || req.param.telefone || req.query.telefone || null ;

    try {
        const usuario = { nome, identidade, email, senha, telefone }

        const criar =  await Usuario.create( usuario );

        if(!criar) res.status(400).json({ error: "Erro ao registrar usuário" });

        if(criar === -1) res.status(400).json({ error: "Erro ao registrar usuário : Identidade Não Disponível" });
        if(criar === -2) res.status(400).json({ error: "Erro ao registrar usuário : Email Não Disponível" });

        usuario.senha = undefined
        const token = jwt.sign({ id: criar, identidade, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
        res.status(201).json({ usuario, token , mensagem: "Usuário registrado com sucesso" });

    } catch (error) {
        log.error(`Erro ao registrar usuário: ${error.message}`);
        return res.status(400).json({ error: "Erro ao registrar usuário" });
    }
};

const login = async (req, res) => {
    const identidade = req.body.identidade || req.param.identidade || req.query.identidade || null ;
    const email = req.body.email || req.param.email || req.query.email || null ;
    const senha = req.body.senha || req.param.senha || req.query.senha || null ;
    
    try { 
        const usuario =  await Usuario.find( { email } );
        if (!usuario || usuario.length <= 0 ) return res.status(400).json({ error: "Usuário não encontrado" });

        const isMatch = await bcrypt.compare(senha, usuario[0].senha);
        if (!isMatch) return res.status(400).json({ error: "Senha incorreta" });

        const token = jwt.sign({ id: usuario[0].id_usuario, identidade:usuario[0].identidade, email:usuario[0].email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
        res.status(200).json({ token });
    } catch (error) {
        log.error(`Erro ao fazer login: ${error.message}`);
        return res.status(400).json({ error: "Erro ao fazer login" });
    }
};

const logout = async (req, res) => {
    const token = req.token;
    
    try { 
        
        const isMatch = await bcrypt.compare(senha, usuario[0].senha);
        if (!isMatch) return res.status(400).json({ error: "Senha incorreta" });

        const token = jwt.decode()  ({ id: usuario[0].id_usuario, identidade:usuario[0].identidade, email:usuario[0].email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
        res.status(200).json({ token });
    } catch (error) {
        log.error(`Erro ao fazer login: ${error.message}`);
        return res.status(400).json({ error: "Erro ao fazer login" });
    }
};


module.exports = {
    registrar,
    login
}