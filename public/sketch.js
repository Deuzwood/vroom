var camera, scene, renderer;
var car = new THREE.Object3D();

var other = []
var boxs = []
var vec;
var size_grid = 100;
var divisions = 10;
var cam = 1;
var mov = {};
var f = true;
var socket;
var server;

/* Notre voiture (stats) */
car_stats = {
    acceleration: 0.008,
    resistance : 0.004,
    speed : 0,
	maxSpeed : 1.2,
	maxSpeed_boost : 1.8,
    maxBack : 0.30,

	rotation : 2, // max
	inc : 0.2,
	angle : 0,
}

// Debug
var fleche;

/* Pour nos stat et cp */
var checkpoints = []
var inc=0;
var times = [];
var clock = new THREE.Clock();
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

	players : { code : "KeyN" , key : "n" },
}
/**
 * KeyBindings 
 */

Object.keys(KeyBindings).forEach( key => {
	document.querySelector('#key_'+key).innerText = (KeyBindings[key].key).toUpperCase().replace('ARROW', 'ARROW ')
	document.querySelector('#key_'+key).addEventListener('click' , event => {
		document.querySelector('#key_'+key).classList = "btn btn-outline-warning";
		document.querySelector('#key_'+key).innerText = "Appuyer sur une touche ";
		 let change = event => { 
			document.querySelector('#key_'+key).innerText = event.key.toUpperCase().replace('ARROW', 'ARROW ');

			/*Object.keys(KeyBindings).forEach( k => {
				if(KeyBindings[k].code == event.code){
					document.querySelector('#key_'+k).classList = "btn btn-outline-danger";
					document.querySelector('#key_'+key).classList = "btn btn-outline-danger";
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



function init(color=0x000000) {
	let colord = color
	//Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 300 );
	//camera.position.x = -10;
	camera.position.z = -30;
	camera.position.y=30;
	camera.lookAt( 0, 8, 0 );

	//Scene
	scene = new THREE.Scene();

	var spotLight = new THREE.SpotLight( {color:0xffffff,intensity:2,distance:200} );
	spotLight.position.set( 0, 180, 0 );
	spotLight.castShadow = true;
	spotLight.angle = Math.PI/2.8
	scene.add( spotLight );
	


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
				object.children.pop()//on retire le 'disc'
				object.scale.set( 0.008, 0.008, 0.008);
				object.rotation.y = -THREE.Math.degToRad(90)
				object.castShadow = true;
				car.add(object);
				
			}
		);
	}
);

 geometry = new THREE.Geometry();

geometry.vertices.push(
	new THREE.Vector3( 5,  0, 0 ),
	new THREE.Vector3( 0, 0, 2 ),
	new THREE.Vector3(  0, 0, -2 )
);

/* DEBUG
geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
geometry.computeBoundingSphere();
fleche = new THREE.Mesh(geometry , new THREE.MeshBasicMaterial({color : 0xff00ff, side:THREE.DoubleSide}))

scene.add(fleche)*/


var cubeGeometry = new THREE.CubeGeometry(2.8,2,5.4,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe:true } );
	car_box = new THREE.Mesh( cubeGeometry, wireMaterial );
	car_box.visible=false
	scene.add( car_box );

car.name = "self"
car.position.y=1;
car.position.x=0;
car.rotation.y+=THREE.Math.degToRad(90)
car.add(camera)
scene.add(car)

vec = new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0))
scene.background = new THREE.Color(0x444444)


	if(server=='server1'){
		carte = new Carte(map_1)
		carte.render()
		terrain()
	
	
		for(let i=0; i<70;i+=10){
			tree(i,0,10)
		}
	
		forest(new THREE.Vector3(-50,0,-50),10)
	
	}else if(server == 'server2'){
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
	
	}else if(server == 'server3'){
		carte = new Carte(map_3)
		carte.render()
		terrain()
	
		forest(new THREE.Vector3(-130,0,50),50)
		forest(new THREE.Vector3(-130-70,0,50+70),20)
	
	}
	else if(server == 'server4'){
		carte = new Carte(map_4)
		carte.render()
		terrain(new THREE.Box3(new THREE.Vector3(-100,-20,10), new THREE.Vector3(70,40,80)))
	
		forest(new THREE.Vector3(45,0,45),20)
		forest(new THREE.Vector3(70,0,-70),10)
	
		forest(new THREE.Vector3(-75,0,25),15)
	
	}else if(server == 'server5'){
		carte = new Carte(map_5)
		carte.render()
		terrain(new THREE.Box3(new THREE.Vector3(-120,-20,0), new THREE.Vector3(10,40,80)))
	
		forest(new THREE.Vector3(10,0,285),30)
		forest(new THREE.Vector3(30,0,40),20)
		forest(new THREE.Vector3(-130,0,40),20)
	
	}

	/* Routine pour toutes les carte */
	checkpoints = new Array(carte.cp.length).fill(0);
	document.querySelector('#nb_max_tour').innerText = carte.nb_turn;

	
	terrain()

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
				camera.position.y = 30;
				camera.rotation.x = -2.50
			}
			else if(cam == 1){
				camera.position.z = 1.15;
				camera.position.y = 2;
				camera.rotation.x = -2.70
			}
			else{
				camera.position.z = 4;
				camera.position.y = 1;
				camera.rotation.x = -2.70
			}
			cam= (cam+1)%3;
		}
		
		if(event.code === KeyBindings.respawn.code){
			respawn()
		}
		if(event.code === KeyBindings.restart.code){
			restart()
		}
		if(event.code === KeyBindings.players.code){
			other.forEach(
				player => {
					scene.getObjectByName(player).visible = !scene.getObjectByName(player).visible
				}
			)
			//socket.off('move')
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

let old=100;// juste pour que la qu'a la premiere iteration on stop 
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	//fleche.position.set(car.position.x,4,car.position.z)
	stats(mov[KeyBindings.forward.code]);


	if ( mov[KeyBindings.forward.code] ) {
		// Si la vitesse est superieur a speedmax on reduit la vitesse , sinon on accelere jusqu'a max speed
		car_stats.speed = car_stats.speed <= car_stats.maxSpeed ? Math.min(car_stats.maxSpeed, car_stats.speed + car_stats.acceleration) : Math.min(car_stats.maxSpeed_boost, car_stats.speed - car_stats.resistance);
	} else if (mov[KeyBindings.backward.code]) {
		// accelere jusqu'a maxback ( max vitesse en marche arrière)
		car_stats.speed = Math.max(-car_stats.maxBack, car_stats.speed - car_stats.acceleration);
	}
	
	if ( mov[KeyBindings.left.code] && !mov[KeyBindings.right.code]) {
		// meme principe mais pour la rotation
		car_stats.angle = Math.min(car_stats.rotation, car_stats.angle + car_stats.inc);
	} 
	if (mov[KeyBindings.right.code] && !mov[KeyBindings.left.code]) {
		car_stats.angle = Math.max(-car_stats.rotation, car_stats.angle - car_stats.inc);
	}

	car_stats.speed > 0 ? car_stats.speed = Math.max(0, car_stats.speed - car_stats.resistance) : car_stats.speed = Math.min(0, car_stats.speed + car_stats.resistance);

	// inc est un incrément pour eviter que la rotation soit instantané
	car_stats.angle = car_stats.angle > 0 ? Math.max(0, car_stats.angle - car_stats.inc / 2) : Math.min(0, car_stats.angle + car_stats.inc / 2);

	//on gere la pos et la rotation , tout dépend de la vitesse
	car.position.x += Math.sin(car.rotation.y + THREE.Math.degToRad(car_stats.angle) ) * car_stats.speed ;
	car.position.z += Math.cos(car.rotation.y + THREE.Math.degToRad(car_stats.angle) ) * car_stats.speed ;
	car.rotation.y = car.rotation.y % (2 * Math.PI) + THREE.Math.degToRad(car_stats.angle)  * car_stats.speed;


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
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
			let v = new THREE.Vector2(directionVector.x,directionVector.z)
			
			/**
			 * Element clé pour la position
			 * Je garde la distance avec la collision calculé précedente
			 * Si l'ancienne est plus grand c'est mon joueur essaye de quitter la collision
			 * càd il s'eloigne , alors je le laisse repartir
			 * sinon je l'arrete
			 */
			if(old>collisionResults[0].distance)
				car_stats.speed=0
			old=collisionResults[0].distance

			console.log(v.angle())
			//fleche.rotation.y=v.angle()//+THREE.Math.degToRad(90)
			


			/**
			 * ICI DES TEST pour le wal hit
			 * pas concluant 
			 * mais j'ai l'idée
			 */
			
			//if(v.angle()+car.rotation.y<THREE.Math.degToRad(180) && mov[KeyBindings.forward.code] && v.angle()<THREE.Math.degToRad(180) )
			//	car.rotation.y += Math.abs(v.angle()/100 )
			//else if(v.angle()+car.rotation.y>THREE.Math.degToRad(180) && mov[KeyBindings.forward.code] )
			//	car.rotation.y -= Math.abs(v.angle()/100)

		/*	if(car.rotation.y > THREE.Math.degToRad(50) && car.rotation.y < THREE.Math.degToRad(90) && v.angle()<THREE.Math.degToRad(90) 
			|| (car.rotation.y < 3 && car.rotation.y < 5 && v.angle()<3) )
				car.rotation.y += Math.abs(v.angle()/100  )
			else if( (car.rotation.y > THREE.Math.degToRad(90) && car.rotation.y < THREE.Math.degToRad(140) && v.angle()>THREE.Math.degToRad(90) )
			 || (car.rotation.y > 3.5 && car.rotation.y < 4.8 && v.angle()>3.5)
			 )
				car.rotation.y += Math.abs(v.angle()/100 )*/

			/*console.log('----')
			console.log(v.angle())
			console.log(car.rotation.y)*/
		}

	}	
	
	
	// On actualise la position de notre box pour les collision ()
	car_box.position.set(car.position.x,car.position.y,car.position.z);
	car_box.rotation.set(car.rotation.x,car.rotation.y,car.rotation.z);
	//

	//On actualise le segment sur lequel est le joueur
	let inter = []
	AABB_road.forEach( (box,i) => {
		box.min.y=-5
		box.max.y=20
			if(box.intersectsBox(new THREE.Box3().setFromObject(car)) && i != act_seg){
				if(inter.indexOf(i)==-1)
					inter.push(i)
			}
	})	


	// S'il est sur un boost on lui donne un boost de vitesse
	if(carte.boost.includes(inter[0]))
		car_stats.speed *= 1.04 


	k+=up.getDelta()
		
	if(k>0.05){
		socket.emit('move',car.position.x,car.position.z,car.rotation.y-THREE.Math.degToRad(90))
		k=0
	}


}

