
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate(s/2, s/2);


    var Spring = function( p0,p1,length ){

        this.p0 = p0;
        this.p1 = p1;

        this.o0 = p0.clone();
        this.o1 = p1.clone();

        this.temp = new Point();
        Spring.damping = 0.1;
        this.restLength = length || 50;
        this.length = this.restLength;

        this.applyConstraints = function(){

            this.temp = this.temp.copy( this.p0 ).sub( this.p1 );

            this.length = 1 -  (this.restLength / this.temp.length() );

            this.temp.multiplyScalar( this.length ).multiplyScalar( 0.5 ).multiplyScalar( Spring.damping );

            this.temp.z = 0;

            if( !this.p0.fixed ) this.p0.sub( this.temp );
            if( !this.p1.fixed ) this.p1.add( this.temp );

        }


    };

    var springs = [];
    var count = 100;
    var step = PI2 / count ;
    var points = [];
    for( var i = 0; i < PI2; i+=step ){

        var p = pointAtAngleRadius( i, ( 1 + PRNG.random() ) * unit  );
        p.r = s / 2;
        points.push( p );

    }
    points.forEach(function( p,i,a ){
        springs.push( new Spring( p, a[(i+1)%a.length ], 100 * unit ) );
    });

    var tot = 250;
    i = tot;
    while( i-- ){

        ctx.globalAlpha = 1 - i / tot;
        ctx.lineWidth = ( 1 - i / tot ) * unit * 10;

        g.polyline( points, true );

        springs.forEach(function (s) {
            s.applyConstraints();
        });
        repel( points, points );
    }


    function repel(a, b) {

        var acc = 0;
        var dirs = [];
        a.forEach(function (circle) {

            b.forEach(function (other) {

                if (circle === other) return;

                var p = circle;
                var o = other;

                var d = geomUtils.distance(p, o);
                var minDist = circle.r + other.r;

                if (d < minDist) {

                    var dir = p.direction(o).multiplyScalar(.35);
                    dir.z = 0;
                    p.sub(dir);
                    o.add(dir);
                }

            });

        });
        return acc;
    }

    ctx.restore();
    return LANDSCAPE;

};
