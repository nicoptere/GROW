


function update() {

    requestAnimationFrame( update );

    //centers the drawing context around 0,0
    ctx.restore();
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate( w/2, h/2 );
    ctx.strokeStyle = "#000";

    //principle: trace the rotation of a circle rotating around another circle
    var circ = new Point(0,0);
    circ.radius = h/6;
    circle(circ.x, circ.y, circ.radius);

    //rotation speed around the big circle
    var time = Date.now() * 0.001;

    //position around the big circle
    var cx = circ.x + Math.cos( time ) * ( circ.radius * 2 );
    var cy = circ.y + Math.sin( time ) * ( circ.radius * 2 );
    circle( cx, cy, circ.radius);


    var c = 2 * Math.cos( time ) - Math.cos( 2 * time );
    var s = 2 * Math.sin( time ) - Math.sin( 2 * time );
    var px = ( c * circ.radius );
    var py = ( s * circ.radius );
    circle( px, py, 3 );

    //store the new position
    points.push( new Point( px, py ) );

    //render the curve in red
    ctx.strokeStyle = "#F00";
    ctx.beginPath();
    points.forEach( function( p ){
        ctx.lineTo( p.x, p.y );
    });
    ctx.stroke();
    if( points.length > 360 )points.shift();

}

//creates a 2D context, an array to store points
var canvas, w, h, ctx, points = [];
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
update();

function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
