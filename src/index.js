
const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const fetch = require('node-fetch');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.set('port', process.env.PORT || 3000)

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
})

router.get('/getRoute', function(req, res){
    


    var url = 'https://router.hereapi.com/v8/routes?apiKey=bi9WgKRmGyHx9-CGLiQRAo1bc6UXdklzYn0BWUgUpF8';
    url += '&transportMode='+req.query.mode
    url += '&origin='+req.query.latOrigin+","+req.query.lngOrigin
    url += '&destination='+req.query.latDestination+","+req.query.lngDestination
    url += '&return=summary'
    console.log(url)
    // &transportMode=car&origin=52.5308,13.3847&destination=52.5323,13.3789&return=summary';


    fetch(url, {
        method: 'GET',
    }).then(response => (response.json()))
    .then(data => res.send(data));
//     fetch(url)
//   .then(response => (response.json()))
//   .then(data => res.send(data));
})

app.use(router)
app.listen(app.get('port'), () => {
    console.log("esta corriendo weeey")
})
