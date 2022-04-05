//Teris Game, created by MiaoChen Zhang date:Feb,02,2019
//for CMPT 361 (Computer Graphics) Assignment 1


// Global variables

var canvas;
var gl;

var program;
var vBuffer;

var numberOfSquares = 0; 	//to keep track of number of squares(vertices) in the frame.
var currentObjectType =  Math.floor((Math.random() * 7)+0 );  // total of 7 objects, select random between 0-6;
var currentObjectX;			// to keep track of the center coordinates of current falling object
var currentObjectY;
var currentObjectVertices = object(0,currentObjectX,currentObjectY);	//all vertex positions of current falling object

var currntObjectRotation = 0;	//keep track of current object rotation state, (0-3);

var currentLeftBlocked = false;		//boolean values to indicate if current falling object can perform certain actions
var currentRightBlocked = false;
var currentDownBlocked = false;
var currentRotationBlocked = false;
var spawnBlocked = false;
var eventLanded = false;


var landedVertices = [];		//keep track of all the landed objects and color data;
var landedColor = [];


// Getting the keyboard input
window.addEventListener("keydown", getKey, false);

function getKey(key) {
	collisionCheck();
	switch (key.key) {
		case 'ArrowLeft': 
			//if can move left, move left;
			if(!currentLeftBlocked)
			{currentObjectX -= 1;}
			currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
			break;
		case 'ArrowUp': // ’up’ key
			//if can rotate, rotate;

			if(!currentRotationBlocked)
			{
				currntObjectRotation += 1;
			}
			currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
			collisionCheck();
			break;
		case 'ArrowRight': // ’right’ key
			if(!currentRightBlocked){currentObjectX += 1;}
			currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
			break;
		case 'ArrowDown': // ’down’ key
			collisionCheck();
			if(!currentDownBlocked){currentObjectY += 1;}
			currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
			break;	
		case 'r':
		
			landedVertices = [];
			numberOfSquares = 0;
			landedColor = [];
			spawnObject();
			drawobject;
			break;
		case 'q':
			window.close();
			break;
			
	}
	
	
}

// for drawing background matrix
var matrixVertices = [
	
	vec2( 1* (2/10) - 1, 1),
	vec2( 1* (2/10) - 1, -1),
	vec2( 2* (2/10) - 1, 1),
	vec2( 2* (2/10) - 1, -1),
	vec2( 3* (2/10) - 1, 1),
	vec2( 3* (2/10) - 1, -1),
	vec2( 4* (2/10) - 1, 1),
	vec2( 4* (2/10) - 1, -1),
	vec2( 5* (2/10) - 1, 1),
	vec2( 5* (2/10) - 1, -1),
	vec2( 6* (2/10) - 1, 1),
	vec2( 6* (2/10) - 1, -1),
	vec2( 7* (2/10) - 1, 1),
	vec2( 7* (2/10) - 1, -1),
	vec2( 8* (2/10) - 1, 1),
	vec2( 8* (2/10) - 1, -1),
	vec2( 9* (2/10) - 1, 1),
	vec2( 9* (2/10) - 1, -1),
	
	vec2(-1, 1* (2/20) - 1),
	vec2(1, 1* (2/20) - 1),
	vec2(-1, 2* (2/20) - 1),
	vec2(1, 2* (2/20) - 1),
	vec2(-1, 3* (2/20) - 1),
	vec2(1, 3* (2/20) - 1),
	vec2(-1, 4* (2/20) - 1),
	vec2(1, 4* (2/20) - 1),
	vec2(-1, 5* (2/20) - 1),
	vec2(1, 5* (2/20) - 1),
	vec2(-1, 6* (2/20) - 1),
	vec2(1, 6* (2/20) - 1),
	vec2(-1, 7* (2/20) - 1),
	vec2(1, 7* (2/20) - 1),
	vec2(-1, 8* (2/20) - 1),
	vec2(1, 8* (2/20) - 1),
	vec2(-1, 9* (2/20) - 1),
	vec2(1, 9* (2/20) - 1),
	vec2(-1, 10* (2/20) - 1),
	vec2(1, 10* (2/20) - 1),
	vec2(-1, 11* (2/20) - 1),
	vec2(1, 11* (2/20) - 1),
	vec2(-1, 12* (2/20) - 1),
	vec2(1, 12* (2/20) - 1),
	vec2(-1, 13* (2/20) - 1),
	vec2(1, 13* (2/20) - 1),
	vec2(-1, 14* (2/20) - 1),
	vec2(1, 14* (2/20) - 1),
	vec2(-1, 15* (2/20) - 1),
	vec2(1, 15* (2/20) - 1),
	vec2(-1, 16* (2/20) - 1),
	vec2(1, 16* (2/20) - 1),
	vec2(-1, 17* (2/20) - 1),
	vec2(1, 17* (2/20) - 1),
	vec2(-1, 18* (2/20) - 1),
	vec2(1, 18* (2/20) - 1),
	vec2(-1, 19* (2/20) - 1),
	vec2(1, 19* (2/20) - 1)

];

