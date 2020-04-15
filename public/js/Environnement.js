
function lampadaire(x,y){
    let group = new THREE.Object3D();

    let material = new THREE.MeshPhongMaterial();

    let pylone = new THREE.Mesh( new THREE.BoxGeometry(1,20,1) ,material);
    let up = new THREE.Mesh( new THREE.BoxGeometry(3,1,1) ,material);

    pylone.position.y=10
    up.position.y=20;
    up.position.x=1

    let led = new THREE.SpotLight( { instensity:1,distance:40,angle:0.6,penumbra:0.4,decay:1}) 
    led.target.position.set( 5, 1, 0 );
    group.add( led.target);
    led.position.set(2,20,0)
    group.add(pylone);
    group.add(up);
    group.add(led);
    
    group.position.set(x,0,y)
    group.rotation.y+= THREE.Math.degToRad(90)
    return group
}

export {lampadaire}