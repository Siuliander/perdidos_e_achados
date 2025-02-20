const express = require('express');
const cors = require('cors')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
require('dotenv').config();

const configuracaoCORS = require('./configs/cors.config')
const log = require('./configs/logger.config');

const app = express();

// app.use( configuracaoCORS )

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers",'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, content-type, Date, X-Api-Version, Authorization')
    res.header("Access-Control-Allow-Methods","GET,OPTIONS,PATCH,DELETE,POST,PUT")
    res.header("Access-Control-Allow-Credentials","true")
  
    app.use( cors() )
    next()
} )


// Configura o middleware cookie-parser
app.use( cookieParser() );
app.use( bodyParser.json() );
app.use( bodyParser.raw() )
app.use( bodyParser.urlencoded( { extended : false }) )

app.use( xss() )

try {

    /**
     * IMPORTANDO AS ROTAS
     */
    

    /**
     * USANDO OU CRIANDO AS ROTAS
     */
    


} catch (error) { 
    log.error(error.message);  // Registrar o erro no log

} finally {
    
    /**
     * INICIALIZANDO AS CONFIGURAÇÕES DO SERVIDOR
     */

    const PORT = process.env.API_PORT || 3000;
    const HOST = process.env.API_HOST || '127.0.0.1';
    app.listen( PORT , log.info( `Servidor 'API Perdidos e Achados' rodando: { Host: ${HOST} , Port: ${PORT} }`) )
}