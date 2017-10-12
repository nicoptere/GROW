function logo( ctx, s ){


    ctx.globalAlpha = .1;
    ctx.fillRect( 0,0,s,s );

    ctx.globalAlpha = 1;

    var xy = s/2 - s/3;
    var wh = ( s/3 ) * 2;
    ctx.drawImage(img, 0, 0, img.width, img.height, xy,xy, wh,wh );



}