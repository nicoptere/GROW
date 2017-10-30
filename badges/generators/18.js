
generators[ genId++ ] = function( g, ctx, s, seed, unit ){

    PRNG.setSeed( seed || 0 );


    var count = 100;
    var cellSize = s/count;

    ctx.save();
    var ran = PRNG.random();
    var sca = ( .001 + ran * 0.001 ) / unit;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = s/100;
    g.ctx.globalAlpha = .5;
    for( var i = 0; i < count; i++ ){

        for ( var j = 0; j < count; j++ ){

            if( PRNG.random() > .1 )continue;
            ctx.shadowColor = i%2 === 0 ? "#000":"#FFF";
            ctx.shadowBlur = ( i%2 === 1 ? s/100 : s / 200 ) * unit;
            var x = i * cellSize;
            var y = j * cellSize;

            var tot = 100;
            ctx.beginPath();
            ctx.lineWidth = Math.sqrt( PRNG.random() ) * s/100;// * unit;
            for ( var k = 0; k < tot; k++ ){


                var a = PRNG.FBM( x * sca, y* sca, 1 ) * Math.PI * 2;

                ctx.moveTo( x, y );

                x += Math.cos( a ) * s/500;
                y += Math.sin( a ) * s/500;

                ctx.lineTo( x, y )
            }
                ctx.stroke();

        }
    }
    ctx.restore();

    return LANDSCAPE;
};