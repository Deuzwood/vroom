let fa=0;
let map;
let geometry
let first=true;
let test_noise;
let gen;
function terrain(lac=false){

    map = new THREE.Box3(new THREE.Vector3(0,0,0), new THREE.Vector3(200,4,200))
//var maph = new THREE.Box3Helper( map, 0xffff00 );
//scene.add( maph );


const SIZE_PLUS = 100
 
    gen = new THREE.Box3();
    AABB_road.forEach( box => {
        //var helper = new THREE.Box3Helper( box, 0xff00ff );
        //scene.add( helper );
        gen.union(box)
    })
    gen.min.y=-5
    gen.max.y=100
   // var helper = new THREE.Box3Helper( gen, 0xff00000 );
        //scene.add( helper );

    if(lac){
        //var lac_helper = new THREE.Box3Helper( lac, 0xffff00 );
        //scene.add( lac_helper );

        geometry_w = new THREE.PlaneGeometry( gen.max.x-gen.min.x+SIZE_PLUS, gen.max.z-gen.min.z+SIZE_PLUS, (gen.max.x-gen.min.x+SIZE_PLUS)/10 , (gen.max.z-gen.min.z+SIZE_PLUS)/10 );
        geometry_w.rotateX(THREE.Math.degToRad(-90))
        
        const water = new THREE.Mesh(geometry_w, new THREE.MeshPhongMaterial({
            color:0x00ffff,
            opacity:0.5,
            transparent:true
        }))
        water.position.y-=1
        geometry_w.translate(gen.getCenter().x,-0.2,gen.getCenter().z)
        scene.add(water)
    }



    geometry = new THREE.PlaneGeometry( gen.max.x-gen.min.x+SIZE_PLUS, gen.max.z-gen.min.z+SIZE_PLUS, (gen.max.x-gen.min.x+SIZE_PLUS)/10 , (gen.max.z-gen.min.z+SIZE_PLUS)/10 );
    geometry.rotateX(THREE.Math.degToRad(-90))
    geometry.translate(gen.getCenter().x,-0.2,gen.getCenter().z)
    for(let i=geometry.vertices.length-1;i>0;i--){
     //   geometry.vertices[i].y=0

        let m = []
        AABB_road.forEach( box => {
            box.min.y=-5
            box.max.y=20
           
                m.push(box.distanceToPoint(geometry.vertices[i]))
        })
       // console.log(Math.min(...m))
        m = Math.min(...m)
        if(m!=0){
            geometry.vertices[i].y=m/2.5+Math.random()*4
        }
        if(gen.containsPoint(geometry.vertices[i]) && m!=0)
            geometry.vertices[i].y=m/2-Math.random()*5+Math.log(m)
        if(lac)
            if(lac.containsPoint(geometry.vertices[i]) && m!=0){
                geometry.vertices[i].y=-(+Math.random()*5+Math.log(m))
                geometry_w.vertices[i].y=-Math.random()
          
            }
              
          
    }

    geometry.faces.forEach( (f,i)=>{
            const a = geometry.vertices[f.a]
            const b = geometry.vertices[f.b]
            const c = geometry.vertices[f.c]

            let m = []
            AABB_road.forEach( box => {
                box.min.y=-5
                box.max.y=20
                if( box.containsPoint(a) || box.containsPoint(b) || box.containsPoint(c)){
                    a.y=-0.2
                    b.y=-0.2
                    c.y=-0.2
                }
            })
            const max = Math.max(a.y,Math.max(b.y,c.y))
            if(max <1) f.color.set(CLR_GRASS)
            else if(max <=10) f.color.set(CLR_DIRT)
            else if(max <=20) f.color.set(CLR_CLAY)
            else if(max <=30) f.color.set(CLR_STONE)
            else f.color.set( CLR_SNOW)

    })
    geometry.colorsNeedUpdate = true
    geometry.verticesNeedUpdate = true


    geometry.computeFlatVertexNormals()


    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
        // wireframe:true,
        vertexColors: THREE.VertexColors,
        //required for flat shading
        flatShading:true,
    }))

    mesh.receiveShadow = true;
    
    //mesh.rotation.x+=THREE.Math.degToRad(-90)
    mesh.position.y+=0.1
    mesh.updateMatrix()

    //mesh.position.set( gen.getCenter().x,-0.1,gen.getCenter().z );
    scene.add(mesh)

    
}