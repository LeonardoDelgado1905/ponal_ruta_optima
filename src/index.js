
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
router.get('/getRoute', function(req, res){

    var url = 'https://router.hereapi.com/v8/routes?';
    url += 'apiKey='+'QZPcQ4vAyFdtMD9sibX5TY8VPUetjq0aU9EgM3MhjDg'
    url += '&transportMode='+req.query.mode
    url += '&origin='+req.query.latOrigin+","+req.query.lngOrigin
    url += '&destination='+req.query.latDestination+','+req.query.lngDestination
    url += '&return=polyline'
    // &transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary';


    fetch(url, {
        method: 'GET',
    }).then(response => (response.json()))
    .then(data => {
        var polyline = getGeoJSON(data.routes[0].sections[0].polyline);
        console.log(polyline)
        res.send(data);
    });
})

app.use(router)
app.listen(app.get('port'), () => {
    console.log("esta corriendo weeey")
})
