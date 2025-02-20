const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Definir formato de log
const FormatoLog = printf( ({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});


// Configurar o logger
const log = createLogger({
    format: combine(
        colorize(),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        FormatoLog
    ),
    transports: [
        new transports.Console(),
        // new transports.File({ filename: 'logs/error.log', level: 'error' }), // Registrar logs de erro
        // new transports.File({ filename: 'logs/combined.log' })               // Registrar todos os logs
    ]
});

module.exports = log;

/*
// Exemplos de uso
log.error('Isso é um erro crítico');
log.warn('Isso é um aviso');
log.info('Informações importantes sobre o funcionamento');
*/