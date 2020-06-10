const express = require('express');
const _ = require('underscore');
const {
  v4: uuidv4
} = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken')

const log = require('./../../../utils/logger')
const validarUsuario = require('./usuarios.validate').validarUsuario
const validarPedidoDeLogin = require('./usuarios.validate').validarPedidoDeLogin
const usuarios = require('./../../../database').usuarios
const config = require('../../../config')
const usuarioController = require('./usuarios.controller')

const usuariosRouter = express.Router()

const salt = bcrypt.genSaltSync(10);


function transformarBodyALowerCase(req, res, next) {
  req.body.username && (req.body.username = req.body.username.toLowerCase())
  req.body.email && (req.body.email = req.body.email.toLowerCase())
  next()
}




// ruta solo para desarrollo          no  la tendremos en produccion 
// GET /usuarios/
// ruta basica
usuariosRouter.get('/', (req, res) => {
  usuarioController.obtenerUsuarios()
    .then((usuarios) => {
      res.json(usuarios)
    })
    .catch(err => {
      log.error('Error al obtener todos los usuarios', err)
      res.sendStatus(500)
    })
})


//ruta para crear usuarios
usuariosRouter.post('/', [validarUsuario, transformarBodyALowerCase], (req, res) => {
  let nuevoUsuario = req.body
  usuarioController.usuarioExiste(nuevoUsuario.username, nuevoUsuario.email)
    .then((usuarioExiste) => {
      if (usuarioExiste) { // si el usuario ya existe en la base de datos
        // conflict // ya existe una entidad o un resource con la informacion obtenida en el request 
        log.info('Email o username ya existen en la base de datos')
        res.status(409).send("El email o username ya estan asociados a una cuenta.")
        return
      }
      // si el usuario no existe en la base de datos 
      bcrypt.hash(nuevoUsuario.password, salt, null, (err, hashedPassword) => {
        if (err) {
          log.error('Error ocurrio al tratar de obtener el hash de una contraseña', err)
          res.status(500).send('Ocurrio un error procesando creación de usuario')
          return
        }

        usuarioController.crearUsuario(nuevoUsuario, hashedPassword)
          .then((nuevoUsuario) => {
            res.status(201).send('Usuario creado exitósamente')
          })
          .catch(err => {
            log.error('Error ocurrio al tratar de crear un nuevo usuario', err)
            res.status(500).send('Error ocurrió al tratar de crear un  nuevo usuario')
            return
          })
      })
    })
    .catch(err => {
      log.error(`Error ocurrió al tratar de  verificar si el usuario [${nuevoUsuario.username}] con email
  [${nuevoUsuario.email}]  ya existe`)
      res.status(500).send('Error ocurrió al tratar de crear un nuevo usuario')
      return
    })


})


// ruta para login 
usuariosRouter.post('/login', [validarUsuario, transformarBodyALowerCase], async (req, res) => {
  let usuarioNoAutenticado = req.body
  let usuarioRegistrado
  try {
    usuarioRegistrado = await usuarioController.obtenerUsuario({
      username:usuarioNoAutenticado.username
    })
  }
  catch(err){
    log.error(`Error ocurrio al tratar de determinar  si el usuario [${usuarioNoAutenticado.username}] ya existe`, err)
    res.status(500).send('Error ocurrió durante el proceso de login')
    return
  }




  let index = _.findIndex(usuarios, (usuario) => usuario.username === usuarioNoAutenticado.username)
  if (index === -1) {
    log.info(`Usuario ${usuarioNoAutenticado.username} no existe. No pudo ser auntenticado`)
    res.status(400).send('Credenciales incorrectas. El usuario no existe')
    return
  }

  let hashedPassword = usuarios[index].password
  bcrypt.compare(usuarioNoAutenticado.password, hashedPassword, (err, iguales) => {
    if (iguales) {
      // generar y enviar token
      let token = jwt.sign({
        id: usuarios[index].id
      }, config.jwt.secreto, {
        expiresIn: config.jwt.tiempoDeExpiración
      })
      log.info(`Usuario ${usuarioNoAutenticado.username} completó autenticación exitosamente`)
      res.status(200).json({
        token
      })

    } else {
      log.info(`Usuario ${usuarioNoAutenticado.username} no completó autenticación. Contraseña incorrecta`)
      res.status(400).send('Credenciales incorrectas. Asegúrate que el username y contraseña sean correctos')

    }
  })
})

module.exports = usuariosRouter