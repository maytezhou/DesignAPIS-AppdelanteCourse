const Joi = require('joi');
//const Joi = require('@hapi/joi');
const log = require('./../../../utils/logger');

const blueprintUsuario = Joi.object().keys({
    username:Joi.string().alphanum().min(3).max(30).required(),
    password:Joi.string().min(6).max(200).required(),// falta mas seguridad pero lo dejaremos asi por mientras como prueba
    email:Joi.string().email().required()
})

// exportar el middleware que se encarga de la validacion
module.exports =  (req, res, next ) => {
const resultado = Joi.validate (req.body, blueprintUsuario, {abortEarly: false, convert: false })
if(resultado.error === null){
    next()
}else{ 
    log.info("Usuario fallo la validación", resultado.error.details)
    // bad request 
    res.status(400).send("Información del usuario no cumple los requisitos. El nombre del usuario debe ser alfanumérico y tener entre 3 y 30 caracteres. La contraseña debe tener entre 6 y 200 caracteres. Asegurate de que el email sea válido")
}
}