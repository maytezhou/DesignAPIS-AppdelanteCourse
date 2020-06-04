const express = require('express');
const bodyParser= require('body-parser');
const productosRouter = require('./api/recursos/productos/productos.routes')
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes')
const morgan = require('morgan')
const logger = require('./utils/logger')
const auth = require('./api/libs/auth')

const passport = require('passport')

// autenticación básica
const BasicStrategy = require('passport-http').BasicStrategy
passport.use(new BasicStrategy(auth))


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



// definir la primera ruta 
// formato de rutas express
app.get('/',passport.authenticate('basic',{ session:false}),(req,res)=>{
res.send('Api de vendetuscorotos.com')
})
app.listen('3000',()=>{
logger.info('escuchando en el puerto 3000')
});