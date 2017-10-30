generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    ctx.save();

    var c = new Point( s/2, s/2 );
    c.radius = s / 6;

    var tot = 250;
    var cell = s/tot;
    ctx.globalAlpha = .25;
    for ( var i = 0; i < tot; i++ ){


        var p = new Point( i * cell, 0 );
        var e = new Point( i * cell, s );

        var count = 100;// + PRNG.random() * 100;
        drawBullet( e, p, count, 3, c );


    }

    function drawBullet( s, e, count, size, c ){

        var d = getDistance(s,e);
        var tot = count;
        var i = 0;
        var sca = 0.01 / unit;
        ctx.beginPath();
        while( i < tot ){

            var p = s.pointAt( i/tot, e );
            p.x += PRNG.FBM_legacy( p.x * sca, p.y * sca, 6 ) * 20 * unit;
            p.y += PRNG.FBM_legacy( p.x * sca, p.y * sca, 6 ) * 50 * unit;
            ctx.lineTo( p.x, p.y );
            i++;

        }
        ctx.stroke();

    }


    ctx.restore();
    return LANDSCAPE;

};