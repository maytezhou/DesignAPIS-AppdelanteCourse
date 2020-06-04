const _ = require('underscore')
const log = require('./../../utils/logger')
const usuarios = require('./../../database').usuarios
const bcrypt = require('bcrypt-nodejs');
const passportJWT = require('passport-jwt')

let jwtOptions={
    secretOrKey :'este es un secreto',
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

let jwtStrategy = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    let index = _.findIndex(usuarios, usuario => usuario.id === jwtPayload.id)
    if (index === -1) {
        log.info(`JWT token no es válido. Usuario con id  ${jwtPayload.id} no  existe`)
        next(null, false)
        
    }else{
        log.info(`Usuario ${usuarios[index].username} suministró un token válido. Auntenticación completada`)
 next(null,{ username:usuarios[index].username, id:usuarios[index].id })
    }
})

module.exports = (username, password, done) => {
    let index = _.findIndex(usuarios, usuario => usuario.username === username)
    if (index === -1) {
        log.info(`Usuario ${username} no existe. No pudo ser autentificado`)
        done(null, false)
        return
    }
    let hashedPassword = usuarios[index].password
    bcrypt.compare(password, hashedPassword, (err, iguales) => {
        if (iguales) {
            log.info(`Usuario ${username} completó autenticación`)
            done(null, true)
        } else {
            log.info(`Usuario ${username} no completó autenticación. Contraseña incorrecta`)
            done(null, false)
        }
    })



}