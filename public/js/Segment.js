/**
 * Classe Segment qui définit chaque segment de notre ciruits
 * Gere l'affichage
 */
class Segment {
	/**
	 * 
	 * @param {String} type - road,dirt
	 * @param {String} shape -linear,intersect,curve / l,i,c
	 * @param {THREE.Vector3} param1 
	 * @param {THREE.Vector3} param2 
	 */
    constructor(type, shape,param1,param2=0) {
		this.type = type;
		this.shape = shape;
		this.from = param1;
		if(shape=='linear' || shape=='cp'){

			this.to = param2;
		}
		if(shape=='intersect'){
			this.open = param2 ;
		}
		if(shape=='curve'){
			this.size = param2[0];
			this.align = param2[1];
			this.side = param2[2]
		}
		 	


	}



    render_r (){
        let road = new THREE.Object3D();
        const w = W_ROAD;
    
        let x = this.from.x
        let y = this.from.y
		let length = this.from.distanceTo(this.to)

	
        /* side */ 
        var geometry = new THREE.BoxGeometry( 1, 1, length )
        var material = new THREE.MeshPhongMaterial({ color:0x777777 });
		let side = new THREE.Mesh(geometry , material)
		side.position.x-=w/2
		side.position.y+=0.5
        road.add(side)
    
        let side2 = new THREE.Mesh(geometry , material);
		side2.position.x+=w/2
		side2.position.y+=0.5
		road.add(side2)
		
		
    
        /* ground */
        geometry = new THREE.PlaneGeometry( w, length )
        material = new THREE.MeshPhongMaterial({ color:0x222222});
		let ground = new THREE.Mesh(geometry , material)

		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)
		
		/** line */
		geometry = new THREE.PlaneGeometry( 0.8, 6 )
        material = new THREE.MeshPhongMaterial({ color:0xffffff});
        for(let i=0;i<length-5;i+=10){
            let ground = new THREE.Mesh(geometry , material)
            ground.position.y+=0.01
            ground.position.z+=i-length/2+6
            ground.rotation.x= THREE.Math.degToRad(-90);
            road.add(ground)
        }
    
        road.position.set(x,0,y)
		//road.applyMatrix( new THREE.Matrix4().makeTranslation( (this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 ) );
		road.position.set((this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 )
		road.name="road"+this.from.toArray().toString();

		road.lookAt(this.to.x,this.to.y,this.to.z)
		scene.add(road)
		
	}

	render_cp (){
        let road = new THREE.Object3D();
        const w = W_ROAD;
    
        let x = this.from.x
        let y = this.from.y
		let length = this.from.distanceTo(this.to)
		console.log(length)
	
        /* side */ 
        var geometry = new THREE.BoxGeometry( 1, 1, length )
        var material = new THREE.MeshPhongMaterial({ color:0x777777 });
		let side = new THREE.Mesh(geometry , material)
		side.position.x-=w/2
		side.position.y+=0.5
        road.add(side)
    
        let side2 = new THREE.Mesh(geometry , material);
		side2.position.x+=w/2
		side2.position.y+=0.5
		road.add(side2)
		
		
    
        /* ground */
        geometry = new THREE.PlaneGeometry( w, length )
        material = new THREE.MeshPhongMaterial({ color:0x00ffff});
		let ground = new THREE.Mesh(geometry , material)

		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)
    
        road.position.set(x,0,y)
		//road.applyMatrix( new THREE.Matrix4().makeTranslation( (this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 ) );
		road.position.set((this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 )
		road.name="cp"+this.from.toArray().toString();

		road.lookAt(this.to.x,this.to.y,this.to.z)
		scene.add(road)
		
	}
	
	
	render_i(){
		let road = new THREE.Object3D();
		const w = 12;

		this.open.forEach( (element,index) => {
			let side,geometry,material,line;
			if(element){
				geometry = new THREE.BoxGeometry( 1, 1, w )
				material = new THREE.MeshPhongMaterial({ color:0x777777 });
				side = new THREE.Mesh(geometry , material)

				line = new THREE.Mesh( new THREE.PlaneGeometry(0.8 , 3) , new THREE.MeshPhongMaterial( {color : 0xffffff }))
			}

			if(element && index==0){
				side.position.set(0,0,0)

				line.rotation.x+=THREE.Math.degToRad(90);
			}
			if(element && index==1){
				side.position.set(w/2,0,-w/2)
				side.rotation.y+= THREE.Math.degToRad(90)

				line.rotation.x+=THREE.Math.degToRad(42);
				
			}
			if(element && index==2){
				side.position.set(w,0,0)

				line.rotation.x= THREE.Math.degToRad(-90)
				
			}
			if(element && index==3){
				side.position.set(w/2,0,w/2)
				side.rotation.y+= THREE.Math.degToRad(90)


				line.rotation.x= THREE.Math.degToRad(90)
			}
		
			if(element){
				line.rotation.x= THREE.Math.degToRad(-90);
				line.position.set(w/2,0.01,w/2-3)
				road.add(side)
				//road.add(line)		
			}

		});

		/* ground */
		let geometry = new THREE.PlaneGeometry( w, w )
		let material = new THREE.MeshPhongMaterial({ color:0x222222, side:THREE.DoubleSide});
		let ground = new THREE.Mesh(geometry , material)
		ground.position.x+=w/2
		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)