/**
 * Fonction qui permet d'ajouter un joueur 
 * @param {string} id - Id socket du joueur 
 * @param {string} color - Couleur hexa de la voiture à chargé
 */
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
					obj.children.pop() // remove disc
					obj.getObjectByName("Car").material[1].color.set(colord);
					obj.scale.set( 0.008, 0.008, 0.008);
					obj.children.forEach( child => child.material.forEach( m =>{ m.opacity=0.2;m.transparent=true;console.log(m.opacity)}) )
					tmp.add(obj);
				}
			);
		}
	);

	tmp.name = id;
	tmp.position.y=1;
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

	car.position.y=1;
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


/**
 * On actualise nos stats
 * Ici pas de Dat.gui 
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
		// on touche un cp et qu'il est soit le cp 0 ou un cp dont le précendent est à 1 alors on est dans le bon sens
		if(w.intersectsBox(vec) && ((checkpoints[w.number_cp-1]==1 && w.number_cp!=0) || w.number_cp==0) ){
			checkpoints[w.number_cp]=1
		}
	})


	// si deux checkpoint && on est de retour au premier
	if(checkpoints.indexOf(0) == -1 && carte.cp[0].intersectsBox(vec))//Si  tout les checkpoints sont passé et qu'on est au depart , alors on a bien fait un tour
	{
		checkpoints = new Array(carte.cp.length).fill(0);
		let last = clock.getDelta().toFixed(3)

		// Actualise tous les stats
		document.querySelector('#nbtour').innerText = parseInt(document.querySelector('#nbtour').innerText)+1;
		document.querySelector('#last_time').innerText = parseFloat(last).toFixed(2)+' sec';
		times.push(last)
		document.querySelector('#best_time').innerText = Math.min(...times).toFixed(2)

		if(parseInt(document.querySelector('#nbtour').innerText) == carte.nb_turn){
			car_stats.speed=0;
			const arrSum = arr => arr.reduce((a,b) => parseFloat(a) + parseFloat(b), 0)
			console.log('Time '+arrSum(times).toFixed(2)+' - '+ Math.min(...times))
		}
	}
		

}

/* check support gamepads 
// Pas implementer pour le moment
*/
function supportsGamepads() {
    return !!(navigator.getGamepads);
}