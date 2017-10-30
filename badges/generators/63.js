generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    var lines = [];
    for( var i = 0; i < 1000; i++ ){
        lines.push( [
                new Point( PRNG.random() * s, PRNG.random() * s, 0 ),
                new Point( PRNG.random() * s, PRNG.random() * s, 0 )
            ]
        );
    }
    var center = new Point(s/2,s/2);
    center.radius =  s/3.25;

    g.disc( center, center.radius * .9 );

    lines.forEach(function( l ){

        var bvs = geomUtils.circleBounceVectors( l[0], l[1], center );
        if( bvs === null )return;
        bvs.forEach( function(bv, i) {

            if( bv === null )return;
            var p = bv[0];
            var grad;
            var l = ( p.clone().sub(bv[1]).length() ) * .5;
            if( geomUtils.vectorsHaveSameDirection(  center, p,p, bv[1] ) ){

                grad = ctx.createRadialGradient( p.x,p.y, 0, p.x, p.y, l );
                // grad.addColorStop( 0, "#FFF" );
                // grad.addColorStop( 1, "rgba(255, 255, 255, 0 )" );
                grad.addColorStop( 0, "rgba( 0, 0, 0, 1 )" );
                grad.addColorStop( 1, "rgba( 0, 0, 0, 0 )" );

            }else{
                grad = ctx.createRadialGradient( p.x,p.y, 0, p.x, p.y, l * .5 );
                // grad.addColorStop( 0, "#000" );
                // grad.addColorStop( 1, "rgba(0, 0, 0, 0 )" );
                grad.addColorStop( 0, "rgba(255, 255, 255, 1 )" );
                grad.addColorStop( 1, "rgba(255, 255, 255, 0 )" );
            }

            ctx.strokeStyle = grad;
            ctx.lineWidth = unit * PRNG.random() * 2;
            g.line( bv[0], bv[1]);

        });

    });

    ctx.restore();
    return PORTRAIT;

};