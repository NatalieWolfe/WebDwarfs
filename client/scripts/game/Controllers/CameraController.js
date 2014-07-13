/* global lib */

lib.register(
  'CameraController',
  [ 'BasicController', 'KeyState' ],
  function( BasicController, KeyState ){

    var PAN_SPEED = 0.02; // Tiles per millisecond.
  
    // ------------------------------------------------------------------------------------------ //

    function CameraController( camera ){
      BasicController.call( this );
      this.camera = camera;
    }
    lib.inherits( CameraController, BasicController );
    var CameraControllerPrototype = CameraController.prototype;
  
    // ------------------------------------------------------------------------------------------ //

    CameraControllerPrototype.update = function( time ){
      var KEYS      = KeyState.KEYS;
      var keyState  = KeyState.instance;
      var camera    = this.camera;

      // Vertical movement.
      if( keyState.isPressed( KEYS.W ) ){
        camera.setYVelocity( -PAN_SPEED );
      }
      else if( keyState.isPressed( KEYS.S ) ){
        camera.setYVelocity( PAN_SPEED );
      }
      else {
        camera.setYVelocity( 0 );
      }

      // Horizontal movement.
      if( keyState.isPressed( KEYS.A ) ){
        camera.setXVelocity( -PAN_SPEED );
      }
      else if( keyState.isPressed( KEYS.D ) ){
        camera.setXVelocity( PAN_SPEED );
      }
      else {
        camera.setXVelocity( 0 );
      }

      // Vertical movement.
      if( keyState.isPressed( KEYS.E ) ){
        camera.setZVelocity( -PAN_SPEED / 2 );
      }
      else if( keyState.isPressed( KEYS.Q ) ){
        camera.setZVelocity( PAN_SPEED / 2 );
      }
      else {
        camera.setZVelocity( 0 );
      }
    };

    // ------------------------------------------------------------------------------------------ //
  
    return CameraController;
  }
);
