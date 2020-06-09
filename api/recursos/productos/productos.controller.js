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

 function reemplazarProducto (id,producto,username){
    return Producto.findOneAndUpdate({ _id:id},{ ...producto, dueño:username},{new:true}) // la opción new es para que la llamada regrese el nuevo documento modificado
 }
 module.exports={
     crearProducto,
     obtenerProductos,
     obtenerProducto,
     borrarProducto,
     reemplazarProducto
 }