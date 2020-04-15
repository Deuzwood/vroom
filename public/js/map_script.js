/**
 * 
 */

let test= [ 
    new Segment('road', 'linear',new THREE.Vector3(0,0,0), new THREE.Vector3(100,0,0)),
	new Segment('road', 'linear',new THREE.Vector3(-50,0,0), new THREE.Vector3(-50,0,100)),
	new Segment('road', 'linear',new THREE.Vector3(20,0,20), new THREE.Vector3(80,0,80)),
	new Segment('road','linear',new THREE.Vector3(-20,0,-20),new THREE.Vector3(80,10,-20)),
	new Segment('road','linear',new THREE.Vector3(-40,10,-40),new THREE.Vector3(50,30,-60)),

	new Segment('road', 'intersect', new THREE.Vector3(-40,0,-60), [1,1,0,0]),
	new Segment('road', 'intersect', new THREE.Vector3(-60,0,-60), [1,1,1,1]),
	new Segment('road', 'intersect', new THREE.Vector3(-80,0,-60), [0,0,0,0]),
	new Segment('road', 'intersect', new THREE.Vector3(-100,0,-60), [0,1,1,0]),
	
	
	new Segment('road','curve',new THREE.Vector3(40,0,-40),[1,'x']),
	new Segment('road','curve',new THREE.Vector3(60,0,-40),[2,'x']),
	new Segment("road",'linear',new THREE.Vector3(60,0,-30), new THREE.Vector3(60,0,-40)),
	new Segment("road",'linear',new THREE.Vector3(40,0,-30), new THREE.Vector3(40,0,-40)),

	//new Segment('road', 'curve_from_to', new new THREE.Vector3(0,0,0), new THREE.Vector3(100,0,100) )

];

test.render();


	var geometry = new THREE.SphereGeometry( 1, 8, 8 );
var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(100,0,0)
scene.add( sphere );

var material = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(-50,0,0)
scene.add( sphere );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(-50,0,100)
scene.add( sphere );

var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(20,0,20)
scene.add( sphere );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(80,0,80)
scene.add( sphere );

var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(-20,0,-20)
scene.add( sphere );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(80,10,-20)
scene.add( sphere );

    
var geometry = new THREE.SphereGeometry( 1, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(-40,10,-40)
scene.add( sphere );
var sphere = new THREE.Mesh( geometry, material );
sphere.position.set(50,30,-60)
scene.add( sphere );

