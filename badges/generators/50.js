generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );



    function drawStrand( count, minZ, maxZ){
        var tmp = new Point();
        var sca = 0.005 / unit;

        for( var i = 0; i < points.length; i++ ){

            var p = points[i];
            var n = normals[i];

            for( var k = 0; k < count ; k++ ){

                ctx.beginPath();
                ctx.globalAlpha = .5;

                ctx.moveTo( p.x, p.y );

                p.add( n );

                tmp.copy( p );

                var cn = curlNoise( tmp.multiplyScalar(sca), 0.05 / unit ).multiplyScalar( sca );//.01 + i/points.length);
                n.add( cn );
                n.normalize();

                ctx.lineTo( p.x , p.y );

                var t = ( Math.sin( PI * k / count ) );
                // if( t < 0 )continue;
                ctx.lineWidth = unit * t * 16; //TODO caler l'échelle
                ctx.stroke();

            }

        }

    }

    var points = distribution.sphereUniform( 100, s/8 );
    var normals = [];
    points.forEach(function( p ){
        normals.push( p.clone().normalize() );
    });

    drawStrand( 5000 );

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
