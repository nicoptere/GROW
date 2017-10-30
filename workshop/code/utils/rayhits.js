
//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
var HPI = Math.PI / 2;

var turns = 0;
var step = ( Math.PI / 180 ) * .1;
function update(){


    ctx.lineWidth = 1;
    ctx.fillStyle ="#fff";
    ctx.strokeStyle ="#fff";

    if( energy > 0 ){

        energy = repel( rays );
        // console.log( energy );

        ctx.globalAlpha = 1;
        ctx.fillStyle ="#000";
        ctx.fillRect( 0,0,w,h );
        rays.forEach(function(r){
            r[0].radius = r[3];
            G.circle( r[0]  );
        } );
        requestAnimationFrame( update );
        return

    }else if( energy == 0 ){
        turns = 0;
        energy = -1;
    }else{
        turns += step;
    }

    if( turns == 0 ){
        ctx.globalAlpha = 1;
        ctx.fillStyle ="#000";
        ctx.fillRect( 0,0,w,h );
    }


    ctx.globalAlpha = .1;
    ctx.lineWidth = .5;
    var t = Date.now() * 0.001;
    rays.forEach(function(r){

        // if( turns < r[2] )return;
        // if( turns > r[4] )return;

        //rotates a point around a point
        r[1].x = r[0].x+Math.cos( turns + r[2] ) * r[3];
        r[1].y = r[0].y+Math.sin( turns + r[2] ) * r[3];

        var found = [];
        rays.forEach( function(other){

            if( r == other )return;
            // if( r[3] > 30 )return;
            var ip = geomUtils.rayCircleIntersection( r[0], r[1], other[0] );
            if( ip )found.push( ip );

        });

        if( found.length == 0 )return;
        found.sort( function( a, b ){
            return geomUtils.distance( a, r[0] ) - geomUtils.distance( b, r[0] );
        });

        var ip = found[ 0 ];//found.length - 1 ];
        ctx.lineCap = "round";

        var p = r[0];
        ctx.lineWidth = 0.1;

        var grad = ctx.createRadialGradient( p.x,p.y, 0,p.x,p.y,geomUtils.distance( p, ip ) );
        grad.addColorStop( 0, "rgba(255, 255, 255, 1 )" );
        grad.addColorStop( 1, "rgba(255, 255, 255, 0 )" );
        ctx.strokeStyle = grad;
        G.line( p, ip );

    } );

    // if( parseInt( turns % ( Math.PI / 2 ) ) != 0 ) {
    if( turns > ( Math.PI ) ) {

        // ctx.globalAlpha = .1;
        // ctx.lineWidth = 1.1;
        // // ctx.fillStyle ="#000";
        // // ctx.fillRect( 0,0,w,h );
        // rays.forEach(function(r){
        //     if( r[3] < 30 )return;
        //     r[0].radius = r[3];
        //     G.circle( r[0]  );
        // } );

    }else{
        requestAnimationFrame( update );
    }
}


var rays = [];
var tot = 250;
for( var i = 0; i < tot; i++ ){

    // a = i/tot * Math.PI * 2;
    var a = Math.random() * Math.PI * 2;

    var s = new Point(
        w / 2 - ( Math.random() -.5 ) * 50,
        h / 2 - ( Math.random() -.5 ) * 50

    );

    // var r = 30 + ( Math.sin( a * 5 ) ) * 30 ;// + ( Math.random() > .9 ) ? Math.random() * 20 : Math.random() * 5;
    var r = 5 + Math.random() * 50;// + ( Math.random() > .9 ) ? Math.random() * 20 : Math.random() * 5;

    a =  Math.random() * Math.PI * 2 ;//parseInt( 6 * Math.random() ) * Math.PI / 6;
    var a1 = a + parseInt( 6 * Math.random() ) * Math.PI / 3;

    var e = new Point( s.x + Math.cos( a ) * r, s.y + Math.sin( a ) * r );
    rays.push( [ s, e, a, r, a1 ] );

}








function repel(rays){

    var acc = 0;
    rays.forEach( function (ray) {

        rays.forEach(function( other ){

            if( ray == other )return;

            var p = ray[0];
            var o = other[0];

            var d = geomUtils.distance( p,o );
            var minDist = ray[3] + other[3];

            if( d < minDist ){

                var dir = p.direction(o);
                p.sub( dir );
                o.add( dir );
                acc += d;
            }

        });
    });
    return acc;
}
var energy = repel(rays);


var G = new Graphics( ctx );
update();