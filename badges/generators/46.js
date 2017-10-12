generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    var iteration = 250;
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

        points.forEach(function( p,i ){


            ctx.beginPath();

            var r = norm( Math.abs( p.z ), minZ, maxZ );
            if( isNaN(r))return;
            ctx.globalAlpha = 1 - r;

            var sca = 0.005 / unit;
            p.multiplyScalar( 1 + noise.perlin3( p.x * sca, p.y * sca, p.z * sca ) * .25 );

            ctx.arc( p.x, p.z, ( 1 + r * 15 ) * unit, 0, Math.PI * 2 );
            ctx.fill();

        } );

        ctx.restore();

    }

    var points = distribution.sphereUniform( 10000, s/3 );

    update();


};
