let p = window.location.href.split('/')
last =  p.pop()

let carte;
if(last=='map1'){
    carte = new Carte(map_1)

}else if(last == 'map2'){
    carte = new Carte(map_2)

}else if(last == 'map3'){
    carte = new Carte(map_3)
}
carte.render();