/**
* Error View. Displays error messages as a full view. Message displayed
* based on option ID.
*
* @class ErrorView
* @constructor
*/ 
define([
    "jquery",
    "underscore",
    "backbone",
    "text!tmpl/error_page.html",
    "js/collections/error_collection"
], function($, _, Backbone, errorTemplate, ErrorCollection){
    "use strict";
        var ErrorView = Backbone.View.extend({
            template: _.template(errorTemplate),
            errors: [
                {"id": "1", "error_name": "404 - That's an error.", "description": "Mother can't provide the information you requested. Mother knows best.", "error_symbol" : "poop.svg", "show_dismiss":"true", "show_spin":"false"},
                {"id": "2", "error_name": "Offline", "description": "Sorry, this device has gone offline. Make sure you aren't stood near tall buildings, are in a remote location or have Wifi switched off.", "error_symbol" : "flash-off.svg", "show_dismiss": "true", "show_spin":"false"},
                {"id": "3", "error_name": "Low Battery", "description":"Your battery is low. This app is reducing power consumption to preserve your battery life. This may cause location accuracy to be reduced. To conserve power you should reduce screen brightness and disable services you aren't using, such as bluetooth.", "error_symbol" :"battery-low.svg", "show_dismiss":"true", "show_spin":"false"},
                {"id": "4", "error_name" : "Location Access Denied", "description": "You haven't allowed access to your device's location. Without this, this App will not work, please allow access by visiting your settings. Waiting for access.", "error_symbol" : "thumbs-down.svg", "show_dismiss": "false", "show_spin":"true"},
                {"id": "5", "error_name" : "Location Error", "description": "Your phone is having trouble determining your location. You can help reduce this problem, by switching WiFi on, standing away from tall buildings and finding good signal strength. Waiting for signal.", "error_symbol" : "alert.svg", "show_dismiss": "false", "show_spin":"true"},
                {"id": "6", "error_name" : "Location Out of Date", "description": "Your phone hasn't updated your location recently. Ensure Location is enabled for this App in settings. You can help reduce this problem, by switching WiFi on, standing away from tall buildings and finding good signal strength. Waiting for location data.", "error_symbol" : "timer.svg", "show_dismiss": "false", "show_spin":"true"}
            ],

            /**
            * Creates a new error collection and initialise view.
            *
            * @method initialize
            */
            initialize: function(){
                this.collection = new ErrorCollection(this.errors);
                this.render();
            },

            /**
            * Renders the template for the view.
            *
            * @method render
            */
            render: function(){
                var error = this.collection.get(this.options.id);
                this.$el.html(this.template(error.toJSON()));
                return this;
            }
        });
        return ErrorView;
});