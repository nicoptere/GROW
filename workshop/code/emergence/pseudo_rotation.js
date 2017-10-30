function update() {

    requestAnimationFrame( update );
    ctx.restore();
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate( w/2, h/2 );

    var morph = Date.now() * 0.0005;
    var time = Date.now() * 0.001;

    //points count
    var total = 16;
    var count = Math.min( Math.max( 1, Math.round( ( .5 + Math.cos( morph ) ) * total ) ), total );
    var step = Math.PI / total;

    //circle radius
    var radius = h / 3;
    ctx.globalAlpha = .25;
    circle( 0,0, radius );

    //circle distribution
    for( var angle = 0; angle < count * step; angle += step ){

        //computes the X / Y position
        //radius * ( Math.cos( angle + time )) creates the osccillation along the line
        var x = Math.cos( angle ) * radius * ( Math.cos( angle + time ));
        var y = Math.sin( angle ) * radius * ( Math.cos( angle + time ));

        //draw this point
        ctx.globalAlpha = 1;
        circle( x, y, 3 );

        //draw the line
        ctx.globalAlpha = .25;
        line(   Math.cos( angle ) * radius, Math.sin( angle ) * radius,
                Math.cos( angle ) * -radius, Math.sin( angle ) * -radius );

    }
}

//creates a 2D context
var canvas, w, h, ctx;

window.onload = function(){
    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    update();
};

function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
function line( ax, ay, bx, by ){
    ctx.beginPath();
    ctx.moveTo( ax, ay );
    ctx.lineTo( bx, by );
    ctx.stroke();
}