
var progressListener = [];

function WP3D(model, options) {

	var self = this;

	self.lastRendered = Date.now();
	self.dirty = false;

	self.setDirty = function() {
		self.dirty = true;
	}


	self.init = function(model, options) {
	    self.stage = document.getElementById(options.id);

	    width = 0;
	    pWidth = options.width;
	    if (pWidth.indexOf('%')==pWidth.length-1) {
	        width = self.stage.offsetWidth * parseInt(pWidth) / 100;
	    } else {
	        width = parseInt(pWidth);
	    }

	    height = 0;
	    pHeight = options.height;
	    if (pHeight.indexOf('%')==pHeight.length-1) {
	    	height = self.stage.offsetHeight * parseInt(pHeight) / 100;
	    } else {
	    	height = parseInt(pHeight);
	    }

	    self.scene = new THREE.Scene();
		window.scene = self.scene;
	    self.camera = new THREE.PerspectiveCamera( options.fov, width / height, 0.1, 1000 );
	    self.camera.position.x = options.camera[0];
	    self.camera.position.y = options.camera[1];
	    self.camera.position.z = options.camera[2];

		self.renderer = new THREE.WebGLRenderer({ alpha: true });
		self.renderer.setSize( width, height );
		self.renderer.setClearColor( options.background, options.opacity);

		var directionalLight = new THREE.DirectionalLight( options.directionalColor, 1 );
		directionalLight.position.set( options.directionalPosition[0], options.directionalPosition[1], options.directionalPosition[2] );
		self.scene.add( directionalLight );

		var light = new THREE.AmbientLight( options.ambient ); // soft white light
		self.scene.add( light );

		self.controls = new THREE.OrbitControls( self.camera, self.stage );
		self.controls.damping = 0.2;
		self.controls.autoRotate = true;
		self.controls.autoRotateSpeed = -4.0;
		self.controls.addEventListener( 'change', self.setDirty.bind(self) );

		if (self.endsWith(model, '.dae'))
			self.loadDAE(model, options);
		else if (self.endsWith(model, '.obj'))
			self.loadOBJ(model, options);
		else if (self.endsWith(model, '.objmtl'))
			self.loadOBJMTL(model, options);
	}

	self.endsWith = function(str, suffix) {
	    return str.toLowerCase().indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1;
	}

	function pausecomp(millis)
	 {
	  var date = new Date();
	  var curDate = null;
	  do { curDate = new Date(); }
	  while(curDate-date < millis);
	}

	self.baseProgress = 0;
	self.totalFiles = 1;
	self.progress = function(file, loaded, total) {
		if (file) {
			self.baseProgress = 100*loaded/total;
			self.totalFiles = total;
		}
		var progress = self.baseProgress;
		if (!file) progress += 100/self.totalFiles*loaded/total;
		console.log("PROGRESS", file, loaded, total, progress);
		var bar = self.stage.querySelector(".bar")
		if (bar)
			bar.style.width = progress+"%";
		if (progress==100) {
			self.stage.innerHTML = "";
			self.stage.appendChild( self.renderer.domElement );
		}
	}

	progressListener.push(self.progress);

	self.fileProgress = function(url, loaded, total) {
		for(i=0; i<progressListener.length; i++)
			progressListener[i](true, loaded, total);
	}

	self.failure = function() {
		self.stage.innerHTML = 'Could not load model.';
		console.log('Could not load model.');
	}

	self.loadDAE = function(model, options) {
		console.log('loading DAE: ' + model);
		var manager = THREE.DefaultLoadingManager;

		manager.onProgress = self.fileProgress;
		manager.onError = self.failure;
		manager.onLoad = function() {
			self.dirty = true;
  		  	console.log('textures loaded');
		};

		var loader = new THREE.ColladaLoader(manager);
		loader.options.convertUpAxis = true;
		var loadScene = self.scene;
		loader.load(model, function ( collada ) {
		  var dae = collada.scene;
		  dae.position.set(options.modelPosition[0],options.modelPosition[1],options.modelPosition[2]);//x,z,y- if you think in blender dimensions ;)
		  dae.scale.set(options.modelScale[0],options.modelScale[1],options.modelScale[2]);

		  loadScene.add(dae);
		  self.dirty = true;
		  console.log('object loaded');
	  }, function(event) {self.progress(false, event.loaded, event.total)});
	}

	self.loadOBJ = function(model, options) {
		console.log('loading OBJ: ' + model);


		var manager = THREE.DefaultLoadingManager;
		manager.onProgress = self.fileProgress;
		manager.onError = self.error;

		onload = function ( object ) {
			object.position.set(options.modelPosition[0],options.modelPosition[1],options.modelPosition[2]);//x,z,y- if you think in blender dimensions ;)
			object.scale.set(options.modelScale[0],options.modelScale[1],options.modelScale[2]);
			loadScene.add( object );
			self.dirty = true;
			console.log('object loaded');
		}

		var loadScene = self.scene;
		if (options.material) {
			var mtlLoader = new THREE.MTLLoader(manager);
			mtlLoader.load(options.material, function( materials ) {

				materials.preload();

				var objLoader = new THREE.OBJLoader(manager);
				objLoader.load( model, onload, function(event) {self.progress(false, event.loaded, event.total)});
			});
		} else {
			var loader = new THREE.OBJLoader(manager);
			loader.load( model, function(event) {self.progress(false, event.loaded, event.total)});
		}

	}

	self.loadOBJMTL = function(model, options) {
		var loader = new THREE.MTLLoader();
		mtl = model.substring(0, model.length-6) + 'mtl';
		console.log('loading OBJMTL:' + model + ", " + mtl);
		var loadScene = self.scene;
		loader.load( model, mtl, function ( object ) {
			object.position.set(options.modelPosition[0],options.modelPosition[1],options.modelPosition[2]);//x,z,y- if you think in blender dimensions ;)
			object.scale.set(options.modelScale[0],options.modelScale[1],options.modelScale[2]);
			loadScene.add( object );
			self.dirty = true;
			console.log('object loaded');
		}, self.progress, self.failure);
	}


	self.loop = 0;
	self.render = function() {
		requestAnimationFrame( self.render.bind(self) );

		self.controls.update();
		self.loop++;
		if (self.loop>1000) {
			self.controls.autoRotateSpeed *= 0.99;
		}
		if (Math.abs(self.controls.autoRotateSpeed) < 0.01) {
			self.controls.autoRotate = false;
		}

	    delta = Date.now() - self.lastRendered;
	    if (self.dirty && delta > 1000/options.fps) {
	    	self.renderer.render( self.scene, self.camera );
	    	self.lastRendered = Date.now();
	    	self.dirty = false;
	    }
	}

	self.init(model, options);
}
