const express = require("express");

// funcion para verificar un token, y devolver informacion del Payload
const {verificaToken} = require("../middlewares/autenticacion");

let app = express();

// Esquema de la tabla producto
let Producto = require("../models/producto");

// =>

// Obtener todos los productos
app.get("/productos", verificaToken, (req, res) => {

    // Establecemos desde que pagina se desea ver
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Buscamos los productos
    Producto.find({disponible: true})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {

        // Error de servidor
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // mostramos productos
        res.json({
            ok: true,
            productos
        });

    });

});

// Obtener producto por ID
app.get("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
            .populate("usuario", "nombre email")
            .populate("categoria", "nombre")
            .exec((err, productoDB) => {

                // Error de servidor
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                // Error de servidor
                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "ID no existe"
                        }
                    });
                }

                // Mostramos el producto
                res.json({
                    ok: true,
                    producto: productoDB
                });

            });

});

// Buscar productos
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {

    let termino = req.params.termino;

    // Expresion regular de busqueda
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate("categoria", "nombre")
            .exec((err, productos) => {

                // Error de servidor
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            });
});

// Crear un producto
app.post("/productos", verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    // Grabamos en BD
    producto.save((err, productoDB) => {

        // Error de servidor
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Mostramos el registro creado
        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

// Actualizar un producto
app.put("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    // Buscar el ID en la base de datos
    Producto.findById(id, (err, productoDB) => {

        // Error de servidor
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si el id no existe
        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: "El ID no existe"
                }
            });
            
        }

        // Creamos los cambios
        productoBD.nombre = body. nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        // Guardamos en la BD
        productoBD.save((err, productoGuardado) => {
            
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });                
            }

            // Mostrar el producto actualizado
            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });

});

// Desactivar un producto
app.delete("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        // Error de servidor
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si el producto no existe
        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "ID no existe"
                }
            });
        }

        // Cambiamos el campo disponible de la BD
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            // Error de servidor
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: "Producto borrado"
            });

        });

    });

});

module.exports = app;