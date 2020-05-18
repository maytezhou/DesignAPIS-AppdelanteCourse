const Joi = require('joi');
//const Joi = require('@hapi/joi');
const log = require('./../../../utils/logger');
// validación de un producto

const blueprintProducto = Joi.object().keys({
    titulo: Joi.string().max(100).required(),
    precio: Joi.number().positive().precision(2).required(),
    moneda: Joi.string().length(3).uppercase()
})

module.exports = (req, res, next) => { //  next te permite decidir, quiero ir a la siguiente funcion o quiero frenar alli 
    let resultado = Joi.validate(req.body, blueprintProducto, {
        abortEarly: false,
        convert: false,
    })

    if (resultado.error === null) {
        next() // llamar a next no significa return   en vez de else puede colocar un return aqui 
    } else { // si hay errores
        let erroresDeValidacion = resultado.error.details.reduce((acumulador, error) => {
            return acumulador + `[${error.message}]`
        }, "")
       // console.log(erroresDeValidacion);
       log.warn('El siguiente producto no pasó la validación: ', req.body, erroresDeValidacion)
        res.status(400).send(`El producto en el body debe especificar titulo, precio y moneda. Errores en tu request: [${erroresDeValidacion}]`)
    }
}