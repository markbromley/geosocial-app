/**
* Wrapper for the notification API. Provides alert and confirmation APIs
* across platforms.
*
* @class NotifyMod
* @constructor
*/ 
define([
"jquery"
], function($){
    "use strict";
    return{
        // Private vars
        _soundDurationMs: 2500,
        _vibrateDurationMs: 2500,
        /**
        * Provides alert functionality across platform e.g. replicates alert()
        * function in browser.
        *
        * @method showAlert
        * @param message The message to display in the alert.
        * @param {function} alertCallback A callback for once the alert has 
        *        been dismissed.
        * @param {string} title The title of the alert.
        * @param {string} buttonName The name of the button to display on the alert.
        * @param {boolean} vibrate Flag to indicate if the alert should cause
        *        device to vibrate.
        * @param {boolean} beep Flag to indicate if the alert should cause 
        *        device to make a noise.
        */
        showAlert: function(message, alertCallback, title, buttonName, vibrate, beep){
            if (navigator.notification){
                navigator.notification.alert(message, alertCallback, 
                    title, buttonName);
                // TODO: This causes a crash! Investigate.
                // if (beep){
                //     navigator.notification.beep(this._soundDurationMs);
                // }
                // if (vibrate){
                //   navigator.notification.vibrate(this._vibrateDurationMs);
                // }
            }else{
                alert(message);
                alertCallback();
            }
        },
        /**
        * Provides a confirmation dialog across platform e.g. Question with
        * yes/ no options.
        *
        * @method showConfirm
        * @param {string} message The message to display in the confirmation.
        * @param {function} confirmCallback A callback with the index of the
        *        selected option.
        * @param {string} title The title for the confirmation dialog.
        * @param {array} buttonLabels A list of button names (strings).
        * @param {boolean} vibrate Flag to indicate if the device should 
        *        cause device to vibrate.
        * @param {boolean} beep Flag to indicate if the confirmation should
        *        cause the device to make a noise.
        */
        showConfirm: function(message, confirmCallback, title, buttonLabels, vibrate, beep){
            if(navigator.notification){
                navigator.notification.confirm(message, confirmCallback, 
                    title, buttonLabels);
                if (beep){
                    navigator.notification.beep(this._soundDurationMs);
                }
                if (vibrate){
                    navigator.notification.vibrate(this._vibrateDurationMs);
                }
            }else{
                var r = confirm(message);
                if (r===true){
                    // Returns -1 if true. Therefore callback should always 
                    // check for this and alternate acceptance value.
                    confirmCallback(-1);
                }
            }
        }
    };//end of return value
});