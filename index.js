const express = require('express');
const bodyParser= require('body-parser');
const productosRouter = require('./api/recursos/productos/productos.routes')
const winston = require('winston');


const logger = winston.createLogger({
transports:[
    new winston.transports.Console({
        level:'debug',
        handleExceptions: true, 
        format: winston.format.combine(winston.format.colorize(),
        winston.format.simple())
    })
]
})

// Winston
logger.info("Hola soy Winston")
logger.error("Algo  exploto")
logger.warn("Algo inesperado ocurrio")
logger.debug("llamada de debugger")


const app = express();
// servidor escuche en el puerto 3000
//para que el request.body exista
app.use(bodyParser.json())
// cuando llegue el request a /productos  que se lo envie al router de productos
app.use('/productos',productosRouter)







// definir la primera ruta 
// formato de rutas express
app.get('/',(req,res)=>{
res.send('API DE VENDETUSCOROTOS.COM')
})
app.listen('3000',()=>{
console.log('escuchando en el puerto 3000')
});