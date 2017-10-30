
function reset() {

    var i, x, y, r = 2;
    var count = 1000;

    PRNG.setSeed( 1 );

    for ( i = 0; i < count; i++) {

        x = Math.random() * w / 2;
        y = Math.random() * h;
        circle(x, y, r);

        x = w / 2 + PRNG.random() * w / 2;
        y = PRNG.random() * h;
        circle(x, y, r);

    }

    PRNG.setSeed( 1 );
    r = 5;
    for ( i = 0; i < count; i++) {

        x = Math.random() * w / 2;
        y = Math.random() * h;
        circle(x, y, r);

        x = w / 2 + PRNG.random() * w / 2;
        y = PRNG.random() * h;
        circle(x, y, r);

    }

    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.stroke();
}

//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
reset();

function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}