const poster = document.getElementById("wantedPoster");
const tack = document.getElementById("wallTack");
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

