
// const express = require('express')

import express from 'express'
import path from 'path'
import {decode} from './hereDecode.js'
import {sortJSON, euclideanDist} from './functions.js'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
const router = express.Router()
const app = express()

var __dirname = path.resolve(path.dirname(''));
router.get('/RutaOptima', function(req, res){
    // console.log(__dirname)
    res.sendFile(path.join(__dirname+'/src/index.html'));
})

// app.use(bodyParser.json())

function getGeoJSON(flexiblePolyline){
    return decode(flexiblePolyline)
}

// var oJSON = sortJSON(elJSON, 'num', 'asc');

async function calculateRoute(patrulla, servicio, rutas, tope){

    if(patrulla.tipo === "moto"){
        patrulla.tipo = 'pedestrian'
    }else{
        patrulla.tipo = 'car'
    }

    var url = 'https://router.hereapi.com/v8/routes?';
    url += 'apiKey='+'QZPcQ4vAyFdtMD9sibX5TY8VPUetjq0aU9EgM3MhjDg'
    url += '&transportMode='+patrulla.tipo
    url += '&origin='+patrulla.lat+","+patrulla.lng
    url += '&destination='+servicio.lat+','+servicio.lng
    url += '&return=summary,polyline'
    // &transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary';

    var ruta = {}
    await fetch(url, {
        method: 'GET',
    }).then(response => (response.json()))
    .then(data => {        
        ruta = {
            "patrulla": patrulla,
            "tiempoEstimado": data.routes[0].sections[0].summary.duration,
            "polyline": getGeoJSON(data.routes[0].sections[0].polyline)
        }
        // console.log(ruta)
        
    });
    // console.log(ruta.tiempoEstimado)
    return ruta;
}

/////logica
async function resolveRutaOptima(patrullas, servicio, numSolicitadas){
    var elegibles = []
    euclideanDist(patrullas, servicio)
    sortJSON(patrullas, 'euclideanDist', 'asc')
    // for(var i = 0; i < patrullas.length && i < 2*numSolicitadas; ++i){
    //     patrulla = patrullas[i]
    //     elegibles.push(patrulla)
    // }
    var tope = Math.min(2*numSolicitadas, patrullas.length)
    var elegibles = patrullas.slice(0, tope)
    var rutas = []
    
    for(var i = 0; i < elegibles.length; ++i){ //HERE
        var elegible = elegibles[i]
        var ruta = await calculateRoute(elegible, servicio, rutas, tope)
        rutas.push(ruta)
    }
    // console.log(rutas)
    sortJSON(rutas, 'tiempoEstimado', 'asc')
    return rutas.slice(0, numSolicitadas)
    
}

app.set('port', process.env.PORT || 3000)
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
router.post('/RutaOptima/getOptima', async function(req, res){
    var out = await resolveRutaOptima(req.body.patrullas, req.body.servicio, req.body.numero_patrullas_solicitadas)
    console.log(out)  
    res.send(out)
})

app.use(router)
app.listen(app.get('port'), () => {
    console.log("it's running on port " + app.get('port'))
})
