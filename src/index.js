
// const express = require('express')
import express from 'express'
const app = express()
import path from 'path'
const router = express.Router()
import fetch from 'node-fetch'
app.set('port', process.env.PORT || 3000)

import {decode} from './hereDecode.js'
import bodyParser from 'body-parser'

var __dirname = path.resolve(path.dirname(''));
router.get('/', function(req, res){
    // console.log(__dirname)
    res.sendFile(path.join(__dirname+'/src/index.html'));
})

// app.use(bodyParser.json())

function printRuta(data){
    // var lat = data.routes[0].sections[0].departure.place.location.lat
    // var lng = data.routes[0].sections[0].departure.place.location.lng
    // var lineString = data.routes[0].sections[0].polyline

    // // lineString.coordinates.forEach(coor =>{
    // //     lat += coor[1]
    // //     console.log(lat)
    // // } )
    
    // console.log(decode(lineString))
}
function getGeoJSON(flexiblePolyline){
    return decode(flexiblePolyline)
}

function sortJSON(data, key, orden) {
    return data.sort(function (a, b) {
        var x = a[key],
        y = b[key];

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}
// var oJSON = sortJSON(elJSON, 'num', 'asc');

function getTop(rutas, numSolicitadas){
    
}
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

function euclideanDist(patrullas, servicio){
    for(var i = 0; i < patrullas.length; ++i){
        var patrulla = patrullas[i]
        patrulla.euclideanDist = Math.sqrt((patrulla.lat - servicio.lat)*(patrulla.lat - servicio.lat) + (patrulla.lng - servicio.lng)*(patrulla.lng - servicio.lng))
    }
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

app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
router.post('/getOptima', async function(req, res){
    // createChart(JSON.parse(req.body).responses);
    // res.send(calculateRoute(req.query.patrulla, req.query.servicio))
    // console.log("no masss")
    var out = await resolveRutaOptima(req.body.patrullas, req.body.servicio, req.body.numero_patrullas_solicitadas)
    console.log(out)  
    res.send("yes")
    // var url = 'https://router.hereapi.com/v8/routes?';
    // url += 'apiKey='+'QZPcQ4vAyFdtMD9sibX5TY8VPUetjq0aU9EgM3MhjDg'
    // url += '&transportMode='+req.query.mode
    // url += '&origin='+req.query.latOrigin+","+req.query.lngOrigin
    // url += '&destination='+req.query.latDestination+','+req.query.lngDestination
    // url += '&return=summary,polyline'
    // // &transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary';


    // fetch(url, {
    //     method: 'GET',
    // }).then(response => (response.json()))
    // .then(data => {
    //     var polyline = getGeoJSON(data.routes[0].sections[0].polyline);
    //     console.log(polyline)
    //     res.send(data);
    // });
})

app.use(router)
app.listen(app.get('port'), () => {
    console.log("esta corriendo weeey")
})
