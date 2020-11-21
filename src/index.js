
// const express = require('express')
import express from 'express'
const app = express()
import path from 'path'
const router = express.Router()
import fetch from 'node-fetch'
app.set('port', process.env.PORT || 3000)

import {decode} from './hereDecode.js';


router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
})


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


function calculateRoute(patrulla, servicio){

    if(patrulla.tipo == "MOTO"){
        patrulla.tipo = 'ped'
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


    fetch(url, {
        method: 'GET',
    }).then(response => (response.json()))
    .then(data => {        
        var ruta = {
            patrulla: patrulla,
            tiempoEstimado: data.routes[0].sections[0].summary.duration,
            polyline: getGeoJSON(data.routes[0].sections[0].polyline)
        }
        return ruta
    });

}
// function(patrullas[], servicio, numSolicitadas){
//     elegibles[]
//     patrullas.sort(eculidean)
//     for(patrulla in Top_numSolicitadas * 2 _patrullas){
//         elegibles.add(patrulla)
//     }
    
//     routes[]

//     for(elegible in elegibles){ //HERE
//         routes.add(calculateRoute(elegible, servicio))
//     }
//     routes.sort(tiempo, asc)

//     return routes[:numSolicitadas]
// }
router.get('/getRoute', function(req, res){

    res.send(calculateRoute(req.query.patrulla, req.query.servicio))

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
