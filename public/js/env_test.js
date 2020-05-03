let p = window.location.href.split('/')
last =  p.pop()

let carte;
if(last=='tree'){
    for(let i=-100; i<=100;i+=10)
        for(let j=-100;j<=100;j+=10)
            tree(i,0,j)   
}else if(last == 'bush'){
    for(let i=-100; i<=100;i+=10)
        for(let j=-100;j<=100;j+=10)
            bush(i,0,j)

}else if(last == 'forest'){
    forest(new THREE.Vector3(0,0,0),30)
    forest(new THREE.Vector3(80,0,80),20)
    forest(new THREE.Vector3(-100,0,-100),50)
}
