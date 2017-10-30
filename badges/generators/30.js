generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);


    ctx.save();
    ctx.shadowColor = "#000";
    // ctx.translate(s/2,s/2);

    var points= [];
    var tot = 20;
    var ang = -PI / 2;
    var step = PI * 2 / tot;
    var r = s * Math.sqrt( 2 ) * .5;

    var cell = s/1000;
    for( var k = 25 * cell; k  < 100 * cell; k += cell * 25 ){

        var tot = s / k;
        ctx.shadowBlur = k;

        var ox = PRNG.random() * s;
        var oy = PRNG.random() * s;
        var sca = unit * .1;
        for( var j = 0; j <= tot; j++ ){
            for( var i = 0; i <= tot; i++ ){

                var a = new Point( k * i, k * j );

                var size = Math.abs( PRNG.FBM( ( ox + a.x ) * sca, ( oy + a.y ) * sca, 2 ) );

                ctx.globalAlpha = size * k/100*unit;
                // ctx.fillRect( a.x,a.y, k, k );

                ctx.beginPath();

                if( PRNG.random() > .38 )continue;
                var ran = PRNG.random();
                if( ran < .25 ){
                    ctx.moveTo( a.x,a.y);
                    ctx.lineTo( a.x + k ,a.y);
                    ctx.lineTo( a.x ,a.y+k);
                }else if( ran < .5 ){
                    ctx.moveTo( a.x + k,a.y);
                    ctx.lineTo( a.x +k,a.y+k);
                    ctx.lineTo( a.x ,a.y+k);
                }else if( ran < .75 ){
                    ctx.moveTo( a.x + k,a.y+k);
                    ctx.lineTo( a.x ,a.y+k);
                    ctx.lineTo( a.x ,a.y );
                }else{
                    ctx.moveTo( a.x,a.y);
                    ctx.lineTo( a.x +k,a.y);
                    ctx.lineTo( a.x +k,a.y+k);
                }

                ctx.fill();

            }

        }
    }
    ctx.restore();

    return LANDSCAPE;
}