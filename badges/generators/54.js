generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );


    var points = distribution.sphereUniform( 100, s/4 );
    var normals = [];
    points.forEach(function( p ){
        normals.push( p.clone().normalize() );
    });

    var t = new Point();
    var sca = 0.005 / unit;
    points.forEach(function( p, id ){

        ctx.globalAlpha = .05;
        var n = normals[id];
        var tot = 250;
        for ( var i = 0; i < tot; i++ ) {


            p.add( n.normalize( lerp( i/tot, 10 * unit, s/Math.sqrt( 2 ) ) * 1/tot ) );
            p.add( curlNoise( n, .5 / unit ) );

            var r = Math.max( 0, 100 * unit * noise.perlin3(p.x*sca, p.y*sca, p.z*sca ) );
            if( r === 0 ) return;
            g.disc(p, r );

        }

    });



    function curlNoise( p, delta ){

        var p_x0 = noise.perlin3( p.x-delta, p.y, p.z );
        var p_x1 = noise.perlin3( p.x+delta, p.y, p.z );
        var p_y0 = noise.perlin3( p.x, p.y-delta, p.z );
        var p_y1 = noise.perlin3( p.x, p.y+delta, p.z );
        var p_z0 = noise.perlin3( p.x, p.y, p.z-delta );
        var p_z1 = noise.perlin3( p.x, p.y, p.z+delta );

        var x = p_y1 - p_y0 - p_z1 + p_z0;
        var y = p_z1 - p_z0 - p_x1 + p_x0;
        var z = p_x1 - p_x0 - p_y1 + p_y0;

        var divisor = 1.0 / ( 2.0 * delta );
        return new Point( x , y , z ).normalize().multiplyScalar( divisor );

    }

    ctx.restore();
    return LANDSCAPE;

};
