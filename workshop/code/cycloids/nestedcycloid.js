
//creates a 2D context, an array to store points
var canvas, w, h, ctx, points = [];
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");

// systematizing cycloids

var circles = [], circ;
var radius = h/3;
var count = 10;
for( var i = 0; i < count; i++ ){

    circ = new Point( 0,0 );
    if( i == 0 ){
        circ.radius = radius;
    }else{
        var parent = circles[ i-1 ];
        circ.radius = parent.radius * .75;
    }
    circ.speed = 1+ 5 * ( i/count );
    circles.push( circ );
    points.push( [] );
}




function update() {

    requestAnimationFrame( update );

    //centers the drawing context around 0,0
    ctx.restore();
    ctx.clearRect(0,0,w,h);
    ctx.save();
    ctx.translate( w/2, h/2 );
    ctx.strokeStyle = "#000";

    //hypocycloids
    var time = Date.now() * 0.001;
    circles.forEach( function(c, i){

        ctx.fillStyle = i%2 == 0 ? "#000" : "#FFF";

        if( i == 0 ){
            disc( c.x, c.y, c.radius );
            return;
        }

        var parent = circles[ i-1 ];
        var radius = parent.radius - c.radius;
        var angle = time * parent.speed;

        c.x = parent.x + Math.cos( angle ) * radius;
        c.y = parent.y + Math.sin( angle ) * radius;
        disc( c.x, c.y, c.radius )

    });

    //epicycloids
    time = -Date.now() * 0.001;
    circles.forEach( function(c, i){
        if( i == 0 )return;

        var parent = circles[ i-1 ];
        var radius = ( parent.radius + c.radius ) * .75;
        var angle = time * parent.speed;

        c.x = parent.x + Math.cos( angle ) * radius;
        c.y = parent.y + Math.sin( angle ) * radius;

        points[i].push( c.clone() );
        ctx.strokeStyle = "#F00";
        ctx.beginPath();
        points[i].forEach( function( p ){
            ctx.lineTo( p.x, p.y );
        });
        ctx.stroke();
        if( points[i].length > 100 )points[i].shift();

    });

    ctx.beginPath();
    points.forEach( function( list, i ){
        if( i==0 )return;
        var p = list[list.length - 1 ];
        ctx.lineTo( p.x, p.y );
    });
    ctx.stroke();



}

update();

function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
function disc( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.fill();
}
