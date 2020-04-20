let mine = new THREE.Group();
mine.name='item_mine';
let geometry = new THREE.CylinderGeometry(2,2,0.3,32)
let material = new THREE.MeshBasicMaterial( { color:0x000000})
let obj = new THREE.Mesh( geometry , material)

    geometry = new THREE.CylinderGeometry(0.8,0.8,0.1,8)
    material = new THREE.MeshBasicMaterial( { color:0xff0000})
let pop = new THREE.Mesh( geometry , material)
pop.position.y+=0.3
pop.name='pop'
mine.add(obj)
mine.add(pop)
scene.add(mine)
let a = new THREE.Mesh(new THREE.CircleGeometry(20,32),new THREE.MeshBasicMaterial({color:0xAAAAAA}));
a.rotation.x-= THREE.Math.degToRad(90);
scene.add(a);

camera.position.set(10,10,10)

let t =new THREE.Clock()
t.getDelta()
function animate(t) {
    t *= 0.001;
    t = t.toFixed(0)
    
    controls.update();

     scene.getObjectByName('item_mine').getObjectByName('pop').material.color.r = Math.sin(t)
    requestAnimationFrame( animate );
	render();
}
