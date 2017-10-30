generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );
    ctx.rotate( PI / 4 );

    var tot = 5
    function subdivide( count, p0, p1, p2 ) {

        p0.normalize(s/2.5);//Math.sqrt(2));
        p1.normalize(s/2.5);//Math.sqrt(2));
        p2.normalize(s/2.5);//Math.sqrt(2));

        var c = p0.clone().add(p1).add( p2).multiplyScalar(1/3);
        if( count === 0 ){

            ctx.globalAlpha = .75 * noise.perlin2(p0.x, p0.y);// ( 1 - c.length() / s );// / ( s * s );//PRNG.random() * .25;
            // ctx.lineWidth = unit * 2 * ( 1 - c.length() / s );// / ( s * s );//PRNG.random() * .25;

            ctx.beginPath();
            ctx.moveTo( p0.x, p0.y );
            ctx.lineTo( p1.x, p1.y );
            ctx.lineTo( p2.x, p2.y );
            ctx.lineTo( p0.x, p0.y );
            ctx.fill();

            // g.disc( c, unit * Math.sqrt( Math.sqrt( areaABC(p0, p1, p2 ))) );
            g.line( c, p0 );
            g.line( c, p1 );
            g.line( c, p2 );


            return;
        }
        else
        {

            count--;

            var m0 = p0.pointAt( .5, p1 );
            var m1 = p1.pointAt( .5, p2 );
            var m2 = p2.pointAt( .5, p0 );

            m0.add( curlNoise( m0, 0.01 / unit ) );
            m1.add( curlNoise( m1, 0.01 / unit ) );
            m2.add( curlNoise( m2, 0.01 / unit ) );

            if( PRNG.random()>.15 ) subdivide(count, p0, m0, m2 );
            if( PRNG.random()>.15 ) subdivide(count, m0, p1, m1 );
            if( PRNG.random()>.15 ) subdivide(count, m1, m2, p2 );

            subdivide(count, m0, m1, m2 );
        }

    }

    var a = new Point( -s * .5, -s * .5 ).multiplyScalar(.8);
    var b = new Point(  s * .5, -s * .5 ).multiplyScalar(.8);
    var c = new Point(  s * .5,  s * .5 ).multiplyScalar(.8);
    var d = new Point( -s * .5,  s * .5 ).multiplyScalar(.8);
    subdivide( tot, a,b,c );
    subdivide( tot, a,c,d );



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
    return PORTRAIT;

};
