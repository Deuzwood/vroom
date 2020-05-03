let p = window.location.href.split('/')
last =  p.pop()

let carte;
if(last=='map1'){
    carte = new Carte(map_1)
}
else if(last == 'map2'){
    carte = new Carte(map_2)
}
else if(last == 'map3'){
    carte = new Carte(map_3)
}
else if(last == 'map4'){
    carte = new Carte(map_4)
}
else if(last == 'map5'){
    carte = new Carte(map_5)
}
carte.render();