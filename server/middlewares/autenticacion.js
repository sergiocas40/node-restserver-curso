// Require para verificar el token recibido con la funcion verify
const jwt = require('jsonwebtoken');

// -----------------------------------------//
// Funcion para recibir y verificarel token //
// -----------------------------------------//
let verificaToken = (req, res, next) => {

    // Recibimos el token que viene en el header de la peticion.
    let token = req.get('token');

    // Verificar token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        // parametros: token            = es el token recibido
        //             process.env.SEED = el secreto
        //             (err, decoded)   = funcion de Callback regresa un error o el token decodificado

        // Error
        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })

        }

        // No error: damos acceso y tenemos acceso a la informacion del token
        req.usuario = decoded.usuario;

        // Continua programa
        next();

    });

};

// -----------------------------------------//
//           Verifica Admin Role 
// -----------------------------------------//
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    // req.usuario se definio en verificaToken

    // Verificamos que sea ADMIN_ROLE
    if (usuario.role == 'ADMIN_ROL') {

        next(); // Se sigue ejecutando el servicio de routes/usuario        

    } else {

        // Madamos error si no es ADMIN_ROL y no se ejecita el servicio
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}