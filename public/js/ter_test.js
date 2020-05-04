let p = window.location.href.split('/')
last =  p.pop()

let carte;
if(last=='terrain1'){
    carte = new Carte(map_1)
    carte.render()
    terrain()


    for(let i=0; i<70;i+=10){
        tree(i,0,10)
    }

    forest(new THREE.Vector3(-50,0,-50),10)

}else if(last == 'terrain2'){
    carte = new Carte(map_2)
    carte.render()
    terrain()

    for(let i=0; i<70;i+=10){
        tree(i,0,10)
    }

    for(let i=0; i<4;i++){
        for(let j=0;j<2;j++)
        tree(70+10*j+(5*Math.random()),0,-20-10*i+(5*Math.random()))
    }

    bush(70,0,10)
    bush(80,0,10)
    bush(75,0,15)
    forest(new THREE.Vector3(-40,0,-140),30)

}else if(last == 'terrain3'){
    carte = new Carte(map_3)
    carte.render()
    terrain()

    forest(new THREE.Vector3(-130,0,50),50)
    forest(new THREE.Vector3(-130-70,0,50+70),20)

}
else if(last == 'terrain4'){
    carte = new Carte(map_4)
    carte.render()

    terrain(new THREE.Box3(new THREE.Vector3(-100,-20,10), new THREE.Vector3(70,40,80)))

    forest(new THREE.Vector3(45,0,45),20)
    forest(new THREE.Vector3(70,0,-70),10)

    forest(new THREE.Vector3(-75,0,25),15)

}else if(last == 'terrain5'){
    carte = new Carte(map_5)
    carte.render()
    terrain(new THREE.Box3(new THREE.Vector3(-120,-20,0), new THREE.Vector3(10,40,80)))

    forest(new THREE.Vector3(10,0,285),30)
    forest(new THREE.Vector3(30,0,40),20)
    forest(new THREE.Vector3(-130,0,40),20)

}