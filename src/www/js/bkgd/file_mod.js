/**
* Handles file upload to remote service.
*
* @class FileMode
* @constructor
*/ 
define([
    "jquery"
],function($){
    "use strict";
    return{
        /**
        * Attempts to upload a file to the remote service.
        *
        * @method fileTransfer
        * @param {string} filePathUrl The path to the file to upload.
        * @param {string} serverUrl The URL of the service to upload the file to.
        * @param {function} fileSuccess The upload success callback.
        * @param {function} fileError The upload error callback.
        * @param {object} params The optional parameters for the upload.
        */
        fileTransfer: function(filePathUrl, serverUrl, fileSuccess, fileError, params){
            var ft = new FileTransfer();
            var options = new FileUploadOptions();
            options.params = params;
            ft.upload(filePathUrl, encodeURI(serverUrl), fileSuccess, fileError,options);
        }
    };//end of return
});