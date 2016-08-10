// JavaScript Document
// credit self:

/* 
*** The following script tags go into the head section of any page on which the carousel will be used, change the options as required
*** Don't touch the rest of the file

<script type="text/javascript">
//Array of ids for slides in order you want to show them
var slides = new Array('slide_01', 'slide_02', 'slide_03', 'slide_04');
//the slide width
var slideWidth = 820;
//Animation Speed Higher Num is faster, lower slower
var animateSpeed = 12;
</script>
<script src="js/carousel.js" type="text/javascript"> </script>
*/

//j because so many people use 'i'
var q = 0;
//Length has to be minus 1 because array keys start at 0
var arrayLength = carouselSlides.length - 1;
//first slide in the array
var currentSlide = carouselSlides[0];

/*** ARROW NEXT FUNCTIONS ***/
function moveNext() {
	//get the next slide so I can feed two ids to the animate function
	getNextSlide(q);
	//Check if animation function is runing and complete it so the next one runs smoothly
	if ( amIrunning == 1 ) {
		//Snap the moving slides to the end and reset the amIrunning var 
		objectOne.style.left = finalXPosOne + "px";
		objectTwo.style.left = finalXPosTwo + "px";
		//set back to null because it's no longer running
		amIrunning = null;
	}
	//Run animation function on current and next slides
	initAnimate(currentSlide, nextSlide, -slideWidth, 0);
	//if the current slide is less than the total amount of slides
	if (q < arrayLength) {
		//increment j by 1 so it = next Slide
		q++;
	}
	//if i is the same as the array length set it back to 0
	else if (q == arrayLength) {
		q = 0;
	}
	//change the current slide variable to the incoming slide
	currentSlide = carouselSlides[q];
}

// Get the next slide ID so two ids can be fed to the animation function
function getNextSlide (n){
	if (n == arrayLength ) {
		n = 0;
	}
	else {
		n++;
	}
	nextSlide = carouselSlides[n];
	//make sure the next slide is in the correct position for animating in
	onDeckRight(nextSlide);
	return;
}

// Positions the next slide immediatly to the right so it's in the correct spot for animation 
function onDeckRight(objectID) {
	var object = document.getElementById(objectID);
	object.style.left = slideWidth + 'px';
	object.style.top = '0px';
}


/*** ARROW PREVIOUS FUNCTIONS ***/
function movePrev() {
	//get the previous slide so I can feed two ids to the animate function
	getPrevSlide(q);
	//Check if animation function is runing and complete it so the next one runs smoothly
	if ( amIrunning == 1 ) {
		//Snap the moving slides to the end and reset the amIrunning var 
		objectOne.style.left = finalXPosOne + "px";
		objectTwo.style.left = finalXPosTwo + "px";
		//set back to null because it's no longer running
		amIrunning = null;
	}
	//Run animation function on current and previous slides
	initAnimate(currentSlide, nextSlide, slideWidth, 0);
	//if we're on the first slide in the array set i to the last slide
	if (q == 0) {
		q = arrayLength;
	}
	//if i is greater than 0 it's safe to decrement
	else if (q > 0) {
		q--;
	}
	//change the current slide variable to the next slide
	currentSlide = carouselSlides[q];
}

// Get the previous slide ID so two ids can be fed to the animation function
function getPrevSlide (n) {
	if (n == 0 ) {
		n = arrayLength;
	}
	else {
		n--;
	}
	nextSlide = carouselSlides[n];
	//make sure the previous slide is in the correct position for animating in
	onDeckLeft(nextSlide);
	return;
}

// Positions the previous slide immediatly to the left so it's in the correct spot for animation 
function onDeckLeft(objectID) {
	var object = document.getElementById(objectID);
	object.style.left = '-' + slideWidth + 'px';
	object.style.top = '0px';
}


/*** Animation FUNCTIONS ***/

// Init Vars For Animation Function
var objectOne = null;
var objectTwo = null;
var currXPosOne = null;
var currYPosOne = null;
var currXPosTwo = null;
var currYPosTwo = null;
var finalXPosOne = null;
var finalXPosTwo = null;
var distanceOne = null;
var distanceTwo = null;
var step = null;
//To slow the motion down at the end
var halfStep = null;
//To determine the last piece slowed
var easeDis = Math.round(slideWidth/6);
//Detemine if the animate function is running
var amIrunning = null;


//Figure Out the animation of Two Objects At once.
function initAnimate (slideOne, slideTwo, finalXOne, finalXTwo) {

	objectOne = document.getElementById(slideOne);
	objectTwo = document.getElementById(slideTwo);
	//get current x and y, I only need current X for this script but Y will be important in the future		
	currXPosOne = objectOne.offsetLeft;
	currYPosOne = objectOne.offsetTop;
	currXPosTwo = objectTwo.offsetLeft;
	currYPosTwo = objectTwo.offsetTop;
	finalXPosOne = finalXOne;
	finalXPosTwo = finalXTwo;
	//assign a distance to travel for X; current - final 
	distanceOne = Math.abs(currXPosOne - finalXPosOne);
	distanceTwo = Math.abs(currXPosTwo - finalXPosTwo);
	//determine whether we're moving left or right
	if (currXPosOne < finalXPosOne) {
		step = animateSpeed;
		halfStep = animateSpeed/2;
	}
	else if (currXPosOne > finalXPosOne) {
		step = -animateSpeed;
		halfStep = -(animateSpeed/2);
	}
	animateObjects();
}

//animate two objects at once
function animateObjects() {
// if my distances are greater than 0 subtract the step value from the distance and change the current left hand position by the step value
	if ( distanceOne > easeDis || distanceTwo > easeDis ) {
		//set the current X position for both objects
		objectOne.style.left = Math.round(currXPosOne) + 'px';
		objectTwo.style.left = Math.round(currXPosTwo) + 'px';
		//reset current position to minus the step value
		currXPosOne = currXPosOne + step;
		currXPosTwo = currXPosTwo + step;
		//subtract the step from the distance as well since this if evals distance
		distanceOne = distanceOne - Math.abs(step);
		distanceTwo = distanceTwo - Math.abs(step);
		//is this function running
		amIrunning = 1;
		//this function should rerun itself evertime if evals as true
		setTimeout ('animateObjects()',0);
	}

	else if ( distanceOne > 0 || distanceTwo > 0 ) {
		//set the current X position for both objects
		objectOne.style.left = Math.round(currXPosOne) + 'px';
		objectTwo.style.left = Math.round(currXPosTwo) + 'px';
		//reset current position to minus the step value
		currXPosOne = currXPosOne + halfStep;
		currXPosTwo = currXPosTwo + halfStep;
		//subtract the step from the distance as well since this if evals distance
		distanceOne = distanceOne - Math.abs(halfStep);
		distanceTwo = distanceTwo - Math.abs(halfStep);
		//is this function running
		amIrunning = 1;
		//this function should rerun itself evertime if evals as true
		setTimeout ('animateObjects()',0); 
	}
	
	else {
		//distance is no longer greater than 0 so set the final x positions and be done.
		objectOne.style.left = finalXPosOne + "px";
		objectTwo.style.left = finalXPosTwo + "px";
		//set back to null because it's no longer running
		amIrunning = null;
	}
	return;
}