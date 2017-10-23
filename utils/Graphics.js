/**
 * usage :
 var G = new Graphics( ctx );
 G.line( p0, p1 )
 G.circle( x, y, radius )
 etc.
 * @param ctx canvas 2d context
 * @returns {{}} wraps some methods
 * @constructor
 */

var Graphics = function( ctx )
{

    var exports = {};
    exports.getCanvas = function(w,h,append){
        var can = document.createElement("canvas");
        can.width = w || window.innerWidth;
        can.height = h || window.innerHeight;
        return can;
    };

    exports.getContext = function(w,h){
        var can = exports.getCanvas(w,h);

        return can.getContext('2d');
    };

    exports.ctx = ctx;
    exports.line = function( x0, y0, x1, y1 )
    {
        //permet de passer 2 points au lieu des coordonnées X0, Y0, X1, Y1
        if( x0.x != null && y0.x != null )return exports.line( x0.x, x0.y, y0.x, y0.y );
        exports.ctx.beginPath();
        exports.ctx.moveTo( x0, y0 );
        exports.ctx.lineTo( x1, y1 );
        exports.ctx.stroke();
    };

    exports.text = function( text, font, size, x,y )
    {
        exports.ctx.font = size + "pt " + ( font || "Verdana" );
        exports.ctx.fillText( text, x||0, y||0 );
    };

    exports.polyline = function( points, closed )
    {
        if( points[0].x == null )points = points.map( function(p){return {x:p[0], y:p[1]}});
        exports.ctx.beginPath();
        points.forEach( function( p )
        {
            exports.ctx.lineTo( p.x, p.y );
        });
        if( Boolean( closed ) )exports.ctx.closePath();
        exports.ctx.stroke();
    };

    exports.polygon = function( points, closed )
    {
        if( points[0].x == null )points = points.map( function(p){return {x:p[0], y:p[1]}});
        exports.ctx.beginPath();
        points.forEach( function( p )
        {
            exports.ctx.lineTo( p.x, p.y );
        });
        if( Boolean( closed ) == true )exports.ctx.closePath();
        exports.ctx.fill();
    };

    exports.arc = function( x, y, radius, angle, length )
    {
        //permet de passer un point et un rayon au lieu de X, Y et Rayon
        if(x.x != null )return exports.arc(x.x, x.y, y, radius, angle );
        exports.ctx.beginPath();
        exports.ctx.arc( x, y, radius, angle, length, length < 0 );
        exports.ctx.stroke();
    };

    exports.sector = function( x, y, radius, angle, length )
    {
        //permet de passer un point et un rayon au lieu de X, Y et Rayon
        if(x.x != null )return exports.sector(x.x, x.y, y, radius, angle );
        exports.ctx.beginPath();
        exports.ctx.moveTo( x, y );
        exports.ctx.arc( x, y, radius, angle, length, length < 0 );
        exports.ctx.closePath();
        exports.ctx.stroke();
    };

    exports.sectorFilled = function( x, y, radius, angle, length )
    {
        //permet de passer un point et un rayon au lieu de X, Y et Rayon
        if(x.x != null )return exports.sectorFilled(x.x, x.y, y, radius, angle );
        exports.ctx.beginPath();
        exports.ctx.moveTo( x, y );
        exports.ctx.arc( x, y, radius, angle, length, length < 0 );
        exports.ctx.closePath();
        exports.ctx.fill();
    };

    exports.circle = function( x, y, radius )
    {
        //permet de passer un point et un rayon au lieu de X, Y et Rayon
        if(x.x != null )return exports.circle(x.x, x.y, x.radius || y );
        exports.ctx.beginPath();
        exports.ctx.arc( x, y, radius, 0, Math.PI * 2 );
        exports.ctx.stroke();
    };

    exports.disc = function( x, y, radius )
    {
        //permet de passer un point et un rayon
        if(x.x != null )return exports.disc(x.x, x.y, y );
        exports.ctx.beginPath();
        exports.ctx.arc( x, y, radius, 0, Math.PI*2 );
        exports.ctx.fill();
    };

    exports.strokeRing = function( x,y, radiusIn, radiusOut, angle, length )
    {
        //permet de passer un point au lieu de x, y
        if(x.x != null )return exports.strokeRing(x.x, x.y, y, radiusIn, radiusOut, angle );

        angle = angle || 0;
        length = length || Math.PI * 2;

        var ia = Math.min( angle, length );
        var oa = Math.max( angle, length );

        var center = new Point(x,y);
        var i0 = Point.fromAngleDistance( ia, radiusIn ).add( center );
        //var i1 = Point.fromAngleDistance( oa, radiusIn ).add( center );
        var o1 = Point.fromAngleDistance( oa, radiusOut ).add( center );
        //var o0 = Point.fromAngleDistance( ia, radiusOut ).add( center );

        exports.ctx.beginPath();
        exports.ctx.arc( x, y, radiusIn, ia, oa, false );
        exports.ctx.lineTo( o1.x, o1.y );
        exports.ctx.arc( x, y, radiusOut, oa, ia, true );
        exports.ctx.lineTo( i0.x, i0.y );
        exports.ctx.stroke();

    };

    exports.fillRing = function( x,y, radiusIn, radiusOut, angle, length )
    {
        //permet de passer un point au lieu de x, y
        if(x.x != null )return exports.fillRing(x.x, x.y, y, radiusIn, radiusOut, angle );

        angle = angle || 0;
        length = length || Math.PI * 2;

        var ia = Math.min( angle, length );
        var oa = Math.max( angle, length );

        var center = new Point(x,y);
        var i0 = pointAtAngleRadius( ia, radiusIn ).add( center );
        //var i1 = Point.fromAngleDistance( oa, radiusIn ).add( center );
        var o1 = pointAtAngleRadius( oa, radiusOut ).add( center );
        //var o0 = Point.fromAngleDistance( ia, radiusOut ).add( center );

        exports.ctx.beginPath();
        exports.ctx.arc( x, y, radiusIn, ia, oa, false );
        exports.ctx.lineTo( o1.x, o1.y );
        exports.ctx.arc( x, y, radiusOut, oa, ia, true );
        exports.ctx.lineTo( i0.x, i0.y );
        exports.ctx.fill();

    };

    exports.quadCurve = function( a,b,c )
    {
        exports.ctx.beginPath();
        exports.ctx.moveTo(a.x, a.y );
        exports.ctx.quadraticCurveTo(b.x, b.y, c.x, c.y );
        exports.ctx.stroke();
    };

    exports.bezierCurve = function( a,b,c,d )
    {
        exports.ctx.beginPath();
        exports.ctx.moveTo(a.x, a.y );
        exports.ctx.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y );
        exports.ctx.stroke();
    };

    exports.graduation = function( x0,y0, x1,y1, count, width )
    {
        //permet de passer un point au lieu de x, y
        if( x0.x != null && y0.x != null )return exports.graduation( x0.x, x0.y, y0.x, y0.y, x1, y1 );

        G.line(  x0,y0, x1,y1 );
        var p = new Point();
        var n = new Point( -( y1 - y0 ),  ( x1 - x0 ) );
        n.normalize( width || 5 );

        for( var i = 0; i <= count; i++ )
        {
            var t = i/count;
            p.x = lerp( t, x0, x1 );
            p.y = lerp( t, y0, y1 );
            G.line( p, Point.add( p,n ) );
        }

    };


    //method to draw an arrow
    exports.drawArrow = function( p0, p1, size ){
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        var a = Math.atan2( dy, dx );
        exports.ctx.beginPath();
        exports.ctx.moveTo(p0.x, p0.y);
        exports.ctx.lineTo(p0.x + Math.cos( a + HPI ) * size, p0.y + Math.sin( a + HPI ) * size);
        exports.ctx.lineTo(p1.x, p1.y);
        exports.ctx.lineTo(p0.x + Math.cos( a - HPI ) * size, p0.y + Math.sin( a - HPI ) * size);
        exports.ctx.fill();
    };

    return exports;
};