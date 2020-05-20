const express = require('express');
const _ = require('underscore');
const {
  v4: uuidv4
} = require('uuid');
const validarUsuario = require('./usuarios.validate').validarUusario
const validarPedidoDeLogin =require('./usuarios.validate').validarPedidoDeLogin
const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')

const log = require('./../../../utils/logger')


const usuarios = require('./../../../database').usuarios
const usuariosRouter = express.Router()
// ruta solo para desarrollo          no  la tendremos en produccion 
// GET /usuarios/
// ruta basica
usuariosRouter.get('/', (req, res) => {
  res.json(usuarios)
})


//ruta para crear usuarios
usuariosRouter.post('/', validarUsuario, (req, res) => {
  let nuevoUsuario = req.body
  let indice = _.findIndex(usuarios, usuario => { // retorna el indice del objeto usuario en caso el usuario y el email ingresado ya exista  en caso no exista retorna -1 
    return usuario.username === nuevoUsuario.username || usuario.email === nuevoUsuario.email
  })
  if (indice !== -1) {
    // conflict // ya existe una entidad o un resource con la informacion obtenida en el request 
    log.info('Email o username ya existen en la base de datos')
    res.status(409).send("El email o username ya estan asociados a una cuenta.")
    return
  }

  bcrypt.hash(nuevoUsuario.password, salt, null, (err, hashedPassword) => {
    if (err) {
      log.error('Error ocurrio al tratar de obtener el hash de una contraseña', err)
      res.status(500).send('Ocurrio un error procesando creación de usuario')
      return
    }
    usuarios.push({
      username: nuevoUsuario.username,
      email: nuevoUsuario.email,
      password: hashedPassword,
      id: uuidv4()
    })

    res.status(201).send('Usuario creado exitosamente')
  })
})


// ruta para login 
usuariosRouter.post('/login',validarPedidoDeLogin, (req, res) => {
  let usuarioNoAutenticado = req.body
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
      let token = jwt.sign({ id: usuarios[index].id }, 'este es un secreto', { expiresIn: 86400 })
    log.info(`Usuario ${usuarioNoAutenticado.username} completó autenticación exitosamente`)
      res.status(200).json({ token})

    } else {
      log.info(`Usuario ${usuarioNoAutenticado.username} no completó autenticación. Contraseña incorrecta`)
      res.status(400).send('Credenciales incorrectas. Asegúrate que el username y contraseña sean correctos')

    }
  })
})

module.exports = usuariosRouter