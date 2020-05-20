const Joi = require('joi');
//const Joi = require('@hapi/joi');
const log = require('./../../../utils/logger');

const blueprintUsuario = Joi.object().keys({
    username:Joi.string().alphanum().min(3).max(30).required(),
    password:Joi.string().min(6).max(200).required(),// falta mas seguridad pero lo dejaremos asi por mientras como prueba
    email:Joi.string().email().required()
})

// exportar el middleware que se encarga de la validacion
let validarUusario =  (req, res, next ) => {
const resultado = Joi.validate (req.body, blueprintUsuario, {abortEarly: false, convert: false })
if(resultado.error === null){
    next()
}else{ 
    //log.info("Usuario fallo la validación", resultado.error.details)
    log.info("Usuario fallo la validación", resultado.error.details.map((error)=> error.message))
    // bad request 
    res.status(400).send("Información del usuario no cumple los requisitos. El nombre del usuario debe ser alfanumérico y tener entre 3 y 30 caracteres. La contraseña debe tener entre 6 y 200 caracteres. Asegurate de que el email sea válido")
}
}
const bluePrintPedidoDeLogin = Joi.object().keys({
    username:Joi.string().required(),
    password:Joi.string().required()
})
 

let validarPedidoDeLogin = (req,res,next)=>{
    const resultado = Joi.validate(req.body, bluePrintPedidoDeLogin , {abortEarly: false, convert: false })
if( resultado.error === null ){ // el pedido fue validado exitosamente 
 next ()
}else {
    res.status(400).send('Login falló. Debes especificar el usarname y contraseña del usuario. Ambos deben ser strings')
}
}
module.exports = {
    validarPedidoDeLogin,
    validarUusario
}