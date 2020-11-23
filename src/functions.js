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

function euclideanDist(patrullas, servicio){
    for(var i = 0; i < patrullas.length; ++i){
        var patrulla = patrullas[i]
        patrulla.euclideanDist = Math.sqrt((patrulla.lat - servicio.lat)*(patrulla.lat - servicio.lat) + (patrulla.lng - servicio.lng)*(patrulla.lng - servicio.lng))
    }
}
export{sortJSON, euclideanDist};