/**
* Starts the whole application. Sets up ready for the main view.
*
* @class App
* @constructor
*/
define([
  "fastclick",
  "js/background_app",
  "js/bkgd/class_name_mod",
  "js/router",
  "js/views/main_view"
  ], function(FastClick, BackgroundApp, className, Router, MainView){
  var initialize = function(){
    "use strict";
      $(document).on('mainviewready', function(){

      var classname = className.addStyle();

      // Add FastClick to the whole page
      var fastclick = new FastClick(document.body);

      // Add the background App in
      BackgroundApp.initialize();

      // Wait for the main view and pass in the router
      Router.initialize();

      // Below activate the splash screen when on IOS
      // TODO: Abstract native Apache Cordova code 
      if(navigator.splashscreen){
        navigator.splashscreen.hide();
      }
    });

    // Start up the outer view
    var mainView = new MainView();

    // Nasty hacks... This removes the toolbar from the iOS keyboard
    if(window.device !== undefined){
      if(device.platform == "iOS"){
        // toolbar.hide();
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // cordova.plugins.Keyboard.disableScroll();
        // Change webview background colour to white
        window.plugins.webviewcolor.change('#FFFFFF');
      }
    }

    // Add the status bar tap event for iOS, to scroll the page to the top
    // as users will expect 
    window.addEventListener("statusTap", function(){
      document.getElementsByClassName("page")[0].scrollTop = 0;
    });
    // Set up the iOS status bar (a pain...)
    // if(window.device!==undefined){
    //   if(device.platform == "iOS"){
    //     //make the status bar overlay the whole webview
    //     StatusBar.overlaysWebView(true);
    //     //give the status bar white text.. (can be modified at runtime if necessary)
    //     StatusBar.styleLightContent();
    //     // StatusBar.styleDefault();
    //     //remove the keyboard toolbar
    //     // toolbar.hide()
    //   }//end inner if
    // }
    // Some android phones don't like the animated class with native scrolling, so dump it...
    if(window.device !== undefined){
      if(device.platform == "Android"){
        $('.header, .footer').removeClass('animated bounceInUp bounceInDown');
        //TODO: Should also add the back button remove animate class for android
      }
    }
    // Update the background colour on resum because sometimes goes back to black
    $(document).on('npresume', function(){
      if(window.device !== undefined){
        if(device.platform == "iOS"){
          window.plugins.webviewcolor.change('#FFFFFF');
        }
      }
    });

    setTimeout(function(){mainView.createPageHeight();},2000);

    var initialScreenSize = window.innerHeight;
    window.addEventListener("resize", function() {
        if(window.innerHeight < initialScreenSize){
            $(".form_keyboard").css("padding-bottom", "240px");
        }else{
            $(".form_keyboard").css("padding-bottom", "0px");
        }
    });

  };
  return {
    initialize: initialize
  };
});
