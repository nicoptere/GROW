
generators[ genId++ ] = function( g, ctx, s, seed, unit ){

    PRNG.setSeed( seed || 0 );


    var count = 10;
    var cellSize = s/count;

    var ran = PRNG.random();
    var sca = ( .001 + ran * 0.001 )  / unit;
    // g.ctx.globalAlpha = .2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for( var i = 0; i < count; i++ ){

        for ( var j = 0; j < count; j++ ){

            var x = i * cellSize;
            var y = j * cellSize;

            var tot = 100;
            for ( var k = 0; k < tot; k+=.25 ){

                ctx.lineWidth = map( k, 0, tot, unit, s / ( 20 * unit ), unit );

                var a = PRNG.FBM( x * sca, y * sca, 1 ) * Math.PI * 2;

                ctx.beginPath();
                ctx.moveTo( x, y );

                x += Math.cos( a ) * s / ( 100 * unit);
                y += Math.sin( a ) * s / ( 100 * unit);

                ctx.lineTo( x, y );
                ctx.stroke();
            }

        }
    }
    ctx.restore();
    return LANDSCAPE;
};