class Carte{
    /**
     * 
     * @param {...} value - 
     */
    constructor(...args){
    this.segments = []
    this.checkpoints = []

    /*Position*/
    let position={x:0,y:0,z:0};
    let next_position={x:0,y:0,z:0};
    let align=0;

    if(typeof args[0] ==="object"){
        args = args[0]
    }
        
        args.forEach( segment => {
            let type,shape,length;
            if(segment == "checkpoint"){
                this.checkpoints.push([next_position.x,next_position.z])
            }
            else if(segment == 'e'){
                shape='end'
            }else{
             type = segment[1].replace('r','road')
             shape = segment[0].replace('l','linear').replace('c','curve');
             length = segment.split('-')[1]
            }

            if(shape=="linear"){
                next_position.x += length*Math.cos(THREE.Math.degToRad(align*90))
                next_position.z += -length*Math.sin(THREE.Math.degToRad(align*90))
            }else if(shape=="curve"){
                let side  = segment.split('-')[2] == "l" ? 1 : 0;

                let f =THREE.Math.degToRad((side+align)*90);

                next_position.x+= (12*length-6-0.5)*(Math.cos(f)+Math.sin(f))//-6-0.5
                next_position.z+= (12*length-6-0.5)*(Math.cos(f)-Math.sin(f))//-6-0.5
            }

/*
            var geometry = new THREE.SphereGeometry( 0.5, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
            var sphere = new THREE.Mesh( geometry,material);
            sphere.position.set(next_position.x,0,next_position.z)
            scene.add(sphere)

            var geometry = new THREE.SphereGeometry( 5, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
            var sphere = new THREE.Mesh( geometry,material);
            sphere.position.set(100,0,0)
            scene.add(sphere)

            var geometry = new THREE.SphereGeometry( 5, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0x00ffff} );
            var sphere = new THREE.Mesh( geometry,material);
            sphere.position.set(0,0,100)
            scene.add(sphere)

            var geometry = new THREE.SphereGeometry( 5, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var sphere = new THREE.Mesh( geometry,material);
            sphere.position.set(-100,0,0)
            scene.add(sphere)

            var geometry = new THREE.SphereGeometry( 5, 1, 1 );
            var material = new THREE.MeshBasicMaterial( {color: 0x003300} );
            var sphere = new THREE.Mesh( geometry,material);
            sphere.position.set(0,0,-100)
            scene.add(sphere)
*/

            if(shape=="end"){
                this.segments.push( new Segment(type,'linear',new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(0,0,0)))
            }
            
            if(shape=="linear"){
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(next_position.x,next_position.y,next_position.z)))

            }
            else if ( shape=='curve'){
                let side  = segment.split('-')[2] == "l" ? 0 : 1;
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),[segment.split('-')[1],align+side,segment.split('-')[2]]))
                if(segment.split('-')[2]=='r'){
                    align=(align-1).mod(4)
                }
                else{
                    align=(align+1).mod(4)
                }
            }
            position={...next_position}
         
        })
   
    }


    render = function() {
    this.segments.forEach(segment => {
            if(segment.shape=='linear' || segment.shape == "end"){
                segment.render_r()
            }
            else if(segment.shape=='intersect'){
                segment.render_i()
            }
            else if(segment.shape=='curve'){
                segment.render_c()
            }
        })
    } 

}


Number.prototype.mod = function(n) {
	var m = (( this % n) + n) % n;
	return m < 0 ? m + Math.abs(n) : m;
};
