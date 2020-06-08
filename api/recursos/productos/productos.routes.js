const express = require('express');
const _ = require('underscore');
const {
    v4: uuidv4
} = require('uuid');
const passport = require('passport')

const validarProducto = require('./productos.validate')
const log = require('./../../../utils/logger');
const jwtAuthenticate = passport.authenticate('jwt', {
    session: false
})


const productos = require('./../../../database').productos;
// crear un router de express
var productosRouter = express.Router() // no es una applicación de express (app), es un mini objeto que vamos a integrar con nuestra aplicacion express



// productosRouter reemplaza a app
productosRouter.get('/', (req, res) => { // obtener recursos
    res.json(productos)
})
//ruta que nos permite agregar un producto
// local
productosRouter.post('/', [jwtAuthenticate, validarProducto], (req, res) => { // crear nuevos recursos
    let nuevoProducto = {
        ...req.body,
        id: uuidv4(),
        dueño: req.user.username
    }
    productos.push(nuevoProducto);
    log.info("Producto agregado a la colección de productos", nuevoProducto)
    res.status(201).json(nuevoProducto)
})



// ruta que nos permite acceder a cada producto
// en la ruta se colocara el id del prodcucto como parametro
// todos los requests que vayan a este url 

productosRouter.get('/:id', (req, res) => { // para  obtener un prodcuto del array de productos // puede ser una llamada Publica
    //  req.params.id
    for (let producto of productos) {
        if (producto.id == req.params.id) {
            res.json(producto)
            return
        }
    }
    // Not found
    res.status(404).send(`El Producto con id [
        ${req.params.id}] no existe`)

})


// Reemplaza completamente un recurso con un recurso nuevo
productosRouter.put('/:id', [jwtAuthenticate, validarProducto], (req, res) => { //  para  modificar un producto del array de productos
    let reemplazoParaProducto = {
        ...req.body,
        id: req.params.id,
        dueño: req.user.username
    }
    let indice = _.findIndex(productos, producto => producto.id == reemplazoParaProducto.id)
    if (indice !== -1) { // si el producto existe
        if (productos[indice].dueño !== reemplazoParaProducto.dueño) {
            log.info(`Usuario ${req.user.username}  no es dueño de producto con id ${reemplazoParaProducto.id}.
            Dueño real es ${productos[indice].dueño}.Request no será procesado`)
            res.status(401).send(`No eres dueño del producto con id  ${reemplazoParaProducto.id}. Solo puedes modificar productos creados por ti`)
            return
        }
        productos[indice] = reemplazoParaProducto
        log.info(`Producto con id [${reemplazoParaProducto.id}] reemplazado con nuevo producto`, reemplazoParaProducto);
        res.status(200).json(reemplazoParaProducto)
    } else {
        res.status(404).send(`El Producto con id [
        ${reemplazoParaProducto.id}] no existe`)


    }
})


productosRouter.delete('/:id', jwtAuthenticate,(req, res) => { // para eliminar un producto del array de productos // no tiene un body // solo es delete la ruta tal
    let indiceABorrar = _.findIndex(productos, producto => producto.id == req.params.id)
    if (indiceABorrar === -1) {// si no existe
        log.warn(`Producto con id [${req.params.id}] no existe. Nada que borrar`);
        res.status(404).send(`Producto con id [
    ${req.params.id}] no existe.Nada que borrar`)
        return
    } // en el caso que exista 

    if (productos[indiceABorrar].dueño !== req.user.username) {
        log.info(`Usuario ${req.user.username}  no es dueño de producto con id ${productos[indiceABorrar].id}.
        Dueño real es ${productos[indiceABorrar].dueño}.Request no será procesado`)
        res.status(401).send(`No eres dueño del producto con id  ${productos[indiceABorrar].id}. Solo puedes 
        borrar productos creados por ti`)
        return
    }
 log.info(`Producto con id  [${req.params.id}] fue borrado`)
    let borrado = productos.splice(indiceABorrar, 1)
    res.json(borrado)
})

module.exports = productosRouter