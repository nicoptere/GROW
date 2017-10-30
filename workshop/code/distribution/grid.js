function reset() {

    ctx.clearRect(0,0,w,h);

    //regular grid with 50px cells
    var cellSize = 50, i, j;

    //draws the grid
    ctx.globalAlpha = .25;
    ctx.beginPath();
    for( i = 0; i <= w; i += cellSize ){
        ctx.moveTo( i, 0 );
        ctx.lineTo( i, h );
    }
    for( j = 0; j <= h; j += cellSize ) {
        ctx.moveTo( 0, j );
        ctx.lineTo( w, j );
    }
    ctx.stroke();

    ctx.globalAlpha = 1;
    for( i = 0; i <= w; i += cellSize ){
        for( j = 0; j <= h; j += cellSize ){

            //grid cell indices
            var cell_x = Math.round( i / cellSize );
            var cell_y = Math.round( j / cellSize );

            //grid
            circle( i, j, 1 );

            //sub-grid
            if( ( cell_x >= 20 && cell_x <= 26 )
            &&  ( cell_y >= 8 && cell_y <= 14 ) ){
                circle( i, j, 5 );
            }

            //frame
            //horizontal lines
            if( ( cell_x >= 16 && cell_x <= 30 )
            &&  ( cell_y == 3 || cell_y == 12 ) ){
                circle( i, j, 10 );
            }

            //verical lines
            if( ( cell_x == 16 || cell_x == 30 )
            &&  ( cell_y >= 3 && cell_y <= 12 ) ){
                circle( i, j, 10 );
            }
        }
    }
}

//creates a 2D context
var canvas, w, h, ctx;
window.onload = function(){
    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    reset();
};
//draw a circle on the canvas at x/y with radius r
function circle( x,y,r ){
    ctx.beginPath();
    ctx.arc( x, y, r, 0, Math.PI * 2 );
    ctx.stroke();
}