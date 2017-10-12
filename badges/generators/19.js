
generators[ genId++ ] = function( g, ctx, s, seed, unit ){

    PRNG.setSeed( seed || 0 );

    var count = 10;
    var cellSize = s/count;
    var ran = PRNG.random() * .001;
    var sca = ( .0001 + ran ) / unit;
    var ox = ( PRNG.random() - .5 ) * s;
    var oy = ( PRNG.random() - .5 ) * s;
    for( var i = 0; i < count; i++ ){

        for ( var j = 0; j < count; j++ ){

            var x = i * cellSize;
            var y = j * cellSize;

            var tot = 100;
            for ( var k = 0; k < tot; k+=.5 ){

                ctx.lineWidth = map( k, 0, tot, unit, s/100 * unit, unit );
                ctx.globalAlpha = k/tot;

                var a = PRNG.FBM( (ox + x) * sca, ( oy+y ) * sca, 1 ) * Math.PI * 2;
                if( isNaN( a ) )console.log( a );
                ctx.beginPath();
                ctx.moveTo( x, y );

                x += Math.cos( a ) * s/100;
                y += Math.sin( a ) * s/100;

                ctx.lineTo( x, y );
                ctx.stroke();
            }

        }
    }
    ctx.restore();

};