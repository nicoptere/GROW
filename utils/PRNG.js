var PRNG =
{

	a           : 16807,            /* multiplier */
	m           : 0x7FFFFFFF,        /* 2**31 - 1 */
	randomnum   : 1,
	div         : ( 1 / 0x7FFFFFFF ),

	nextlongrand : function( seed )
	{

		var lo,
			hi;

		lo = this.a * ( seed & 0xFFFF );
		hi = this.a * ( seed >> 16 );
		lo += ( hi & 0x7FFF ) << 16;

		if (lo > this.m)
		{
			lo &= this.m;
			++lo;
		}

		lo += hi >> 15;
		if (lo > this.m)
		{
			lo &= this.m;
			++lo;
		}

		return lo;

	},

	random : function ()/* return next random number */
	{

		this.randomnum = this.nextlongrand( this.randomnum );
		return this.randomnum * this.div;

	},

	setSeed : function( value )
	{

		this.randomnum = ( value <= 0 ) ? 1 : value;

	},

	pseudoRandom : function(x, y) {
		// return PRNG.random();
		return ( ( Math.sin( x * 12.9898 + y * 78.233) ) * 43758.5453123 ) % 1;
	},

	noise : function (x, y) {

		//gets the integer part
		var ix = parseInt(x);
		var iy = parseInt(y);

		// 2D cell corners
		var a = PRNG.pseudoRandom(ix,iy);
		var b = PRNG.pseudoRandom(ix+1, iy);
		var c = PRNG.pseudoRandom(ix, iy+1);
		var d = PRNG.pseudoRandom(ix+1, iy+1);

		//gets the fractional part
		var fx = (x % 1);
		var fy = (y % 1);
		var ux = fx * fx * (3.0 - 2.0 * fx);
		var uy = fy * fy * (3.0 - 2.0 * fy);

		//interpolate the 4 noises with fractional parts
		return (a * (1-ux) + b * ux) + (c - a) * uy * (1-ux) + (d - b) * ux * uy;

	},

	FBM : function ( x, y, octaves ){

		return noise.FBM( x,y, octaves );

	},
    centralDifference : function ( x, y, scale, octaves ) {

        var x0 = PRNG.FBM( (x+1) * scale, y * scale, octaves );
        var x1 = PRNG.FBM( (x-1) * scale, y * scale, octaves );
        var y0 = PRNG.FBM( x * scale, ( y + 1 ) * scale, octaves );
        var y1 = PRNG.FBM( x * scale, ( y - 1 ) * scale, octaves );

        return [ ( x0-x1 ), ( y0-y1 ) ];
    },

    centralDifference_legacy : function ( x, y, scale, octaves ) {

		var x0 = PRNG.FBM_legacy( (x+1) * scale, y * scale, octaves );
		var x1 = PRNG.FBM_legacy( (x-1) * scale, y * scale, octaves );
        var y0 = PRNG.FBM_legacy( x * scale, ( y + 1 ) * scale, octaves );
        var y1 = PRNG.FBM_legacy( x * scale, ( y - 1 ) * scale, octaves );

        return [ ( x0-x1 ), ( y0-y1 ) ];
    },

    FBM_legacy : function ( x, y, octaves ) {

        var value = 0;
        var OCTAVES = octaves || 6;
        var amplitude = 1;
        for (var i = 0; i < OCTAVES; i++) {
            value += amplitude * PRNG.noise(x, y);
            x *= 2.;
            y *= 2.;
            amplitude *= .5;
        }
        return value;
    }


};