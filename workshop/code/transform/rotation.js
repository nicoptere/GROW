function rotate(p, lattice, angle) {

    var a = getAngle(lattice, p) + angle;
    var d = getDistance(lattice, p);

    var pp = new Point();
    pp.x = lattice.x + Math.cos(a) * d;
    pp.y = lattice.y + Math.sin(a) * d;
    return pp;

}
var a = new Point();
var b = new Point(1,1);
console.log( getAngle(a,b) * (180/Math.PI))
function reset() {

    ctx.restore();
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w/2, h/2);

    //pseudoRandom walk:
    // make a point move randomly X times on X / Y
    // store each position in an array
    var count = 64;
    var steplength = 20;
    var p = new Point();
    var points = [];
    for( var i = 0; i < count; i++ ){

        p.x += steplength;
        p.y += ( Math.random() - .5 ) * steplength;

        //p.clone() return a copy of the point
        points.push( p.clone() );

    }

    //performs a series of rotations around a point (center)
    var center = new Point();

    var rotations = 64;
    var angleStep = Math.PI * 2 / rotations;
    var tmp = new Point();
    for( i = 0; i < rotations; i++ ){

        var rotated = [];
        points.forEach( function( p, id ){
            if( i == 0 )circle(p.x,p.y, 2 );
            tmp = rotate( p, center, angleStep * i );
            rotated.push( tmp );
        });
        renderLine( rotated );
    }
}


//creates a 2D context
var canvas, w, h, ctx;
window.onload = function () {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    reset();
};

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
}

function renderLine(points) {
    ctx.beginPath();
    points.forEach(function( p ){
        ctx.lineTo(p.x,p.y);
    });
    ctx.stroke();
}