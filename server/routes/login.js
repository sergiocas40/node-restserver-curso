// express / para configurar las rutas post, get, put y delete
const express = require('express');

// bcrypt / para descifrar contrasenias
const bcrypt = require('bcrypt');

// Requerimos jsonwebtoken para generar un token
const jwt = require('jsonwebtoken');

// Requerimos libreria de Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

        // Validamos si se encontro el usuario
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

// Funcion de google que veirfica el token
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Regresar un objeto con la informacion del usuario
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// Recibimos el Token que viene de index.html
app.post('/google', async(req, res) => {

    // Guardamos el token que viene en la solicitud
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // Validar que el correo no se repita
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        // Error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si existe el usuario
        if (usuarioDB) {
            // Validar si el usuario ya se autentico por el Login normal
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                // Si usuario entro con google renovamos el token
                let token = jwt.sign({
                    // Payload
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // Si usuario es nuevo lo creamos en la BD
            let usuario = new Usuario;

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {

                // Error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    // Payload
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            });

        }

    });

});

module.exports = app;