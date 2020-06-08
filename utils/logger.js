const winston = require('winston');
 /*
 Niveles de Logs:
 error:0
 warn:1
 info:2
 verbose:3
 debug:4
 silly:5
 
 */

const incluirFecha = winston.format((info)=>{
info.message = `${new Date().toISOString()} ${info.message}`
return info
})


module.exports = winston.createLogger({
transports:[
    new winston.transports.Console({
        level:'debug',
        json:false,
        
        handleExceptions: true, 
        format: winston.format.combine(winston.format.colorize(),
        winston.format.simple()),
        prettyPrint: object => { return JSON.stringify(object) }
    }),
    new winston.transports.File({
        level:'info',
        json:false,
        handleExceptions: true,
        format: winston.format.combine(
        incluirFecha(),
        winston.format.simple()),
        maxsize: 5120000  , // 5 mb tamaño maximo de mi archivo de log
        maxFiles: 5,
        filename: `${__dirname}/../logs/logs-de-aplicacion.log`,
        prettyPrint: object => { return JSON.stringify(object) }
    })
]
})