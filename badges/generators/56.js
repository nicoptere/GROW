generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();

    function resetPoint( points ){

        var rp = points[~~( PRNG.random() * points.length ) ];
        var a = PRNG.random() * PI2;
        var r = 10 * unit + PRNG.random() * s / 20;
        var nr = r + rp.z;
        var p = new Point( rp.x + Math.cos( a ) * nr, rp.y + Math.sin( a ) * nr, r );
        p.parent = rp;
        return p;

    }

    var count = 100;
    var p =  new Point(s/2, s/2, s/6 );
    var points = [p];

    var c0 = new Point();
    var c1 = new Point();
    while( count > 0 ){

        var ok = true;
        p = resetPoint( points );
        c0.copy( p );
        c0.radius = p.z;
        points.forEach(function( o ){

            if( !ok )return;

            c1.copy( o );
            c1.radius = o.z;

            ok = getDistance( p, o ) - ( p.z + o.z ) > 0;

        });

        if( ok ){
            points.push( p );
            count--;
        }

    }
    ctx.beginPath();
    var trees = [];
    var maxCount = 0;
    points.forEach(function(p, i){
        if( i === 0  )return;

        var tree = [];

        while( p !== null && p !== points[0]  ){

            tree.push( p );
            p = p.parent;

        }

        tree.push( points[0] );

        trees.push( tree );

        maxCount = Math.max( maxCount, tree.length );

    });

    var cubic = new CubicPath();
    trees.forEach(function( tree ){

        ctx.globalAlpha = .25 * ( 1 / tree.length);
        tree.forEach( function( p ){
            g.disc( p, p.z );
        } );

        var pts = cubic.compute( tree, .1, false );

        ctx.globalAlpha = .5;
        for( var i = 1; i < pts.length; i++ ){
            var t = i/pts.length;

            ctx.beginPath();
            ctx.lineWidth = unit * t * 10;
            ctx.moveTo( pts[i-1].x, pts[i-1].y );
            ctx.lineTo( pts[i].x, pts[i].y );
            ctx.stroke();

        }

    });

    ctx.restore();

};
