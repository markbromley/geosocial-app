/**
* Represents the intial data transmission model for the application.
*
* @class InitModel
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone){
    "use strict";
    var InitModel = Backbone.Model.extend({
        defaults: {
            dev_cordova: null,
            dev_platform: null,
            dev_uuid: null,
            dev_model: null,
            dev_version: null,
            pref_lang: null,
            pref_lang_err: null,
            locale: null,
            locale_err: null,
            nav_platform: null,
            nav_ua: null
        }
    });
    return InitModel;
});