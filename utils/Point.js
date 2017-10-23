
var Point = function (x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
};
Point.prototype = {
    add : function(p){
        this.x += p.x;
        this.y += p.y;
        this.z += p.z;
        return this;
    },
    sub : function(p){
        this.x -= p.x;
        this.y -= p.y;
        this.z -= p.z;
        return this;
    },

    cross : function(a,b){
        if( b === null )a = this;
        var p = new Point();
        p.x = a.y * b.z - a.z * b.y;
        p.y = a.z * b.x - a.x * b.z;
        p.z = a.x * b.y - a.y * b.x;
        return p;
    },

    clone : function(){
        return new Point(this.x, this.y, this.z);
    },
    copy : function(p){
        this.x = p.x;
        this.y = p.y;
        this.z = p.z;
        return this;
    },
    set : function(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z||0;
        return this;
    },
    length : function(){
        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    },
    normalize : function( value ){
        var l = this.length();
        this.x/=l;
        this.y/=l;
        this.z/=l;
        if( value != null )this.multiplyScalar(value);
        return this;
    },
    multiplyScalar : function( value ){
        this.x*= value;
        this.y*= value;
        this.z*= value;
        return this;
    },
    direction : function( other ){
        return other.clone().sub(this).normalize();
    },
    negate : function(){
        this.x *= -1;this.y *= -1;this.z *= -1;return this;
    },
    dot : function ( p ){
        return this.x * p.x + this.y * p.y + this.z * p.z;
    },
    equals:function(other){
        return this.x == other.x && this.y == other.y && this.z == other.z;
    },
    midpoint:function(other){
        return new Point( (this.x + other.x) / 2, (this.y + other.y) / 2, (this.z + other.z) / 2);
    },
    pointAt:function( t, other){
        return new Point(
            lerp( t, this.x , other.x),
            lerp( t, this.y , other.y),
            lerp( t, this.z , other.z)
        );
    },

    sphericalCoords : function( theta, phi, radius ) {
        radius = radius || 1;
        this.x = radius * Math.sin(phi) * Math.sin(theta);
        this.y = radius * Math.cos(phi);
        this.z = radius * Math.sin(phi) * Math.cos(theta);
        return this;
    },

    toLonLat : function(){

        var v = this.clone();
        v.normalize();
        var lng = -( Math.atan2( -v.z, -v.x ) ) - Math.PI / 2;
        if( lng < - Math.PI )lng += Math.PI * 2;
        var p = new Point( v.x, 0, v.z );
        p.normalize();
        var lat = Math.acos( p.dot( v ) );
        if( v.y < 0 ) lat *= -1;
        return [ lng,lat ];
    }

};
function getAngle(a,b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.atan2(dy, dx);
}
function cross(a,b){
    var p = new Point();
    p.x = a.y * b.z - a.z * b.y;
    p.y = a.z * b.x - a.x * b.z;
    p.z = a.x * b.y - a.y * b.x;
    return p;
}
function getDistance(a,b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;
    return Math.sqrt(dx*dx + dy*dy+ dz*dz);
}

function pointAtAngleRadius( angle, radius )
{
    return new Point(   Math.cos( angle ) * radius,  Math.sin( angle ) * radius );
}

function midPoint( p0, p1 )
{
    return new Point(p0.x + ( p1.x-p0.x) *.5, p0.y + ( p1.y-p0.y) *.5  );
}

function length( p ){
    return Math.sqrt( ( p.x * p.x ) + ( p.y * p.y ) );
}