		road.position.set(this.from.x,this.from.y,this.from.z)
		
		scene.add(road)
	}

	/**
	 * 
	 */
	render_c(){
		let curve = new THREE.Object3D();

		const w = W_ROAD;
		/*outer*/
		var shape = new THREE.Shape();
		shape.moveTo(0, 0);
		shape.quadraticCurveTo(this.size*w, 0, this.size*w, this.size*w);
		shape.lineTo(this.size*w-1, this.size*w);
		shape.quadraticCurveTo(this.size*w-1,1, 0, 1);           

		var extrudeSettings = {
			amount : 1,
			steps : 1,
			bevelEnabled: false,
			curveSegments: 10*this.size
		};

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color:0x777777 }));
		curve.add( mesh );
	
		

		/* inner */ 
		if(this.size!=1){
			var shape = new THREE.Shape();
			shape.moveTo(0, w);
			shape.quadraticCurveTo((this.size-1)*w, w, (this.size-1)*w,(this.size)*w);
			shape.lineTo((this.size-1)*w-1,(this.size)*w);
			shape.quadraticCurveTo((this.size-1)*w-1,w+1,0,w+1);
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
			var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color:0x777777 }));
	
	
			curve.add( mesh );
		}

		var extrudeSettings = {
			amount : 0,
			steps : 1,
			bevelEnabled: false,
			curveSegments: 10*this.size
		};
		
		/* Line */
		if(this.size!=1){
			var shape = new THREE.Shape();
			shape.moveTo(0, w/2-0.4);
			shape.quadraticCurveTo(this.size*w-w/2+0.4, 0+w/2-0.4, this.size*w-w/2+0.4, this.size*w);
			shape.lineTo((this.size-1)*w+w/2-0.4,(this.size)*w);
			shape.quadraticCurveTo((this.size-1)*w+w/2-0.4, w-w/2+0.4, 0,w-w/2+0.4);
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
			var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color:0xffffff }));
			mesh.position.z+=0.01
			curve.add( mesh );
		}

		/* ground */
		var shape = new THREE.Shape();
		shape.moveTo(0, 0);
		shape.quadraticCurveTo(this.size*w, 0, this.size*w, this.size*w);
		shape.lineTo((this.size-1)*w,(this.size)*w);
		shape.quadraticCurveTo((this.size-1)*w, w, 0,w);           

		

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color:0x222222 }));
		curve.add( mesh );


		curve.rotation.x-=THREE.Math.degToRad(90)
		curve.name = 'curve'+this.from.x+','+this.from.y+','+this.from.z
		//curve.name="TEST"
		curve.position.z+=w/2+0.5

		if(this.side=='r'){
			curve.position.z+=(this.size-1)*w-0.5+w/2
			curve.position.x+=-(this.size-1)*w+0.5-w/2
			let c = new THREE.Object3D();
			c.name = 'curveR'+this.from.x+','+this.from.y+','+this.from.z
			c.add(curve)
			c.rotation.y+=THREE.Math.degToRad(90);
			c.position.z+=+this.size*w/2
			c.position.x+=+this.size*w/2
			scene.add(c)
		}

		//scene.add(curve)
		//scene.getObjectByName( 'curve'+this.from.x+','+this.from.y+','+this.from.z).position.set(this.from.x,this.from.y,this.from.z);


		let t = new THREE.Object3D();
		t.name = 'curveT'+this.from.x+','+this.from.y+','+this.from.z
		t.add(curve)

		

		scene.add(t)
		//t.rotation.y-=THREE.Math.degToRad(90)
		
		t.rotation.y+=(this.align).mod(4)*THREE.Math.degToRad(90)

		scene.getChildByName( 'curveT'+this.from.x+','+this.from.y+','+this.from.z).position.set(this.from.x,this.from.y,this.from.z);


	}
	

  }