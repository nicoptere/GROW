
var data = function(exports){

    var xhr;
    var img = new Image();


    var users = [];
    var urls = [
        '../sources/csv/attendees.csv',
        '../sources/csv/extras.csv',
        '../sources/csv/intervenants_plus_one.csv',
        '../sources/csv/new_kids.csv',
        '../sources/csv/sandbox.csv',
        '../sources/csv/staff.csv'
    ];

    var types = [

        "conférences: super-early",
        "conférences: early",
        "conférences: regular",

        "atelier WebGL avancé + conférences: super early",
        "atelier WebGL avancé + conférences: early",
        "atelier WebGL avancé + conférences: regular",

        "atelier systèmes génératifs + conférences: super early",
        "atelier systèmes génératifs + conférences: early",
        "atelier systèmes génératifs + conférences: regular",

        "speaker",
        "extra",
        "new kid",
        "sandbox",
        "staff"

    ];

    exports.load = function( callback ) {

        img.onload = function () {
            console.log('ok');
            callback();
        };

        xhr = new XMLHttpRequest();
        xhr.onload = function(e){
            onLoad(e)
        };
        loadNext( callback );

    };

    var url;
    function loadNext( callback ){

        if( urls.length === 0 ){
            onComplete(callback);
            return;
        }

        url = urls.shift();
        console.log( url );
        xhr.open( 'GET', url );
        xhr.send();

    }

    function onLoad( e ){

        var str = e.target.responseText;
        var entries = str.split( '\n' );
        entries.shift();
        entries.forEach(function(e){

            var bits = e.replace( /"/gi, '' ).split( ',' );

            var type = bits[5];
            if( types.indexOf(type)===-1){
                console.log( 'no');
            }

            if( type.lastIndexOf( 'conf' ) !== -1 && type.lastIndexOf( 'atelier' ) === -1 ){
                type = "sessions";
            }

            if( type.lastIndexOf( 'atelier' ) === 0 ){
                type = "workshop";
            }

            var tot = ~~( bits[4] );
            var c = tot;
            while( c-- ){

                var cid = tot > 1 ? ( " #" + ( tot-c ) + '/' + tot ) : '';
                var name =  bits[1] + " " + bits[2] + cid;
                var user = createUser( users.length, type, name, bits[0]  );
                users.push( user );

            }

        });
        loadNext();

    }


    var randomNames_m = ["SANTIAGO PWRRK","ARAGORN SWTIPK","TARANIS POKGRW","AGAPIOS KNTRRW","GASPARO TINWKR","IAKOPA RSWNRGT","NORRIS PKWGTAA","GASTON WRRKIPA","ARRIGO KWAPNST","GASPAR RINTKOW","PARRIS ONATKGW","AKONI PWTGSRAR","SPIRO GWARNKTA","PARIS ANRTWGOK","AARON RTKWPGSI","GRANT ASRKWOPI","KARAN IRSPTOWG","ROWAN TKRGSIAP","OSWIN RATGKRPA","ASTOR WKGRPNAI","AKIRA NOSGTPWR","SANTO GRIWKPAR","ASIA WRNRGTKOP","KING RRAOATWPS","OTIS PANRKARWG","STAN KIRPWAOGR","RIAN RAOSWKTGP","NORI TAPKSRAWG","PINO RWAATKGRS","IGOR RSNTAAKWP","GINO RPKSAATRW","PIKA GNSRRTAWO","IAGO STNWRKPRA"];
    var randomNames_f = ["AGOSTINA PWRKR","KATRIONA GWRSP","KATRINA ROGWSP","ROSITA PRAWNKG","TARINA PKSGOWR","ORIANA GSPRWKT","ROWINA RTAPGSK","SARINA ORPWKGT","ROSINA TARKPWG","PORTIA ANSGRWK","TANIKA GRWOPRS","KORINA RGSAPWT","SPRITA RKGWNAO","KRISTA OGAWNPR","ORSINA RGTAPKW","SONIA WRPKRGAT","KIANA ORRPSWGT","SANTA PORWGRKI","TRINA RGSKAOPW","TORIA SPWNGAKR","TONIA KSWRRPAG","TIARA WNOPSRKG","TIANA RGPRSWOK","SANGO TRAIWPRK","ANAIS WOGKPRTR","ANITA OPKGRSRW","SARRA TGKOPWIN","TANIA SOGPRWKR","TINA RWRKGAOPS","RONI KRSPAATWG","TARA IOWSPKGRN","RINA RTWSKGPOA","GAIA WSKOTNPRR","GINA OTKRRPSAW","SAKI PONTWRRGA","SARA RITOGWPNK","ROSA NAKWGRIPT","KARA SRIPWOTGN","ARIA TSKOWRPNG","TORI SGAAPNRWK","IONA PARRKGWST","RITA WKRPGAONS","NITA KARWOSRPG","SITA GARPOWNKR","GINA ARTROKPSW","NORA SPWGRAKIT","TARA IKSNORPGW"];

    function createUser( id, type, name, orderId ){

        var uid = ~~( PRNG.random() * 1000000000 );

        if( orderId !== undefined && orderId !== '' ){
            uid = ~~( orderId );
        }

        if( name == " " ){

            var gender = ( id % 2 == 0 ) ? randomNames_f : randomNames_m;
            var nameId = ~~( PRNG.random() * gender.length );
            name = gender.splice( nameId, 1 )[0];

        }

        return {

            id : id,
            type: type,
            name : name,

            UID: uid,
            GEN: id % 75,
            NEG: ~~( id / 75),
            SID: ~~( PRNG.random() * 1000000000 )

        };
    }

    function onComplete(){

        var c = 0;
        console.log( users.length );
        while( users.length < 150 ){

            var gender = (c%2 == 0 ) ? randomNames_f : randomNames_m;
            var nameId = ~~( PRNG.random() * gender.length );
            var name = gender.splice( nameId, 1 )[0];
            var user = createUser( users.length, "extra", name );
            users.push( user );

            console.log( c++, name, randomNames_m.length , randomNames_f.length )
        }

        // //randomise l'ordre
        // users.sort( function (a,b) {
        //     return PRNG.random()>.5? - 1 : 1;
        // });
        //
        // //réassigne le générateur
        // users.forEach( function( user, id ){
        //
        //     user.GEN = id % 75;
        //     user.NEG = ~~( id / 75);
        //     user.SID = ~~( PRNG.random() * 1000000000 );
        //
        // });

        users.forEach( function( user ){

            users.forEach( function( other ){

                if( user.GEN === other.GEN && user.NEG !== other.NEG ){

                    user.evilTwin = other.name.toUpperCase();
                    other.evilTwin = user.name.toUpperCase();

                }

            });

        } );

        console.table( users );
        exports.users = users;
        img.src= "grow_verso.svg";
    }

    exports.getLogo = function(){
        return img;
    };

    exports.getUser = function( id ){
        return users[ id ];
    };


    return exports;
}({});
