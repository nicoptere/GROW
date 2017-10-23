
function logo(ctx, unit, s, name ) {


    ctx.globalAlpha = .1;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, s, s);

    ctx.globalAlpha = 1;


    var xy = s / 2 - s / 3;
    var wh = ( s / 3 ) * 2;


    // ctx.drawImage(img, 0, 0, s, s, xy,xy, wh,wh );
    // g.disc(xy, xy, 2);
    // g.disc(xy + wh, xy, 2);
    // g.disc(xy + wh, xy + wh, 2);
    // g.disc(xy, xy + wh, 2);
    // ctx.strokeRect(xy, xy, wh, wh);

    var iw = img.width;
    var ih = img.height;

    var scale = ( wh / iw );
    console.log(scale, iw, ih);

    var w = iw * scale;
    var h = ih * scale;

    var x = s / 2 - w / 2;
    var y = ( s / 2 + s / 6 ) - h / 2;


    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 10 * unit;

    ctx.drawImage(img, x, y, w, h);
    // ctx.strokeRect(x, y, w, h);


    // console.log( img.width, img.height, img.width / img.height, wh );


    ctx.fillStyle = "#EFEFEF";
    var size = s / 10;
    ctx.font = ~~( size ) + "px Arial";
    if( ctx.measureText(name).width > w ){
        while ( ctx.measureText(name).width > w ) {
            size *= .99;
            ctx.font = ~~( size ) + "px Arial";
        }
    }else{
        while ( ctx.measureText(name).width < w ) {
            size *= 1.01;
            ctx.font = ~~( size ) + "px Arial";
        }
    }

    ctx.fillText(name, xy, xy + wh);


    // ctx.shadowBlur = 0;
    //
    // segment( ctx, s, 8 );

    // ctx.clearRect(0,0,s,s)
    //
    // var o = new Point()
    // var p = new Point( 20, 10 )
    // var n = new Point( -p.y, p.x );
    //
    // ctx.translate( s/2,s/2 );
    //
    // g.line( o, p)
    // g.line( o, n)

    function segment( context, s, steps ){

        // var canvas = document.createElement("canvas");
        // canvas.width = s;
        // canvas.height = s;

        // var context = canvas.getContext("2d");
        // context.fillStyle = "rgba(255,255,255,255)";
        // context.fillRect(0, 0, s, s);
        // context.drawImage(imageOrCanvas, 0, 0 );

        var imgData = context.getImageData(0, 0, s, s);
        var data = imgData.data;
        var div = ( 0xFF / steps );
        for( var i = 0; i < data.length; i += 4 ){
            data[i]     = parseInt(parseInt( ( data[i] / 0xFF ) * steps + .5 ) * div );
            data[i + 1] = parseInt(parseInt( ( data[i + 1] / 0xFF ) * steps + .5 ) * div );
            data[i + 2] = parseInt(parseInt( ( data[i + 2] / 0xFF ) * steps + .5 ) * div );
        }

        imgData.data = data;
        context.putImageData( imgData, 0, 0 );
        return context;
    }

}