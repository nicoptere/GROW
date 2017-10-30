generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    var iteration = 25;
    function update(){

        ctx.save();
        ctx.translate( s/2, s/2 );

        points.forEach(function( p,i ){
           p.lx = p.x;
           p.ly = p.y;
           p.lz = p.z;
        });

        var minZ = Number.POSITIVE_INFINITY;
        var maxZ = Number.NEGATIVE_INFINITY;
        points.forEach(function( p,i ){
            minZ = Math.min( p.z, minZ);
            maxZ = Math.max( p.z, maxZ);
        });
        minZ -= .1;
        maxZ += .1;

        var tmp = new Point();
        points.forEach(function( p,i ){


            var r = Math.sin( norm( p.z, minZ, maxZ ) * PI );

            ctx.globalAlpha = ( 1 - r ) * .5;

            var sca = 0.005 / unit;

            tmp.copy( p ).multiplyScalar(sca);

            var cn = curlNoise( tmp, .01 / unit ).multiplyScalar(.4);

            p.add( cn );

            var thi = ( 1 + r * 5 ) * unit;
            ctx.lineWidth = thi;

            ctx.beginPath();
            ctx.moveTo(p.lx, p.ly );
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

        } );

        ctx.restore();

        if( iteration-->0 ){
            update()
        }

    }

    var points = distribution.sphereUniform( 10000, s/3 );

    update();

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
    return LANDSCAPE;

};
