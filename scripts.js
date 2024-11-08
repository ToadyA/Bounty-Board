const poster = document.getElementById("wantedPoster");
const tack = document.getElementById("wallTack");
let drag = false;
let money = 0;

tack.onmousedown = function(event) {
    drag = true;
    let shiftX = event.clientX - tack.getBoundingClientRect().left;
    let shiftY = event.clientY - tack.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        const cursorY = -90;
        poster.style.left = pageX - shiftX + 'px';
        poster.style.top = pageY - shiftY - cursorY + 'px';
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
        if (!drag) return;
        moveAt(event.pageX, event.pageY);
    }

    function onMouseUp() {
        drag = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
};

tack.ondragstart = function() {
    return false;
};

document.getElementById("posterStack").onclick = function(){
	document.getElementById("overlay").style.display = "block";
};

function createNewPoster(outlaw, infamy, bountySum, stars){
	if(isNaN(bountySum)){
		alert("Is that a number, pardner?");
		return;
	}
	
	const newPoster = document.createElement("div");
	newPoster.className = "wanted-poster";
	newPoster.style.animation = "ripple 0.5s";
	
	const tack = document.createElement("div");
	tack.className = "wall-tack";
	newPoster.appendChild(tack);
	
	const face = document.createElement("img");
	face.src = "images/" + outlaw;
	face.className = "outlaw-mug";
	newPoster.appendChild(face);
	
	const nom = document.createElement("div");
	nom.className = "bounty";
	nom.textContent = bountySum;
	newPoster.appendChild(nom);
	
	const getEm = document.createElement("div");
	getEm.className = "name";
	getEm.textContent = infamy;
	newPoster.appendChild(getEm);
	
	const rating = document.createElement("div");
	rating.className = "star-rating";
	rating.textContent = "✮".repeat(stars);
	newPoster.appendChild(rating);
	
	newPoster.addEventListener('contextmenu', function(e){
		e.preventDefault();
		clearBounty(newPoster, bountySum);
	});
	
	document.querySelector(".corkboard").appendChild(newPoster);
	makeDraggable(newPoster, tack);
}

function clearBounty(poster, bountySum){
	const gunSound = document.getElementById("gunSound");
	gunSound.play();
	const gunshot = document.createElement("div");
	gunshot.className = "gunshot";
	poster.appendChild(gunshot);
	
	setTimeout(() =>{
		money += parseInt(bountySum, 10);
		document.getElementById("moolah").textContent = "Money: $" + money;
		poster.style.animation = "slideDown 1s forwards";
		
		setTimeout(() =>{
			poster.remove();
		}, 1000);
	}, 500);
}

document.getElementById("cancelling").onclick = function(){
	document.getElementById("overlay").style.display = "none";
};

document.getElementById("posting").onclick = function(){
	const outlaw = document.getElementById("outlaw").value;
	const infamy = document.getElementById("infamy").value;
	const bountySum = document.getElementById("bountySum").value;
	const stars = parseInt(document.getElementById("stars").value, 10);
	createNewPoster(outlaw, infamy, bountySum, stars);
	document.getElementById("overlay").style.display = "none";
};

function makeDraggable(poster, tack){
	let drag = false;
	tack.onmousedown = function(event) {
	    drag = true;
	    let shiftX = event.clientX - tack.getBoundingClientRect().left;
	    let shiftY = event.clientY - tack.getBoundingClientRect().top;

	    function moveAt(pageX, pageY) {
	        const cursorY = -90;
	        poster.style.left = pageX - shiftX + 'px';
	        poster.style.top = pageY - shiftY - cursorY + 'px';
	    }

	    document.addEventListener('mousemove', onMouseMove);
	    document.addEventListener('mouseup', onMouseUp);

	    function onMouseMove(event) {
	        if (!drag) return;
	        moveAt(event.pageX, event.pageY);
	    }

	    function onMouseUp() {
	        drag = false;
	        document.removeEventListener('mousemove', onMouseMove);
	        document.removeEventListener('mouseup', onMouseUp);
	    }
	};

	tack.ondragstart = function() {
	    return false;
	};
}
