const express = require('express');
const bodyParser= require('body-parser');


const app = express();
// servidor escuche en el puerto 3000

const productos = [
    {id :'1234' , titulo: 'Macbook Pro13 Inches', 
    precio :1300 , moneda:'USD'},
    {id :'5678' , titulo: 'Taza de Café', 
    precio :10 , moneda:'USD'},
    {id :'9101' , titulo: 'Micrófono blue yeti', 
    precio :100, moneda:'USD'}
    
]
app.route('/productos') // ruta que nos permite acceder a la coleccion entera de los productos
.get((req,res)=>{
    res.json(productos)
})
//ruta que nos permite agregar un producto



// ruta que nos permite acceder a cada producto
// en la ruta se colocara el id del prodcuto como parametro
app.get('/productos/:id',(req,res)=>{
  //  req.params.id
  for(let producto of productos){
      if(producto.id == req.params.id){
          res.json(producto)
          return 
      }
      // Not found
      res.status(404).send(`El Producto con id [
          ${req.params.id}] no existe`)
  }

});

// definir la primera ruta 
// formato de rutas express
app.get('/',(req,res)=>{
res.send('API DE VENDETUSCOROTOS.COM')
})
app.listen('3000',()=>{
console.log('escuchando en el puerto 3000')
});