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
		alert("Is that a number, pardner? \n (enter a valid number)");
		return;
	}
	if(isNaN(stars)){
		alert("We need to warn folks, pardner. \n (enter a number of stars between 1 and 5)");
		return;
	}
	if(bountySum < 100){
		alert("This whelp is no threat to anyone, kid. \n (enter a bounty of at least 100)");
		return;
	}
	
	const newPoster = document.createElement("div");
	newPoster.className = "wanted-poster";
	newPoster.style.position = "absolute";
	newPoster.style.animation = "ripple 0.5s";
	newPoster.style.visibility = "visible";
	
	const tack = document.createElement("div");
	tack.className = "wall-tack";
	newPoster.appendChild(tack);
	tack.style.visibility = "visible";
	
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
	resolveCollisions(tack);
}

function counterScroll(target, value){
	let startVal = parseInt(target.textContent.replace("Money: $", "")) || 0;
	let curVal = startVal;
	const increment = (value - startVal) / 300;
	const interval = 20;
	
	const counter = setInterval(() => {
		curVal += increment;
		target.textContent = "Money: $" + Math.floor(curVal);
		
		if(curVal >= value){
			clearInterval(counter);
			target.textContent = "Money: $" + value;
			const cashSound = document.getElementById("kaching");
			const startTime = 4.5;
			const endTime = 7.0;
			cashSound.currentTime = startTime;
			cashSound.play();
			setTimeout(() =>{
				cashSound.pause();
			}, (endTime - startTime) * 1000);
		}
	}, interval);
}

function clearBounty(poster, bountySum){
	const gunSound = document.getElementById("blam");
	gunSound.play();
	
	const gunshot = document.createElement("img");
	gunshot.src = "images/pow.png"; // https://creazilla.com/media/clipart/60300/pow
	gunshot.className = "gunshot";
	poster.appendChild(gunshot);
	
	setTimeout(() =>{
		money += parseInt(bountySum, 10);
		counterScroll(document.getElementById("moolah"), money);
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
	console.log("Closing the creation area");
	document.getElementById("overlay").style.display = "none";
};
let z = 3;
function makeDraggable(poster, tack){
	let drag = false;
	tack.onmousedown = function(event) {
	    drag = true;
	    let shiftX = event.clientX - tack.getBoundingClientRect().left;
	    let shiftY = event.clientY - tack.getBoundingClientRect().top;
		poster.style.zIndex = z;
		tack.style.zIndex = z + 1;
		z += 2;
		
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
			resolveCollisions(tack);
	    }
	};

	tack.ondragstart = function() {
	    return false;
	};
}

function resolveCollisions(tack){
	const tacks = document.querySelectorAll(".wall-tack");
	let checks = 10;
	while(checks > 0){
		let collide = false;
		tacks.forEach(tack2 => {
			if(tack2 !== tack && overlap(tack, tack2)){
				console.log(`Overlapping detected. Moving tack.`)
				const dx = (Math.random() - 0.5) * 50;
				const dy = (Math.random() - 0.5) * 50;
				console.log(`Moving by dx: ${dx}, dy: ${dy}`);
				tack.parentElement.style.left = `${tack.parentElement.offsetLeft + dx}px`;
				tack.parentElement.style.top = `${tack.parentElement.offsetTop + dy}px`;
				collide = true;
			}
		});
		if(!collide){
			break;
		}
	checks -= 1;
	}
}

function overlap(tack1, tack2) {
    const t1 = tack1.getBoundingClientRect();
    const t2 = tack2.getBoundingClientRect();
    const isOverlapping = !(t1.right < t2.left || t1.left > t2.right || t1.bottom < t2.top || t1.top > t2.bottom);
	console.log(`Checking overlap: ${isOverlapping}`);
	return isOverlapping;
}


