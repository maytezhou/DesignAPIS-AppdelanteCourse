const express = require('express');
const bodyParser= require('body-parser');

// id universal unico
//const uuidv4= require('uuid');
import { v4 as uuidv4 } from 'uuid';
const _=require('underscore');
const productos = require('./database').productos


const app = express();
// servidor escuche en el puerto 3000
//para que el request.body exista
app.use(bodyParser.json())


app.route('/productos') // ruta que nos permite acceder a la coleccion entera de los productos
.get((req,res)=>{// obtener recursos
    res.json(productos)
})
//ruta que nos permite agregar un producto
// local
.post((req,res)=>{ // crear nuevos recursos
let nuevoProducto =req.body
//input validation
if(!nuevoProducto.moneda || !nuevoProducto.precio || !nuevoProducto.titulo){
 //bad request tu request no es apropiado le falta algo - no cumple con los requisitos para ser un request válido
    res.status('400').send("Tu producto debe especificar un titulo, precio y moneda")
    return
}
nuevoProducto.id = uuidv4();
productos.push(nuevoProducto);
//res.json(nuevoProducto) // 200
//created
res.status(201).json(nuevoProducto)
})



// ruta que nos permite acceder a cada producto
// en la ruta se colocara el id del prodcuto como parametro
app.route('/productos/:id') // todos los requests que vayan a este url 

.get((req, res)=>{ // para  obtener un prodcutos del array de productos
  //  req.params.id
  for(let producto of productos){
      if(producto.id == req.params.id){
          res.json(producto)
          return 
      }    
  }
    // Not found
    res.status(404).send(`El Producto con id [
        ${req.params.id}] no existe`)

})


// Reemplaza completamente un recurso con un recurso nuevo
.put((req,res)=>{//  para  modificar un producto del array de productos
 let id= req.params.id // id que el usuario especifica
 let reemplazoParaProducto =req.body

 if(!reemplazoParaProducto.moneda || !reemplazoParaProducto.precio || !reemplazoParaProducto.titulo){
    //bad request tu request no es apropiado le falta algo - no cumple con los requisitos para ser un request válido
       res.status('400').send("El nuevo producto debe especificar un titulo, precio y moneda")
       return
   }




 let indice = _.findIndex(productos, producto => producto.id == id)
 if(indice !== -1){ // si el producto existe
    reemplazoParaProducto.id = id
 productos[indice] = reemplazoParaProducto
 res.status(200).json(reemplazoParaProducto)
 }else{
     res.status(404).send(`El Producto con id [
        ${id}] no existe`)


 }
})


.delete((req,res)=>{
let indiceABorrar=_.findIndex(productos, producto => producto.id == req.params.id)
if(indiceABorrar === -1 ){
res.status(404).send(`Producto con id [
    ${req.params.id}] no existe.Nada que borrar`)
    return 
}
let borrado = productos.splice(indiceABorrar, 1)
res.json(borrado)
})






// definir la primera ruta 
// formato de rutas express
app.get('/',(req,res)=>{
res.send('API DE VENDETUSCOROTOS.COM')
})
app.listen('3000',()=>{
console.log('escuchando en el puerto 3000')
});