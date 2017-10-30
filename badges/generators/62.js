generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );
    ctx.rotate( PI / 6 );

    function pointLineDistance( p, a,b ){
        var pp = geomUtils.project(p, a,b );
        return getDistance( p, pp ) / s;
    }


    var min = 120*unit;
    var radius = min * 2.5;
    var points = distribution.sphereUniform(1000, radius )

    var a = PI / 4;// PRNG.random() * PI2;
    var a0 = new Point( 0, -s/2, 0 );
    var a1 = new Point( s, s, 0 );
    a0 = pointAtAngleRadius( a, s/2 )
    a1 = pointAtAngleRadius( a,-s/2 )
    var oct = 3;
    var sca = 0.01 / unit ;

    ctx.lineJoin = ctx.lineCap = "round";
    points.forEach( function (p, i){

        p.x *= 1.;
        p.y *= 1.32;// ( 1 - p.x / radius );
        p.z *= 1;

        var n =  noise.perlin3( p.x * sca, p.y* sca, p.z* sca ) * 2;
        n = PRNG.FBM( p.x * sca, p.y* sca, oct ) *PRNG.FBM( p.y * sca, p.z* sca, oct ) * 1.5;

        var offset = p.clone().normalize( min * n );
        p.add( offset );

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

    var hullAlpha = s/5;
    var convex = hull( data.concat(), hullAlpha );
    var cubic = new CatmullRom(.1, 0,1);
    // var cubic = new CubicPath(.1, 0, true);
    var layers = [];

    while( convex.length > 3 ){
        hullAlpha *= 2;
        layers.push( convex.concat() );
        data = filterHull( data, convex );
        convex = hull( data, hullAlpha );
    }


    for( var i = 0; i < layers.length; i++ ){

        var t = 1 - Math.pow( ( i / layers.length ), 2 );
        ctx.globalAlpha = Math.max( 0, ( t ) - .1 ) * ( 1 / layers.length ) * 4;
        // ctx.lineWidth = unit * ( t ) * 2;
        var pts = cubic.compute( layers[i].map(function(p){return new Point(p[0], p[1]);}), .1, true );
        g.polygon( pts, true);

    }

    ctx.strokeStyle = "#FFF"
    points.forEach( function (p, i){

        points.forEach( function (o, j ){
            if( i === j )return;
            var d = getDistance(p, o);
            if( d > min )return;

            var t = Math.pow( pointLineDistance(p, a0,a1 ), 3.5 );
            ctx.globalAlpha = t;

            t = Math.pow( pointLineDistance(p, a0,a1 ), 3.15 );
            ctx.lineWidth = ( t ) * unit * 50;

            g.line( p, o );

        });

    });


    ctx.restore();
    return PORTRAIT;

};
