/*
    Configuracion para deteminar si nuestra aplicacion esta corriendo
    en produccion o desarrollo, si es desarrollo asignamos el puerto 3000
    si esta en produccion dejaremos el puerto que el servidor asigno. 
*/

process.env.PORT = process.env.PORT || 3000;