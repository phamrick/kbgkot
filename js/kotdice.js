var dictDieSupGifs = {}; // create an empty array
var dictDivGifs = {}; 
var dictImgRerolls = {};

var disableClickReroll = false;

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

function CreateDieGifs()
{
	var dieDim = '160';
	if(isMobile === false)
		dieDim = '80';
	
	pathImage = './die_anim_black_' +  dieDim + '.gif';
	
	divContWidth = (parseInt(dieDim)*6).toString();
	
	var divDiceCont = document.createElement('div');
	
	var oChild = CreateDieGif('die1', pathImage);
	divDiceCont.appendChild(oChild);
	
	var oChild = CreateDieGif('die2', pathImage);
	divDiceCont.appendChild(oChild);
	
	var oChild = CreateDieGif('die3', pathImage);
	divDiceCont.appendChild(oChild);
	
	var oChild = CreateDieGif('die4', pathImage);
	divDiceCont.appendChild(oChild);
	
	var oChild = CreateDieGif('die5', pathImage);
	divDiceCont.appendChild(oChild);
	
	var oChild = CreateDieGif('die6', pathImage);
	divDiceCont.appendChild(oChild);
	
	var sStyle = 'position: absolute; left: 50%; -webkit-transform: translate(-50%, 10%); translate(-50%, 10%); width: ' + divContWidth + 'px;';
	// //var sStyle = 'position: absolute; left: 0;right: 0; text-align: center';
	
	//divDiceCont.style.position = 'absolute';
	//divDiceCont.style.left = (window.innerWidth/2 - 300).toString() + 'px';
	
	divDiceCont.setAttribute('style', sStyle);
	
	document.body.appendChild(divDiceCont);
}

function ToggleDieReroll(iID)
{
	var imgReroll = dictImgRerolls[iID];

	var setVis = 'hidden';
	
	if (imgReroll.style.visibility === 'hidden')
	{
		setVis = 'visible';
	} 
	
	imgReroll.style.visibility = setVis;
}

function CreateDieGif(iID, iImgPath)
{
	var divGif = CreateSuperGifDiv(document.body, iImgPath, iID, true);
	
	divGif.style.float = 'left';

	var imgDie = divGif.childNodes[0];
	
	imgDie.addEventListener('click', function(e) {
		
		if (disableClickReroll === true)
		{
			disableClickReroll = false;
			return;
		}
		
		// var imgDie = e.target;
		// var imgReroll = imgDie.parentNode.parentNode.childNodes[1];
		
		socket.emit('toggleDieReroll', iID);
		
		ToggleDieReroll(iID);
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
	
	return divGif;
}

function CreateSuperGifDiv(iParent, iSrc, iID, iDraggable)
{
	var divNew = document.createElement('div');
	divNew.setAttribute('id', iID);
	divNew.style.textAlign  = 'center';
	divNew.style.margin  = 'auto';
	//divNew.style.position = 'absolute';
	
	iParent.appendChild(divNew);

    var imgNew = new Image();
	imgNew.src = iSrc;
	imgNew.setAttribute('rel:animated_src', iSrc);
	imgNew.setAttribute('rel:auto_play', '0');

	divNew.appendChild(imgNew);
	
    var imgReroll = new Image();
	imgReroll.style.visibility = 'visible';
	
	var dieDim = '50';
	if(isMobile === false)
		dieDim = '30';
	
	imgReroll.src = 'reroll_die_' + dieDim + '.png';
	dictImgRerolls[iID] = imgReroll;
	
	divNew.appendChild(imgReroll);

	var super_gif = new SuperGif({ gif: imgNew, show_progress_bar: false } );
	
	dictDieSupGifs[iID] = super_gif;
	
	super_gif.load();

	if(iDraggable === true)
	{
		$('#'+iID).draggable();
		$('#'+iID).on('dragstart', function (event) {
			disableClickReroll = true;
		});
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
	var imgReroll = dictImgRerolls[iID];
	if(imgReroll.style.visibility === 'visible')
	{
		imgReroll.style.visibility = 'hidden';
	}
	
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
