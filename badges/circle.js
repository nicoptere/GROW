
var Circle = function( count, normalLength, radiusIn, radiusOut )
{
    count = count % 1 == 0 ? count : ( count + 1 );
    this.count = count;

    this.normalLength = normalLength;
    this.radiusIn = radiusIn;
    this.radiusOut = radiusOut;

    this.angleSpeed = ( PRNG.random() - .5 ) * RAD * .1;
    this.points = [];
    this.init();


};

Circle.prototype = {

    init : function(){

        var step = PI2 / this.count;
        var angle = PRNG.random() * PI2;

        this.points = [];

        for( var i = 0; i < this.count; i++ ){
            angle += step;

            var p = new Point( 0,0 );
            p.angle = angle;

            p.radius = 0;
            p.radiusAngle = PRNG.random() * PI2;
            p.radiusSpeed = RAD + PRNG.random() * 2 * RAD;

            p.normal = this.normalLength;
            this.points.push( p );
        }

    },

    update : function( s, apply )
    {
        var scope  = this;
        this.points.forEach( function( p ){

            p.angle += scope.angleSpeed;
            p.radius = scope.radiusIn + ( .5 + ( .5 *  Math.cos( p.radiusAngle ) ) ) * scope.radiusOut;
            p.radiusAngle += p.radiusSpeed;

            var x = Math.cos( p.angle ) * p.radius;
            var y = Math.sin( p.angle ) * p.radius;

            //jump in place if true
            if( Boolean( apply ) === true ) {
                p.x = x;
                p.y = y;
            }else{
                p.x += ( x - p.x ) * .1;
                p.y += ( y - p.y ) * .1;
            }

            //compute radius normals
            p.lx = p.x + Math.cos( p.angle + HPI ) * p.normal;
            p.ly = p.y + Math.sin( p.angle + HPI ) * p.normal;

            p.rx = p.x + Math.cos( p.angle - HPI ) * p.normal;
            p.ry = p.y + Math.sin( p.angle - HPI ) * p.normal;


        } );

    },
    render : function( ctx, unit ){

        ctx.beginPath();
        this.points.forEach( function( p, i, a ){

            //next point on curve
            var n = a[ ( i + 1 ) % a.length ];

            ctx.lineTo( p.x, p.y);
            ctx.bezierCurveTo(  p.lx, p.ly, n.rx, n.ry, n.x, n.y );


        });

    }
};
