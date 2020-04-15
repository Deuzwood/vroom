/**
 * Init for /test/map...
 */

var camera, scene, renderer;
var size_grid = 200;
var divisions = 20;
var controls;
var stats = new Stats();


init();
animate();

function init() {

	//Camera
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 0;
	camera.position.y=200;
	camera.lookAt( 0, 0, 0 );


	//Scene
    scene = new THREE.Scene();
    

    //Light
	var spotLight = new THREE.SpotLight( {color:0xffffff,intensity:2,distance:200} );
	spotLight.position.set( 0, 180, 0 );
	scene.add( spotLight );
	
	var spotLightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLightHelper );

    //Grid Helper
	var gridHelper = new THREE.GridHelper( size_grid, divisions );
	scene.add( gridHelper );

	//render
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( frame.offsetWidth
        , window.innerHeight );
    document.querySelector('#frame').appendChild( renderer.domElement );

    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.querySelector('#frame').appendChild( stats.dom );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.update();

}

function animate() {

    
    controls.update();
    render();
   stats.update();
   
    
    requestAnimationFrame( animate );	
}


function onWindowResize() {

    camera.aspect = frame.offsetWidth / window.innerHeight;
    camera.left = frame.offsetWidth / - 2;
    camera.right = frame.offsetWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / - 2;
    renderer.setSize( frame.offsetWidth, window.innerHeight );
    console.log("resize")
    render();

  }

function render() 
{
    renderer.render( scene, camera );
  }