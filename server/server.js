/**
 * En este archivo crearemos el inicio de nuestro servicio
 */

// Requerimos el archivo config.js
require('./config/config');

// Requerimos Express para crear el servidor
const express = require('express');
const app = express();

// Requerimos paquete y hacemos la configuracion para decodificar los parametros en una peticion POST
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Definimos las respuestas cuando se solicita la url localhost:3000/

// Peticion GET
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

// Peticion POST
app.post('/usuario', function(req, res) {

    // Recibimos un json con los parametros incluidos en la peticion
    let body = req.body;

    // Verificar si recibimos el nombre
    if (body.nombre === undefined) {

        // Si nombre es false mandamos error 400 junto con informacion en un json
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

        // si el nombre existe mandamos el json con toda la informacion
    } else {
        res.json({
            Persona: body
        })
    }

});

// Peticion PUT
app.put('/usuario/:id', function(req, res) {

    // Recibimos el id
    let id = req.params.id;

    // Mostramos ese id
    res.json({
        id
    });
});

// Peticion DELETE
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});