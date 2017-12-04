
function distance( a,b ){
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt( dx*dx+dy*dy );
}

function angle( a,b ){
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.atan2( dy,dx );
}


function areaABC( a,b,c ){
    var side1 = getDistance(a,b)
    var side2 = getDistance(b,c)
    var side3 = getDistance(c,a)
    var perimeter = (side1 + side2 + side3)/2;
    return Math.sqrt(perimeter*((perimeter-side1)*(perimeter-side2)*(perimeter-side3)));
}

var PI = Math.PI;
var HPI = PI / 2;
var PI2 = PI * 2;
var RAD = PI / 180;
var DEG = 180 / PI;
function lerp ( t, a, b ){ return a * (1-t) + b * t; }
function norm( t, a, b ){return ( t - a ) / ( b - a );}
function map( t, a0, b0, a1, b1 ){ return lerp( norm( t, a0, b0 ), a1, b1 );}
