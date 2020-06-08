const express = require('express');
const bodyParser= require('body-parser');
const morgan = require('morgan')
const mongoose = require('mongoose')

const productosRouter = require('./api/recursos/productos/productos.routes')
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes')
const logger = require('./utils/logger')
const authJWT = require('./api/libs/auth')
const config = require('./config')

const passport = require('passport')

// autenticación básica

passport.use(authJWT)
mongoose.connect('mongodb://127.0.0.1:27017/vendetuscorotos') //API ADRESS localhost:puerto en el que corre mongo/databasename
mongoose.connection.on('error',()=>{
    logger.error('Falló la conexión a mongodb')
    process.exit(1) // nuestro servicio no puede funcionar si nuestra base de datos no esta conectada
})

const app = express();
// servidor escuche en el puerto 3000
//para que el request.body exista
app.use(bodyParser.json())
app.use(morgan('short',{
    stream:{
        write: message => logger.info (message.trim())
    }
}))



app.use(passport.initialize())

// cuando llegue el request a /productos  que se lo envie al router de productos
app.use('/productos',productosRouter)
app.use('/usuarios', usuariosRouter)

app.listen(config.puerto,()=>{
logger.info('escuchando en el puerto 3000')
});