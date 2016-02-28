/**
* Wraps the connection API.
* Fires success event on successful connection type identification.
*
* @class ConnectionMod
* @constructor
*/ 
define([
    "jquery"
], function($){
    "use strict";
    return{
        /**
        * Fired when connection type data is available.
        *
        * @event connReady
        * @param {object} connResult The connResult object.
        */
        connectionReadyEvent: "connReady",

        /**
        * Storage object for the result of the navigator connection API.
        * 
        * @property connResult
        * @type {Object}
        */
        connResult:{},

        /**
        * Attempts to access connection type data and fires success event
        * if possible.
        *
        * @method initialize
        */
        initialize: function(){
            if (navigator.connection){
                this.connResult ={
                    connection: navigator.connection.type
                };
                $(document).trigger(
                    this.connectionReadyEvent, [this.connResult]);
            }
        }
    };//end of return value
});