var dictDieSupGifs = {}; // create an empty array

var dieXpos = window.innerWidth/2 - (180*6/2);

var dictDieGifResultFrames = {

	heart: 4,
	one: 12,
	three: 15,
	two: 28,
	bolt: 0,
	claw: 29	
	
}

function CreateDieGif(iID)
{
	var divGif = CreateSuperGifDiv(document.body, './die_anim_black.gif', iID, true);
	
	divGif.style.left = dieXpos.toString() + 'px';
	divGif.style.top = "100px";
	dieXpos = dieXpos + 180;

	// divGif.addEventListener('click', function(e) {
		
		// //var oDiv = e.target;
		// var oSuperGif = dictDieSupGifs[divGif.id];
		// if (oSuperGif.get_playing())
		// {
			// oSuperGif.pause();
		// } else {
			// oSuperGif.play();
		// }
	// });

	divGif.addEventListener('click', function(e) {
		
		var delay = 1000;
		for(var key in dictDieSupGifs)
		{
			rollDie(key, delay);
			delay = delay + 250;
		}
		
	});
}

function CreateSuperGifDiv(iParent, iSrc, iID, iDraggable)
{
	var divNew = document.createElement('div');
	divNew.setAttribute('id', iID);
	//divNew.setAttribute('opacity', '0');
	
	//divNew.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000';
	document.body.appendChild(divNew);

    var imgNew = new Image();
	imgNew.src = iSrc;
	imgNew.setAttribute('rel:animated_src', iSrc);
	imgNew.setAttribute('rel:auto_play', '0');
	//imgNew.setAttribute('opacity', '0');
	
	divNew.appendChild(imgNew);

	var super_gif = new SuperGif({ gif: imgNew, show_progress_bar: false } );
	
	dictDieSupGifs[iID] = super_gif;
	
	super_gif.load();

	if(iDraggable === true)
	{
		makeDraggable(divNew);
	}
	
	return divNew;
}

function makeDraggable(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	// otherwise, move the DIV from anywhere inside the DIV:
	elmnt.onmousedown = dragMouseDown;
	
	elmnt.setAttribute('style', 'position: absolute;');

	function dragMouseDown(e) {
	e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function rollDie(iID, iDelay)
{
	var oSuperGif = dictDieSupGifs[iID];
	oSuperGif.move_to(Math.floor(Math.random() * oSuperGif.get_length()));
	oSuperGif.play();
	
	stopDiceAt(getRandomDieGifResultFrameIndex(), iID, iDelay);
}

async function stopDiceAt(iStopAt, iID, iDelay) {
	
	await timeout(iDelay);
	var oSuperGif = dictDieSupGifs[iID];
	oSuperGif.pause();
	oSuperGif.move_to(iStopAt);
}	

function getRandomDieGifResultFrameIndex() {

	var values = Object.values(dictDieGifResultFrames);
	var randomKey = values[Math.floor(Math.random() * values.length)];
	return randomKey;
}
