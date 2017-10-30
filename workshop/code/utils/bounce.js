
//creates a 2D context
var canvas, w, h, ctx;
canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
w = canvas.width = window.innerWidth ;
h = canvas.height = window.innerHeight ;
ctx = canvas.getContext("2d");
var HPI = Math.PI / 2;

//some methods
function angle(a,b){
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.atan2( dy, dx );
}

function raySegmentIntersection(a,b,c,d) {
    var x1_ = a.x, y1_ = a.y, x2_ = b.x, y2_ = b.y, x3_ = c.x, y3_ = c.y, x4_ = d.x, y4_ = d.y;
    var p = null;
    var r, s, d1;
    if((y2_ - y1_) / (x2_ - x1_) != (y4_ - y3_) / (x4_ - x3_)) {
        d1 = (x2_ - x1_) * (y4_ - y3_) - (y2_ - y1_) * (x4_ - x3_);
        if(d1 != 0) {
            r = ((y1_ - y3_) * (x4_ - x3_) - (x1_ - x3_) * (y4_ - y3_)) / d1;
            s = ((y1_ - y3_) * (x2_ - x1_) - (x1_ - x3_) * (y2_ - y1_)) / d1;
            if(r >= 0) {
                if(s >= 0 && s <= 1) p = new Point(x1_ + r * (x2_ - x1_),y1_ + r * (y2_ - y1_));
            }
        }
    }
    return p;
}
function normal(p0,p1) {
    return new Point(-(p1.y - p0.y), p1.x - p0.x );
}

function project(p, a, b, asSegment) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    if (asSegment && dx == 0 && dy == 0) {
        return a;
    }
    var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );
    if (asSegment && t < 0) return a;
    if (asSegment && t > 1) return b;
    return new Point(a.x + t * dx, a.y + t * dy);
}

function reflect(p, a, b) {
    var pp = project(p, a, b);
    return new Point(p.x + ( pp.x - p.x ) * 2, p.y + ( pp.y - p.y ) * 2);
}

function update(){

    requestAnimationFrame( update );
    ctx.clearRect( 0,0,w,h );
    var t = Date.now() * 0.001;

    ctx.strokeStyle = "#000";
    var line = [new Point(0, h/2 + Math.cos( t ) * h / 4 ), new Point(w, h/2 - Math.cos( t ) * h / 4 )];
    drawLine(line[0], line[1]);

    var s = new Point( w/2 + Math.cos( t )* w/4, h * .25);
    var e = new Point( w/2, h*.75 );
    drawLine(s,e);


    //hand made
    var ip = raySegmentIntersection( s,e, line[0], line[1] );
    if( ip != null ){

        // red triangle
        var inVector = ip.clone().sub( s ).normalize().multiplyScalar( 50 );
        ctx.fillStyle = "#F00";
        ctx.strokeStyle = "#F00";
        drawArrow(s, inVector.clone().add( s ), 5);

        //blue normal
        ctx.strokeStyle = "#06C";
        var reflectionAxis = [ip, ip.clone().add( normal(line[0], line[1] ).normalize().multiplyScalar( 150 ) )];
        drawLine(reflectionAxis[0], reflectionAxis[1]);

        //green circle, arrow and line
        ctx.fillStyle = "#0C6";
        ctx.strokeStyle = "#0C6";
        var rp = reflect( s, ip, reflectionAxis[1]);
        circle( rp.x, rp.y, 2 );
        drawLine(ip, rp);

        var outVector = rp.clone().sub( ip ).normalize().multiplyScalar( 50 );
        drawArrow(ip, outVector.clone().add( ip ), 5);

        ctx.strokeStyle = "#000";
        circle( ip.x, ip.y, 5 );
    }

    //equivalent to using the geomUtils.bounceVector() method :)

    // ctx.strokeStyle = "#06C";
    // var bv = geomUtils.bounceVector(s,e,line[0], line[1]);
    // drawLine(s, bv[0]);
    // drawLine(bv[0], bv[1]);




}
update();

var mouse = new Point();
mouse.radius = 100;
window.addEventListener( 'mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});



//method to draw an arrow
function drawArrow( p0, p1, size ){
    var a = angle( p0, p1 );
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p0.x + Math.cos( a + HPI ) * size, p0.y + Math.sin( a + HPI ) * size);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p0.x + Math.cos( a - HPI ) * size, p0.y + Math.sin( a - HPI ) * size);
    ctx.fill();
}
function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}
function drawLine( a, b ){
    ctx.beginPath();
    ctx.moveTo( a.x, a.y );
    ctx.lineTo( b.x, b.y );
    ctx.stroke();
}