//for keep track of object positions in order to check collision between object
//origin at top left, x goes from (0-9), y (0-19)
var objectMatrix = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
]


//return current object's color according to its type
function objectColor(type){
	var color;
	switch(type){
		case 0:
			color = vec4(1,0,0,0.7);
			break;
		case 1:
			color = vec4(1,0.5,0,0.7);
			break;
		case 2:
			color = vec4(1,1,0,0.7);
			break;
		case 3:
			color = vec4(0,1,0,0.7);
			break;
		case 4:
			color = vec4(0,0.6,1,0.7);
			break;
		case 5:
			color = vec4(0.8,0,1,0.7);
			break;
		case 6:
			color = vec4(1,0,0.5,0.7);
			break;

	}
	return color;
}



//return 26 vertex of current falling object, and if xy-flag is set to 1; function will return xy coordinates with respect to object Matrix
function object(type,x,y,xyflag = 0){
	// if xy flag == 1 return coordinates
	var vetex;
	switch (type){
		case 0:
			currntObjectRotation = 0;
			vertex = squareRotate(x-1,y-1,x,y,xyflag).concat(squareRotate(x , y-1,x,y,xyflag)).concat(squareRotate(x-1,y,x,y,xyflag)).concat(squareRotate(x,y,x,y,xyflag));
			break;
		case 1:
			currntObjectRotation = currntObjectRotation%2;
			vertex = squareRotate(x-2, y,x,y,xyflag).concat(squareRotate(x-1, y,x,y,xyflag)).concat(squareRotate(x, y,x,y,xyflag)).concat(squareRotate(x+1,y,x,y,xyflag));
			break;
		case 2:
			currntObjectRotation = currntObjectRotation%2;
			vertex = squareRotate(x, y,x,y-1,xyflag).concat(squareRotate(x+1, y,x,y-1,xyflag)).concat(squareRotate(x,y-1,x,y-1,xyflag)).concat(squareRotate(x-1,y-1,x,y-1,xyflag));
			break
		case 3:
			currntObjectRotation = currntObjectRotation%2;
			vertex = squareRotate(x-1, y,x,y-1,xyflag).concat(squareRotate(x, y,x,y-1,xyflag)).concat(squareRotate(x, y-1,x,y-1,xyflag)).concat(squareRotate(x+1,y-1,x,y-1,xyflag));
			break;
		case 4:
			vertex = squareRotate(x-1, y+1,x,y,xyflag).concat(squareRotate(x-1, y,x,y,xyflag)).concat(squareRotate(x, y,x,y,xyflag)).concat(squareRotate(x+1,y,x,y,xyflag));
			break;
		case 5:
			vertex = squareRotate(x-1, y-1,x,y,xyflag).concat(squareRotate(x-1, y,x,y,xyflag)).concat(squareRotate(x, y,x,y,xyflag)).concat(squareRotate(x+1,y,x,y,xyflag));
			break;
		case 6:
			vertex = squareRotate(x-1, y,x,y,xyflag).concat(squareRotate(x, y,x,y,xyflag)).concat(squareRotate(x, y+1,x,y,xyflag)).concat(squareRotate(x+1,y,x,y,xyflag));
			break;
			
	};
	return vertex; //or x y coordinates if xyflag ==1
} 


