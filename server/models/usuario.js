const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    // Valores permitidos
    values: ['ADMIN_ROLE', 'USER_ROL'],
    // Mensaje de error
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contrasenia es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROL',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

// Eliminamos del json que se imprime en la solicitud post el password
usuarioSchema.methods.toJSON = function() {

    // Guardamos lo que en ese momento se haya mandado
    let user = this;

    // Convertimos en un objeto la informacion
    let userObject = user.toObject();

    // Borramos el password
    delete userObject.password;

    return userObject;

}

// Definimos el mensaje que inyectara mongoose cuando se repita el email
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

// Exportamos el modelo asignadole un nombre
module.exports = mongoose.model('Usuario', usuarioSchema);