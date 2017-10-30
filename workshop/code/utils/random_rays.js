
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

    ctx.strokeStyle = "#FFF";
    ctx.fillStyle = "#FFF";
    G.disc(mouse.x, mouse.y, mouse.radius);
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#FFF";

    lines.forEach(function( l ){

        var bvs = geomUtils.circleBounceVectors( l[0], l[1], mouse );
        if( bvs == null )return;

        bvs.forEach( function(bv, i) {

            if( bv == null )return;

            var p = bv[0];
            var grad;
            var l = ( p.clone().sub(bv[1]).length() ) * .5;
            if( geomUtils.vectorsHaveSameDirection(  mouse, p,p, bv[1] ) ){

                grad = ctx.createRadialGradient( p.x,p.y, 0, p.x, p.y, l );
                grad.addColorStop( 0, "#FFF" );
                grad.addColorStop( 1, "rgba(255, 255, 255, 0 )" );

            }else{
                grad = ctx.createRadialGradient( p.x,p.y, 0, p.x, p.y, l * .5 );
                grad.addColorStop( 0, "#000" );
                grad.addColorStop( 1, "rgba(0, 0, 0, 0 )" );
            }

            ctx.strokeStyle = grad;
            G.line( bv[0], bv[1]);

        });

    })

}


var lines = [];
for( var i = 0; i < 1000; i++ ){
    lines.push( [
        new Point( Math.random() * w, Math.random() * h ),
        new Point( Math.random() * w, Math.random() * h )
        ]
    );
}

var mouse = new Point(w/2, h/2);
mouse.radius = 100;
window.addEventListener( 'mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
var G = new Graphics( ctx );
update();