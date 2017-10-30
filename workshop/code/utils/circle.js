
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
    ctx.clearRect( 0,0,w,h );

    ctx.strokeStyle = "#000";
    circle( c.x, c.y, c.radius );
    circle( mouse.x, mouse.y, mouse.radius );

    //circle contains circle
    if( geomUtils.circleContainsPoint( mouse, c ) ){
        ctx.strokeStyle = "#F00";
        circle(c.x, c.y, c.radius - 1);
    }

    //circle contains circle
    if( geomUtils.circleContainsCircle( c, mouse ) ){
        ctx.strokeStyle = "#FC0";
        circle(c.x, c.y, c.radius - 3);
    }

    //gets the closest point to another point on the circle
    var p = geomUtils.closestPointOnCircle( mouse, c );
    ctx.strokeStyle = "#000";
    circle(p.x, p.y, 3);


    //sets a point on a circle, at a given angle
    var t = Date.now() * 0.001;
    p = geomUtils.setPointAtAngle( t, c );
    ctx.strokeStyle = "#000";
    circle(p.x, p.y, 2);


    //returns the segment between two circles
    var l = geomUtils.circlesDistanceSegment( mouse, c );
    ctx.strokeStyle = "#F00";
    drawLine(l[0], l[1]);


    //computes the tangents to a point
    l = geomUtils.tangentsToPoint( mouse, c );
    if( l != null ){
        ctx.strokeStyle = "#06C";
        drawLine(l[0], mouse);
        drawLine(mouse, l[1]);
    }


    //computes the tangents to a circle
    l = geomUtils.tangentsToCircle( mouse, c );
    if( l != null ){
        ctx.strokeStyle = "#0C6";
        drawLine(l[0], l[1]);
        drawLine(l[2], l[3]);
    }


    //computes the segment representing the circles' intersection
    l = geomUtils.circlesIntersection( mouse, c );
    if( l != null ){
        ctx.strokeStyle = "#C06";
        drawLine(l[0], l[1]);
    }

    //line / segments intersects
    ctx.strokeStyle = "#000";
    var s = new Point( w/4, h*.75 );
    var e = new Point( w/2, h*.35 );
    drawLine(s,e);

    l = geomUtils.lineCircleIntersection( s, e, mouse );
    if( l != null ){
        ctx.fillStyle = "#C06";
        l.forEach( function(p){

            disc( p.x, p.y, 4 );

            //tangent Vector
            ctx.strokeStyle = "#C06";
            var tv = geomUtils.tangentVector( p, mouse ).multiplyScalar(50);
            drawLine(p, tv.clone().add( p ));
            drawLine(p, tv.negate().add( p ));

            var bv = geomUtils.bounceVector(s, p, p, tv );
            ctx.strokeStyle = "#fC0";
            drawLine(bv[0], bv[1]);

        });
    }

    ctx.strokeStyle = "#000";
    s = new Point( w-w/4, h*.5 );
    e = new Point( w-w/3, h*.75 );
    drawLine(s,e);
    l = geomUtils.segmentCircleIntersection( s, e, mouse );
    if( l != null ){
        ctx.fillStyle = "#C06";
        l.forEach( function(p){
            disc( p.x, p.y, 4 );
        });
        if( l.length == 2 ){
            ctx.strokeStyle = "#C06";
            drawLine(l[0], l[1]);
        }
    }



}


var c = new Point(w/2, h/2);
c.radius = h/5;
var mouse = new Point();
mouse.radius = 100;
window.addEventListener( 'mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

update();

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
function disc( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.fill();
}
function drawLine( a, b ){
    ctx.beginPath();
    ctx.moveTo( a.x, a.y );
    ctx.lineTo( b.x, b.y );
    ctx.stroke();
}