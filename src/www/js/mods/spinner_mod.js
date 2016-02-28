/**
* Controls the application spinner. Allows showing and hiding.
*
* @class Spinner
* @constructor
*/
define([
"jquery"
], function($){
    "use strict";
    return{
        // Private vars
        _spinnerClass: ".spinner",
        _parentContainerClass: "#app_container",
        _spinnerHtml : "<div class='spinner'><span></span></div>",

        /**
        * Shows the applicaiton spinner
        *
        * @method showSpinner
        */
        showSpinner: function(){
            $(this._parentContainerClass).append(this._spinnerHtml);
        },

        /**
        * Hides the application spinner.
        *
        * @method hideSpinner
        */
        hideSpinner: function(){
            $(this._spinnerClass).unbind().remove();
        }
    };//end of return value
});