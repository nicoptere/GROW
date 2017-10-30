generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    noise.seed(PRNG.random());


    ctx.fillStyle = "#000";
    ctx.fillRect( 0,0,s,s );
    ctx.fillStyle = "#FFF";
    ctx.save();

    var c = new Point( s/2, s/2 );
    c.radius = s / 6;
    var tot = 500;
    var cell = s/tot;
    ctx.globalAlpha = .2;
    for ( var i = 0; i < tot; i++ ){


        var p = new Point( i * cell, 0 );
        var e = new Point( i * cell, s );

        var count = 30;
        var delta = s/100;
        drawBullet( p, e, count, c );

    }

    function drawBullet( s, e, count, c ){

        var tot = count;
        var i = 0;
        // ctx.beginPath();
        // ctx.moveTo( s.x, s.y );
        var sca= 0.005 / unit;
        while( i < tot ){


            var p = s.pointAt( i/tot, e );
            var dist = getDistance(c, p);
            if( dist < c.radius ){
                var dir = c.direction(p).normalize().multiplyScalar( c.radius * .01 );
                s.add( dir );
            }


            var rn = PRNG.centralDifference( p.x, p.y, sca, 2 );
            sca = 1 - ( dist / c.radius );// * 0.01;
            p.y += Math.sin( sca * PI2 ) * delta ;//* unit;
            g.disc( p, 1 + unit * Math.abs( sca * 5 ) )
            i++;

        }
    }


    ctx.restore();
    return LANDSCAPE;

};