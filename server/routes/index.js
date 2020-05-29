// express / para configurar las rutas
const express = require('express');
// Instanciamos express
const app = express();

// Agregamos las rutas a los archivos
app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));

module.exports = app;