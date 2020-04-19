var dictDieSupGifs = {}; // create an empty array
var dictDivGifs = {}; 
var dictImgRerolls = {}; 

var dieXpos = window.innerWidth/2 - (180*6/2);

var dictDieGifResultFrames = {

	heart: 4,
	one: 12,
	three: 15,
	two: 28,
	bolt: 0,
	claw: 29
}

function rollDice(iDictDieIDtoResult)
{
	var delay = 1000;
	for(var key in iDictDieIDtoResult)
	{			
		rollDie(key, iDictDieIDtoResult[key], delay);
		delay = delay + 250;
	}
}

function CreateDieGif(iID)
{
	var divGif = CreateSuperGifDiv(document.body, './die_anim_black.gif', iID, true);
	
	divGif.style.left = dieXpos.toString() + 'px';
	divGif.style.top = "100px";
	dieXpos = dieXpos + 180;

	var imgDie = divGif.childNodes[0];
	
	imgDie.addEventListener('click', function(e) {
		var imgDie = e.target;
		var imgReroll = imgDie.parentNode.parentNode.childNodes[1];

		if (imgReroll.style.visibility === 'hidden')
		{
			imgReroll.style.visibility = 'visible';
		} else {
			imgReroll.style.visibility = 'hidden';
		}
	});
	
	var imgReroll = divGif.childNodes[1];
	
	imgReroll.addEventListener('click', function(e) {
		
		var imgReroll = e.target;

		if (imgReroll.style.visibility === 'hidden')
		{
			imgReroll.style.visibility = 'visible';
		} else {
				
			var rollTheseIDs = {};
			for(var key in dictImgRerolls)
			{
				var imgReroll = dictImgRerolls[key];
				if(imgReroll.style.visibility === 'visible')
				{
					imgReroll.style.visibility = 'hidden';
					rollTheseIDs[key] = key;
				}
			}
			
			var allOrSome = rollTheseIDs;
			if (Object.keys(allOrSome).length === 0)
			{
				allOrSome = dictDieSupGifs;
			}
			
			var dieIDresultPairs = {};
			
			for(var key in rollTheseIDs)
			{			
				dieIDresultPairs[key] = getRandomDieGifResultFrameIndex();
			}
			
			socket.emit('rollDice', dieIDresultPairs);

			rollDice(dieIDresultPairs);
		}
	});
}

function CreateSuperGifDiv(iParent, iSrc, iID, iDraggable)
{
	var divNew = document.createElement('div');
	divNew.setAttribute('id', iID);
	divNew.style.textAlign  = 'center';
	divNew.style.margin  = 'auto';
	divNew.style.position = 'absolute';
	
	document.body.appendChild(divNew);

    var imgNew = new Image();
	imgNew.src = iSrc;
	imgNew.setAttribute('rel:animated_src', iSrc);
	imgNew.setAttribute('rel:auto_play', '0');

	divNew.appendChild(imgNew);
	
    var imgReroll = new Image();
	imgReroll.style.visibility = 'visible';
	imgReroll.src = 'reroll_die_30.png';
	dictImgRerolls[iID] = imgReroll;
	
	divNew.appendChild(imgReroll);

	var super_gif = new SuperGif({ gif: imgNew, show_progress_bar: false } );
	
	dictDieSupGifs[iID] = super_gif;
	
	super_gif.load();

	if(iDraggable === true)
	{
		$('#'+iID).draggable();
	}
	
	dictDivGifs[iID] = divNew;
	
	return divNew;
}

function makeDraggable(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	// otherwise, move the DIV from anywhere inside the DIV:
	elmnt.onmousedown = dragMouseDown;
	
	elmnt.style.position = 'absolute';

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

function rollDie(iID, iStopAtFrame, iDelay)
{
	var oSuperGif = dictDieSupGifs[iID];
	oSuperGif.move_to(Math.floor(Math.random() * oSuperGif.get_length()));
	oSuperGif.play();
	
	stopDiceAt(iID, iStopAtFrame, iDelay);
}

async function stopDiceAt(iID, iStopAtFrame,iDelay) {
	
	await timeout(iDelay);
	var oSuperGif = dictDieSupGifs[iID];
	oSuperGif.pause();
	oSuperGif.move_to(iStopAtFrame);
}	

function getRandomDieGifResultFrameIndex() {

	var values = Object.values(dictDieGifResultFrames);
	var randomKey = values[Math.floor(Math.random() * values.length)];
	return randomKey;
}
