
function lampadaire(x,y,rot=1){
    let group = new THREE.Object3D();

    let material = new THREE.MeshPhongMaterial({color:0x222222});

    let pylone = new THREE.Mesh( new THREE.BoxGeometry(1,20,1) ,material);
    let up = new THREE.Mesh( new THREE.BoxGeometry(3,1,1) ,material);

    pylone.position.y=10
    up.position.y=20;
    up.position.x=1

    let led = new THREE.SpotLight( { intensity:0.2,distance:30,angle:0.6,penumbra:0.1,decay:1.6}) 

    /* DOC THREE JS*/
    led.castShadow = true;

    /*led.shadow.mapSize.width = 1024;
    led.shadow.mapSize.height = 1024;

    led.shadow.camera.near = 500;
    led.shadow.camera.far = 4000;
    led.shadow.camera.fov = 30;*/

    led.target.position.set( 5, 1, 0 );
    group.add( led.target);
    led.position.set(2,20,0)
    group.add(pylone);
    group.add(up);
    group.add(led);
    
    group.position.set(x,0,y)
    group.rotation.y+= THREE.Math.degToRad(90*rot)
    return group
}

//export {lampadaire}

/**
 * Genere un arbe à la position x,y,z
 * Variantes : 
 *      -Cime d'arbes
 *      -Feuilles foncés , ou plus claires
 *      -Cerisier ( fleuilles roses )
 */
function tree(x,y,z,r=false){
    let tree = new THREE.Object3D();

    if(Math.random()>0.05){
        /* Tronc */
        geometry = new THREE.CylinderGeometry( 0.5, 1, 5, 5 );
        material = new THREE.MeshPhongMaterial( {color: CLR_WOOD , flatShading:true} );
        cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y+=2.5
        tree.add( cylinder );

        /* Feuille */
        geometry = new THREE.DodecahedronGeometry( 2.5 );
        let clr = Math.random() > 0.4 ? CLR_LEAVES : (Math.random()>0.4 ? CLR_LEAVES_VAR1 : CLR_LEAVES_VAR2)
        material = new THREE.MeshPhongMaterial( {color: clr , flatShading:false} );
       
        if(Math.random()>0.5){
            geometry.vertices.forEach( el => {
                el.x+=Math.random()-Math.random()
            })
        }

        dodecahedre = new THREE.Mesh( geometry, material );
        dodecahedre.position.y+=6
        dodecahedre.rotation.y=Math.random();
        tree.add( dodecahedre );

    }else{
        /* Tronc Base */
        geometry = new THREE.CylinderGeometry( 1, 1.5, 1, 5 );
        material = new THREE.MeshPhongMaterial( {color: CLR_WOOD , flatShading:true} );
        cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y+=0.5
        tree.add( cylinder );
    
        /* Tronc Up */
        geometry = new THREE.CylinderGeometry( 0.8, 1, 0.5, 5 );
        material = new THREE.MeshPhongMaterial( {color: CLR_WOOD , flatShading:true} );
        cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y+=1.25
        tree.add( cylinder );
    
    
        tree.position.set(x,y,z);
        scene.add(tree);
    }

    tree.position.set(x,y,z);
    tree.castShadow = true;
    if(r)
        return tree
    else
        scene.add(tree);
}

/**
 * Genere un buisson à la position x,y,z
 * 
 * Variantes : 
 *      -Double buisson
 *      -Triple buisson
 *      -Couleur LEAVE - VAR 1
 */
function bush(x,y,z,r=false){
    let bush = new THREE.Object3D();

    /* Feuille */
    geometry = new THREE.DodecahedronGeometry( 1.8 );
    let clr = Math.random() > 0.4 ? CLR_LEAVES : CLR_LEAVES_VAR1
    material = new THREE.MeshPhongMaterial( {color: clr , flatShading:false} );
    dodecahedre = new THREE.Mesh( geometry, material );
    dodecahedre.rotation.y=Math.random();
    bush.add( dodecahedre );

    clr = Math.random() > 0.4 ? CLR_LEAVES : CLR_LEAVES_VAR1
    material = new THREE.MeshPhongMaterial( {color: clr , flatShading:false} );
    dodecahedre = new THREE.Mesh( geometry, material );
    dodecahedre.rotation.y=Math.random();
    dodecahedre.position.x-=1+Math.random()
    bush.add( dodecahedre )

    if(Math.random()>0.7){
        clr = Math.random() > 0.4 ? CLR_LEAVES : CLR_LEAVES_VAR1
        material = new THREE.MeshPhongMaterial( {color: clr , flatShading:false} );
        dodecahedre = new THREE.Mesh( geometry, material );
        dodecahedre.rotation.y=Math.random();
        dodecahedre.position.z+=1+Math.random()
        dodecahedre.position.x-=0.5
        bush.add( dodecahedre )
    }

    bush.position.set(x,y,z);
    bush.rotation.y = Math.random()
    if(r)
        return bush
    else
        scene.add(bush);
}

function forest(pos, radius){
    let forest = new THREE.Object3D();
    for(let i=0;i<radius/2;i++){
        let angle = 2*Math.random()*Math.PI;
        let raduis_sq = Math.random()*radius*radius;
        let x = Math.sqrt(raduis_sq)*Math.cos(angle);
        let y = Math.sqrt(raduis_sq)*Math.sin(angle);
        if(Math.random()>0.3)
            forest.add(tree(x, 0 ,y,true))
        else
            forest.add(bush(x, 0 ,y,true))
    }
    forest.position.set(pos.x,pos.y,pos.z)
    scene.add(forest)
}

forest(new THREE.Vector3(-40,0,-140),30)