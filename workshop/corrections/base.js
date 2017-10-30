
var canvas = document.createElement( 'canvas' );
document.body.appendChild( canvas );
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");

var PI = Math.PI;
var RAD = PI / 180;

function lerp ( t, a, b ){ return a * (1-t) + b * t; }
function norm( t, a, b ){return ( t - a ) / ( b - a );}
function map( t, a0, b0, a1, b1 ){ return lerp( norm( t, a0, b0 ), a1, b1 );}

var Point = function(x,y){
    this.x = x;
    this.y = y;
}
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