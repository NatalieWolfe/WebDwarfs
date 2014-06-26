
var express   = require( 'express' );
var stylus    = require( 'stylus' );
var compiler  = require( 'resource-compiler' );

var app = express();

const CLIENT_DIR = __dirname + '/../client';

app.set( 'views',       CLIENT_DIR + '/views' );
app.set( 'view engine', 'jade'  );
app.set( 'view cache',  false   );

// Static content generation.
app.use(
  '/styles',
  stylus.middleware({
    src     : CLIENT_DIR + '/styles',
    dest    : CLIENT_DIR + '/static/styles',
    compile : function( str, path ){
      var res = stylus( str ).set( 'filename', path );
      return res;
    }
  })
);
app.use(
    '/scripts',
    compiler.combiner(
        function( path, data, callback ){
            callback( null, data );
        }, {
            src     : CLIENT_DIR + '/scripts',
            dest    : CLIENT_DIR + '/static/scripts',
            ext     : '.js'
        }
    )
);
app.use( express.static( CLIENT_DIR + '/static' ) );

app.get( '/', function( req, res ){
  res.redirect( '/game' );
});

app.get( '/game', function( req, res ){
  res.render( 'game' );
});

app.listen( process.env.PORT || 3000 );
