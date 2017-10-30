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

        this.applyConstraints = function(){

            this.temp = this.temp.copy( this.p0 ).sub( this.p1 );

            this.length = 1 -  (this.restLength / this.temp.length() );

            this.temp.multiplyScalar( this.length ).multiplyScalar( 0.5 ).multiplyScalar( Spring.damping );

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

    var iteration = 250;
    function update(){

        // requestAnimationFrame(update);

        points.forEach(function( p,i ){
           p.lx = p.x;
           p.ly = p.y;
           p.lz = p.z;
        });
        springs.forEach(function (s) {
            s.applyConstraints();
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
            ctx.lineWidth = norm( p.z, minZ, maxZ ) * 5 * unit;
            ctx.moveTo( p.lx, p.ly );
            ctx.lineTo( p.x, p.y );
            ctx.stroke();
            // ctx.arc( p.x, p.y, 2 + norm( p.z, minZ, maxZ ) * 2 * unit, 0, Math.PI * 2 );
            // ctx.fill();
        } );

        if( iteration-- > 0 ){
            //console.log( iteration );
            update();
        }

    }

    var springs = [];
    var points = [];

    var origin = new Point();
    for ( var i = 0; i < 250; i++ ){
        var p = new P3( PRNG.random()-.5, PRNG.random()-.5, PRNG.random() - .5 );
        var le = 1 / p.length();
        p.multiplyScalar(le).multiplyScalar( s/2 );//.add( {x:s/2, y:s/2, z:s/2});
        points.push( p );
        // p.fixed = PRNG.random() > .5
        var sp = new Spring(p, origin, s / 4  );
        springs.push(sp);
    }

    for ( var i = 0; i < points.length-1; i++ ){
        for ( var j = i+1; j < points.length; j++ ) {
            var p0 = points[i];
            var p1 = points[j];
            var sp = new Spring(p0, p1, s/4 + PRNG.random() * s/3 );
            springs.push(sp)
        }
    }

    // make it converge early
    i = 2;
    //console.time('t');
    while( i-- ){
        springs.forEach(function (s) {
            s.applyConstraints();
        });
    }
    //console.timeEnd('t');

    ctx.save();
    ctx.translate( s/2, s/2 );
    update();
    ctx.restore();
    return PORTRAIT;


};
