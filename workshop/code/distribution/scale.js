function reset() {

    ctx.translate( w/2, h/2 );

    //points count
    var count = 5;

    //angle step ( angle between 2 points on the circle )
    var step = Math.PI * 2 / count;

    //5 points distributed around the center gives a regular polygon (pentagon)
    var polygon = [];
    for( var angle = 0; angle < Math.PI * 2; angle += step ){

        //computes the X / Y position from the angle
        //the - Math.PI/2 is there to make the polygon point up

        var x = Math.cos( angle - Math.PI / 2 );
        var y = Math.sin( angle - Math.PI / 2 );

        //store the position
        polygon.push([ x, y ]);

    }

    //we can draw this polygon but it will be very tiny
    ctx.beginPath();
    for( i = 0; i < count; i++ ){
        ctx.lineTo( polygon[i][0], polygon[i][1] );
    }
    ctx.closePath();
    ctx.stroke();

    // we will gradually upscale the polygon's coordinates
    // to draw a bigger and bigger polygon

    var maxScale = h/3;
    for( var scale = 1; scale < maxScale; scale += 10 ){

        ctx.beginPath();
        for( i = 0; i < count; i++ ){
            ctx.lineTo( polygon[i][0] * scale, polygon[i][1] * scale );
        }
        ctx.closePath();
        ctx.stroke();

        //we can also index the alpha value on the scale
        var alpha = scale/maxScale;
        ctx.globalAlpha = alpha;
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
