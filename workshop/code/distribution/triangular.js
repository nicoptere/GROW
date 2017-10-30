function reset(){

    //measures of an equalateral triangle
    var sides = 3;
    var L = 2 * Math.sin( Math.PI / sides ); //side length
    var A = L / ( 2 * Math.tan( Math.PI / sides ) ); //apothem
    var H = ( 1 + A ); //radius + apothem
    var size = 50;
    L *= size;
    H *= size;

    var mx = 2 * Math.ceil( w / L );
    var my = Math.ceil( h / H );

    for( var i = 0; i < w * 1.2; i+= mx ){

        for( var j = 0; j <= h; j+= my ) {

            //cell indices
            var cx = Math.round(i / mx);
            var cy = Math.round(j / my);

            //coordinates
            var x = ( cx ) * L / 2;
            var y = ( cy ) * H;

            //triangular pattern
            var mody = cy % 2;
            if(( cx % 2 == 1 && cy % 2 == 0 )
            || ( cx % 2 == 0 && cy % 2 == 1 )){
                circle(x, y, 5);
            } else {
                circle(x, y, 1);
            }

            //hexagonal pattern
            var modx = cx % 6;
            if(( mody == 0 && ( modx == 1 || modx == 3 ) )
            || ( mody == 1 && ( modx == 0 || modx == 4 ) ) ){
                circle( x, y, 10 );
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