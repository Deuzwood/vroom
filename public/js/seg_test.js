let p = window.location.href.split('/')
last =  p.pop()
last = last.split('-')[1]

let value = []

switch (last) {
	case 'linear':
		value = [
			new Segment('road', 'linear',new THREE.Vector3(0,0,0), new THREE.Vector3(100,0,0)),
			new Segment('road', 'linear',new THREE.Vector3(-50,0,0), new THREE.Vector3(-50,0,100)),
			new Segment('road', 'linear',new THREE.Vector3(20,0,20), new THREE.Vector3(80,0,80)),
			new Segment('road','linear',new THREE.Vector3(-20,0,-20),new THREE.Vector3(80,10,-20)),
			new Segment('road','linear',new THREE.Vector3(-40,10,-40),new THREE.Vector3(50,30,-60))
		]
		break;
	case 'curve':
		value = [
			new Segment('road','curve',new THREE.Vector3(0,0,0),[1,0,'r']),
			new Segment('road','curve',new THREE.Vector3(30,0,0),[2,0,'r']),
			new Segment('road','curve',new THREE.Vector3(60,0,0),[3,0,'r']),
			new Segment('road','curve',new THREE.Vector3(90,0,0),[4,0,'r']),

			new Segment('road','curve',new THREE.Vector3(-90,0,40),[10,2,'r']),
		]
		break;
	case 'bezier':
		break;

	case 'boost':
		value = [
			new Segment('road', 'boost',new THREE.Vector3(0,0,0), new THREE.Vector3(20,0,0)),
			new Segment('road', 'boost',new THREE.Vector3(0,0,40), new THREE.Vector3(40,0,40)),
			new Segment('road', 'boost',new THREE.Vector3(0,0,80), new THREE.Vector3(80,0,80)),
		]
		break;

	case 'checkpoint':
	value = [
		new Segment('road', 'cp',new THREE.Vector3(0,0,0), [new THREE.Vector3(10,0,0),0]),
		new Segment('road', 'cp',new THREE.Vector3(20,0,0), [new THREE.Vector3(30,0,0),1]),
		new Segment('road', 'cp',new THREE.Vector3(50,0,0), [new THREE.Vector3(60,0,0),2]),
	]
	break;

	default:
		break;
}

/*
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

];*/

value.forEach( segment => segment.render());