
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    /*

    var tmp = new Point();
    var points = [];
    points = distribution.sphereUniform(100, s/4);
    for ( var i = 0; i < 100; i++ ){

        var p = new Point( PRNG.random() * s, PRNG.random() * s, PRNG.random() * s );
        // p = pointAtAngleRadius( ( PRNG.random() * PI2 ), s/4 ).add( new Point( s/2, s/2 ) );
        p = points[i];

        p.children = [];

        var speed = 0.01 + ( Math.sqrt( PRNG.random() *2 ) );
        for( var j = 0; j < 10; j++ ){

            var c = new Point( PRNG.random() - .5 , PRNG.random() - .5 , PRNG.random() - .5  ).normalize();//.copy( p );

            var lola = c.toLonLat();
            c.theta = lola[1];//PRNG.random() * PI2;
            c.phi = lola[0];//PRNG.random() * PI2;
            c.speed = speed;
            c.r = 1 + PRNG.random() * 4;
            c.add(p);

            c.add( tmp.sphericalCoords( c.theta, c.phi, c.speed ) );

            p.children.push( c );

        }

        // points.push( p );

    }
    ctx.translate(s/2,s/2);


    var sca = 0.001 / unit;
    var tot = 100;
    i = tot;
    while( i-- ){

        ctx.globalAlpha = 1 - i / ( tot  );
        ctx.lineWidth = ( 1 - i / tot ) * 3 * unit;
        ctx.beginPath();

        points.forEach( function( p ){

            // ctx.globalAlpha = Math.abs( PRNG.FBM( p.x * 0.1, p.y * 0.1, 2  ) * 2 );

            p.children.forEach( function(c){
                ctx.moveTo( c.x, c.y );
                c.y += unit * 2;
                // c.x += Math.sin( c.x * 0.001 );

                c.add( tmp.sphericalCoords( c.theta, c.phi, c.r ) );

                c.theta += noise.perlin3( c.x * sca, c.y * sca, c.z * sca ) * .5;
                c.phi   += noise.perlin3( c.x * sca, c.y * sca, c.z * sca ) * .5;

                ctx.lineTo( c.x, c.y )

            })

        });
        ctx.stroke();
    }

    //*/
    ctx.restore()

};
