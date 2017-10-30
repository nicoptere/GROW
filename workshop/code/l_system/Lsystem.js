var Turtle = function( x, y, angle ){
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
};
Turtle.prototype = {
    clone : function(){
        return new Turtle( this.x, this.y, this.angle );
    }
};

var Lsystem = function(axiom, rule, length, angle ) {

    this.axiom = axiom || "f+f";
    this.rule = rule || "f++f";
    this.production = "";

    this.length = length || 10;
    this.angle = angle || 0;

};

Lsystem.prototype = {

    moveTurtle:function( ctx, char, turtle ){

        //move forward
        if (char == 'f'){
            turtle.x += Math.cos( turtle.angle ) * this.length;
            turtle.y += Math.sin( turtle.angle ) * this.length;
            ctx.lineTo( turtle.x, turtle.y );
        }

        //rotate right
        if (char == '+'){
            turtle.angle += this.angle;
        }

        //rotate left
        if (char == '-'){
            turtle.angle -= this.angle;
        }

    },

    render : function( ctx ){

        var turtle = new Turtle(0,0);
        var tmp = new Turtle();

        ctx.save();
        ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );
        ctx.beginPath();
        ctx.moveTo( turtle.x, turtle.y );

        for ( var i = 1; i < this.production.length; i++){

            var char = this.production.charAt( i ).toLowerCase();


            //scans a branch
            if ( char == '[' ){

                if ( this.production.substr( i+1, this.production.length ).lastIndexOf( ']' ) == -1 ) continue;
                ctx.stroke();

                tmp = turtle.clone();
                ctx.save();
                ctx.beginPath();
                ctx.moveTo( tmp.x, tmp.y, 2, 0, Math.PI * 2 );

                while ( char != ']'){
                    char = this.production.charAt( i++ );
                    this.moveTurtle( ctx, char, tmp );
                }
                ctx.stroke();
                ctx.restore();

                ctx.beginPath();
                ctx.arc( turtle.x, turtle.y, 2, 0, Math.PI * 2 );
                ctx.moveTo( turtle.x, turtle.y );

            }else{

                this.moveTurtle( ctx, char, turtle );
            }
        }
        ctx.stroke();
        ctx.restore();
    },

    compute : function( gens ){

        this.production = this.axiom.toLowerCase();
        var prod = '';
        var generations = 0;
        while ( generations < gens ){

            for ( var i = 0; i < this.production.length; i++ ){

                if( this.production.charAt( i ) == 'f' ){
                    prod += this.rule;
                }else{
                    prod += this.production.charAt( i );
                }
            }
            this.production = prod;
            generations++;
        }
    }
};


