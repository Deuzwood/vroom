var camera, scene, renderer;
var car = new THREE.Object3D();

var other = []
var size_grid = 100;
var divisions = 10;
var cam = 1;
let mov = {};
let f = true;

var socket;


function init(color=0x000000) {
	let colord = color
	//Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 300 );
	camera.position.x = -30;
	camera.position.y=30;
	camera.lookAt( 0, 8, 0 );

	//Scene
	scene = new THREE.Scene();

	
	
	var lightAmb = new THREE.AmbientLight(0xffffff);
	scene.add(lightAmb);


	// car 


var MTLLoader = new THREE.MTLLoader();

MTLLoader.load( 'ressources/Low_Poly_Sportcar.mtl', 
	function (materials) {
		materials.preload();
		materials.materials.Car_MAt.color.set( parseInt(colord) )
		var OBJLoader = new THREE.OBJLoader();
		OBJLoader.setMaterials( materials );
		OBJLoader.load( 'ressources/Low_Poly_Sportcar.obj',
			function (object) {
				object.getObjectByName('Disc').visible = false
				object.scale.set( 0.01, 0.01, 0.01);
				car.add(object);
			}
		);
	}
);

car.name = "self"
car.position.y=1;
car.position.x=45;
car.rotation.y-=1.57
car.add(camera)
scene.add(car)
scene.background = new THREE.Color(0x444444)

	// On remplie Geomtry de triangle , on créer deux par deux pour avoir un carré
	var geometry = new THREE.Geometry();
	for (let x = -50; x < 50; x+=10) {
		for (let z = -50; z < 50; z+=10) {
			
			geometry.vertices.push(new THREE.Vector3( x, 0, z ))
			geometry.vertices.push(new THREE.Vector3( x, 0, z+10 ))
			geometry.vertices.push(new THREE.Vector3( x+10, 0, z ))

			
			geometry.vertices.push(new THREE.Vector3( x+10, 0, z ))
			geometry.vertices.push(new THREE.Vector3( x, 0, z+10 ))
			geometry.vertices.push(new THREE.Vector3( x+10, 0, z+10 ))
			
		}
	}


	//On en créé des faces pour les colorer
	let x=0,y=0
	for(let i=0;i<600;i+=6){
		
		//On prend la couleur en fct des coordonnées
		if( x>=1 && y>=1 && x<=8 && y<=8 ){
			color = 0x0000ff
		}
		else if(x%2==0 && y%2==0 || x%2==1 && y%2==1){
			color = 0x336699
		}
		else{
			color = 0xff6600
		}
		//On traite les faces deux par deux
		var face = new THREE.Face3( i, i+1, i+2 );
		face.vertexColors[0] = new THREE.Color(color);
		face.vertexColors[1] = new THREE.Color(color); 
		face.vertexColors[2] = new THREE.Color(color);
		geometry.faces.push( face );
		var face = new THREE.Face3( i+3, i+4, i+5 ); 
		face.vertexColors[0] = new THREE.Color(color);
		face.vertexColors[1] = new THREE.Color(color); 
		face.vertexColors[2] = new THREE.Color(color); 
		geometry.faces.push( face );
		x++
		if(x==10){
			x=0
			y++
		}
	
	}

	// Ajoute le Damier
	material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
	scene.add(new THREE.Mesh(geometry , material))


	road_render(50,30,100)
	road_render(50,130,100)

	//render
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}

/*	A chaque event keydown ->

Si c'est une dse touche Up down left right du clavier ,
on bouge la caméra et le car dans la direction voulu

Si  c'est un touche 1 ou 2 on repositionne la caméra

*/

init_control = () => document.addEventListener('keydown', (event) => {
	mov[event.code]= true

		//Camera
		if (event.code === 'KeyQ') {
			if(cam == 0)
			{
				camera.position.x = -30;
				camera.position.y = 20;
			}
			else if(cam == 1){
				camera.position.x = 1.15;
				camera.position.y = 2;
			}
			else{
				camera.position.x = 4;
				camera.position.y = 1;
			}
			cam= (cam+1)%3;
		}
 });


 document.addEventListener('keyup', (event) => {
	delete mov[event.code];
 });


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
		if( mov['ArrowDown'] && isCorrect(car.position,car.rotation,-1)){
			car.position.z -= Math.sin(-car.rotation.y); 
			car.position.x -= Math.cos(-car.rotation.y); 
		}
		if(  mov['ArrowUp'] && isCorrect(car.position,car.rotation,1) ){
			car.position.z += Math.sin(-car.rotation.y) ; 
			car.position.x += Math.cos(-car.rotation.y) ; 
		}
		
		if( mov['ArrowLeft']){
			car.rotation.y+=0.06
		}
			
		if( mov['ArrowRight'] ){
			car.rotation.y-=0.06
		}	

		socket.emit('move',car.position.x,car.position.z,car.rotation.y)
		socket.on('move' , (id,x,z,r_y) => { 
			scene.getObjectByName(id).position.x=x;
			scene.getObjectByName(id).position.z=z
			scene.getObjectByName(id).rotation.y=r_y 
	})
}

