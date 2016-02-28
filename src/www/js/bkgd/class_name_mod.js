/**
* Responsible for adding class name flags to body of application DOM.
*
* @class ClassNameMod
* @constructor
*/ 
define([
    "jquery"
], function($){
    "use strict";
    return{
        /**
        * Adds the class name associated with the current platform to the
        * body of the DOM e.g. 'IOS' for the iOS platform.
        *
        * @method addStyle
        */
        addStyle: function(){
            if(window.device!==undefined){
                var platform, resPlatform;
                console.log('platform');
                platform = device.platform;
                switch(platform){
                    case "iOS":
                        resPlatform = "IOS";
                    break;
                    case "WinCE":
                        resPlatform = "WIN";
                    break;
                    case "Win32NT":
                        resPlatform = "WIN";
                    break;
                    case "Android":
                        resPlatform = "ANDROID";
                    break;
                    case "BlackBerry":
                        resPlatform = "BLACKBERRY";
                    break;
                    default:
                        resPlatform = "ANDROID";
                }//end of switch
                $('body').addClass(resPlatform);
            }
        }
    };// end return
});