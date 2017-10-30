
function branch(length, angle) {

    line(0, 0, 0, -length);
    ctx.translate(0, -length);

    if (length > 2) {

        length *= 0.65;

        ctx.save();
        ctx.rotate(angle);
        branch(length, angle);
        ctx.restore();

        ctx.save();
        ctx.rotate(-angle);
        branch(length, angle);
        ctx.restore();
    }
}

function line(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

//creates a 2D context
var canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
var w = canvas.width = window.innerWidth ;
var h = canvas.height = window.innerHeight ;
var ctx = canvas.getContext("2d");
ctx.translate(w/2,h/2 + 300);
branch( 200, Math.PI / 180 * 30 );
