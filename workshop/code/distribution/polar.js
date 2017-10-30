function reset() {

    ctx.restore();
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate( w/2, h/2 );

    //points count
    var count = 24;

    //angle step ( angle between 2 points on the circle )
    var step = Math.PI * 2 / count;

    //circle radius
    var radius = h / 3;

    //circle distribution
    for( var angle = 0; angle < Math.PI * 2; angle += step ){

        //computes the X / Y position
        var x = Math.cos( angle ) * radius;
        var y = Math.sin( angle ) * radius;

        //draw this point
        circle( x, y, 10 );

    }

    //radial distribution
    var radialSegments = 15;
    for( angle = 0; angle < Math.PI * 2; angle += step * 2 ){
        for( var i = 0; i < radialSegments; i++ ){
            var r = i * ( radius / radialSegments);
            x = Math.cos( angle ) * r;
            y = Math.sin( angle ) * r;
            circle( x, y, 3 );
        }
    }

    //spiral distribution
    var turns = 3;
    for( angle = 0; angle < Math.PI * 2 * turns; angle += step / 4 ){
        r = radius * ( angle / ( Math.PI * 2 * turns ) );
        console.log( i / ( Math.PI * 2 * turns ) );
        x = Math.cos( angle ) * r;
        y = Math.sin( angle ) * r;
        circle( x, y, 1 );
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
    reset();
};
//draw a circle on the canvas at x/y with radius r
function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
