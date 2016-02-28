/**
* Provides access to the camera. Allowing photos to be accessed from the native
* device.
*
* @class Camera
* @constructor
*/
define([
    "jquery",
    "js/mods/error_mod"
], function($, ErrorBar){
    "use strict";
    return{
        /**
        * Requests access to device pictures (e.g. camera or photo library).
        * Accepts callbacks for successful retrieval or error.
        *
        * @method getPicture
        * @param {function} cameraSuccess Success callback.
        * @param {function} cameraSuccess Success callback.
        * @param {string} sourceType The source type to use e.g. camera/ photos.
        */
        getPicture: function(cameraSuccess, cameraError, sourceType){
            if(navigator.camera){
                if(sourceType==="CAMERA"){
                    navigator.camera.getPicture(cameraSuccess, cameraError,{
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: true,
                            mediaType: Camera.MediaType.PICTURE,
                            saveToPhotoAlbum: false 
                        });          
                }else{
                    navigator.camera.getPicture(cameraSuccess, cameraError,{
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            allowEdit: true,
                            mediaType: Camera.MediaType.PICTURE,
                            saveToPhotoAlbum: false 
                        });   
                }//end of inner if
            }else{
                ErrorBar.showError("Sorry, we can't access the camera on this device.");
            }
        },

        /**
        * iOS only function. Attempts to cleanup pictures after picture operation.
        * 
        * @method cleanupPictures
        */
        cleanupPictures: function(){
            //function applies to iOS only
            if(navigator.camera){
                navigator.camera.cleanup(
                    function(){
                        console.log('Camera cleanup success.');
                    }, function(message){
                        console.log('Camera cleanup failed because' + message + '.') ;
                    }
                    );
            }
        }
    };//end of return value
});