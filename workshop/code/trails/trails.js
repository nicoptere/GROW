
//radians
var RAD = Math.PI / 180;
function update() {

    requestAnimationFrame( update );
    ctx.save();

    //clear half the screen
    ctx.clearRect(0,0,w/2,h);

    //draw a translucent rect on top of the other half
    ctx.fillStyle = "#FFF";
    ctx.globalAlpha = .05;
    ctx.fillRect(w/2,0,w/2,h);

    ctx.restore();

    ctx.beginPath();
    for( i = 0; i < 10; i++ ){

        //iterate over points
        points.forEach( function( p, id ){

            //move to current position
            ctx.moveTo( p[0], p[1] );

            //updates angle
            angles[id] += ( Math.random() - .5 ) * RAD * speeds[id];

            //updates poistion
            p[0] += Math.sin( angles[id] );
            p[1] += Math.cos( angles[id] );

            //draws line to new position
            ctx.lineTo( p[0], p[1] );

            //constraint to screen
            p[0] %= w;
            p[1] %= h;
            if( p[0]<0 )p[0]+=w;
            if( p[1]<0 )p[1]+=h;

        });
    }
    ctx.stroke();

    //vertical sepearator
    ctx.beginPath();
    ctx.moveTo( w/2, 0);
    ctx.lineTo( w/2, h);
    ctx.stroke();
}

//utils
//creates a 2D context
var canvas, w, h, ctx;
//stores some vairables
var points = [];
var angles = [];
var speeds = [];

window.onload = function(){
    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    for( var i = 0; i < 500; i++ ){

        //point position
        points.push( [w/2, h/2] );
        //starting angle
        angles.push( Math.random() * Math.PI * 2 );
        //rotation speed
        speeds.push( 5 + Math.random() * 25 );

    }

    // window.addEventListener("mousedown", update, false);
    update();
};
