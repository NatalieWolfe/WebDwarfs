/* global jQuery, lib */

(function( $, window ){
  var STEP_TIME = 1000 / 30;

  var world       = null;
  var viewport    = null;

  lib.require(
    [ 'World', 'Viewport', 'Camera', 'CameraController' ],
    function( World, Viewport, Camera, CameraController ){
      world     = new World();
      viewport  = new Viewport( $( '#viewer' ) );
  
      var camera      = new Camera();
      var cameraCtrl  = new CameraController( camera );
  
      //               X    Y   Z
      world.generate( 100, 100, 1 );
      viewport.setFoV( 50,  25    );
  
      viewport.setCamera( camera );
      world.addObject( camera );
      world.addController( cameraCtrl );

      _render();
    }
  );

  var previousRenderTime = Date.now();
  function _render(){
    world.update( STEP_TIME );
    viewport.render();
    setTimeout( _render, STEP_TIME );
  }
})( jQuery, window );
