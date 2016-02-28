/**
* Series of wrapper functions to abstract the current URL from code as much 
* as possible, client should only be handling the sections outlined below, 
* outside of this module:
*   - Segments i.e. /hello/world
*   - Hashes i.e. #ahash
*   - To be enumerated and abstracted further at a later date...
*
* @class UrlHandle
* @constructor
*/ 
define([
'js/bkgd/local_storage_mod'
], function(perStore){
    "use strict";
    return{

        // Private vars
        _baseUrl: "http://192.168.0.8:8080",
        _accessTokenId: "token",
        _killCode : "kill",

        /**
        * Returns the token from the URL.
        *
        * @method getUrlToken
        * @return The token from the URL.
        */
        getUrlToken: function(){
            return perStore.getItem(this._accessTokenId);
        },

        /**
        * Adds options (e.g. access token) to URL.
        *
        * @method appendUrlOptions
        * @param {string} url The URL to append to.
        * @return The URL with appended options
        */
        appendUrlOptions: function(url){
            var options = '?access_token=' + perStore.getItem(this._accessTokenId);
            return url + options;
        },

        /**
        * Stores the supplied token in permanent storage.
        *
        * @method addUrlTokenToStorage
        * @param {string} token The token to store.
        */
        addUrlTokenToStorage: function(token){
            perStore.setItem(this._accessTokenId, token);
        },

        /**
        * Destroys the access token. Removes from permanent storage.
        *
        * @method destroyToken
        */
        destroyToken: function(){
            perStore.removeItem(this._accessTokenId);
        },

        /**
        * Checks if an access token exists.
        *
        * @method checkTokenExists
        * @return True if the access token exists in permanent storage.
        */
        checkTokenExists: function(){
            return perStore.checkItemExists(this._accessTokenId);
        },

        /**
        * Gets the base URL of the service.
        * @method getBaseUrl
        * @return The base URL of the service.
        */
        getBaseUrl: function(){
            return this._baseUrl;
        },

        /**
        * Takes a URL segment (e.g. /hello/world) and returns full URL to service.
        * 
        * @method createUrlFromSegment
        * @param {string} segment The URL segment to append.
        * @return The full URL to service with segment appended.
        */
        createUrlFromSegment: function(segment){
            var base = this.getBaseUrl();
            var url = base + segment;
            return url;
        },

        /**
        * Takes a URL segment (e.g. /hello/world) and returns full URL to 
        * service including URL options (e.g. access token etc.).
        *
        * @method createUrlFromSegmentWithOptions
        * @param {string} segment The URL segment to append.
        * @return The full URL to service with segment and options appended.
        */
        createUrlFromSegmentWithOptions: function(segment){
            var base = this.getBaseUrl();
            var url = base + segment;
            var urlWithOptions = this.appendUrlOptions(url);
            return urlWithOptions;
        },

        /**
        * Changes the hash of the current URL to the supplied value.
        *
        * @method changeUrlHash
        * @param {string} hash The hash to change to.
        */
        changeUrlHash: function(hash){
            if(!perStore.checkItemExists(this._killCode)){
                window.location.hash = hash;
            }
        },

        /**
        * Changes the hash of the current URL to the supplied value, without
        * updating the history stack.
        *
        * @method changeUrlWithoutUpdatingHistory
        * @param {string} hash The hash to change to.
        */
        changeUrlWithoutUpdatingHistory: function(hash){
            window.location.replace(hash);
        },

        /**
        * Returns the hash of the current URL.
        *
        * @method getUrlHash
        * @return  The hash of the current URL.
        */
        getUrlHash: function(){
            return window.location.hash;
        },

        /**
        * Changes the URL to the value used 'n' pages ago.
        *
        * @method goBackN
        * @param {number} n The number of pages to go back through history.
        */
        goBackN: function(n){
            n = n || 1;
            for(var i = 0;i <n; i++){
                history.back();
            }
        },

        /**
        * Reloads the whole page.
        *
        * @method reloadEntirePage
        */
        reloadEntirePage: function(){
            window.location.reload();
        }
    };//end of return
});