/** On créer une fonction pour savoir si
 * la position est correcte 
 * ICI -> Pas la droit d'aller dans le bleu
 * Pas le droit de sortir.
 * Return un booléen
 */
function isCorrect(position,rot,pas){
	// on calcule la prochaine position
	pos = new THREE.Vector3(position.x,position.y,position.z);
	pos.z += pas*Math.sin(-rot.y); 
	pos.x += pas*Math.cos(-rot.y); 
	return !((pos.z>50 || pos.z<-50) || (pos.x>50 || pos.x<-50)) && ((pos.z>40 || pos.z<-40) || (pos.x>40 || pos.x<-40))
}



function newCar(id,color) {
	let colord=parseInt(color)
	var tmp = new THREE.Object3D();
	var MTLLoader = new THREE.MTLLoader( );
MTLLoader.load( 'ressources/Low_Poly_Sportcar.mtl', 
	function (materials) {
		materials.preload();
		var OBJLoader = new THREE.OBJLoader( );
		OBJLoader.setMaterials( materials );
		OBJLoader.load( 'ressources/Low_Poly_Sportcar.obj',
			function (obj) {
				obj.getObjectByName('Disc').visible = false
				obj.getObjectByName("Car").material[1].color.set(colord);
				obj.scale.set( 0.01, 0.01, 0.01);
				tmp.add(obj);
			}
		);
	}
);

tmp.name = id;
tmp.position.y=1;
tmp.position.x=45;
tmp.rotation.y-=1.57
other.push(id)
scene.add(tmp)

}




/* LOG */
document.querySelector('#log').addEventListener('submit', event => {
	event.preventDefault();
	socket=io();

	socket.emit('player', pseudo.value,clr.value.replace('#','0x'))

	socket.on('new', (id,name,color)=>{
		if(f){
			init(color);
			animate()
			init_control();
			f=false;
		}
		else{
			newCar(id,color)
		}
		let li = document.createElement('li')
		li.textContent = name
		li.id='user_'+id
		li.style = "color:"+color.replace("0x",'#')
		document.querySelector('#list_user').appendChild(li);
		document.querySelector('#gui').classList = 'gui';
	;
	}) 

	socket.on('remove' , id => {
		scene.remove(scene.getObjectByName(id));
		document.querySelector('#user_'+id).remove();
	  })
	document.querySelector('.container').remove();
  })



function road_render(x,y,length,rot=0){
	let road = new THREE.Object3D();
	const w = 12;

	/* side */ 
	var geometry = new THREE.BoxGeometry( 1, 1, length )
	material = new THREE.MeshBasicMaterial({ color:0x777777 });
	let side = new THREE.Mesh(geometry , material)
	road.add(side)

	let side2 = new THREE.Mesh(geometry , material);
	side2.position.x+=w
	road.add(side2)

	/* ground */
	geometry = new THREE.PlaneGeometry( w, length )
	material = new THREE.MeshBasicMaterial({ color:0x222222});
	let ground = new THREE.Mesh(geometry , material)
	ground.position.x+=w/2
	ground.rotation.x= THREE.Math.degToRad(-90);
	road.add(ground)

	/** line */
	for(i=0;i<length;i+=10){

		geometry = new THREE.PlaneGeometry( 0.8, 6 )
		material = new THREE.MeshBasicMaterial({ color:0xffffff});
		let ground = new THREE.Mesh(geometry , material)
		ground.position.y+=0.01
		ground.position.x+=w/2
		ground.position.z+=i-length/2+6
		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)
	}

	road.position.set(x,0,y)
	road.rotation.y=THREE.Math.degToRad(rot*90)
	scene.add(road)
}