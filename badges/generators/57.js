generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();

    function resetPoint( points ){

        var rp = points[~~( PRNG.random() * points.length ) ];
        var a = PRNG.random() * PI2;
        var r = 10 * unit + PRNG.random() * s / 40;
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

            if( PRNG.random() > .5 ) {
                g.circle(p, p.z * .5 );
            }else{
                g.disc( p, p.z * .1 );
            }

            count--;
        }

    }

    // ctx.lineJoin = "round";
    // ctx.lineCap = "round";
    var trees = [];
    var maxCount = 0;
    points.forEach(function(p, i){
        if( i === 0  )return;

        var tree = [];

        while( p !== null && p !== points[0]  ){

            tree.push( p );
            p = p.parent;

        }

        // tree.push( points[0] );

        trees.push( tree );
        maxCount = Math.max( maxCount, tree.length );

    });

    function filterHull(src, dst){
        var tmp = [];
        src.forEach(function(o){
            var used = false;
            dst.forEach(function(p){
                if( used ) return;
                if( p[0] === o[0] && p[1] === o[1] )used = true;
            });
            if( !used )tmp.push( o );
        });
        return tmp;
    }

    var data = points.map(function(p){return [p.x, p.y ];});

    var hullAlpha = s/10;
    var convex = hull( data.concat(), hullAlpha );
    var curve = new CatmullRom(.1, 0,1);
    var cubic = new CubicPath(.1, 0,1);
    var layers = [];
    while( convex.length > 3 ){

        hullAlpha *= 2;
        layers.push( convex.concat() );
        // g.polyline( convex, true);

        data = filterHull( data, convex );
        convex = hull( data, hullAlpha );

    }


    for( var i = 0; i < layers.length; i++ ){

        var t=  ( i / layers.length );
        // ctx.globalAlpha = ( 1-t ) - .1;
        // ctx.lineWidth = unit * ( 1 - t ) * 3;
        var pts = cubic.compute( layers[i].map(function(p){return new Point(p[0], p[1]);}), .1, true );
        // g.polygon( pts, true);
        g.polyline( pts, true);

    }
    trees.forEach(function( tree ){

        var pts = curve.compute( tree, .1, false );
        ctx.strokeStyle = "#000";


        for( var i = 1; i < pts.length; i++ ){

            var t = 1 - i/pts.length;
        ctx.globalAlpha = t;

            ctx.beginPath();
            ctx.lineWidth = unit + unit * Math.sin( PI * t ) * 3;
            ctx.moveTo( pts[i-1].x, pts[i-1].y );
            ctx.lineTo( pts[i].x, pts[i].y );
            ctx.stroke();

        }

    });
    //*/
    ctx.restore();
    return LANDSCAPE;

};
