var geometry = new THREE.PlaneGeometry( 300, 300, 10,10 );

var material = new THREE.MeshPhongMaterial( {color: 0x639171, side: THREE.DoubleSide} );
for(let i=0;i<geometry.vertices.length;i++){
    geometry.vertices[i].z=1+Math.random()*Math.abs(geometry.vertices[i].x)/3;

}
geometry.faces.forEach(f=>{
    let rand = Math.round(Math.random()*3);

    if(rand == 0)
        f.color.set(0x3f4f44)
    else if(rand == 1)
        f.color.set(0x7da188)
    else if(rand == 2)
        f.color.set(0x225732)
    else if(rand == 3)
        f.color.set(0x508560)
})
geometry.colorsNeedUpdate = true
geometry.verticesNeedUpdate = true


geometry.computeFlatVertexNormals()
const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
    // wireframe:true,
    vertexColors: THREE.VertexColors,
    //required for flat shading
    flatShading:true,
}))
mesh.rotation.x+=THREE.Math.degToRad(-90)
mesh.position.y+=0.1
scene.add(mesh)