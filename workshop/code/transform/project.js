function project(p, a, b, asSegment) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    if (asSegment && dx == 0 && dy == 0) {
        return a;
    }
    var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );
    if (asSegment && t < 0) return null;
    if (asSegment && t > 1) return null;
    return new Point(a.x + t * dx, a.y + t * dy);
}
function reset() {

    ctx.restore();
    ctx.clearRect(0, 0, w, h);

    //pseudoRandom walk:
    // make a point move randomly X times on X / Y
    // store each position in an array
    var steplength = 30;
    var p = new Point(0, h/2);
    var points = [];
    for( var i = 0; i <= w; i+=steplength ){

        p.x = i;
        p.y += ( Math.random() - .5 ) * steplength;
        circle( p.x, p.y, 2 );
        points.push( p.clone() );

    }
    renderLine( points );

    //performs a series of projections onto an axis
    // define by the start & end points
    var start   = new Point( 0, h - h / 4 );
    var end     = new Point( w, h - h / 4 );
    points.forEach( function( p ){
        var tmp = project( p, start, end );
        line(p,tmp);
    });
    line( start, end );

    //performs a series of projections onto an axis
    // define by the start & end points
    start = new Point( 0, 0 );
    end = new Point( w, h );
    var newPositions = [];
    points.forEach( function( p ){

        var tmp = project( p, start, end );
        line(p,tmp);
    });
    line( start, end );

    // now projects the projected points onto a new line
    start = new Point( w*.75, h/4 );
    end = new Point( w*.95, h/3 );
    ctx.beginPath();
    points.forEach( function( p ){

        //use the asSegment flag to check if the projection lies onb the segment
        var tmp = project( p, start, end, true );
        if( tmp != null ) line(p,tmp);

    });
    line( start, end );

}

//creates a 2D context
var canvas, w, h, ctx;
window.onload = function () {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    reset();
};
function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
}
function line(a,b) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}
function renderLine(points) {
    ctx.beginPath();
    points.forEach(function( p ){
        ctx.lineTo(p.x,p.y);
    });
    ctx.stroke();
}