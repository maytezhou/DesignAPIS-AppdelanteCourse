const _ = require('underscore')
const bcrypt = require('bcrypt-nodejs')
const passportJWT = require('passport-jwt')

const log = require('./../../utils/logger')
const usuarios = require('./../../database').usuarios
const config = require('../../config')


// Token debe ser especificado mediante el header Authorization. Ejemplo:
//Authorization : bearer xxxx.yyyy.zzzz

let jwtOptions={
    secretOrKey : config.jwt.secreto,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    let index = _.findIndex(usuarios, usuario => usuario.id === jwtPayload.id)
    
    if (index === -1) {
        log.info(`JWT token no es válido. Usuario con id  ${jwtPayload.id} no  existe`)
        next(null, false)
        
    }else{
        log.info(`Usuario ${usuarios[index].username} suministró un token válido. Auntenticación completada`)
 next(null,{ username:usuarios[index].username, id:usuarios[index].id })
    }
})

