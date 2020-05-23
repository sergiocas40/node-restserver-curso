/**
 * En este archivo crearemos el inicio de nuestro servicio
 */

// Requerimos el archivo config/config.js
require('./config/config');

// Requerimos el paquete Express para crear el servidor
const express = require('express');
// Requerimos el paquete Mongoose
const mongoose = require('mongoose');

const app = express();

// Requerimos paquete y hacemos la configuracion para decodificar los parametros en una peticion POST
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Requerimos el archivo routes/index.js para incluir las rutas de login y usuario
app.use(require('./routes/index'));

// Conexion a la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {

    // { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },

    if (err) throw err;

    console.log('Base de datos ONLINE');

});

// Definicion del puerto
app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});