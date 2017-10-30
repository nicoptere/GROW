
//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
var HPI = Math.PI / 2;



function update(){

    requestAnimationFrame( update );
    ctx.fillRect( 0,0,w,h );

    var t = Date.now() * 0.001;
    var p = new Point();
    var n = new Point();
    var RAD = Math.PI / 180;

    ctx.lineWidth = 5;
    for( var i = 0; i <  Math.PI * 2; i += RAD ){
        p.x = c.x + Math.cos( i ) * c.radius;
        p.y = c.y + Math.sin( i ) * c.radius;

        var radius = c.radius * ( ( Math.sin( t + i * 3  )* Math.cos( t ) )  * .5 + .5 ) * 2 ;
        n.x = c.x + Math.cos( i + RAD * 30 ) * radius;
        n.y = c.y + Math.sin( i + RAD * 30 ) * radius;

        var grad = ctx.createRadialGradient( p.x,p.y, 0,p.x,p.y, Math.abs( radius ) );
        grad.addColorStop( 0, "rgba(255, 255, 255, 1 )" );
        grad.addColorStop( 1, "rgba(255, 255, 255, 0 )" );
        ctx.strokeStyle = grad;

        G.line(p,n);

    }

}


var mouse = new Point(w/2, h/2);
mouse.radius = 100;
window.addEventListener( 'mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
var c = new Point(w/2, h/2);
c.radius = h / 4;
var G = new Graphics( ctx );
update();