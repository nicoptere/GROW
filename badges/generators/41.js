generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    ctx.save();

    var c = new Point( s/2, s/2 );
    c.radius = s / 6;
    var tot = 1000;
    var cell = s/tot;
    ctx.globalAlpha = .2;
    for ( var i = 0; i < tot; i++ ){


        var p = new Point( i * cell, 0 );
        var e = new Point( i * cell, s );

        var count = 10;
        drawBullet( e, p, count, c );

    }

    function drawBullet( s, e, count, c ){

        var tot = count;
        var i = 0;
        ctx.beginPath();
        ctx.moveTo( s.x, s.y );
        var sca = 0.01 / unit;
        while( i < tot ){

            var p = s.pointAt( i/tot, e );
            var rn = 0;
            rn = PRNG.FBM_legacy( p.x * sca, p.y * sca, 5 );
            rn *= 40 * unit ;
            p.x += rn;
            p.y -= rn;
            ctx.lineTo( p.x, p.y );
            i++;

        }
        ctx.lineTo( e.x, e.y );
        ctx.stroke();

    }
    ctx.restore();
    return LANDSCAPE;

};