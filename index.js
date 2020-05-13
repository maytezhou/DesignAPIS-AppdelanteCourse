const express = require('express');
const bodyParser= require('body-parser');
const productosRouter = require('./api/recursos/productos/productos.routes')
const morgan = require('morgan')
const logger = require('./utils/logger')


function autenticarUsuario (req,res, next){
if(baseDeDatosUsuario(req.body.username)){
 //...  // verificar contraseña
next ()
}else{
    res.send(404)
}
}


const app = express();
// servidor escuche en el puerto 3000
//para que el request.body exista
app.use(bodyParser.json())
app.use(morgan('short',{
    stream:{
        write: message => logger.info (message.trim())
    }
}))
// cuando llegue el request a /productos  que se lo envie al router de productos
app.use('/productos',productosRouter)



// definir la primera ruta 
// formato de rutas express
app.get('/',(req,res)=>{
res.send('Api de vendetuscorotos.com')
})
app.listen('3000',()=>{
logger.info('escuchando en el puerto 3000')
});