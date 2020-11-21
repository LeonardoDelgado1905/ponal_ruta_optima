const express = require('express')
const app = express()
const path = require('path')
const router = express.Router();
app.set('port', process.env.PORT || 3000)

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.use(router)
app.listen(app.get('port'), () => {
    console.log("esta corriendo weeey")
})
