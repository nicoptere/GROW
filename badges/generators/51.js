generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );

    function subdivide( count, p0, p1, p2 ) {

        if( count === 0 ){

            ctx.beginPath();
            ctx.moveTo( p0.x, p0.y );
            ctx.lineTo( p1.x, p1.y );
            ctx.lineTo( p2.x, p2.y );
            ctx.lineTo( p0.x, p0.y );
            ctx.stroke();

            return;
        }

        var m0 = p0.pointAt( .5, p1 );
        var m1 = p1.pointAt( .5, p2 );
        var m2 = p2.pointAt( .5, p0 );

        m0.add( curlNoise( m0, ( PRNG.random() * 0.1 ) / unit ) );
        m1.add( curlNoise( m1, ( PRNG.random() * 0.1 ) / unit ) );
        m2.add( curlNoise( m2, ( PRNG.random() * 0.1 ) / unit ) );

        count--;
        subdivide(count, p0, m0, p1 );
        subdivide(count, p1, m1, p2 );
        subdivide(count, p2, m2, p0 );
        subdivide(count, m0, m1, m2 );

    }

    ctx.globalAlpha = .1;
    var a = new Point( 0, -s);
    var b = new Point( s, s);
    var c = new Point( -s, s);
    subdivide(8, a,b,c );

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
