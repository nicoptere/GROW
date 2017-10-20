generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );

    function pointLineDistance( p, a,b ){
        var pp = geomUtils.project(p, a,b );
        return getDistance( p, pp ) / s;
    }


    var min = 120*unit;
    var radius = min * 2;
    var points = distribution.sphereUniform(1000, radius )

    var a = PI / 2;// PRNG.random() * PI2;
    var a0 = new Point( 0, -s/2, 0 );
    var a1 = new Point( s, s, 0 );
    a0 = pointAtAngleRadius( a, s/2 )
    a1 = pointAtAngleRadius( a,-s/2 )
    // g.line( a0, a1 )
    var oct = 2;
    var sca = 0.01 / unit ;

    ctx.lineJoin = ctx.lineCap = "round";
    points.forEach( function (p, i){

        var n =  noise.perlin3( p.x * sca, p.y* sca, p.z* sca );
        n = PRNG.FBM( p.x * sca, p.y* sca, oct ) *PRNG.FBM( p.y * sca, p.z* sca, oct );

        var offset = p.clone().normalize( min * n );
        p.add( offset );
        p.x *= 2.;
        p.y *= .9;// ( 1 - p.x / radius );
        p.z *= .5;

        points.forEach( function (o, j ){
            if( i === j )return;
            var d = getDistance(p, o);
            if( d > min )return;

            var t = Math.pow( pointLineDistance(p, a0,a1 ), 1 );
            ctx.globalAlpha = t;
            var t = Math.pow( pointLineDistance(p, a0,a1 ), 3.5 );
            ctx.lineWidth = ( t ) * unit * 50;

            g.line( p, o );

        });

    });

    ctx.restore();

};
