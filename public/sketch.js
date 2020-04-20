var camera, scene, renderer;
var car = new THREE.Object3D();

var other = []
var size_grid = 100;
var divisions = 10;
var cam = 1;
let mov = {};
let f = true;
let speed = 0;
var socket;
let item = true;
var keyBinding = {forward: "ArrowUp",backward: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", camera: "KeyQ"}

function init(color=0x000000,map_name) {
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
	/*var geometry = new THREE.Geometry();
	for (let x = -50; x < 50; x+=10) {
		for (let z = -50; z < 50; z+=10) {
			
			geometry.vertices.push(new THREE.Vector3( x, 0, z ))
			geometry.vertices.push(new THREE.Vector3( x, 0, z+10 ))
			geometry.vertices.push(new THREE.Vector3( x+10, 0, z ))

			
			geometry.vertices.push(new THREE.Vector3( x+10, 0, z ))
			geometry.vertices.push(new THREE.Vector3( x, 0, z+10 ))
			geometry.vertices.push(new THREE.Vector3( x+10, 0, z+10 ))
			
		}
	}*/


	//On en créé des faces pour les colorer
	/*let x=0,y=0
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
	
	}*/

	// Ajoute le Damier
	/*material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
	scene.add(new THREE.Mesh(geometry , material))*/

	console.log(map_name)
	if(map_name=="server1"){
		console.log("render server1")
		circuit_1.render()
	}

	create_object(-30,45)

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


 let cg=0;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	/*if(isPool(car.position)){
		car.rotation.z-=0.02;
		car.position.y-=0.02;


		if(car.rotation.z<-0.8)
			respawn();
	}else{*/
		if( mov['ArrowDown'] /*&& isCorrect(car.position,car.rotation,-1)*/){
			if(speed<=0){
				car.position.z += speed*Math.sin(-car.rotation.y); 
				car.position.x += speed*Math.cos(-car.rotation.y); 
			}


			
			speed= speed-0.05>-0.3 ? speed-0.02 : speed
		}
			
		if(  (mov['ArrowUp']|| speed!=0)/* && isCorrect(car.position,car.rotation,1) */ ){
			if(mov['ArrowUp'])
				speed+=0.02;
			car.position.z += speed*Math.sin(-car.rotation.y) ; 
			car.position.x += speed*Math.cos(-car.rotation.y) ; 
			
		}else if(!isCorrect(car.position,car.rotation,1) ){speed=0}
			
		
		if( mov['ArrowLeft']){
			car.rotation.y+=0.05
		}
			
		if( mov['ArrowRight'] ){
			car.rotation.y-=0.05
		}

		/**Perte de vitesse  */
		if(!mov['ArrowUp'] && speed>0)
			speed= speed-0.01>0 ? speed-0.01 : 0
		if(!mov['ArrowUp'] && speed<0)
			speed= speed-0.01<0 ? speed+0.01 : 0

		stats(mov['ArrowUp']);

	//}

		touch_cube();

if(mine)
	if(touch_mine()){
		speed=0;
		scene.getObjectByName('self').children[1].children[0].geometry.attributes.position.array.forEach( (element,index) => { scene.getObjectByName('self').children[1].children[0].geometry.attributes.position.array[index] = element*(1+Math.random())})
		scene.getObjectByName('self').children[1].children[0].geometry.attributes.position.needsUpdate = true;
		if(scene.getObjectByName('self').children[1].children[0].geometry.attributes.position.array[0]>100 || scene.getObjectByName('self').children[1].children[0].geometry.attributes.position.array[0]=='-Infinity')
			respawn();
	}


	
	if( mov['KeyX'] && item){
		trigger_item()
		item = false;
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
	return !((pos.z>50 || pos.z<-50) || (pos.x>50 || pos.x<-50))
	//return !((pos.z>50 || pos.z<-50) || (pos.x>50 || pos.x<-50)) && ((pos.z>40 || pos.z<-40) || (pos.x>40 || pos.x<-40))
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

function isPool(position){
	pos = new THREE.Vector3(position.x,position.y,position.z);
	return  !((pos.z>40 || pos.z<-40) || (pos.x>40 || pos.x<-40))
}
function respawn(){
	car.position.y=1;
	car.position.x=45;
	car.position.z=0
	car.rotation.y=-1.57;
	car.rotation.z=0;
	car.rotation.x=0;

	//reset checkpoint
	checkpoints=[0,0]
	
	//reset speed
	speed=0
}




/* LOG */
document.querySelector('#log').addEventListener('submit', event => {
	event.preventDefault();

	let server =document.querySelector('.card.border-success').id

		socket=io();
		socket.emit('player', pseudo.value,clr.value.replace('#','0x'),server)
		socket.on('cl', m => console.log(m))
		//socket.emit('player', pseudo.value,clr.value.replace('#','0x'))

		socket.on('new', (id,name,color)=>{
			if(f){
				console.log('i init here')
				init(color,server);
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
			document.querySelector('#stats').classList = 'stats';
			document.querySelector('#main_gui').classList = '';
		;
		}) 
	
		socket.on('remove' , id => {
			scene.remove(scene.getObjectByName(id));
			document.querySelector('#user_'+id).remove();
		  })
		document.querySelector('.container').remove();
	
	
  })





/**
 * On actualise nos stats
 * Ici pas de Dat.gui que du js 
 * On pourra modifier notre gui plus simplement
 *
 */
let inc=0;
let checkpoints = [0,0]
let times = [];
let clock = new THREE.Clock();
clock.start();
function stats(up){
	inc++;
	if(up)
		document.querySelector('#inc').innerText = parseInt(document.querySelector('#inc').innerText)+1

	document.querySelector('#speed').innerText = (speed*50).toFixed(0)

	//checkpoints, à chaque coin , a met le checkpoints à 1 pour etre sur qu'il ne fait pas demi tour.
	//45,1,0 -> position de départ

	//check 1
	if(car.position.x<50 && car.position.x>40 && car.position.z>-10 && car.position.z<10){
		checkpoints[0]=1
		clock.start
	}

	//check 2
	if(car.position.x<-40 && car.position.x>-50 && car.position.z>0 && car.position.z<10){
		checkpoints[1]=1
	}

	// si deux checkpoint && on est de retour au premier
	if(checkpoints.indexOf(0) == -1 && car.position.x<50 && car.position.x>40 && car.position.z>-10 && car.position.z<10)//Si  tout les checkpoints sont passé , alors on a bien fait un tour
	{
		checkpoints = [0,0]
		let last = clock.getDelta().toFixed(2)

		document.querySelector('#nbtour').innerText = parseInt(document.querySelector('#nbtour').innerText)+1
		document.querySelector('#last_time').innerText = last+' sec';
		times.push(last)
		document.querySelector('#best_time').innerText = Math.min(...times)
	}
		

}




let box = new THREE.Group();
box.name='box';
function create_object(x,y){
	let geometry = new THREE.BoxGeometry(3,3,3)
	let material = new THREE.MeshBasicMaterial( { color:0xffffff})

	let obj = new THREE.Mesh( geometry , material)
	
	obj.rotation.y=THREE.Math.degToRad(45)
	obj.rotation.x=THREE.Math.degToRad(45)
	box.add(obj)
	box.position.set(x,3.5,y)
	scene.add(box)
}



let drop = [ 'Mine']
let actual_item
function touch_cube(){
		if(car.position.distanceTo(box.position)<3.5){
			box.visible=false
			box.position.set(999,999,999)
			//todo delete render object

			//Pick one item
			const random = drop[Math.floor(Math.random() * drop.length)];
			console.log(random)
			document.querySelector('#item').innerText = random
			actual_item = random
		}
			
}


/* Green 
/* Champipi
/* banana
*/
let it = new THREE.Group();
let mine=false;
function trigger_item(){
	console.log('triggered')
	if(actual_item === 'Mine'){
		mine=true;
		it.name='item_mine';
		let geometry = new THREE.CylinderGeometry(2,2,0.3,32)
		let material = new THREE.MeshBasicMaterial( { color:0x000000})
		let obj = new THREE.Mesh( geometry , material)

		 geometry = new THREE.CylinderGeometry(0.8,0.8,0.1,8)
		 material = new THREE.MeshBasicMaterial( { color:0xff0000})
		let pop = new THREE.Mesh( geometry , material)
		pop.position.y+=0.3

		it.add(obj)
		it.add(pop)
		it.position.set(car.position.x,car.position.y,car.position.z) 
		scene.add(it)
	}


	document.querySelector('#item').innerText = '';
}


function touch_mine(){
	if(car.position.distanceTo(it.position)<3.5){
		it.visible=false
		//it.position.set(999,999,999)
	return true;
	}
		
}