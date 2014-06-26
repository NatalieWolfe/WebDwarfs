/* global lib, $, window */

lib.register( 'KeyState', [], function(){
  function KeyState(){
    this.keyStates = {};
  }
  var KeyStatePrototype = KeyState.prototype;

  // -------------------------------------------------------------------------------------------- //

  var KEYS = KeyState.KEYS = {
    A       : '_65',
    B       : '_66',
    C       : '_67',
    D       : '_68',
    E       : '_69',
    F       : '_70',
    G       : '_71',
    H       : '_72',
    I       : '_73',
    J       : '_74',
    K       : '_75',
    L       : '_76',
    M       : '_77',
    N       : '_78',
    O       : '_79',
    P       : '_80',
    Q       : '_81',
    R       : '_82',
    S       : '_83',
    T       : '_84',
    U       : '_85',
    V       : '_86',
    W       : '_87',
    X       : '_88',
    Y       : '_89',
    Z       : '_90',
    UP      : '_38',
    DOWN    : '_40',
    LEFT    : '_37',
    RIGHT   : '_38',
    ONE     : '_49',
    TWO     : '_50',
    THREE   : '_51',
    FOUR    : '_52',
    FIVE    : '_53',
    SIX     : '_54',
    SEVEN   : '_55',
    EIGHT   : '_56',
    NINE    : '_57',
    ZERO    : '_48',
    SHIFT   : '_16',
    ALT     : '_18',
    META    : '_91',
    CONTROL : '_17',
    TAB     : '_9',
    TILDA   : '_192',
    MINUS   : '_189',
    EQUALS  : '_187',
  };

  // -------------------------------------------------------------------------------------------- //

  KeyStatePrototype.isPressed = function( key ){
    return Boolean( this.keyStates[ key ] );
  };

  // -------------------------------------------------------------------------------------------- //

  $(function(){
    $( window ).keydown(function( e ){
      var keyStates = KeyState.instance.keyStates;
      keyStates[ '_' + e.keyCode  ] = true;
      keyStates[ KEYS.SHIFT       ] = e.shiftKey;
      keyStates[ KEYS.CONTROL     ] = e.ctrlKey;
      keyStates[ KEYS.META        ] = e.metaKey;
    });
    $( window ).keyup(function( e ){
      var keyStates = KeyState.instance.keyStates;
      keyStates[ '_' + e.keyCode  ] = false;
      keyStates[ KEYS.SHIFT       ] = e.shiftKey;
      keyStates[ KEYS.CONTROL     ] = e.ctrlKey;
      keyStates[ KEYS.META        ] = e.metaKey;
    });
  });

  // -------------------------------------------------------------------------------------------- //

  KeyState.instance = new KeyState();
  return KeyState;
});
