/**
* Handles globalisation services. Attempts to retrieve preferred language and
* locale.
*
* @class GlobMod
* @constructor
*/ 
define([
    "jquery",
    "underscore"
], function($, _){
    "use strict";
return{
        /**
        * Fired when preferred data language ready.
        *
        * @event globLanguageReady
        * @param {object} globResults The globResults object.
        */
        globLanguageReadyEvent: "globLangReady",

        /**
        * Fired when locale data available.
        *
        * @event globLocaleReady
        * @param {object} globResults The globResults object.
        */
        globLocaleReadyEvent: "globLoacaleReady",

        /**
        * Storage object for the result of the globalisation API.
        * 
        * @property globResults
        * @type {Object}
        */
        globResults: {},

        /**
        * Attempts to call the globalisation API and passes success/ error
        * callback as appropriate.
        *
        * @method initialize
        */
        initialize: function(){
            if(navigator.globalization !== undefined){
                navigator.globalization.getPreferredLanguage(
                    _.bind(this.prefLangSuccess,this),
                    _.bind(this.prefLangErr,this));
                navigator.globalization.getLocaleName(
                    _.bind(this.localeSuccess,this),
                    _.bind(this.localeErr,this));
            }
        },

        /**
        * Success callback for the preferred language. Fires the language
        * ready event.
        * 
        * @method prefLangSuccess
        * @param {object} language The language object returned by the
        *                 globalisation API.
        */
        prefLangSuccess: function(language){
            this.globResults = {
                pref_lang: language.value
            };
            this._fireGlobEvent(this.globLanguageReadyEvent);
        },

        /**
        * Error callback for the preferred language. Fires the language
        * ready event.
        * 
        * @method prefLangErr
        */
        prefLangErr: function(){
            this.globResults = {
                pref_lang_err: '1'
            };
            this._fireGlobEvent(this.globLanguageReadyEvent);
        },

        /**
        * Success callback for the locale data. Fires the locale ready event.
        * 
        * @method localeSuccess
        * @param {object} locale The locale object returned by the
        *                 globalisation API.
        */
        localeSuccess: function(locale){
            this.globResults = {
                locale: locale.value
            };
            this._fireGlobEvent(this.globLocaleReadyEvent);
        },

        /**
        * Error callback for the locale data. Fires the language
        * ready event.
        * 
        * @method localeErr
        */
        localeErr: function(){
            this.globResults = {
                locale_err: '1'
            };
            this._fireGlobEvent(this.globLocaleReadyEvent);
        },
        _fireGlobEvent: function(event){
            $(document).trigger(event, [this.globResults]);
        }
    };//end of return
});