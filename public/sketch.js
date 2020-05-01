var camera, scene, renderer;
var car = new THREE.Object3D();

var other = []
let boxs = []
let vec;
var size_grid = 100;
var divisions = 10;
var cam = 1;
let mov = {};
let f = true;
let speed = 0;
var socket;

/* Notre voiture (stats) */
car_stats = {
    acceleration: 0.008,
    resistance : 0.004,
    speed : 0,
	maxSpeed : 1.2,
	maxSpeed_boost : 1.8,
    maxBack : 0.30,
    steerAngle:{
        current:0,
        max:2,
        change:1,
        toR : function(){
            return this.current * Math.PI/180;
        }
    }
}


/* Pour nos stat et cp */
let checkpoints = []
let inc=0;
let times = [];
let clock = new THREE.Clock();
clock.start();


let item = true;
var car_box;
let carte
let KeyBindings = {
	forward : { code : "ArrowUp" , key : "ArrowUp" },
	backward : { code : "ArrowDown" , key : "ArrowDown" },
	left : { code : "ArrowLeft" , key : "ArrowLeft" },
	right : { code : "ArrowRight" , key : "ArrowRight" },

	camera : { code : "KeyQ" , key : "a" },
	respawn : { code : "KeyR" , key : "r" },
	restart : { code : "KeyY" , key : "y" },
}
/**
 * KeyBindings 
 */

Object.keys(KeyBindings).forEach( key => {
	document.querySelector('#key_'+key).innerText = (KeyBindings[key].key).toUpperCase().replace("ArrownUp","Fleche Haut").replace("ArrownDown","Fleche Bas")
	document.querySelector('#key_'+key).addEventListener('click' , event => {
		document.querySelector('#key_'+key).classList = "btn btn-outline-warning";
		document.querySelector('#key_'+key).innerText = "Appuyer sur une touche ";
		 let change = event => { 
			document.querySelector('#key_'+key).innerText = event.key.toUpperCase();

			/*Object.keys(KeyBindings).forEach( k => {
				if(KeyBindings[k].code == event.code){
					document.querySelector('#key_'+k).classList = "border border-danger";
					document.querySelector('#key_'+key).classList = "border border-danger";
					console.log(key+' '+k)
				}
			})*/

			KeyBindings[key].code = event.code
			KeyBindings[key].key = event.key
			document.querySelector('#key_'+key).classList = "btn btn-outline-secondary"
		}
		document.addEventListener('keydown', change, {once : true})
	})
})

/* check support gamepads 
// Pas implementer pour le moment
*/
function supportsGamepads() {
    return !!(navigator.getGamepads);
}

function init(color=0x000000,map_name) {
	let colord = color
	//Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 300 );
	//camera.position.x = -10;
	camera.position.z = -30;
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
				object.children.pop()//on retire le disc
				object.scale.set( 0.008, 0.008, 0.008);
				object.rotation.y = -THREE.Math.degToRad(90)
				object.castShadow = true;
				car.add(object);
				
			}
		);
	}
);


/*
test.forEach( (element,i) => {
	console.log(element)
	console.log(element.getWorldPosition)
	let box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	boxs.push(box.setFromObject(element)); 

	var helper = new THREE.Box3Helper( boxs[i], 0xffff00 );
	scene.add( helper );
	
})
console.log(boxs)
*/


var cubeGeometry = new THREE.CubeGeometry(3,2,5.4,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
	car_box = new THREE.Mesh( cubeGeometry, wireMaterial );
	scene.add( car_box );

car.name = "self"
car.position.y=1;
car.position.x=0;
car.rotation.y+=THREE.Math.degToRad(90)
car.add(camera)
//car.rotation.y=THREE.Math.degToRad(180)
scene.add(car)

vec = new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0))



scene.background = new THREE.Color(0x444444)


	console.log(map_name)
	if(map_name=="server1"){
		console.log("render server1")
		carte = new Carte(map_1)

	}
	if(map_name=="server2"){
		console.log("render server2")
		carte = new Carte(map_2)

	}

	if(map_name=="server3"){
		console.log("render server3")
		carte = new Carte(map_3)

	}
	if(map_name=="server4"){
		console.log("render server4")
		carte = new Carte(map_4)

	}

	/* Routine pour toutes les carte */
	checkpoints = new Array(carte.cp.length).fill(0);
	document.querySelector('#nb_max_tour').innerText = carte.nb_turn;
	carte.render()
	
	terrain(new THREE.Vector3(0,0,0),new THREE.Vector3(200,0,200))

	/*let box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	var helper = new THREE.Box3Helper( box.setFromObject(scene.children[7].children[0]), 0xffff00 );
scene.add(helper)*/
	//create_object(-30,45)

	

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

