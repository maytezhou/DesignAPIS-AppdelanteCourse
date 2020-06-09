const Producto = require('./producto.model')

 function crearProducto (producto,dueño){// req.body
     return new Producto({
         ...producto,
         dueño
     }).save()
 }


 function obtenerProductos (){
     return Producto.find({})// retorna un promesa// retorna toda la colección de productos
 }

 function obtenerProducto (id){
 return Producto.findById(id)
 }
 function borrarProducto (id){
return Producto.findByIdAndRemove(id)
 }
 module.exports={
     crearProducto,
     obtenerProductos,
     obtenerProducto,
     borrarProducto
 }