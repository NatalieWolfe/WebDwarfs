/* global lib */

lib.register( 'Camera', [ 'BasicObject' ], function( BasicObject ){
  function Camera(){
    BasicObject.apply( this, arguments );
  }
  lib.inherits( Camera, BasicObject );

  // -------------------------------------------------------------------------------------------- //

  return Camera;
});