//calculate vertex positions of each square of the current falling object relative to its center position and rotation state;
function squareRotate(x,y,centerX,centerY, flag){
	var vertex;

	//calculate after rotation positions
	var angle = currntObjectRotation * (-Math.PI / 2);
	x -= centerX;
	y -= centerY;
	var newX = ( x * Math.cos( angle ) - y * Math.sin( angle ) ) + centerX;
	var newY = ( x * Math.sin(angle ) + y * Math.cos( angle ) ) + centerY;
	x = Math.round( newX );
	y = Math.round( newY );
	
	//flag value inherited from function object, if 1, return coordinates with respect to objectMatrix
	if(flag != 0){
		return [vec2(x,y)];
	}else{
		vertex = [
		//two triangles to form one square;
		vec2( (newX + 0)* (2/10) - 1, (-newY -1 + 0)* (2/20) + 1),
		vec2( (newX + 1)* (2/10) - 1, (-newY -1 + 0)* (2/20) + 1),
		vec2( (newX + 0)* (2/10) - 1, (-newY -1 + 1)* (2/20) + 1),
		
		vec2( (newX + 1)* (2/10) - 1, (-newY -1 + 0)* (2/20) + 1),
		vec2( (newX + 0)* (2/10) - 1, (-newY -1 + 1)* (2/20) + 1),
		vec2( (newX + 1)* (2/10) - 1, (-newY -1 + 1)* (2/20) + 1)
		];
		
		return vertex;
	}
}

//reset initial object parameters to spawn new object;
function spawnObject(){
	currentObjectY = -1;
	currentObjectX = Math.floor((Math.random() * 7)+2);;;
	currentObjectType = Math.floor((Math.random() * 700)%7);
	currntObjectRotation = Math.floor((Math.random() * 400)%4);;
	currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
	numberOfSquares +=4;
	currentLeftBlocked = false;
	currentRightBlocked = false;
	currentDownBlocked = false;
	currentRotationBlocked = false;
	eventLanded = false;

}


//check if any row is filled, and if filled, clear row, and have whatever on top falls down.
function checkRowFilled(){
	var sum;
	for(y=19;y>=0;y--){ 	//begin looking from the bottom, and look up
		sum = 0;
		for(x=9;x>=0;x--){
			sum += objectMatrix[y][x];
		}
		if(sum == 10){ 	// row filled
		
			for(i=0;i<10;i++){
				objectMatrix[y][i] = 0;		// clear the object matrix in this row.
			}
			clearRow(y);			// call functions to handle vertex deleting
		}
			
	}
}

function clearRow(y){
	var temp;
	var vertex
	for(x=0;x<9;x++){
		// vertex of a square in row Y
		vertex = [
			vec2( (x + 0)* (2/10) - 1, (-y -1 + 0)* (2/20) + 1),
			vec2( (x + 1)* (2/10) - 1, (-y -1 + 0)* (2/20) + 1),
			vec2( (x + 0)* (2/10) - 1, (-y -1 + 1)* (2/20) + 1),
			
			vec2( (x + 1)* (2/10) - 1, (-y -1 + 0)* (2/20) + 1),
			vec2( (x + 0)* (2/10) - 1, (-y -1 + 1)* (2/20) + 1),
			vec2( (x + 1)* (2/10) - 1, (-y -1 + 1)* (2/20) + 1)
		];
		
		var k =0;
		
		
		while( k< numberOfSquares * 6){
			temp= [];
			//landedVertices[i] = vec2(x,y), continuous 6 vec2 forms an square, 
			for(i=k;i<k+6;i++){
				temp = temp.concat(landedVertices[i]);
			}
			
			//check for square in this row and delete them;
			if (vertexEqual(temp,vertex)){
				landedVertices.splice(k,6);
				landedColor.splice(k,6);
				numberOfSquares -=1;
			}
			k+=6;
		}
	}
	fillBottomBy(y); //call function to let upper object to fill up the space

}

function fillBottomBy(rowY){   //let upper object to fill up the space of just cleared row
	//modify vertex of squares upper of deleted row
	for(k = 0; k<numberOfSquares * 6;k++){
		if (landedVertices[k][1] >= ((-rowY -1)* (2/20) + 1)){
			landedVertices[k][1] -= 0.1;
		}
	}
	//modify objectMatrix
	for(y=rowY;y>0;y--){ //begin with the cleared coloum and up;
		for(x=9;x>=0;x--){
			if (objectMatrix[y-1][x] == 1){
				objectMatrix[y][x] = 1;
				objectMatrix[y-1][x] = 0;
			}
		}
	}
	
}

function vertexEqual(arr1,arr2){ //return true if two vertex array are equal
	for(k = 0; k< 6;k++){
		if( arr1[k][0] != arr2[k][0] || arr1[k][1] != arr2[k][1]){ 
			return false;
		}
	}
	return true;
}

