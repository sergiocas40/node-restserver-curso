const express = require("express");

let {verificaToken, verificaAdmin_Role} = require("../middlewares/autenticacion");

let app = express();

// Importamos el modelo de BD Categoria
let Categoria = require("../models/categoria");

// Mostrar todas las categorias
app.get("/categoria", verificaToken, (req, res) => {

    Categoria.find({})
             .sort("descripcion")
             .populate("usuario", "nombre email")
             .exec((err, categorias) => {

                // Error de servidor
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });            
                }

                // Modtramos todas las categorias
                res.json({
                    ok: true,
                    categorias
                });

    });

});

// Mostrar categoria por id
app.get("/categoria/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        // Error de servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });            
        }

        // Si el id no existe        
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El ID no existe"
                }
            });            
        }

        // Todo ok, mostramos la categoria solicitada
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });    

});

// Crear una categoria
app.post("/categoria", verificaToken, (req, res) => {

    // Recibmos la nueva categoria
    let body = req.body;

    // Creamos objeto categoria
    let categoria = new Categoria({
        descripcion: body.descripcion,
        // El usuario id viene en el token, el cual obtiene de la funcion verificaToken
        usuario: req.usuario._id
    });

    // Guardamos categoria en BD
    categoria.save( (err, categoriaDB) => {

        // Error de servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });            
        }

        // Si no se crea la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        // Si se creo la categoria
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Actualizar una categoria
app.put("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    // Actualizamos categoria
    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {

        // Error de servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });            
        }

        // Si no existe la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        // Si se modifico la categoria
        res.json({
            ok: true,
            categoria: categoriaDB
        });        

    });

});

// Eliminar una categoria
app.delete("/categoria/:id", (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        // Error de servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });            
        }

        // Si no existe la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: "El id no existe"
                }
            });            
        }

        // Si se elimino la categoria
        res.json({
            ok: true,
            message: "Categoria borrada"
        });

    });

});

module.exports = app;
