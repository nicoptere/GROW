var CubicPath = function( anchors, precision, loop )
{

    this.compute = function( anchors, precision, loop )
    {

        var i, t;

        this.anchors = anchors;

        precision =  Math.max( .01, Math.min( 1, precision ) );

        this.loop = loop;
        this.vertices = [];
        for ( i = 0; i < anchors.length; i++ )
        {

            for ( t = 0; t < 1; t+= precision )
            {

                this.vertices.push( this.computePointAt( i, t ) );

            }

        }
        return this.vertices;

    };

    this.computePointAt = function( i, t )
    {

        var p0 = CubicPath.p0 || ( CubicPath.p0 = new Point() ),
            p1 = this.anchors[ i ],
            p2 = CubicPath.p2 || ( CubicPath.p2 = new Point() );

        if( i == 0 )
        {

            if ( this.loop == true )
            {

                p0.x = ( this.anchors[ this.anchors.length-1 ].x + this.anchors[ i ].x ) / 2;
                p0.y = ( this.anchors[ this.anchors.length-1 ].y + this.anchors[ i ].y ) / 2;
                p0.z = ( this.anchors[ this.anchors.length-1 ].z + this.anchors[ i ].z ) / 2;

            }else{

                p0 = this.anchors[ i ];
            }

        }
        else
        {

            p0.x = ( this.anchors[ i - 1 ].x + this.anchors[ i ].x ) / 2;
            p0.y = ( this.anchors[ i - 1 ].y + this.anchors[ i ].y ) / 2;
            p0.z = ( this.anchors[ i - 1 ].z + this.anchors[ i ].z ) / 2;

        }


        if( i == this.anchors.length - 1 )
        {

            if (loop == true)
            {

                p2.x=( this.anchors[ i ].x + this.anchors[0].x ) / 2;
                p2.y=( this.anchors[ i ].y + this.anchors[0].y ) / 2;
                p2.z=( this.anchors[ i ].z + this.anchors[0].z ) / 2;

            }
            else
            {

                p2 = this.anchors[ i ];
            }

        }
        else
        {

            p2.x = ( this.anchors[ i + 1 ].x + this.anchors[ i ].x ) / 2;
            p2.y = ( this.anchors[ i + 1 ].y + this.anchors[ i ].y ) / 2;
            p2.z = ( this.anchors[ i + 1 ].z + this.anchors[ i ].z ) / 2;

        }


        var t1  = 1 - t;
        var t2 = t1 * t1;
        var t3 = 2 * t * t1;
        var t4 = t * t;

        return new Point(	t2 * p0.x + t3 * p1.x + t4 * p2.x,
            t2 * p0.y + t3 * p1.y + t4 * p2.y );


    };

    this.getPositionAt = function( t )
    {

        var length = this.anchors.length;
        var i0 = Math.floor( length * t );
        i0 = i0 < length - 1 ? i0 : length - 1;
        var delta = 1 / length;
        return this.computePointAt( i0, ( t - ( i0 * delta ) ) / delta );

    };

    if( anchors != null )
    {
        this.compute( anchors , precision || .1, loop || false );
    }

};