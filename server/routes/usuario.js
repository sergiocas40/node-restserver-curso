const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// Definimos las respuestas cuando se solicita la url localhost:3000/

// Peticion GET
app.get('/usuario', verificaToken, function(req, res) {

    // Recibimos el parametro desde
    // El cual nos indica desde que pagina el usuario quiere que se muestren los registros
    // Si no indica algo, se mostraran los primeros cinco
    let desde = req.query.desde || 0;

    // Convertimos a numero
    desde = Number(desde);

    // De la misma forma controamos el limite de registros a mostrar
    let limite = req.query.limite || 0;
    limite = Number(limite)


    // Mostrar todos los usuarios usando la funcion find de mongoose
    // Filtrando cuales son los campos que deseamos que aparescan
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde) // Salta cinco posiciones
        .limit(limite) // Muestro cinco registros
        .exec((err, usuarios) => {
            // Si hay un error
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Con la funcion count devolvemos cuantos registros hay en la BD
            Usuario.count({ estado: true }, (err, conteo) => {

                // Si no hay error devolvemos todos los usuarios
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });

        });

});

// Peticion POST  
app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    // Recibimos un json con los parametros incluidos en la peticion
    let body = req.body;

    // Usamos el body para obtener la informacion del usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Guardamos en la base de datos
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // No mostrar el password
        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

// Peticion PUT
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    // Recibimos el id de la URL
    let id = req.params.id;

    // Recibimos el objeto que contiene la actualizacion similar al post
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Llamamos al Schema de la base datos para buscar y actualizar mediante el id
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        // Si ocurre un error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // Si no hay error
        // Mostramos el objeto con los datos actualizados
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })


});

// Peticion DELETE
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    // Recibimos el id a eliminar/modificar que envian en la URL
    let id = req.params.id;

    // Creamos un objeto que contiene el campo a modificar
    let cambiaEstado = {
        estado: false
    }

    // Usamos la funcion findByIdAndRemove del esquema (Usuario) para borralo de la BD
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    // Usamos la funcion findByIdAndUpdate del esquema (Usuario) para actualizar de la BD
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        // Si hay un error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        // Validar si se encontro el usuario a eliminar
        if (!usuarioBorrado) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });

        }

        // Si no hay error mostramos el usuario eliminado que es igual al usuarioBorrado que
        // devuelve la funcion de callback
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;