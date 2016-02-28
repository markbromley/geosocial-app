/**
* Represents the live data model for the application.
*
* @class LiveModel
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone){
    "use strict";
        var LoopModel = Backbone.Model.extend({
            defaults: {
                latitude: null,
                longitude: null,
                altitude: null,
                accuracy: null,
                altitude_accuracy: null,
                heading: null,
                speed: null,
                timestamp: null,
                geo_error_code: null,
                geo_error_message: null,
                comp_heading: null,
                comp_error_code: null,
                connection: null
            }
        });
        return LoopModel;
});