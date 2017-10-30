generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();

    var c = new Point( s/2, s/2 );
    c.radius = s / 6;
    var tot = 1000;
    var cell = s/tot;
    ctx.globalAlpha = .1;
    for ( var i = 0; i < tot; i++ ){


        var p = new Point( i * cell, 0 );
        var e = new Point( i * cell, s );

        var count = 100;
        drawBullet( e, p, count, 3, c );

    }

    function drawBullet( s, e, count, size, c ){

        var d = getDistance(s,e);
        size *= unit;
        var tot = count;
        var i = 0;
        ctx.beginPath();
        var sca = 0.01 / unit;
        while( i < tot ){

            var p = s.pointAt( i/tot, e );
            var p0 = s.pointAt( 0, e );
            var p1 = s.pointAt( 1, e );


            var rn = 0;

            rn =  PRNG.FBM_legacy( p.x * sca, p.y * sca, 6 )      ;//* 40 * unit;
            rn *= PRNG.FBM_legacy( p0.x * sca, p0.y * sca, 6 )   ;//* 20 * unit;
            rn += PRNG.FBM_legacy( p1.x * sca, p1.y * sca, 6 )   ;//* 10 * unit;

            rn *= 40 * unit;
            p.x += rn;
            p.y -= rn;


            ctx.lineTo( p.x, p.y );
            i++;

        }
        ctx.stroke();

    }

    ctx.restore();
    return LANDSCAPE;

};