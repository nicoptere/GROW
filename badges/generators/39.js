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

    /*

    var or = s / 3;
    var o = new Point( s/2, s * .1 );
    var c = new Point( s/2, s/2 );
    c.radius = s / 6;
    var d = new Point( s/2, s - s * .1 );
    // g.circle( o, 20 );
    // g.circle( c, c.radius );
    // g.circle( d, 20 );


    var src = [];
    var dst = [];

    for ( var i = 0; i < 100; i++ ){

        var a = PRNG.random() * PI2;
        var r = 1 - Math.sqrt( PRNG.random() ) * or;
        var st = new Point(
            o.x + Math.cos( a ) * r,
            o.y + Math.sin( a ) * r * .25
        );
        var en = new Point(
            d.x + Math.cos( a ) * r,
            d.y + Math.sin( a ) * r * .25
        );

        // g.disc( st, 2 );
        // g.circle( en, 2 );

        var bv = geomUtils.circleBounceVectors(  st, en, c, true );
        var count = 5 + PRNG.random() * 20;
        if( bv !== null ){

            // drawBullet( bv[2][1], bv[0][0], 5 + PRNG.random() * 10 )

            // g.line( st, bv[2][0] )
            // g.line( bv[0][0], en )

            // drawBullet( st, bv[2][0], 5 + PRNG.random() * 10, 3 );
            //
            // drawBullet( bv[1][0], bv[2][0], 15 + PRNG.random() * 10, 3, c );
            //
            // drawBullet( bv[0][0], en, 5 + PRNG.random() * 10, 1 );

            drawBullet( en, st, count, 3, c );

        }else{
            linearBullet( st, en, count, 2 );
            // g.line( st, en );
        }

    }

    function linearBullet( s, e, count, size, c ) {
        size *= unit;
        var tot = count;
        var i = 0;
        while (i < tot) {
       var p = s.pointAt(i / tot, e);
            var si = ( PRNG.random() * size + .1 * unit);
            ctx.fillStyle = "#000";
            g.disc(p, si);
            ctx.fillStyle = "#FFF";
            g.disc(p, si * .5);
            i++;
        }
    }
    function drawBullet( s, e, count, size, c ){

        var d = getDistance(s,e);
        size *= unit;
        var tot = count;
        var i = 0;
        while( i < tot ){

            var p = s.pointAt( i/tot, e );
            if( c !== null ){
                var dir = c.direction( p ).normalize().multiplyScalar( 150 * (1- i/tot) * size )
                p.add( dir );
            }

            ctx.fillStyle = "#000";
            g.disc( p, i/tot * size  );
            ctx.fillStyle = "#FFF";
            g.disc( p, i/tot * size * .5  );
            i++;
        }

    }
    //*/

    ctx.restore();

};