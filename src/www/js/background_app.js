/**
* Sets up the background application e.g. sensor based data transmission etc.
*
* @class BackgroundApp
* @constructor
*/
define([
  'js/bkgd/loop_view',
  'js/bkgd/init_view',
  'js/bkgd/events_mod',
  'js/url_handle'
  ], function(LoopView, InitView, events, urlHandle){
  /**
  * Sets up event listeners and creats the initial and loop views for the
  * background applicaiton.
  *
  * @method initialize
  */
  var initialize = function(){
      // Set up the event listeners
      var ev = events.init();

      // Activate the init view
      var init = new InitView();

      // Activate the loop view
      function looper(){
        if(urlHandle.checkTokenExists()){
          var loop = new LoopView();
        }
    }
    setInterval(looper, 10000);
  };

  return {
    initialize: initialize
  };
});
