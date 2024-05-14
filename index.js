const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const fs = require('node:fs/promises');

app.listen(3000, () =>
{
    console.log("App escuchando a puerto 3000");
})

//configurar motor de vistas
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs.engine());

//Importacion Bootstrap
app.use("/bootstrap", express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use("/popper", express.static(__dirname+'/node_modules/@popperjs/core/dist/umd'));

//Carpeta Assets
app.use("/assets", express.static(__dirname+"/assets"));

app.get("/", (req, res) =>
{
    res.render("home");
})

app.get("/agregar", (req, res) =>
{
    res.render("agregar");
})

app.get("/agregarDeporte", (req, res) =>
{
    const { nombre, precio } = req.query;

    if(nombre && precio)
    {
        const ventas = {
            nombre : nombre,
            precio : precio
        }
    
        fs.readFile("./ventas/deportes.json", "utf8")
        .then(data =>
        {
            let jsonDeportes = JSON.parse(data);
            jsonDeportes.deportes.push(ventas);

            fs.writeFile("./ventas/deportes.json", JSON.stringify(jsonDeportes))
            .then(() =>
            {
                res.render("alertSuccess",
                {
                    icono : "fa-circle-check",
                    titulo : "Nuevo Deporte",
                    mensaje : "Deporte Ingresado correctamente."
                    
                })
            })
        })
    }
    else
    {
        res.render("alertDanger",
        {
            icono : "fa-circle-xmark",
            titulo : "Atención.",
            mensaje : "Faltan datos, llene los campos requeridos.",
            ruta : "agregar"
        })
    }
})

app.get("/ver", (req, res) =>
{
    fs.readFile("./ventas/deportes.json", "utf8")
    .then(data =>
    {
        let jsonDeportes= JSON.parse(data);
        let ventas = jsonDeportes.deportes;
        
        res.render("ver", 
        {
            ventas : ventas
        });

    })
})

app.get("/editar", (req, res) =>
{
    const { txtnombre, txtprecio, nombreActual, precioActual } = req.query;

    if(txtnombre && txtprecio && nombreActual && precioActual)
    {
        
        fs.readFile("./ventas/deportes.json", "utf8")
        .then(data => 
        {
            let jsonDeportes = JSON.parse(data);
           
            for(let i = 0; i < jsonDeportes.deportes.length; i++) 
            {
                if(txtnombre != nombreActual)
                {
                    if(jsonDeportes.deportes[i].nombre == nombreActual)
                    {
                        jsonDeportes.deportes[i].nombre = txtnombre;
                    }
                }

                if(txtprecio != precioActual)
                {
                    if(jsonDeportes.deportes[i].precio == precioActual)
                    {
                        jsonDeportes.deportes[i].precio = txtprecio;
                    }
                }
            }
            
            fs.writeFile("./ventas/deportes.json", JSON.stringify(jsonDeportes))
            .then(() =>
            {
               res.render("alertSuccess",
                {
                    icono : "fa-circle-check",
                    titulo : "Actualizar Deporte",
                    mensaje : "Deporte actualizado correctamente."
                })
            })
        })
        
    } 
    else
    {
        res.render("alertDanger",
        {
            icono : "fa-circle-xmark",
            titulo : "Atención.",
            mensaje : "Faltan datos, llene los campos requeridos.",
            ruta : "ver"
        })
    }   
})

app.get("/eliminar/:dato", (req, res) =>
{
    let dato = req.params.dato;

    if(dato)
    {
        fs.readFile("./ventas/deportes.json", "utf8")
        .then(data => 
        {
            let jsonDeportes = JSON.parse(data);

            for(let i = 0; i < jsonDeportes.deportes.length; i++) 
            {
                if(jsonDeportes.deportes[i].nombre == dato) 
                {
                    jsonDeportes.deportes.splice(i, 1);
                    break;
                }
                else
                {
                    res.render("alertDanger",
                    {
                        icono : "fa-circle-xmark",
                        titulo : "Atención.",
                        mensaje : "Dato no existe.",
                        ruta : "ver"
                    })
                }
            }

            fs.writeFile("./ventas/deportes.json", JSON.stringify(jsonDeportes))
            .then(() =>
            {
                res.render("alertDanger",
                {
                    icono : "fa-solid fa-ban",
                    titulo : "Eliminar.",
                    mensaje : "Deporte eliminado correctamente.",
                    ruta : "ver"
                })
            })
        })
    }
    else
    {
        res.render("alertDanger",
        {
            icono : "fa-circle-xmark",
            titulo : "Atención.",
            mensaje : "Faltan datos, llene los campos requeridos.",
            ruta : "ver"
        })
    }
})

app.get("*", (req, res) => {
    res.send("<center><h1>Esta página no existe... </h1></center>");
});