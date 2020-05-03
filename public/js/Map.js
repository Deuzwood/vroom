class Carte{
    /**
     * 
     * @param {...} value - 
     */
    constructor(...args){

        //Liste des segments de notre carte
        this.segments = []

        // Checkpoint contient les position pour le respawn
        this.checkpoints = []
        // et cp les AABB box des cp
        this.cp = []

        //Index des segment boost
        this.boost = []

        // Nombre de tour à réaliser
        this.nb_turn = DEFAULT_NB_TURN

        /*Position*/
        let position={x:0,y:0,z:0};
        let next_position={x:0,y:0,z:0};
        let align=0;
        
        /**
         * Deux possiblité pour créer une carte on peut faire 
         * new Carte( [] ou element1,element2
         * mais on veut traiter une iteration donc si on obtient un [] 
         * on rectifie
         */
        if(typeof args[0] ==="object"){
            args = args[0]
        }
        /*On ajouter un CP au début si le mapeur ne la pas fait. c'est notre départ*/
        if(args[0] != "checkpoint")
            args.unshift("checkpoint");

        args.forEach( segment => {
            let type,shape,length;
            if(segment == "cp" || segment == "checkpoint"){
                shape="cp"
                this.checkpoints.push({x:next_position.x,z:next_position.z,facing:align})
                next_position.x += 10*Math.cos(THREE.Math.degToRad(align*90))
                next_position.z += -10*Math.sin(THREE.Math.degToRad(align*90))

                var box = new THREE.Box3();

                var mesh = new THREE.Mesh(
                    new THREE.BoxGeometry( W_ROAD, 3, 1 ),
                    new THREE.MeshBasicMaterial({color: 0xffffff })
                );
                mesh.position.set((next_position.x + position.x)/2,(next_position.y + position.y)/2,(next_position.z + position.z)/2)
                box.number_cp=this.cp.length
                mesh.lookAt(next_position.x,next_position.y,next_position.z)
                //scene.add(mesh)
                box.setFromObject(mesh)
                //var helper = new THREE.Box3Helper( box.setFromObject(mesh), 0xffff00 );
                this.cp.push(box)
               // scene.add( helper );

            }
            else if(segment == 'end'){
                shape='end'
            }
            else{
                segment = segment.split(' ')
                type = 'road'
                shape = segment[0];
                length = segment[1]
            }
        
            // Calcule des positions
            if(shape=="linear" || shape=="tunnel" || shape=="boost"){
                next_position.x += length*Math.cos(THREE.Math.degToRad(align*90))
                next_position.z += -length*Math.sin(THREE.Math.degToRad(align*90))
            }else if(shape=="bezier"){
                next_position.x += length*Math.cos(THREE.Math.degToRad(align*90))+segment[2]*Math.sin(THREE.Math.degToRad(align*90))
                next_position.z += -length*Math.sin(THREE.Math.degToRad(align*90))+segment[2]*Math.cos(THREE.Math.degToRad(align*90))
            }else if(shape=="curve"){
                let side  = segment[2] == "l" ? 1 : 0;
                let f =THREE.Math.degToRad((side+align)*90);

                next_position.x+= (W_ROAD*length-W_ROAD/2-0.5)*(Math.cos(f)+Math.sin(f))
                next_position.z+= (W_ROAD*length-W_ROAD/2-0.5)*(Math.cos(f)-Math.sin(f))
            }

            if(shape=="end"){
                this.segments.push( new Segment(type,'linear',new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(0,0,0)))
            }
            
            if(shape=="cp"){
                this.segments.push( new Segment(type,'cp',new THREE.Vector3(position.x,position.y,position.z),[new THREE.Vector3(next_position.x,next_position.y,next_position.z),this.cp.length-1]))
            }
            if(shape=="linear"){
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(next_position.x,next_position.y,next_position.z)))

            }
            if(shape=="tunnel"){
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(next_position.x,next_position.y,next_position.z)))

            }
            if(shape=="bezier"){
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),[align,segment[1], segment[2]]))

            }
            if(shape=="boost"){
                this.boost.push(this.segments.length)
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(next_position.x,next_position.y,next_position.z)))

            }
            else if ( shape=='curve'){
                let side  = segment[2] == "l" ? 0 : 1;
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),[segment[1],align+side,segment[2]]))
                if(segment[2]=='r'){
                    align=(align-1).mod(4)
                }
                else{
                    align=(align+1).mod(4)
                }
            }
            position={...next_position}
         
        })
   
    }

    /***
     * Render va afficher la map.
     * Elle affiche donc tout les segments un par un
     */
    render = function() {
        this.segments.forEach(segment => {
            segment.render()
        })
    } 

}

/**
 *  J'avais besoin de vrai modulo ( fonction euclidienne )
 * pour la var 'align'
 * car le mod de js ( % ) peut retourner un negatif
 * 
 * Le code suivant provient de cette page
 * https://blog.smarchal.com/modulo-en-js#fonction-euclidienne 
 */
Number.prototype.mod = function(n) {
	var m = (( this % n) + n) % n;
	return m < 0 ? m + Math.abs(n) : m;
};
