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
		if(shape=='linear' || shape=='cp' || shape=='tunnel' || shape=='boost'){

			this.to = param2;
		}
		if(shape == 'cp'){
			this.to = param2[0];
			this.number = param2[1]
		}
		if(shape=='intersect'){
			this.open = param2 ;
		}
		if(shape=='curve'){
			this.size = param2[0];
			this.align = param2[1];
			this.side = param2[2]
		}
		if(shape=='bezier'){
			this.from = param1;
			this.align = param2[0];
			this.length = parseInt(param2[1])
			this.diff = parseInt(param2[2])
		}
		 	
	}


    render_r (){
        let road = new THREE.Group();
        const w = W_ROAD;
    
        let x = this.from.x
        let y = this.from.y
		let length = this.from.distanceTo(this.to)

	
        /* side */ 
        var geometry = new THREE.BoxGeometry( 1, 1, length )
        var material = new THREE.MeshPhongMaterial({ color: CLR_SIDE });
		let side = new THREE.Mesh(geometry , material)
		side.position.x-=w/2
		side.position.y+=0.5
        road.attach(side)
    
        let side2 = new THREE.Mesh(geometry , material);
		side2.position.x+=w/2
		side2.position.y+=0.5
		road.add(side2)

		collidable.push(side)
		collidable.push(side2)
		
    
        /* ground */
        geometry = new THREE.PlaneGeometry( w, length )
        material = new THREE.MeshPhongMaterial({ color:CLR_GROUND});
		let ground = new THREE.Mesh(geometry , material)

		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)
		
		/** line */
		geometry = new THREE.PlaneGeometry( 0.8, 6 )
        material = new THREE.MeshPhongMaterial({ color: CLR_LINE});
        for(let i=0;i<length-5;i+=10){
            let ground = new THREE.Mesh(geometry , material)
            ground.position.y+=0.01
            ground.position.z+=i-length/2+6
            ground.rotation.x= THREE.Math.degToRad(-90);
            road.add(ground)
		}
		
		if(this.shape == 'tunnel'){
			var geometry = new THREE.CylinderGeometry( w/2, w/2, length, 8, 1, true, Math.PI, Math.PI );
			var material = new THREE.MeshPhongMaterial( {color: 0x333333,side:THREE.DoubleSide} );
			var cylinder = new THREE.Mesh( geometry, material );

			cylinder.rotation.z= THREE.Math.degToRad(-90);
			cylinder.rotation.y= THREE.Math.degToRad(-90);
			//cylinder.lookAt(this.to)
			road.add( cylinder );

		}
    
        road.position.set(x,0,y)
		//road.applyMatrix( new THREE.Matrix4().makeTranslation( (this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 ) );
		road.position.set((this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 )
		road.name="road"+this.from.toArray().toString();

		road.lookAt(this.to.x,this.to.y,this.to.z)
		//road.castShadow = true;
		road.receiveShadow = true;
		scene.add(road)
		AABB_road.push(new THREE.Box3().setFromObject(road))
		//scene.add(lampadaire((this.to.x+this.from.x)/2-10, (this.to.z+this.from.z)/2-10));
		
	}

	render_boost (){
        let road = new THREE.Group();
        const w = W_ROAD;
    
        let x = this.from.x
        let y = this.from.y
		let length = this.from.distanceTo(this.to)
	
        /* side */ 
		var geometry = new THREE.BoxGeometry( 1, 1, length )
        var material = new THREE.MeshPhongMaterial({ color: CLR_SIDE });
		let side = new THREE.Mesh(geometry , material)
		side.position.x-=w/2
		side.position.y+=0.5
        road.attach(side)
    
        let side2 = new THREE.Mesh(geometry , material);
		side2.position.x+=w/2
		side2.position.y+=0.5
		road.add(side2)

		collidable.push(side)
		collidable.push(side2)
    
        /* ground */
		geometry = new THREE.PlaneGeometry( w, length,length/2,length/5 )
		geometry.faces.forEach( (f,i) => {
			if(i%8==0) f.color.set( 0xffff00)
			else f.color.set( CLR_GROUND)
		} )
        material = new THREE.MeshPhongMaterial({ color:CLR_LINE ,  vertexColors: THREE.VertexColors,});
		let ground = new THREE.Mesh(geometry , material)

		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)
    
        road.position.set(x,0,y)
		//road.applyMatrix( new THREE.Matrix4().makeTranslation( (this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 ) );
		road.position.set((this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 )
		road.name="road"+this.from.toArray().toString();

		road.lookAt(this.to.x,this.to.y,this.to.z)
		//road.castShadow = true;
		road.receiveShadow = true;
		scene.add(road)
		AABB_road.push(new THREE.Box3().setFromObject(road))
		
	}

	render_cp (){
		
        let road = new THREE.Object3D();
		const w = W_ROAD;

		let x = this.from.x
        let y = this.from.y
		let length = this.from.distanceTo(this.to)
		
		/**
		 * box sur le coté
		 */
		let P = new THREE.Object3D();
		var geometry = new THREE.BoxGeometry( 0.8, 8, 0.8 )
        var material = new THREE.MeshPhongMaterial({ color: CLR_SIDE });
		let pan = new THREE.Mesh(geometry , material)
		
		pan.position.y+=4+0.1
		
		let pan2 = pan.clone()
		pan.position.x-=w/2
		pan2.position.x+=w/2

		var geometry = new THREE.BoxGeometry( w, 1, 0.8 )
        var material = new THREE.MeshPhongMaterial({ color: CLR_SIDE });
		let pan_up = new THREE.Mesh(geometry , material)
		pan_up.position.y=8-0.4

		road.add(pan)
		road.add(pan2)
		road.add(pan_up)

        /* side */ 
        var geometry = new THREE.BoxGeometry( 1, 1, length )
        var material = new THREE.MeshPhongMaterial({ color: CLR_SIDE });
		let side = new THREE.Mesh(geometry , material)
		side.position.x-=w/2
		side.position.y+=0.5
        road.add(side)
    
        let side2 = new THREE.Mesh(geometry , material);
		side2.position.x+=w/2
		side2.position.y+=0.5
		road.add(side2)
		
		collidable.push(side)
		collidable.push(side2)
    
		/* ground */
		geometry = new THREE.PlaneGeometry( w, length )

		let clr_ground = this.number ? CLR_GROUND : 0xff0000 
        material = new THREE.MeshPhongMaterial({ color : clr_ground});
		let ground = new THREE.Mesh(geometry , material)

		ground.rotation.x= THREE.Math.degToRad(-90);
		road.add(ground)
    
        road.position.set(x,0,y)
		//road.applyMatrix( new THREE.Matrix4().makeTranslation( (this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 ) );
		road.position.set((this.to.x+this.from.x)/2, (this.to.y+this.from.y)/2, (this.to.z+this.from.z)/2 )
		road.name="cp"+this.from.toArray().toString()

		road.lookAt(this.to.x,this.to.y,this.to.z)
		scene.add(road)
		AABB_road.push(new THREE.Box3().setFromObject(road))
		
	}
	
	
	render_i(){
		let road = new THREE.Object3D();
		const w = 12;

		this.open.forEach( (element,index) => {
			let side,geometry,material,line;
			if(element){
				geometry = new THREE.BoxGeometry( 1, 1, w )
				material = new THREE.MeshPhongMaterial({ color: CLR_SIDE });
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
		let material = new THREE.MeshPhongMaterial({ color: CLR_GROUND , side:THREE.DoubleSide});
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
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color:CLR_SIDE }));
		curve.add( mesh );
	
		
		collidable.push(mesh)

		/* inner */ 
		if(this.size!=1){
			var shape = new THREE.Shape();
			shape.moveTo(0, w);
			shape.quadraticCurveTo((this.size-1)*w, w, (this.size-1)*w,(this.size)*w);
			shape.lineTo((this.size-1)*w-1,(this.size)*w);
			shape.quadraticCurveTo((this.size-1)*w-1,w+1,0,w+1);
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
			var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color:CLR_SIDE }));
	
	
			curve.add( mesh );
		}
		collidable.push(mesh)

		var extrudeSettings = {
			amount : 0,
			steps : 1,
			bevelEnabled: false,
			curveSegments: 10*this.size
		};
		
		
		/* Line */
		if(this.size!=1){
			var shape = new THREE.Shape();
			shape.moveTo(0, w/2-0.2);
			shape.quadraticCurveTo(this.size*w-w/2+0.2, 0+w/2-0.2, this.size*w-w/2+0.2, this.size*w);
			shape.lineTo((this.size-1)*w+w/2-0.2,(this.size)*w);
			shape.quadraticCurveTo((this.size-1)*w+w/2-0.2, w-w/2+0.2, 0,w-w/2+0.2);
			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
			var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: CLR_LINE }));
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
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: CLR_GROUND }));
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

		//scene.getChildByName( 'curveT'+this.from.x+','+this.from.y+','+this.from.z).position.set(this.from.x,this.from.y,this.from.z);

		t.position.set(this.from.x,this.from.y,this.from.z);
		AABB_road.push(new THREE.Box3().setFromObject(t))
	}

	render_bezier(){
		/**
		 * Bezier Curve
		 */
		let bezier = new THREE.Object3D();


		const w = W_ROAD;

		/*outer  - r */
		var shape = new THREE.Shape();
		shape.moveTo(0,0);
		shape.bezierCurveTo(0,this.length/2,this.diff,this.length/2,this.diff,this.length);
		shape.lineTo(this.diff-1,this.length);
		shape.bezierCurveTo(this.diff-1,this.length/2,-1,this.length/2,-1,0);           

		var extrudeSettings = {
			amount : 1,
			steps : 1,
			bevelEnabled: false,
			curveSegments: this.length
		};

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: CLR_SIDE, }));
		bezier.add( mesh );
		collidable.push(mesh)
	
		let a = mesh.clone()
		a.position.x-=w
		bezier.add(a)
		bezier.position.set(0,0,0)
		collidable.push(a)

		/**
		 * line
		 */
		var extrudeSettings = {
			amount : 0,
			steps : 1,
			bevelEnabled: false,
			curveSegments: this.length
		};
		
		var shape = new THREE.Shape();
		shape.moveTo(0,0);
		shape.bezierCurveTo(0,this.length/2,this.diff,this.length/2,this.diff,this.length);
		shape.lineTo(this.diff-0.8,this.length);
		shape.bezierCurveTo(this.diff-0.8,this.length/2,-0.8,this.length/2,-0.8,0);
		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: CLR_LINE }));
		mesh.position.z+=0.01
		mesh.position.x-=w/2+0.1
		bezier.add( mesh );
		
		/* ground */
		var shape = new THREE.Shape();
		/*shape.moveTo(0, 0);
		shape.bezierCurveTo(this.size*w, 0, this.size*w, this.size*w);
		shape.lineTo((this.size-1)*w,(this.size)*w);
		shape.bezierCurveTo((this.size-1)*w, w, 0,w);   */
		
		shape.moveTo(0,0);
		shape.bezierCurveTo(0,this.length/2,this.diff,this.length/2,this.diff,this.length);
		shape.lineTo(this.diff-w,this.length);
		shape.bezierCurveTo(this.diff-w,this.length/2,-w,this.length/2,-w,0);   

		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({ color: CLR_GROUND }));
		bezier.add( mesh );

		//bezier.rotation.x-=THREE.Math.degToRad(90)
		//bezier.name = 'curve'+this.from.x+','+this.from.y+','+this.from.z

		bezier.position.x+=w/2+0.5

		//scene.add(bezier)
		//scene.getObjectByName( 'bezier'+this.from.x+','+this.from.y+','+this.from.z).position.set(this.from.x,this.from.y,this.from.z);

		let t = new THREE.Object3D();
		//t.name = 'bezierT'+this.from.x+','+this.from.y+','+this.from.z
		t.add(bezier).position.set(this.from.x,this.from.y,this.from.z);

		scene.add(t)
		t.rotation.x-=THREE.Math.degToRad(90)
		t.rotation.z=(this.align-1).mod(4)*THREE.Math.degToRad(90)
		AABB_road.push( new THREE.Box3().setFromObject(t))
		//scene.getChildByName( 'bezierT'+this.from.x+','+this.from.y+','+this.from.z).position.set(this.from.x,this.from.y,this.from.z);
	}
	
  }