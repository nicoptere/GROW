generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    var Spring = function( p0,p1,length ){

        this.p0 = p0;
        this.p1 = p1;

        this.o0 = p0.clone();
        this.o1 = p1.clone();

        this.temp = new P3();
        Spring.damping = 0.01;
        this.restLength = length || 50;
        this.length = this.restLength;

        var temp = new P3();
        this.applyConstraints = function(){

            this.temp = this.temp.copy( this.p0 ).sub( this.p1 );

            this.length = 1 - (this.restLength / this.temp.length() );

            this.temp.multiplyScalar( this.length ).multiplyScalar( 0.5 ).multiplyScalar( Spring.damping );

            temp.copy( this.p0 ).multiplyScalar( .01 );
            this.temp.multiplyScalar( PRNG.FBM( temp.x, temp.y, 3 ) )

            if( !this.p0.fixed ) this.p0.sub( this.temp );
            if( !this.p1.fixed ) this.p1.add( this.temp );

        }

    };
    var P3 = function(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.lx = this.ly = this.lz = 0;
    };
    P3.prototype = {
        add : function( p ){
            this.x += p.x;
            this.y += p.y;
            this.z += p.z;
            return this;
        },
        sub : function( p ){
            this.x -= p.x;
            this.y -= p.y;
            this.z -= p.z;
            return this;
        },
        length : function(){
            return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
        },
        multiplyScalar : function( value ){
            this.x *= value;
            this.y *= value;
            this.z *= value;
            return this;
        },
        copy : function(p){
            this.x = p.x;
            this.y = p.y;
            this.z = p.z;
            return this;
        },
        clone : function(){
            return new P3( this.x, this.y, this.z );
        }
    };

    var iteration = 100;
    function update(){

        ctx.save();
        ctx.translate( s/2, s/2 );

        points.forEach(function( p,i ){
           p.lx = p.x;
           p.ly = p.y;
           p.lz = p.z;
        });

        springs.forEach(function (s) {

            s.applyConstraints();
            // if( iteration % 10 == 0 ){
            //     ctx.globalAlpha = .01;// - getDistance(s.p0, s.p1);
            //     g.line( s.p0, s.p1 );
            // }

        });

        var minZ = Number.POSITIVE_INFINITY;
        var maxZ = Number.NEGATIVE_INFINITY;
        points.forEach(function( p,i ){
            minZ = Math.min( p.z, minZ);
            maxZ = Math.max( p.z, maxZ);
        });

        points.forEach(function( p,i ){
            ctx.beginPath();
            ctx.globalAlpha = 1 - ( .25 + .75 * norm( p.z, minZ, maxZ ) );
            // ctx.lineWidth = norm( p.z, minZ, maxZ ) * 5 * unit;
            // ctx.moveTo( p.lx, p.ly );
            // ctx.lineTo( p.x, p.y );
            // ctx.stroke();
            ctx.arc( p.x, p.y, ( 1 + norm( p.z, minZ, maxZ ) ) * unit, 0, Math.PI * 2 );
            ctx.fill();
        } );

        if( iteration-- > 0 ){
            console.log( iteration );
            ctx.restore();
            update();
            // requestAnimationFrame(update);
        }else{

            springs.forEach(function (s) {

                ctx.globalAlpha = .01;
                g.line( s.p0, s.p1 );

            });
            ctx.restore();
        }

    }

    var springs = [];
    var points = [];

    var origin = new Point();

    for ( var i = 0; i < 500; i++ ){
        var p = new P3( PRNG.random()-.5, PRNG.random()-.5, PRNG.random() - .5 );
        var le = 1 / p.length();
        p.multiplyScalar(le).multiplyScalar( s/4 );//.add( {x:s/2, y:s/2, z:s/2});
        points.push( p );
        p.fixed = PRNG.random() > .5
        var sp = new Spring(p, origin, s / 4  );
        springs.push(sp);
    }

    for ( var i = 0; i < points.length / 2; i++ ){
        for ( var j = i+1; j < points.length / 2; j++ ) {

            var p0 = points[~~(PRNG.random() * points.length)];
            var p1 = points[~~(PRNG.random() * points.length)];
            while( p1 == p0 ) p1 = points[~~(PRNG.random() * points.length)];

            var sp = new Spring(p0, p1, s / 3 + PRNG.random() * s / 2 );
            springs.push(sp);
        }
    }

    // for ( var i = 0; i < 2500; i++ ) {
    //     var p0 = points[~~(PRNG.random() * points.length)];
    //     var p1 = points[~~(PRNG.random() * points.length)];
    //     var sp = new Spring(p0, p1, s / 4 + PRNG.random() * s / 3);
    //     springs.push(sp);
    // }

    // make it converge early
    // i = 50;
    // console.time('t');
    // while( i-- ){
    //     springs.forEach(function (s) {
    //         s.applyConstraints();
    //     });
    // }
    // console.timeEnd('t');

    update();


};
