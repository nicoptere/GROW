
var HPI = Math.PI / 2;
function angle(a,b){
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.atan2( dy, dx );
}

//method to draw an arrow
function drawArrow( p0, p1, size ){
    var a = angle( p0, p1 );
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p0[0] + Math.cos( a + HPI ) * size, p0[1] + Math.sin( a + HPI ) * size);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p0[0] + Math.cos( a - HPI ) * size, p0[1] + Math.sin( a - HPI ) * size);
    ctx.fill();
}
//this is the value at a given X/Y location
function getValue( x, y ){
    return Math.cos( x ) * Math.sin( y ) + Date.now() * 0.001;
}
function update() {

    requestAnimationFrame(update);
    ctx.clearRect(0,0,w,h);

    //regular grid with 50px cells
    var cellSize = 50;
    var points = [];
    var values = [];

    for( var i = 0; i <= w; i += cellSize ){
        for( var j = 0; j <= h; j += cellSize ){
            points.push( [i,j] );
            values.push( getValue( i, j ) );
        }
    }
    //draws an arrow at each point (lattice)
    points.forEach( function( p, id ){

        //direction
        var p1 = [
            p[0] + Math.cos( values[id] ) * cellSize * .75,
            p[1] + Math.sin( values[id] ) * cellSize * .75
        ];

        //draw arrow
        drawArrow( p, p1, cellSize * .2 );

    });

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
