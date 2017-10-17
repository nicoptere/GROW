

var CatmullRom = function( precision, from, to ) {
    this.precision = precision || 0.1;
    this.from = from || 0;
    this.to = to || 1;

    this.getPointAt = function( t, points, p ){
        if ( points === undefined ) return null;
        if( p  === undefined ) p = {x:0,y:0};
        var i = Math.floor( points.length * t );
        var delta = 1 / points.length;
        t = ( t - ( i * delta ) ) / delta;
        p0 = points [ Math.max( 0,(i - 1) ) ];
        p1 = points [ i ];
        p2 = points [ Math.min( i + 1, points.length -1 ) ];
        p3 = points [ Math.min( i + 2, points.length -1 ) ];
        p.x	=	0.5 * ((2 * p1.x) + t * (( -p0.x + p2.x) + t * ((2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) + t * ( -p0.x + 3 * p1.x - 3 * p2.x + p3.x))));
        p.y = 	0.5 * ((2 * p1.y) + t * (( -p0.y + p2.y) + t * ((2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) + t * ( -p0.y + 3 * p1.y - 3 * p2.y + p3.y))));
        return p;
    };
    this.compute = function( points, from, to, target ){
        from = this.from || from || 0;
        to = this.to || to || 1;
        if(  target === undefined )  target = [];

        var t = Math.min( from, to );
        var max = Math.max( from, to );
        var increment = precision / points.length;
        while ( t < max-( increment/precision )+ increment ) {
            target.push( this.getPointAt( t, points ) );
            t += increment;
        }
        return target;
    };
};
