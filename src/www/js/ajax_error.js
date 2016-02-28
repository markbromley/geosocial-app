/**
* Handles ajax errors e.g. connection errors, bad requests etc.
*
* @class AjaxError
* @constructor
*/ 
define([
    "js/url_handle",
    "js/bkgd/local_storage_mod"
], function(urlHandle, perStore){
    "use strict";
    return{
        // Private vars
        _remoteKillHash: "#remote_kill",
        _forceLogoutHash: "#forceLogout",
        _errorNotFoundHash: "#error/1",
        _errorLocationDenied: "#error/4",
        _errorStaleData: "#error/6",
        _loginHash: "#login",
        _signupOneHash: "#signup_one",
        _signupTwohash: "#signup_two",
        _signupTermsHash: "#info/1",

        _killCode: "kill",

        //Below is used in sign up page two view and geoMod module
        // -brittle.. should be abstracted as constant
        locErr: 'location_error',

        /**
        * Error callback for get request.
        *
        * @method fetchError
        * @param {object} model The model.
        * @param {object} xhr The XHR object.
        * @param {object} options The options object. 
        */
        fetchError: function(model, xhr, options){
            this._generalStatusCheck(xhr.status);
        },

        /**
        * Error callback for post request.
        *
        * @method postError
        * @param {object} data The data object.
        * @param {object} textStatus The textStatus object.
        * @param {object} jqXhr The XHR object.
        */
        postError: function(data, textStatus, jqXhr){
            this._generalStatusCheck(data.status);
        },

        /**
        * Error callback for create request.
        *
        * @method createError
        * @param {object} err The error object.
        * @param {object} response The response object.
        */
        createError: function(err, response){
            this._generalStatusCheck(response.status);
        },
        /**
        * Called for any ajax error not handled specifically.
        *
        * @method generalError
        * @param errNum The error enum associated with the error (see error_view)
        */
        generalError: function(errNum){
            var currentUrl = urlHandle.getUrlHash();
            if(this._isNotSignUpPage(currentUrl)){
                urlHandle.changeUrlHash('#error/' + errNum);
            }
        },
        _generalStatusCheck: function(status){
            if(status == 401)
            {
                this._generalForceLogout();
            }
            else if(status == 402)
            {
                this._locationStaleWait();
            }
            else if(status == 400)
            {
                console.log("Error 400.");
            }
            else if(status == 404)
            {
                urlHandle.changeUrlHash(this._errorNotFoundHash);
            }
            else if(status == 403)
            {
                urlHandle.changeUrlHash(this._remoteKillHash);
                perStore.setItem(this._killCode, "true");
            }
        },
        _locationStaleWait: function(){
            urlHandle.changeUrlHash(this._errorStaleData);
            perStore.setItem(this.locErr, "true");
        },
        _isNotSignUpPage: function(url){
            if(url != this._loginHash && 
                url != this._signupOneHash &&
                url != this._forceLogoutHash &&
                url != this._signupTermsHash &&
                url != this._signupTwohash){
                return true;
            }else{
                return false;
            }
        },
        _generalForceLogout: function(){
            var currentUrl = urlHandle.getUrlHash();
            if(this._isNotSignUpPage(currentUrl) && 
                currentUrl != this._errorLocationDenied){
                urlHandle.changeUrlHash(this._forceLogoutHash);
            }
        }
    };//end of return
});