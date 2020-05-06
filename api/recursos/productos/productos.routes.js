const express = require('express');
const _ = require('underscore');
import {
    v4 as uuidv4
} from 'uuid';
const Joi = require('@hapi/joi');



const productos = require('./../../../database').productos;
// crear un router de express
const productosRouter = express.Router() // no es una applicación de express (app), es un mini objeto que vamos a integrar con nuestra aplicacion express



const blueprintProducto = Joi.object().keys({
    titulo:Joi.string().max(100).required(),
    precio:Joi.number().positive().precision(2).required(),
    moneda: Joi.string().length(3).uppercase()
})

const validarProducto = (req, res, next)=>{//  next te permite decidir, quiero ir a la siguiente funcion o quiero frenar alli 
    let resultado = Joi.validate(req.body, blueprintProducto)
    console.log(resultado);
   if(resultado.error === null){
       next()     // llamar a next no significa return   en vez de else puede colocar un return aqui 
   }else{// si hay errores
   
 res.status(400).send("... error en validar producto...")
   }

}





// productosRouter reemplaza a app
productosRouter.get('/', (req, res) => { // obtener recursos
    res.json(productos)
})
//ruta que nos permite agregar un producto
// local
productosRouter.post('/',validarProducto, (req, res) => { // crear nuevos recursos
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

    productosRouter.get('/:id',(req, res) => { // para  obtener un prodcuto del array de productos
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
    productosRouter.put('/:id',(req, res) => { //  para  modificar un producto del array de productos
        let id = req.params.id // id que el usuario especifica
        let reemplazoParaProducto = req.body

        if (!reemplazoParaProducto.moneda || !reemplazoParaProducto.precio || !reemplazoParaProducto.titulo) {
            //bad request tu request no es apropiado le falta algo - no cumple con los requisitos para ser un request válido
            res.status('400').send("El nuevo producto debe especificar un titulo, precio y moneda")
            return
        }




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


    productosRouter.delete('/:id',(req, res) => { // para eliminar un producto del array de productos
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
     
