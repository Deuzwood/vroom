class Carte{
    /**
     * 
     * @param {...} value - Array of String 
     */
    constructor(...args){
    this.segments = []

    /*Position*/
       



    let position={x:0,y:0,z:0};
    let next_position={x:0,y:0,z:0};
    let facing=0;
    let align = 'z'
        args.forEach( segment => {
            let type = segment[1].replace('r','road')
            let shape = segment[0].replace('l','linear').replace('c','curve');
            let length = segment.split('-')[1]

            if(shape=="linear"){
                next_position.x += length*Math.cos(-facing)
                next_position.z += length*Math.sin(-facing)
            }else if(shape=="curve" && segment.split('-')[2] == "r"){
                next_position.x += segment.split('-')[1]*12-6-0.5
                next_position.z += segment.split('-')[1]*12-6-0.5
            }else if(shape=="curve" && segment.split('-')[2] == "l"){
                next_position.x += segment.split('-')[1]*12-6-0.5
                next_position.z -= segment.split('-')[1]*12-6-0.5
                facing+=THREE.Math.degToRad(-180)
            }


            
            if(shape=="linear")
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),new THREE.Vector3(next_position.x,next_position.y,next_position.z)))
            else if ( shape=='curve'){
                this.segments.push( new Segment(type,shape,new THREE.Vector3(position.x,position.y,position.z),[segment.split('-')[1],align,segment.split('-')[2]]))
                facing+=THREE.Math.degToRad(-90)
                align ='x'
            }
                
                console.log(position);console.log(next_position)
            position={...next_position}
        })
    }


    render = function() {
    this.segments.forEach(segment => {
            if(segment.shape=='linear'){
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
