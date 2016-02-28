/**
* Local storage wrapper class. Provides basic wrapper to underlying local
* storage layer. Perhaps in future, provide alternate method under hood using
* just memory when local storage not available? i.e. in-mem object.
*
* @class LocalStorageMod
* @constructor
*/ 
define([
'jquery'
], function($){
    "use strict";
    return{
        // Private vars
        _perStore: window.localStorage,

        /**
        * Gets the associate value to the key provided from the permanent
        * storage.
        *
        * @method getItem
        * @param {string} key The key to lookup.
        * @return The value associated with the lookup key.
        */
        getItem: function(key){
            return this._perStore.getItem(key);
        },

        /**
        * Sets the key/ value pair in permanent storage.
        *
        * @method SetItem
        * @param {string} key The lookup key.
        * @param {string} value The associated value.
        * @return {boolean} True if success.
        */
        setItem: function(key, value){
            return this._perStore.setItem(key, value);
        },

        /**
        * Checks to see if a key already exists in local storage. Returns t
        *
        * @method getItem
        * @param {string} key The key to lookup.
        * @return True if the provided key exists.
        */
        checkItemExists: function(key){
            var tmpVal = this._perStore.getItem(key);
            if(tmpVal){
                return true;
            }else{
                return false;
            }
        },

        /**
        * Removes the key/ value pair specified by the given key from permanent
        * storage.
        *
        * @method removeItem
        * @param {string} key The key of the pair to remove.
        */
        removeItem: function(key){
            this._perStore.removeItem(key);
        },

        /*
        * Removes all values from permanent storage.
        *
        * @method clear
        */
        clear: function(){
            this._perStore.clear();
        }
    };//end of return
});