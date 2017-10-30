generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    ctx.save();

    // perimeter accumulator to compute the lengt / angle ratio
    var sum = 0;
    // length accumulator to compute the lengt / angle ratio
    var acc = 0;
    var count = 15 + parseInt( PRNG.random() * 10 );
    var rects = [];

    var minWidth = 10 * unit;
    var maxWidth = 100 * unit;
    var minHeight = 50 * unit;
    var maxHeight = 100 * unit;

    for( var i  = 0; i < count; i++ ){
        var r = new Rect( 0,0, minWidth+ PRNG.random() * ( maxWidth - minWidth ), minHeight + PRNG.random() * ( maxHeight - minHeight ) );
        rects.push( r );
        sum += r.w;
    }

    var radius = ( sum / 2 ) / Math.PI;
    for( i = 0; i < count; i++ ){

        ctx.save();
        ctx.translate(s/2,s/2);

        r = rects[ i ];

        //start angle: accumulation of all prvious rects
        var start = map( acc, 0, sum, 0, Math.PI * 2 );
        acc += r.w;
        var next = map( acc, 0, sum, 0, Math.PI * 2 );

        //angle span: the angle span covered by this rectangle
        var span = map( r.w, 0, sum, 0, Math.PI * 2 );


        var sp = pointAtAngleRadius( start, radius + r.h );
        var np = pointAtAngleRadius( next, radius + r.h );

        ctx.globalAlpha = .25;

        var p0 = pointAtAngleRadius( start, radius );
        var p1 = pointAtAngleRadius( start + span, radius );
        var p2 = pointAtAngleRadius( start + span, radius + r.h   );
        var p3 = pointAtAngleRadius( start, radius + r.h );
        var p4 = pointAtAngleRadius( start + span * .5, radius + r.h * 1.5 );
        var c = pointAtAngleRadius( start + span * .5, radius + r.h * .75 );
        c.z=1;

        g.line( p2, p1);
        var poly = [p0, p1, p2, p4, p3 ];


        var light = new Point( 0,1000, 500 ).normalize();

        g.line( p0, p1 );

        poly.forEach(function( p, i, arr ){

            var n = arr[ ( i+1 ) % arr.length ];
            c.z = 10;

            var normal = cross( c.clone().sub( p ), c.clone().sub( n ) ).normalize();
            ctx.globalAlpha = map( light.dot( normal ), -1, 1, 0.95, .0 );

            ctx.beginPath();
            ctx.moveTo( n.x, n.y );
            ctx.lineTo( c.x, c.y );
            ctx.lineTo( p.x, p.y );
            ctx.lineTo( n.x, n.y );
            ctx.fill();
            ctx.globalAlpha = .25;
            ctx.stroke()


        });

        ctx.restore();

    }

    function Rect( x,y,w,h )
    {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w;
        this.h = h;
    }

    ctx.restore();
    return PORTRAIT;
};
