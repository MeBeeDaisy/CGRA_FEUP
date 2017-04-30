/* MySubmarine*/
var degToRad = Math.PI / 180.0;

function MySubmarine(scene,x,y,z,angle) {
	CGFobject.call(this,scene);
	this.x = x;
	this.y = y;
	this.z = z;
	this.angle = Math.PI;
	this.w = false;
	this.a = false;
	this.s = false;
	this.d = false;
	this.cylinderBody = new MyCylinder(this.scene,8,7);
	this.frontBumper = new MyLamp(this.scene, 8,7);
	this.rearBumper = new MyLamp(this.scene, 8,7);
	this.cylinderTower = new MyCylinder(this.scene, 8,7);
	this.towerTop = new MyCircle(this.scene,8);
	this.periscopePole = new MyCylinder(this.scene,8,7);
	this.periscopeTop = new MyCylinder(this.scene,8,7);
	this.periscopeGlass = new MyCircle(this.scene,8);
	this.periscopeBack = new MyCircle(this.scene,8);
	this.vertBarb = new MyTrap(this.scene);
	this.horBarb = new MyTrap(this.scene);
	this.rightHel = new MyCylinder(this.scene,8,7);
	this.insideHel = new MyCylinderInside(this.scene,8,7);
	this.initBuffers();
};

MySubmarine.prototype = Object.create(CGFobject.prototype);
MySubmarine.prototype.constructor=MySubmarine;

MySubmarine.prototype.display = function () {
	
	this.scene.pushMatrix();
		this.scene.scale(0.73,1,4.08);
		this.cylinderBody.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.rotate(180*degToRad,0,1,0);
    	this.scene.scale(0.73,1,1/*0.46*/);
		this.frontBumper.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,0,4.08);
    	this.scene.scale(0.73,1,1/*0.46*/);
		this.rearBumper.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,1.57,1.8);
    	this.scene.scale(0.5,1,0.88);
    	this.scene.rotate(90*degToRad,1,0,0);
		this.cylinderTower.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,1.57,1.8);
    	this.scene.scale(0.5,1,0.88);
    	this.scene.rotate(-90*degToRad,1,0,0);
		this.towerTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,2.57,1.4);
    	this.scene.scale(0.05,1,0.05);
    	this.scene.rotate(90*degToRad,1,0,0);
    	this.periscopePole.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,2.57,1.25);
    	this.scene.scale(0.05,0.05,0.2);
		this.periscopeTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,2.57,1.25);
    	this.scene.scale(0.05,0.05,0.05);
    	this.scene.rotate(180*degToRad,0,1,0);
		this.periscopeGlass.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,2.57,1.45);
    	this.scene.scale(0.05,0.05,0.05);
		this.periscopeBack.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    	this.scene.translate(0,1.5,4.6);
    	this.scene.scale(0.1,3,0.4);
    	this.scene.rotate(90*degToRad,1,0,0);
    	this.scene.rotate(45*degToRad,0,0,1);
    	this.vertBarb.display();
    this.scene.popMatrix();

    /*this.scene.pushMatrix();
    	this.scene.translate(0,1.5,4.6);
    	this.scene.scale(0.1,3,0.4);
    	this.scene.rotate(90*degToRad,0,0,1);
		this.horBarb.display();
    this.scene.popMatrix();*/

    this.scene.pushMatrix();
    	this.scene.translate(1,0,4.3);
    	this.scene.scale(0.4,0.4,0.4);
		this.rightHel.display();
		this.insideHel.display();
    this.scene.popMatrix();
    	
};


MySubmarine.prototype.update = function() {
    if(this.a === true){
       this.angle += 5*Math.PI/180;
    }
    if(this.d === true){
        this.angle -= 5*Math.PI/180;
    }
    if(this.w === true){
        this.x += 0.25*Math.sin(this.angle);
        this.z += 0.25*Math.cos(this.angle);
    }
    if(this.s === true){
        this.x -= 0.25*Math.sin(this.angle);
        this.z -= 0.25*Math.cos(this.angle);
    }
}