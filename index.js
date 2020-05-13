const express = require('express');
const bodyParser= require('body-parser');
const productosRouter = require('./api/recursos/productos/productos.routes')
const morgan = require('morgan')
const logger = require('./utils/logger')



const app = express();
// servidor escuche en el puerto 3000
//para que el request.body exista
app.use(bodyParser.json())
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