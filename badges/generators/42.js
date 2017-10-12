generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    noise.seed(PRNG.random());



    ctx.save();

    var c = new Point( s/2, s/3 );
    c.radius = s / 6;
    var tot = 500;
    var cell = s/tot;
    ctx.globalAlpha = .2;
    for ( var i = 0; i < tot; i++ ){


        var p = new Point( i * cell, 0 );
        var e = new Point( i * cell, s );

        var count = 150;
        drawBullet( p, e, count, c );

    }

    function drawBullet( s, e, count, c ){

        var tot = count;
        var i = 0;
        ctx.beginPath();
        ctx.moveTo( s.x, s.y );
        var sca = 0.005 / unit;//TODO reporter l'échelle des noise partout
        while( i < tot ){


            var p = s.pointAt( i/tot, e );


            var dist = getDistance(c, p);
            if( dist < c.radius ){
                var dir = c.direction(p).normalize().multiplyScalar(c.radius * .05 );
                s.add( dir );
            }
            // sca = ( 1 - dist / c.radius ) * 0.01;

            var rn = noise.FBM( p.x * sca, p.y * sca, 3 ) * ( .15 );

            rn *= 50 * unit ;
            p.x += rn;
            p.y -= rn;
            ctx.lineTo( p.x, p.y );
            i++;

        }
        ctx.lineTo( e.x, e.y );
        ctx.stroke();

    }


    ctx.restore();

};