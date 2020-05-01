let p = window.location.href.split('/')
last =  p.pop()

let carte;
if(last=='terrain1'){
    let circuit = new Carte(map_1)
    circuit.render();
    terrain(new THREE.Vector3(0,0,0),new THREE.Vector3(100,0,100))


    for(let i=0; i<70;i+=10){
        tree(i,0,10)
    }

    forest(new THREE.Vector3(-50,0,-50),10)

}else if(last == 'terrain2'){
    let circuit = new Carte(map_2)
    circuit.render();
    terrain(new THREE.Vector3(0,0,0),new THREE.Vector3(100,0,100))

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
    let circuit = new Carte(map_3)
    circuit.render();
    terrain(new THREE.Vector3(0,0,0),new THREE.Vector3(100,0,100))

    forest(new THREE.Vector3(-130,0,50),50)
    forest(new THREE.Vector3(-130-70,0,50+70),20)

}
