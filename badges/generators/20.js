
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

            if( PRNG.random() > .75 )continue;

            var skip = 1 + ~~( PRNG.random() * s/500 );
            var thi = ( PRNG.random() * s/100 ) * unit;

            var tot = 150;

            ctx.shadowColor = "#000";
            ctx.shadowBlur = thi;
            ctx.globalAlpha = .75;

            var delta = s / 500;
            var octaves = 2;
            for ( var k = 0; k < tot; k++ ){

                var t = map( k, 0, tot, 0, thi );
                ctx.lineWidth = ( Math.sin( k/tot * Math.PI * 2 ) * thi );

                var a = PRNG.FBM( (ox + x) * sca, ( oy+y ) * sca, octaves ) * Math.PI * octaves;

                ctx.beginPath();
                ctx.moveTo( x, y );

                x += Math.cos( a ) * delta;
                y += Math.sin( a ) * delta;

                ctx.lineTo( x, y );
                if( k%skip !== 0 )ctx.stroke();

            }
            ctx.shadowBlur = 0;

            x = i * cellSize;
            y = j * cellSize;
            ctx.globalAlpha = .25;
            ctx.lineWidth = unit;
            ctx.beginPath();
            for ( k = 0; k < tot; k++ ){
                a = PRNG.FBM( (ox + x) * sca, ( oy+y ) * sca, octaves ) * Math.PI * octaves;
                ctx.moveTo( x, y );
                x += Math.cos( a ) * delta;
                y += Math.sin( a ) * delta;
                ctx.lineTo( x, y );
            }
            ctx.stroke();
        }
    }
    ctx.restore();

};