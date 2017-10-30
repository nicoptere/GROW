generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    var iteration = 50;
    var G= new Point(0,.1,0)
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

        G.normalize();
        ctx.fillStyle = "#FFF"
        var tmp = new Point();
        points.forEach(function( p,i ){


            var r = Math.sin( norm( p.z, minZ, maxZ ) * PI );

            // ctx.globalAlpha = ( 1 - r ) * .5;

            var sca = 0.005 / unit;

            var n = normals[i];
            p.add( n );
            n.add( G );

            tmp.copy( n ).multiplyScalar(sca).add( p );

            var cn = curlNoise( tmp, 0.1 / unit ).multiplyScalar(0.1);

            var thi = getDistance(n, p) * .14;//* ( 1 + r * 5 ) * unit;
            ctx.save();
            ctx.rotate( getAngle(n, cn) );
            n.add( cn );
            G.add(cn);

            ctx.beginPath();
            ctx.rect( p.x + n.x , p.y + n.y, thi, .16*thi );

            ctx.fill();
            ctx.stroke();
            ctx.restore();

        } );

        ctx.restore();

        if( iteration-->0 ){
            update()
        }

    }

    var points = distribution.sphereUniform( 100, s/6 );
    var normals = [];
    points.forEach(function( p ){
        normals.push( p.clone().normalize() );//.multiplyScalar(20*unit) );//.add( p ) );
        // p.y -= s / 3;
    });

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
