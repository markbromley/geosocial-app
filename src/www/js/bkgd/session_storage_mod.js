/**
* Wrapper for the session storage API. Provides basic functionality for
* storing data for the duration of a single application session.
*
* @class SessionStorageMode
* @constructor
*/ 
define([
"jquery"
], function($){
    "use strict";
    return{
        // Perhaps in future, provide alternate method under hood using just 
        // memmory when local storage not available? i.e. in-mem object

        // Private vars
        _tmpStore: window.sessionStorage,

        /**
        * Gets the item specified by the given key.
        *
        * @method getItem
        * @param {string} key The key of the item to lookup.
        */
        getItem: function(key){
            return this._tmpStore.getItem(key);
        },

        /**
        * Stores a value in session storage, with the specified key.
        *
        * @method setItem
        * @param {string} key The unique key for the item.
        * @param {string} value The item value.
        */
        setItem: function(key, value){
            return this._tmpStore.setItem(key, value);
        },

        /**
        * Checks if a key already exists in session storage.
        *
        * @method checkItemExists
        * @param {string} key The key to check.
        */
        checkItemExists: function(key){
            var tmpVal = this._tmpStore.getItem(key);
            if(tmpVal){
                return true;
            }else{
                return false;
            }//end if
        },

        /**
        * Removes an item with the specified key from session storage.
        *
        * @method removeItem
        * @param {string} key The key of the item to remove.
        */
        removeItem: function(key){
            this._tmpStore.removeItem(key);
        },

        /**
        * Clears all key/ value pairs from session storage.
        *
        * @method clear
        */
        clear: function(){
            this._tmpStore.clear();
        }
    };//end of return
});