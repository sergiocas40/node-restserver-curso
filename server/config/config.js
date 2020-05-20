/*
    Configuracion para deteminar si nuestra aplicacion esta corriendo
    en produccion o desarrollo, si es desarrollo asignamos el puerto 3000
    si esta en produccion dejaremos el puerto que el servidor asigno. 
*/

process.env.PORT = process.env.PORT || 3000;

// Entorno
// Determinar si estamos en produccion o en local
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Dependiendo del valor de process.env.NODE_ENV determinamos la URL para la coenxion a la BD

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://serch:R6Kp2mEtEilC2TwD@cluster0-v0gc6.mongodb.net/cafe';
}

process.env.URLDB = urlDB;