// function to be called up on an object lands
function landed(){

	var cord = object(currentObjectType,currentObjectX,currentObjectY,1); //xy flag is set to 1, which will return the coordinates of current squares

	// add object that just lands to the landed object array
	landedVertices = landedVertices.concat(currentObjectVertices);
	var c = [];
	// same for the color
	for(i=0;i<24;i++){
		c = c.concat(objectColor(currentObjectType));
	}
	landedColor = landedColor.concat(c);
	
	// update object matrix
	for(i=0;i<4;i++){
			objectMatrix[cord[i][1]][cord[i][0]] = 1;
		
	}
	currentLeftBlocked = true;
	currentRightBlocked = true;
	currentDownBlocked = true;
	currentRotationBlocked = true;

	// check if row is filled and if need to perform any actions.
	checkRowFilled();
	eventLanded = true;  //signal for draw functions that it is okay to spawn new object


}


//collision handler, checks if current falling object can perform certain moving actions
function collisionCheck(){
	var cord = object(currentObjectType,currentObjectX,currentObjectY,1);
	var x;
	var y;
	currentLeftBlocked = false;
	currentRightBlocked = false;
	currentDownBlocked = false;
	currentRotationBlocked = false;
	for(i=0;i<4;i++){   // four corners for a square
		x = cord[i][0];
		y = cord[i][1];
		
		
		if (x <= 0) {	//frame boundary
			currentLeftBlocked = true;
		}
		else if(y>=0){  // collision between object
			if( objectMatrix[y][x-1] == 1){
				currentLeftBlocked = true;
			}
		}
		
		if (x >= 9){
			currentRightBlocked = true;
		}
		else if(y>=0){
			if( objectMatrix[y][x+1] == 1){
				currentRightBlocked = true;
			}
		}
		
		if (y >= 19){
			currentDownBlocked = true;
		}
		else if(y>=0){
			if( objectMatrix[y+1][x] == 1){
				currentDownBlocked = true;
			}
			if( objectMatrix[0][5] == 1 || objectMatrix[0][4] == 1 ||objectMatrix[0][6] == 1){ // check if spawn spot is blocked
				spawnBlocked = true;
			}
		}
		
		//Rotation blocked check
		if (currentObjectType == 1){ // special case for object type 1
			if(currentObjectX - 2 <0){
				currentRotationBlocked = true;
			}
			if(currentObjectX + 1 >9){
				currentRotationBlocked = true;
			}
			if(currentObjectY + 2 >19){
				currentRotationBlocked = true;
			}
		}else{
			
			if(currentObjectX - 1 <0){
				currentRotationBlocked = true;
			}
			if(currentObjectX + 1 >9){
				currentRotationBlocked = true;
			}
			if(currentObjectY + 1 >19){
				currentRotationBlocked = true;
			}
		}
			
	}
}



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	//
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	spawnObject();
	drawMatrix();
	drawobject();
	
	//gravity simulation
	setInterval(function(){
	if(!currentDownBlocked ){
		currentObjectY += 1;
		currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
		collisionCheck();
	}else if (spawnBlocked){
		alert('game over');
	}
	else{ //if object lands;
		landed();
	}

	},1000); // 1sec

};


//draw the background matrix
function drawMatrix(){
	
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(matrixVertices), gl.STATIC_DRAW );  
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );  
	
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 16 * 56, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	for(i=0;i<56;i++){
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	t = vec4(0.1,0.1,0.1,0.6);
	gl.bufferSubData(gl.ARRAY_BUFFER, 16*i, flatten(t));
	}
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.LINES,0,56);
	

	window.requestAnimFrame(drawMatrix);
}



//draw the current object
function drawobject(){
	
	if(eventLanded){ // spawn new object upon current falling object completes landing
		gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
		
        var ver = landedVertices;
        gl.bufferSubData(gl.ARRAY_BUFFER, numberOfSquares*16*6, flatten(ver));
		
		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
		var t = landedColor;
		gl.bufferSubData(gl.ARRAY_BUFFER, 16*numberOfSquares*6, flatten(t));
		spawnObject();

	}
	else{	// object in air
		currentObjectVertices = object(currentObjectType,currentObjectX,currentObjectY);
		vertices = currentObjectVertices.concat(landedVertices);
		
		var t = [];
		var color = objectColor(currentObjectType);
		for(i=0;i<24;i++){
			t = t.concat(color);
		}
		t = t.concat(landedColor);
	}
	collisionCheck();

	//console.log(objectMatrix);
	//document.getElementById("debug").innerHTML = objectMatrix;
	

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );	
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(t), gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	gl.drawArrays(gl.TRIANGLES,0,numberOfSquares*6);
	window.requestAnimFrame(drawobject);
}


