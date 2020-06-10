const Usuario = require('./usuarios.model')

function obtenerUsuarios (){
    return Usuario.find({})
}
function crearUsuario (usuario,hashedPassword){ // usuario es un objeto que tiene el email y el username
 return new Usuario ({ // grabar nuestro nuevo usuario en la base de datos Mongo db 
     ...usuario ,
     password: hashedPassword
 }).save()
} 

function usuarioExiste (username, email){
return new Promise((resolve,reject)=>{
    Usuario.find().or([{'username': username},{ 'email':email}])
    .then(usuarios=>{
        resolve(usuarios.length > 0)
    })
    .catch(err=>{
        reject(err)
    })
})



}
module.exports ={
    obtenerUsuarios,
    crearUsuario,
    usuarioExiste
}