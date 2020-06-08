const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required: [true, 'Producto debe tener un título']
    },
    precio:{
        type:Number,
        min:0,
        required:[true, 'Producto debe tener un precio']
    },
    moneda:{
        type:String,
        maxlength:3,
        minlength:3,
        required:[true,'Produto debe tener una moneda']
    },
    dueño:{
        type:String,
        required:[true,'Producto debe estar asociado a un usuario']
    }
})

module.exports = mongoose.model('producto',productoSchema)