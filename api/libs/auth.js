const _ = require('underscore')
const bcrypt = require('bcrypt-nodejs')
const passportJWT = require('passport-jwt')

const log = require('./../../utils/logger')
const config = require('../../config')
const usuarioController = require('../recursos/usuarios/usuarios.controller')


// Token debe ser especificado mediante el header Authorization. Ejemplo:
//Authorization : bearer xxxx.yyyy.zzzz

let jwtOptions = {
    secretOrKey: config.jwt.secreto,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    usuarioController.obtenerUsuario({
            id: jwtPayload.id
        })
        .then(usuario => {
            if (!usuario) {
                log.info(`JWT token no es válido. Usuario con id  ${jwtPayload.id} no  existe`)
                next(null, false) // null significa que no hubo ningun error y false significa que fallo la validación del token 
                return
            }
            log.info(`Usuario ${usuario.username} suministró un token válido. Auntenticación completada`)
            next(null, { // el objeto que queremos agregar al request  con la propiedad user// request.user
                username: usuario.username,
                id: usuario.id
            })
        })
        .catch((err) => {
            log.error(`Error ocurrió al  tratar de validar un token`, err)
            next(err) // o tambien puedes colocar next(err,false)
        })
})