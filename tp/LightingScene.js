var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();

	this.initLights();

	this.gl.clearColor(0.0, 0.0, 1, 0.7);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

	this.axis = new CGFaxis(this);

	this.light1=true; this.light2=true; this.light3=true; this.speed=1;
	this.clock_pause = false;
	this.sound_pause = false;
	this.currSubmarineAppearance = 0;

	// Scene elements
	this.submarine = new MySubmarine(this,8,0,7.5,180*Math.PI/180);
	this.plane = new Plane(this);
	this.pole = new MyCylinder(this,8,7);
	this.clock = new MyClock(this,12,1);
	this.fishes = [];
	this.fishes.push(new MyFish(this,-2,3));
	this.fishes.push(new MyFish(this,-2.5,2));
	this.fishes.push(new MyFish(this,-1,1));
	this.fishes.push(new MyFish(this,-1.5,4));
	this.fishes.push(new MyFish(this,-3,2.5));

	// Materials
	this.materialDefault = new CGFappearance(this);

	this.oceanAppearance = new CGFappearance(this);
	this.oceanAppearance.loadTexture("../resources/images/ocean.jpg");
	this.oceanAppearance.setTextureWrap('REPEAT','REPEAT');

	
	this.bubbleTexture = new CGFappearance(this);
	this.bubbleTexture.loadTexture("../resources/images/bubble1.png");
	this.bubbleTexture.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');

	//Sharks
	this.sharks = [];
	this.sharks.push(new MyShark(this, -10,10,-20,1));
	this.sharks.push(new MyShark(this, 5,2,-30,2));
	this.sharks.push(new MyShark(this, 15,6,-40,3));
	//Submarine textures
	this.submarineAppearanceList = ['metal','wood','wool','camo','w95'];
	
	//Targets
	this.targets = [];
	this.targIndice = 0;
	this.targets.push(new MyTarget(this, 5,0.5,15));
	this.targets[0].indice = this.targIndice;
	this.targIndice += 1;
	this.targets.push(new MyTarget(this, 0.5,0.5,0.5));
	this.targets[1].indice = this.targIndice;
	this.targIndice += 1;
	this.targtorpRatio = 2;

	this.audio = new Audio();
	this.audio.src = "../resources/images/music.mp3";
	this.audio.loop = true;
	this.audio.volume = 0.05;
	

	this.enableTextures(true);
	this.setUpdatePeriod(1/60*100);
};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(0,0,0,0);
	
	// Positions for four lights
	this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[0].setVisible(true); // show marker on light position (different from enabled)
	
	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[1].setVisible(true); // show marker on light position (different from enabled)

	this.lights[2].setPosition(10,8,10,1);
	this.lights[2].setVisible(true);

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 0, 1.0);
	this.lights[0].enable();  

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();
	this.lights[2].setAmbient(0,0,0,1);
	this.lights[2].setDiffuse(1.0,1.0,1.0,1.0);
	this.lights[2].setSpecular(1,1,1,1);
	this.lights[2].enable();
};

LightingScene.prototype.updateLights = function() {
	if(this.light1 == true)
		this.lights[0].enable();
	else
		this.lights[0].disable();
	
	if(this.light2 == true)
		this.lights[1].enable();
	else
		this.lights[1].disable();
	
	if(this.light3 == true)
		this.lights[2].enable();
	else
		this.lights[2].disable();

	for (i = 0; i < this.lights.length; i++){
		this.lights[i].update();
	}
}

LightingScene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	this.materialDefault.apply();

	// ---- END Background, camera and axis setup

	// ---- BEGIN Primitive drawing section

	//ocean floor
	this.pushMatrix();
		this.translate(7.5, 0, 7.5);
		this.oceanAppearance.apply();
		this.rotate(-90 * degToRad, 1, 0, 0);
		this.scale(50, 50, 0.2);
		this.plane.display();
		this.materialDefault.apply();
	this.popMatrix();

	//clock pole
	this.pushMatrix();
		this.translate(8,0,0);
		this.rotate(-90*degToRad,1,0,0);
		this.scale(0.2,0.2,4.1);
		this.pole.display();
	this.popMatrix();

	//clock
	this.pushMatrix();
		this.translate(8,5,0);
		this.scale(1,1,0.2);
		this.materialDefault.apply();
		this.clock.display();
	this.popMatrix();

	//targets
	for(var i = 0; i < this.targets.length; i++){
		if(this.targets[i].show === true)
			this.targets[i].display();
	}
	
	//fishes
	for(var i = 0; i < this.fishes.length; i++){
		this.fishes[i].display();
	}

	//sharks
	for(var i = 0; i < this.sharks.length; i++){
		this.sharks[i].display();
	}
	
	//ocean sound 
	if(this.sound_pause === false){
		this.audio.play();
	}
	else{
		this.audio.pause();
	}
	
	//submarine
	this.pushMatrix();
		this.submarine.display();
	this.popMatrix();
};

LightingScene.prototype.generateTargets = function() {
	var x = Math.floor(Math.random()*20);
	var y = Math.floor(Math.random()*20+1);
	var z = Math.floor(Math.random()*20);
	var targettmp = new MyTarget(this,x,y,z);
	this.targets.push(targettmp);
	this.targets[this.targets.length -1].indice = this.targIndice;
	this.targtorpRatio += 1;
	this.targIndice += 1;
}

LightingScene.prototype.update = function(currTime){

	if(this.currSubmarineAppearance == 'metal'){
		this.submarine.textIndex = 0;
	}
	else if(this.currSubmarineAppearance == 'wood'){
		this.submarine.textIndex = 1;
	}
	else if(this.currSubmarineAppearance == 'wool'){
		this.submarine.textIndex = 2;
	}
	else if(this.currSubmarineAppearance == 'camo'){
		this.submarine.textIndex = 3;
	}
	else if(this.currSubmarineAppearance == 'w95'){
		this.submarine.textIndex = 4;
	}	
		
	this.clock.update(currTime);
	this.submarine.update(currTime);	

	for(var i = 0; i < this.fishes.length; i++){
		this.fishes[i].update(currTime);
	}
	
	for(var i = 0; i < this.sharks.length; i++){
		this.sharks[i].update(currTime);
	}
}