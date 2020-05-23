// express / para configurar las rutas post, get, put y delete
const express = require('express');

// bcrypt / para descifrar contrasenias
const bcrypt = require('bcrypt');

// Requerimos jsonwebtoken para generar un token
const jwt = require('jsonwebtoken');

// Scheme Usuario / para obtener informacion del usuario
const Usuario = require('../models/usuario');

// app / instanciamos express
const app = express();

app.post('/login', (req, res) => {

    // Obtenemos el email y pass que mandan en la peticion
    let body = req.body;

    // Verificar si el correo existe en la BD
    // usando la funcion findOne del Schema de la BD
    // Recibe el email del body y lo compara en la BD
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        // Funcion callback, recibimos usuarioDB -> registro encontrado en la base de datos

        // Error de la aplicacion
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Validamos si se encontro del usuario
        // si usuarioDB es null
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contrasenia incorrectos'
                }
            });
        }

        // Validar contrasenia usando la funcion compareSync de bcrypt
        // que encripta el pass recibido y lo compara con el de la BD
        // usando el objeto usuarioDB recibido en el callback
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contrasenia) incorrectos'
                }
            });
        }

        // Generamos el token
        let token = jwt.sign({
            // Payload
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        // Si todo ok
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;