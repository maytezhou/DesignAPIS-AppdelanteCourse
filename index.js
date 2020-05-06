const express = require('express');
const bodyParser= require('body-parser');
const productosRouter = require('./api/recursos/productos/productos.routes')


const app = express();
// servidor escuche en el puerto 3000
//para que el request.body exista
app.use(bodyParser.json())
// cuando llegue el request a /productos  que se lo envie al router de productos
app.use('/',productosRouter)







// definir la primera ruta 
// formato de rutas express
app.get('/',(req,res)=>{
res.send('API DE VENDETUSCOROTOS.COM')
})
app.listen('3000',()=>{
console.log('escuchando en el puerto 3000')
});