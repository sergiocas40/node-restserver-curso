// Configuracion del puerto
process.env.PORT = process.env.PORT || 3000;
//////////////////////////////

/// ENTORNO - validar si esta en produccion o en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/////////////////////////////



// Guardar el secret y la fecha de caducidad del token que se envia al usuario
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//////////////////////////////



// Determinar si estamos en produccion o en local para asignar si la aplicacion 
// se conectara a la BD de la nube o local.
// Dependiendo del valor de process.env.NODE_ENV determinamos la URL para la coenxion a la BD
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    // MONGO_URI: es la variable de entorno de heroku para ocultar la URL en Git
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
//////////////////////////////