let init_control = () => document.addEventListener('keydown', (event) => {
	mov[event.code]= true

		//Camera
		if (event.code === KeyBindings.camera.code) {
			if(cam == 0)
			{
				camera.position.z = -30;
				camera.position.y = 20;
			}
			else if(cam == 1){
				camera.position.z = 1.15;
				camera.position.y = 2;
			}
			else{
				camera.position.z = 4;
				camera.position.y = 1;
			}
			cam= (cam+1)%3;
		}
		
		if(event.code === KeyBindings.respawn.code){
			respawn()
		}
		if(event.code === KeyBindings.restart.code){
			restart()
		}
	});


 document.addEventListener('keyup', (event) => {
	delete mov[event.code];
 });


 let cg=0;
let k=0
let up = new THREE.Clock()
let act_seg = 0;
up.start()
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
/*	vec = vec.setFromObject(car)

	if(boxs[0].intersectsBox(vec)){
		console.log('intersect')
		boxs[0]
	}*/
	
	/*bordermap.forEach( element => {
		let box = new THREE.Box3();

		box.setFromObject(element)
		
		let helper = new THREE.Box3Helper( box, 0x0000ff );
		scene.add( helper );
		//test74.add(element.clone())
	})*/
	/*if(isPool(car.position)){
		car.rotation.z-=0.02;
		car.position.y-=0.02;


		if(car.rotation.z<-0.8)
			respawn();
	}else{*/

		if ( mov[KeyBindings.forward.code] ) {
            car_stats.speed = Math.min(car_stats.maxSpeed, car_stats.speed + car_stats.acceleration);
        } else if (mov[KeyBindings.backward.code]) {
            car_stats.speed = Math.max(-car_stats.maxBack, car_stats.speed - car_stats.acceleration);
        }
        if ( mov[KeyBindings.left.code] && !mov[KeyBindings.right.code]) {
            car_stats.steerAngle.current = Math.min(car_stats.steerAngle.max, car_stats.steerAngle.current + car_stats.steerAngle.change);
        } else if (mov[KeyBindings.right.code] && !mov[KeyBindings.left.code]) {
            car_stats.steerAngle.current = Math.max(-car_stats.steerAngle.max, car_stats.steerAngle.current - car_stats.steerAngle.change);
        }
    
        car_stats.speed > 0 ? car_stats.speed = Math.max(0, car_stats.speed - car_stats.resistance) : car_stats.speed = Math.min(0, car_stats.speed + car_stats.resistance);
    
        car_stats.steerAngle.current = car_stats.steerAngle.current > 0 ? Math.max(0, car_stats.steerAngle.current - car_stats.steerAngle.change / 2) : Math.min(0, car_stats.steerAngle.current + car_stats.steerAngle.change / 2);
    
        car.position.x += Math.sin(car.rotation.y + car_stats.steerAngle.toR()) * car_stats.speed ;
        car.position.z += Math.cos(car.rotation.y + car_stats.steerAngle.toR()) * car_stats.speed ;
        car.rotation.y = car.rotation.y % (2 * Math.PI) + car_stats.steerAngle.toR() * car_stats.speed;
	
	
	
		/*if( mov['ArrowDown']){
			if(speed<=0){
				car.position.z += speed*Math.sin(-car.rotation.y); 
				car.position.x += speed*Math.cos(-car.rotation.y); 
			}


			
			speed= speed-0.05>-0.3 ? speed-0.02 : speed
		}
			
		if(  (mov['ArrowUp']|| speed!=0) ){
			if(mov['ArrowUp'])
				speed+=(speed*50).toFixed(0) < MAX_SPEED ? 0.02 : 0;
			car.position.z += speed*Math.sin(-car.rotation.y) ; 
			car.position.x += speed*Math.cos(-car.rotation.y) ; 
			
		}else if(!isCorrect(car.position,car.rotation,1) ){speed=0}
			
		
		if( mov['ArrowLeft']){
			car.rotation.y+=0.05
		}
			
		if( mov['ArrowRight'] ){
			car.rotation.y-=0.05
		}*/

		/**Perte de vitesse  */
		/*if(!mov['ArrowUp'] && speed>0)
			speed= speed-0.01>0 ? speed-0.01 : 0
		if(!mov['ArrowUp'] && speed<0)
			speed= speed-0.01<0 ? speed+0.01 : 0*/

		stats(mov[KeyBindings.forward.code]);

		// D'après l'exemple de Lee Stemkoski sur le raycaster collision
		// https://stemkoski.github.io/Three.js/Collision-Detection.html
		var originPoint = car_box.position.clone();
		for (var vertexIndex = 0; vertexIndex < car_box.geometry.vertices.length; vertexIndex++)
		{		
			var localVertex = car_box.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( car_box.matrix );
			var directionVector = globalVertex.sub( car_box.position );
			
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( collidable );
			// Si y'a collision
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && mov[KeyBindings.forward.code] ){
				//console.log(collisionResults)
				//console.log(directionVector)
				let v = new THREE.Vector2(directionVector.x,directionVector.z)

				car_stats.speed=0

				car_stats.steerAngle.current=v.angle()//+THREE.Math.degToRad(90)
			}
			

		}	
		
		// On actualise la position de notre box pour les collision ()
		car_box.position.set(car.position.x,car.position.y,car.position.z);
		car_box.rotation.set(car.rotation.x,car.rotation.y,car.rotation.z);
		//
		let inter = []
		AABB_road.forEach( (box,i) => {
            box.min.y=-5
            box.max.y=20
				if(box.intersectsBox(new THREE.Box3().setFromObject(car)) && i != act_seg){
					if(inter.indexOf(i)==-1)
						inter.push(i)
				}
		})	
		if(carte.boost.includes(inter[0]))
			car_stats.speed *= 1.04 

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
	k+=up.getDelta()
		
	if(k>0.1){
		socket.emit('move',car.position.x,car.position.z,car.rotation.y)
		k=0
	}
	
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
function isCorrect(){
	// on calcule la prochaine position
	let r = true;
	let x =car.position.x + Math.sin(car.rotation.y + car_stats.steerAngle.toR()) * car_stats.speed ;
	let z =car.position.x + Math.cos(car.rotation.y + car_stats.steerAngle.toR()) * car_stats.speed ;
	bordermap.forEach( border => {
		let tmp = new THREE.Box3()
		tmp.setFromObject(border)
		if(tmp.intersectsBox(vec))
			r = false;
	})
	if(!r){
		car_stats.speed /= 2

		car.position.x += Math.sin(car.rotation.y + car_stats.steerAngle.toR()) * car_stats.speed ;
        car.position.z += Math.cos(car.rotation.y + car_stats.steerAngle.toR()) * car_stats.speed ;
       // car.rotation.y = THREE.Math.degToRad(90) // car.rotation.y % (2 * Math.PI) + car_stats.steerAngle.toR() * car_stats.speed;
	}
		


	return r;
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
				obj.scale.set( 0.008, 0.008, 0.008);
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

/**
 * Respawn au dernier checkpoint
 * Dans la bonne position et avec une vitesse nulle
 */
function respawn(){
	let i = checkpoints.lastIndexOf(1) == -1 ? 0 : checkpoints.lastIndexOf(1) ;
	console.log('respawn called')

	car.position.y=2;
	car.position.x=carte.checkpoints[i].x;
	car.position.z=carte.checkpoints[i].z
	//On applique la rotation du cp pour être 'face' au cp
	car.rotation.y=THREE.Math.degToRad(carte.checkpoints[i].facing*90 + 90);
	car.rotation.z=0;
	car.rotation.x=0;
	//reset speed
	car_stats.speed=0
	
}

/**
 * Recommence la partie
 * On reset le temps , les cp et on respawn 
 */
function restart(){
	checkpoints = new Array(carte.cp.length).fill(0);
	inc=0;
	times = [];
	clock = new THREE.Clock();
	clock.start();
	stats()

	/** Update gui */
	document.querySelector('#nbtour').innerText = 0;
	document.querySelector('#inc').innerText = 0;
	document.querySelector('#last_time').innerText = 'Aucun';
	document.querySelector('#best_time').innerText = 'Aucun';

	respawn();
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
function stats(up=0){
	inc++;
	if(up)
		document.querySelector('#inc').innerText = parseInt(document.querySelector('#inc').innerText)+1

	document.querySelector('#speed').innerText = (car_stats.speed*100).toFixed(0)

	//checkpoints, à chaque coin , a met le checkpoints à 1 pour etre sur qu'il ne fait pas demi tour.

	/* cp*/
	vec = vec.setFromObject(car)
	carte.cp.forEach( w => {
		if(w.intersectsBox(vec)){
			checkpoints[w.number_cp]=1
		}
	})
	/*TODO put last to 0.5  if reverse*/



	// si deux checkpoint && on est de retour au premier
	if(checkpoints.indexOf(0) == -1 && carte.cp[0].intersectsBox(vec))//Si  tout les checkpoints sont passé , alors on a bien fait un tour
	{
		checkpoints = new Array(carte.cp.length).fill(0);
		let last = clock.getDelta().toFixed(3)
		
		document.querySelector('#nbtour').innerText = parseInt(document.querySelector('#nbtour').innerText)+1;
		document.querySelector('#last_time').innerText = parseFloat(last).toFixed(2)+' sec';
		times.push(last)
		document.querySelector('#best_time').innerText = Math.min(...times).toFixed(2)

		if(parseInt(document.querySelector('#nbtour').innerText) == carte.nb_turn){
			speed=0
			const arrSum = arr => arr.reduce((a,b) => parseFloat(a) + parseFloat(b), 0)
			console.log('Finish with a time of '+arrSum(times).toFixed(2)+'with a best tour'+ Math.min(...times))
		}
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
	box.position.set(x,2,y)
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