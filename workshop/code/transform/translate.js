
function lerp ( t, a, b ){
    return a * (1-t) + b * t;
}
function norm( t, a, b ){
    return ( t - a ) / ( b - a );
}
function map( t, a0, b0, a1, b1 ){
    return lerp( norm( t, a0, b0 ), a1, b1 );
}

function reset(){
    ctx.translate( w/2, h/2 );
    var count  = 1024;
    var golden_angle = Math.PI * 2 / ( ( 1 + Math.sqrt(5) ) / 2 );
    for( var i = 0; i < count; i++ ) {
        var theta = i * golden_angle;
        var radius = Math.sqrt(i / count) * h / 3;
        circle(Math.cos(theta) * radius,Math.sin(theta) * radius, 5 );

        var theta = lerp( norm( i, 0, count), 0, count * golden_angle );
        var radius = Math.sqrt( norm( i, 0, count) ) * h / 3;
        circle(Math.cos(theta) * radius,Math.sin(theta) * radius, 1 );

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
function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}