const express = require('express');
const _ = require('underscore');
const { v4: uuidv4 } = require('uuid');
const validarProducto = require('./productos.validate')
//const Joi = require('@hapi/joi');


const productos = require('./../../../database').productos;
// crear un router de express
var productosRouter = express.Router() // no es una applicación de express (app), es un mini objeto que vamos a integrar con nuestra aplicacion express



// productosRouter reemplaza a app
productosRouter.get('/', (req, res) => { // obtener recursos
    res.json(productos)
})
//ruta que nos permite agregar un producto
// local
productosRouter.post('/', validarProducto, (req, res) => { // crear nuevos recursos
    let nuevoProducto = req.body

    nuevoProducto.id = uuidv4();
    productos.push(nuevoProducto);
    //res.json(nuevoProducto) // 200
    //created
    res.status(201).json(nuevoProducto)
})



// ruta que nos permite acceder a cada producto
// en la ruta se colocara el id del prodcucto como parametro
// todos los requests que vayan a este url 

productosRouter.get('/:id', (req, res) => { // para  obtener un prodcuto del array de productos
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
productosRouter.put('/:id', validarProducto, (req, res) => { //  para  modificar un producto del array de productos
    let id = req.params.id // id que el usuario especifica
    let reemplazoParaProducto = req.body

    let indice = _.findIndex(productos, producto => producto.id == id)
    if (indice !== -1) { // si el producto existe
        reemplazoParaProducto.id = id
        productos[indice] = reemplazoParaProducto
        res.status(200).json(reemplazoParaProducto)
    } else {
        res.status(404).send(`El Producto con id [
        ${id}] no existe`)


    }
})


productosRouter.delete('/:id', (req, res) => { // para eliminar un producto del array de productos
    let indiceABorrar = _.findIndex(productos, producto => producto.id == req.params.id)
    if (indiceABorrar === -1) {
        res.status(404).send(`Producto con id [
    ${req.params.id}] no existe.Nada que borrar`)
        return
    }
    let borrado = productos.splice(indiceABorrar, 1)
    res.json(borrado)
})

module.exports = productosRouter