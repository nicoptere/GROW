
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

    ctx.save();
    ctx.strokeStyle = "#FFF";
    ctx.globalAlpha = .5;

    var t = Date.now() * 0.001;


    var circles = [];
    for( var i = 0; i < 5; i++ ){

        var step = i * Math.PI * 2 / 5;
        var c = new Point( w/2 + Math.cos( step ) * h/8, h/2 + Math.sin( step ) * h/8);
        c.radius = h/16;
        circles.push( c );
        G.circle(c);

    }

    var colors = [ "#F00", "#FF0", "#0F0", "#0FF", "#00F", "#F0F"];
    colors.forEach( function( col, i ){

        var lines = [];
        for( var j = 0; j < 3; j++ ){

            var r0 = 350;
            var r1 = 300;
            step = t*.1 + j * Math.PI * 2 / 3;
            var s = new Point( w/2 + Math.cos( step ) * r0, h/2 + Math.sin( step ) * r0 );
            var e = new Point( w/2 + Math.cos( step ) * r1, h/2 + Math.sin( step ) * r1 );

            var n = geomUtils.normal(s,e).multiplyScalar(i);
            s.add( n );
            e.add( n );
            lines.push( [s,e] );

        }

        ctx.globalCompositeOperation = "lighten";
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';

        ctx.beginPath();
        lines.forEach(function(l){

            var s = l[0];
            var e = l[1];
            ctx.moveTo( l[0].x, l[0].y );

            circles.forEach(function (c) {
                var ip = geomUtils.lineCircleIntersection(s,e,c);
                if( ip != null ){
                    lightRay(s,e,c, 4 );
                }
            });

        });
        ctx.stroke();
    });
    ctx.restore();

}

function lightRay( s,e,c, bounce ){

    bounce--;
    if( bounce == 0 )return;

    var bvs = geomUtils.circleBounceVectors( s, e, c );
    if( bvs == null )return;

    bvs.forEach( function(bv, i) {
        if( bv == null )return;
        // if( i > 1 )return;
        var p = bv[0];
        var n = bv[1];

        if( !geomUtils.vectorsHaveSameDirection(c, p, p, n ) ) {

            ctx.lineTo( p.x,p.y );
            lightRay( p, n, c, bounce );

        }
    });

}
var G = new Graphics(ctx );
update();